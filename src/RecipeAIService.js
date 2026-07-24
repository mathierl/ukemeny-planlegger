import { GROQ_API_KEY } from './config';

// RecipeAIService.js
// Wraps Groq's OpenAI-compatible chat completions API for AI-powered
// recipe recommendations. Follows the same static-method + try/catch
// pattern as KassalApiService.
//
// Callers must always be prepared for this service to fail (missing key,
// network error, or a 429 rate limit) and fall back to
// recipeSimilarity.js's local scoring — see RecipeDetail.js. This service
// intentionally does not retry on 429, to avoid making rate limiting worse.
const BASE_URL = 'https://api.groq.com/openai/v1';

// Groq's model catalog changes fairly often; if requests start failing with
// a "model not found" error, check https://console.groq.com/docs/models
// and update this.
const MODEL = 'llama-3.3-70b-versatile';

class RecipeAIService {
  static #apiKey = GROQ_API_KEY;

  static isConfigured() {
    return Boolean(this.#apiKey);
  }

  static #getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.#apiKey}`
    };
  }

  static async #chatCompletion(messages) {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: this.#getHeaders(),
      body: JSON.stringify({
        model: MODEL,
        messages,
        response_format: { type: 'json_object' },
        temperature: 0.7
      })
    });

    if (response.status === 429) {
      const error = new Error('Rate limited by Groq API');
      error.rateLimited = true;
      throw error;
    }

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from Groq API');
    }

    return JSON.parse(content);
  }

  // Ranks `candidates` by similarity to `recipe` using the LLM to reason
  // about ingredients/flavor/technique rather than plain tag overlap.
  // `candidates` should already exclude `recipe` itself.
  static async getSimilarRecipes(recipe, candidates, limit = 3) {
    if (!this.isConfigured()) {
      throw new Error('Groq API key not configured');
    }

    try {
      const summarize = (r) => ({
        id: r.id,
        navn: r.navn,
        tags: r.tags || [],
        ingredienser: (r.ingredienser || []).map(i => i.navn)
      });

      const messages = [
        {
          role: 'system',
          content: 'Du er en kokk-assistent som finner oppskrifter som ligner hverandre basert på ingredienser, smaksprofil og tilberedningsmåte. Svar KUN med gyldig JSON.'
        },
        {
          role: 'user',
          content: JSON.stringify({
            instruks: `Finn de ${limit} oppskriftene fra "kandidater" som ligner mest på "malOppskrift". Returner et JSON-objekt med feltet "ids": en liste med oppskrift-IDer i rekkefølge fra mest til minst lik.`,
            malOppskrift: summarize(recipe),
            kandidater: candidates.map(summarize)
          })
        }
      ];

      const result = await this.#chatCompletion(messages);
      const ids = Array.isArray(result.ids) ? result.ids : [];

      // Map back to full recipe objects, preserving the AI's ranking, and
      // silently drop any ID it hallucinated that doesn't actually exist
      const candidateById = new Map(candidates.map(r => [r.id, r]));
      return ids
        .map(id => candidateById.get(id))
        .filter(Boolean)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting AI similar recipes:', error);
      throw error;
    }
  }

  // Proposes an original recipe idea (not copied from any single source)
  // that fits `desiredTags`, using the user's existing collection as
  // style/context. Every recipe in this app is gluten-free and dairy-free
  // by design (see CLAUDE.md), so the prompt enforces that constraint too.
  static async suggestNewRecipeIdea(existingRecipes, desiredTags = []) {
    if (!this.isConfigured()) {
      throw new Error('Groq API key not configured');
    }

    try {
      const summarize = (r) => ({
        navn: r.navn,
        tags: r.tags || [],
        ingredienser: (r.ingredienser || []).map(i => i.navn)
      });

      const messages = [
        {
          role: 'system',
          content: 'Du er en kreativ kokk-assistent som finner på originale, glutenfrie og melkefrie oppskrifter (aldri kopiert fra en enkelt kilde). Svar KUN med gyldig JSON.'
        },
        {
          role: 'user',
          content: JSON.stringify({
            instruks: 'Finn på en original oppskrift som passer valgte tagger. Oppskriften MÅ være glutenfri og melkefri. Returner et JSON-objekt med feltene: navn (string), tidsbruk (string, f.eks. "30 minutter"), vanskelighetsgrad (en av "Enkel", "Middels", "Avansert"), ingredienser (liste med objekter {navn, mengde}), fremgangsmaate (liste med steg som strenger), tags (liste med "kategori:verdi"-strenger, inkludert de valgte taggene og eventuelt flere relevante).',
            eksisterendeOppskrifter: existingRecipes.map(summarize),
            valgteTagger: desiredTags
          })
        }
      ];

      return await this.#chatCompletion(messages);
    } catch (error) {
      console.error('Error suggesting new recipe idea:', error);
      throw error;
    }
  }
}

export default RecipeAIService;
