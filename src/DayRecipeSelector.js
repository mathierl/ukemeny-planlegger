import React, { useState, useEffect } from 'react';
import { useUkemeny } from './UkemenyContext';
import { FiX, FiSearch, FiPlus, FiClock } from 'react-icons/fi';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-hidden">
        <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Velg måltid for {dayName}</h2>
          <button 
            className="text-white hover:text-indigo-200 transition"
            onClick={onClose}
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Current recipe with proper styling */}
          {hasRecipe && (
            <div className="mb-6 overflow-hidden rounded-lg">
              <div className="flex overflow-hidden">
                {/* Image section - stays left aligned */}
                <div className="w-1/3 h-32 overflow-hidden">
                  {currentRecipe.bilde ? (
                    <img 
                      src={currentRecipe.bilde} 
                      alt={currentRecipe.navn} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-blue-400 to-indigo-500 w-full h-full flex items-center justify-center">
                      <span className="text-white text-3xl">🍲</span>
                    </div>
                  )}
                </div>
                
                {/* Content section - text centered */}
                <div className="flex-grow bg-indigo-50 p-4 flex flex-col items-center justify-center relative">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-1 text-center">
                    Nåværende måltid
                  </h3>
                  <h4 className="font-medium text-lg text-center">{currentRecipe.navn}</h4>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <FiClock className="mr-1" size={14} />
                    {currentRecipe.tidsbruk}
                    <span className="mx-2">•</span>
                    <span className="font-semibold text-indigo-600">{calculateTotalPrice(currentRecipe.ingredienser)} kr</span>
                  </div>
                  
                  {/* Remove button - positioned absolute right */}
                  <button
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition flex items-center text-sm"
                    onClick={handleRemoveRecipe}
                  >
                    <FiX size={14} className="mr-1" />
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
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              value={sokeord}
              onChange={(e) => setSokeord(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
          
          <div className="overflow-y-auto max-h-96 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtrerteOppskrifter.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-gray-500">
                Ingen oppskrifter funnet. Prøv et annet søkeord.
              </div>
            ) : (
              filtrerteOppskrifter.map(oppskrift => (
                <div 
                  key={oppskrift.id} 
                  className="border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer hover:border-indigo-300 overflow-hidden flex"
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
                      <div className="bg-gradient-to-r from-blue-400 to-indigo-500 w-full h-full flex items-center justify-center">
                        <span className="text-white text-3xl">🍲</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex-grow">
                    <h3 className="font-medium">{oppskrift.navn}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <FiClock className="mr-1" size={14} />
                      {oppskrift.tidsbruk}
                      <span className="mx-2">•</span>
                      <span className="font-semibold text-indigo-600">{calculateTotalPrice(oppskrift.ingredienser)} kr</span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {oppskrift.vanskelighetsgrad} • {oppskrift.ingredienser.length} ingredienser
                      </span>
                      <div className="bg-indigo-100 text-indigo-600 rounded-full p-1">
                        <FiPlus size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="border-t p-4 flex justify-end">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
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