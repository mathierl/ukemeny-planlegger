import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiLoader, FiShoppingCart } from 'react-icons/fi';
import KassalApiService from './KassalApiService';

const ProductSearch = ({ onSelectProduct, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);
  
  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.length >= 3) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);

  const performSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await KassalApiService.searchProducts(searchTerm, {
        unique: true,
        size: 20,
        sort: 'price_asc'
      });
      
      setSearchResults(result.data || []);
      setShowResults(true);
    } catch (err) {
      setError('Kunne ikke søke etter produkter. Vennligst prøv igjen senere.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProduct = (product) => {
    onSelectProduct(product);
    setShowResults(false);
    setSearchTerm('');
  };

  const formatPrice = (price) => {
    return price.toFixed(2).replace('.', ',');
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Søk etter ingrediens..."
            className="w-full p-2 pr-8 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            onClick={() => searchTerm.length >= 3 && setShowResults(true)}
            onFocus={() => searchTerm.length >= 3 && setShowResults(true)}
          />
          {searchTerm && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm('')}
            >
              <FiX size={16} />
            </button>
          )}
        </div>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-r-lg flex items-center justify-center"
          onClick={performSearch}
          disabled={isLoading || searchTerm.length < 3}
        >
          {isLoading ? <FiLoader className="animate-spin" size={18} /> : <FiSearch size={18} />}
        </button>
      </div>
      
      {error && (
        <div className="mt-1 text-red-500 text-sm">
          {error}
        </div>
      )}
      
      {searchTerm.length < 3 && searchTerm.length > 0 && (
        <div className="mt-1 text-gray-500 text-sm">
          Skriv minst 3 tegn for å søke
        </div>
      )}
      
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((product) => (
            <div
              key={product.id}
              className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex justify-between items-center"
              onClick={() => handleSelectProduct(product)}
            >
              <div className="flex-grow">
                <div className="font-medium text-sm text-gray-800">{product.name}</div>
                <div className="text-xs text-gray-500">{product.vendor || 'Ukjent leverandør'}</div>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-indigo-600 mr-2">
                  {formatPrice(product.current_price)} kr
                </span>
                <button className="bg-indigo-100 text-indigo-700 p-1 rounded hover:bg-indigo-200">
                  <FiShoppingCart size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showResults && searchResults.length === 0 && !isLoading && searchTerm.length >= 3 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
          <p className="text-gray-600">Ingen produkter funnet.</p>
          <p className="text-sm text-gray-500 mt-1">Prøv et annet søkeord.</p>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;