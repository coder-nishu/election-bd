import { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const useFingerprint = () => {
  const [visitorId, setVisitorId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFingerprint = async () => {
      try {
        // Initialize FingerprintJS
        const fp = await FingerprintJS.load();
        
        // Get the visitor identifier
        const result = await fp.get();
        
        // This is the visitor identifier
        const visitorIdentifier = result.visitorId;
        
        setVisitorId(visitorIdentifier);
        
        // Also store in localStorage as backup
        localStorage.setItem('deviceFingerprint', visitorIdentifier);
        
      } catch (error) {
        console.error('Error getting fingerprint:', error);
        
        // Fallback: Generate a simple fingerprint from available data
        const fallbackId = generateFallbackFingerprint();
        setVisitorId(fallbackId);
        localStorage.setItem('deviceFingerprint', fallbackId);
      } finally {
        setLoading(false);
      }
    };

    getFingerprint();
  }, []);

  return { visitorId, loading };
};

// Fallback fingerprint generator if FingerprintJS fails
const generateFallbackFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('fingerprint', 2, 2);
  const canvasData = canvas.toDataURL();

  const data = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    canvasData
  ].join('|');

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return 'fallback_' + Math.abs(hash).toString(16);
};

export default useFingerprint;
