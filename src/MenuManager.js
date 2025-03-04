// MenuManager.js
import React, { useState, useEffect } from 'react';
import UkemenyDatabase from './LocalStorageService';

function MenuManager({ meals, budget, onLoadMenu }) {
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [showMenuList, setShowMenuList] = useState(false);
  const [menuName, setMenuName] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [savedMenus, setSavedMenus] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const db = new UkemenyDatabase();
  
  // Load saved menus when component mounts or when showMenuList changes
  useEffect(() => {
    if (showMenuList) {
      loadSavedMenus();
    }
  }, [showMenuList]);
  
  // Load all saved menus from storage
  const loadSavedMenus = () => {
    try {
      setIsLoading(true);
      const menus = db.getAllMenus();
      setSavedMenus(menus);
    } catch (error) {
      console.error("Failed to load menus:", error);
      setErrorMessage('Could not load saved menus');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save current menu
  const saveMenu = () => {
    if (!menuName.trim()) {
      setErrorMessage('Please provide a name for the menu');
      return;
    }
    
    if (meals.length === 0) {
      setErrorMessage('The menu is empty. Please add some recipes first.');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const menuData = {
        name: menuName,
        description: menuDescription,
        budget: budget,
        meals: meals,
        totalPrice: calculateTotalPrice(meals)
      };
      
      db.saveMenu(menuData);
      setIsLoading(false);
      setShowSaveForm(false);
      setErrorMessage('');
      setMenuName('');
      setMenuDescription('');
      alert('Menu has been saved!');
      
      if (showMenuList) {
        loadSavedMenus();
      }
    } catch (error) {
      console.error("Error saving menu:", error);
      setIsLoading(false);
      setErrorMessage('Could not save the menu. Please try again.');
    }
  };
  
  // Calculate total price of all meals
  const calculateTotalPrice = (mealList) => {
    return mealList.reduce((total, meal) => {
      const mealPrice = meal.ingredienser.reduce((sum, ingredient) => sum + ingredient.pris, 0);
      return total + mealPrice;
    }, 0);
  };
  
  // Load a specific menu
  const loadMenu = (id) => {
    try {
      setIsLoading(true);
      const menu = db.getMenuById(id);
      setIsLoading(false);
      
      if (onLoadMenu && typeof onLoadMenu === 'function') {
        onLoadMenu(menu.meals, menu.budget);
        setShowMenuList(false);
        alert(`Menu "${menu.name}" has been loaded!`);
      }
    } catch (error) {
      console.error("Error loading menu:", error);
      setIsLoading(false);
      setErrorMessage('Could not load the menu. Please try again.');
    }
  };
  
  // Delete a menu
  const deleteMenu = (id) => {
    if (!window.confirm('Are you sure you want to delete this menu?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      db.deleteMenu(id);
      setIsLoading(false);
      loadSavedMenus(); // Reload the list after deletion
    } catch (error) {
      console.error("Error deleting menu:", error);
      setIsLoading(false);
      setErrorMessage('Could not delete the menu. Please try again.');
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="menu-manager mt-6">
      <div className="flex space-x-3 mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setShowSaveForm(!showSaveForm);
            setShowMenuList(false);
            setErrorMessage('');
          }}
        >
          {showSaveForm ? 'Cancel' : 'Save Menu'}
        </button>
        
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setShowMenuList(!showMenuList);
            setShowSaveForm(false);
            setErrorMessage('');
          }}
        >
          {showMenuList ? 'Hide Saved Menus' : 'Show Saved Menus'}
        </button>
      </div>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{errorMessage}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setErrorMessage('')}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}
      
      {showSaveForm && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Save Menu</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="menu-name">
                Menu Name*
              </label>
              <input
                id="menu-name"
                type="text"
                className="w-full p-2 border rounded"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                placeholder="E.g., 'Week 42 Menu'"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="menu-description">
                Description (optional)
              </label>
              <textarea
                id="menu-description"
                className="w-full p-2 border rounded"
                value={menuDescription}
                onChange={(e) => setMenuDescription(e.target.value)}
                placeholder="E.g., 'Gluten-free menu for the family'"
                rows="3"
              ></textarea>
            </div>
            
            <div>
              <span className="block text-sm font-medium mb-1">
                Number of meals: {meals.length}
              </span>
              <span className="block text-sm font-medium">
                Budget: {budget} kr
              </span>
            </div>
            
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded flex items-center justify-center"
              onClick={saveMenu}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                  Saving...
                </>
              ) : (
                'Save Menu'
              )}
            </button>
          </div>
        </div>
      )}
      
      {showMenuList && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Saved Menus</h3>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-blue-500 rounded-full mr-3"></div>
              <span>Loading menus...</span>
            </div>
          ) : savedMenus.length === 0 ? (
            <p className="text-center py-4 text-gray-500">
              No saved menus found. Save your first menu!
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {savedMenus.map(menu => (
                <div key={menu.id} className="border rounded p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{menu.name}</h4>
                      <p className="text-sm text-gray-600">
                        {menu.description ? menu.description : "No description"}
                      </p>
                      <div className="text-xs text-gray-500 mt-1">
                        <span>Created: {formatDate(menu.createdAt)}</span>
                        <span className="ml-2">
                          {menu.meals.length} meals | {menu.totalPrice} kr
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => loadMenu(menu.id)}
                        title="Load this menu"
                      >
                        Load
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteMenu(menu.id)}
                        title="Delete this menu"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MenuManager;