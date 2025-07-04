const db = require('../models/database');
const firebaseDb = require('../firebase');

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

      // Return the created order in the expected format
      const createdOrder = {
        customerName: customerName,
        total: totalAmount,
        status: 'pending',
        timestamp: new Date().toISOString(),
        items: await Promise.all(items.map(async (item) => {
          const menuItem = await db.query('SELECT name, price FROM menu_items WHERE id = ?', [item.menuItemId]);
          return {
            name: menuItem[0]?.name || `Item ${item.menuItemId}`,
            quantity: item.quantity,
            price: menuItem[0]?.price || 0
          };
        }))
      };

      // Save order to Firebase Firestore
      let firestoreOrderId = null;
      try {
        const docRef = await firebaseDb.collection('orders').add(createdOrder);
        firestoreOrderId = docRef.id;
      } catch (firebaseError) {
        console.error('Error saving order to Firebase:', firebaseError);
        // Optionally, you can return a warning but not fail the whole request
      }

      // Respond with the Firestore order (with its generated string ID)
      res.status(201).json({ id: firestoreOrderId, ...createdOrder });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  }

  // Get all orders
  async getAllOrders(req, res) {
    try {
      const { customer } = req.query;
      
      // Fetch all orders from Firestore
      const snapshot = await firebaseDb.collection('orders').orderBy('timestamp', 'desc').get();
      let ordersWithItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter by customer name if provided
      if (customer) {
        ordersWithItems = ordersWithItems.filter(order => 
          order.customerName && 
          order.customerName.toLowerCase().includes(customer.toLowerCase())
        );
      }

      res.json(ordersWithItems);
    } catch (error) {
      console.error('Error fetching orders from Firestore:', error);
      res.status(500).json({ error: 'Failed to fetch orders from Firestore' });
    }
  }

  // Get order by ID
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      // Fetch order from Firestore
      const doc = await firebaseDb.collection('orders').doc(id).get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch order from Firestore' });
    }
  }

  // Update order status
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') });
      }

      // Update order status in Firestore
      const orderRef = firebaseDb.collection('orders').doc(id);
      await orderRef.update({
        status,
        updatedAt: new Date().toISOString()
      });
      
      res.json({ message: 'Order status updated successfully', status });
    } catch (error) {
      console.error('Error updating order status in Firestore:', error);
      res.status(500).json({ error: 'Failed to update order status in Firestore' });
    }
  }

  // Get orders by status
  async getOrdersByStatus(req, res) {
    try {
      const { status } = req.params;
      // Fetch orders by status from Firestore
      const snapshot = await firebaseDb.collection('orders').where('status', '==', status).orderBy('timestamp', 'desc').get();
      const ordersWithItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      res.json(ordersWithItems);
    } catch (error) {
      console.error('Error fetching orders by status from Firestore:', error);
      res.status(500).json({ error: 'Failed to fetch orders by status from Firestore' });
    }
  }

  // Get pending orders (for kitchen staff)
  async getPendingOrders(req, res) {
    try {
      // Fetch pending/preparing orders from Firestore
      const snapshot = await firebaseDb.collection('orders').where('status', 'in', ['pending', 'preparing']).orderBy('timestamp', 'asc').get();
      const ordersWithItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      res.json(ordersWithItems);
    } catch (error) {
      console.error('Error fetching pending orders from Firestore:', error);
      res.status(500).json({ error: 'Failed to fetch pending orders from Firestore' });
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

  // Get dashboard statistics
  async getDashboardStats(req, res) {
    try {
      // Get all orders from Firestore
      const snapshot = await firebaseDb.collection('orders').get();
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === "pending").length;
      const preparingOrders = orders.filter(o => o.status === "preparing").length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      res.json({
        totalOrders,
        pendingOrders,
        preparingOrders,
        totalRevenue: totalRevenue.toFixed(2)
      });
    } catch (error) {
      console.error('Error fetching dashboard stats from Firestore:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard stats from Firestore' });
    }
  }
}

module.exports = new OrderController(); 