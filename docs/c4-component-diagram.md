# C4 Model - Component Diagram
## Sundevil Cafeteria Online Ordering System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                           FRONTEND (React.js)                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS API Calls
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                           BACKEND (Node.js)                                │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │                 │  │                 │  │                 │             │
│  │   ROUTES        │  │  CONTROLLERS    │  │    MODELS       │             │
│  │                 │  │                 │  │                 │             │
│  │ • menuRoutes    │  │ • menuController│  │ • Database      │             │
│  │ • orderRoutes   │  │ • orderController│ │ • menuItems     │             │
│  │ • adminRoutes   │  │ • adminController│ │ • orders        │             │
│  │                 │  │                 │  │ • orderItems    │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│           │                     │                     │                     │
│           └─────────────────────┼─────────────────────┘                     │
│                                 │                                           │
│                                 ▼                                           │
│                    ┌─────────────────────────────────┐                     │
│                    │                                 │                     │
│                    │      MIDDLEWARE                 │                     │
│                    │                                 │                     │
│                    │ • CORS                          │                     │
│                    │ • Body Parser                   │                     │
│                    │ • Error Handling                │                     │
│                    │                                 │                     │
│                    └─────────────────────────────────┘                     │
│                                 │                                           │
│                                 ▼                                           │
│                    ┌─────────────────────────────────┐                     │
│                    │                                 │                     │
│                    │      EXPRESS SERVER             │                     │
│                    │                                 │                     │
│                    │ • HTTP Server                   │                     │
│                    │ • Request Routing               │                     │
│                    │ • Response Handling             │                     │
│                    │                                 │                     │
│                    └─────────────────────────────────┘                     │
│                                 │                                           │
│                                 │ SQL Queries                              │
│                                 ▼                                           │
│                    ┌─────────────────────────────────┐                     │
│                    │                                 │                     │
│                    │         DATABASE                │                     │
│                    │                                 │                     │
│                    │ • SQLite Database               │                     │
│                    │ • menu_items table              │                     │
│                    │ • orders table                  │                     │
│                    │ • order_items table             │                     │
│                    │                                 │                     │
│                    └─────────────────────────────────┘                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend Components (React.js):

**1. App Component**
- Main application container
- Navigation and routing
- Global state management

**2. Menu Component**
- Display menu items by category
- Filter and search functionality
- Responsive grid layout

**3. Order Component**
- Shopping cart functionality
- Order placement form
- Real-time total calculation

**4. Kitchen Component**
- Pending orders display
- Status update interface
- Real-time order refresh

**5. Admin Component**
- Dashboard with analytics
- Menu management interface
- Business metrics display

**6. API Service**
- HTTP client configuration
- API endpoint abstractions
- Error handling

### Backend Components (Node.js):

**1. Routes Layer**
- **menuRoutes**: Menu item CRUD operations
- **orderRoutes**: Order management operations
- **adminRoutes**: Administrative functions

**2. Controllers Layer**
- **menuController**: Menu business logic
- **orderController**: Order processing logic
- **adminController**: Analytics and management logic

**3. Models Layer**
- **Database**: SQLite connection and queries
- **menuItems**: Menu item data operations
- **orders**: Order data operations
- **orderItems**: Order item relationships

**4. Middleware**
- **CORS**: Cross-origin resource sharing
- **Body Parser**: Request body parsing
- **Error Handling**: Global error management

**5. Express Server**
- HTTP server configuration
- Request/response handling
- Static file serving

### Database Schema:

**menu_items Table:**
- id (Primary Key)
- name
- description
- price
- category
- available
- created_at

**orders Table:**
- id (Primary Key)
- customer_name
- total_amount
- status
- created_at
- updated_at

**order_items Table:**
- id (Primary Key)
- order_id (Foreign Key)
- menu_item_id (Foreign Key)
- quantity
- price

### Component Interactions:

1. **Frontend → Backend**: HTTP API calls for all operations
2. **Routes → Controllers**: Request delegation to appropriate controllers
3. **Controllers → Models**: Data access through database models
4. **Models → Database**: SQL queries for data persistence
5. **Middleware**: Request/response processing at each layer

### Key Design Patterns:

1. **MVC Pattern**: Clear separation of concerns
2. **Repository Pattern**: Data access abstraction
3. **Service Layer**: Business logic encapsulation
4. **RESTful API**: Standard HTTP operations
5. **Component-Based UI**: Reusable React components 