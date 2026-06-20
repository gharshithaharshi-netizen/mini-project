from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/')
def home():

    songs = []

    for file in os.listdir('static/songs'):
        if file.endswith('.mp3'):
            songs.append(file)

    return render_template(
        'index.html',
        songs=songs
    )

if __name__ == '__main__':
    app.run(debug=True)