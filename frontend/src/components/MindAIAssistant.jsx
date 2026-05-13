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
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={`ai-message ${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && <div className="ai-message bot">Thinking...</div>}
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', padding: '10px', color: 'white' }}
              placeholder="Ask me anything..."
            />
            <button onClick={handleSend} style={{ background: 'var(--primary)', border: 'none', borderRadius: '10px', padding: '10px 15px', color: 'white', cursor: 'pointer' }}>
              Send
            </button>
          </div>
        </div>
      )}
      <div className="ai-bubble" onClick={() => setIsOpen(!isOpen)}>
        <span style={{ fontSize: '1.5rem' }}>🧠</span>
      </div>
    </div>
  );
};

export default MindAIAssistant;
