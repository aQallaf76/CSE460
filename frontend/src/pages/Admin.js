import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/Admin.css';

const Admin = () => {
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadDashboardData();
    // Refresh data every 60 seconds
    const interval = setInterval(loadDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, ordersData, menuData, categoriesData] = await Promise.all([
        api.getDashboardStats(),
        api.getOrders(),
        api.getMenuItems(),
        api.getMenuCategories()
      ]);
      
      setStats(statsData);
      setOrders(ordersData);
      setMenuItems(menuData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'preparing': return 'status-preparing';
      case 'ready': return 'status-ready';
      case 'completed': return 'status-completed';
      default: return 'status-pending';
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setEditingItem(null);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>📊 Admin Dashboard</h1>
      
      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleTabChange('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => handleTabChange('menu')}
        >
          🍽️ Menu Management
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => handleTabChange('orders')}
        >
          📋 Order Management
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => handleTabChange('analytics')}
        >
          📈 Analytics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <DashboardTab stats={stats} orders={orders} />
      )}
      
      {activeTab === 'menu' && (
        <MenuManagementTab 
          menuItems={menuItems}
          categories={categories}
          onRefresh={loadDashboardData}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
        />
      )}
      
      {activeTab === 'orders' && (
        <OrderManagementTab orders={orders} onRefresh={loadDashboardData} />
      )}
      
      {activeTab === 'analytics' && (
        <AnalyticsTab orders={orders} />
      )}
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab = ({ stats, orders }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'preparing': return 'status-preparing';
      case 'ready': return 'status-ready';
      case 'completed': return 'status-completed';
      default: return 'status-pending';
    }
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
    return orderTime.toLocaleString();
  };

  return (
    <div className="dashboard-tab">
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <span className="stat-number">{stats?.totalOrders || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Orders</h3>
            <span className="stat-number">{stats?.pendingOrders || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍🍳</div>
          <div className="stat-content">
            <h3>Preparing</h3>
            <span className="stat-number">{stats?.preparingOrders || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <span className="stat-number">${stats?.totalRevenue || '0.00'}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <h2>Recent Orders</h2>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found.</p>
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
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
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
                      <span className={`status-badge ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td>{formatRelativeTime(order.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Menu Management Tab Component
const MenuManagementTab = ({ 
  menuItems, 
  categories, 
  onRefresh, 
  editingItem, 
  setEditingItem, 
  showAddForm, 
  setShowAddForm 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true
  });

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await api.addMenuItem(formData);
      setFormData({ name: '', description: '', price: '', category: '', available: true });
      setShowAddForm(false);
      onRefresh();
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    try {
      await api.updateMenuItem(editingItem.id, formData);
      setEditingItem(null);
      setFormData({ name: '', description: '', price: '', category: '', available: true });
      onRefresh();
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.deleteMenuItem(itemId);
        onRefresh();
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      available: item.available
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', category: '', available: true });
  };

  return (
    <div className="menu-management-tab">
      <div className="menu-header">
        <h2>🍽️ Menu Management</h2>
        <button 
          className="add-item-btn"
          onClick={() => setShowAddForm(true)}
        >
          ➕ Add New Item
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingItem) && (
        <div className="menu-form">
          <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
          <form onSubmit={editingItem ? handleEditItem : handleAddItem}>
            <div className="form-row">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price ($):</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Available:</label>
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({...formData, available: e.target.checked})}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
              <button type="button" className="cancel-btn" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Items Table */}
      <div className="menu-items-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map(item => (
              <tr key={item.id}>
                <td>
                  <div className="item-info">
                    <span className="item-emoji">{item.image}</span>
                    <div>
                      <strong>{item.name}</strong>
                      {item.description && <p className="item-desc">{item.description}</p>}
                    </div>
                  </div>
                </td>
                <td>{item.category}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  <span className={`availability ${item.available ? 'available' : 'unavailable'}`}>
                    {item.available ? '✅ Available' : '❌ Unavailable'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="edit-btn"
                      onClick={() => startEdit(item)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Order Management Tab Component
const OrderManagementTab = ({ orders, onRefresh }) => {
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      onRefresh();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="order-management-tab">
      <h2>📋 Order Management</h2>
      <p>Advanced order management features coming soon!</p>
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
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
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
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab = ({ orders }) => {
  // Calculate analytics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  // Group orders by hour
  const ordersByHour = {};
  orders.forEach(order => {
    const hour = new Date(order.timestamp).getHours();
    ordersByHour[hour] = (ordersByHour[hour] || 0) + 1;
  });

  return (
    <div className="analytics-tab">
      <h2>📈 Analytics</h2>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Revenue Overview</h3>
          <div className="analytics-stats">
            <div className="stat">
              <span className="stat-label">Total Revenue</span>
              <span className="stat-value">${totalRevenue.toFixed(2)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Average Order Value</span>
              <span className="stat-value">${avgOrderValue.toFixed(2)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{orders.length}</span>
            </div>
          </div>
        </div>
        
        <div className="analytics-card">
          <h3>Peak Hours</h3>
          <div className="peak-hours">
            {Object.entries(ordersByHour)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([hour, count]) => (
                <div key={hour} className="peak-hour">
                  <span>{hour}:00</span>
                  <span>{count} orders</span>
                </div>
              ))}
          </div>
        </div>
      </div>
      
      <div className="coming-soon">
        <h3>🚀 More Analytics Coming Soon!</h3>
        <p>Advanced reporting features including:</p>
        <ul>
          <li>Sales trends and forecasting</li>
          <li>Popular items analysis</li>
          <li>Customer behavior insights</li>
          <li>Staff performance metrics</li>
        </ul>
      </div>
    </div>
  );
};

export default Admin; 