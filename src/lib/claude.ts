import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || '',
});

interface SongwriterInfo {
  writers: string[];
  composer?: string;
  producer?: string;
  writerBackground: string;
  source: 'known' | 'inferred' | 'unknown';
}

interface ThematicAnalysis {
  primaryThemes: string[];
  songMeaning: string;
  culturalContext: string;
  lyricalApproach: string;
}

interface CriticalReview {
  opinion: string;
  strengths: string[];
  weaknesses: string[];
  verdict: string;
  rating: number; // 1-10
}

export interface EnhancedReview {
  songwriter_info: SongwriterInfo;
  thematic_analysis: ThematicAnalysis;
  critical_review: CriticalReview;
  sources_note: string;
}

// Research songwriter information
export async function researchSongwriters(trackData: {
  title: string;
  artists: string[];
  album: string;
  release_date: string;
}): Promise<SongwriterInfo> {
  if (!process.env.CLAUDE_API_KEY) {
    return {
      writers: ['Unknown'],
      writerBackground: 'Songwriter information unavailable',
      source: 'unknown'
    };
  }

  const prompt = `Research the songwriting credits for this song. I need FACTUAL information about who wrote it:

**Song**: "${trackData.title}" by ${trackData.artists.join(', ')}
**Album**: "${trackData.album}"
**Release Date**: ${trackData.release_date}

Provide:
1. **Primary Songwriter(s)**: Who wrote the lyrics/music?
2. **Producer**: Who produced the track?
3. **Writer Background**: Brief background on the main songwriter's style/other work

Be honest about what you know vs. don't know. If you're uncertain, say "likely" or "typically." Focus on:
- Actual songwriting credits (not just performers)
- Producer information if known
- The songwriter's typical themes/approach

Format as:
Writers: [names]
Producer: [name or "Unknown"]
Background: [2-3 sentences about the main songwriter's approach/other work]
Confidence: [High/Medium/Low]`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return parseSongwriterResponse(content.text);
    }
    
    return {
      writers: [trackData.artists[0] || 'Unknown'],
      writerBackground: 'Unable to research songwriter information',
      source: 'unknown'
    };
    
  } catch (error) {
    console.error('Songwriter research error:', error);
    return {
      writers: [trackData.artists[0] || 'Unknown'],
      writerBackground: 'Songwriter research temporarily unavailable',
      source: 'unknown'
    };
  }
}

// Analyze song themes and meaning
export async function analyzeThemes(trackData: {
  title: string;
  artists: string[];
  album: string;
  release_date: string;
}): Promise<ThematicAnalysis> {
  if (!process.env.CLAUDE_API_KEY) {
    return {
      primaryThemes: ['Unknown'],
      songMeaning: 'Thematic analysis unavailable',
      culturalContext: 'Context unavailable',
      lyricalApproach: 'Unknown approach'
    };
  }

  const prompt = `Analyze the thematic content and meaning of this song:

**Song**: "${trackData.title}" by ${trackData.artists.join(', ')}
**Album**: "${trackData.album}"
**Release Date**: ${trackData.release_date}

I want to understand what this song is ACTUALLY about. Provide:

1. **Primary Themes**: What are the main subjects/themes? (love, politics, rebellion, loss, etc.)
2. **Song Meaning**: What is the songwriter trying to say? What's the message?
3. **Cultural Context**: What was happening when this was written? How does it fit the era?
4. **Lyrical Approach**: Direct, metaphorical, narrative, abstract, etc.?

Focus on the CONTENT and MESSAGE, not just musical style. What human experiences or ideas does this explore?

Be specific about themes - don't just say "love" if it's about heartbreak, or "politics" if it's about war protest.

Format as:
Themes: [specific themes]
Meaning: [what the song is about - 2-3 sentences]
Context: [cultural/historical context - 1-2 sentences]
Approach: [how the lyrics work - 1 sentence]`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return parseThematicResponse(content.text);
    }
    
    return {
      primaryThemes: ['General themes'],
      songMeaning: 'Unable to analyze song meaning',
      culturalContext: 'Context analysis unavailable',
      lyricalApproach: 'Approach unknown'
    };
    
  } catch (error) {
    console.error('Thematic analysis error:', error);
    return {
      primaryThemes: ['Analysis unavailable'],
      songMeaning: 'Thematic analysis temporarily unavailable',
      culturalContext: 'Context unavailable',
      lyricalApproach: 'Unknown approach'
    };
  }
}

