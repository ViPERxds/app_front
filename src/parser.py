from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import chromedriver_binary
import time
import json
import random
import re
from deep_translator import GoogleTranslator

class LiveTVParser:
    def __init__(self):
        self.options = webdriver.ChromeOptions()
        # Добавляем опции для обхода обнаружения автоматизации
        self.options.add_argument('--disable-blink-features=AutomationControlled')
        self.options.add_argument('--start-maximized')
        self.options.add_experimental_option("excludeSwitches", ["enable-automation"])
        self.options.add_experimental_option('useAutomationExtension', False)
        # Добавляем дополнительные опции для стабильности
        self.options.add_argument('--no-sandbox')
        self.options.add_argument('--disable-dev-shm-usage')
        # Игнорируем ошибки сертификатов
        self.options.add_argument('--ignore-certificate-errors')
        self.options.add_argument('--ignore-ssl-errors')
        self.options.add_argument('--allow-insecure-localhost')
        self.options.add_argument('--disable-web-security')
        # Включаем headless режим
        self.options.add_argument('--headless=new')
        self.options.add_argument('--disable-gpu')
        self.options.add_argument('--window-size=1920,1080')
        # Добавляем user-agent
        self.options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36')
        self.driver = None
        
        # Инициализируем два переводчика: один для английского->русский, другой для русский->английский
        self.en_to_ru_translator = GoogleTranslator(source='en', target='ru')
        self.ru_to_en_translator = GoogleTranslator(source='ru', target='en')
        self._translation_cache = {}  # Кэш для хранения переводов

    def start_browser(self):
        try:
            self.driver = webdriver.Chrome(options=self.options)
            # Обходим обнаружение автоматизации
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            # Устанавливаем размер окна
            self.driver.set_window_size(1920, 1080)
            # Устанавливаем обработчик для принятия небезопасных сертификатов
            self.driver.execute_cdp_cmd('Security.setIgnoreCertificateErrors', {'ignore': True})
        except Exception as e:
            print(f"Ошибка при запуске браузера: {str(e)}")
            print("Убедитесь, что Google Chrome установлен в системе")
            raise

    def close_browser(self):
        """Закрывает браузер"""
        if self.driver:
            try:
                self.driver.quit()
            except Exception as e:
                print(f"Ошибка при закрытии браузера: {str(e)}")
            finally:
                self.driver = None

    def handle_security_warnings(self):
        """Обрабатывает предупреждения безопасности на странице"""
        try:
            # Ищем кнопку "Подробнее"
            details_buttons = self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Подробнее')]")
            if not details_buttons:
                details_buttons = self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Advanced')]")
            if details_buttons:
                details_buttons[0].click()
                self.random_delay(0.5, 1)

            # Ищем ссылку для продолжения
            proceed_links = self.driver.find_elements(By.XPATH, "//a[contains(text(), 'Перейти на сайт')]")
            if not proceed_links:
                proceed_links = self.driver.find_elements(By.XPATH, "//a[contains(text(), 'Proceed to')]")
            if proceed_links:
                proceed_links[0].click()
                self.random_delay(0.5, 1)

            # Дополнительная проверка для других вариантов текста
            proceed_links = self.driver.find_elements(By.XPATH, "//a[contains(@id, 'proceed-link')]")
            if proceed_links:
                proceed_links[0].click()
                self.random_delay(0.5, 1)

        except Exception as e:
            print(f"Ошибка при обработке предупреждений безопасности: {str(e)}")

    def translate_team_name(self, team_name):
        """Переводит название команды с учетом языка оригинала"""
        # Проверяем кэш
        if team_name in self._translation_cache:
            return self._translation_cache[team_name]

        try:
            # Определяем, содержит ли текст русские буквы
            has_cyrillic = bool(re.search('[а-яА-Я]', team_name))
            
            # Нормализуем название (убираем лишние пробелы и т.д.)
            normalized_name = self.normalize_team_name(team_name)
            
            if has_cyrillic:
                # Если текст на русском, переводим на английский
                translated_name = self.ru_to_en_translator.translate(text=normalized_name)
            else:
                # Если текст на английском, переводим на русский
                translated_name = self.en_to_ru_translator.translate(text=normalized_name)
            
            # Нормализуем результат
            translated_name = self.normalize_team_name(translated_name)
            
            # Сохраняем в кэш оба варианта
            self._translation_cache[team_name] = translated_name
            self._translation_cache[translated_name] = team_name
            
            print(f"Перевод: {team_name} -> {translated_name}")
            return translated_name
        except Exception as e:
            print(f"Ошибка при переводе {team_name}: {str(e)}")
            return team_name

    def normalize_team_name(self, name):
        """
        Нормализует название команды:
        - переводит в нижний регистр
        - заменяет все виды тире и дефисов на пробел
        - убирает лишние пробелы
        - заменяет ё на е
        """
        if not name:
            return ""
            
        # Переводим в нижний регистр
        name = name.lower()
        
        # Заменяем ё на е
        name = name.replace('ё', 'е')
        
        # Заменяем все виды тире/дефисов на пробел
        name = name.replace('-', ' ')  # обычный дефис
        name = name.replace('–', ' ')  # en dash
        name = name.replace('—', ' ')  # em dash
        name = name.replace('−', ' ')  # минус
        
        # Убираем множественные пробелы
        name = ' '.join(name.split())
        
        return name

    def get_team_variations(self, team_name):
        """Получает все возможные варианты названия команды"""
        variations = set()
        
        # Добавляем оригинальное название
        normalized_name = self.normalize_team_name(team_name)
        variations.add(normalized_name)
        
        # Добавляем переведенную версию
        translated_name = self.translate_team_name(team_name)
        variations.add(self.normalize_team_name(translated_name))
        
        return list(variations)

    def levenshtein_distance(self, s1, s2):
        """
        Вычисляет расстояние Левенштейна между двумя строками
        """
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
        """
        Проверяет, похожи ли строки, используя расстояние Левенштейна
        threshold: порог схожести (0-1), где 1 - полное совпадение
        """
        if not s1 or not s2:
            return False
            
        # Если строки короткие, используем более строгий порог
        if len(s1) <= 5 or len(s2) <= 5:
            threshold = 0.9
            
        # Вычисляем расстояние Левенштейна
        distance = self.levenshtein_distance(s1, s2)
        
        # Вычисляем схожесть как процент от максимально возможного расстояния
        max_length = max(len(s1), len(s2))
        similarity = 1 - (distance / max_length)
        
        return similarity >= threshold

    def teams_match(self, text, team1, team2):
        """
        Проверяет, соответствует ли текст ссылки командам матча
        Возвращает True если найдена хотя бы одна команда
        """
        if not text:
            return False
            
        # Нормализуем текст ссылки
        normalized_text = self.normalize_team_name(text)
        print(f"Нормализованный текст: {normalized_text}")
        
        # Получаем все возможные варианты названий команд
        team1_variations = self.get_team_variations(team1)
        team2_variations = self.get_team_variations(team2)
        
        # Нормализуем все варианты названий
        team1_variations = [self.normalize_team_name(t) for t in team1_variations if t]
        team2_variations = [self.normalize_team_name(t) for t in team2_variations if t]
        
        print(f"Варианты для команды 1: {team1_variations}")
        print(f"Варианты для команды 2: {team2_variations}")
        
        # Разбиваем текст на слова для поиска частичных совпадений
        text_words = normalized_text.split()
        
        # Проверяем каждый вариант названия первой команды
        for team1_var in team1_variations:
            if not team1_var:
                continue
                
            # Проверяем точное совпадение
            if team1_var in normalized_text:
                print(f"Найдено точное совпадение для команды 1: {team1_var}")
                return True
                
            # Проверяем похожие слова
            team1_words = team1_var.split()
            for team_word in team1_words:
                if len(team_word) <= 3:  # Пропускаем короткие слова
                    continue
                for text_word in text_words:
                    if len(text_word) <= 3:  # Пропускаем короткие слова
                        continue
                    if self.strings_are_similar(team_word, text_word):
                        print(f"Найдено похожее слово для команды 1: {team_word} ≈ {text_word}")
                        return True
                
        # Проверяем каждый вариант названия второй команды
        for team2_var in team2_variations:
            if not team2_var:
                continue
                
            # Проверяем точное совпадение
            if team2_var in normalized_text:
                print(f"Найдено точное совпадение для команды 2: {team2_var}")
                return True
                
            # Проверяем похожие слова
            team2_words = team2_var.split()
            for team_word in team2_words:
                if len(team_word) <= 3:  # Пропускаем короткие слова
                    continue
                for text_word in text_words:
                    if len(text_word) <= 3:  # Пропускаем короткие слова
                        continue
                    if self.strings_are_similar(team_word, text_word):
                        print(f"Найдено похожее слово для команды 2: {team_word} ≈ {text_word}")
                        return True
                
        return False

    def random_delay(self, min_delay=1, max_delay=3):
        """Случайная задержка для имитации человеческого поведения"""
        time.sleep(random.uniform(min_delay, max_delay))

    def scroll_page(self):
        """Прокручивает страницу до конца"""
        last_height = self.driver.execute_script("return document.body.scrollHeight")
        while True:
            # Прокручиваем до конца
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            # Ждем загрузки страницы
            self.random_delay(0.5, 1)
            # Вычисляем новую высоту прокрутки и сравниваем с последней
            new_height = self.driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

    def extract_video_url(self, page_url, width=960, height=540):
        """
        Открывает страницу видеоплеера, извлекает id из параметра c и формирует ссылку на emb.apl375.me
        width, height — желаемые размеры плеера
        """
        import re
        try:
            self.driver.get(page_url)
            self.random_delay(2, 3)
            self.handle_security_warnings()

            # Получаем текущий URL (на случай редиректа)
            current_url = self.driver.current_url
            print(f'Текущий URL видеоплеера: {current_url}')

            # Ищем параметр c=ID
            match = re.search(r'[?&]c=(\d+)', current_url)
            if match:
                match_id = match.group(1)
                stream_url = f'//emb.apl375.me/player/live.php?id={match_id}&w={width}&h={height}'
                print(f'Сформированная ссылка на трансляцию: {stream_url}')
                return stream_url
            else:
                print('Не удалось найти id матча в URL видеоплеера')
                return None
        except Exception as e:
            print(f'Ошибка при извлечении URL видео: {str(e)}')
            return None

    def find_stream_link(self, match_page_url, width=960, height=540):
        """
        Находит ссылку на трансляцию матча: открывает первую ссылку <a> с 'webplayer' в href,
        затем формирует ссылку на emb.apl375.me по id из параметра c в URL видеоплеера.
        width, height — желаемые размеры плеера
        """
        try:
            self.driver.get(match_page_url)
            self.random_delay(1, 2)
            self.handle_security_warnings()
            self.scroll_page()

            all_links = self.driver.find_elements(By.TAG_NAME, 'a')
            print(f'Всего найдено ссылок на странице матча: {len(all_links)}')

            # Ищем первую ссылку на webplayer
            for link in all_links:
                href = link.get_attribute('href') or ''
                if 'webplayer' in href:
                    # Приводим к абсолютному URL, если нужно
                    if href.startswith('//'):
                        href = 'https:' + href
                    print(f'Открываем ссылку на webplayer: {href}')
                    return self.extract_video_url(href, width=width, height=height)
            print('Не найдено ссылок на webplayer')
            return None
        except Exception as e:
            print(f'Ошибка при поиске ссылки на трансляцию: {str(e)}')
            return None

    def get_stream_links(self, match_info):
        """
        Получает ссылки на трансляции для конкретного матча
        match_info: словарь с информацией о матче (команды, время и т.д.)
        """
        try:
            # Открываем главную страницу
            self.driver.get('https://livetv.sx/allupcoming/')
            self.random_delay(1, 2)

            # Обрабатываем предупреждения безопасности
            self.handle_security_warnings()

            # Прокручиваем страницу для загрузки всего контента
            self.scroll_page()

            # Ищем все возможные ссылки на странице
            all_links = self.driver.find_elements(By.TAG_NAME, 'a')
            
            print(f"Ищем матч: {match_info['team1']} vs {match_info['team2']}")
            print(f"Всего найдено ссылок на странице: {len(all_links)}")
            print("Достаточно найти совпадение хотя бы с одной командой")

            from selenium.common.exceptions import StaleElementReferenceException

            for link in all_links:
                try:
                    link_text = link.text.strip()
                    link_href = link.get_attribute('href') or ''
                    if link_text:
                        print(f"\nПроверяем ссылку: {link_text}")
                        if self.teams_match(link_text, match_info['team1'], match_info['team2']):
                            print(f"Найден матч в ссылке: {link_text}")
                            print(f"URL матча: {link_href}")
                            stream_link = self.find_stream_link(link_href)
                            if stream_link:
                                print(f"Найдена ссылка на трансляцию: {stream_link}")
                                return stream_link
                            else:
                                print("Не удалось получить ссылку на трансляцию для этого матча")
                except StaleElementReferenceException:
                    print("Stale element, пропускаю ссылку...")
                    continue
                except Exception as e:
                    print(f"Ошибка при обработке ссылки: {str(e)}")
                    continue

            print("\nМатч не найден на странице")
            return None

        except Exception as e:
            print(f"Ошибка при поиске трансляции: {str(e)}")
            return None

def get_stream_links(matches):
    """
    Функция для использования в сервере Flask
    Принимает список матчей и возвращает словарь с ссылками на трансляции
    """
    parser = LiveTVParser()
    try:
        parser.start_browser()
        result = {}
        
        for match in matches:
            stream_link = parser.get_stream_links(match)
            if stream_link:
                result[f"{match['team1']} vs {match['team2']}"] = stream_link
        
        return result
    finally:
        parser.close_browser()

if __name__ == "__main__":
    # Тестовый код
    test_matches = [
        {
            'team1': 'Динамо-Минск',
            'team2': 'Лудогорец',
            'time': '21:45'
        }
    ]
    print(json.dumps(get_stream_links(test_matches), indent=2, ensure_ascii=False))