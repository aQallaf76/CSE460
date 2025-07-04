import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/Menu.css';
import { useCart } from '../CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { showToast } from '../components/Toast';

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name'); // name, price, popularity
  const { addToCart, getTotalItems } = useCart();

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    try {
      setLoading(true);
      const [categoriesData, itemsData] = await Promise.all([
        api.getMenuCategories(),
        api.getMenuItems()
      ]);
      setCategories(categoriesData);
      setItems(itemsData);
      setError(null);
    } catch (err) {
      setError('Failed to load menu data');
      console.error('Error loading menu:', err);
      showToast('Failed to load menu data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedItems = () => {
    let filtered = selectedCategory === 'All' 
      ? items 
      : items.filter(item => item.category === selectedCategory);

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const handleQuickAdd = (item) => {
    addToCart(item);
    // Show success feedback
    showAddToCartFeedback(item.name);
  };

  const showAddToCartFeedback = (itemName) => {
    showToast(`Added ${itemName} to cart!`, 'success');
  };

  if (loading) {
    return (
      <div className="menu-container">
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading our delicious menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button onClick={loadMenuData} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  const displayItems = filteredAndSortedItems();

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1>🍽️ Sundevil Cafeteria Menu</h1>
        <p className="menu-subtitle">Discover our delicious selection of fresh, quality meals</p>
        <div style={{marginTop: '10px', fontWeight: 'bold', color: '#8B0000'}}>
          🛒 Cart: {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="menu-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for your favorite dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="sort-container">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Name</option>
            <option value="price">Price (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <button 
          className={`category-btn ${selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('All')}
        >
          🌟 All Items
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.name)}
          >
            {getCategoryIcon(category.name)} {category.name}
          </button>
        ))}
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>Showing {displayItems.length} of {items.length} items</p>
        {searchTerm && (
          <p className="search-results">Search results for: "{searchTerm}"</p>
        )}
      </div>

      {/* Menu Items */}
      <div className="menu-grid">
        {displayItems.map(item => (
          <div key={item.id} className="menu-item">
            <div className="item-image">
              <span className="item-emoji">{item.image}</span>
              {!item.available && <div className="unavailable-overlay">Unavailable</div>}
            </div>
            <div className="item-info">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-description">{item.description}</p>
              <div className="item-footer">
                <span className="item-price">${item.price.toFixed(2)}</span>
                <div className="item-actions">
                  <span className={`item-status ${item.available ? 'available' : 'unavailable'}`}>
                    {item.available ? '✅ Available' : '❌ Unavailable'}
                  </span>
                  {item.available && (
                    <button 
                      className="quick-add-btn"
                      onClick={() => handleQuickAdd(item)}
                      title="Add to cart"
                    >
                      ➕
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayItems.length === 0 && (
        <div className="no-items">
          <div className="no-items-icon">🍽️</div>
          <h3>No items found</h3>
          <p>
            {searchTerm 
              ? `No items match your search for "${searchTerm}". Try a different search term.`
              : `No items available in the ${selectedCategory} category.`
            }
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="clear-filters-btn"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

// Helper function to get category icons
const getCategoryIcon = (categoryName) => {
  switch (categoryName) {
    case 'Beverages':
      return '🥤';
    case 'Breakfast':
      return '🌅';
    case 'Lunch':
      return '🌞';
    case 'Dinner':
      return '🌙';
    default:
      return '🍽️';
  }
};

export default Menu; 