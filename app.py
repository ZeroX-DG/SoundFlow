from __future__ import unicode_literals
from os import environ
from flask import Flask, request
from flask.json import jsonify
from adapters.youtube import YoutubeAdapter

app = Flask(__name__, static_folder='./www/dist', static_url_path = '/')

YOUTUBE_API_KEY = environ.get("YOUTUBE_KEY")

adapters = {
    'youtube': YoutubeAdapter(YOUTUBE_API_KEY)
}

@app.route('/api/tracks/search/<path:query>')
def search(query):
    result = {}
    try:
        for adapter in adapters.itervalues():
            result[adapter.name] = adapter.search_tracks(query)
        return jsonify(result)
    except:
        return jsonify({ 'error': 'Error while getting track list' })

@app.route('/api/play')
def get_audio_url():
    url = request.args.get('url')
    provider = request.args.get('provider')
    try:
        adapter = adapters[provider]
        return adapter.get_track_url(url)
    except:
        return jsonify({ 'error': 'Error while fetching audio url' })

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def spa(path):
    return app.send_static_file('index.html')

@app.errorhandler(404)   
def not_found(e):   
    return app.send_static_file('index.html')
