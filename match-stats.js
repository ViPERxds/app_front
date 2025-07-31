const API_KEY = '215063';
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json';

class MatchStats {
    constructor() {
        this.matchId = new URLSearchParams(window.location.search).get('id');
        console.log('Match ID:', this.matchId); // Проверяем ID матча
        this.initializeEventListeners();
        this.loadMatchData();
    }

    initializeEventListeners() {
        document.querySelectorAll('.section-header').forEach(header => {
            header.addEventListener('click', () => {
                const section = header.parentElement;
                const isExpanded = section.classList.contains('expanded');
                
                // Сворачиваем все секции
                document.querySelectorAll('.section').forEach(s => {
                    s.classList.remove('expanded');
                });

                // Разворачиваем текущую секцию, если она была свёрнута
                if (!isExpanded) {
                    section.classList.add('expanded');
                }
            });
        });
    }

    async loadMatchData() {
        try {
            // Сначала загружаем только основные данные матча
            const matchDetails = await this.fetchMatchDetails();
            this.updateMatchInfo(matchDetails);

            // Проверяем статус матча
            if (matchDetails && matchDetails.strStatus === 'Match Finished') {
                // Если матч завершен, загружаем дополнительные данные
                const [matchStats, matchLineup] = await Promise.all([
                    this.fetchMatchStats(),
                    this.fetchMatchLineup()
                ]);

                this.updateMatchStats(matchStats);
                this.updateLineups(matchLineup);
            } else {
                // Если матч не завершен, показываем соответствующие сообщения
                this.showPendingMatchInfo();
            }

            // По умолчанию открываем первую секцию
            const firstSection = document.querySelector('.section');
            if (firstSection) {
                firstSection.classList.add('expanded');
            }
        } catch (error) {
            console.error('Error loading match data:', error);
            this.showErrorState();
        }
    }

