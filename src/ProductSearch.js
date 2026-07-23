import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TbSearch, TbX, TbLoader2, TbShoppingCart } from 'react-icons/tb';
import KassalApiService from './KassalApiService';

const ProductSearch = ({ onSelectProduct, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  // Recreated only when searchTerm changes, so the debounce effect below
  // doesn't re-fire on every render (e.g. while isLoading toggles)
  const performSearch = useCallback(async () => {
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
  }, [searchTerm]);

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
  }, [searchTerm, performSearch]);

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
            className="w-full p-2 pr-8 border border-cream-300 rounded-l-xl focus:ring-2 focus:ring-terracotta-400 focus:border-terracotta-400 outline-none transition"
            onClick={() => searchTerm.length >= 3 && setShowResults(true)}
            onFocus={() => searchTerm.length >= 3 && setShowResults(true)}
          />
          {searchTerm && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-charcoal-muted hover:text-charcoal"
              onClick={() => setSearchTerm('')}
            >
              <TbX size={16} aria-hidden="true" />
            </button>
          )}
        </div>
        <button
          className="bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 p-2 rounded-r-xl flex items-center justify-center transition-colors"
          onClick={performSearch}
          disabled={isLoading || searchTerm.length < 3}
        >
          {isLoading ? <TbLoader2 className="animate-spin" size={18} aria-hidden="true" /> : <TbSearch size={18} aria-hidden="true" />}
        </button>
      </div>

      {error && (
        <div className="mt-1 text-red-500 text-sm">
          {error}
        </div>
      )}

      {searchTerm.length < 3 && searchTerm.length > 0 && (
        <div className="mt-1 text-charcoal-muted text-sm">
          Skriv minst 3 tegn for å søke
        </div>
      )}

      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-cream-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((product) => (
            <div
              key={product.id}
              className="p-2 hover:bg-cream-50 cursor-pointer border-b border-cream-200 flex justify-between items-center"
              onClick={() => handleSelectProduct(product)}
            >
              <div className="flex-grow">
                <div className="font-medium text-sm text-charcoal">{product.name}</div>
                <div className="text-xs text-charcoal-muted">{product.vendor || 'Ukjent leverandør'}</div>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-terracotta-600 mr-2">
                  {formatPrice(product.current_price)} kr
                </span>
                <button className="bg-terracotta-100 text-terracotta-700 p-1 rounded hover:bg-terracotta-200">
                  <TbShoppingCart size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && searchResults.length === 0 && !isLoading && searchTerm.length >= 3 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-cream-300 rounded-xl shadow-lg p-4 text-center">
          <p className="text-charcoal-muted">Ingen produkter funnet.</p>
          <p className="text-sm text-charcoal-muted mt-1">Prøv et annet søkeord.</p>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;