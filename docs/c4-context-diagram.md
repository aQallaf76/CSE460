# C4 Model - Context Diagram
## Sundevil Cafeteria Online Ordering System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                           SUNDEVIL CAFETERIA                               │
│                        Online Ordering System                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
        ┌─────────────────┐ ┌─────────────┐ ┌─────────────┐
        │                 │ │             │ │             │
        │   CUSTOMERS     │ │   KITCHEN   │ │   MANAGERS  │
        │                 │ │    STAFF    │ │             │
        │ • Browse menu   │ │ • View      │ │ • Manage    │
        │ • Place orders  │ │   orders    │ │   menu      │
        │ • Track status  │ │ • Update    │ │ • View      │
        │                 │ │   status    │ │   analytics │
        └─────────────────┘ └─────────────┘ └─────────────┘
                    │               │               │
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────────┐
                    │                                 │
                    │    WEB BROWSER / MOBILE APP     │
                    │                                 │
                    │ • React.js Frontend            │
                    │ • Responsive Design            │
                    │ • Real-time Updates            │
                    │                                 │
                    └─────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS
                                    ▼
                    ┌─────────────────────────────────┐
                    │                                 │
                    │      BACKEND API SERVER         │
                    │                                 │
                    │ • Node.js + Express.js         │
                    │ • RESTful API                  │
                    │ • Business Logic               │
                    │ • Authentication               │
                    │                                 │
                    └─────────────────────────────────┘
                                    │
                                    │ SQL
                                    ▼
                    ┌─────────────────────────────────┐
                    │                                 │
                    │         DATABASE                │
                    │                                 │
                    │ • SQLite (Development)         │
                    │ • Menu Items                   │
                    │ • Orders                       │
                    │ • Order Items                  │
                    │                                 │
                    └─────────────────────────────────┘
```

## System Context Description

### Primary Actors:
1. **Customers**: Students, faculty, and staff who order food
2. **Kitchen Staff**: Employees who prepare and manage orders
3. **Managers**: Administrative staff who manage the system

### External Systems:
1. **Web Browser/Mobile App**: User interface for all interactions
2. **Backend API Server**: Core business logic and data processing
3. **Database**: Persistent storage for all system data

### Key Interactions:
- Customers browse menu, place orders, and track order status
- Kitchen staff view pending orders and update preparation status
- Managers manage menu items and view business analytics
- All interactions go through the web interface to the backend API
- Backend API manages all data operations with the database

### System Boundaries:
- The system is self-contained with no external integrations
- All data is stored locally in SQLite database
- Future enhancements could include payment systems and external integrations 