// RecipeStorageService.js
class RecipeDatabase {
    constructor() {
      this.storageKey = 'oppskrifter';
      this.localStore = this.getStoredRecipes();
    }
  
    // Get all stored recipes from localStorage
    getStoredRecipes() {
      const storedData = localStorage.getItem(this.storageKey);
      if (!storedData) {
        // Return default recipes if none are stored
        return [
          {
            id: 1,
            navn: "Kjøttdeiggryte med ris",
            tidsbruk: "20-30 minutter",
            vanskelighetsgrad: "Enkel",
            ingredienser: [
              { navn: "Kjøttdeig", mengde: "400g", pris: 65 },
              { navn: "Løk", mengde: "1 stk", pris: 5 },
              { navn: "Paprika", mengde: "1 stk", pris: 15 },
              { navn: "Hermetiske tomater", mengde: "1 boks", pris: 15 },
              { navn: "Glutenfri buljongterning", mengde: "1 stk", pris: 3 },
              { navn: "Ris", mengde: "2 dl", pris: 10 }
            ],
            fremgangsmaate: [
              "Finhakk løk og paprika.",
              "Brun kjøttdeigen i en gryte.",
              "Tilsett løk og paprika, stek i 2-3 minutter.",
              "Ha i hermetiske tomater og buljongterning.",
              "La småkoke i 15 minutter.",
              "Kok ris etter anvisning på pakken.",
              "Server kjøttdeiggryta over risen."
            ],
            allergener: []
          },
          {
            id: 2,
            navn: "Bakt søtpotet med kikerter",
            tidsbruk: "45 minutter",
            vanskelighetsgrad: "Middels",
            ingredienser: [
              { navn: "Søtpotet", mengde: "2 stk", pris: 25 },
              { navn: "Kikerter", mengde: "1 boks", pris: 15 },
              { navn: "Tahini", mengde: "2 ss", pris: 10 }
            ],
            fremgangsmaate: [
              "Forvarm ovnen til 200°C.",
              "Prikk hull i søtpotetene med en gaffel.",
              "Bak søtpotetene i ca. 40 minutter til de er møre.",
              "Bland kikerter med krydder og varm opp.",
              "Server kikertene over de bakte søtpotetene med tahini på topp."
            ],
            allergener: []
          },
          {
            id: 3,
            navn: "Quinoasalat med avokado",
            tidsbruk: "15 minutter",
            vanskelighetsgrad: "Enkel",
            ingredienser: [
              { navn: "Quinoa", mengde: "1 dl", pris: 18 },
              { navn: "Avokado", mengde: "1 stk", pris: 20 },
              { navn: "Sitron", mengde: "1/2 stk", pris: 5 }
            ],
            fremgangsmaate: [
              "Kok quinoa etter anvisning på pakken.",
              "Avkjøl quinoaen.",
              "Skjær avokado i terninger.",
              "Bland avokado med quinoa.",
              "Press over sitronsaft og server."
            ],
            allergener: []
          }
        ];
      }
      return JSON.parse(storedData);
    }
  
    // Save recipes back to storage
    saveRecipes(recipes) {
      localStorage.setItem(this.storageKey, JSON.stringify(recipes));
      this.localStore = recipes;
    }
  
    // Add a new recipe
    addRecipe(newRecipe) {
      try {
        // Make sure we have a unique ID
        const maxId = this.localStore.reduce(
          (max, recipe) => (recipe.id > max ? recipe.id : max),
          0
        );
        const recipeWithId = {
          ...newRecipe,
          id: maxId + 1
        };
  
        const updatedRecipes = [...this.localStore, recipeWithId];
        this.saveRecipes(updatedRecipes);
        return recipeWithId;
      } catch (error) {
        console.error("Error saving recipe:", error);
        throw new Error("Could not save the recipe");
      }
    }
  
    // Get all recipes
    getAllRecipes() {
      return this.getStoredRecipes();
    }
  
    // Get a specific recipe by ID
    getRecipeById(id) {
      const recipes = this.getStoredRecipes();
      const recipe = recipes.find(recipe => recipe.id === id);
      
      if (!recipe) {
        throw new Error("Recipe not found");
      }
      
      return recipe;
    }
  
    // Update an existing recipe
    updateRecipe(id, updatedRecipe) {
      const recipes = this.getStoredRecipes();
      const index = recipes.findIndex(recipe => recipe.id === id);
      
      if (index === -1) {
        throw new Error("Recipe not found");
      }
      
      recipes[index] = {
        ...recipes[index],
        ...updatedRecipe
      };
      
      this.saveRecipes(recipes);
      return true;
    }
  
    // Delete a recipe
    deleteRecipe(id) {
      const recipes = this.getStoredRecipes();
      const filteredRecipes = recipes.filter(recipe => recipe.id !== id);
      
      if (filteredRecipes.length === recipes.length) {
        throw new Error("Recipe not found");
      }
      
      this.saveRecipes(filteredRecipes);
      return true;
    }
  }
  
  export default RecipeDatabase;