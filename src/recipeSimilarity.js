// recipeSimilarity.js
// Local tag/ingredient similarity scoring — the fallback used when
// RecipeAIService is unavailable, unconfigured, or rate-limited. Purely
// deterministic, no network calls, so it always works.

function toIngredientSet(recipe) {
  return new Set((recipe.ingredienser || []).map((i) => i.navn.toLowerCase().trim()));
}

function toTagSet(recipe) {
  return new Set(recipe.tags || []);
}

// Jaccard-style overlap: shared items / size of the larger set, so a
// recipe with many extra unrelated ingredients doesn't score as "similar"
// just by having a few in common.
function overlapScore(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let shared = 0;
  for (const item of setA) {
    if (setB.has(item)) shared += 1;
  }
  return shared / Math.max(setA.size, setB.size);
}

// `candidates` should already exclude `recipe` itself, but this also
// defensively filters it out in case a caller forgets.
export function findSimilarRecipesLocally(recipe, candidates, limit = 3) {
  const targetTags = toTagSet(recipe);
  const targetIngredients = toIngredientSet(recipe);

  const scored = candidates
    .filter((r) => r.id !== recipe.id)
    .map((r) => {
      const tagScore = overlapScore(targetTags, toTagSet(r));
      const ingredientScore = overlapScore(targetIngredients, toIngredientSet(r));
      // Tags are a more deliberate similarity signal than incidental
      // shared ingredients (e.g. "salt"), so weight them higher
      const score = tagScore * 0.6 + ingredientScore * 0.4;
      return { recipe: r, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ recipe: r }) => r);
}