// Generate opinionated critical review
export async function generateCriticalReview(trackData: {
  title: string;
  artists: string[];
  album: string;
  release_date: string;
}, songwriterInfo: SongwriterInfo, thematicAnalysis: ThematicAnalysis): Promise<CriticalReview> {
  if (!process.env.CLAUDE_API_KEY) {
    return {
      opinion: 'Critical review unavailable',
      strengths: ['Unable to analyze'],
      weaknesses: ['Unable to analyze'],
      verdict: 'Review unavailable',
      rating: 0
    };
  }

  const prompt = `Write a critical review of this song. I want your HONEST OPINION - not diplomatic politeness.

**Song**: "${trackData.title}" by ${trackData.artists.join(', ')}
**Album**: "${trackData.album}"
**Writers**: ${songwriterInfo.writers.join(', ')}
**Themes**: ${thematicAnalysis.primaryThemes.join(', ')}
**What it's about**: ${thematicAnalysis.songMeaning}

I want a music critic who:
- Has strong opinions and isn't afraid to call out bad music
- Recognizes genuine artistry when it exists
- Explains WHY something works or doesn't work
- Considers songcraft, performance, production, and cultural impact
- Gives honest ratings - not everything is good

Address:
1. **What works**: Specific strengths (songwriting, performance, production, etc.)
2. **What doesn't work**: Honest critique of weaknesses or failures
3. **Overall assessment**: Is this genuinely good music? Why?
4. **Rating**: 1-10 score with justification

Be opinionated but fair. Call out mediocrity, celebrate excellence, explain your reasoning.

150-250 words. Write like someone who loves music and has high standards.

Format as:
Strengths: [bullet points]
Weaknesses: [bullet points]
Verdict: [your honest assessment - 2-3 sentences]
Rating: [1-10 with brief justification]`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return parseCriticalResponse(content.text);
    }
    
    return {
      opinion: 'Unable to generate critical review',
      strengths: ['Review unavailable'],
      weaknesses: ['Review unavailable'],
      verdict: 'Critical review unavailable',
      rating: 0
    };
    
  } catch (error) {
    console.error('Critical review error:', error);
    return {
      opinion: 'Critical review temporarily unavailable',
      strengths: ['Review unavailable'],
      weaknesses: ['Review unavailable'],
      verdict: 'Review temporarily unavailable',
      rating: 0
    };
  }
}

// Generate complete enhanced review
export async function generateEnhancedReview(trackData: {
  title: string;
  artists: string[];
  album: string;
  release_date: string;
  audioFeatures?: {
    tempo_bpm?: number;
    key?: string;
    mode?: 'major' | 'minor';
    energy?: number;
    danceability?: number;
    valence?: number;
  };
}): Promise<EnhancedReview> {
  try {
    const [songwriterInfo, thematicAnalysis] = await Promise.all([
      researchSongwriters(trackData),
      analyzeThemes(trackData)
    ]);
    
    const criticalReview = await generateCriticalReview(trackData, songwriterInfo, thematicAnalysis);
    
    return {
      songwriter_info: songwriterInfo,
      thematic_analysis: thematicAnalysis,
      critical_review: criticalReview,
      sources_note: 'Songwriter and factual information based on music database knowledge. Thematic analysis and critical opinions are interpretative.'
    };
  } catch (error) {
    console.error('Enhanced review error:', error);
    return {
      songwriter_info: {
        writers: [trackData.artists[0] || 'Unknown'],
        writerBackground: 'Information unavailable',
        source: 'unknown'
      },
      thematic_analysis: {
        primaryThemes: ['Analysis unavailable'],
        songMeaning: 'Unable to analyze',
        culturalContext: 'Context unavailable',
        lyricalApproach: 'Unknown'
      },
      critical_review: {
        opinion: 'Review unavailable',
        strengths: ['Analysis unavailable'],
        weaknesses: ['Analysis unavailable'],
        verdict: 'Review unavailable',
        rating: 0
      },
      sources_note: 'Enhanced review temporarily unavailable'
    };
  }
}

// Legacy function for backward compatibility
export async function generateTrackEnrichment(trackData: {
  title: string;
  artists: string[];
  album: string;
  release_date: string;
  audioFeatures?: {
    tempo_bpm?: number;
    key?: string;
    mode?: 'major' | 'minor';
    energy?: number;
    danceability?: number;
    valence?: number;
  };
}): Promise<string> {
  const enhancedReview = await generateEnhancedReview(trackData);
  
  // Format as readable text for backward compatibility
  return `**Songwriters**: ${enhancedReview.songwriter_info.writers.join(', ')}
**Producer**: ${enhancedReview.songwriter_info.producer || 'Unknown'}

**What it's about**: ${enhancedReview.thematic_analysis.songMeaning}

**Critical Assessment**: ${enhancedReview.critical_review.verdict}
**Rating**: ${enhancedReview.critical_review.rating}/10

*${enhancedReview.sources_note}*`;
}

