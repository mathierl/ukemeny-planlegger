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
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-xl font-semibold mb-4">Legg til ny oppskrift</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Navn på oppskrift*</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded"
              value={navn}
              onChange={(e) => setNavn(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tidsbruk</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded"
              value={tidsbruk}
              onChange={(e) => setTidsbruk(e.target.value)}
              placeholder="f.eks. 20-30 minutter"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Vanskelighetsgrad</label>
            <select 
              className="w-full p-2 border rounded"
              value={vanskelighetsgrad}
              onChange={(e) => setVanskelighetsgrad(e.target.value)}
            >
              <option value="Enkel">Enkel</option>
              <option value="Middels">Middels</option>
              <option value="Avansert">Avansert</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bilde</label>
            <input 
              type="file" 
              accept="image/*"
              className="w-full p-2 border rounded"
              onChange={handleBildeChange}
            />
            {bildePreview && (
              <div className="mt-2">
                <img src={bildePreview} alt="Preview" className="h-32 object-cover rounded" />
              </div>
            )}
          </div>
        </div>
        
        {/* Ingredients */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Ingredienser*</label>
            <button 
              type="button" 
              className="text-sm text-blue-500 hover:text-blue-700"
              onClick={addIngrediens}
            >
              + Legg til ingrediens
            </button>
          </div>
          
          {ingredienser.map((ingrediens, index) => (
            <div key={index} className="flex space-x-2 mb-2 items-start">
              <div className="flex-grow">
                <input 
                  type="text" 
                  className="w-full p-2 border rounded mb-1"
                  value={ingrediens.navn}
                  onChange={(e) => updateIngrediens(index, 'navn', e.target.value)}
                  placeholder="Ingrediensnavn"
                  required
                />
              </div>
              <div className="w-24">
                <input 
                  type="text" 
                  className="w-full p-2 border rounded mb-1"
                  value={ingrediens.mengde}
                  onChange={(e) => updateIngrediens(index, 'mengde', e.target.value)}
                  placeholder="Mengde"
                />
              </div>
              <div className="w-24">
                <input 
                  type="number" 
                  className="w-full p-2 border rounded mb-1"
                  value={ingrediens.pris}
                  onChange={(e) => updateIngrediens(index, 'pris', e.target.value)}
                  placeholder="Pris (kr)"
                  min="0"
                  step="0.5"
                />
              </div>
              <button 
                type="button" 
                className="text-red-500 hover:text-red-700 p-2"
                onClick={() => removeIngrediens(index)}
              >
                ✕
              </button>
            </div>
          ))}
          
          <div className="text-right text-sm font-medium">
            Total kostnad: {calculateTotalPrice()} kr
          </div>
        </div>
        
        {/* Instructions */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Fremgangsmåte*</label>
            <button 
              type="button" 
              className="text-sm text-blue-500 hover:text-blue-700"
              onClick={addStep}
            >
              + Legg til steg
            </button>
          </div>
          
          {fremgangsmaate.map((steg, index) => (
            <div key={index} className="flex space-x-2 mb-2 items-start">
              <div className="w-8 text-center pt-2">{index + 1}.</div>
              <div className="flex-grow">
                <textarea 
                  className="w-full p-2 border rounded"
                  value={steg}
                  onChange={(e) => updateStep(index, e.target.value)}
                  rows="2"
                  required
                ></textarea>
              </div>
              <button 
                type="button" 
                className="text-red-500 hover:text-red-700 p-2"
                onClick={() => removeStep(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        
        {/* Allergens */}
        <div>
          <label className="block text-sm font-medium mb-1">Allergener (valgfritt)</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded"
            value={allergener.join(', ')}
            onChange={(e) => setAllergener(e.target.value.split(',').map(a => a.trim()).filter(Boolean))}
            placeholder="Angi allergener separert med komma"
          />
        </div>
        
        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button 
            type="button" 
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            onClick={onCancel}
          >
            Avbryt
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Lagre oppskrift
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecipeForm;