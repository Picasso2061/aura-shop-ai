import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const MindAIAssistant = ({ sessionId, currentIntent, onSuggestions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hi! I am MindAI. I noticed you are browsing our latest tech. Anything specific you are looking for?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/chat`, {
        session_id: sessionId,
        message: input,
        intent: currentIntent,
        history: messages.slice(-5)
      });

      setMessages(prev => [...prev, { role: 'bot', content: response.data.response }]);
      if (response.data.suggestions) {
        onSuggestions(response.data.suggestions);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant">
      {isOpen && (
        <div className="ai-chat glass-card">
          <div style={{ marginBottom: '15px', fontWeight: 'bold', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <span style={{ color: 'var(--accent)' }}>*</span> MindAI Concierge
          </div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`ai-message ${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && <div className="ai-message bot">Analyzing signals...</div>}
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px', color: 'white', outline: 'none' }}
              placeholder="Type a message..."
            />
            <button onClick={handleSend} style={{ background: 'var(--primary)', border: 'none', borderRadius: '12px', padding: '10px 18px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
              SEND
            </button>
          </div>
        </div>
      )}
      <div className="ai-bubble" onClick={() => setIsOpen(!isOpen)}>
        AI
      </div>
    </div>
  );
};

export default MindAIAssistant;
