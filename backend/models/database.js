const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.dbPath = path.join(__dirname, '../../database/cafeteria.db');
    this.db = null;
  }

  initializeDatabase() {
    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('✅ Connected to SQLite database');
        this.createTables();
      }
    });
  }

  createTables() {
    // Menu Items Table
    const createMenuTable = `
      CREATE TABLE IF NOT EXISTS menu_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        available BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Orders Table
    const createOrdersTable = `
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Order Items Table
    const createOrderItemsTable = `
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        menu_item_id INTEGER,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
      )
    `;

    this.db.serialize(() => {
      this.db.run(createMenuTable);
      this.db.run(createOrdersTable);
      this.db.run(createOrderItemsTable);
      
      // Insert sample menu data
      this.insertSampleData();
    });
  }

  insertSampleData() {
    const sampleMenuItems = [
      { name: 'Scrambled Eggs', description: 'Fresh eggs with butter', price: 8.99, category: 'breakfast' },
      { name: 'Pancakes', description: 'Fluffy pancakes with maple syrup', price: 7.99, category: 'breakfast' },
      { name: 'Bacon', description: 'Crispy bacon strips', price: 6.99, category: 'breakfast' },
      { name: 'Caesar Salad', description: 'Fresh romaine with caesar dressing', price: 9.99, category: 'lunch' },
      { name: 'Chicken Sandwich', description: 'Grilled chicken with lettuce and tomato', price: 11.99, category: 'lunch' },
      { name: 'Pizza Slice', description: 'Cheese pizza slice', price: 4.99, category: 'lunch' },
      { name: 'Spaghetti', description: 'Pasta with marinara sauce', price: 12.99, category: 'dinner' },
      { name: 'Steak', description: 'Grilled beef steak', price: 18.99, category: 'dinner' },
      { name: 'Coffee', description: 'Hot brewed coffee', price: 2.99, category: 'beverages' },
      { name: 'Orange Juice', description: 'Fresh squeezed orange juice', price: 3.99, category: 'beverages' }
    ];

    const insertMenuItem = `INSERT OR IGNORE INTO menu_items (name, description, price, category) VALUES (?, ?, ?, ?)`;
    
    sampleMenuItems.forEach(item => {
      this.db.run(insertMenuItem, [item.name, item.description, item.price, item.category]);
    });
  }

  // Generic query methods
  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = new Database(); 