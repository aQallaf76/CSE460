const db = require('../models/database');

class MenuController {
  // Get all menu items
  async getAllMenuItems(req, res) {
    try {
      const sql = 'SELECT * FROM menu_items WHERE available = 1 ORDER BY category, name';
      const menuItems = await db.query(sql);
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch menu items' });
    }
  }

  // Get menu items by category
  async getMenuItemsByCategory(req, res) {
    try {
      const { category } = req.params;
      const sql = 'SELECT * FROM menu_items WHERE category = ? AND available = 1 ORDER BY name';
      const menuItems = await db.query(sql, [category]);
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch menu items by category' });
    }
  }

  // Get single menu item
  async getMenuItem(req, res) {
    try {
      const { id } = req.params;
      const sql = 'SELECT * FROM menu_items WHERE id = ? AND available = 1';
      const menuItems = await db.query(sql, [id]);
      
      if (menuItems.length === 0) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
      
      res.json(menuItems[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch menu item' });
    }
  }

  // Add new menu item (Admin only)
  async addMenuItem(req, res) {
    try {
      const { name, description, price, category } = req.body;
      
      if (!name || !price || !category) {
        return res.status(400).json({ error: 'Name, price, and category are required' });
      }

      const sql = 'INSERT INTO menu_items (name, description, price, category) VALUES (?, ?, ?, ?)';
      const result = await db.run(sql, [name, description, price, category]);
      
      res.status(201).json({ 
        id: result.id, 
        name, 
        description, 
        price, 
        category,
        message: 'Menu item added successfully' 
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add menu item' });
    }
  }

  // Update menu item (Admin only)
  async updateMenuItem(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, category, available } = req.body;
      const availableNum = available ? 1 : 0;
      console.log('[updateMenuItem] id:', id, 'name:', name, 'description:', description, 'price:', price, 'category:', category, 'available:', available, 'availableNum:', availableNum);
      const sql = `
        UPDATE menu_items 
        SET name = ?, description = ?, price = ?, category = ?, available = ?
        WHERE id = ?
      `;
      const result = await db.run(sql, [name, description, price, category, availableNum, id]);
      console.log('[updateMenuItem] update result:', result);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
      res.json({ message: 'Menu item updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update menu item' });
    }
  }

  // Delete menu item (Admin only)
  async deleteMenuItem(req, res) {
    try {
      const { id } = req.params;
      const sql = 'DELETE FROM menu_items WHERE id = ?';
      const result = await db.run(sql, [id]);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
      
      res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete menu item' });
    }
  }

  // Get menu categories
  async getCategories(req, res) {
    try {
      const sql = 'SELECT DISTINCT category FROM menu_items WHERE available = 1 ORDER BY category';
      const categories = await db.query(sql);
      res.json(categories.map(cat => cat.category));
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

  // Get all menu items (admin, show all regardless of availability)
  async getAllMenuItemsAdmin(req, res) {
    try {
      const sql = 'SELECT * FROM menu_items ORDER BY category, name';
      const menuItems = await db.query(sql);
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch menu items (admin)' });
    }
  }
}

module.exports = new MenuController(); 