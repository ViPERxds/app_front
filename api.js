const API_KEY = '215063';
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json';

const POPULAR_LEAGUES = [
    // Футбольные турниры
    {
        id: '4503',
        name: 'FIFA World Cup',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/yesbil1731546197.png',
        sport: 'football'
    },
    {
        id: '4480',
        name: 'UEFA Champions League',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/facv1u1742998896.png',
        sport: 'football'
    },
    {
        id: '4481',
        name: 'UEFA Europa League',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/mlsr7d1718774547.png',
        sport: 'football'
    },
    {
        id: '5071',
        name: 'UEFA Conference League',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/ymfo5j1718775759.png',
        sport: 'football'
    },
    {
        id: '4328',
        name: 'English Premier League',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/pdd43f1610891709.png',
        sport: 'football'
    },
    {
        id: '4335',
        name: 'La Liga',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/ja4it51687628717.png',
        sport: 'football'
    },
    {
        id: '4331',
        name: 'Bundesliga',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/0j55yv1534764799.png',
        sport: 'football'
    },
    {
        id: '4332',
        name: 'Serie A',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/67q3q21679951383.png',
        sport: 'football'
    },
    {
        id: '4334',
        name: 'Ligue 1',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/9f7z9d1742983155.png',
        sport: 'football'
    },
    {
        id: '4355',
        name: 'РПЛ',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/fg0ad21532769374.png',
        sport: 'football'
    },
    {
        id: '5193',
        name: 'Кубок России',
        icon: 'https://r2.thesportsdb.com/images/media/league/badge/l5e8di1697436526.png',
        sport: 'football'
    },


    // Хоккейные турниры
    {
        id: '4976',
        name: 'IIHF World Championship',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/5slhn51739879207.png',
        sport: 'hockey'
    },
    {
        id: '4560',
        name: 'World Cup of Hockey',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/pqr3uo1555843064.png',
        sport: 'hockey'
    },
    {
        id: '4380',
        name: 'NHL',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/4cem2k1619616539.png',
        sport: 'hockey'
    },
    {
        id: '5496',
        name: '4 Nations Face-Off',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/qea4ae1721543049.png',
        sport: 'hockey'
    },
    {
        id: '4920',
        name: 'KHL',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/tfmf8l1615492008.png',
        sport: 'hockey'
    },
    {
        id: '4925',
        name: 'DEL',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/ttrhds1615493883.png',
        sport: 'hockey'
    },
    {
        id: '4648',
        name: 'SHL',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/95fnqb1547547893.png',
        sport: 'hockey'
    },

    // Баскетбольные турниры
    {
        id: '4549',
        name: 'FIBA World Cup',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/97pb7g1670404826.png',
        sport: 'basketball'
    },
    {
        id: '4546',
        name: 'EuroLeague',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/7xjtuy1554397263.png',
        sport: 'basketball'
    },
    {
        id: '4892',
        name: 'EuroLeague Women',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/ztfjmi1704394222.png',
        sport: 'basketball'
    },
    {
        id: '4831',
        name: 'EuroBasket',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/ztfjmi1704394222.png',
        sport: 'basketball'
    },
    {
        id: '4387',
        name: 'NBA',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/frdjqy1536585083.png',
        sport: 'basketball'
    },
    {
        id: '4548',
        name: 'EuroCup / BCL',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/6dfp5j1576751638.png',
        sport: 'basketball'
    },

    // Теннисные турниры
    {
        id: '4548',
        name: 'Fed Cup',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/ipw5go1672327786.png',
        sport: 'tennis'
    },
    {
        id: '4581',
        name: 'Laver Cup',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/pd74m91572093834.png',
        sport: 'tennis'
    },
    {
        id: '4464',
        name: 'ATP Tour',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/x16ihc1546113079.png',
        sport: 'tennis'
    },
    {
        id: '4517',
        name: 'WTA Tour',
        icon: 'https://www.thesportsdb.com/images/media/league/badge/2pl6qf1719218391.png',
        sport: 'tennis'
    }
];

