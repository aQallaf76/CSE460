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
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id.slice(0, 6)}</td>
                    <td>{order.customerName}</td>
                    <td>
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item-summary">
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                    </td>
                    <td>${order.total}</td>
                    <td>
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
                      <StatusBadge status={order.status} />
                    </td>
                    <td>{new Date(order.timestamp).toLocaleString()}</td>
                    <td>
                      <button className="view-btn">👁️ View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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