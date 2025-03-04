// LocalStorageService.js
class UkemenyDatabase {
    constructor() {
      this.storageKey = 'ukemenyer';
      this.localStore = this.getStoredMenus();
    }
  
    // Get all stored menus from localStorage
    getStoredMenus() {
      const storedData = localStorage.getItem(this.storageKey);
      return storedData ? JSON.parse(storedData) : [];
    }
  
    // Save a new menu
    saveMenu(menu) {
      try {
        const id = `menu-${Date.now()}`;
        const newMenu = {
          id: id,
          ...menu,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        
        this.localStore.push(newMenu);
        localStorage.setItem(this.storageKey, JSON.stringify(this.localStore));
        return id;
      } catch (error) {
        console.error("Error saving menu:", error);
        throw new Error("Could not save the menu");
      }
    }
  
    // Get all stored menus
    getAllMenus() {
      return this.getStoredMenus();
    }
  
    // Get a specific menu by ID
    getMenuById(id) {
      const menus = this.getStoredMenus();
      const menu = menus.find(menu => menu.id === id);
      
      if (!menu) {
        throw new Error("Menu not found");
      }
      
      return menu;
    }
  
    // Update an existing menu
    updateMenu(id, updatedMenu) {
      const menus = this.getStoredMenus();
      const index = menus.findIndex(menu => menu.id === id);
      
      if (index === -1) {
        throw new Error("Menu not found");
      }
      
      menus[index] = {
        ...menus[index],
        ...updatedMenu,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(menus));
      this.localStore = menus;
      return true;
    }
  
    // Delete a menu
    deleteMenu(id) {
      const menus = this.getStoredMenus();
      const filteredMenus = menus.filter(menu => menu.id !== id);
      
      if (filteredMenus.length === menus.length) {
        throw new Error("Menu not found");
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(filteredMenus));
      this.localStore = filteredMenus;
      return true;
    }
  
    // Search for menus based on criteria
    searchMenus(criteria) {
      const menus = this.getStoredMenus();
      
      return menus.filter(menu => {
        if (criteria.name && menu.name.toLowerCase().includes(criteria.name.toLowerCase())) {
          return true;
        }
        
        if (criteria.date && menu.createdAt.startsWith(criteria.date)) {
          return true;
        }
        
        if (criteria.budget && menu.budget <= criteria.budget) {
          return true;
        }
        
        return false;
      });
    }
  }
  
  export default UkemenyDatabase;