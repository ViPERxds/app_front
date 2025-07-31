// Добавляем глобальную переменную для отслеживания LIVE режима
let isLiveMode = false;

// Форматирование даты
function formatDate(date) {
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const day = days[date.getDay()];
    const dateNum = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return {
        dayName: day,
        fullDate: `${dateNum}.${month}`
    };
}

// Генерация дат
function generateDates(centerDate) {
    const dates = [];
    for (let i = -2; i <= 2; i++) {
        const date = new Date(centerDate);
        date.setDate(date.getDate() + i);
        dates.push(date);
    }
    return dates;
}

// Обновление DOM с учетом языка
function updateDates(dates, selectedDate) {
    const container = document.querySelector('.dates-scroll');
    container.innerHTML = '';

    const currentLang = localStorage.getItem('language') || 'ru';
    const translations = {
        'ru': { 'today': 'Сегодня' },
        'en': { 'today': 'Today' }
    };

    dates.forEach(date => {
        const formatted = formatDate(date);
        const isToday = date.toDateString() === new Date().toDateString();
        const isSelected = date.toDateString() === selectedDate.toDateString();
        
        const button = document.createElement('button');
        button.className = `date-button${isSelected ? ' active' : ''}`;
        button.innerHTML = `
            <div>${isToday ? translations[currentLang].today : formatted.dayName}</div>
            <div>${formatted.fullDate}</div>
        `;
        
        button.addEventListener('click', () => {
            document.querySelector('.date-button.active')?.classList.remove('active');
            button.classList.add('active');
            currentDate = date;
            // Обновляем даты с новым центром
            dates = generateDates(currentDate);
            updateDates(dates, currentDate);
            // Вызываем обновление матчей при смене даты
            SportsAPI.selectedDate = date.toISOString().split('T')[0];
            SportsAPI.fetchAllMatches();
            // Обновляем язык после обновления дат
            const updateLanguage = window.updateLanguage;
            if (typeof updateLanguage === 'function') {
                updateLanguage(currentLang);
            }
        });
        
        container.appendChild(button);
    });
}

// Инициализация
let currentDate = new Date();
let dates = generateDates(currentDate);
updateDates(dates, currentDate);

// Обработка кликов по стрелкам
document.querySelector('.nav-arrow.prev').addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 1);
    dates = generateDates(currentDate);
    updateDates(dates, currentDate);
    // Обновляем матчи при навигации
    SportsAPI.selectedDate = currentDate.toISOString().split('T')[0];
    SportsAPI.fetchAllMatches();
    // Обновляем язык после обновления дат
    const currentLang = localStorage.getItem('language') || 'ru';
    const updateLanguage = window.updateLanguage;
    if (typeof updateLanguage === 'function') {
        updateLanguage(currentLang);
    }
});

document.querySelector('.nav-arrow.next').addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 1);
    dates = generateDates(currentDate);
    updateDates(dates, currentDate);
    // Обновляем матчи при навигации
    SportsAPI.selectedDate = currentDate.toISOString().split('T')[0];
    SportsAPI.fetchAllMatches();
    // Обновляем язык после обновления дат
    const currentLang = localStorage.getItem('language') || 'ru';
    const updateLanguage = window.updateLanguage;
    if (typeof updateLanguage === 'function') {
        updateLanguage(currentLang);
    }
});

// Обработка кликов по иконкам видов спорта
document.querySelectorAll('.sport-icon').forEach(button => {
    button.addEventListener('click', function() {
        // Убираем активный класс у всех кнопок
        document.querySelectorAll('.sport-icon').forEach(btn => btn.classList.remove('active'));
        // Добавляем активный класс нажатой кнопке
        this.classList.add('active');
        
        // Определяем выбранный вид спорта
        const sport = this.getAttribute('data-sport');
        
        // Обновляем выбранный вид спорта и загружаем матчи
        SportsAPI.changeSport(sport);
    });
});

// Устанавливаем футбол как активный вид спорта по умолчанию
document.querySelector('.sport-icon[data-sport="football"]').classList.add('active');

// Обработка кликов по кнопкам навигации
document.querySelectorAll('.bottom-navigation button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.bottom-navigation button.active').classList.remove('active');
        button.classList.add('active');
    });
});

// Функция фильтрации LIVE матчей
function filterLiveMatches() {
    if (!isLiveMode) {
        // Если LIVE режим выключен, показываем все
        document.querySelectorAll('.league-item').forEach(league => {
            league.style.display = 'block';
            league.querySelectorAll('.match-item').forEach(match => {
                match.style.display = 'block';
            });
        });
        return;
    }

    // Если LIVE режим включен
    document.querySelectorAll('.league-item').forEach(league => {
        const liveMatches = league.querySelectorAll('.watch-button.live');
        if (liveMatches.length > 0) {
            // Если есть LIVE матчи, показываем лигу
            league.style.display = 'block';
            // Показываем только LIVE матчи
            league.querySelectorAll('.match-item').forEach(match => {
                const hasLiveButton = match.querySelector('.watch-button.live');
                match.style.display = hasLiveButton ? 'block' : 'none';
            });
        } else {
            // Если нет LIVE матчей, скрываем всю лигу
            league.style.display = 'none';
        }
    });

    // Обновляем счетчики матчей
    document.querySelectorAll('.league-item').forEach(league => {
        const visibleMatches = league.querySelectorAll('.match-item[style="display: block;"]');
        const countElement = league.querySelector('.match-count');
        if (countElement) {
            countElement.textContent = visibleMatches.length;
        }
    });
}

