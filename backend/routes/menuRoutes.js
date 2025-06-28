const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// GET /api/menu - Get all menu items
router.get('/', menuController.getAllMenuItems);

// GET /api/menu/categories - Get all categories
router.get('/categories', menuController.getCategories);

// GET /api/menu/category/:category - Get menu items by category
router.get('/category/:category', menuController.getMenuItemsByCategory);

// GET /api/menu/:id - Get single menu item
router.get('/:id', menuController.getMenuItem);

// POST /api/menu - Add new menu item (Admin)
router.post('/', menuController.addMenuItem);

// PUT /api/menu/:id - Update menu item (Admin)
router.put('/:id', menuController.updateMenuItem);

// DELETE /api/menu/:id - Delete menu item (Admin)
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router; 