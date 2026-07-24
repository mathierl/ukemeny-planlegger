import React, { useState } from 'react';
import { TbPlus, TbX } from 'react-icons/tb';
import { TAG_CATEGORIES, parseTag, formatTag } from './tagUtils';

// Shared tag editor for RecipeForm/RecipeEditForm — category select + value
// input, rendered tags as removable pills.
const TagInput = ({ tags, onChange }) => {
  const [category, setCategory] = useState(TAG_CATEGORIES[0].key);
  const [value, setValue] = useState('');

  const addTag = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const newTag = formatTag(category, trimmed);
    if (!tags.includes(newTag)) {
      onChange([...tags, newTag]);
    }
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <select
          className="p-3 border border-cream-300 bg-cream-50 rounded-xl focus:ring-2 focus:ring-terracotta-400 outline-none transition sm:w-40"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {TAG_CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>{c.label}</option>
          ))}
        </select>
        <input
          type="text"
          className="flex-grow p-3 border border-cream-300 bg-cream-50 rounded-xl focus:ring-2 focus:ring-terracotta-400 outline-none transition"
          placeholder="F.eks. Italiensk, Middag, Under 30 min..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={addTag}
          className="flex items-center justify-center px-4 py-2 bg-terracotta-100 text-terracotta-700 hover:bg-terracotta-200 rounded-xl transition-colors"
          title="Legg til tag"
        >
          <TbPlus size={18} aria-hidden="true" />
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const { label, value: tagValue } = parseTag(tag);
            return (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 bg-cream-200 border border-cream-400 text-charcoal text-sm px-3 py-1 rounded-full"
              >
                <span className="text-charcoal-muted">{label}:</span> {tagValue}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-charcoal-muted hover:text-charcoal"
                >
                  <TbX size={14} aria-hidden="true" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TagInput;
