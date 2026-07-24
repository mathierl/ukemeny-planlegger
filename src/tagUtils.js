// tagUtils.js
// Recipe tags are stored as flat "category:value" strings (e.g.
// "cuisine:italiensk"), giving lightweight grouping without a rigid schema.
// Kept separate from `allergener`, which is a distinct field for allergy-
// safety info and is filtered separately in the UI (see UKE-11).

export const TAG_CATEGORIES = [
  { key: 'cuisine', label: 'Kjøkken' },
  { key: 'mealType', label: 'Måltidstype' },
  { key: 'prepTime', label: 'Tilberedningstid' },
  { key: 'other', label: 'Annet' },
];

const CATEGORY_LABELS = Object.fromEntries(TAG_CATEGORIES.map(c => [c.key, c.label]));

// Splits a "category:value" tag into its parts. Tags without a recognized
// category prefix (or without a ":" at all) fall back to "other" with the
// whole string as the value, so malformed/legacy data still displays.
export function parseTag(tag) {
  const separatorIndex = tag.indexOf(':');
  if (separatorIndex === -1) {
    return { category: 'other', value: tag, label: CATEGORY_LABELS.other };
  }

  const category = tag.slice(0, separatorIndex);
  const value = tag.slice(separatorIndex + 1);
  const label = CATEGORY_LABELS[category];

  if (!label || !value) {
    return { category: 'other', value: tag, label: CATEGORY_LABELS.other };
  }

  return { category, value, label };
}

export function formatTag(category, value) {
  return `${category}:${value.trim()}`;
}
