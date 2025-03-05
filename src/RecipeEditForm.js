import React, { useState } from 'react';
import { FiSave, FiX, FiPlus, FiSearch, FiChevronUp } from 'react-icons/fi';
import ProductSearch from './ProductSearch';

const RecipeEditForm = ({ recipe, onSave, onCancel }) => {
  const [navn, setNavn] = useState(recipe.navn || '');
  const [tidsbruk, setTidsbruk] = useState(recipe.tidsbruk || '');
  const [vanskelighetsgrad, setVanskelighetsgrad] = useState(recipe.vanskelighetsgrad || 'Enkel');
  const [bilde, setBilde] = useState(null);
  const [bildePreview, setBildePreview] = useState(recipe.bilde || '');
  const [ingredienser, setIngredienser] = useState(recipe.ingredienser || [{ navn: '', mengde: '', pris: 0 }]);
  const [fremgangsmaate, setFremgangsmaate] = useState(recipe.fremgangsmaate || ['']);
  const [allergener, setAllergener] = useState(recipe.allergener || []);
  const [dragActive, setDragActive] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(Array(recipe.ingredienser?.length || 1).fill(false));

  // Handle image upload
  const handleBildeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBilde(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBildePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setBilde(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBildePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new ingredient field
  const addIngrediens = () => {
    setIngredienser([...ingredienser, { navn: '', mengde: '', pris: 0 }]);
    setShowProductSearch([...showProductSearch, false]);
  };

  // Update ingredient
  const updateIngrediens = (index, field, value) => {
    const updatedIngredienser = [...ingredienser];
    updatedIngredienser[index][field] = field === 'pris' ? parseFloat(value) || 0 : value;
    setIngredienser(updatedIngredienser);
  };

  // Remove ingredient
  const removeIngrediens = (index) => {
    const updatedIngredienser = [...ingredienser];
    updatedIngredienser.splice(index, 1);
    setIngredienser(updatedIngredienser);
    
    const updatedShowSearch = [...showProductSearch];
    updatedShowSearch.splice(index, 1);
    setShowProductSearch(updatedShowSearch);
  };

  // Toggle product search for an ingredient
  const toggleProductSearch = (index) => {
    const updatedShowSearch = [...showProductSearch];
    updatedShowSearch[index] = !updatedShowSearch[index];
    setShowProductSearch(updatedShowSearch);
  };

  // Handle product selection from search
  const handleSelectProduct = (index, product) => {
    const updatedIngredienser = [...ingredienser];
    updatedIngredienser[index] = {
      ...updatedIngredienser[index],
      navn: product.name,
      pris: product.current_price,
      productId: product.id,
      productInfo: {
        vendor: product.vendor,
        brand: product.brand,
        ean: product.ean
      }
    };
    setIngredienser(updatedIngredienser);
    
    // Hide the product search
    const updatedShowSearch = [...showProductSearch];
    updatedShowSearch[index] = false;
    setShowProductSearch(updatedShowSearch);
  };

  // Add new step
  const addStep = () => {
    setFremgangsmaate([...fremgangsmaate, '']);
  };

  // Update step
  const updateStep = (index, value) => {
    const updatedSteps = [...fremgangsmaate];
    updatedSteps[index] = value;
    setFremgangsmaate(updatedSteps);
  };

  // Remove step
  const removeStep = (index) => {
    const updatedSteps = [...fremgangsmaate];
    updatedSteps.splice(index, 1);
    setFremgangsmaate(updatedSteps);
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    return ingredienser.reduce((sum, ing) => sum + parseFloat(ing.pris || 0), 0);
  };

  // Remove image
  const removeBilde = () => {
    setBilde(null);
    setBildePreview('');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!navn.trim()) {
      alert('Vennligst oppgi et navn for oppskriften');
      return;
    }
    
    if (ingredienser.some(ing => !ing.navn.trim())) {
      alert('Alle ingredienser må ha navn');
      return;
    }
    
    if (fremgangsmaate.some(step => !step.trim())) {
      alert('Alle fremgangsmåtesteg må være utfylt');
      return;
    }

    // Create updated recipe object
    const updatedRecipe = {
      ...recipe,
      navn,
      tidsbruk,
      vanskelighetsgrad,
      bilde: bildePreview || recipe.bilde, // Keep original if no new image
      ingredienser: ingredienser.filter(ing => ing.navn.trim()),
      fremgangsmaate: fremgangsmaate.filter(step => step.trim()),
      allergener
    };

    onSave(updatedRecipe);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Rediger Oppskrift</h2>
          <p className="text-indigo-100">Oppdater oppskriften</p>
        </div>
        <button 
          onClick={onCancel}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition"
        >
          <FiX size={24} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Navn på oppskrift</label>
            <input 
              type="text" 
              className="w-full p-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="Skriv inn navn..."
              value={navn}
              onChange={(e) => setNavn(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tidsbruk</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full p-3 pl-10 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="F.eks. 20 min"
                  value={tidsbruk}
                  onChange={(e) => setTidsbruk(e.target.value)}
                />
                <svg className="absolute left-3 top-3.5 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vanskelighetsgrad</label>
              <div className="flex space-x-2">
                <button 
                  type="button"
                  className={`flex-1 py-3 ${vanskelighetsgrad === 'Enkel' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700'} text-sm font-medium rounded-lg hover:bg-indigo-700 hover:text-white transition`}
                  onClick={() => setVanskelighetsgrad('Enkel')}
                >
                  Enkel
                </button>
                <button 
                  type="button"
                  className={`flex-1 py-3 ${vanskelighetsgrad === 'Middels' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700'} text-sm font-medium rounded-lg hover:bg-indigo-700 hover:text-white transition`}
                  onClick={() => setVanskelighetsgrad('Middels')}
                >
                  Middels
                </button>
                <button 
                  type="button"
                  className={`flex-1 py-3 ${vanskelighetsgrad === 'Avansert' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700'} text-sm font-medium rounded-lg hover:bg-indigo-700 hover:text-white transition`}
                  onClick={() => setVanskelighetsgrad('Avansert')}
                >
                  Avansert
                </button>
              </div>
            </div>
          </div>
          
          {/* Preparation Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fremgangsmåte</label>
            <div className="space-y-3">
              {fremgangsmaate.map((steg, index) => (
                <div key={index} className="flex space-x-3 mb-3 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <textarea 
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                      rows="2"
                      value={steg}
                      onChange={(e) => updateStep(index, e.target.value)}
                      placeholder={`Beskrivelse av steg ${index + 1}...`}
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="button"
                    className="text-red-500 hover:text-red-700 p-1"
                    onClick={() => removeStep(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              <button 
                type="button" 
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                onClick={addStep}
              >
                <FiPlus className="mr-1" size={16} />
                Legg til steg
              </button>
            </div>
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bilde</label>
            <div 
              className={`border-2 border-dashed ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'} rounded-lg p-8 text-center transition cursor-pointer`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!bildePreview ? (
                <>
                  <div className="mb-3">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Last opp bilde</span>
                      <input 
                        type="file" 
                        className="sr-only" 
                        accept="image/*"
                        onChange={handleBildeChange}
                      />
                    </label>
                    <p className="pl-1">eller dra og slipp</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, GIF opptil 10MB
                  </p>
                </>
              ) : (
                <div className="relative group">
                  <img 
                    src={bildePreview} 
                    alt="Forhandsvisning" 
                    className="max-h-48 mx-auto rounded-lg" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <button 
                      type="button"
                      onClick={removeBilde}
                      className="bg-red-600 text-white p-1 rounded-full"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Ingredients with Product Search */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">Ingredienser</label>
              <button 
                type="button" 
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                onClick={addIngrediens}
              >
                <FiPlus className="mr-1" size={16} />
                Legg til ingrediens
              </button>
            </div>
            
            <div className="space-y-3">
              {ingredienser.map((ingrediens, index) => (
                <div key={index} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between bg-gray-50 p-2">
                    <span className="text-xs font-medium text-gray-500">Ingrediens #{index + 1}</span>
                    <div className="flex space-x-2">
                      <button 
                        type="button"
                        className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50"
                        title={showProductSearch[index] ? "Skjul produktsøk" : "Søk etter produkt i Kassal API"}
                        onClick={() => toggleProductSearch(index)}
                      >
                        {showProductSearch[index] ? <FiChevronUp size={16} /> : <FiSearch size={16} />}
                      </button>
                      <button 
                        type="button"
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                        onClick={() => removeIngrediens(index)}
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {showProductSearch[index] && (
                    <div className="p-3 border-b border-gray-100 bg-blue-50">
                      <p className="text-xs text-blue-800 mb-2">
                        Søk etter produkt i Kassal API for å få riktig pris 
                      </p>
                      <ProductSearch 
                        onSelectProduct={(product) => handleSelectProduct(index, product)}
                        initialValue={ingrediens.navn}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center p-3">
                    <div className="flex-grow pr-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Navn</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-200 rounded outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={ingrediens.navn}
                        onChange={(e) => updateIngrediens(index, 'navn', e.target.value)}
                        placeholder="Ingrediensnavn"
                        required
                      />
                    </div>
                    <div className="w-24 px-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Mengde</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-200 rounded outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={ingrediens.mengde}
                        onChange={(e) => updateIngrediens(index, 'mengde', e.target.value)}
                        placeholder="Mengde"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Pris (kr)</label>
                      <input 
                        type="number" 
                        className="w-full p-2 border border-gray-200 rounded outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={ingrediens.pris}
                        onChange={(e) => updateIngrediens(index, 'pris', e.target.value)}
                        placeholder="Pris"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  {ingrediens.productInfo && (
                    <div className="bg-indigo-50 p-2 text-xs border-t border-indigo-100">
                      <div className="flex justify-between">
                        <span className="text-indigo-800">
                          {ingrediens.productInfo.brand || 'Ukjent merke'}
                        </span>
                        <span className="text-indigo-600">
                          {ingrediens.productInfo.vendor || 'Ukjent leverandør'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-3 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
              <span className="text-sm text-gray-700">Total pris:</span>
              <span className="font-bold text-lg text-indigo-700">{calculateTotalPrice().toFixed(2).replace('.', ',')} kr</span>
            </div>
          </div>
          
          {/* Allergens field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allergener (valgfritt)</label>
            <input 
              type="text" 
              className="w-full p-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              value={allergener.join(', ')}
              onChange={(e) => setAllergener(e.target.value.split(',').map(a => a.trim()).filter(Boolean))}
              placeholder="Angi allergener separert med komma"
            />
          </div>
          
          <div className="pt-4 flex space-x-3">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex-1"
            >
              Avbryt
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
            >
              <div className="flex items-center justify-center">
                <FiSave className="mr-2" size={18} />
                Lagre endringer
              </div>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RecipeEditForm;