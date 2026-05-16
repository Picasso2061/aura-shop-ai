import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.png';

const LandingPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="landing-page" style={{ 
      background: '#ffffff',
      color: '#1f2937',
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Soft Purple Aura Background */}
      <div style={{
        position: 'fixed',
        top: '-10%',
        right: '-10%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>
      
      <div style={{
        position: 'fixed',
        bottom: '-10%',
        left: '-10%',
        width: '50%',
        height: '50%',
        background: 'radial-gradient(circle, rgba(167, 139, 250, 0.05) 0%, transparent 70%)',
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
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(124, 58, 237, 0.05)'
      }}>
        <div style={{ 
          fontSize: '1.8rem', 
          fontWeight: '900', 
          letterSpacing: '-1.5px', 
          color: '#111827',
          fontFamily: 'Outfit' 
        }}>
          AURA<span style={{ color: 'var(--primary)' }}>AI</span>
        </div>
        
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>Platform</a>
          <a href="#intelligence" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>Intelligence</a>
          
          {user ? (
            <Link to="/store" className="glass-card" style={{ 
              padding: '12px 28px', 
              color: 'var(--primary)', 
              textDecoration: 'none', 
              fontWeight: '700',
              borderRadius: '16px',
              border: '1px solid var(--primary)',
              background: 'transparent'
            }}>
              Launch Terminal
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <Link to="/login" style={{ color: '#111827', textDecoration: 'none', fontWeight: '600' }}>Sign In</Link>
              <Link to="/signup" style={{ 
                background: 'var(--primary)', 
                color: 'white', 
                padding: '12px 32px', 
                borderRadius: '16px', 
                textDecoration: 'none', 
                fontWeight: '700',
                boxShadow: '0 8px 25px rgba(124, 58, 237, 0.25)'
              }}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ 
        padding: '100px 80px 80px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        alignItems: 'center',
        gap: '80px',
        position: 'relative',
        zIndex: 5
      }}>
        <div>
          <div className="ai-badge" style={{ 
            marginBottom: '28px', 
            display: 'inline-block',
            background: 'rgba(124, 58, 237, 0.1)',
            color: 'var(--primary)',
            padding: '8px 20px',
            borderRadius: '50px',
            fontSize: '0.85rem',
            fontWeight: '700',
            letterSpacing: '0.5px'
          }}>Proprietary Neural Engine</div>
          
          <h1 style={{ 
            fontSize: '5.8rem', 
            fontWeight: '900', 
            lineHeight: '1.0', 
            margin: '0 0 32px 0',
            letterSpacing: '-4px',
            color: '#111827'
          }}>
            E-Commerce, <br />
            <span style={{ 
              background: 'linear-gradient(135deg, var(--primary), #4f46e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Evolved.</span>
          </h1>
          
          <p style={{ 
            fontSize: '1.35rem', 
            lineHeight: '1.6', 
            color: '#4b5563', 
            maxWidth: '560px',
            marginBottom: '56px'
          }}>
            AuraShop AI decodes micro-behavioral signals to anticipate customer needs before they search. Experience the white-glove future of retail.
          </p>
          
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link to="/signup" style={{ 
              background: 'var(--primary)', 
              color: 'white', 
              padding: '22px 52px', 
              borderRadius: '20px', 
              textDecoration: 'none', 
              fontSize: '1.25rem', 
              fontWeight: '700',
              boxShadow: '0 15px 40px rgba(124, 58, 237, 0.35)'
            }}>
              Begin Your Journey
            </Link>
            <Link to="/store" className="glass-card" style={{ 
              padding: '22px 52px', 
              color: '#111827', 
              textDecoration: 'none', 
              fontSize: '1.25rem', 
              fontWeight: '700',
              borderRadius: '20px',
              border: '1px solid #e5e7eb'
            }}>
              Explore Catalog
            </Link>
          </div>
        </div>
        
        <div style={{ position: 'relative' }}>
          <div className="glass-card" style={{ 
            width: '100%', 
            height: '550px', 
            overflow: 'hidden',
            position: 'relative',
            borderRadius: '40px',
            border: '8px solid white',
            boxShadow: '0 30px 60px rgba(0,0,0,0.1)'
          }}>
            <img 
              src={heroImage} 
              alt="Predictive AI visualization" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div style={{
              position: 'absolute',
              bottom: '30px',
              left: '30px',
              right: '30px',
              padding: '28px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(124, 58, 237, 0.1)',
              boxShadow: '0 15px 30px rgba(0,0,0,0.05)',
              color: '#111827'
            }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: '800', marginBottom: '8px', letterSpacing: '1px' }}>Neural Telemetry</div>
              <div style={{ fontSize: '1.15rem', fontWeight: '700' }}>"High purchase intent detected in Hover Pattern #492"</div>
            </div>
          </div>
          
          {/* Floating UI Elements */}
          <div style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            padding: '20px 30px',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            zIndex: 10,
            border: '1px solid rgba(124, 58, 237, 0.1)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>📈</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>Conversion Uplift</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)' }}>+42.8%</div>
          </div>
        </div>
      </header>

      {/* Feature Grid */}
      <section id="features" style={{ padding: '120px 80px', background: '#f9fafb' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#111827', letterSpacing: '-2px' }}>The Neural Difference</h2>
          <p style={{ color: '#6b7280', fontSize: '1.2rem' }}>Three pillars of predictive commerce</p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '48px' 
        }}>
          <div className="glass-card" style={{ padding: '56px', transition: 'transform 0.3s', background: 'white' }}>
            <div style={{ fontSize: '3rem', marginBottom: '32px' }}>⚡</div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', fontWeight: '800' }}>Intent Prediction</h3>
            <p style={{ color: '#6b7280', lineHeight: '1.7', fontSize: '1.1rem' }}>Our proprietary LLM analyzes mouse velocity and hover duration to categorize intent in milliseconds.</p>
          </div>
          
          <div className="glass-card" style={{ padding: '56px', transition: 'transform 0.3s', border: '2px solid var(--primary)', background: 'white', transform: 'scale(1.05)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '32px' }}>🧠</div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', fontWeight: '800' }}>MindAI Concierge</h3>
            <p style={{ color: '#6b7280', lineHeight: '1.7', fontSize: '1.1rem' }}>A futuristic shopping companion that doesn't wait for questions—it proactively offers personalized solutions.</p>
          </div>
          
          <div className="glass-card" style={{ padding: '56px', transition: 'transform 0.3s', background: 'white' }}>
            <div style={{ fontSize: '3rem', marginBottom: '32px' }}>💎</div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', fontWeight: '800' }}>Dynamic Pricing</h3>
            <p style={{ color: '#6b7280', lineHeight: '1.7', fontSize: '1.1rem' }}>Personalized value optimization based on behavioral engagement signals and product scarcity analytics.</p>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div style={{ 
        padding: '80px', 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ffffff'
      }}>
        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#9ca3af', letterSpacing: '2px' }}>NEURALINK READY</div>
        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#9ca3af', letterSpacing: '2px' }}>SIRIUS CERTIFIED</div>
        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#9ca3af', letterSpacing: '2px' }}>98% ACCURACY</div>
        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#9ca3af', letterSpacing: '2px' }}>SECURE AI</div>
      </div>

      {/* Footer */}
      <footer style={{ padding: '120px 80px', textAlign: 'center', borderTop: '1px solid #f3f4f6' }}>
        <div style={{ 
          fontSize: '2rem', 
          fontWeight: '900', 
          marginBottom: '32px',
          letterSpacing: '-1.5px'
        }}>
          AURA<span style={{ color: 'var(--primary)' }}>AI</span>
        </div>
        <div style={{ color: '#9ca3af', maxWidth: '640px', margin: '0 auto', fontSize: '1rem', lineHeight: '1.6' }}>
          &copy; 2026 AuraShop AI Engineering. Powered by Gemini 1.5 Pro. <br />
          Built for the next generation of digital commerce.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
