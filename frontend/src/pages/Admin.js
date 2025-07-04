import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/Admin.css';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { showToast } from '../components/Toast';

const Admin = () => {
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setEditingItem(null);
    setShowAddForm(false);
  };

  // Helper to filter only Firestore orders
  const filterFirestoreOrders = orders => orders.filter(order => typeof order.id === 'string' && order.id.length > 8);

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading dashboard...</p>
        </div>
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
          className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => handleTabChange('preview')}
        >
          👁️ Preview Menu
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
        <DashboardTab stats={stats} orders={filterFirestoreOrders(orders)} />
      )}
      {activeTab === 'preview' && (
        <MenuPreviewTab menuItems={menuItems} categories={categories} />
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
        <OrderManagementTab orders={filterFirestoreOrders(orders)} onRefresh={loadDashboardData} />
      )}
      {activeTab === 'analytics' && (
        <AnalyticsTab orders={filterFirestoreOrders(orders)} />
      )}
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab = ({ stats, orders }) => {
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
                {orders.filter(order => typeof order.id === 'string' && order.id.length > 8).map(order => (
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
                      <StatusBadge status={order.status} />
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
              <th></th>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map(item => (
              <tr key={item.id}>
                <td className="item-emoji-cell">{item.image}</td>
                <td className="item-name-cell">{item.name}</td>
                <td className="item-desc-cell">{item.description}</td>
                <td>{item.category}</td>
                <td className="item-price-cell">${item.price.toFixed(2)}</td>
                <td>
                  <span className={`availability ${item.available ? 'available' : 'unavailable'}`}>{item.available ? '✅ Available' : '❌ Unavailable'}</span>
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
      showToast('Order status updated!', 'success');
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast('Failed to update order status', 'error');
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
            {orders.filter(order => typeof order.id === 'string' && order.id.length > 8).map(order => (
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
    </div>
  );
};

// Menu Preview Tab Component
const MenuPreviewTab = ({ menuItems, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

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

  const displayItems = filteredItems();

  return (
    <div className="menu-preview-tab">
      <div className="order-header">
        <h1>👁️ Menu Preview</h1>
        <p className="order-subtitle">This is how customers see the menu</p>
      </div>
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
                <span className="availability-badge" style={{marginLeft: 12}}>
                  {item.available ? <span className="available">✅ Available</span> : <span className="unavailable">❌ Unavailable</span>}
                </span>
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

export default Admin; 