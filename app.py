from __future__ import unicode_literals
from os import environ
from flask import Flask
from flask.json import jsonify
from adapters.youtube import YoutubeAdapter

app = Flask(__name__, static_folder='./www/dist', static_url_path = '/')

YOUTUBE_API_KEY = environ.get("YOUTUBE_KEY")

adapters = [YoutubeAdapter(YOUTUBE_API_KEY)]

@app.route('/api/tracks/search/<path:query>')
def search(query):
    result = {}
    for adapter in adapters:
        result[adapter.name] = adapter.search_tracks(query)
    return jsonify(result)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def spa(path):
    return app.send_static_file('index.html')

@app.errorhandler(404)   
def not_found(e):   
    return app.send_static_file('index.html')
