import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUkemeny } from './UkemenyContext';
import { FiClock, FiArrowLeft, FiShoppingCart, FiEdit, FiTrash2 } from 'react-icons/fi';
import RecipeEditForm from './RecipeEditForm';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipeId = parseInt(id);
  
  const { 
    oppskrifter, 
    leggTilMaaltid, 
    slettOppskrift, 
    oppdaterOppskrift,
    setFeilmelding 
  } = useUkemeny();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Find the recipe in the context
  useEffect(() => {
    const foundRecipe = oppskrifter.find(r => r.id === recipeId);
    
    if (foundRecipe) {
      setRecipe(foundRecipe);
      setLoading(false);
    } else {
      setLoading(false);
      setFeilmelding('Oppskriften ble ikke funnet. Den kan ha blitt slettet.');
    }
  }, [recipeId, oppskrifter, setFeilmelding]);
  
  // Calculate total price
  const calculateTotalPrice = (ingredients) => {
    return ingredients.reduce((sum, ingredient) => sum + ingredient.pris, 0);
  };
  
  // Handle add to menu
  const handleAddToMenu = () => {
    if (recipe) {
      leggTilMaaltid(recipe);
      
      // Show success message
      const successAlert = document.createElement('div');
      successAlert.className = 'fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 animate-fadeIn';
      successAlert.innerHTML = `
        <div class="flex items-center">
          <div class="py-1"><svg class="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
          <span>Lagt til i ukemeny!</span>
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
  
  // Handle delete recipe
  const handleDeleteRecipe = () => {
    if (confirmDelete) {
      const result = slettOppskrift(recipeId);
      if (result) {
        navigate('/recipes');
      }
    } else {
      setConfirmDelete(true);
    }
  };
  
  // Handle edit mode
  const handleEditClick = () => {
    setEditMode(true);
  };
  
  // Handle save edit
  const handleSaveEdit = (updatedRecipe) => {
    const result = oppdaterOppskrift(recipeId, updatedRecipe);
    if (result) {
      setRecipe(updatedRecipe);
      setEditMode(false);
      
      // Show success message
      const successAlert = document.createElement('div');
      successAlert.className = 'fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 animate-fadeIn';
      successAlert.innerHTML = `
        <div class="flex items-center">
          <div class="py-1"><svg class="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
          <span>Oppskrift oppdatert!</span>
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
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditMode(false);
  };
  
  // Handle back button
  const handleBack = () => {
    navigate('/recipes');
  };
  
  // Get difficulty class
  const getDifficultyClass = (level) => {
    switch (level) {
      case 'Enkel':
        return 'bg-green-100 text-green-800';
      case 'Middels':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avansert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Oppskrift ikke funnet</h2>
            <p className="text-gray-600 mb-6">Oppskriften du leter etter ble ikke funnet eller har blitt slettet.</p>
            <button
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
              onClick={handleBack}
            >
              <FiArrowLeft className="mr-2" />
              Tilbake til oppskrifter
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // If in edit mode, show the edit form
  if (editMode) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <RecipeEditForm 
            recipe={recipe} 
            onSave={handleSaveEdit} 
            onCancel={handleCancelEdit} 
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Recipe Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="h-64 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            {recipe.bilde ? (
              <img 
                src={recipe.bilde} 
                alt={recipe.navn} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white text-7xl">🍲</span>
              </div>
            )}
            <button
              className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition"
              onClick={handleBack}
            >
              <FiArrowLeft size={20} className="text-indigo-700" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-800">{recipe.navn}</h1>
              
              <div className="flex space-x-2">
                <button
                  className="text-indigo-600 border border-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition"
                  title="Rediger oppskrift"
                  onClick={handleEditClick}
                >
                  <FiEdit size={18} />
                </button>
                
                <button
                  className={`p-2 rounded-lg transition ${
                    confirmDelete 
                      ? 'bg-red-600 text-white' 
                      : 'text-red-600 border border-red-600 hover:bg-red-50'
                  }`}
                  onClick={handleDeleteRecipe}
                  title={confirmDelete ? 'Bekreft sletting' : 'Slett oppskrift'}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                <FiClock className="mr-1" size={16} />
                {recipe.tidsbruk}
              </div>
              
              <div className={`px-3 py-1 rounded-full ${getDifficultyClass(recipe.vanskelighetsgrad)}`}>
                {recipe.vanskelighetsgrad}
              </div>
              
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                {calculateTotalPrice(recipe.ingredienser)} kr
              </div>
              
              {recipe.allergener && recipe.allergener.length > 0 && recipe.allergener.map((allergen, index) => (
                <div key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                  {allergen}
                </div>
              ))}
            </div>
            
            <button
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition flex items-center justify-center"
              onClick={handleAddToMenu}
            >
              <FiShoppingCart className="mr-2" size={18} />
              Legg til i ukemeny
            </button>
          </div>
        </div>
        
        {/* Recipe Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ingredients */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Ingredienser</h2>
              
              <ul className="space-y-3">
                {recipe.ingredienser.map((ingredient, index) => (
                  <li key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <div>
                      <span className="font-medium">{ingredient.navn}</span>
                      {ingredient.mengde && (
                        <span className="text-gray-600 text-sm block">{ingredient.mengde}</span>
                      )}
                    </div>
                    <span className="text-indigo-600 font-medium">{ingredient.pris} kr</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="font-medium text-gray-700">Totalt:</span>
                <span className="text-lg font-bold text-indigo-600">
                  {calculateTotalPrice(recipe.ingredienser)} kr
                </span>
              </div>
            </div>
          </div>
          
          {/* Steps */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Fremgangsmåte</h2>
              
              <ol className="space-y-6">
                {recipe.fremgangsmaate.map((step, index) => (
                  <li key={index} className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-gray-700">{step}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;