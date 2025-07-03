🍽️ Sundevil Cafeteria Online Ordering System
Welcome to the Sundevil Cafeteria Online Ordering System — a modern, full-stack web application built to streamline online ordering for Arizona State University’s campus cafeteria. This system provides a seamless experience for customers placing orders, real-time management tools for kitchen staff, and insightful analytics for cafeteria administrators.

This project was designed and developed individually by Abdullah Alqallaf as part of the CSE 460 - Software Architecture course at Arizona State University.

Test the live webapp: https://sundevil-cafeteria-frontend.netlify.app


🧱 Architecture Overview
This system is built using a Layered MVC Architecture, which allows for clean separation between the frontend, backend, and database layers.

Frontend: React.js Single Page Application (SPA)

Backend: Node.js with Express.js

Database: SQLite (for development), PostgreSQL (for production)

State Management: React Context API

Styling: CSS3 with responsive design principles


✨ Key Features
👤 Customer Experience
Browse the Menu: Search and filter available items

Shopping Cart: Add items, manage quantities

Order Placement: Submit orders with real-time feedback

Live Tracking: Get real-time updates on order status

Mobile-Friendly: Fully responsive design

👨‍🍳 Kitchen Dashboard
Order Queue: View all active orders in real-time

Status Control: Mark orders as preparing, ready, or completed

Instant Notifications: Be alerted when new orders are placed

👔 Manager & Admin Tools
Analytics Dashboard: View performance metrics and sales reports

User Management: Control user roles and permissions

System Config: Manage platform settings securely

⚡ Quick Start
Prerequisites
Node.js (v14+)

npm (v6+)

One-Command Setup

git clone <repository-url>
cd sundevil-cafeteria
./start.sh
This will install dependencies, launch the backend on port 5001, and start the frontend on port 3000.




🔐 User Roles
Role	Username	Password	Access
Customer	customer	CustomerPass123	Browse, place, and track orders
Kitchen Staff	worker	Kitchen456	Manage orders, update statuses
Manager	manager	Admin789	View analytics, manage users
Admin	admin	Admin789	Full access to all system features

📁 Project Structure
bash
Copy
Edit
sundevil-cafeteria/
├── frontend/        # React SPA
├── backend/         # Node.js + Express API
├── database/        # SQLite DB for dev
├── docs/            # Architecture Diagrams
├── start.sh         # One-click startup script
└── README.md        # You're reading it!
📡 API Overview
GET /api/menu — Fetch all menu items

POST /api/orders — Place a new order

PUT /api/orders/:id/status — Update order status

POST /api/auth/login — Log in as a user

🧱 Database Schema
MenuItems: ID, name, description, price, category, availability

Orders: ID, customer, total, status, timestamps

OrderItems: Item ID, order ID, quantity, price

Users: ID, username, password (encrypted), role, created_at




🛠️ Technology Stack
Layer	Technologies Used
Frontend	React.js, Context API, CSS3
Backend	Node.js, Express.js, JWT
Database	SQLite / PostgreSQL
Tools	npm, ESLint, Git

🧑‍💻 Author
Abdullah Alqallaf
Computer Engineering Student, Arizona State University
📧 aalqallaf@asu.edu
📍 Tempe, AZ

📄 License
This project was created for academic purposes as part of the CSE 460 course at ASU. Not intended for commercial deployment.

