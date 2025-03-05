import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUkemeny } from './UkemenyContext';
import RecipeForm from './RecipeForm';
import { FiSearch, FiPlusCircle, FiChevronDown, FiChevronUp, FiInfo, FiX, FiTrash2, FiEdit, FiCheck } from 'react-icons/fi';

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

  // Filter recipes based on search term
  useEffect(() => {
    const filtrerte = oppskrifter.filter(oppskrift => 
      oppskrift.navn.toLowerCase().includes(sokeord.toLowerCase())
    );
    setFiltrerteOppskrifter(filtrerte);
  }, [sokeord, oppskrifter]);

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
      successAlert.className = 'fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 animate-fadeIn';
      successAlert.innerHTML = `
        <div class="flex items-center">
          <div class="py-1"><svg class="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
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
        successAlert.className = 'fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 animate-fadeIn';
        successAlert.innerHTML = `
          <div class="flex items-center">
            <div class="py-1"><svg class="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Oppskrifter
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Bla gjennom oppskrifter eller legg til nye som passer for personer med cøliaki og melkeproteinallergi.
          </p>
        </header>
        
        {/* Alert message */}
        {feilmelding && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow">
            <div className="flex items-center">
              <FiInfo className="mr-2 flex-shrink-0" size={20} />
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
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex flex-wrap gap-4 justify-between items-center">
                <div className="w-full md:w-auto">
                  <button
                    className="flex items-center w-full md:w-auto text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
                    onClick={() => setVisOppskriftForm(true)}
                  >
                    <FiPlusCircle className="mr-2" size={18} />
                    Legg til ny oppskrift
                  </button>
                </div>
                
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Søk etter oppskrifter..."
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    value={sokeord}
                    onChange={(e) => setSokeord(e.target.value)}
                  />
                  <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={18} />
                </div>
              </div>
            </div>
          </div>
          
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
            <div className="md:col-span-2 lg:col-span-3 text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 text-lg mb-2">
                Ingen oppskrifter funnet
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Prøv et annet søkeord eller legg til nye oppskrifter
              </p>
              <button
                className="flex items-center mx-auto text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
                onClick={() => setVisOppskriftForm(true)}
              >
                <FiPlusCircle className="mr-2" size={18} />
                Legg til ny oppskrift
              </button>
            </div>
          ) : (
            filtrerteOppskrifter.map((oppskrift) => (
              <div 
                key={oppskrift.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => navigateToRecipe(oppskrift.id)}
              >
                <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                  {oppskrift.bilde ? (
                    <img 
                      src={oppskrift.bilde} 
                      alt={oppskrift.navn} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-xl font-medium">🍲</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{oppskrift.navn}</h3>
                    
                    {/* Delete button with confirmation */}
                    <div className="flex space-x-1">
                      {bekrefteSletting === oppskrift.id ? (
                        <div className="flex space-x-1">
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={(e) => handleDeleteRecipe(oppskrift.id, e)}
                            title="Bekreft sletting"
                          >
                            <FiCheck className="text-green-600" size={18} />
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-800"
                            onClick={cancelDelete}
                            title="Avbryt"
                          >
                            <FiX className="text-red-600" size={18} />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => handleDeleteRecipe(oppskrift.id, e)}
                          title="Slett oppskrift"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-500">{oppskrift.tidsbruk}</span>
                    </div>
                    <span className="text-sm font-semibold text-indigo-600">
                      {oppskrift.ingredienser.reduce((sum, i) => sum + i.pris, 0)} kr
                    </span>
                  </div>
                  <button 
                    className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
                    onClick={(e) => handleAddToMenu(oppskrift, e)}
                  >
                    Legg til i ukemeny
                  </button>
                  
                  <div className="mt-2 flex justify-center">
                    <span className="text-sm text-indigo-600">
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