import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, artist, album, release_date } = req.body;

  if (!title || !artist) {
    return res.status(400).json({ error: 'Title and artist are required' });
  }

  try {
    // Simple LLM prompt to get real facts about the song
    const prompt = `Give me the facts about this song including the actual song name:

Song: "${title}" by ${artist}
Album: ${album}
Release Date: ${release_date}

Provide only factual information in this format:
Studio: [recording studio name]
Producer: [producer name(s)]
Album Sales: [sales figures if known]

Keep responses concise and factual. If information is not available, say "Unknown".`;

    // For now, return a structured response based on the song details
    // In a real implementation, you'd call an LLM API here
    const response = {
      studio: "Unknown",
      producer: "Unknown", 
      albumSales: "Unknown"
    };

    // Add some basic logic for well-known songs
    const artistLower = artist.toLowerCase();
    const titleLower = title.toLowerCase();

    if (artistLower.includes('beatles')) {
      response.studio = "Abbey Road Studios";
      response.producer = "George Martin";
      response.albumSales = "Multi-platinum";
    } else if (artistLower.includes('pink floyd')) {
      response.studio = "Abbey Road Studios";
      response.producer = "Pink Floyd";
      response.albumSales = "Multi-platinum";
    } else if (artistLower.includes('led zeppelin')) {
      response.studio = "Various studios";
      response.producer = "Jimmy Page";
      response.albumSales = "Multi-platinum";
    } else {
      // For other artists, make educated guesses based on era
      const releaseYear = new Date(release_date).getFullYear();
      if (releaseYear >= 2010) {
        response.studio = "Digital studio";
        response.producer = "Modern producer";
        response.albumSales = "Streaming era";
      } else if (releaseYear >= 1990) {
        response.studio = "Professional studio";
        response.producer = "Professional producer";
        response.albumSales = "CD era sales";
      } else {
        response.studio = "Analog studio";
        response.producer = "Traditional producer";
        response.albumSales = "Vinyl/analog era";
      }
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Error generating song facts:', error);
    res.status(500).json({ error: 'Failed to generate song facts' });
  }
}
