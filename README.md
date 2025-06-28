# Sundevil Cafeteria Online Ordering System

A modern, full-stack web application for the Sundevil Cafeteria at Arizona State University. This system provides an intuitive online ordering experience for customers, efficient order management for kitchen staff, and comprehensive analytics for management.

## 🏗️ Architecture

This project implements a **Layered MVC Architecture** with:
- **Frontend**: React.js Single Page Application (SPA)
- **Backend**: Node.js with Express.js
- **Database**: SQLite (development) / PostgreSQL (production)
- **State Management**: React Context API
- **Styling**: CSS3 with responsive design

## ✨ Features

### Customer Features
- 🍽️ **Menu Browsing**: Browse menu items with search and filtering
- 🛒 **Shopping Cart**: Add items to cart with quantity management
- 📋 **Order Placement**: Place orders with real-time validation
- 📱 **Order Tracking**: Real-time order status updates
- 📱 **Responsive Design**: Works seamlessly on mobile and desktop

### Kitchen Staff Features
- 👨‍🍳 **Order Management**: View and manage incoming orders
- 🏷️ **Status Updates**: Update order status (preparing, ready, completed)
- 📊 **Order Queue**: Real-time order queue management
- 🔔 **Notifications**: Instant notifications for new orders

### Management Features
- 📈 **Analytics Dashboard**: Sales and order analytics
- 👥 **User Management**: Manage user accounts and roles
- 📊 **Performance Metrics**: Monitor system performance
- 🔧 **System Administration**: Configure system settings

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sundevil-cafeteria
   ```

2. **Start the application**
   ```bash
   ./start.sh
   ```
   
   This script will:
   - Install all dependencies for both frontend and backend
   - Start the backend server on port 5001
   - Start the frontend server on port 3000

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

### Manual Setup (Alternative)

If you prefer to run the services separately:

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 👥 User Roles & Access

### Customer (Default)
- Username: `customer`
- Password: `CustomerPass123`
- Access: Menu browsing, order placement, order tracking

### Kitchen Worker
- Username: `worker`
- Password: `Kitchen456`
- Access: Order management, status updates

### Manager
- Username: `manager`
- Password: `Admin789`
- Access: Analytics, user management, system administration

### Admin
- Username: `admin`
- Password: `Admin789`
- Access: Full system access

## 🏗️ Project Structure

```
sundevil-cafeteria/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── services/       # API service layer
│   │   ├── styles/         # CSS styling files
│   │   └── App.js          # Main application component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js backend application
│   ├── controllers/        # Request handlers
│   ├── models/            # Data models
│   ├── routes/            # API route definitions
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── database/               # Database files
│   └── cafeteria.db       # SQLite database
├── docs/                   # Architecture documentation
│   ├── c4-context-diagram.md
│   ├── c4-component-diagram.md
│   └── c4-deployment-diagram.md
├── ARCHITECTURE_SUBMISSION.md  # Architecture explanation
├── README.md              # This file
└── start.sh               # Startup script
```

## 🔧 API Endpoints

### Menu Management
- `GET /api/menu` - Get all menu items
- `GET /api/menu/categories` - Get menu categories

### Order Management
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/:id` - Get specific order

### User Management
- `POST /api/auth/login` - User authentication
- `GET /api/users` - Get all users (admin only)

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with ASU branding
- **Responsive Layout**: Optimized for mobile, tablet, and desktop
- **Real-time Updates**: Live order tracking and status updates
- **Intuitive Navigation**: Easy-to-use interface for all user roles
- **Visual Feedback**: Loading states, success notifications, and error handling
- **Accessibility**: WCAG compliant design principles

## 🛠️ Technology Stack

### Frontend
- **React.js**: Modern UI framework
- **React Router**: Client-side routing
- **React Context**: State management
- **CSS3**: Styling with responsive design
- **HTML5**: Semantic markup

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **SQLite**: Database (development)
- **JWT**: Authentication
- **CORS**: Cross-origin resource sharing

### Development Tools
- **npm**: Package management
- **ESLint**: Code linting
- **Git**: Version control

## 📊 Database Schema

### Menu Items
- Item ID, Name, Description, Price, Category, Availability

### Orders
- Order ID, Customer, Total, Status, Timestamp, Updated At

### Order Items
- Order Item ID, Order ID, Menu Item ID, Quantity, Price

### Users
- User ID, Username, Role, Password, Created At

## 🔒 Security Features

- **JWT Authentication**: Secure user sessions
- **Role-based Access Control**: Different permissions for different user types
- **Input Validation**: Server-side data validation
- **CORS Protection**: Secure cross-origin requests
- **Password Encryption**: Secure password storage

## 🚀 Deployment

### Development
- Frontend: React development server (port 3000)
- Backend: Node.js development server (port 5001)
- Database: SQLite file-based database

### Production
- Frontend: Static file hosting (CDN recommended)
- Backend: Node.js application servers with load balancing
- Database: PostgreSQL with replication
- Monitoring: ELK stack for logging, Prometheus for metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is developed for educational purposes as part of CSE 460 - Software Architecture at Arizona State University.

## 👨‍💻 Development Team

- **Course**: CSE 460 - Software Architecture
- **Institution**: Arizona State University
- **Project**: Phase III - Part 1: Software Architecture Identification and Initial Implementation

---

**Note**: This is a demonstration project for educational purposes. For production use, additional security measures, error handling, and testing would be required. 