// API Configuration
// Set REACT_APP_API_URL in your .env file or Netlify environment variables to override the default backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://sundevil-cafeteria-backend.onrender.com';

// Mock data for frontend-only operation
const mockMenuCategories = [
  {
    id: 1,
    name: "Beverages",
    description: "Hot and cold beverages including coffee, tea, and soft drinks"
  },
  {
    id: 2,
    name: "Breakfast",
    description: "Fresh breakfast items served daily"
  },
  {
    id: 3,
    name: "Lunch",
    description: "Delicious lunch options"
  },
  {
    id: 4,
    name: "Dinner",
    description: "Premium dinner selections"
  }
];

const mockMenuItems = [
  // Beverages
  {
    id: 1,
    name: "Coffee",
    description: "Whether black, with cream and sugar, or as specialty drinks like lattes and cappuccinos",
    price: 3.50,
    category: "Beverages",
    image: "☕",
    available: true
  },
  {
    id: 2,
    name: "Iced Tea",
    description: "Served sweetened or unsweetened with lemon",
    price: 2.75,
    category: "Beverages",
    image: "🫖",
    available: true
  },
  {
    id: 3,
    name: "Soda (Soft Drinks)",
    description: "Varieties like cola (Coca-Cola, Pepsi), lemon-lime (Sprite, 7UP), root beer",
    price: 2.50,
    category: "Beverages",
    image: "🥤",
    available: true
  },
  {
    id: 4,
    name: "Craft Beer",
    description: "With a growing craft brewery scene",
    price: 6.50,
    category: "Beverages",
    image: "🍺",
    available: true
  },
  {
    id: 5,
    name: "Bottled Water",
    description: "Both still or sparkling",
    price: 2.00,
    category: "Beverages",
    image: "💧",
    available: true
  },

  // Breakfast Items
  {
    id: 6,
    name: "Pancakes",
    description: "Fluffy pancakes served with butter and maple syrup, often accompanied by bacon or sausage",
    price: 9.99,
    category: "Breakfast",
    image: "🥞",
    available: true
  },
  {
    id: 7,
    name: "French Toast",
    description: "Thick slices of bread dipped in egg batter and fried until golden brown, served with maple syrup and butter",
    price: 8.99,
    category: "Breakfast",
    image: "🍞",
    available: true
  },
  {
    id: 8,
    name: "Omelette",
    description: "Fluffy eggs folded around fillings like cheese, ham, mushrooms, peppers, and onions",
    price: 10.99,
    category: "Breakfast",
    image: "🍳",
    available: true
  },
  {
    id: 9,
    name: "Bacon and Eggs",
    description: "Classic combination of crispy bacon strips and eggs cooked to order (scrambled, fried, or poached)",
    price: 11.99,
    category: "Breakfast",
    image: "🥓",
    available: true
  },
  {
    id: 10,
    name: "Waffles",
    description: "Crispy waffles served with butter and maple syrup, often topped with fresh berries or whipped cream",
    price: 9.99,
    category: "Breakfast",
    image: "🧇",
    available: true
  },
  {
    id: 11,
    name: "Breakfast Burrito",
    description: "Flour tortilla filled with scrambled eggs, cheese, and choice of bacon, sausage, or vegetables",
    price: 8.99,
    category: "Breakfast",
    image: "🌯",
    available: true
  },
  {
    id: 12,
    name: "Granola Bowl",
    description: "Greek yogurt topped with granola, fresh berries, and a drizzle of honey",
    price: 7.99,
    category: "Breakfast",
    image: "🥣",
    available: true
  },
  {
    id: 13,
    name: "Bagel with Cream Cheese",
    description: "Fresh bagel served with cream cheese, often with options for lox, tomato, or cucumber",
    price: 5.99,
    category: "Breakfast",
    image: "🥯",
    available: true
  },
  {
    id: 14,
    name: "Breakfast Sandwich",
    description: "English muffin, biscuit, or croissant filled with eggs, cheese, and a choice of sausage, bacon, or ham",
    price: 8.99,
    category: "Breakfast",
    image: "🥪",
    available: true
  },
  {
    id: 15,
    name: "Greek Yogurt Parfait",
    description: "Layers of Greek yogurt, granola, and fresh berries or fruit, sometimes drizzled with honey or maple syrup",
    price: 7.99,
    category: "Breakfast",
    image: "🥛",
    available: true
  },

  // Lunch Items
  {
    id: 16,
    name: "Cheeseburger",
    description: "Classic American favorite, typically served with lettuce, tomato, onion, pickles, and condiments on a bun",
    price: 12.99,
    category: "Lunch",
    image: "🍔",
    available: true
  },
  {
    id: 17,
    name: "Club Sandwich",
    description: "Triple-decker sandwich with layers of turkey or chicken, bacon, lettuce, tomato, and mayo on toasted bread",
    price: 13.99,
    category: "Lunch",
    image: "🥪",
    available: true
  },
  {
    id: 18,
    name: "Caesar Salad",
    description: "Romaine lettuce tossed with Caesar dressing, croutons, and Parmesan cheese, often topped with grilled chicken or shrimp",
    price: 10.99,
    category: "Lunch",
    image: "🥗",
    available: true
  },
  {
    id: 19,
    name: "BBQ Ribs",
    description: "Slow-cooked pork or beef ribs slathered in barbecue sauce, served with coleslaw and cornbread",
    price: 18.99,
    category: "Lunch",
    image: "🍖",
    available: true
  },
  {
    id: 20,
    name: "Philly Cheesesteak",
    description: "Sliced steak, often with grilled onions and peppers, topped with melted cheese on a hoagie roll",
    price: 14.99,
    category: "Lunch",
    image: "🥪",
    available: true
  },
  {
    id: 21,
    name: "New England Clam Chowder",
    description: "Cream-based soup with clams, potatoes, onions, and celery, seasoned with herbs and spices",
    price: 8.99,
    category: "Lunch",
    image: "🥣",
    available: true
  },
  {
    id: 22,
    name: "Cobb Salad",
    description: "Mixed greens topped with grilled chicken, bacon, avocado, hard-boiled eggs, tomatoes, blue cheese, and vinaigrette dressing",
    price: 13.99,
    category: "Lunch",
    image: "🥗",
    available: true
  },
  {
    id: 23,
    name: "Pulled Pork Sandwich",
    description: "Slow-cooked pork shoulder shredded and mixed with barbecue sauce, served on a bun with pickles and coleslaw",
    price: 12.99,
    category: "Lunch",
    image: "🥪",
    available: true
  },
  {
    id: 24,
    name: "Fish Tacos",
    description: "Soft corn tortillas filled with grilled or fried fish, cabbage slaw, avocado, salsa, and lime",
    price: 11.99,
    category: "Lunch",
    image: "🌮",
    available: true
  },

  // Dinner Items
  {
    id: 25,
    name: "Shrimp Scampi",
    description: "Shrimp sautéed in garlic butter and white wine sauce, served over linguine pasta with a sprinkle of Parmesan cheese and parsley",
    price: 22.99,
    category: "Dinner",
    image: "🍝",
    available: true
  },
  {
    id: 26,
    name: "BBQ Brisket",
    description: "Slow-smoked beef brisket served with coleslaw, baked beans, cornbread, and pickles",
    price: 24.99,
    category: "Dinner",
    image: "🥩",
    available: true
  },
  {
    id: 27,
    name: "Vegetarian Lasagna",
    description: "Layers of pasta filled with ricotta cheese, spinach, mushrooms, and marinara sauce, topped with mozzarella cheese and baked until golden",
    price: 16.99,
    category: "Dinner",
    image: "🍝",
    available: true
  },
  {
    id: 28,
    name: "Stuffed Bell Peppers",
    description: "Bell peppers stuffed with a mixture of ground beef or turkey, rice, tomatoes, and cheese, baked until tender",
    price: 18.99,
    category: "Dinner",
    image: "🫑",
    available: true
  },
  {
    id: 29,
    name: "Lobster Tail Dinner",
    description: "Broiled or grilled lobster tail served with drawn butter, roasted potatoes or rice, steamed vegetables, and a wedge of lemon",
    price: 34.99,
    category: "Dinner",
    image: "🦞",
    available: true
  },
  {
    id: 30,
    name: "Taco Night",
    description: "Build-your-own taco dinner with seasoned ground beef or chicken, soft or crispy taco shells, lettuce, tomatoes, cheese, salsa, sour cream, and guacamole",
    price: 15.99,
    category: "Dinner",
    image: "🌮",
    available: true
  },
  {
    id: 31,
    name: "Buffalo Wings",
    description: "Deep-fried chicken wings coated in spicy buffalo sauce, served with celery sticks and blue cheese dressing",
    price: 14.99,
    category: "Dinner",
    image: "🍗",
    available: true
  },
  {
    id: 32,
    name: "Steakhouse Dinner",
    description: "A classic American favorite featuring a grilled steak (such as ribeye, filet mignon, or New York strip) served with sides like mashed potatoes, steamed vegetables, and a salad",
    price: 28.99,
    category: "Dinner",
    image: "🥩",
    available: true
  },
  {
    id: 33,
    name: "Grilled Salmon",
    description: "Fresh salmon fillet grilled and served with rice pilaf or roasted potatoes, steamed asparagus, and a lemon wedge",
    price: 26.99,
    category: "Dinner",
    image: "🐟",
    available: true
  },
  {
    id: 34,
    name: "Roast Chicken",
    description: "Herb-roasted or rotisserie chicken served with mashed potatoes, gravy, roasted vegetables, and a side of cranberry sauce",
    price: 20.99,
    category: "Dinner",
    image: "🍗",
    available: true
  },
  {
    id: 35,
    name: "Spaghetti and Meatballs",
    description: "Spaghetti pasta topped with marinara sauce and meatballs, served with garlic bread and a side salad",
    price: 16.99,
    category: "Dinner",
    image: "🍝",
    available: true
  }
];

