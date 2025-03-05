// KassalApiService.js
const BASE_URL = 'https://kassal.app/api/v1';

// Option 1: Environment variable approach
// Import from environment variables configuration file
import { API_KEY } from './config';

class KassalApiService {
  static #apiKey = API_KEY;
  
  // Helper method to build headers with authentication
  static #getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-API-Key': this.#apiKey
    };
  }

  // Search for products by name
  static async searchProducts(query, options = {}) {
    try {
      const queryParams = new URLSearchParams({
        search: query,
        page: options.page || 1,
        size: options.size || 10,
        sort: options.sort || 'price_asc', // Default to cheapest first
        ...(options.unique !== undefined && { unique: options.unique }),
        ...(options.vendor && { vendor: options.vendor }),
        ...(options.brand && { brand: options.brand }),
        ...(options.price_min && { price_min: options.price_min }),
        ...(options.price_max && { price_max: options.price_max })
      });

      const response = await fetch(`${BASE_URL}/products?${queryParams.toString()}`, {
        headers: this.#getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // Get product by ID
  static async getProductById(id) {
    try {
      const response = await fetch(`${BASE_URL}/products/id/${id}`, {
        headers: this.#getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting product by ID:', error);
      throw error;
    }
  }

  // Get product by EAN (barcode)
  static async getProductByEan(ean) {
    try {
      const response = await fetch(`${BASE_URL}/products/ean/${ean}`, {
        headers: this.#getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting product by EAN:', error);
      throw error;
    }
  }

  // Search for stores
  static async searchStores(options = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: options.page || 1,
        size: options.size || 10,
        ...(options.search && { search: options.search }),
        ...(options.lat && { lat: options.lat }),
        ...(options.lng && { lng: options.lng }),
        ...(options.km && { km: options.km }),
        ...(options.group && { group: options.group })
      });

      const response = await fetch(`${BASE_URL}/physical-stores?${queryParams.toString()}`, {
        headers: this.#getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching stores:', error);
      throw error;
    }
  }

  // Get store by ID
  static async getStoreById(id) {
    try {
      const response = await fetch(`${BASE_URL}/physical-stores/${id}`, {
        headers: this.#getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting store by ID:', error);
      throw error;
    }
  }
}

export default KassalApiService;