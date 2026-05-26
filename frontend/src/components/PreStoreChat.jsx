import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useBehavioralTracking } from '../hooks/useBehavioralTracking';

const API_BASE = '/_/backend';

const PreStoreChat = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { intent, SESSION_ID } = useBehavioralTracking();
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Welcome to AuraShop. I am MindAI, your personal shopping concierge. What kind of products are you looking for today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/chat`, {
        session_id: SESSION_ID,
        message: input,
        intent: intent,
        history: messages.slice(-5)
      });

      setMessages(prev => [...prev, { role: 'bot', content: response.data.response }]);
      
      if (response.data.suggestions && response.data.suggestions.length > 0) {
        setSuggestions(response.data.suggestions);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ 
      zIndex: 9999, 
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <button className="close-btn" onClick={onClose} style={{ color: '#000', fontSize: '3rem', top: '30px', right: '40px' }}>&times;</button>
      
      <div style={{ textAlign: 'center', marginBottom: '30px', animation: 'slideUp 0.5s ease' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', margin: '0 0 10px 0', color: '#111827' }}>MIND<span style={{ color: 'var(--primary)' }}>AI</span></h1>
        <p style={{ opacity: 0.6, fontSize: '1.2rem', color: '#4b5563' }}>Tell me what you desire, and I'll bring the store to you.</p>
      </div>

      <div className="glass-card" style={{
        width: '90%',
        maxWidth: '800px',
        height: '60vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px',
        background: '#ffffff',
        border: '1px solid rgba(124, 58, 237, 0.2)',
        boxShadow: '0 25px 50px rgba(124, 58, 237, 0.15)',
        animation: 'slideUp 0.6s ease'
      }}>
        <div className="chat-messages" style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '20px', marginBottom: '20px', fontSize: '1.1rem' }}>
          {messages.map((m, i) => (
            <div key={i} className={`ai-message ${m.role}`} style={{ maxWidth: '80%', padding: '16px 24px', marginBottom: '16px', borderRadius: '24px' }}>
              {m.content}
            </div>
          ))}
          {loading && <div className="ai-message bot" style={{ padding: '16px 24px', borderRadius: '24px' }}>Analyzing your intent...</div>}
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            style={{ 
              flex: 1, 
              background: 'rgba(124, 58, 237, 0.03)', 
              border: '2px solid var(--glass-border)', 
              borderRadius: '16px', 
              padding: '18px 24px', 
              fontSize: '1.1rem',
              color: 'var(--text)', 
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            placeholder="E.g., I'm looking for a fast gaming laptop..."
            autoFocus
          />
          <button 
            onClick={handleSend} 
            style={{ 
              background: 'var(--primary)', 
              border: 'none', 
              borderRadius: '16px', 
              padding: '0 40px', 
              color: 'white', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 8px 20px rgba(124, 58, 237, 0.3)',
              transition: 'transform 0.2s'
            }}
          >
            SEND
          </button>
        </div>
      </div>
      
      {suggestions && (
        <div style={{ marginTop: '30px', animation: 'fadeIn 0.5s ease' }}>
          <button 
            onClick={() => navigate('/store', { state: { suggestions } })}
            className="purple-template-btn"
            style={{ padding: '18px 48px', fontSize: '1.2rem', boxShadow: '0 15px 30px rgba(76, 29, 149, 0.4)' }}
          >
            Take me to my products 🚀
          </button>
        </div>
      )}
    </div>
  );
};

export default PreStoreChat;
