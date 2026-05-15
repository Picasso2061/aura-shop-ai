import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Store from './Store';
import ThemePreview from './components/ThemePreview';
import Checkout from './components/Checkout';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
        <Route 
          path="/store" 
          element={
            <ProtectedRoute>
              <Store 
                cart={cart} 
                addToCart={addToCart} 
                removeFromCart={removeFromCart} 
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Checkout 
                cart={cart} 
                removeFromCart={removeFromCart} 
                clearCart={clearCart}
              />
            </ProtectedRoute>
          } 
        />
        <Route path="/theme-preview" element={<ThemePreview />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
