import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUkemeny } from './UkemenyContext';
import { TbClock, TbArrowLeft, TbShoppingCart, TbEdit, TbTrash, TbSoup } from 'react-icons/tb';
import RecipeEditForm from './RecipeEditForm';
import DietTags from './DietTags';
import { parseTag } from './tagUtils';

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
      successAlert.className = 'fixed top-4 right-4 bg-moss-50 border-l-4 border-moss-500 text-moss-800 p-4 rounded-xl shadow-lg z-50 animate-fadeIn';
      successAlert.innerHTML = `
        <div class="flex items-center">
          <div class="py-1"><svg class="fill-current h-6 w-6 text-moss-600 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
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
      successAlert.className = 'fixed top-4 right-4 bg-moss-50 border-l-4 border-moss-500 text-moss-800 p-4 rounded-xl shadow-lg z-50 animate-fadeIn';
      successAlert.innerHTML = `
        <div class="flex items-center">
          <div class="py-1"><svg class="fill-current h-6 w-6 text-moss-600 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
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
        return 'bg-moss-100 text-moss-800';
      case 'Middels':
        return 'bg-terracotta-100 text-terracotta-800';
      case 'Avansert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-cream-300 text-charcoal';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta-500"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-md border border-cream-300 p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Oppskrift ikke funnet</h2>
            <p className="text-charcoal-muted mb-6">Oppskriften du leter etter ble ikke funnet eller har blitt slettet.</p>
            <button
              className="inline-flex items-center px-4 py-2 bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 rounded-xl transition-colors"
              onClick={handleBack}
            >
              <TbArrowLeft className="mr-2" aria-hidden="true" />
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
      <div className="min-h-screen py-12 px-4">
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
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Recipe Header */}
        <div className="bg-white rounded-2xl shadow-md border border-cream-300 overflow-hidden mb-6">
          <div className="h-64 bg-cream-400 relative flex items-center justify-center">
            {recipe.bilde ? (
              <img
                src={recipe.bilde}
                alt={recipe.navn}
                className="w-full h-full object-cover"
              />
            ) : (
              <TbSoup size={64} className="text-terracotta-500" aria-hidden="true" />
            )}
            <button
              className="absolute top-4 left-4 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              onClick={handleBack}
            >
              <TbArrowLeft size={20} className="text-terracotta-700" aria-hidden="true" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-charcoal">{recipe.navn}</h1>

              <div className="flex space-x-2">
                <button
                  className="text-terracotta-600 border border-terracotta-600 hover:bg-terracotta-50 p-2 rounded-xl transition-colors"
                  title="Rediger oppskrift"
                  onClick={handleEditClick}
                >
                  <TbEdit size={18} aria-hidden="true" />
                </button>

                <button
                  className={`p-2 rounded-xl transition-colors ${
                    confirmDelete
                      ? 'bg-red-600 text-white'
                      : 'text-red-600 border border-red-600 hover:bg-red-50'
                  }`}
                  onClick={handleDeleteRecipe}
                  title={confirmDelete ? 'Bekreft sletting' : 'Slett oppskrift'}
                >
                  <TbTrash size={18} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="flex items-center bg-terracotta-100 text-terracotta-800 px-3 py-1 rounded-full">
                <TbClock className="mr-1" size={16} aria-hidden="true" />
                {recipe.tidsbruk}
              </div>

              <div className={`px-3 py-1 rounded-full ${getDifficultyClass(recipe.vanskelighetsgrad)}`}>
                {recipe.vanskelighetsgrad}
              </div>

              <div className="bg-moss-100 text-moss-800 px-3 py-1 rounded-full">
                {calculateTotalPrice(recipe.ingredienser)} kr
              </div>

              <DietTags />

              {recipe.allergener && recipe.allergener.length > 0 && recipe.allergener.map((allergen, index) => (
                <div key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                  {allergen}
                </div>
              ))}
            </div>

            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {recipe.tags.map((tag) => {
                  const { label, value } = parseTag(tag);
                  return (
                    <span
                      key={tag}
                      className="bg-cream-200 text-charcoal text-sm px-3 py-1 rounded-full"
                    >
                      <span className="text-charcoal-muted">{label}:</span> {value}
                    </span>
                  );
                })}
              </div>
            )}

            <button
              className="mt-6 w-full bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 py-3 rounded-xl transition-colors flex items-center justify-center"
              onClick={handleAddToMenu}
            >
              <TbShoppingCart className="mr-2" size={18} aria-hidden="true" />
              Legg til i ukemeny
            </button>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ingredients */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-md border border-cream-300 p-6">
              <h2 className="text-xl font-bold text-charcoal mb-4">Ingredienser</h2>

              <ul className="space-y-3">
                {recipe.ingredienser.map((ingredient, index) => (
                  <li key={index} className="flex justify-between items-center border-b border-cream-200 pb-2">
                    <div>
                      <span className="font-medium text-charcoal">{ingredient.navn}</span>
                      {ingredient.mengde && (
                        <span className="text-charcoal-muted text-sm block">{ingredient.mengde}</span>
                      )}
                    </div>
                    <span className="text-terracotta-600 font-medium">{ingredient.pris} kr</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-cream-300 flex justify-between items-center">
                <span className="font-medium text-charcoal-muted">Totalt:</span>
                <span className="text-lg font-bold text-terracotta-600">
                  {calculateTotalPrice(recipe.ingredienser)} kr
                </span>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-md border border-cream-300 p-6">
              <h2 className="text-xl font-bold text-charcoal mb-4">Fremgangsmåte</h2>

              <ol className="space-y-6">
                {recipe.fremgangsmaate.map((step, index) => (
                  <li key={index} className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-8 h-8 bg-terracotta-600 rounded-full flex items-center justify-center text-cream-50 font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-charcoal">{step}</p>
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
