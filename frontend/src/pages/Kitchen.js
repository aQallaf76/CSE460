import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/Kitchen.css';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { showToast } from '../components/Toast';

const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
    // Refresh orders every 30 seconds
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await api.getOrders();
      setOrders(ordersData);
      setError(null);
    } catch (err) {
      setError('Failed to load orders');
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      // Reload orders to get updated data
      await loadOrders();
      showToast('Order status updated!', 'success');
    } catch (err) {
      setError('Failed to update order status');
      showToast('Failed to update order status', 'error');
    }
  };

  // Sort orders by timestamp descending
  const sortedOrders = [...orders].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (loading) {
    return (
      <div className="kitchen-container">
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="kitchen-container">
      <h1>👨‍🍳 Kitchen Dashboard</h1>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}

      <div className="kitchen-stats">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <span className="stat-number">{orders.length}</span>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <span className="stat-number">{orders.filter(o => o.status === 'pending').length}</span>
        </div>
        <div className="stat-card">
          <h3>Preparing</h3>
          <span className="stat-number">{orders.filter(o => o.status === 'preparing').length}</span>
        </div>
        <div className="stat-card">
          <h3>Ready</h3>
          <span className="stat-number">{orders.filter(o => o.status === 'ready').length}</span>
        </div>
      </div>

      <div className="orders-section">
        <h2>All Orders</h2>
        {sortedOrders.length === 0 ? (
          <div className="no-orders">
            <p>No orders at the moment.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {sortedOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className="order-emoji">📝</span>
                  <h3 className="order-name">Order #{order.id.slice(0, 6)}</h3>
                </div>
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item-row">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="order-footer-row">
                  <span className="order-total">${order.total}</span>
                  <StatusBadge status={order.status} />
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button className="view-btn">👁️ View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={loadOrders} className="refresh-btn">
        🔄 Refresh Orders
      </button>
    </div>
  );
};

export default Kitchen; 