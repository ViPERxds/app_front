FROM python:3.11.7-slim

# Установка зависимостей для Chrome
RUN apt-get update && apt-get install -y \
    wget \
    gnupg2 \
    apt-transport-https \
    ca-certificates \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Установка рабочей директории
WORKDIR /app

# Копирование файлов проекта
COPY requirements.txt .
COPY src/ src/

# Установка Python зависимостей
RUN pip install --no-cache-dir -r requirements.txt

# Запуск приложения
CMD ["gunicorn", "--bind", "0.0.0.0:$PORT", "src.server:app"]