import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.png'; // We'll replace this with the generated one in the build step

const LandingPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="landing-page" style={{ 
      background: 'var(--bg)',
      color: 'var(--text)',
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      {/* Dynamic Background Elements */}
      <div style={{
        position: 'fixed',
        top: '-10%',
        right: '-10%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      {/* Navigation */}
      <nav style={{ 
        padding: '24px 80px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ 
          fontSize: '1.8rem', 
          fontWeight: '900', 
          letterSpacing: '-1px', 
          color: 'var(--text)',
          fontFamily: 'Outfit' 
        }}>
          AURA<span style={{ color: 'var(--primary)' }}>AI</span>
        </div>
        
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <a href="#features" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: '500', opacity: 0.7 }}>Platform</a>
          <a href="#intelligence" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: '500', opacity: 0.7 }}>Intelligence</a>
          
          {user ? (
            <Link to="/store" className="glass-card" style={{ 
              padding: '12px 28px', 
              color: 'var(--primary)', 
              textDecoration: 'none', 
              fontWeight: 'bold',
              borderRadius: '16px'
            }}>
              Launch Terminal
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <Link to="/login" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: '600' }}>Sign In</Link>
              <Link to="/signup" style={{ 
                background: 'var(--primary)', 
                color: 'white', 
                padding: '12px 32px', 
                borderRadius: '16px', 
                textDecoration: 'none', 
                fontWeight: 'bold',
                boxShadow: '0 8px 20px rgba(124, 58, 237, 0.2)'
              }}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ 
        padding: '120px 80px 80px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        alignItems: 'center',
        gap: '60px',
        position: 'relative',
        zIndex: 5
      }}>
        <div>
          <div className="ai-badge" style={{ marginBottom: '24px', display: 'inline-block' }}>Proprietary Neural Engine</div>
          <h1 style={{ 
            fontSize: '5.5rem', 
            fontWeight: '800', 
            lineHeight: '1.05', 
            margin: '0 0 32px 0',
            letterSpacing: '-3px'
          }}>
            E-Commerce, <br />
            <span style={{ 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Evolved.</span>
          </h1>
          <p style={{ 
            fontSize: '1.4rem', 
            lineHeight: '1.6', 
            opacity: 0.7, 
            maxWidth: '540px',
            marginBottom: '48px'
          }}>
            AuraShop AI decodes micro-behavioral signals to anticipate customer needs before they search. The future of retail is predictive.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/signup" style={{ 
              background: 'var(--primary)', 
              color: 'white', 
              padding: '20px 48px', 
              borderRadius: '18px', 
              textDecoration: 'none', 
              fontSize: '1.2rem', 
              fontWeight: '700',
              boxShadow: '0 15px 35px rgba(124, 58, 237, 0.3)'
            }}>
              Begin Your Journey
            </Link>
            <Link to="/store" className="glass-card" style={{ 
              padding: '20px 48px', 
              color: 'var(--text)', 
              textDecoration: 'none', 
              fontSize: '1.2rem', 
              fontWeight: '700',
              borderRadius: '18px'
            }}>
              Explore Catalog
            </Link>
          </div>
        </div>
        
        <div style={{ position: 'relative' }}>
          <div className="glass-card" style={{ 
            width: '100%', 
            height: '500px', 
            overflow: 'hidden',
            position: 'relative'
          }}>
            <img 
              src={heroImage} 
              alt="Predictive AI visualization" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} 
            />
            <div style={{
              position: 'absolute',
              bottom: '30px',
              left: '30px',
              right: '30px',
              padding: '24px',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white'
            }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.8, marginBottom: '8px' }}>Real-time Signal</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>"High purchase intent detected in Hover Pattern #492"</div>
            </div>
          </div>
        </div>
      </header>

      {/* Feature Grid */}
      <section id="features" style={{ padding: '100px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '800' }}>The Neural Difference</h2>
          <p style={{ opacity: 0.6 }}>Three pillars of predictive commerce</p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '40px' 
        }}>
          <div className="glass-card" style={{ padding: '48px', transition: 'transform 0.3s' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '32px' }}>⚡</div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '16px' }}>Intent Prediction</h3>
            <p style={{ opacity: 0.6, lineHeight: '1.6' }}>Our proprietary LLM analyzes mouse velocity and hover duration to categorize intent in milliseconds.</p>
          </div>
          
          <div className="glass-card" style={{ padding: '48px', transition: 'transform 0.3s', border: '1px solid var(--primary)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '32px' }}>🧠</div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '16px' }}>MindAI Concierge</h3>
            <p style={{ opacity: 0.6, lineHeight: '1.6' }}>A futuristic shopping companion that doesn't wait for questions—it proactively offers solutions.</p>
          </div>
          
          <div className="glass-card" style={{ padding: '48px', transition: 'transform 0.3s' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '32px' }}>💎</div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '16px' }}>Dynamic Pricing</h3>
            <p style={{ opacity: 0.6, lineHeight: '1.6' }}>Personalized value optimization based on behavioral engagement and product scarcity.</p>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div style={{ 
        padding: '60px 80px', 
        borderTop: '1px solid var(--glass-border)',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: 0.5
      }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>NEURALINK READY</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>SIRIUS CERTIFIED</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>98% ACCURACY</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>SECURE AI</div>
      </div>

      {/* Footer */}
      <footer style={{ padding: '100px 80px', textAlign: 'center' }}>
        <div style={{ 
          fontSize: '1.8rem', 
          fontWeight: '900', 
          marginBottom: '40px' 
        }}>
          AURA<span style={{ color: 'var(--primary)' }}>AI</span>
        </div>
        <div style={{ opacity: 0.4, maxWidth: '600px', margin: '0 auto', fontSize: '0.9rem' }}>
          &copy; 2026 AuraShop AI Engineering. Powered by Gemini 1.5 Pro. <br />
          Built for the next generation of digital commerce.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