class SportsAPI {
    static selectedDate = new Date().toISOString().split('T')[0];
    static selectedSport = 'football'; // Добавляем выбранный вид спорта по умолчанию

    static async fetchMatchesForLeague(league, type = 'next') {
        try {
            const endpoint = type === 'next' ? 'eventsnextleague.php' : 'eventspastleague.php';
            console.log(`Fetching ${type} matches for league ${league.name} (${league.id})`);
            
            const response = await fetch(`${BASE_URL}/${API_KEY}/${endpoint}?id=${league.id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Добавляем дополнительную проверку на наличие ошибок в ответе API
            if (data.error) {
                console.error(`API Error for ${league.name}:`, data.error);
                return [];
            }
            
            console.log(`Raw API ${type} response for ${league.name}:`, data);
            
            if (data && data.events) {
                // Фильтруем матчи по виду спорта и добавляем дополнительную обработку для тенниса
                const filteredEvents = data.events.filter(event => {
                    switch(league.sport) {
                        case 'football':
                            return event.strSport === 'Soccer';
                        case 'hockey':
                            return event.strSport === 'Ice Hockey';
                        case 'basketball':
                            return event.strSport === 'Basketball';
                        case 'tennis':
                            // Для тенниса добавляем дополнительную обработку
                            if (event.strSport === 'Tennis') {
                                // Разделяем название матча на игроков
                                const matchTitle = event.strEvent || '';
                                const players = matchTitle.split(' vs ');
                                if (players.length === 2) {
                                    // Очищаем имена игроков от статуса
                                    let homeTeam = players[0].trim();
                                    let awayTeam = players[1].trim();
                                    
                                    // Убираем название турнира из имени, если оно есть
                                    if (homeTeam.includes('Open')) {
                                        const parts = homeTeam.split(' ');
                                        homeTeam = parts[parts.length - 1];
                                    }
                                    
                                    event.strHomeTeam = homeTeam;
                                    event.strAwayTeam = awayTeam;
                                    event.strHomeTeamBadge = 'ico/tennis.png';
                                    event.strAwayTeamBadge = 'ico/tennis.png';

                                    // Обработка результата матча из strResult
                                    if (event.strResult) {
                                        const lines = event.strResult.split('\n');
                                        if (lines.length >= 3) {
                                            // Первая строка содержит победителя
                                            const winnerLine = lines[0].trim();
                                            const winner = winnerLine.split(' beat ')[0].trim();
                                            
                                            // Вторая и третья строки содержат счет
                                            const homeScoreLine = lines[1].trim();
                                            const awayScoreLine = lines[2].trim();
                                            
                                            const homeScores = homeScoreLine.split(':')[1].trim().split(' ').filter(s => s);
                                            const awayScores = awayScoreLine.split(':')[1].trim().split(' ').filter(s => s);
                                            
                                            // Формируем счет для отображения
                                            let scoreDisplay = '';
                                            for (let i = 0; i < homeScores.length; i++) {
                                                if (i > 0) scoreDisplay += ' ';
                                                scoreDisplay += `${homeScores[i]}-${awayScores[i]}`;
                                            }
                                            
                                            event.strScore = scoreDisplay;
                                            event.strResult = winner === event.strHomeTeam ? 'home' : 'away';
                                        }
                                    }
                                }
                                return true;
                            }
                            return false;
                        default:
                            return false;
                    }
                });
                
                console.log(`Found ${filteredEvents.length} ${type} matches for ${league.name}`);
                return filteredEvents;
            } else {
                console.log(`No ${type} matches found for ${league.name}`);
                return [];
            }
        } catch (error) {
            console.error(`Error fetching ${type} matches for league ${league.id}:`, error);
            return [];
        }
    }

    static async fetchAllMatches() {
        try {
            const matchesByLeague = {};
            const allDates = new Set();
            
            // Фильтруем лиги по выбранному виду спорта
            const filteredLeagues = POPULAR_LEAGUES.filter(league => league.sport === this.selectedSport);
            
            // Сначала добавляем все отфильтрованные лиги в объект
            filteredLeagues.forEach(league => {
                matchesByLeague[league.id] = {
                    ...league,
                    matches: []
                };
            });

            // Получаем матчи для каждой отфильтрованной лиги
            const promises = filteredLeagues.map(async league => {
                try {
                    const [nextMatches, pastMatches] = await Promise.all([
                        this.fetchMatchesForLeague(league, 'next'),
                        this.fetchMatchesForLeague(league, 'past')
                    ]);

                    const allMatches = [...nextMatches, ...pastMatches];
                    
                    // Собираем все уникальные даты
                    allMatches.forEach(match => {
                        if (match.dateEvent) {
                            allDates.add(match.dateEvent);
                        }
                    });

                    matchesByLeague[league.id].matches = allMatches;
                } catch (error) {
                    console.error(`Error processing matches for league ${league.id}:`, error);
                }
            });

            await Promise.all(promises);

            // Создаем и обновляем календарь
            this.updateCalendar(Array.from(allDates));
            
            // Фильтруем и отображаем матчи для выбранной даты
            this.displayMatchesForDate(matchesByLeague, this.selectedDate);
        } catch (error) {
            console.error('Error in fetchAllMatches:', error);
            const matchesContainer = document.querySelector('.matches-container');
            if (matchesContainer) {
                matchesContainer.innerHTML = '<p>Ошибка при загрузке данных</p>';
            }
        }
    }

    static updateCalendar(dates) {
        dates.sort();
        
        const calendar = document.querySelector('.calendar');
        if (!calendar) return;

        // Находим диапазон дат для отображения
        const selectedDate = new Date(this.selectedDate);
        const startDate = new Date(selectedDate);
        startDate.setDate(selectedDate.getDate() - 2);
        const endDate = new Date(selectedDate);
        endDate.setDate(selectedDate.getDate() + 2);

        let calendarHtml = '<div class="calendar-nav">';
        calendarHtml += '<button class="nav-btn prev">←</button>';
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const isSelected = dateStr === this.selectedDate;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            
            const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
            const hasMatches = dates.includes(dateStr);
            
            calendarHtml += `
                <div class="calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${hasMatches ? 'has-matches' : ''}"
                     data-date="${dateStr}">
                    <span class="day-name">${dayNames[d.getDay()]}</span>
                    <span class="day-number">${d.getDate()}.${(d.getMonth() + 1).toString().padStart(2, '0')}</span>
                </div>
            `;
        }
        
        calendarHtml += '<button class="nav-btn next">→</button></div>';
        calendar.innerHTML = calendarHtml;

        // Добавляем обработчики событий
        calendar.querySelectorAll('.calendar-day').forEach(day => {
            day.addEventListener('click', () => {
                const allDays = calendar.querySelectorAll('.calendar-day');
                allDays.forEach(d => d.classList.remove('selected'));
                day.classList.add('selected');
                
                this.selectedDate = day.dataset.date;
                this.fetchAllMatches();
            });
        });

        calendar.querySelector('.prev').addEventListener('click', () => {
            const firstDate = new Date(startDate);
            firstDate.setDate(firstDate.getDate() - 5);
            this.selectedDate = firstDate.toISOString().split('T')[0];
            this.fetchAllMatches();
        });

        calendar.querySelector('.next').addEventListener('click', () => {
            const lastDate = new Date(endDate);
            lastDate.setDate(lastDate.getDate() + 5);
            this.selectedDate = lastDate.toISOString().split('T')[0];
            this.fetchAllMatches();
        });
    }

    static lastMatchesByLeague = null;

    static displayMatchesForDate(matchesByLeague, selectedDate) {
        this.lastMatchesByLeague = matchesByLeague;
        
        const matchesContainer = document.querySelector('.matches-container');
        if (!matchesContainer) return;

        let html = '';

        Object.values(matchesByLeague).forEach(league => {
            const matchesForDate = league.matches.filter(match => match.dateEvent === selectedDate);
            
            html += `
                <div class="league-item" data-league-id="${league.id}">
                    <div class="league-header">
                        <div class="league-info">
                            <img class="league-icon" src="${league.icon}" alt="${league.name}" 
                                 onerror="this.src='placeholder.png'"/>
                            <span>${league.name}</span>
                        </div>
                        <span class="match-count" onclick="this.closest('.league-item').querySelector('.league-matches').style.display = this.closest('.league-item').querySelector('.league-matches').style.display === 'none' ? 'block' : 'none'">${matchesForDate.length}</span>
                    </div>
                    <div class="league-matches">
                        ${matchesForDate.length > 0 ? 
                            matchesForDate.map(match => createMatchElement(match)).join('') : 
                            '<p class="no-matches">Нет матчей</p>'}
                    </div>
                </div>
            `;
        });

        matchesContainer.innerHTML = html;

        // Обновляем обработчики для звездочек
        const stars = document.querySelectorAll('.favorite-star');
        stars.forEach(star => {
            const matchItem = star.closest('.match-item');
            if (matchItem) {
                const matchId = matchItem.dataset.matchId;
                // Проверяем, находится ли матч в избранном при загрузке
                const favoriteMatches = JSON.parse(localStorage.getItem('favoriteMatches') || '[]');
                const isInFavorites = favoriteMatches.some(favMatch => favMatch.id === matchId);
                if (isInFavorites) {
                    star.classList.add('active');
                }
                
                // Добавляем обработчик клика
                star.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    toggleFavorite(matchId, this);
                    return false;
                });
            }
        });
    }

    // Добавляем метод для изменения выбранного вида спорта
    static changeSport(sport) {
        this.selectedSport = sport;
        this.fetchAllMatches();
    }
}

function formatDateForDisplay(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long'
    });
}

// Функция для форматирования даты
function convertToMSK(date) {
    // Получаем смещение в минутах между локальным временем и UTC
    const localOffset = date.getTimezoneOffset();
    // Добавляем 3 часа (180 минут) для конвертации в МСК (UTC+3)
    return new Date(date.getTime() + (localOffset + 180) * 60000);
}

function formatMatchDate(dateStr, timeStr) {
    if (!dateStr) return '';
    try {
        const months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];

        // Парсим дату матча
        // Конвертируем в МСК
        const matchDate = convertToMSK(new Date(dateStr));
        const today = convertToMSK(new Date());
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        // Парсим время и конвертируем в МСК (UTC+3)
        const [hours, minutes] = (timeStr || '00:00').split(':');
        const mskHours = (parseInt(hours) + 3) % 24;
        const mskTime = `${mskHours.toString().padStart(2, '0')}:${minutes}`;
        
        // Форматируем дату в зависимости от того, когда матч
        if (matchDate.toDateString() === today.toDateString()) {
        return `Сегодня, ${mskTime} МСК`;
        } else if (matchDate.toDateString() === tomorrow.toDateString()) {
            return `Завтра, ${mskTime} МСК`;
        } else {
            const day = matchDate.getDate();
            const month = months[matchDate.getMonth()];
            return `${day} ${month}, ${mskTime} МСК`;
        }
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateStr;
    }
}

// Функция для создания HTML элемента матча
function createMatchElement(match) {
    if (!match) return '';
    
    const matchDate = formatMatchDate(match.dateEvent, match.strTime);
    let score = 'vs';
    let scoreClass = 'match-score';
    
    // Специальная обработка счета для тенниса
    if (match.strSport === 'Tennis') {
        if (match.strScore) {
            score = match.strScore;
            // Добавляем класс для победителя
            if (match.strResult === 'home') {
                scoreClass += ' home-winner';
            } else if (match.strResult === 'away') {
                scoreClass += ' away-winner';
            }
        }
    } else {
        // Для остальных видов спорта оставляем как есть
        score = match.intHomeScore !== null && match.intAwayScore !== null
            ? `${match.intHomeScore} - ${match.intAwayScore}`
            : 'vs';
    }
    
    let buttonClass = '';
    let buttonKey = '';
    
    const [hours, minutes] = (match.strTime || '00:00').split(':');
    const now = new Date();
    const matchTime = new Date(match.dateEvent);
    matchTime.setHours(parseInt(hours) + 3, parseInt(minutes));
    
    const timeDiff = (now - matchTime) / (1000 * 60);
    
    if (timeDiff >= -30 && timeDiff <= 120) {
        buttonClass = 'live';
        buttonKey = 'watch-match';
        scoreClass += ' live';
    } else if (timeDiff > 120) {
        buttonClass = 'stats';
        buttonKey = 'match-stats';
    } else {
        buttonClass = 'scheduled';
        buttonKey = 'scheduled-match';
    }
    
    const currentLang = localStorage.getItem('language') || 'ru';
    const buttonText = translations[currentLang][buttonKey];
    
    let buttonHtml = '';
    if (buttonClass === 'scheduled') {
        buttonHtml = `<div class="watch-button ${buttonClass}" data-lang-key="${buttonKey}">${buttonText}</div>`;
    } else if (buttonText) {
        buttonHtml = `<button class="watch-button ${buttonClass}" onclick="window.location.href='${buttonClass === 'live' ? 'live-match.html' : 'match-stats.html'}?id=${match.idEvent}'" data-lang-key="${buttonKey}">${buttonText}</button>`;
    }

    // Проверяем, находится ли матч в избранном
    const favoriteMatches = JSON.parse(localStorage.getItem('favoriteMatches') || '[]');
    const isInFavorites = favoriteMatches.some(favMatch => favMatch.id === match.idEvent);
    
    const homeLogo = match.strHomeTeamBadge || 'ico/placeholder.png';
    const awayLogo = match.strAwayTeamBadge || 'ico/placeholder.png';
    
    // Создаем специальную структуру для теннисного матча
    if (match.strSport === 'Tennis') {
        const matchTitle = match.strEvent || '';
        const players = matchTitle.split(' vs ');
        if (players.length === 2) {
            // Очищаем имена игроков
            let homeTeam = players[0].trim();
            let awayTeam = players[1].trim();
            
            // Убираем название турнира из имени, если оно есть
            if (homeTeam.includes('Open')) {
                const parts = homeTeam.split(' ');
                homeTeam = parts[parts.length - 1];
            }
            
            match.strHomeTeam = homeTeam;
            match.strAwayTeam = awayTeam;
            match.strHomeTeamBadge = 'ico/tennis.png';
            match.strAwayTeamBadge = 'ico/tennis.png';

            // Обработка результата матча из strResult
            if (match.strResult) {
                const lines = match.strResult.split('\n');
                if (lines.length >= 3) {
                    // Первая строка содержит победителя
                    const winnerLine = lines[0].trim();
                    const winner = winnerLine.split(' beat ')[0].trim();
                    
                    // Вторая и третья строки содержат счет
                    const homeScoreLine = lines[1].trim();
                    const awayScoreLine = lines[2].trim();
                    
                    const homeScores = homeScoreLine.split(':')[1].trim().split(' ').filter(s => s);
                    const awayScores = awayScoreLine.split(':')[1].trim().split(' ').filter(s => s);
                    
                    // Формируем счет для отображения
                    let scoreDisplay = '';
                    for (let i = 0; i < homeScores.length; i++) {
                        if (i > 0) scoreDisplay += ' ';
                        scoreDisplay += `${homeScores[i]}-${awayScores[i]}`;
                    }
                    
                    match.strScore = scoreDisplay;
                    match.strResult = winner === match.strHomeTeam ? 'home' : 'away';
                }
            }
        }
        
        return `
            <div class="match-item tennis-match ${buttonClass === 'future' ? 'future' : ''}" data-match-id="${match.idEvent}">
                <div class="match-header">
                    <img src="ico/star.png" alt="Избранное" class="favorite-star ${isInFavorites ? 'active' : ''}" />
                    <span class="match-date">${matchDate}</span>
                </div>
                <div class="tennis-content">
                    <div class="team ${match.strResult === 'home' ? 'winner' : ''}">
                        <img class="team-logo" src="${homeLogo}" 
                             alt="${match.strHomeTeam}" onerror="this.src='ico/placeholder.png'"/>
                        <span class="team-name">${match.strHomeTeam || ''}</span>
                    </div>
                    <span class="match-score">${score}</span>
                    <div class="team ${match.strResult === 'away' ? 'winner' : ''}">
                        <img class="team-logo" src="${awayLogo}" 
                             alt="${match.strAwayTeam}" onerror="this.src='ico/placeholder.png'"/>
                        <span class="team-name">${match.strAwayTeam || ''}</span>
                    </div>
                </div>
                ${buttonHtml}
            </div>
        `;
    }
    
    // Для остальных видов спорта оставляем старую структуру
    return `
        <div class="match-item ${buttonClass === 'future' ? 'future' : ''}" data-match-id="${match.idEvent}">
            <div class="match-header">
                <img src="ico/star.png" alt="Избранное" class="favorite-star ${isInFavorites ? 'active' : ''}" />
                <span class="match-date">${matchDate}</span>
            </div>
            <div class="match-teams">
                <div class="team">
                    <img class="team-logo" src="${homeLogo}" 
                         alt="${match.strHomeTeam}" onerror="this.src='ico/placeholder.png'"/>
                    <span class="team-name">${match.strHomeTeam || ''}</span>
                </div>
                <span class="${scoreClass}">${score}</span>
                <div class="team">
                    <img class="team-logo" src="${awayLogo}" 
                         alt="${match.strAwayTeam}" onerror="this.src='ico/placeholder.png'"/>
                    <span class="team-name">${match.strAwayTeam || ''}</span>
                </div>
            </div>
            ${buttonHtml}
        </div>
    `;
}

// Функция для переключения избранного статуса матча
function toggleFavorite(matchId, starElement) {
    // Получаем текущий список избранных матчей
    let favoriteMatches = JSON.parse(localStorage.getItem('favoriteMatches') || '[]');
    
    // Находим матч и лигу в текущих данных
    let match = null;
    let league = null;
    Object.entries(SportsAPI.lastMatchesByLeague).forEach(([leagueId, leagueData]) => {
        leagueData.matches.forEach(m => {
            if (m.idEvent === matchId) {
                match = m;
                league = leagueData;
            }
        });
    });

    if (!match || !league) return;

    // Проверяем, есть ли матч уже в избранном
    const existingIndex = favoriteMatches.findIndex(m => m.id === matchId);
    
    if (existingIndex === -1) {
        // Добавляем в избранное
        favoriteMatches.push({
            id: matchId,
            homeTeam: match.strHomeTeam,
            awayTeam: match.strAwayTeam,
            date: match.dateEvent,
            time: match.strTime,
            homeScore: match.intHomeScore,
            awayScore: match.intAwayScore,
            homeTeamBadge: match.strHomeTeamBadge,
            awayTeamBadge: match.strAwayTeamBadge,
            leagueId: league.id,
            leagueName: league.name,
            leagueIcon: league.icon,
            sport: league.sport
        });
        starElement.classList.add('active');
    } else {
        // Удаляем из избранного
        favoriteMatches.splice(existingIndex, 1);
        starElement.classList.remove('active');
    }

    // Сохраняем обновленный список
    localStorage.setItem('favoriteMatches', JSON.stringify(favoriteMatches));
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    SportsAPI.fetchAllMatches();

    // Обновляем данные каждые 5 минут
    setInterval(() => {
        SportsAPI.fetchAllMatches();
    }, 300000);
}); 
