import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav style={{ padding: '30px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px' }}>AURA<span style={{ color: 'var(--accent)' }}>AI</span></div>
        <div style={{ display: 'flex', gap: '30px' }}>
          <a href="#features" style={{ color: 'white', textDecoration: 'none', opacity: 0.7 }}>Features</a>
          <a href="#how-it-works" style={{ color: 'white', textDecoration: 'none', opacity: 0.7 }}>Technology</a>
          <Link to="/store" className="glass-card" style={{ padding: '10px 25px', color: 'var(--accent)', textDecoration: 'none', border: '1px solid var(--accent)' }}>Launch Store</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 20px' }}>
        <h1 style={{ fontSize: '5rem', margin: 0, lineHeight: 1.1, background: 'linear-gradient(to bottom, #fff 0%, #999 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Predicting Desire <br /> Before the Click.
        </h1>
        <p style={{ fontSize: '1.4rem', opacity: 0.6, maxWidth: '700px', marginTop: '30px', lineHeight: 1.6 }}>
          The world's first e-commerce engine that uses micro-behavioral signals to anticipate user intent with 98% accuracy.
        </p>
        <div style={{ marginTop: '50px', display: 'flex', gap: '20px' }}>
          <Link to="/store" style={{ background: 'var(--primary)', color: 'white', padding: '18px 40px', borderRadius: '50px', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 'bold', boxShadow: '0 10px 30px rgba(157, 80, 187, 0.4)' }}>
            Experience the Future
          </Link>
          <button style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '18px 40px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '1.1rem' }}>
            Watch the Film
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" style={{ padding: '100px 60px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
        <div className="glass-card" style={{ padding: '40px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>🖱️</div>
          <h3>Micro-Motion Analysis</h3>
          <p style={{ opacity: 0.6 }}>We track hover hesitation and scroll velocity to understand the user's psychological state.</p>
        </div>
        <div className="glass-card" style={{ padding: '40px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>🧠</div>
          <h3>Predictive Intent</h3>
          <p style={{ opacity: 0.6 }}>AI identifies "Comparison Shopping" vs "High Intent" patterns in real-time.</p>
        </div>
        <div className="glass-card" style={{ padding: '40px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⚡</div>
          <h3>Real-time Concierge</h3>
          <p style={{ opacity: 0.6 }}>MindAI proactively assists users exactly when they need a nudge or a discount.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '60px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', opacity: 0.3 }}>
        &copy; 2026 AuraShop AI Engineering. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
