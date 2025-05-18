'use client';

import { useEffect, useState } from 'react';

export default function ServiceWorkerRegistration() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || process.env.NODE_ENV !== 'production') {
      return;
    }

    let refreshing = false;
    
    // Handle page refresh when new service worker is activated
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        // Check for updates at intervals
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });
        
        console.log('ServiceWorker registration successful:', registration.scope);
      } catch (error) {
        console.error('ServiceWorker registration failed:', error);
      }
    };

    // Register when page loads
    window.addEventListener('load', registerServiceWorker);
    
    return () => {
      window.removeEventListener('load', registerServiceWorker);
    };
  }, []);

  // If you want to show an update notification to the user
  if (updateAvailable) {
    return (
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-md shadow-lg z-50 text-sm">
        <p>An update is available!</p>
        <button 
          className="underline mt-2"
          onClick={() => window.location.reload()}
        >
          Refresh to update
        </button>
      </div>
    );
  }

  return null;
}
