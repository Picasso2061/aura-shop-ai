import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useBehavioralTracking } from './hooks/useBehavioralTracking';
import ProductCard from './components/ProductCard';
import MindAIAssistant from './components/MindAIAssistant';



function Store({ cart, addToCart, removeFromCart }) {
  const navigate = useNavigate();
  const { intent, SESSION_ID, suggestions: trackedSuggestions } = useBehavioralTracking();
  const [suggestions, setSuggestions] = useState([]);
  const [lastAdded, setLastAdded] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`/_/backend/products?limit=50&offset=${page * 50}`);
        if (response.data.length < 50) setHasMore(false);
        setProducts(prev => {
          const newProducts = response.data.filter(p => !prev.some(existing => existing.id === p.id));
          return [...prev, ...newProducts];
        });
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, [page]);

  React.useEffect(() => {
    if (trackedSuggestions && trackedSuggestions.length > 0) {
      setSuggestions(trackedSuggestions);
    }
  }, [trackedSuggestions]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setLastAdded(product.name);
    setTimeout(() => setLastAdded(null), 3000);
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = parseInt(item.price.replace('$', ''));
    return sum + price;
  }, 0);

  const recommendedProducts = products.filter(p => Array.isArray(suggestions) && suggestions.some(id => Number(id) === p.id));

  return (
    <div className="app">
      <header style={{ padding: '40px', textAlign: 'center', position: 'relative' }}>
        <h1 style={{ fontSize: '3rem', margin: 0 }}>AURASHOP</h1>
        <p style={{ opacity: 0.6 }}>Predictive AI E-commerce Experience</p>
        
        <div style={{ position: 'absolute', left: '40px', top: '40px', display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => {
              localStorage.removeItem('user');
              navigate('/login');
            }}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            Sign Out
          </button>
        </div>

        <div 
          className="cart-status glass-card" 
          onClick={() => setIsCartOpen(true)}
          style={{ position: 'absolute', right: '40px', top: '40px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '1.2rem' }}>🛒</span>
          <span style={{ fontWeight: 'bold' }}>{cart.length}</span>
        </div>
      </header>

      {lastAdded && (
        <div className="cart-notification glass-card">
          Added <strong>{lastAdded}</strong> to cart!
        </div>
      )}

      <div className="intent-badge">
        Intent: {intent}
      </div>

      {recommendedProducts.length > 0 && (
        <section className="suggestions-section glass-card">
          <div className="suggestions-header">
            <span className="ai-badge">AI Optimized</span>
            <h2>Tailored for your {intent.toLowerCase().replace('_', ' ')}</h2>
          </div>
          <div className="product-grid suggestions">
            {recommendedProducts.map(product => (
              <ProductCard 
                key={`rec-${product.id}`} 
                product={product} 
                onAddToCart={() => handleAddToCart(product)}
                onViewDetails={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        </section>
      )}

      <section style={{ padding: '0 40px' }}>
        <h2 style={{ opacity: 0.5, fontSize: '1.2rem', marginBottom: '20px' }}>Explore Catalog</h2>
        <div className="product-grid" style={{ padding: 0 }}>
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={() => handleAddToCart(product)}
              onViewDetails={() => setSelectedProduct(product)}
            />
          ))}
        </div>
        {hasMore && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button 
              className="buy-btn"
              onClick={() => setPage(prev => prev + 1)}
              style={{ background: 'rgba(255,255,255,0.1)', padding: '15px 30px', fontSize: '1.1rem', cursor: 'pointer', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
            >
              Load More Products
            </button>
          </div>
        )}
      </section>

      <MindAIAssistant 
        sessionId={SESSION_ID} 
        currentIntent={intent} 
        onSuggestions={(ids) => setSuggestions(ids)}
      />
      
      <footer style={{ padding: '40px', textAlign: 'center', opacity: 0.4 }}>
        &copy; 2026 AuraShop AI. Built by Picasso.
      </footer>

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal glass-card" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedProduct(null)}>&times;</button>
            <div className="modal-content">
              <div className="modal-image">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              <div className="modal-info">
                <span className="ai-badge">Deep Neural Insight</span>
                <h2>{selectedProduct.name}</h2>
                <p className="modal-price">{selectedProduct.price}</p>
                <div className="specs">
                  <p>{selectedProduct.description}</p>
                  <ul>
                    <li>✨ Photonic Computing Core</li>
                    <li>🛡️ Neural Privacy Shield</li>
                    <li>⚡ Sub-millisecond Latency</li>
                  </ul>
                </div>
                <button 
                  className="buy-btn large" 
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  style={{ width: '100%', padding: '18px', fontSize: '1.1rem', marginTop: '20px' }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-sidebar glass-card" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Your Cart</h2>
              <button className="close-btn-small" onClick={() => setIsCartOpen(false)}>&times;</button>
            </div>
            
            <div className="cart-items">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '100px', opacity: 0.5 }}>
                  <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🛒</div>
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="cart-item">
                    <img src={item.image} alt={item.name} />
                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p>{item.price}</p>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(index)}>Remove</button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="total">
                  <span>Total</span>
                  <span>${cartTotal}</span>
                </div>
                <button className="checkout-btn" onClick={() => navigate('/checkout')}>Proceed to Neural Checkout</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Store;
