import React, { useState, useEffect } from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const [hoverStart, setHoverStart] = useState(null);

  const handleMouseEnter = () => {
    setHoverStart(Date.now());
  };

  const handleMouseLeave = () => {
    if (hoverStart) {
      const duration = Date.now() - hoverStart;
      // You could trigger a tracking event here specifically for duration if needed
      setHoverStart(null);
    }
  };

  return (
    <div 
      className="product-card glass-card" 
      data-track-id={`product-${product.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="price-tag">
        <div className="price">{product.price}</div>
        <button 
          className="buy-btn" 
          data-track-id={`add-to-cart-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          style={{ background: 'var(--primary)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '50px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
