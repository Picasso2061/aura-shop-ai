import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const SESSION_ID = uuidv4();
const API_BASE = 'http://localhost:5000/api';

export const useBehavioralTracking = () => {
  const [intent, setIntent] = useState('BROWSING');
  const interactions = useRef([]);
  const lastScrollPos = useRef(0);

  useEffect(() => {
    const trackEvent = (type, elementId, data = {}) => {
      const event = {
        session_id: SESSION_ID,
        event_type: type,
        element_id: elementId,
        data,
        timestamp: Date.now()
      };
      
      interactions.current.push(event);
      if (interactions.current.length > 10) {
        flushEvents();
      }
    };

    const flushEvents = async () => {
      if (interactions.current.length === 0) return;
      
      const eventsToSend = [...interactions.current];
      interactions.current = [];
      
      try {
        await axios.post(`${API_BASE}/track`, {
          session_id: SESSION_ID,
          events: eventsToSend
        });

        // Also fetch predicted intent
        const response = await axios.post(`${API_BASE}/predict`, {
          session_id: SESSION_ID,
          interactions: eventsToSend
        });
        setIntent(response.data.intent);
      } catch (err) {
        console.error('Tracking failed', err);
      }
    };

    const handleScroll = () => {
      const currentPos = window.scrollY;
      const velocity = Math.abs(currentPos - lastScrollPos.current);
      lastScrollPos.current = currentPos;
      
      trackEvent('scroll', 'window', { velocity, depth: currentPos });
    };

    const handleClick = (e) => {
      const target = e.target.closest('[data-track-id]');
      if (target) {
        trackEvent('click', target.getAttribute('data-track-id'));
      }
    };

    let hoverTimer = null;
    let currentHoverId = null;

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-track-id]');
      if (target && target.getAttribute('data-track-id') !== currentHoverId) {
        if (hoverTimer) clearTimeout(hoverTimer);
        currentHoverId = target.getAttribute('data-track-id');
        const startTime = Date.now();
        
        hoverTimer = setTimeout(() => {
          trackEvent('hover', currentHoverId, { duration: Date.now() - startTime });
        }, 1000); // Only track if they hover for at least 1s
      }
    };

    const handleMouseOut = () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
        currentHoverId = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClick);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    const interval = setInterval(flushEvents, 5000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      clearInterval(interval);
    };
  }, []);

  return { intent, SESSION_ID };
};
