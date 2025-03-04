// RecipeForm.js
import React, { useState } from 'react';

function RecipeForm({ onAddRecipe, onCancel }) {
  const [navn, setNavn] = useState('');
  const [tidsbruk, setTidsbruk] = useState('');
  const [vanskelighetsgrad, setVanskelighetsgrad] = useState('Enkel');
  const [bilde, setBilde] = useState(null);
  const [bildePreview, setBildePreview] = useState('');
  const [ingredienser, setIngredienser] = useState([{ navn: '', mengde: '', pris: 0 }]);
  const [fremgangsmaate, setFremgangsmaate] = useState(['']);
  const [allergener, setAllergener] = useState([]);
  const [dragActive, setDragActive] = useState(false);


  
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
    return ingredienser.reduce((sum, ing) => sum + ing.pris, 0);
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

    // Create recipe object
    const newRecipe = {
      id: Date.now(),
      navn,
      tidsbruk,
      vanskelighetsgrad,
      bilde: bildePreview || null,
      ingredienser: ingredienser.filter(ing => ing.navn.trim()),
      fremgangsmaate: fremgangsmaate.filter(step => step.trim()),
      allergener
    };

    onAddRecipe(newRecipe);
    
    // Reset form
    setNavn('');
    setTidsbruk('');
    setVanskelighetsgrad('Enkel');
    setBilde(null);
    setBildePreview('');
    setIngredienser([{ navn: '', mengde: '', pris: 0 }]);
    setFremgangsmaate(['']);
    setAllergener([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">Legg til ny oppskrift</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
    <h2 className="text-2xl font-bold">Ny Oppskrift</h2>
    <p className="text-purple-100">Legg til en ny oppskrift i din samling</p>
  </div>
  
  <div className="p-6 space-y-5">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Navn på oppskrift</label>
      <input 
        type="text" 
        className="w-full p-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
        placeholder="Skriv inn navn..."
        value={navn}
        onChange={(e) => setNavn(e.target.value)}
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
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Legg til steg
        </button>
      </div>
    </div>
    
    {/* Image Upload */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Bilde</label>
      <div className={`border-2 border-dashed ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'} rounded-lg p-8 text-center transition cursor-pointer`}>
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
    
    {/* Ingredients */}
    <div>
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-gray-700">Ingredienser</label>
        <button 
          type="button" 
          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
          onClick={addIngrediens}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Legg til ingrediens
        </button>
      </div>
      
      <div className="space-y-3">
        {ingredienser.map((ingrediens, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg group">
            <div className="flex-grow">
              <input 
                type="text" 
                className="w-full p-2 border-0 bg-transparent focus:ring-2 focus:ring-indigo-500 rounded outline-none"
                value={ingrediens.navn}
                onChange={(e) => updateIngrediens(index, 'navn', e.target.value)}
                placeholder="Ingrediensnavn"
              />
            </div>
            <div className="w-24">
              <input 
                type="text" 
                className="w-full p-2 border-0 bg-transparent focus:ring-2 focus:ring-indigo-500 rounded outline-none"
                value={ingrediens.mengde}
                onChange={(e) => updateIngrediens(index, 'mengde', e.target.value)}
                placeholder="Mengde"
              />
            </div>
            <div className="w-24">
              <input 
                type="number" 
                className="w-full p-2 border-0 bg-transparent focus:ring-2 focus:ring-indigo-500 rounded outline-none"
                value={ingrediens.pris}
                onChange={(e) => updateIngrediens(index, 'pris', e.target.value)}
                placeholder="Pris"
              />
            </div>
            <button 
              type="button"
              className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeIngrediens(index)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
    
    <div className="pt-4">
      <button 
        type="submit" 
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
      >
        Lagre Oppskrift
      </button>
    </div>
  </div>
</div>

      </form>
    </div>
  );
}

export default RecipeForm;