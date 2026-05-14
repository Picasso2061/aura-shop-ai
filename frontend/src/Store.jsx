import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBehavioralTracking } from './hooks/useBehavioralTracking';
import ProductCard from './components/ProductCard';
import MindAIAssistant from './components/MindAIAssistant';

const PRODUCTS = [
  { id: 1, name: 'Neural Watch X', description: 'Real-time biological data streaming with predictive health alerts.', price: '$299', image: '/images/watch.png' },
  { id: 2, name: 'Aura Lens Pro', description: 'Augmented reality glasses with neural interface integration.', price: '$899', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600' },
  { id: 3, name: 'Sonic Bloom Buds', description: 'Spatial audio with active biological noise isolation.', price: '$199', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' },
  { id: 4, name: 'Glass Pad 14', description: 'Molecularly bonded glass chassis with photonic computing.', price: '$1299', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600' },
  { id: 5, name: 'Eco Hub Prime', description: 'Smart home management powered by localized LLM cores.', price: '$149', image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=600' },
  { id: 6, name: 'Stealth Controller', description: 'Haptic feedback system with sub-millisecond neural latency.', price: '$79', image: 'https://images.unsplash.com/photo-1592840331052-16e15c2c6f95?w=600' },
  { id: 7, name: 'Void Drone Mini', description: 'Autonomous scouting drone with cloaking technology.', price: '$499', image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600' },
  { id: 8, name: 'Prism Key 60', description: 'Mechanical keyboard with liquid crystal keycaps.', price: '$249', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600' },
  { id: 9, name: 'Lumina Desk Lamp', description: 'Circadian-matched lighting with integrated air purifier.', price: '$129', image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=600' },
  { id: 10, name: 'Aura Suit G1', description: 'Molecularly thin kinetic absorption suit with thermal regulation.', price: '$2499', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600' },
  { id: 11, name: 'Orbit Lens Mini', description: 'Satellite-linked vision enhancer with real-time HUD.', price: '$649', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600' },
  { id: 12, name: 'Zenith Chair', description: 'Zero-gravity workstation with neural posture correction.', price: '$3200', image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=600' },
  { id: 13, name: 'Vortex Cooling Pad', description: 'Photonic heat dissipation for high-end computing arrays.', price: '$89', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600' },
  { id: 14, name: 'Pulse Sync Ring', description: 'Bio-rhythm synchronized wellness tracker in titanium.', price: '$179', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600' },
  { id: 15, name: 'Nova Projector', description: '8K holographic spatial projection system for neural cinema.', price: '$1599', image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=600' },
];

function Store({ cart, addToCart, removeFromCart }) {
  const navigate = useNavigate();
  const { intent, SESSION_ID } = useBehavioralTracking();
  const [suggestions, setSuggestions] = useState([]);
  const [lastAdded, setLastAdded] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product) => {
    addToCart(product);
    setLastAdded(product.name);
    setTimeout(() => setLastAdded(null), 3000);
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = parseInt(item.price.replace('$', ''));
    return sum + price;
  }, 0);

  const recommendedProducts = PRODUCTS.filter(p => suggestions.includes(p.id));

  return (
    <div className="app">
      <header style={{ padding: '40px', textAlign: 'center', position: 'relative' }}>
        <h1 style={{ fontSize: '3rem', margin: 0 }}>AURASHOP</h1>
        <p style={{ opacity: 0.6 }}>Predictive AI E-commerce Experience</p>
        
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
          {PRODUCTS.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={() => handleAddToCart(product)}
              onViewDetails={() => setSelectedProduct(product)}
            />
          ))}
        </div>
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
