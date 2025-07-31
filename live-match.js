let currentMatchId = null;

document.addEventListener('DOMContentLoaded', () => {
    // Получаем ID матча из URL
    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('id');
    currentMatchId = matchId;

    if (matchId) {
        // Инициализация страницы
        initializePage(matchId);
    } else {
        console.warn('Match ID not provided');
        window.location.href = 'index.html';
    }
});

async function initializePage(matchId) {
    try {
        // Загружаем данные о матче
        await fetchMatchData(matchId);
        
        // Загружаем трансляцию
        await updateStreamLinks();
        
        // Запускаем автообновление данных
        setInterval(() => fetchMatchData(matchId), 30000);
        setInterval(() => updateStreamLinks(), 300000); // Обновляем трансляцию каждые 5 минут
    } catch (error) {
        console.error('Error initializing page:', error);
        showError('Ошибка при загрузке данных');
    }
}

async function fetchMatchData(matchId) {
    try {
        // Используем API для получения данных о матче
        const response = await fetch(`${BASE_URL}/${API_KEY}/lookupevent.php?id=${matchId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.events && data.events[0]) {
            const match = data.events[0];
            
            // Обновляем заголовок страницы
            document.title = `${match.strHomeTeam} - ${match.strAwayTeam} | Прямая трансляция`;
            
            // Обновляем информацию на странице
            updateTeamInfo({
                homeTeam: {
                    name: match.strHomeTeam,
                    logo: match.strHomeTeamBadge,
                    score: match.intHomeScore || '0'
                },
                awayTeam: {
                    name: match.strAwayTeam,
                    logo: match.strAwayTeamBadge,
                    score: match.intAwayScore || '0'
                }
            });
        } else {
            console.error('No match data found');
            showError('Информация о матче не найдена');
        }
    } catch (error) {
        console.error('Error fetching match data:', error);
        showError('Ошибка при загрузке данных матча');
    }
}

function updateTeamInfo(data) {
    // Обновляем названия команд
    const homeTeamName = document.getElementById('homeTeamName');
    const awayTeamName = document.getElementById('awayTeamName');
    homeTeamName.textContent = data.homeTeam.name || '';
    awayTeamName.textContent = data.awayTeam.name || '';
    
    // Обновляем счет
    const homeScore = document.getElementById('homeScore');
    const awayScore = document.getElementById('awayScore');
    homeScore.textContent = data.homeTeam.score;
    awayScore.textContent = data.awayTeam.score;

    // Обновляем логотипы команд
    const homeTeamLogo = document.getElementById('homeTeamLogo');
    const awayTeamLogo = document.getElementById('awayTeamLogo');
    
    if (data.homeTeam.logo) {
        homeTeamLogo.src = data.homeTeam.logo;
        homeTeamLogo.alt = `Логотип ${data.homeTeam.name}`;
    } else {
        homeTeamLogo.src = '';
        homeTeamLogo.alt = 'Логотип не найден';
    }
    
    if (data.awayTeam.logo) {
        awayTeamLogo.src = data.awayTeam.logo;
        awayTeamLogo.alt = `Логотип ${data.awayTeam.name}`;
    } else {
        awayTeamLogo.src = '';
        awayTeamLogo.alt = 'Логотип не найден';
    }
}

function showLoader() {
    document.getElementById('streamLoader').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('streamLoader').style.display = 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('streamError');
    const errorText = errorDiv.querySelector('.error-text');
    errorText.textContent = message;
    errorDiv.style.display = 'flex';
}

function hideError() {
    document.getElementById('streamError').style.display = 'none';
}

// Функция для получения информации о текущих матчах
function getCurrentMatches() {
    const matches = [];
    // Получаем названия команд из заголовка матча
    const homeTeamName = document.getElementById('homeTeamName').textContent.trim();
    const awayTeamName = document.getElementById('awayTeamName').textContent.trim();
    
    // Добавляем матч только если есть названия команд
    if (homeTeamName && awayTeamName) {
        matches.push({
            team1: homeTeamName,
            team2: awayTeamName,
            time: '00:00' // Время не важно для поиска трансляции
        });
    }
    
    return matches;
}

// Функция для обновления плеера трансляции
function updateStreamPlayer(streamUrl) {
    const videoContainer = document.querySelector('.video-container');
    const existingVideo = document.getElementById('matchVideo');
    const existingIframe = document.getElementById('matchIframe');
    
    if (existingVideo) existingVideo.remove();
    if (existingIframe) existingIframe.remove();
    
    showLoader();
    hideError();
    videoContainer.classList.remove('error');
    
    if (!streamUrl) {
        showError('Трансляция не найдена');
        return;
    }
    
    try {
        // Создаем iframe для плеера
        const iframe = document.createElement('iframe');
        iframe.id = 'matchIframe';
        iframe.allowFullscreen = true;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.backgroundColor = '#000';
        
        // Проверяем тип ссылки
        if (streamUrl.includes('player/live.php')) {
            // Для прямых ссылок на плеер просто используем URL как есть
            iframe.src = streamUrl;
        } else if (streamUrl.includes('webplayer')) {
            // Для webplayer добавляем параметры
            if (streamUrl.includes('?')) {
                iframe.src = streamUrl + '&embedded=true&hideUI=true&autoplay=true';
            } else {
                iframe.src = streamUrl + '?embedded=true&hideUI=true&autoplay=true';
            }
        } else {
            // Для остальных случаев пытаемся встроить как есть
            iframe.src = streamUrl;
        }
        
        iframe.onload = () => {
            hideLoader();
            iframe.style.display = 'block';
        };
        
        iframe.onerror = () => {
            console.error('Ошибка загрузки трансляции:', streamUrl);
            showError('Ошибка загрузки трансляции');
            iframe.remove();
        };
        
        videoContainer.appendChild(iframe);
    } catch (error) {
        console.error('Ошибка при обновлении плеера:', error);
        showError('Ошибка при обновлении плеера');
    }
}

function handleStreamError(message) {
    const videoFrame = document.getElementById('matchVideo');
    const videoContainer = document.querySelector('.video-container');
    
    hideLoader();
    showError(message);
    videoContainer.classList.add('error');
    videoFrame.style.display = 'none';
}

// Функция для обновления ссылок на трансляции
async function updateStreamLinks() {
    try {
        const currentMatches = getCurrentMatches();
        if (currentMatches.length === 0) {
            console.log('Нет активных матчей');
            showError('Нет активных матчей');
            return;
        }

        console.log('Обновляем трансляции для матчей:', currentMatches);
        showLoader();
        
        const streamLinks = await StreamAPI.getStreamLinks(currentMatches);
        
        // Обновляем плеер для текущего матча
        for (const match of currentMatches) {
            const matchKey = `${match.team1} vs ${match.team2}`;
            const streamUrl = streamLinks[matchKey];
            
            if (streamUrl) {
                console.log(`Найдена трансляция для матча ${matchKey}`);
                updateStreamPlayer(streamUrl);
                hideError();
                return;
            }
        }
        
        // Если не найдено ни одной трансляции
        console.log('Трансляции не найдены');
        showError('Трансляция не найдена');
        
    } catch (error) {
        console.error('Ошибка при обновлении трансляций:', error);
        showError('Ошибка при загрузке трансляции');
    } finally {
        hideLoader();
    }
} 