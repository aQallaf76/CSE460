const db = require('../models/database');

class OrderController {
  // Create new order
  async createOrder(req, res) {
    try {
      const { customerName, items } = req.body;
      
      if (!customerName || !items || items.length === 0) {
        return res.status(400).json({ error: 'Customer name and items are required' });
      }

      // Calculate total amount
      let totalAmount = 0;
      for (const item of items) {
        const menuItem = await db.query('SELECT price FROM menu_items WHERE id = ? AND available = 1', [item.menuItemId]);
        if (menuItem.length === 0) {
          return res.status(400).json({ error: `Menu item with id ${item.menuItemId} not found or unavailable` });
        }
        totalAmount += menuItem[0].price * item.quantity;
      }

      // Create order
      const orderSql = 'INSERT INTO orders (customer_name, total_amount) VALUES (?, ?)';
      const orderResult = await db.run(orderSql, [customerName, totalAmount]);
      const orderId = orderResult.id;

      // Add order items
      for (const item of items) {
        const menuItem = await db.query('SELECT price FROM menu_items WHERE id = ?', [item.menuItemId]);
        const orderItemSql = 'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)';
        await db.run(orderItemSql, [orderId, item.menuItemId, item.quantity, menuItem[0].price]);
      }

      res.status(201).json({
        orderId,
        customerName,
        totalAmount,
        status: 'pending',
        message: 'Order created successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  }

  // Get all orders
  async getAllOrders(req, res) {
    try {
      const sql = `
        SELECT o.*, 
               GROUP_CONCAT(mi.name || ' (x' || oi.quantity || ')') as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `;
      const orders = await db.query(sql);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  // Get order by ID
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      
      // Get order details
      const orderSql = 'SELECT * FROM orders WHERE id = ?';
      const orders = await db.query(orderSql, [id]);
      
      if (orders.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Get order items
      const itemsSql = `
        SELECT oi.*, mi.name, mi.description
        FROM order_items oi
        JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE oi.order_id = ?
      `;
      const items = await db.query(itemsSql, [id]);

      const order = orders[0];
      order.items = items;

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  }

  // Update order status
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') });
      }

      const sql = 'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      const result = await db.run(sql, [status, id]);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      res.json({ message: 'Order status updated successfully', status });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order status' });
    }
  }

  // Get orders by status
  async getOrdersByStatus(req, res) {
    try {
      const { status } = req.params;
      const sql = `
        SELECT o.*, 
               GROUP_CONCAT(mi.name || ' (x' || oi.quantity || ')') as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE o.status = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `;
      const orders = await db.query(sql, [status]);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders by status' });
    }
  }

  // Get pending orders (for kitchen staff)
  async getPendingOrders(req, res) {
    try {
      const sql = `
        SELECT o.*, 
               GROUP_CONCAT(mi.name || ' (x' || oi.quantity || ')') as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE o.status IN ('pending', 'preparing')
        GROUP BY o.id
        ORDER BY o.created_at ASC
      `;
      const orders = await db.query(sql);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch pending orders' });
    }
  }

  // Cancel order
  async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      const sql = 'UPDATE orders SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status IN ("pending", "preparing")';
      const result = await db.run(sql, [id]);
      
      if (result.changes === 0) {
        return res.status(400).json({ error: 'Order cannot be cancelled or not found' });
      }
      
      res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to cancel order' });
    }
  }
}

module.exports = new OrderController(); 