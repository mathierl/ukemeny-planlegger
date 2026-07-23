import React, { useState, useEffect, useCallback } from 'react';
import UkemenyDatabase from './LocalStorageService';
import { useUkemeny } from './UkemenyContext';
import {
  TbDeviceFloppy,
  TbList,
  TbX,
  TbCheck,
  TbCalendar,
  TbTrash,
  TbInfoCircle,
  TbLoader2,
  TbClock,
  TbEye,
} from 'react-icons/tb';

function MenuManager() {
  const { valgteMaaltider, budsjett, handleLoadMenu } = useUkemeny();

  const [showSaveForm, setShowSaveForm] = useState(false);
  const [showMenuList, setShowMenuList] = useState(false);
  const [menuName, setMenuName] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [savedMenus, setSavedMenus] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load all saved menus from storage. A fresh UkemenyDatabase is created per
  // call (not memoized) since it snapshots localStorage at construction time
  // and its write methods trust that snapshot — a long-lived shared instance
  // would go stale and could clobber writes made elsewhere (e.g. another tab).
  const loadSavedMenus = useCallback(() => {
    try {
      setIsLoading(true);
      const db = new UkemenyDatabase();
      const menus = db.getAllMenus();
      setSavedMenus(menus);
    } catch (error) {
      console.error("Failed to load menus:", error);
      setErrorMessage('Could not load saved menus');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load saved menus when component mounts or when showMenuList changes
  useEffect(() => {
    if (showMenuList) {
      loadSavedMenus();
    }
  }, [showMenuList, loadSavedMenus]);

  // Save current menu
  const saveMenu = () => {
    if (!menuName.trim()) {
      setErrorMessage('Please provide a name for the menu');
      return;
    }

    if (valgteMaaltider.length === 0) {
      setErrorMessage('The menu is empty. Please add some recipes first.');
      return;
    }

    try {
      setIsLoading(true);

      // Filter out null values for storage
      const cleanedMeals = valgteMaaltider.filter(meal => meal !== null);

      const menuData = {
        name: menuName,
        description: menuDescription,
        budget: budsjett,
        meals: cleanedMeals,
        totalPrice: calculateTotalPrice(cleanedMeals)
      };

      const db = new UkemenyDatabase();
      db.saveMenu(menuData);
      setIsLoading(false);
      setShowSaveForm(false);
      setErrorMessage('');
      setMenuName('');
      setMenuDescription('');

      // Show success message
      const successAlert = document.createElement('div');
      successAlert.className = 'fixed top-4 right-4 bg-moss-50 border-l-4 border-moss-500 text-moss-800 p-4 rounded-xl shadow-lg z-50 animate-fadeIn';
      successAlert.innerHTML = `
        <div class="flex items-center">
          <div class="py-1"><svg class="fill-current h-6 w-6 text-moss-600 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
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
      if (!meal) return total; // Skip null entries

      const mealPrice = meal.ingredienser.reduce((sum, ingredient) => sum + ingredient.pris, 0);
      return total + mealPrice;
    }, 0);
  };

  // Load a specific menu
  const loadMenu = (id) => {
    try {
      setIsLoading(true);
      const db = new UkemenyDatabase();
      const menu = db.getMenuById(id);
      setIsLoading(false);

      if (handleLoadMenu && typeof handleLoadMenu === 'function') {
        handleLoadMenu(menu.meals, menu.budget);
        setShowMenuList(false);

        // Show success message
        const successAlert = document.createElement('div');
        successAlert.className = 'fixed top-4 right-4 bg-terracotta-50 border-l-4 border-terracotta-500 text-terracotta-800 p-4 rounded-xl shadow-lg z-50 animate-fadeIn';
        // menu.name is user-entered, so it's set via textContent (not
        // interpolated into innerHTML) to avoid a stored-XSS injection
        successAlert.innerHTML = `
          <div class="flex items-center">
            <div class="py-1"><svg class="fill-current h-6 w-6 text-terracotta-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
            <span></span>
          </div>
        `;
        successAlert.querySelector('span').textContent = `Menu "${menu.name}" has been loaded!`;
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
      const db = new UkemenyDatabase();
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
    <div className="bg-white rounded-2xl shadow-sm border border-cream-300 overflow-hidden mb-6">
      <div className="bg-terracotta-500 p-5 text-cream-50">
        <h2 className="text-xl font-semibold">Lagre og Last inn Menyer</h2>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            className={`flex items-center px-4 py-2 rounded-xl transition-colors ${
              showSaveForm
                ? 'bg-terracotta-600 text-cream-50'
                : 'bg-terracotta-100 text-terracotta-700 hover:bg-terracotta-200'
            }`}
            onClick={() => {
              setShowSaveForm(!showSaveForm);
              setShowMenuList(false);
              setErrorMessage('');
            }}
          >
            <TbDeviceFloppy className="mr-2" size={18} aria-hidden="true" />
            {showSaveForm ? 'Avbryt lagring' : 'Lagre meny'}
          </button>

          <button
            className={`flex items-center px-4 py-2 rounded-xl transition-colors ${
              showMenuList
                ? 'bg-terracotta-600 text-cream-50'
                : 'bg-terracotta-100 text-terracotta-700 hover:bg-terracotta-200'
            }`}
            onClick={() => {
              setShowMenuList(!showMenuList);
              setShowSaveForm(false);
              setErrorMessage('');
            }}
          >
            <TbList className="mr-2" size={18} aria-hidden="true" />
            {showMenuList ? 'Skjul lagrede menyer' : 'Vis lagrede menyer'}
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-xl relative mb-6 animate-fadeIn">
            <div className="flex items-center">
              <TbInfoCircle className="mr-2 flex-shrink-0" size={20} aria-hidden="true" />
              <span>{errorMessage}</span>
              <button
                className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                onClick={() => setErrorMessage('')}
              >
                <TbX size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {showSaveForm && (
          <div className="bg-white rounded-xl shadow-sm border border-cream-300 p-6 mb-6 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4 text-charcoal">Lagre meny</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-charcoal-muted" htmlFor="menu-name">
                  Menynavn*
                </label>
                <input
                  id="menu-name"
                  type="text"
                  className="w-full p-3 border border-cream-400 rounded-xl focus:ring-2 focus:ring-terracotta-400 focus:border-terracotta-400 outline-none transition"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  placeholder="F.eks. 'Ukemeny uke 42'"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-charcoal-muted" htmlFor="menu-description">
                  Beskrivelse (valgfritt)
                </label>
                <textarea
                  id="menu-description"
                  className="w-full p-3 border border-cream-400 rounded-xl focus:ring-2 focus:ring-terracotta-400 focus:border-terracotta-400 outline-none transition resize-none"
                  value={menuDescription}
                  onChange={(e) => setMenuDescription(e.target.value)}
                  placeholder="F.eks. 'Glutenfri meny for familien'"
                  rows="3"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-cream-100 p-4 rounded-xl">
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-terracotta-100 text-terracotta-600 rounded-full flex items-center justify-center mr-2">
                    <TbCalendar size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <span className="block text-sm font-medium text-charcoal-muted">
                      Antall måltider
                    </span>
                    <span className="text-lg font-bold text-terracotta-700">
                      {valgteMaaltider.filter(meal => meal !== null).length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-moss-100 text-moss-700 rounded-full flex items-center justify-center mr-2">
                    <TbDeviceFloppy size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <span className="block text-sm font-medium text-charcoal-muted">
                      Budsjett
                    </span>
                    <span className="text-lg font-bold text-moss-700">
                      {budsjett} kr
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 py-3 rounded-xl flex items-center justify-center transition-colors shadow-sm disabled:opacity-60"
                onClick={saveMenu}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <TbLoader2 className="animate-spin mr-2" size={18} aria-hidden="true" />
                    Lagrer...
                  </>
                ) : (
                  <>
                    <TbCheck className="mr-2" size={18} aria-hidden="true" />
                    Lagre meny
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {showMenuList && (
          <div className="bg-white rounded-xl shadow-sm border border-cream-300 p-6 mb-6 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4 text-charcoal">Lagrede menyer</h3>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <TbLoader2 className="animate-spin h-8 w-8 text-terracotta-500 mr-3" aria-hidden="true" />
                <span className="text-charcoal-muted">Laster menyer...</span>
              </div>
            ) : savedMenus.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-cream-400 rounded-xl bg-cream-100">
                <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-terracotta-100 text-terracotta-500">
                  <TbList size={24} aria-hidden="true" />
                </div>
                <p className="text-charcoal font-medium mb-2">
                  Ingen lagrede menyer funnet
                </p>
                <p className="text-charcoal-muted text-sm">
                  Lagre din første meny med knappen over!
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {savedMenus.map(menu => (
                  <div key={menu.id} className="border border-cream-300 rounded-xl hover:shadow-md transition-shadow overflow-hidden">
                    {/* Menu header with description */}
                    <div className="bg-cream-100 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-charcoal">{menu.name}</h4>
                          <p className="text-sm text-charcoal-muted mt-1">
                            {menu.description ? menu.description : "Ingen beskrivelse"}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="inline-flex items-center text-xs bg-terracotta-100 text-terracotta-800 px-2 py-1 rounded-full">
                              <TbCalendar size={10} className="mr-1" aria-hidden="true" />
                              {formatDate(menu.createdAt)}
                            </span>
                            <span className="inline-flex items-center text-xs bg-cream-300 text-charcoal px-2 py-1 rounded-full">
                              <svg className="w-2.5 h-2.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              {menu.meals.length} måltider
                            </span>
                            <span className="inline-flex items-center text-xs bg-moss-100 text-moss-800 px-2 py-1 rounded-full">
                              <svg className="w-2.5 h-2.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {menu.totalPrice} kr
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            className="flex items-center px-3 py-1 bg-terracotta-500 text-cream-50 text-sm rounded-xl hover:bg-terracotta-600 transition-colors"
                            onClick={() => loadMenu(menu.id)}
                            title="Last inn denne menyen"
                          >
                            Last inn
                          </button>
                          <button
                            className="flex items-center px-2 py-1 text-red-600 hover:text-white hover:bg-red-600 border border-red-300 text-sm rounded-xl transition-colors"
                            onClick={() => deleteMenu(menu.id)}
                            title="Slett denne menyen"
                          >
                            <TbTrash size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Recipe cards with images */}
                    <div className="bg-white p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {menu.meals.slice(0, 4).map((meal, index) => (
                        <div key={index} className="flex items-stretch border border-cream-300 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
                          {/* Recipe image */}
                          <div className="w-16 h-16 bg-cream-400 flex items-center justify-center flex-shrink-0">
                            {meal.bilde ? (
                              <img
                                src={meal.bilde}
                                alt={meal.navn}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-terracotta-500 text-xl">🍲</span>
                            )}
                          </div>

                          {/* Recipe info */}
                          <div className="flex-grow p-2">
                            <h5 className="font-medium text-sm text-charcoal line-clamp-1">{meal.navn}</h5>
                            <div className="flex justify-between items-center mt-1">
                              <div className="flex items-center text-xs text-charcoal-muted">
                                <TbClock size={10} className="mr-1" aria-hidden="true" />
                                <span className="truncate max-w-[80px]">{meal.tidsbruk}</span>
                              </div>
                              <span className="text-xs font-medium text-terracotta-600">
                                {meal.ingredienser.reduce((sum, i) => sum + i.pris, 0)} kr
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {menu.meals.length > 4 && (
                        <div className="flex items-center justify-center p-3 border border-dashed border-cream-400 rounded-xl col-span-full">
                          <div className="flex items-center text-terracotta-600">
                            <TbEye size={14} className="mr-1" aria-hidden="true" />
                            <span className="text-sm">+ {menu.meals.length - 4} flere måltider</span>
                          </div>
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
