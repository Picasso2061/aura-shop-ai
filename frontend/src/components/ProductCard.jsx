import React, { useState, useEffect } from 'react';

const ProductCard = ({ product }) => {
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
      <div className="price">{product.price}</div>
    </div>
  );
};

export default ProductCard;
