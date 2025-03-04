// Enhanced MenuManager.js
import React, { useState, useEffect } from 'react';
import UkemenyDatabase from './LocalStorageService';
import { FiSave, FiList, FiX, FiCheck, FiCalendar, FiTrash2, FiInfo, FiLoader } from 'react-icons/fi';

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
      
      // Show success message
      const successAlert = document.createElement('div');
      successAlert.className = 'fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 animate-fadeIn';
      successAlert.innerHTML = `
        <div class="flex items-center">
          <div class="py-1"><svg class="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
          <span>Menu has been saved!</span>
        </div>
      `;
      document.body.appendChild(successAlert);
      
      setTimeout(() => {
        successAlert.classList.add('animate-fadeOut');
        setTimeout(() => {
          document.body.removeChild(successAlert);
        }, 300);
      }, 3000);
      
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
        
        // Show success message
        const successAlert = document.createElement('div');
        successAlert.className = 'fixed top-4 right-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-lg z-50 animate-fadeIn';
        successAlert.innerHTML = `
          <div class="flex items-center">
            <div class="py-1"><svg class="fill-current h-6 w-6 text-blue-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
            <span>Menu "${menu.name}" has been loaded!</span>
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-5 text-white">
        <h2 className="text-xl font-semibold">Lagre og Last inn Menyer</h2>
      </div>
      
      <div className="p-5">
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            className={`flex items-center px-4 py-2 rounded-lg transition ${
              showSaveForm 
                ? 'bg-indigo-600 text-white' 
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
            onClick={() => {
              setShowSaveForm(!showSaveForm);
              setShowMenuList(false);
              setErrorMessage('');
            }}
          >
            <FiSave className="mr-2" size={18} />
            {showSaveForm ? 'Avbryt lagring' : 'Lagre meny'}
          </button>
          
          <button
            className={`flex items-center px-4 py-2 rounded-lg transition ${
              showMenuList 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
            onClick={() => {
              setShowMenuList(!showMenuList);
              setShowSaveForm(false);
              setErrorMessage('');
            }}
          >
            <FiList className="mr-2" size={18} />
            {showMenuList ? 'Skjul lagrede menyer' : 'Vis lagrede menyer'}
          </button>
        </div>
        
        {errorMessage && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg relative mb-6 animate-fadeIn">
            <div className="flex items-center">
              <FiInfo className="mr-2 flex-shrink-0" size={20} />
              <span>{errorMessage}</span>
              <button 
                className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                onClick={() => setErrorMessage('')}
              >
                <FiX size={20} />
              </button>
            </div>
          </div>
        )}
        
        {showSaveForm && (
          <div className="bg-white rounded-lg shadow-sm border border-indigo-100 p-6 mb-6 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4 text-indigo-800">Lagre meny</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="menu-name">
                  Menynavn*
                </label>
                <input
                  id="menu-name"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  placeholder="F.eks. 'Ukemeny uke 42'"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="menu-description">
                  Beskrivelse (valgfritt)
                </label>
                <textarea
                  id="menu-description"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                  value={menuDescription}
                  onChange={(e) => setMenuDescription(e.target.value)}
                  placeholder="F.eks. 'Glutenfri meny for familien'"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-2">
                    <FiCalendar size={16} />
                  </span>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">
                      Antall måltider
                    </span>
                    <span className="text-lg font-bold text-indigo-700">
                      {meals.length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">
                    <FiSave size={16} />
                  </span>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">
                      Budsjett
                    </span>
                    <span className="text-lg font-bold text-blue-700">
                      {budget} kr
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 rounded-lg flex items-center justify-center transition shadow-sm"
                onClick={saveMenu}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" size={18} />
                    Lagrer...
                  </>
                ) : (
                  <>
                    <FiCheck className="mr-2" size={18} />
                    Lagre meny
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {showMenuList && (
          <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-6 mb-6 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Lagrede menyer</h3>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <FiLoader className="animate-spin h-8 w-8 text-blue-500 mr-3" />
                <span className="text-gray-600">Laster menyer...</span>
              </div>
            ) : savedMenus.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50">
                <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                  <FiList size={24} />
                </div>
                <p className="text-blue-800 font-medium mb-2">
                  Ingen lagrede menyer funnet
                </p>
                <p className="text-blue-600 text-sm">
                  Lagre din første meny med knappen over!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                {savedMenus.map(menu => (
                  <div key={menu.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{menu.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {menu.description ? menu.description : "Ingen beskrivelse"}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              <FiCalendar size={10} className="mr-1" />
                              {formatDate(menu.createdAt)}
                            </span>
                            <span className="inline-flex items-center text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                              <svg className="w-2.5 h-2.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              {menu.meals.length} måltider
                            </span>
                            <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              <svg className="w-2.5 h-2.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {menu.totalPrice} kr
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                            onClick={() => loadMenu(menu.id)}
                            title="Last inn denne menyen"
                          >
                            Last inn
                          </button>
                          <button
                            className="flex items-center px-2 py-1 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 text-sm rounded-lg transition-colors"
                            onClick={() => deleteMenu(menu.id)}
                            title="Slett denne menyen"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-4 py-2 grid grid-cols-4 gap-1 bg-white">
                      {menu.meals.slice(0, 4).map((meal, index) => (
                        <div key={index} className="text-center">
                          <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-1 text-xs text-gray-600">
                            {index + 1}
                          </div>
                          <div className="truncate text-xs text-gray-600" title={meal.navn}>
                            {meal.navn}
                          </div>
                        </div>
                      ))}
                      {menu.meals.length > 4 && (
                        <div className="text-center col-span-4 mt-1">
                          <span className="text-xs text-blue-600">+ {menu.meals.length - 4} flere måltider</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      
    </div>
  );
}

export default MenuManager;