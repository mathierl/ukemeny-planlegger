// recipeAICache.js
// Small localStorage cache for "similar recipes" results, so navigating
// back to a recipe (or a re-render) doesn't re-call the AI service every
// time — see UKE-12's "don't hammer the API on every render" requirement.

const STORAGE_KEY = 'ukemeny-ai-similar-cache';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function readCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error('Error reading AI similarity cache:', error);
    return {};
  }
}

function writeCache(cache) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error writing AI similarity cache:', error);
  }
}

// `recipeCount` is a crude but cheap proxy for "has the candidate pool
// changed" — if the number of recipes differs from when this was cached,
// the result is stale and should be recomputed.
export function getCachedSimilar(recipeId, recipeCount) {
  const cache = readCache();
  const entry = cache[recipeId];
  if (!entry) return null;
  if (entry.recipeCount !== recipeCount) return null;
  if (Date.now() - entry.timestamp > TTL_MS) return null;
  return entry;
}

export function setCachedSimilar(recipeId, ids, recipeCount, source) {
  const cache = readCache();
  cache[recipeId] = { ids, recipeCount, source, timestamp: Date.now() };
  writeCache(cache);
}
