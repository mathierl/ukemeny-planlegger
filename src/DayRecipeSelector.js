import React, { useState, useEffect } from 'react';
import { useUkemeny } from './UkemenyContext';
import { TbX, TbSearch, TbPlus, TbClock, TbSoup } from 'react-icons/tb';

const DayRecipeSelector = ({ dayIndex, dayName, onClose }) => {
  const context = useUkemeny();

  const {
    oppskrifter,
    valgteMaaltider,
    fjernMaaltid
  } = context;

  // Direct access to the function, avoiding potential destructuring issues
  const leggTilMaaltidTilDag = context.leggTilMaaltidTilDag;

  const [sokeord, setSokeord] = useState('');
  const [filtrerteOppskrifter, setFiltrerteOppskrifter] = useState(oppskrifter);

  // Filter recipes based on search term
  useEffect(() => {
    const filtrerte = oppskrifter.filter(oppskrift =>
      oppskrift.navn.toLowerCase().includes(sokeord.toLowerCase())
    );
    setFiltrerteOppskrifter(filtrerte);
  }, [sokeord, oppskrifter]);

  // Check if this day already has a recipe
  const hasRecipe = dayIndex < valgteMaaltider.length && valgteMaaltider[dayIndex] !== null;
  const currentRecipe = hasRecipe ? valgteMaaltider[dayIndex] : null;

  // Handle selecting a recipe for this day
  const handleSelectRecipe = (recipe) => {
    // Adding a recipe directly via the context object as fallback
    if (typeof leggTilMaaltidTilDag === 'function') {
      leggTilMaaltidTilDag(recipe, dayIndex);
    } else {
      // Direct update as fallback
      const nyeMaaltider = [...valgteMaaltider];
      while (nyeMaaltider.length < dayIndex) {
        nyeMaaltider.push(null);
      }
      nyeMaaltider[dayIndex] = recipe;
      context.setValgteMaaltider(nyeMaaltider);
    }

    onClose();
  };

  // Handle removing the recipe from this day
  const handleRemoveRecipe = () => {
    if (hasRecipe) {
      fjernMaaltid(dayIndex);
      onClose();
    }
  };

  // Calculate total price of ingredients
  const calculateTotalPrice = (ingredients) => {
    return ingredients.reduce((sum, ingredient) => sum + ingredient.pris, 0);
  };

  return (
    <div className="fixed inset-0 bg-charcoal/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl max-h-screen overflow-hidden">
        <div className="bg-terracotta-500 text-cream-50 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Velg måltid for {dayName}</h2>
          <button
            className="text-cream-50 hover:text-cream-200 transition-colors"
            onClick={onClose}
          >
            <TbX size={24} aria-hidden="true" />
          </button>
        </div>

        <div className="p-6">
          {/* Current recipe with proper styling */}
          {hasRecipe && (
            <div className="mb-6 overflow-hidden rounded-xl">
              <div className="flex flex-col sm:flex-row overflow-hidden">
                {/* Image section */}
                <div className="w-full sm:w-1/3 h-32 overflow-hidden flex-shrink-0">
                  {currentRecipe.bilde ? (
                    <img
                      src={currentRecipe.bilde}
                      alt={currentRecipe.navn}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-cream-400 w-full h-full flex items-center justify-center">
                      <TbSoup size={32} className="text-terracotta-500" aria-hidden="true" />
                    </div>
                  )}
                </div>

                {/* Content section - text centered, button in normal flow (not
                    absolutely positioned) so it can't overlap the heading on
                    narrow screens */}
                <div className="flex-grow bg-cream-100 p-4 flex flex-col items-center justify-center gap-2 text-center">
                  <h3 className="text-lg font-semibold text-terracotta-700">
                    Nåværende måltid
                  </h3>
                  <h4 className="font-medium text-lg text-charcoal">{currentRecipe.navn}</h4>
                  <div className="flex items-center text-sm text-charcoal-muted">
                    <TbClock className="mr-1" size={14} aria-hidden="true" />
                    {currentRecipe.tidsbruk}
                    <span className="mx-2">•</span>
                    <span className="font-semibold text-terracotta-600">{calculateTotalPrice(currentRecipe.ingredienser)} kr</span>
                  </div>

                  <button
                    className="mt-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl transition-colors flex items-center text-sm"
                    onClick={handleRemoveRecipe}
                  >
                    <TbX size={14} className="mr-1" aria-hidden="true" />
                    Fjern
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Søk etter oppskrifter..."
              className="w-full p-3 pl-10 border border-cream-400 rounded-xl focus:ring-2 focus:ring-terracotta-400 focus:border-terracotta-400 outline-none transition"
              value={sokeord}
              onChange={(e) => setSokeord(e.target.value)}
            />
            <TbSearch className="absolute left-3 top-3.5 text-charcoal-muted" size={18} aria-hidden="true" />
          </div>

          <div className="overflow-y-auto max-h-96 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtrerteOppskrifter.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-charcoal-muted">
                Ingen oppskrifter funnet. Prøv et annet søkeord.
              </div>
            ) : (
              filtrerteOppskrifter.map(oppskrift => (
                <div
                  key={oppskrift.id}
                  className="border border-cream-300 rounded-xl hover:shadow-md transition-shadow cursor-pointer hover:border-terracotta-300 overflow-hidden flex"
                  onClick={() => handleSelectRecipe(oppskrift)}
                >
                  <div className="w-1/3 h-full overflow-hidden">
                    {oppskrift.bilde ? (
                      <img
                        src={oppskrift.bilde}
                        alt={oppskrift.navn}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="bg-cream-400 w-full h-full flex items-center justify-center">
                        <TbSoup size={32} className="text-terracotta-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex-grow">
                    <h3 className="font-medium text-charcoal">{oppskrift.navn}</h3>
                    <div className="flex items-center mt-1 text-sm text-charcoal-muted">
                      <TbClock className="mr-1" size={14} aria-hidden="true" />
                      {oppskrift.tidsbruk}
                      <span className="mx-2">•</span>
                      <span className="font-semibold text-terracotta-600">{calculateTotalPrice(oppskrift.ingredienser)} kr</span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-charcoal-muted">
                        {oppskrift.vanskelighetsgrad} • {oppskrift.ingredienser.length} ingredienser
                      </span>
                      <div className="bg-terracotta-100 text-terracotta-600 rounded-full p-1">
                        <TbPlus size={16} aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-cream-300 p-4 flex justify-end">
          <button
            className="px-4 py-2 border border-cream-400 rounded-xl text-charcoal hover:bg-cream-100 transition-colors"
            onClick={onClose}
          >
            Avbryt
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayRecipeSelector;
