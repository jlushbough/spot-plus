# spot-plus

Spot Plus is a lightweight Flask web application that retrieves your most recently
played track from Spotify and enriches it with additional context using a
large‑language model (LLM). The app fetches the last song you listened to via
Spotify's API and asks OpenAI's API to generate a short, interesting summary
about the track and its artist.

## Features

* Displays the most recently played song, artist, and album from your Spotify
  listening history.
* Provides a link to open the track directly on Spotify.
* Uses OpenAI's GPT model to generate enriched information such as trivia
  about the song, its background, or the artist's history.

## Setup

1. **Clone the repository (or download the source)**. If you haven't
   cloned it yet, you can do so once the repository is created on GitHub. For
   local testing prior to publishing, copy the `spot-plus` directory to
   your machine.

2. **Install the dependencies** using pip:

   ```bash
   pip install -r requirements.txt
   ```

3. **Configure your environment variables**. The application expects two
   environment variables:

   - `SPOTIFY_TOKEN`: A Spotify OAuth access token with the
     `user-read-recently-played` permission. You can generate this token via
     Spotify's developer dashboard or any OAuth flow that grants the
     appropriate scope.
   - `OPENAI_API_KEY`: Your OpenAI API key. Sign up at
     [openai.com](https://platform.openai.com/) to obtain a key if you don't
     already have one.

   You can set these variables in your shell before running the app, or put
   them in a `.env` file in the project root:

   ```env
   SPOTIFY_TOKEN=your_spotify_token
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the application**.

   ```bash
   python app.py
   ```

   By default the app runs on `http://localhost:5000`. Visit this URL in your
   browser to see the last song you played and the enriched information.

## Deployment

Spot Plus is designed to be easy to deploy on any platform that can run a
Python Flask application. Ensure that the required environment variables are
set in your deployment environment. You can also configure the port by setting
the `PORT` environment variable.

## License

This project is open source and available under the MIT License. See
`LICENSE` for details.
