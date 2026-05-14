import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Store from './Store';
import ThemePreview from './components/ThemePreview';
import Checkout from './components/Checkout';

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
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/store" 
          element={
            <Store 
              cart={cart} 
              addToCart={addToCart} 
              removeFromCart={removeFromCart} 
            />
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <Checkout 
              cart={cart} 
              removeFromCart={removeFromCart} 
              clearCart={clearCart}
            />
          } 
        />
        <Route path="/theme-preview" element={<ThemePreview />} />
      </Routes>
    </Router>
  );
}

export default App;
