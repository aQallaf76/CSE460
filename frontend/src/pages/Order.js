import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/Order.css';
import { useCart } from '../CartContext';

const Order = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    try {
      setLoading(true);
      const [items, categoriesData] = await Promise.all([
        api.getMenuItems(),
        api.getMenuCategories()
      ]);
      setMenuItems(items);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError('Failed to load menu items');
      console.error('Error loading menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = () => {
    let filtered = selectedCategory === 'All' 
      ? menuItems 
      : menuItems.filter(item => item.category === selectedCategory);

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.filter(item => item.available);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError('Please add items to your cart');
      return;
    }
    if (!customerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: getTotalPrice(),
        customerName: customerName.trim()
      };

      await api.createOrder(orderData);
      setOrderSuccess(true);
      clearCart();
      setCustomerName('');
      setError(null);
      
      // Show success notification
      showOrderSuccessNotification(orderData.customerName);
    } catch (err) {
      setError('Failed to submit order. Please try again.');
      console.error('Error submitting order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showOrderSuccessNotification = (customerName) => {
    const notification = document.createElement('div');
    notification.className = 'order-success-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">🎉</div>
        <div class="notification-text">
          <h4>Order Submitted Successfully!</h4>
          <p>Thank you ${customerName}! Your order has been received.</p>
          <button onclick="window.location.href='/tracking'" class="track-order-btn">
            📋 Track Your Order
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 8000);
  };

  if (loading) {
    return (
      <div className="order-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading our delicious menu...</p>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="order-container">
        <div className="success-container">
          <div className="success-icon">🎉</div>
          <h2>Order Submitted Successfully!</h2>
          <p>Thank you for your order. We'll start preparing it right away.</p>
          <div className="success-actions">
            <button onClick={() => setOrderSuccess(false)} className="btn-primary">
              Place Another Order
            </button>
            <button onClick={() => window.location.href = '/menu'} className="btn-secondary">
              View Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayItems = filteredItems();

  return (
    <div className="order-container">
      <div className="order-header">
        <h1>🛒 Place Your Order</h1>
        <p className="order-subtitle">Select your favorite items and we'll prepare them fresh for you</p>
      </div>
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}

      <div className="order-layout">
        {/* Menu Section */}
        <div className="menu-section">
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
          </div>

          <div className="menu-grid">
            {displayItems.map(item => (
              <div key={item.id} className="menu-item">
                <div className="item-image">
                  <span className="item-emoji">{item.image}</span>
                </div>
                <div className="item-info">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-footer">
                    <span className="price">${item.price.toFixed(2)}</span>
                    <button 
                      onClick={() => addToCart(item)}
                      className="add-btn"
                      title="Add to cart"
                    >
                      ➕ Add to Cart
                    </button>
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
            </div>
          )}
        </div>

        {/* Cart Section */}
        <div className="cart-section">
          <div className="cart-header">
            <h2>🛒 Your Cart</h2>
            {cart.length > 0 && (
              <button onClick={clearCart} className="clear-cart-btn" title="Clear cart">
                🗑️ Clear
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmitOrder}>
            <div className="form-group">
              <label htmlFor="customerName">Your Name:</label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                required
                className="customer-input"
              />
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-cart-icon">🛒</div>
                  <p>Your cart is empty</p>
                  <p className="empty-cart-hint">Add some delicious items to get started!</p>
                </div>
              ) : (
                <>
                  <div className="cart-items-list">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p className="item-price">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="quantity-controls">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="qty-btn"
                            title="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="qty-btn"
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <div className="item-total">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="remove-btn"
                          title="Remove item"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="cart-summary">
                    <div className="summary-row">
                      <span>Items:</span>
                      <span>{getTotalItems()}</span>
                    </div>
                    <div className="summary-row total">
                      <strong>Total:</strong>
                      <strong>${getTotalPrice().toFixed(2)}</strong>
                    </div>
                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Order'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
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

export default Order; 