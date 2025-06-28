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
      // Beverages
      { name: 'Coffee', description: 'Whether black, with cream and sugar, or as specialty drinks like lattes and cappuccinos', price: 3.50, category: 'Beverages' },
      { name: 'Iced Tea', description: 'Served sweetened or unsweetened with lemon', price: 2.75, category: 'Beverages' },
      { name: 'Soda (Soft Drinks)', description: 'Varieties like cola (Coca-Cola, Pepsi), lemon-lime (Sprite, 7UP), root beer', price: 2.50, category: 'Beverages' },
      { name: 'Craft Beer', description: 'With a growing craft brewery scene', price: 6.50, category: 'Beverages' },
      { name: 'Bottled Water', description: 'Both still or sparkling', price: 2.00, category: 'Beverages' },

      // Breakfast Items
      { name: 'Pancakes', description: 'Fluffy pancakes served with butter and maple syrup, often accompanied by bacon or sausage', price: 9.99, category: 'Breakfast' },
      { name: 'French Toast', description: 'Thick slices of bread dipped in egg batter and fried until golden brown, served with maple syrup and butter', price: 8.99, category: 'Breakfast' },
      { name: 'Omelette', description: 'Fluffy eggs folded around fillings like cheese, ham, mushrooms, peppers, and onions', price: 10.99, category: 'Breakfast' },
      { name: 'Bacon and Eggs', description: 'Classic combination of crispy bacon strips and eggs cooked to order (scrambled, fried, or poached)', price: 11.99, category: 'Breakfast' },
      { name: 'Waffles', description: 'Crispy waffles served with butter and maple syrup, often topped with fresh berries or whipped cream', price: 9.99, category: 'Breakfast' },
      { name: 'Breakfast Burrito', description: 'Flour tortilla filled with scrambled eggs, cheese, and choice of bacon, sausage, or vegetables', price: 8.99, category: 'Breakfast' },
      { name: 'Granola Bowl', description: 'Greek yogurt topped with granola, fresh berries, and a drizzle of honey', price: 7.99, category: 'Breakfast' },
      { name: 'Bagel with Cream Cheese', description: 'Fresh bagel served with cream cheese, often with options for lox, tomato, or cucumber', price: 5.99, category: 'Breakfast' },
      { name: 'Breakfast Sandwich', description: 'English muffin, biscuit, or croissant filled with eggs, cheese, and a choice of sausage, bacon, or ham', price: 8.99, category: 'Breakfast' },
      { name: 'Greek Yogurt Parfait', description: 'Layers of Greek yogurt, granola, and fresh berries or fruit, sometimes drizzled with honey or maple syrup', price: 7.99, category: 'Breakfast' },

      // Lunch Items
      { name: 'Cheeseburger', description: 'Classic American favorite, typically served with lettuce, tomato, onion, pickles, and condiments on a bun', price: 12.99, category: 'Lunch' },
      { name: 'Club Sandwich', description: 'Triple-decker sandwich with layers of turkey or chicken, bacon, lettuce, tomato, and mayo on toasted bread', price: 13.99, category: 'Lunch' },
      { name: 'Caesar Salad', description: 'Romaine lettuce tossed with Caesar dressing, croutons, and Parmesan cheese, often topped with grilled chicken or shrimp', price: 10.99, category: 'Lunch' },
      { name: 'BBQ Ribs', description: 'Slow-cooked pork or beef ribs slathered in barbecue sauce, served with coleslaw and cornbread', price: 18.99, category: 'Lunch' },
      { name: 'Philly Cheesesteak', description: 'Sliced steak, often with grilled onions and peppers, topped with melted cheese on a hoagie roll', price: 14.99, category: 'Lunch' },
      { name: 'New England Clam Chowder', description: 'Cream-based soup with clams, potatoes, onions, and celery, seasoned with herbs and spices', price: 8.99, category: 'Lunch' },
      { name: 'Cobb Salad', description: 'Mixed greens topped with grilled chicken, bacon, avocado, hard-boiled eggs, tomatoes, blue cheese, and vinaigrette dressing', price: 13.99, category: 'Lunch' },
      { name: 'Pulled Pork Sandwich', description: 'Slow-cooked pork shoulder shredded and mixed with barbecue sauce, served on a bun with pickles and coleslaw', price: 12.99, category: 'Lunch' },
      { name: 'Fish Tacos', description: 'Soft corn tortillas filled with grilled or fried fish, cabbage slaw, avocado, salsa, and lime', price: 11.99, category: 'Lunch' },

      // Dinner Items
      { name: 'Shrimp Scampi', description: 'Shrimp sautéed in garlic butter and white wine sauce, served over linguine pasta with a sprinkle of Parmesan cheese and parsley', price: 22.99, category: 'Dinner' },
      { name: 'BBQ Brisket', description: 'Slow-smoked beef brisket served with coleslaw, baked beans, cornbread, and pickles', price: 24.99, category: 'Dinner' },
      { name: 'Vegetarian Lasagna', description: 'Layers of pasta filled with ricotta cheese, spinach, mushrooms, and marinara sauce, topped with mozzarella cheese and baked until golden', price: 16.99, category: 'Dinner' },
      { name: 'Stuffed Bell Peppers', description: 'Bell peppers stuffed with a mixture of ground beef or turkey, rice, tomatoes, and cheese, baked until tender', price: 18.99, category: 'Dinner' },
      { name: 'Lobster Tail Dinner', description: 'Broiled or grilled lobster tail served with drawn butter, roasted potatoes or rice, steamed vegetables, and a wedge of lemon', price: 34.99, category: 'Dinner' },
      { name: 'Taco Night', description: 'Build-your-own taco dinner with seasoned ground beef or chicken, soft or crispy taco shells, lettuce, tomatoes, cheese, salsa, sour cream, and guacamole', price: 15.99, category: 'Dinner' },
      { name: 'Buffalo Wings', description: 'Deep-fried chicken wings coated in spicy buffalo sauce, served with celery sticks and blue cheese dressing', price: 14.99, category: 'Dinner' },
      { name: 'Steakhouse Dinner', description: 'A classic American favorite featuring a grilled steak (such as ribeye, filet mignon, or New York strip) served with sides like mashed potatoes, steamed vegetables, and a salad', price: 28.99, category: 'Dinner' },
      { name: 'Grilled Salmon', description: 'Fresh salmon fillet grilled and served with rice pilaf or roasted potatoes, steamed asparagus, and a lemon wedge', price: 26.99, category: 'Dinner' },
      { name: 'Roast Chicken', description: 'Herb-roasted or rotisserie chicken served with mashed potatoes, gravy, roasted vegetables, and a side of cranberry sauce', price: 20.99, category: 'Dinner' },
      { name: 'Spaghetti and Meatballs', description: 'Spaghetti pasta topped with marinara sauce and meatballs, served with garlic bread and a side salad', price: 16.99, category: 'Dinner' }
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