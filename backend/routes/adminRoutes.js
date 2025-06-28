const express = require('express');
const router = express.Router();
const db = require('../models/database');

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    // Get total orders
    const totalOrders = await db.query('SELECT COUNT(*) as count FROM orders');
    
    // Get orders by status
    const ordersByStatus = await db.query(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status
    `);
    
    // Get total revenue
    const totalRevenue = await db.query(`
      SELECT SUM(total_amount) as total 
      FROM orders 
      WHERE status != 'cancelled'
    `);
    
    // Get top selling items
    const topItems = await db.query(`
      SELECT mi.name, SUM(oi.quantity) as total_quantity
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      GROUP BY mi.id, mi.name
      ORDER BY total_quantity DESC
      LIMIT 5
    `);

    res.json({
      totalOrders: totalOrders[0].count,
      ordersByStatus,
      totalRevenue: totalRevenue[0].total || 0,
      topItems
    });
  } catch (error) {
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

module.exports = router; 