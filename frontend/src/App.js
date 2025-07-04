import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Menu from './pages/Menu';
import Order from './pages/Order';
import OrderTracking from './pages/OrderTracking';
import Kitchen from './pages/Kitchen';
import Admin from './pages/Admin';
import Login from './pages/Login';
import './App.css';
import { CartProvider } from './CartContext';
import Toast from './components/Toast';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock authentication - in real app this would come from backend
  const login = (username, password) => {
    // Define valid credentials
    const validCredentials = {
      'manager': 'Admin789',
      'worker': 'Kitchen456',
      'customer': 'CustomerPass123',
      'admin': 'Admin789' // Admin uses same password as manager
    };

    // Check if username exists and password matches
    if (validCredentials[username] && validCredentials[username] === password) {
      // Mock user roles based on username
      let role = 'customer';
      if (username === 'manager' || username === 'admin') role = 'manager';
      if (username === 'worker') role = 'worker';
      
      const mockUser = {
        id: 1,
        username: username,
        role: role,
        name: username.charAt(0).toUpperCase() + username.slice(1)
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  // Protected route component
  const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      return <Navigate to="/menu" />;
    }
    
    return children;
  };

  return (
    <>
      <Toast />
      <CartProvider>
        <Router>
          <div className="App">
            {isAuthenticated && <Navigation user={user} onLogout={logout} />}
            
            <main className="main-content">
              <Routes>
                <Route path="/login" element={
                  !isAuthenticated ? (
                    <Login onLogin={login} />
                  ) : (
                    <Navigate to="/menu" />
                  )
                } />
                
                <Route path="/menu" element={
                  <ProtectedRoute>
                    <Menu />
                  </ProtectedRoute>
                } />
                
                <Route path="/order" element={
                  <ProtectedRoute>
                    <Order />
                  </ProtectedRoute>
                } />
                
                <Route path="/tracking" element={
                  <ProtectedRoute>
                    <OrderTracking />
                  </ProtectedRoute>
                } />
                
                <Route path="/kitchen" element={
                  <ProtectedRoute allowedRoles={['worker', 'manager']}>
                    <Kitchen />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <Admin />
                  </ProtectedRoute>
                } />
                
                <Route path="/" element={<Navigate to="/menu" />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </>
  );
}

export default App; 