// Store orders in localStorage to persist them across sessions
let mockOrders = JSON.parse(localStorage.getItem('sundevilOrders')) || [
  {
    id: 1,
    items: [
      { name: "Pancakes", quantity: 2, price: 9.99 },
      { name: "Coffee", quantity: 1, price: 3.50 }
    ],
    total: 23.48,
    status: "pending",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    customerName: "John Doe"
  },
  {
    id: 2,
    items: [
      { name: "Steakhouse Dinner", quantity: 1, price: 28.99 },
      { name: "Caesar Salad", quantity: 1, price: 10.99 },
      { name: "Craft Beer", quantity: 1, price: 6.50 }
    ],
    total: 46.48,
    status: "preparing",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    customerName: "Jane Smith"
  }
];

// Save orders to localStorage whenever they change
const saveOrders = () => {
  localStorage.setItem('sundevilOrders', JSON.stringify(mockOrders));
};

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to make API calls with fallback to mock data
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn(`API call failed for ${endpoint}, using mock data:`, error.message);
    return null;
  }
};

// API functions with real backend fallback to mock data
export const api = {
  // Menu API
  async getMenuCategories() {
    const result = await apiCall('/api/menu/categories');
    if (result) return result;
    
    await delay(300);
    return mockMenuCategories;
  },

  async getMenuItems() {
    const result = await apiCall('/api/menu/items');
    if (result) return result;
    
    await delay(300);
    return mockMenuItems;
  },

  async getMenuItemsByCategory(category) {
    const result = await apiCall(`/api/menu/items?category=${encodeURIComponent(category)}`);
    if (result) return result;
    
    await delay(300);
    return mockMenuItems.filter(item => item.category === category);
  },

  // Orders API
  async createOrder(orderData) {
    const result = await apiCall('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
    if (result) return result;
    
    await delay(500);
    const newOrder = {
      id: Math.max(...mockOrders.map(o => o.id), 0) + 1,
      items: orderData.items,
      total: orderData.total,
      status: "pending",
      timestamp: new Date().toISOString(),
      customerName: orderData.customerName || "Anonymous"
    };
    mockOrders.push(newOrder);
    saveOrders();
    return newOrder;
  },

  async getOrders() {
    const result = await apiCall('/api/orders');
    if (result) return result;
    
    await delay(300);
    return mockOrders;
  },

  async getOrdersByCustomer(customerName) {
    const result = await apiCall(`/api/orders?customer=${encodeURIComponent(customerName)}`);
    if (result) return result;
    
    await delay(300);
    return mockOrders.filter(order => 
      order.customerName.toLowerCase() === customerName.toLowerCase()
    );
  },

  async updateOrderStatus(orderId, status) {
    const result = await apiCall(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    if (result) return result;
    
    await delay(300);
    const order = mockOrders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      saveOrders();
    }
    return order;
  },

  // Admin API
  async getDashboardStats() {
    const result = await apiCall('/api/admin/dashboard');
    if (result) return result;
    
    await delay(300);
    const totalOrders = mockOrders.length;
    const pendingOrders = mockOrders.filter(o => o.status === "pending").length;
    const preparingOrders = mockOrders.filter(o => o.status === "preparing").length;
    const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
    
    return {
      totalOrders,
      pendingOrders,
      preparingOrders,
      totalRevenue: totalRevenue.toFixed(2)
    };
  }
}; 