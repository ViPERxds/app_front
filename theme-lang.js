// Языковые переводы
const translations = {
    'ru': {
        'matches': 'Расписание матчей',
        'today': 'Сегодня',
        'football': 'Футбол',
        'hockey': 'Хоккей',
        'basketball': 'Баскетбол',
        'tennis': 'Теннис',
        'no-matches': 'Матчи пока не добавлены',
        'favorites': 'Избранное',
        'games': 'Матчи',
        'contests': 'Конкурсы',
        'prev-day': 'Предыдущий день',
        'next-day': 'Следующий день',
        'coming-soon': 'Скоро!',
        'no-favorites': 'В избранном пока ничего нет',
        'add-to-favorites': 'Добавляйте матчи в избранное, чтобы быстро находить их здесь',
        'live-broadcast': 'Прямая трансляция',
        'loading-stream': 'Загрузка трансляции...',
        'load-error': 'Ошибка при загрузке данных',
        'retry': 'Повторить',
        'match-stats-title': 'Статистика матча',
        'events': 'События',
        'possession': 'Владение мячом',
        'lineups': 'Составы',
        'form': 'Форма',
        'home-lineup': 'Состав хозяев',
        'away-lineup': 'Состав гостей',
        // Дни недели
        'Пн': 'Пн',
        'Вт': 'Вт',
        'Ср': 'Ср',
        'Чт': 'Чт',
        'Пт': 'Пт',
        'Сб': 'Сб',
        'Вс': 'Вс',
        // Английские дни для обратного перевода
        'Mon': 'Пн',
        'Tue': 'Вт',
        'Wed': 'Ср',
        'Thu': 'Чт',
        'Fri': 'Пт',
        'Sat': 'Сб',
        'Sun': 'Вс',
        // Кнопки матчей
        'watch-match': 'Смотреть матч',
        'scheduled-match': 'Запланирована трансляция',
        'match-stats': 'Статистика'
    },
    'en': {
        'matches': 'Match Schedule',
        'today': 'Today',
        'football': 'Football',
        'hockey': 'Hockey',
        'basketball': 'Basketball',
        'tennis': 'Tennis',
        'no-matches': 'No matches added yet',
        'favorites': 'Favorites',
        'games': 'Matches',
        'contests': 'Contests',
        'prev-day': 'Previous day',
        'next-day': 'Next day',
        'coming-soon': 'Coming Soon!',
        'no-favorites': 'No favorites yet',
        'add-to-favorites': 'Add matches to favorites to find them quickly here',
        'live-broadcast': 'Live Broadcast',
        'loading-stream': 'Loading stream...',
        'load-error': 'Error loading data',
        'retry': 'Retry',
        'match-stats-title': 'Match Statistics',
        'events': 'Events',
        'possession': 'Possession',
        'lineups': 'Lineups',
        'form': 'Form',
        'home-lineup': 'Home Lineup',
        'away-lineup': 'Away Lineup',
        // Дни недели
        'Пн': 'Mon',
        'Вт': 'Tue',
        'Ср': 'Wed',
        'Чт': 'Thu',
        'Пт': 'Fri',
        'Сб': 'Sat',
        'Вс': 'Sun',
        // Русские дни для обратного перевода
        'Mon': 'Mon',
        'Tue': 'Tue',
        'Wed': 'Wed',
        'Thu': 'Thu',
        'Fri': 'Fri',
        'Sat': 'Sat',
        'Sun': 'Sun',
        // Кнопки матчей
        'watch-match': 'Watch Match',
        'scheduled-match': 'Scheduled',
        'match-stats': 'Statistics'
    }
};

// Функция перевода дня недели
function translateDay(day, lang) {
    // Убираем возможные пробелы
    day = day.trim();
    
    // Проверяем есть ли прямой перевод
    if (translations[lang] && translations[lang][day]) {
        return translations[lang][day];
    }
    
    return day;
}

// Функция обновления языка
function updateLanguage(lang) {
    // Обновляем элементы с data-lang атрибутом
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Обновляем дни недели в кнопках дат
    document.querySelectorAll('.date-button div:first-child').forEach(element => {
        const dayText = element.textContent.trim();
        if (dayText === 'Сегодня' || dayText === 'Today') {
            element.textContent = translations[lang]['today'];
        } else {
            element.textContent = translateDay(dayText, lang);
        }
    });

    // Обновляем кнопки матчей
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Обновляем текст "Скоро!"
    const comingSoonButton = document.querySelector('.bottom-navigation button:last-child');
    if (comingSoonButton) {
        comingSoonButton.setAttribute('data-lang-content', translations[lang]['coming-soon']);
    }

    // Обновляем флаг языка
    const langFlag = document.getElementById('langFlag');
    if (langFlag) {
        langFlag.src = `ico/${lang}.png`;
        langFlag.alt = lang === 'ru' ? 'Русский' : 'English';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем сохраненный язык или устанавливаем русский по умолчанию
    const currentLang = localStorage.getItem('language') || 'ru';

    // Применяем настройки языка
    updateLanguage(currentLang);

    // Обработчик клика по флагу языка
    const langSwitch = document.querySelector('.language-switch');
    if (langSwitch) {
        langSwitch.addEventListener('click', function() {
            const currentLang = localStorage.getItem('language') || 'ru';
            const newLang = currentLang === 'ru' ? 'en' : 'ru';
            localStorage.setItem('language', newLang);
            updateLanguage(newLang);
        });
    }

    // Обработчик клика по иконке поддержки
    const helpIcon = document.querySelector('.help-icon');
    if (helpIcon) {
        helpIcon.addEventListener('click', function() {
            // Здесь можно добавить логику открытия формы поддержки
            alert('Форма поддержки будет добавлена позже');
        });
    }
}); 