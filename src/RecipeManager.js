import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUkemeny } from './UkemenyContext';
import RecipeForm from './RecipeForm';
import { TbSearch, TbCirclePlus, TbInfoCircle, TbX, TbTrash, TbCheck, TbSoup, TbClock, TbAlertTriangle } from 'react-icons/tb';
import DietTags from './DietTags';
import { TAG_CATEGORIES, parseTag } from './tagUtils';

const RecipeManager = () => {
  const navigate = useNavigate();

  const {
    oppskrifter,
    leggTilMaaltid,
    leggTilOppskrift,
    slettOppskrift,
    feilmelding,
    setFeilmelding
  } = useUkemeny();

  const [sokeord, setSokeord] = useState('');
  const [filtrerteOppskrifter, setFiltrerteOppskrifter] = useState(oppskrifter);
  const [visOppskriftForm, setVisOppskriftForm] = useState(false);
  const [bekrefteSletting, setBekrefteSletting] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [excludedAllergens, setExcludedAllergens] = useState([]);

  // Unique tags/allergens across all recipes, for the filter panels below.
  // Recomputed whenever the recipe list changes rather than memoized: this
  // list is small (a home cook's own recipes), so the cost is negligible.
  const availableTags = Array.from(new Set(oppskrifter.flatMap(r => r.tags || [])));
  const availableAllergens = Array.from(new Set(oppskrifter.flatMap(r => r.allergener || [])));
  const tagsByCategory = TAG_CATEGORIES
    .map(cat => ({ ...cat, values: availableTags.filter(t => parseTag(t).category === cat.key) }))
    .filter(group => group.values.length > 0);

  const toggleTag = (tag) => {
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
  };

  const toggleAllergen = (allergen) => {
    setExcludedAllergens(prev => (prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]));
  };

  const resetFilters = () => {
    setSelectedTags([]);
    setExcludedAllergens([]);
  };

  // Filter recipes based on search term, selected tags (match any), and
  // excluded allergens (hide recipes containing any of them)
  useEffect(() => {
    const filtrerte = oppskrifter.filter(oppskrift => {
      const matcherSok = oppskrift.navn.toLowerCase().includes(sokeord.toLowerCase());
      const matcherTagger = selectedTags.length === 0 || (oppskrift.tags || []).some(t => selectedTags.includes(t));
      const erAllergivennlig = excludedAllergens.length === 0 || !(oppskrift.allergener || []).some(a => excludedAllergens.includes(a));
      return matcherSok && matcherTagger && erAllergivennlig;
    });
    setFiltrerteOppskrifter(filtrerte);
  }, [sokeord, oppskrifter, selectedTags, excludedAllergens]);

  // Navigate to recipe detail page
  const navigateToRecipe = (id) => {
    navigate(`/recipes/${id}`);
  };

  // Handle adding a new recipe
  const handleAddRecipe = (nyOppskrift) => {
    const result = leggTilOppskrift(nyOppskrift);
    if (result) {
      setVisOppskriftForm(false);
      // Show success message
      const successAlert = document.createElement('div');
      successAlert.className = 'fixed top-4 right-4 bg-moss-50 border-l-4 border-moss-500 text-moss-800 p-4 rounded-xl shadow-lg z-50 animate-fadeIn';
      successAlert.innerHTML = `
        <div class="flex items-center">
          <div class="py-1"><svg class="fill-current h-6 w-6 text-moss-600 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
          <span>Oppskrift lagret!</span>
        </div>
      `;
      document.body.appendChild(successAlert);

      setTimeout(() => {
        successAlert.classList.add('animate-fadeOut');
        setTimeout(() => {
          document.body.removeChild(successAlert);
        }, 300);
      }, 3000);
    }
  };

  // Handle recipe deletion
  const handleDeleteRecipe = (id, e) => {
    e.stopPropagation(); // Prevent navigation to detail page when deleting

    if (bekrefteSletting === id) {
      // Actually delete the recipe
      const result = slettOppskrift(id);
      if (result) {
        setBekrefteSletting(null);
        // Show success message
        const successAlert = document.createElement('div');
        successAlert.className = 'fixed top-4 right-4 bg-moss-50 border-l-4 border-moss-500 text-moss-800 p-4 rounded-xl shadow-lg z-50 animate-fadeIn';
        successAlert.innerHTML = `
          <div class="flex items-center">
            <div class="py-1"><svg class="fill-current h-6 w-6 text-moss-600 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
            <span>Oppskrift slettet!</span>
          </div>
        `;
        document.body.appendChild(successAlert);

        setTimeout(() => {
          successAlert.classList.add('animate-fadeOut');
          setTimeout(() => {
            document.body.removeChild(successAlert);
          }, 300);
        }, 3000);
      }
    } else {
      // Ask for confirmation
      setBekrefteSletting(id);
    }
  };

  // Cancel deletion
  const cancelDelete = (e) => {
    e.stopPropagation(); // Prevent navigation
    setBekrefteSletting(null);
  };

  // Handle adding a recipe to the menu
  const handleAddToMenu = (oppskrift, e) => {
    e.stopPropagation(); // Prevent navigation
    leggTilMaaltid(oppskrift);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-charcoal mb-2">
            Oppskrifter
          </h1>
          <p className="text-charcoal-muted max-w-2xl mx-auto">
            Bla gjennom oppskrifter eller legg til nye som passer for personer med cøliaki og melkeproteinallergi.
          </p>
        </header>

        {/* Alert message */}
        {feilmelding && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mb-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <TbInfoCircle className="mr-2 flex-shrink-0" size={20} aria-hidden="true" />
              <span>{feilmelding}</span>
              <button
                className="ml-auto text-red-500 hover:text-red-700"
                onClick={() => setFeilmelding('')}
              >
                &times;
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Recipe actions panel */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-cream-300 p-6 mb-6">
              <div className="flex flex-wrap gap-4 justify-between items-center">
                <div className="w-full md:w-auto">
                  <button
                    className="flex items-center justify-center w-full md:w-auto text-sm bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 px-4 py-2 rounded-xl transition-colors"
                    onClick={() => setVisOppskriftForm(true)}
                  >
                    <TbCirclePlus className="mr-2" size={18} aria-hidden="true" />
                    Legg til ny oppskrift
                  </button>
                </div>

                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Søk etter oppskrifter..."
                    className="w-full p-3 pl-10 border border-cream-400 rounded-xl focus:ring-2 focus:ring-terracotta-400 focus:border-terracotta-400 outline-none transition"
                    value={sokeord}
                    onChange={(e) => setSokeord(e.target.value)}
                  />
                  <TbSearch className="absolute left-3 top-3.5 text-charcoal-muted" size={18} aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>

          {/* Allergy-friendly filter — kept visually separate and more
              prominent than the general tag filter below, since this is
              safety-relevant rather than just organizational */}
          {availableAllergens.length > 0 && (
            <div className="md:col-span-2 lg:col-span-3">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-red-800 mb-1 flex items-center gap-2">
                  <TbAlertTriangle size={20} aria-hidden="true" />
                  Allergivennlig filter
                </h2>
                <p className="text-sm text-red-700 mb-3">
                  Skjul oppskrifter som inneholder valgte allergener
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableAllergens.map((allergen) => {
                    const isExcluded = excludedAllergens.includes(allergen);
                    return (
                      <button
                        key={allergen}
                        type="button"
                        onClick={() => toggleAllergen(allergen)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          isExcluded
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white text-red-700 border-red-300 hover:bg-red-100'
                        }`}
                      >
                        {allergen}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* General tag filter */}
          {tagsByCategory.length > 0 && (
            <div className="md:col-span-2 lg:col-span-3">
              <div className="bg-white border border-cream-300 rounded-2xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-charcoal mb-3">Filtrer etter tagger</h2>
                <div className="space-y-3">
                  {tagsByCategory.map((group) => (
                    <div key={group.key}>
                      <span className="text-xs font-medium text-charcoal-muted uppercase tracking-wide">{group.label}</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {group.values.map((tag) => {
                          const { value } = parseTag(tag);
                          const isSelected = selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleTag(tag)}
                              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                                isSelected
                                  ? 'bg-terracotta-600 text-cream-50 border-terracotta-600'
                                  : 'bg-cream-100 text-charcoal border-cream-300 hover:bg-cream-200'
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {(selectedTags.length > 0 || excludedAllergens.length > 0) && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-sm text-terracotta-600 hover:text-terracotta-800"
                    >
                      Nullstill filtre
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Add recipe form */}
          {visOppskriftForm && (
            <div className="md:col-span-2 lg:col-span-3">
              <RecipeForm
                onAddRecipe={handleAddRecipe}
                onCancel={() => setVisOppskriftForm(false)}
              />
            </div>
          )}

          {/* Recipe cards */}
          {filtrerteOppskrifter.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 text-center py-12 border-2 border-dashed border-cream-400 rounded-xl">
              <p className="text-charcoal-muted text-lg mb-2">
                Ingen oppskrifter funnet
              </p>
              <p className="text-sm text-charcoal-muted mb-4">
                Prøv et annet søkeord, juster filtrene, eller legg til nye oppskrifter
              </p>
              <button
                className="flex items-center mx-auto text-sm bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 px-4 py-2 rounded-xl transition-colors"
                onClick={() => setVisOppskriftForm(true)}
              >
                <TbCirclePlus className="mr-2" size={18} aria-hidden="true" />
                Legg til ny oppskrift
              </button>
            </div>
          ) : (
            filtrerteOppskrifter.map((oppskrift) => (
              <div
                key={oppskrift.id}
                className="bg-white rounded-2xl shadow-sm border border-cream-300 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                onClick={() => navigateToRecipe(oppskrift.id)}
              >
                <div className="h-32 bg-cream-400 flex items-center justify-center">
                  {oppskrift.bilde ? (
                    <img
                      src={oppskrift.bilde}
                      alt={oppskrift.navn}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <TbSoup size={32} className="text-terracotta-500" aria-hidden="true" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-charcoal">{oppskrift.navn}</h3>

                    {/* Delete button with confirmation */}
                    <div className="flex space-x-1">
                      {bekrefteSletting === oppskrift.id ? (
                        <div className="flex space-x-1">
                          <button
                            className="text-moss-600 hover:text-moss-800"
                            onClick={(e) => handleDeleteRecipe(oppskrift.id, e)}
                            title="Bekreft sletting"
                          >
                            <TbCheck size={18} aria-hidden="true" />
                          </button>
                          <button
                            className="text-charcoal-muted hover:text-charcoal"
                            onClick={cancelDelete}
                            title="Avbryt"
                          >
                            <TbX size={18} aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => handleDeleteRecipe(oppskrift.id, e)}
                          title="Slett oppskrift"
                        >
                          <TbTrash size={18} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>

                  <DietTags className="mt-2" />

                  {oppskrift.tags && oppskrift.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {oppskrift.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-cream-200 text-charcoal-muted text-xs px-2 py-0.5 rounded-full"
                        >
                          {parseTag(tag).value}
                        </span>
                      ))}
                      {oppskrift.tags.length > 3 && (
                        <span className="text-xs text-charcoal-muted px-1">
                          +{oppskrift.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center">
                      <TbClock className="text-charcoal-muted mr-1" size={16} aria-hidden="true" />
                      <span className="text-sm text-charcoal-muted">{oppskrift.tidsbruk}</span>
                    </div>
                    <span className="text-sm font-semibold text-terracotta-600">
                      {oppskrift.ingredienser.reduce((sum, i) => sum + i.pris, 0)} kr
                    </span>
                  </div>
                  <button
                    className="mt-4 w-full bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 py-2 rounded-xl transition-colors"
                    onClick={(e) => handleAddToMenu(oppskrift, e)}
                  >
                    Legg til i ukemeny
                  </button>

                  <div className="mt-2 flex justify-center">
                    <span className="text-sm text-terracotta-600">
                      Klikk for å se detaljer
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeManager;
