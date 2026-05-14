import React from 'react';
import '../theme.css';

const ThemePreview = () => {
  return (
    <div className="theme-preview">
      <nav className="navbar">
        <div className="nav-brand">AuraShop AI</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <main className="container">
        <header className="section">
          <h1 className="text-gradient">Premium Purple Experience</h1>
          <p>
            Experience the perfect blend of clean white aesthetics and deep purple elegance. 
            Designed for clarity, built for impact.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button className="btn">Get Started</button>
            <button className="btn" style={{ background: 'transparent', color: 'var(--btn-bg)', border: '2px solid var(--btn-bg)' }}>
              Learn More
            </button>
          </div>
        </header>

        <section className="section">
          <h2>Our Design Philosophy</h2>
          <p>
            We believe in semantic design that communicates intent through color. 
            Our <a href="#">purple accents</a> are carefully chosen to provide a professional yet modern feel.
          </p>
        </section>

        <section className="section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div className="card">
            <h3>Visual Clarity</h3>
            <p>Clean white backgrounds reduce cognitive load and keep focus on your content.</p>
          </div>
          <div className="card">
            <h3>Rich Interaction</h3>
            <p>Smooth hover effects and rounded buttons provide a tactile, premium experience.</p>
          </div>
          <div className="card">
            <h3>Modern Typography</h3>
            <p>Utilizing Outfit for headings and Inter for body text ensures maximum readability.</p>
          </div>
        </section>
      </main>

      <footer style={{ background: '#f8f9fa', padding: '4rem 2rem', textAlign: 'center', borderTop: '1px solid #eee' }}>
        <p style={{ color: '#666' }}>© 2026 AuraShop AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ThemePreview;
