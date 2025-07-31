const StreamAPI = {
    async getStreamLinks(matches) {
        try {
            // Отправляем запрос к локальному серверу с парсером
            // В продакшене используем Railway URL, в разработке - локальный
            const API_URL = window.location.hostname === 'viperxds.github.io' 
                ? 'https://app-front-production.up.railway.app'  // URL на Railway
                : 'http://127.0.0.1:5000';  // Локальный URL
            const response = await fetch(`${API_URL}/api/stream-links`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(matches)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const streamLinks = await response.json();
            
            // Преобразуем ссылки в iframe-совместимый формат
            const processedLinks = {};
            for (const [key, url] of Object.entries(streamLinks)) {
                if (url) {
                    // Проверяем, является ли ссылка blob URL
                    if (url.startsWith('blob:')) {
                        // Для blob URL нам нужно получить прямую ссылку на видео
                        try {
                            const videoResponse = await fetch(url);
                            const videoBlob = await videoResponse.blob();
                            const videoUrl = URL.createObjectURL(videoBlob);
                            processedLinks[key] = videoUrl;
                        } catch (error) {
                            console.warn('Не удалось обработать blob URL:', error);
                            // Если не удалось обработать blob, используем исходную ссылку
                            processedLinks[key] = url;
                        }
                    }
                    // Проверяем, является ли ссылка прямой ссылкой на видео
                    else if (url.match(/\.(m3u8|mp4)($|\?)/i)) {
                        processedLinks[key] = url;
                    }
                    // Проверяем, является ли ссылка уже iframe-совместимой
                    else if (url.includes('webplayer') || url.includes('iframe')) {
                        // Добавляем параметры для встраивания, если их нет
                        let processedUrl = url;
                        if (!url.includes('embedded=true')) {
                            processedUrl += (url.includes('?') ? '&' : '?') + 'embedded=true';
                        }
                        processedLinks[key] = processedUrl;
                    } else {
                        // Для остальных ссылок пытаемся создать iframe
                        processedLinks[key] = url;
                    }
                }
            }
            
            return processedLinks;
        } catch (error) {
            console.error('Ошибка при получении ссылок на трансляции:', error);
            // Показываем пользователю более понятное сообщение об ошибке
            if (!navigator.onLine) {
                console.error('Нет подключения к интернету');
            } else if (error.message.includes('Failed to fetch')) {
                console.error('Не удалось подключиться к серверу. Возможно, сервер не запущен или недоступен.');
            } else if (error.message.includes('NetworkError')) {
                console.error('Ошибка сети. Проверьте подключение к интернету.');
            }
            throw error;
        }
    }
};

// Делаем API доступным глобально
window.StreamAPI = StreamAPI; 
