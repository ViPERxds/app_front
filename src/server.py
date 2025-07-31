import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from parser import get_stream_links

app = Flask(__name__)
CORS(app)  # Разрешаем CORS для всех маршрутов

@app.route('/api/stream-links', methods=['POST'])
def stream_links():
    try:
        matches = request.json
        if not matches:
            return jsonify({'error': 'No matches provided'}), 400

        # Получаем ссылки на трансляции для всех матчей
        stream_links = get_stream_links(matches)
        return jsonify(stream_links)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port) 