// Helper functions to parse Claude responses
function parseSongwriterResponse(text: string): SongwriterInfo {
  const writers: string[] = [];
  let producer = '';
  let writerBackground = '';
  let confidence = 'medium';
  
  const lines = text.split('\n');
  for (const line of lines) {
    const cleanLine = line.trim();
    if (cleanLine.toLowerCase().includes('writers:')) {
      const writersText = cleanLine.replace(/.*writers?:\s*/i, '');
      writers.push(...writersText.split(',').map(w => w.trim()));
    } else if (cleanLine.toLowerCase().includes('producer:')) {
      producer = cleanLine.replace(/.*producer:\s*/i, '').trim();
    } else if (cleanLine.toLowerCase().includes('background:')) {
      writerBackground = cleanLine.replace(/.*background:\s*/i, '').trim();
    } else if (cleanLine.toLowerCase().includes('confidence:')) {
      confidence = cleanLine.replace(/.*confidence:\s*/i, '').toLowerCase().trim();
    }
  }
  
  return {
    writers: writers.length > 0 ? writers : ['Unknown'],
    producer: producer || undefined,
    writerBackground: writerBackground || 'Background information unavailable',
    source: confidence === 'high' ? 'known' : confidence === 'low' ? 'unknown' : 'inferred'
  };
}

function parseThematicResponse(text: string): ThematicAnalysis {
  const themes: string[] = [];
  let meaning = '';
  let context = '';
  let approach = '';
  
  const lines = text.split('\n');
  for (const line of lines) {
    const cleanLine = line.trim();
    if (cleanLine.toLowerCase().includes('themes:')) {
      const themesText = cleanLine.replace(/.*themes?:\s*/i, '');
      themes.push(...themesText.split(',').map(t => t.trim()));
    } else if (cleanLine.toLowerCase().includes('meaning:')) {
      meaning = cleanLine.replace(/.*meaning:\s*/i, '').trim();
    } else if (cleanLine.toLowerCase().includes('context:')) {
      context = cleanLine.replace(/.*context:\s*/i, '').trim();
    } else if (cleanLine.toLowerCase().includes('approach:')) {
      approach = cleanLine.replace(/.*approach:\s*/i, '').trim();
    }
  }
  
  return {
    primaryThemes: themes.length > 0 ? themes : ['General themes'],
    songMeaning: meaning || 'Song meaning analysis unavailable',
    culturalContext: context || 'Cultural context unavailable',
    lyricalApproach: approach || 'Lyrical approach unknown'
  };
}

function parseCriticalResponse(text: string): CriticalReview {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  let verdict = '';
  let rating = 0;
  
  const lines = text.split('\n');
  let currentSection = '';
  
  for (const line of lines) {
    const cleanLine = line.trim();
    if (cleanLine.toLowerCase().includes('strengths:')) {
      currentSection = 'strengths';
      const strengthsText = cleanLine.replace(/.*strengths?:\s*/i, '');
      if (strengthsText) strengths.push(strengthsText);
    } else if (cleanLine.toLowerCase().includes('weaknesses:')) {
      currentSection = 'weaknesses';
      const weaknessesText = cleanLine.replace(/.*weaknesses?:\s*/i, '');
      if (weaknessesText) weaknesses.push(weaknessesText);
    } else if (cleanLine.toLowerCase().includes('verdict:')) {
      currentSection = 'verdict';
      verdict = cleanLine.replace(/.*verdict:\s*/i, '').trim();
    } else if (cleanLine.toLowerCase().includes('rating:')) {
      currentSection = 'rating';
      const ratingText = cleanLine.replace(/.*rating:\s*/i, '');
      const ratingMatch = ratingText.match(/(\d+)/);
      if (ratingMatch) rating = parseInt(ratingMatch[1]);
    } else if (cleanLine.startsWith('-') || cleanLine.startsWith('•')) {
      const bulletPoint = cleanLine.replace(/^[-•]\s*/, '');
      if (currentSection === 'strengths') {
        strengths.push(bulletPoint);
      } else if (currentSection === 'weaknesses') {
        weaknesses.push(bulletPoint);
      }
    }
  }
  
  return {
    opinion: text, // Full text for now
    strengths: strengths.length > 0 ? strengths : ['Analysis unavailable'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['Analysis unavailable'],
    verdict: verdict || 'Critical assessment unavailable',
    rating: rating
  };
}
