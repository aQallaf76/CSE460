const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Import routes (Controllers)
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Use environment variable for port or default to 5001
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://sundevil-cafeteria-frontend.netlify.app',
      'https://sundevil-cafeteria.netlify.app',
      'http://localhost:3000'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle preflight requests
app.options('*', cors());

// Initialize database
const db = require('./models/database');
db.initializeDatabase();

// Routes (Controllers)
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint - API information
app.get('/', (req, res) => {
  res.json({
    message: 'Sundevil Cafeteria API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      menu: '/api/menu',
      orders: '/api/orders',
      admin: '/api/admin',
      debug: '/api/debug/menu-count'
    },
    documentation: 'This is a REST API for the Sundevil Cafeteria ordering system',
    frontend: 'https://sundevil-cafeteria-frontend.netlify.app'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Sundevil Cafeteria API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint to check database
app.get('/api/debug/menu-count', async (req, res) => {
  try {
    const db = require('./models/database');
    const result = await db.query('SELECT COUNT(*) as count FROM menu_items');
    res.json({ 
      menuItemCount: result[0].count,
      message: `Database has ${result[0].count} menu items`
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Sundevil Cafeteria Server running on port ${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; 