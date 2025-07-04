import React, { useState } from 'react';
import { api } from '../services/api';
import { useCart } from '../CartContext';
import '../styles/OrderTracking.css';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { showToast } from '../components/Toast';

const OrderTracking = () => {
  const [customerName, setCustomerName] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getTotalItems } = useCart();

  const loadOrders = async () => {
    if (!customerName.trim()) {
      setError('Please enter your name to view orders');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const customerOrders = await api.getOrdersByCustomer(customerName.trim());
      setOrders(customerOrders);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error loading orders:', err);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'preparing': return 'status-preparing';
      case 'ready': return 'status-ready';
      case 'completed': return 'status-completed';
      default: return 'status-pending';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const orderTime = new Date(timestamp);
    const diffMs = now - orderTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return formatTime(timestamp);
  };

  return (
    <div className="order-tracking-container">
      <div className="tracking-header">
        <h1>📋 Order Tracking</h1>
        <p className="tracking-subtitle">Check the status of your orders</p>
        <div style={{marginTop: '10px', fontWeight: 'bold', color: '#8B0000'}}>
          🛒 Cart: {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-form">
          <input
            type="text"
            placeholder="Enter your name to view orders..."
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="customer-search-input"
            onKeyPress={(e) => e.key === 'Enter' && loadOrders()}
          />
          <button onClick={loadOrders} className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : '🔍 Search Orders'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}

      {/* Orders Display */}
      <div className="orders-section">
        {loading ? (
          <div className="loading-container">
            <LoadingSpinner />
            <p>Loading your orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order.id} className={`order-card ${getStatusColor(order.status)}`}>
                <div className="order-header">
                  <span className="order-emoji">📝</span>
                  <h3 className="order-name">Order #{order.id}</h3>
                </div>
                <div className="order-details">
                  <p className="order-time">
                    <strong>Ordered:</strong> {formatRelativeTime(order.timestamp)}
                  </p>
                  {order.updatedAt && (
                    <p className="order-updated">
                      <strong>Last Updated:</strong> {formatRelativeTime(order.updatedAt)}
                    </p>
                  )}
                </div>
                <div className="order-items">
                  <h4>Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item-row">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                      <span className="item-price">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-footer-row">
                  <span className="order-total"><strong>Total: ${order.total.toFixed(2)}</strong></span>
                  <StatusBadge status={order.status} />
                </div>
                {/* Status Progress */}
                <div className="status-progress">
                  <div className={`progress-step ${order.status === 'pending' || order.status === 'preparing' || order.status === 'ready' || order.status === 'completed' ? 'completed' : ''}`}>
                    <span className="step-icon">📝</span>
                    <span className="step-label">Order Placed</span>
                  </div>
                  <div className={`progress-step ${order.status === 'preparing' || order.status === 'ready' || order.status === 'completed' ? 'completed' : ''}`}>
                    <span className="step-icon">👨‍🍳</span>
                    <span className="step-label">Preparing</span>
                  </div>
                  <div className={`progress-step ${order.status === 'ready' || order.status === 'completed' ? 'completed' : ''}`}>
                    <span className="step-icon">✅</span>
                    <span className="step-label">Ready</span>
                  </div>
                  <div className={`progress-step ${order.status === 'completed' ? 'completed' : ''}`}>
                    <span className="step-icon">🎉</span>
                    <span className="step-label">Completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : customerName && !loading ? (
          <div className="no-orders">
            <div className="no-orders-icon">📋</div>
            <h3>No orders found</h3>
            <p>No orders found for "{customerName}". Please check the spelling or place a new order.</p>
            <button onClick={() => window.location.href = '/order'} className="place-order-btn">
              Place New Order
            </button>
          </div>
        ) : null}
      </div>

      {/* Instructions */}
      {!customerName && !loading && (
        <div className="instructions">
          <h3>How to track your order:</h3>
          <ol>
            <li>Enter the name you used when placing your order</li>
            <li>Click "Search Orders" to view your order history</li>
            <li>See real-time status updates for all your orders</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default OrderTracking; 