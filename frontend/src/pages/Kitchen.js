import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/Kitchen.css';

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
      const ordersData = await api.getPendingOrders();
      setOrders(ordersData);
      setError(null);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      // Reload orders to get updated data
      await loadOrders();
    } catch (err) {
      setError('Failed to update order status');
      console.error('Error updating order status:', err);
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

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'pending': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'completed';
      default: return currentStatus;
    }
  };

  const getStatusButtonText = (currentStatus) => {
    switch (currentStatus) {
      case 'pending': return 'Start Preparing';
      case 'preparing': return 'Mark as Ready';
      case 'ready': return 'Mark as Completed';
      default: return 'Update Status';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
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

  if (loading) {
    return (
      <div className="kitchen-container">
        <div className="loading">Loading orders...</div>
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
        <h2>Active Orders</h2>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders at the moment.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.filter(order => typeof order.id === 'string' && order.id.length > 8).map(order => (
              <div key={order.id} className={`order-card ${getStatusColor(order.status)}`}>
                <div className="order-header">
                  <h3>Order #{order.id}</h3>
                  <span className={`status-badge ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                
                <div className="customer-info">
                  <p><strong>Customer:</strong> {order.customerName}</p>
                  <p><strong>Time:</strong> {formatRelativeTime(order.timestamp)}</p>
                </div>

                <div className="order-items">
                  <h4>Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                      <span className="item-price">${item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total: ${order.total}</strong>
                  </div>
                  
                  {order.status !== 'completed' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                      className="status-btn"
                    >
                      {getStatusButtonText(order.status)}
                    </button>
                  )}
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