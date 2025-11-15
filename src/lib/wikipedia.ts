/**
 * Wikipedia API Integration
 * Fetches Wikipedia data for songs and artists
 */

interface WikipediaSearchResult {
  title: string;
  pageid: number;
}

interface WikipediaPage {
  title: string;
  extract: string;
  content?: string;
}

/**
 * Search Wikipedia for a page
 */
async function searchWikipedia(query: string): Promise<WikipediaSearchResult | null> {
  try {
    const url = new URL('https://en.wikipedia.org/w/api.php');
    url.searchParams.set('action', 'query');
    url.searchParams.set('list', 'search');
    url.searchParams.set('srsearch', query);
    url.searchParams.set('format', 'json');
    url.searchParams.set('origin', '*');
    url.searchParams.set('srlimit', '1');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.query?.search && data.query.search.length > 0) {
      return {
        title: data.query.search[0].title,
        pageid: data.query.search[0].pageid,
      };
    }

    return null;
  } catch (error) {
    console.error('Wikipedia search error:', error);
    return null;
  }
}

/**
 * Get Wikipedia page content
 */
async function getWikipediaPage(title: string): Promise<WikipediaPage | null> {
  try {
    const url = new URL('https://en.wikipedia.org/w/api.php');
    url.searchParams.set('action', 'query');
    url.searchParams.set('titles', title);
    url.searchParams.set('prop', 'extracts|revisions');
    url.searchParams.set('rvprop', 'content');
    url.searchParams.set('explaintext', '1');
    url.searchParams.set('exsectionformat', 'plain');
    url.searchParams.set('format', 'json');
    url.searchParams.set('origin', '*');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.query?.pages) {
      const pages = Object.values(data.query.pages) as any[];
      if (pages.length > 0 && pages[0].extract) {
        return {
          title: pages[0].title,
          extract: pages[0].extract,
          content: pages[0].revisions?.[0]?.['*'] || '',
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Wikipedia page fetch error:', error);
    return null;
  }
}

/**
 * Get Wikipedia content for a song
 * Tries to find the song page first, then falls back to artist page
 */
export async function getWikipediaContentForSong(
  title: string,
  artist: string,
  album?: string
): Promise<{ content: string; source: 'song' | 'artist' | 'album'; title: string } | null> {
  // Try 1: Search for the specific song with artist
  let searchQuery = `"${title}" song "${artist}"`;
  let searchResult = await searchWikipedia(searchQuery);

  if (searchResult) {
    const page = await getWikipediaPage(searchResult.title);
    if (page && page.extract.length > 200) {
      return {
        content: page.extract,
        source: 'song',
        title: page.title,
      };
    }
  }

  // Try 2: Search for the album if provided
  if (album) {
    searchQuery = `"${album}" album "${artist}"`;
    searchResult = await searchWikipedia(searchQuery);

    if (searchResult) {
      const page = await getWikipediaPage(searchResult.title);
      if (page && page.extract.length > 200) {
        return {
          content: page.extract,
          source: 'album',
          title: page.title,
        };
      }
    }
  }

  // Try 3: Fall back to artist page
  searchQuery = `"${artist}" band OR "${artist}" musician`;
  searchResult = await searchWikipedia(searchQuery);

  if (searchResult) {
    const page = await getWikipediaPage(searchResult.title);
    if (page && page.extract.length > 100) {
      return {
        content: page.extract,
        source: 'artist',
        title: page.title,
      };
    }
  }

  return null;
}

/**
 * Get Wikipedia content for an artist
 */
export async function getWikipediaContentForArtist(artist: string): Promise<WikipediaPage | null> {
  const searchQuery = `"${artist}" band OR "${artist}" musician`;
  const searchResult = await searchWikipedia(searchQuery);

  if (searchResult) {
    return await getWikipediaPage(searchResult.title);
  }

  return null;
}
