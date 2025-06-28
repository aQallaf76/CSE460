# C4 Model - Deployment Diagram (Extra Credit)
## Sundevil Cafeteria Online Ordering System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                           DEVELOPMENT ENVIRONMENT                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────────┐
                    │                                 │
                    │      DEVELOPER MACHINE          │
                    │                                 │
                    │ ┌─────────────────────────────┐ │
                    │ │                             │ │
                    │ │    WEB BROWSER              │ │
                    │ │                             │ │
                    │ │ • Chrome/Firefox/Safari     │ │
                    │ │ • React Development Server  │ │
                    │ │ • Port 3000                 │ │
                    │ │                             │ │
                    │ └─────────────────────────────┘ │
                    │                                 │
                    │ ┌─────────────────────────────┐ │
                    │ │                             │ │
                    │ │    NODE.JS PROCESS          │ │
                    │ │                             │ │
                    │ │ • Express.js Server         │ │
                    │ │ • Port 5000                 │ │
                    │ │ • Nodemon (Auto-restart)    │ │
                    │ │                             │ │
                    │ └─────────────────────────────┘ │
                    │                                 │
                    │ ┌─────────────────────────────┐ │
                    │ │                             │ │
                    │ │    SQLITE DATABASE          │ │
                    │ │                             │ │
                    │ │ • Local file storage        │ │
                    │ │ • cafeteria.db              │ │
                    │ │ • No server required        │ │
                    │ │                             │ │
                    │ └─────────────────────────────┘ │
                    │                                 │
                    └─────────────────────────────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────────┐
                    │                                 │
                    │      PRODUCTION ENVIRONMENT     │
                    │                                 │
                    └─────────────────────────────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────────┐
                    │                                 │
                    │      WEB SERVER (AWS/Heroku)    │
                    │                                 │
                    │ ┌─────────────────────────────┐ │
                    │ │                             │ │
                    │ │    NGINX REVERSE PROXY      │ │
                    │ │                             │ │
                    │ │ • Port 80/443               │ │
                    │ │ • SSL Termination           │ │
                    │ │ • Static file serving       │ │
                    │ │                             │ │
                    │ └─────────────────────────────┘ │
                    │                                 │
                    │ ┌─────────────────────────────┐ │
                    │ │                             │ │
                    │ │    NODE.JS APPLICATION      │ │
                    │ │                             │ │
                    │ │ • PM2 Process Manager       │ │
                    │ │ • Port 5000                 │ │
                    │ │ • Environment Variables     │ │
                    │ │                             │ │
                    │ └─────────────────────────────┘ │
                    │                                 │
                    │ ┌─────────────────────────────┐ │
                    │ │                             │ │
                    │ │    POSTGRESQL DATABASE      │ │
                    │ │                             │ │
                    │ │ • Managed Database Service  │ │
                    │ │ • Connection Pooling        │ │
                    │ │ • Automated Backups         │ │
                    │ │                             │ │
                    │ └─────────────────────────────┘ │
                    │                                 │
                    └─────────────────────────────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────────┐
                    │                                 │
                    │      CLIENT DEVICES             │
                    │                                 │
                    │ ┌─────────────┐ ┌─────────────┐ │
                    │ │             │ │             │ │
                    │ │   DESKTOP   │ │   MOBILE    │ │
                    │ │             │ │             │ │
                    │ │ • Windows   │ │ • iOS       │ │
                    │ │ • macOS     │ │ • Android   │ │
                    │ │ • Linux     │ │ • Responsive│ │
                    │ │             │ │   Design    │ │
                    │ └─────────────┘ └─────────────┘ │
                    │                                 │
                    └─────────────────────────────────┘
```

## Deployment Architecture Details

### Development Environment:

**1. Developer Machine**
- **Web Browser**: Chrome, Firefox, Safari
- **React Development Server**: Port 3000 with hot reload
- **Node.js Process**: Express.js server on port 5000
- **SQLite Database**: Local file-based database

**2. Development Tools**
- **Nodemon**: Auto-restart server on code changes
- **React Scripts**: Development server and build tools
- **Git**: Version control and collaboration

### Production Environment:

**1. Web Server (AWS EC2 / Heroku)**
- **Nginx Reverse Proxy**: Load balancing and SSL termination
- **Node.js Application**: PM2 process manager for reliability
- **PostgreSQL Database**: Managed database service

**2. Infrastructure Components**
- **Load Balancer**: Distribute traffic across instances
- **SSL Certificate**: HTTPS encryption
- **CDN**: Static asset delivery
- **Monitoring**: Application performance monitoring

### Deployment Process:

**1. Development Workflow**
```
Code Changes → Git Commit → Push to Repository → 
Automated Tests → Build Process → Deploy to Staging → 
Manual Testing → Deploy to Production
```

**2. CI/CD Pipeline**
- **GitHub Actions**: Automated testing and deployment
- **Docker**: Containerized application deployment
- **Environment Variables**: Configuration management
- **Database Migrations**: Schema updates

### Security Considerations:

**1. Network Security**
- **HTTPS**: Encrypted communication
- **Firewall**: Port restrictions
- **VPN**: Secure access to production

**2. Application Security**
- **Input Validation**: Prevent injection attacks
- **Authentication**: User access control
- **Rate Limiting**: Prevent abuse
- **CORS**: Cross-origin resource sharing

### Scalability Features:

**1. Horizontal Scaling**
- Multiple application instances
- Load balancer distribution
- Database connection pooling

**2. Performance Optimization**
- **Caching**: Redis for session storage
- **CDN**: Static asset delivery
- **Database Indexing**: Query optimization
- **Compression**: Gzip response compression

### Monitoring and Logging:

**1. Application Monitoring**
- **Error Tracking**: Sentry for error reporting
- **Performance Metrics**: Response times and throughput
- **Health Checks**: Application availability

**2. Infrastructure Monitoring**
- **Server Metrics**: CPU, memory, disk usage
- **Database Performance**: Query execution times
- **Network Monitoring**: Bandwidth and latency

### Backup and Recovery:

**1. Data Backup**
- **Automated Backups**: Daily database backups
- **File Storage**: S3 for static assets
- **Version Control**: Code repository backup

**2. Disaster Recovery**
- **Multi-Region Deployment**: Geographic redundancy
- **Database Replication**: Real-time data sync
- **Rollback Procedures**: Quick recovery from issues 