import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = ({ cart, removeFromCart, clearCart }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const cartTotal = cart.reduce((sum, item) => {
    const price = parseInt(item.price.replace('$', ''));
    return sum + price;
  }, 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate neural transaction
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        clearCart();
        navigate('/store');
      }, 5000);
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="checkout-page success-view">
        <div className="glass-card success-card">
          <div className="success-icon">✨</div>
          <h1>Transaction Decrypted</h1>
          <p>Your neural interface has confirmed the purchase. Your items are being prepared for molecular transport.</p>
          <div className="order-id">ORD-77X-BETA</div>
          <Link to="/store" className="btn-primary" style={{ textDecoration: 'none', marginTop: '30px', display: 'inline-block' }}>Return to Store</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <nav className="checkout-nav">
        <Link to="/store" className="back-link">← Back to Store</Link>
        <div className="checkout-brand">AURA<span>AI</span> CHECKOUT</div>
      </nav>

      <div className="checkout-container">
        <div className="checkout-main">
          <form className="glass-card checkout-form" onSubmit={handleCheckout}>
            <section>
              <h3>1. Neural Identity</h3>
              <div className="form-group">
                <input type="text" placeholder="Full Name" required />
                <input type="email" placeholder="Neural ID (Email)" required />
              </div>
            </section>

            <section>
              <h3>2. Transport Coordinates</h3>
              <div className="form-group">
                <input type="text" placeholder="Street Address" required />
                <div className="form-row">
                  <input type="text" placeholder="City" required />
                  <input type="text" placeholder="Sector/Zip" required />
                </div>
              </div>
            </section>

            <section>
              <h3>3. Photonic Payment</h3>
              <div className="form-group">
                <div className="card-input-wrapper">
                  <input type="text" placeholder="0000 0000 0000 0000" required />
                  <div className="form-row">
                    <input type="text" placeholder="MM/YY" required />
                    <input type="text" placeholder="CVC" required />
                  </div>
                </div>
              </div>
            </section>

            <button type="submit" className="checkout-submit" disabled={isProcessing || cart.length === 0}>
              {isProcessing ? 'Decrypting Transaction...' : `Finalize Order ($${cartTotal})`}
            </button>
          </form>
        </div>

        <aside className="checkout-sidebar">
          <div className="glass-card order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="summary-item">
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">{item.price}</span>
                  </div>
                  <button onClick={() => removeFromCart(index)} className="summary-remove">Remove</button>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${cartTotal}</span>
              </div>
              <div className="total-row">
                <span>Transport (Teleportation)</span>
                <span>FREE</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>${cartTotal}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
