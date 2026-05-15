import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const SESSION_ID = uuidv4();
const API_BASE = '/_/backend';

export const useBehavioralTracking = () => {
  const [intent, setIntent] = useState('BROWSING');
  const interactions = useRef([]);
  const lastScrollPos = useRef(0);

  const isFlushing = useRef(false);
  const scrollTimeout = useRef(null);

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
      // Auto-flush if buffer gets too large, but only if not already flushing
      if (interactions.current.length > 20 && !isFlushing.current) {
        flushEvents();
      }
    };

    const flushEvents = async () => {
      if (interactions.current.length === 0 || isFlushing.current) return;
      
      isFlushing.current = true;
      const eventsToSend = [...interactions.current];
      interactions.current = [];
      
      try {
        await axios.post(`${API_BASE}/track`, {
          session_id: SESSION_ID,
          events: eventsToSend
        });

        const response = await axios.post(`${API_BASE}/predict`, {
          session_id: SESSION_ID,
          interactions: eventsToSend
        });
        setIntent(response.data.intent);
      } catch (err) {
        console.error('Tracking failed', err);
        // Put events back if failed? Maybe too complex for now.
      } finally {
        isFlushing.current = false;
      }
    };

    const handleScroll = () => {
      // Throttle scroll events to once every 150ms
      if (scrollTimeout.current) return;

      scrollTimeout.current = setTimeout(() => {
        const currentPos = window.scrollY;
        const velocity = Math.abs(currentPos - lastScrollPos.current);
        lastScrollPos.current = currentPos;
        
        trackEvent('scroll', 'window', { velocity, depth: currentPos });
        scrollTimeout.current = null;
      }, 150);
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
        }, 1500); // Increased to 1.5s to reduce noise
      }
    };

    const handleMouseOut = () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
        currentHoverId = null;
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClick);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    const interval = setInterval(flushEvents, 8000); // Increased interval to 8s

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      clearInterval(interval);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  return { intent, SESSION_ID };
};