    async fetchMatchDetails() {
        try {
            const response = await fetch(`${BASE_URL}/${API_KEY}/lookupevent.php?id=${this.matchId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.events?.[0];
        } catch (error) {
            console.error('Error fetching match details:', error);
            return null;
        }
    }

    async fetchMatchStats() {
        try {
            const response = await fetch(`${BASE_URL}/${API_KEY}/lookupeventstats.php?id=${this.matchId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.eventstats;
        } catch (error) {
            console.error('Error fetching match stats:', error);
            return null;
        }
    }

    async fetchMatchLineup() {
        try {
            const response = await fetch(`${BASE_URL}/${API_KEY}/lookuplineup.php?id=${this.matchId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.lineup;
        } catch (error) {
            console.error('Error fetching match lineup:', error);
            return null;
        }
    }

    updateMatchInfo(match) {
        if (!match) {
            this.showErrorState();
            return;
        }

        // Обновляем информацию о командах
        document.querySelector('.home-team .team-logo').src = match.strHomeTeamBadge || '';
        document.querySelector('.home-team .team-name').textContent = match.strHomeTeam || '';
        document.querySelector('.away-team .team-logo').src = match.strAwayTeamBadge || '';
        document.querySelector('.away-team .team-name').textContent = match.strAwayTeam || '';

        // Обновляем счет
        const score = match.intHomeScore !== null && match.intAwayScore !== null
            ? `${match.intHomeScore} - ${match.intAwayScore}`
            : 'vs';
        document.querySelector('.score').textContent = score;

        // Обновляем время матча
        const matchTime = this.formatMatchTime(match);
        document.querySelector('.match-time').textContent = matchTime;
    }

    showPendingMatchInfo() {
        // Показываем сообщение о предстоящем матче в каждой секции
        document.querySelector('.stats-list').innerHTML = 
            '<div class="no-stats">Матч еще не начался</div>';
        
        document.querySelector('.possession-stats').innerHTML = 
            '<div class="no-stats">Матч еще не начался</div>';
        
        document.querySelectorAll('.players-list').forEach(container => {
            container.innerHTML = '<div class="no-lineup">Составы будут доступны перед началом матча</div>';
        });
    }

    showErrorState() {
        // Показываем сообщение об ошибке в каждой секции
        document.querySelector('.stats-list').innerHTML = 
            '<div class="no-stats">Ошибка загрузки данных</div>';
        
        document.querySelector('.possession-stats').innerHTML = 
            '<div class="no-stats">Ошибка загрузки данных</div>';
        
        document.querySelectorAll('.players-list').forEach(container => {
            container.innerHTML = '<div class="no-lineup">Ошибка загрузки данных</div>';
        });
    }

    updateMatchStats(stats) {
        const statsContainer = document.querySelector('.stats-list');
        if (statsContainer) {
            if (!stats) {
                statsContainer.innerHTML = '<div class="no-stats">API не предоставляет статистику для этого матча</div>';
                return;
            }

            const eventsHTML = stats
                .filter(stat => stat.strStat !== 'Ball Possession')
                .map(stat => `
                    <div class="stat-item">
                        <span class="stat-value">${stat.strHomeTeamValue || '0'}</span>
                        <span class="stat-name">${this.translateStatName(stat.strStat)}</span>
                        <span class="stat-value">${stat.strAwayTeamValue || '0'}</span>
                    </div>
                `).join('');
            statsContainer.innerHTML = eventsHTML || '<div class="no-stats">API не предоставляет статистику для этого матча</div>';
        }

        // Обновляем владение мячом
        const possessionContainer = document.querySelector('.possession-stats');
        if (possessionContainer) {
            if (!stats) {
                possessionContainer.innerHTML = '<div class="no-stats">API не предоставляет данные о владении мячом</div>';
                return;
            }

            const possessionStat = stats.find(stat => stat.strStat === 'Ball Possession');
            if (possessionStat) {
                possessionContainer.innerHTML = `
                    <div class="stat-item">
                        <span class="stat-value">${possessionStat.strHomeTeamValue || '0%'}</span>
                        <span class="stat-name">Владение мячом</span>
                        <span class="stat-value">${possessionStat.strAwayTeamValue || '0%'}</span>
                    </div>
                `;
            } else {
                possessionContainer.innerHTML = '<div class="no-stats">API не предоставляет данные о владении мячом</div>';
            }
        }
    }

    updateLineups(lineups) {
        const homeContainer = document.querySelector('.home-lineup .players-list');
        const awayContainer = document.querySelector('.away-lineup .players-list');

        if (!lineups) {
            if (homeContainer) homeContainer.innerHTML = '<div class="no-lineup">API не предоставляет составы для этого матча</div>';
            if (awayContainer) awayContainer.innerHTML = '<div class="no-lineup">API не предоставляет составы для этого матча</div>';
            return;
        }

        const homeLineup = lineups.filter(player => player.strPosition === 'home');
        const awayLineup = lineups.filter(player => player.strPosition === 'away');

        if (homeContainer) {
            const homeHTML = homeLineup.map(player => `
                <div class="player-item">
                    <span class="player-number">${player.strNumber || '-'}</span>
                    <span class="player-name">${player.strPlayer}</span>
                </div>
            `).join('');
            homeContainer.innerHTML = homeHTML || '<div class="no-lineup">Нет информации</div>';
        }

        if (awayContainer) {
            const awayHTML = awayLineup.map(player => `
                <div class="player-item">
                    <span class="player-number">${player.strNumber || '-'}</span>
                    <span class="player-name">${player.strPlayer}</span>
                </div>
            `).join('');
            awayContainer.innerHTML = awayHTML || '<div class="no-lineup">Нет информации</div>';
        }
    }

    translateStatName(statName) {
        const translations = {
            'Goals': 'Голы',
            'Shots': 'Удары',
            'Shots on Goal': 'Удары в створ',
            'Fouls': 'Фолы',
            'Corner Kicks': 'Угловые',
            'Offsides': 'Офсайды',
            'Yellow Cards': 'Жёлтые карточки',
            'Red Cards': 'Красные карточки'
        };
        return translations[statName] || statName;
    }

    formatMatchTime(match) {
        if (!match.dateEvent) return '';
        
        const date = new Date(match.dateEvent);
        const time = match.strTime ? match.strTime.split(':').slice(0, 2).join(':') : '00:00';
        
        return `${date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit'
        })}, ${time}`;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new MatchStats();
}); 