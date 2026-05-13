import React, { useState } from 'react';
import { useBehavioralTracking } from './hooks/useBehavioralTracking';
import ProductCard from './components/ProductCard';
import MindAIAssistant from './components/MindAIAssistant';

const PRODUCTS = [
  { id: 1, name: 'Neural Watch X', description: 'Real-time biological data streaming.', price: '$299', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
  { id: 2, name: 'Aura Lens Pro', description: 'Augmented reality redefined.', price: '$899', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400' },
  { id: 3, name: 'Sonic Bloom Buds', description: 'Spatial audio with active noise isolation.', price: '$199', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
  { id: 4, name: 'Glass Pad 14', description: 'The thinnest laptop ever built.', price: '$1299', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
  { id: 5, name: 'Eco Hub Prime', description: 'Smart home management with AI.', price: '$149', image: 'https://images.unsplash.com/photo-1558002038-1037906d9984?w=400' },
  { id: 6, name: 'Stealth Controller', description: 'Ultra-low latency gaming gear.', price: '$79', image: 'https://images.unsplash.com/photo-1592840331052-16e15c2c6f95?w=400' },
];

function Store() {
  const { intent, SESSION_ID } = useBehavioralTracking();
  const [suggestions, setSuggestions] = useState([]);

  const recommendedProducts = PRODUCTS.filter(p => suggestions.includes(p.id));

  return (
    <div className="app">
      <header style={{ padding: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', margin: 0 }}>AURASHOP</h1>
        <p style={{ opacity: 0.6 }}>Predictive AI E-commerce Experience</p>
      </header>

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
              <ProductCard key={`rec-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      )}

      <section style={{ padding: '0 40px' }}>
        <h2 style={{ opacity: 0.5, fontSize: '1.2rem', marginBottom: '20px' }}>Explore Catalog</h2>
        <div className="product-grid" style={{ padding: 0 }}>
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
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
    </div>
  );
}

export default Store;