// Обработка клика по переключателю LIVE
document.querySelector('.live-toggle').addEventListener('click', function() {
    this.classList.toggle('active');
    isLiveMode = this.classList.contains('active');
    filterLiveMatches();
});

document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для переключателя темы
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            // Здесь можно добавить логику для реального переключения темы
        });
    }

    // Обработчик для выбора языка
    const languageItem = document.querySelector('.settings-item:first-child');
    if (languageItem) {
        languageItem.addEventListener('click', function() {
            // Здесь можно добавить логику для выбора языка
            console.log('Открыть выбор языка');
        });
    }

    // Обработчик для сообщения о проблеме
    const supportItem = document.querySelector('.settings-item:last-child');
    if (supportItem) {
        supportItem.addEventListener('click', function() {
            // Здесь можно добавить логику для отправки сообщения о проблеме
            console.log('Открыть форму поддержки');
        });
    }
});

// Обработка кликов по лигам
document.addEventListener('click', function(e) {
    const leagueItem = e.target.closest('.league-item');
    if (leagueItem) {
        leagueItem.classList.toggle('expanded');
    }
});

// Функция для добавления/удаления матча из избранного
function toggleFavorite(matchId, starElement) {
    let favoriteMatches = JSON.parse(localStorage.getItem('favoriteMatches') || '[]');
    const matchElement = starElement.closest('.match-item');
    
    // Получаем данные о матче
    const matchData = {
        id: matchId,
        date: matchElement.querySelector('.match-date').textContent,
        team1: {
            name: matchElement.querySelector('.team:first-child .team-name').textContent,
            logo: matchElement.querySelector('.team:first-child .team-logo img').src
        },
        team2: {
            name: matchElement.querySelector('.team:last-child .team-name').textContent,
            logo: matchElement.querySelector('.team:last-child .team-logo img').src
        },
        score: matchElement.querySelector('.match-score').textContent,
        status: matchElement.querySelector('.watch-button').className.includes('live') ? 'live' : 
                matchElement.querySelector('.watch-button').className.includes('stats') ? 'finished' : 'scheduled'
    };

    const index = favoriteMatches.findIndex(m => m.id === matchId);
    
    if (index === -1) {
        // Добавляем в избранное
        favoriteMatches.push(matchData);
        starElement.classList.add('active');
    } else {
        // Удаляем из избранного
        favoriteMatches.splice(index, 1);
        starElement.classList.remove('active');
    }

    localStorage.setItem('favoriteMatches', JSON.stringify(favoriteMatches));

    // Обновляем состояние на всех страницах
    updateAllStars();
}

// Функция для обновления всех звездочек на странице
function updateAllStars() {
    const favoriteMatches = JSON.parse(localStorage.getItem('favoriteMatches') || '[]');
    const allStars = document.querySelectorAll('.favorite-star');
    
    allStars.forEach(star => {
        const matchElement = star.closest('.match-item');
        const matchId = matchElement.getAttribute('data-match-id');
        
        if (favoriteMatches.some(match => match.id === matchId)) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Функция для создания элемента матча
function createMatchElement(match) {
    const matchElement = document.createElement('div');
    matchElement.className = 'match-item';
    matchElement.setAttribute('data-match-id', match.id);
    matchElement.innerHTML = `
        <img src="ico/star.png" class="favorite-star active" onclick="toggleFavorite('${match.id}', this)" alt="В избранном">
        <div class="match-date">${match.date}</div>
        <div class="match-teams">
            <div class="team">
                <div class="team-logo">
                    <img src="${match.team1.logo}" alt="${match.team1.name}">
                </div>
                <div class="team-name">${match.team1.name}</div>
            </div>
            <div class="match-score ${match.status}">${match.score}</div>
            <div class="team">
                <div class="team-logo">
                    <img src="${match.team2.logo}" alt="${match.team2.name}">
                </div>
                <div class="team-name">${match.team2.name}</div>
            </div>
        </div>
        <button class="watch-button ${match.status}">
            ${match.status === 'live' ? 'Смотреть матч' : 
              match.status === 'finished' ? 'Статистика' : 'Запланировано'}
        </button>
    `;
    return matchElement;
}

// При загрузке страницы обновляем все звездочки
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем data-match-id к существующим матчам, если их нет
    const matches = document.querySelectorAll('.match-item');
    matches.forEach((match, index) => {
        if (!match.hasAttribute('data-match-id')) {
            // Генерируем уникальный ID для матча, если его нет
            const matchId = `match_${index}_${Date.now()}`;
            match.setAttribute('data-match-id', matchId);
        }
    });

    // Обновляем состояние всех звездочек
    updateAllStars();
}); 