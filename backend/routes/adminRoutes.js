const express = require('express');
const router = express.Router();
const db = require('../models/database');
const firebaseDb = require('../firebase');

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    // Get all orders from Firestore
    const snapshot = await firebaseDb.collection('orders').get();
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Calculate stats from Firestore orders
    const totalOrders = orders.length;
    const ordersByStatus = {};
    let totalRevenue = 0;

    orders.forEach(order => {
      // Count by status
      const status = order.status || 'pending';
      ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
      
      // Calculate revenue (exclude cancelled orders)
      if (status !== 'cancelled') {
        totalRevenue += order.total || 0;
      }
    });

    // Convert ordersByStatus to array format for consistency
    const ordersByStatusArray = Object.entries(ordersByStatus).map(([status, count]) => ({
      status,
      count
    }));

    // Get top selling items from Firestore orders
    const itemCounts = {};
    orders.forEach(order => {
      if (order.status !== 'cancelled' && order.items) {
        order.items.forEach(item => {
          const itemName = item.name || 'Unknown Item';
          itemCounts[itemName] = (itemCounts[itemName] || 0) + item.quantity;
        });
      }
    });

    const topItems = Object.entries(itemCounts)
      .map(([name, total_quantity]) => ({ name, total_quantity }))
      .sort((a, b) => b.total_quantity - a.total_quantity)
      .slice(0, 5);

    res.json({
      totalOrders,
      ordersByStatus: ordersByStatusArray,
      totalRevenue: totalRevenue.toFixed(2),
      topItems
    });
  } catch (error) {
    console.error('Error fetching dashboard data from Firestore:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// GET /api/admin/analytics - Get detailed analytics
router.get('/analytics', async (req, res) => {
  try {
    const { period = '7' } = req.query; // Default to last 7 days
    
    // Get orders by date
    const ordersByDate = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count, SUM(total_amount) as revenue
      FROM orders
      WHERE created_at >= datetime('now', '-${period} days')
      GROUP BY DATE(created_at)
      ORDER BY date
    `);
    
    // Get category performance
    const categoryPerformance = await db.query(`
      SELECT mi.category, COUNT(oi.id) as orders, SUM(oi.quantity) as items_sold
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.created_at >= datetime('now', '-${period} days')
      GROUP BY mi.category
      ORDER BY items_sold DESC
    `);

    res.json({
      ordersByDate,
      categoryPerformance
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// TEMPORARY: Cleanup duplicate menu items
router.post('/cleanup-menu-duplicates', async (req, res) => {
  try {
    const sql = `DELETE FROM menu_items WHERE id NOT IN (SELECT MIN(id) FROM menu_items GROUP BY name, category);`;
    await db.run(sql);
    res.json({ message: 'Duplicate menu items removed from the database.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clean up duplicates', details: error.message });
  }
});

module.exports = router; 