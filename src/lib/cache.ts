// Simple in-memory cache for Claude-generated content
// In production, you'd want to use Redis or similar

interface CacheEntry {
  content: string;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Debug cache state
console.log('Cache module loaded/reloaded');

export function getCachedContent(trackId: string): string | null {
  console.log(`Cache check for track ${trackId}, cache size: ${cache.size}`);
  const entry = cache.get(trackId);
  if (!entry) {
    console.log(`Cache MISS for track ${trackId}`);
    return null;
  }
  
  // Check if cache is still valid
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    console.log(`Cache EXPIRED for track ${trackId}`);
    cache.delete(trackId);
    return null;
  }
  
  console.log(`Cache HIT for track ${trackId}`);
  return entry.content;
}

export function setCachedContent(trackId: string, content: string): void {
  console.log(`Caching content for track ${trackId}, cache size before: ${cache.size}`);
  cache.set(trackId, {
    content,
    timestamp: Date.now(),
  });
  console.log(`Cached content for track ${trackId}, cache size after: ${cache.size}`);
  
  // Clean up old entries periodically
  if (cache.size > 100) {
    const cutoff = Date.now() - CACHE_DURATION;
    for (const [key, entry] of cache.entries()) {
      if (entry.timestamp < cutoff) {
        cache.delete(key);
      }
    }
    console.log(`Cache cleanup completed, final size: ${cache.size}`);
  }
}
