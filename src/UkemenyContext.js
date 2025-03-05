import React, { createContext, useState, useEffect } from 'react';
import RecipeDatabase from './RecipeStorageService';

// Create context
export const UkemenyContext = createContext();

export const UkemenyProvider = ({ children }) => {
  // Initialize recipe database
  const recipeDb = new RecipeDatabase();
  
  // State for recipes
  const [oppskrifter, setOppskrifter] = useState([]);
  
  // Load recipes on initial mount
  useEffect(() => {
    const storedRecipes = recipeDb.getAllRecipes();
    setOppskrifter(storedRecipes);
  }, []);
  
  // State for selected meals
  const [valgteMaaltider, setValgteMaaltider] = useState([]);
  
  // State for budget
  const [budsjett, setBudsjett] = useState(1000);
  
  // Error message state
  const [feilmelding, setFeilmelding] = useState('');

  // Add a meal to the weekly menu
  const leggTilMaaltid = (oppskrift) => {
    if (valgteMaaltider.length >= 7) {
      setFeilmelding('Du kan maksimalt ha 7 måltider i ukemenyen');
      return;
    }
    
    if (valgteMaaltider.find(maaltid => maaltid && maaltid.id === oppskrift.id)) {
      setFeilmelding('Denne oppskriften er allerede i ukemenyen');
      return;
    }
    
    setValgteMaaltider([...valgteMaaltider, oppskrift]);
    setFeilmelding('');
  };

  // Add a meal to a specific day in the weekly menu
  const leggTilMaaltidTilDag = (oppskrift, dayIndex) => {
    // Make a copy of the current meals
    const nyeMaaltider = [...valgteMaaltider];
    
    // If we're adding to a day that doesn't exist yet, fill in the gaps with nulls
    while (nyeMaaltider.length < dayIndex) {
      nyeMaaltider.push(null);
    }
    
    // Set the meal for the specified day
    nyeMaaltider[dayIndex] = oppskrift;
    
    setValgteMaaltider(nyeMaaltider);
    setFeilmelding('');
  };

  // Remove a meal from the weekly menu
  const fjernMaaltid = (index) => {
    const nyeMaaltider = [...valgteMaaltider];
    nyeMaaltider[index] = null;  // Set to null instead of removing to preserve the day structure
    
    // Remove trailing nulls
    while (nyeMaaltider.length > 0 && nyeMaaltider[nyeMaaltider.length - 1] === null) {
      nyeMaaltider.pop();
    }
    
    setValgteMaaltider(nyeMaaltider);
  };

  // Calculate total price of the menu
  const beregnTotalPris = () => {
    return valgteMaaltider.reduce((total, maaltid) => {
      if (!maaltid) return total; // Skip null entries
      
      const maaltidPris = maaltid.ingredienser.reduce((sum, ingrediens) => 
        sum + ingrediens.pris, 0);
      return total + maaltidPris;
    }, 0);
  };

  // Generate shopping list based on selected meals
  const lagHandleliste = () => {
    const alleIngredienser = [];
    valgteMaaltider.forEach(maaltid => {
      if (!maaltid) return; // Skip null entries
      
      maaltid.ingredienser.forEach(ingrediens => {
        alleIngredienser.push({
          maaltid: maaltid.navn,
          ...ingrediens
        });
      });
    });
    
    const grupperteIngredienser = {};
    alleIngredienser.forEach(ingrediens => {
      if (!grupperteIngredienser[ingrediens.navn]) {
        grupperteIngredienser[ingrediens.navn] = {
          navn: ingrediens.navn,
          mengde: [ingrediens.mengde],
          pris: ingrediens.pris,
          maaltider: [ingrediens.maaltid]
        };
      } else {
        if (!grupperteIngredienser[ingrediens.navn].maaltider.includes(ingrediens.maaltid)) {
          grupperteIngredienser[ingrediens.navn].mengde.push(ingrediens.mengde);
          grupperteIngredienser[ingrediens.navn].maaltider.push(ingrediens.maaltid);
        }
      }
    });
    
    return Object.values(grupperteIngredienser);
  };

  // Add new recipe with persistence
  const leggTilOppskrift = (nyOppskrift) => {
    try {
      // Save the new recipe to storage
      const savedRecipe = recipeDb.addRecipe(nyOppskrift);
      
      // Update the state with the saved recipe
      setOppskrifter([...oppskrifter, savedRecipe]);
      
      return savedRecipe;
    } catch (error) {
      console.error("Failed to save recipe:", error);
      setFeilmelding("Kunne ikke lagre oppskriften. Vennligst prøv igjen.");
      return null;
    }
  };

  // Delete a recipe with persistence
  const slettOppskrift = (id) => {
    try {
      // Delete from storage
      recipeDb.deleteRecipe(id);
      
      // Update state
      setOppskrifter(oppskrifter.filter(oppskrift => oppskrift.id !== id));
      
      // Remove from selected meals if present
      setValgteMaaltider(valgteMaaltider.map(maaltid => 
        maaltid && maaltid.id === id ? null : maaltid
      ));
      
      return true;
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      setFeilmelding("Kunne ikke slette oppskriften. Vennligst prøv igjen.");
      return false;
    }
  };

  // Update a recipe with persistence
  const oppdaterOppskrift = (id, oppdatertOppskrift) => {
    try {
      // Update in storage
      recipeDb.updateRecipe(id, oppdatertOppskrift);
      
      // Update in state
      setOppskrifter(oppskrifter.map(oppskrift => 
        oppskrift.id === id ? { ...oppskrift, ...oppdatertOppskrift } : oppskrift
      ));
      
      // Update in selected meals if present
      setValgteMaaltider(valgteMaaltider.map(maaltid => 
        maaltid && maaltid.id === id ? { ...maaltid, ...oppdatertOppskrift } : maaltid
      ));
      
      return true;
    } catch (error) {
      console.error("Failed to update recipe:", error);
      setFeilmelding("Kunne ikke oppdatere oppskriften. Vennligst prøv igjen.");
      return false;
    }
  };

  // Random dish selection
  const velgTilfeldigMåltid = () => {
    if (oppskrifter.length === 0) {
      setFeilmelding('Ingen oppskrifter å velge fra');
      return;
    }
    
    const tilfeldigIndex = Math.floor(Math.random() * oppskrifter.length);
    const valgtOppskrift = oppskrifter[tilfeldigIndex];
    
    if (valgteMaaltider.find(måltid => måltid && måltid.id === valgtOppskrift.id)) {
      setFeilmelding('Denne oppskriften er allerede i ukemenyen. Prøv igjen.');
      return;
    }
    
    if (valgteMaaltider.length >= 7) {
      setFeilmelding('Du kan maksimalt ha 7 måltider i ukemenyen');
      return;
    }
    
    setValgteMaaltider([...valgteMaaltider, valgtOppskrift]);
    setFeilmelding('');
  };
  
  // Random week menu generation
  const genererUkemeny = () => {
    if (oppskrifter.length < 7) {
      setFeilmelding(`Du har kun ${oppskrifter.length} oppskrifter. Legg til flere for å generere en hel ukemeny.`);
      return;
    }
    
    setValgteMaaltider([]);
    
    const tilgjengeligeOppskrifter = [...oppskrifter];
    const nyUkemeny = [];
    
    for (let i = 0; i < 7; i++) {
      if (tilgjengeligeOppskrifter.length === 0) break;
      
      const tilfeldigIndex = Math.floor(Math.random() * tilgjengeligeOppskrifter.length);
      nyUkemeny.push(tilgjengeligeOppskrifter[tilfeldigIndex]);
      
      tilgjengeligeOppskrifter.splice(tilfeldigIndex, 1);
    }
    
    setValgteMaaltider(nyUkemeny);
    setFeilmelding('');
  };

  // Handle loading a saved menu
  const handleLoadMenu = (loadedMeals, loadedBudget) => {
    setValgteMaaltider(loadedMeals);
    
    if (loadedBudget) {
      setBudsjett(loadedBudget);
    }
    
    setFeilmelding('');
  };

  // Create a context value
  const contextValue = {
    oppskrifter,
    setOppskrifter,
    valgteMaaltider,
    setValgteMaaltider,
    budsjett,
    setBudsjett,
    feilmelding,
    setFeilmelding,
    leggTilMaaltid,
    leggTilMaaltidTilDag,
    fjernMaaltid,
    beregnTotalPris,
    lagHandleliste,
    leggTilOppskrift,
    slettOppskrift,
    oppdaterOppskrift,
    velgTilfeldigMåltid,
    genererUkemeny,
    handleLoadMenu
  };

  return (
    <UkemenyContext.Provider value={contextValue}>
      {children}
    </UkemenyContext.Provider>
  );
};

// Custom hook for accessing the context
export const useUkemeny = () => {
  const context = React.useContext(UkemenyContext);
  if (context === undefined) {
    throw new Error('useUkemeny must be used within a UkemenyProvider');
  }
  return context;
};