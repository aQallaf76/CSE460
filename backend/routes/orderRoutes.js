const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /api/orders - Create new order
router.post('/', orderController.createOrder);

// GET /api/orders - Get all orders
router.get('/', orderController.getAllOrders);

// GET /api/orders/pending - Get pending orders (for kitchen staff)
router.get('/pending', orderController.getPendingOrders);

// GET /api/orders/status/:status - Get orders by status
router.get('/status/:status', orderController.getOrdersByStatus);

// GET /api/orders/:id - Get order by ID
router.get('/:id', orderController.getOrderById);

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', orderController.updateOrderStatus);

// DELETE /api/orders/:id - Cancel order
router.delete('/:id', orderController.cancelOrder);

module.exports = router; 