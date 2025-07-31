import time
import random
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from deep_translator import GoogleTranslator

class StatParser:
    def __init__(self):
        self.options = webdriver.ChromeOptions()
        self.options.add_argument('--disable-blink-features=AutomationControlled')
        self.options.add_argument('--start-maximized')
        self.options.add_argument('--no-sandbox')
        self.options.add_argument('--disable-dev-shm-usage')
        self.options.add_argument('--ignore-certificate-errors')
        self.options.add_argument('--ignore-ssl-errors')
        self.options.add_argument('--allow-insecure-localhost')
        self.options.add_argument('--disable-web-security')
        self.options.add_argument('--headless=new')
        self.options.add_argument('--disable-gpu')
        self.options.add_argument('--window-size=1920,1080')
        self.options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36')
        self.driver = None
        self.en_to_ru_translator = GoogleTranslator(source='en', target='ru')
        self.ru_to_en_translator = GoogleTranslator(source='ru', target='en')
        self._translation_cache = {}

    def start_browser(self):
        self.driver = webdriver.Chrome(options=self.options)
        self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        self.driver.set_window_size(1920, 1080)
        self.driver.execute_cdp_cmd('Security.setIgnoreCertificateErrors', {'ignore': True})

    def close_browser(self):
        if self.driver:
            try:
                self.driver.quit()
            except Exception as e:
                print(f"Ошибка при закрытии браузера: {str(e)}")
            finally:
                self.driver = None

    def random_delay(self, min_delay=1, max_delay=2):
        time.sleep(random.uniform(min_delay, max_delay))

    def translate_team_name(self, team_name):
        if team_name in self._translation_cache:
            return self._translation_cache[team_name]
        try:
            has_cyrillic = bool(re.search('[а-яА-Я]', team_name))
            normalized_name = self.normalize_team_name(team_name)
            if has_cyrillic:
                translated_name = self.ru_to_en_translator.translate(text=normalized_name)
            else:
                translated_name = self.en_to_ru_translator.translate(text=normalized_name)
            translated_name = self.normalize_team_name(translated_name)
            self._translation_cache[team_name] = translated_name
            self._translation_cache[translated_name] = team_name
            return translated_name
        except Exception as e:
            print(f"Ошибка при переводе {team_name}: {str(e)}")
            return team_name

    def normalize_team_name(self, name):
        if not name:
            return ""
        name = name.lower().replace('ё', 'е')
        for dash in ['-', '–', '—', '−']:
            name = name.replace(dash, ' ')
        name = ' '.join(name.split())
        return name

    def levenshtein_distance(self, s1, s2):
        if len(s1) < len(s2):
            return self.levenshtein_distance(s2, s1)
        if len(s2) == 0:
            return len(s1)
        previous_row = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row
        return previous_row[-1]

    def strings_are_similar(self, s1, s2, threshold=0.85):
        if not s1 or not s2:
            return False
        if len(s1) <= 5 or len(s2) <= 5:
            threshold = 0.9
        distance = self.levenshtein_distance(s1, s2)
        max_length = max(len(s1), len(s2))
        similarity = 1 - (distance / max_length)
        return similarity >= threshold

    def get_team_variations(self, team_name):
        variations = set()
        normalized_name = self.normalize_team_name(team_name)
        variations.add(normalized_name)
        translated_name = self.translate_team_name(team_name)
        variations.add(self.normalize_team_name(translated_name))
        return list(variations)

    def teams_match(self, text, team1, team2):
        normalized_text = self.normalize_team_name(text)
        team1_variations = self.get_team_variations(team1)
        team2_variations = self.get_team_variations(team2)
        team1_variations = [self.normalize_team_name(t) for t in team1_variations if t]
        team2_variations = [self.normalize_team_name(t) for t in team2_variations if t]
        text_words = normalized_text.split()
        for team1_var in team1_variations:
            if not team1_var:
                continue
            if team1_var in normalized_text:
                return True
            team1_words = team1_var.split()
            for team_word in team1_words:
                if len(team_word) <= 3:
                    continue
                for text_word in text_words:
                    if len(text_word) <= 3:
                        continue
                    if self.strings_are_similar(team_word, text_word):
                        return True
        for team2_var in team2_variations:
            if not team2_var:
                continue
            if team2_var in normalized_text:
                return True
            team2_words = team2_var.split()
            for team_word in team2_words:
                if len(team_word) <= 3:
                    continue
                for text_word in text_words:
                    if len(text_word) <= 3:
                        continue
                    if self.strings_are_similar(team_word, text_word):
                        return True
        return False

    def find_match_link(self, date, team1, team2):
        url = f'https://www.championat.com/stat/#{date}'
        self.driver.get(url)
        self.random_delay(2, 3)
        links = self.driver.find_elements(By.TAG_NAME, 'a')
        for link in links:
            try:
                text = link.text.strip()
                href = link.get_attribute('href') or ''
                if text and self.teams_match(text, team1, team2):
                    print(f'Найден матч: {text} -> {href}')
                    return href
            except Exception as e:
                print(f'Ошибка при обработке ссылки: {str(e)}')
                continue
        print('Матч не найден на странице статистики')
        return None

    def parse_match_stats(self, match_url):
        self.driver.get(match_url)
        self.random_delay(2, 3)
        result = {}
        # Голы
        try:
            goals_header = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'Голы') or contains(text(), 'Goals')]")
            goals_block = goals_header.find_element(By.XPATH, './following-sibling::*[1]')
            result['goals'] = goals_block.get_attribute('outerHTML')
        except Exception as e:
            result['goals'] = None
        # Наказания
        try:
            cards_header = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'Наказания') or contains(text(), 'Cards') or contains(text(), 'Disciplinary')]")
            cards_block = cards_header.find_element(By.XPATH, './following-sibling::*[1]')
            result['cards'] = cards_block.get_attribute('outerHTML')
        except Exception as e:
            result['cards'] = None
        # Составы
        try:
            lineups_header = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'Составы') or contains(text(), 'Lineups')]")
            lineups_block = lineups_header.find_element(By.XPATH, './following-sibling::*[1]')
            result['lineups'] = lineups_block.get_attribute('outerHTML')
        except Exception as e:
            result['lineups'] = None
        # Статистика (владение мячом)
        try:
            stats_header = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'Статистика') or contains(text(), 'Statistics')]")
            stats_block = stats_header.find_element(By.XPATH, './following-sibling::*[1]')
            result['stats'] = stats_block.get_attribute('outerHTML')
        except Exception as e:
            result['stats'] = None
        return result

def get_match_stats(match_info):
    parser = StatParser()
    try:
        parser.start_browser()
        match_url = parser.find_match_link(match_info['date'], match_info['team1'], match_info['team2'])
        if not match_url:
            return {'error': 'Match not found'}
        stats = parser.parse_match_stats(match_url)
        return stats
    finally:
        parser.close_browser()

if __name__ == "__main__":
    test_match = {
        'team1': 'Кайрат',
        'team2': 'КуПС',
        'date': '2025-07-29'
    }
    import json
    print(json.dumps(get_match_stats(test_match), ensure_ascii=False, indent=2))