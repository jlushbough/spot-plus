export default {
  async fetch(request, env, ctx) {
    const spotifyToken = env.SPOTIFY_TOKEN;
    const openaiApiKey = env.OPENAI_API_KEY;

    // fetch last played track
    const spotifyResp = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    });
    if (!spotifyResp.ok) {
      return new Response("Error fetching last played track: " + spotifyResp.statusText, { status: 500 });
    }
    const spotifyData = await spotifyResp.json();
    const items = spotifyData.items || [];
    if (items.length === 0) {
      return new Response("No recently played tracks found.", { status: 200 });
    }
    const track = items[0].track;
    const trackName = track.name;
    const artistName = track.artists[0].name;
    const albumName = track.album.name;
    const trackUrl = track.external_urls.spotify;

    // create prompt and call OpenAI
    const prompt = `Provide a short interesting summary about the song '${trackName}' by ${artistName}. Include some details about the song's history, meaning, or the artist's background.`;
    let summary = "";
    try {
      const aiResp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: prompt },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });
      if (aiResp.ok) {
        const aiData = await aiResp.json();
        summary = aiData.choices?.[0]?.message?.content?.trim() || "";
      } else {
        summary = "Unable to retrieve enriched information. Please check your OpenAI API key.";
      }
    } catch (err) {
      summary = "Error calling OpenAI API.";
    }

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Spot Plus Worker</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
    h1, h2 { color: #1DB954; }
    a { color: #1DB954; text-decoration: none; }
  </style>
</head>
<body>
  <h1>Last Played Track</h1>
  <p><strong>Track:</strong> ${trackName}</p>
  <p><strong>Artist:</strong> ${artistName}</p>
  <p><strong>Album:</strong> ${albumName}</p>
  <p><a href="${trackUrl}" target="_blank">Listen on Spotify</a></p>
  <h2>Enriched Information</h2>
  <p>${summary}</p>
</body>
</html>`;
    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html;charset=utf-8" },
    });
  }
};
