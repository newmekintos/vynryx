"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface P2PContextType {
  gun: any;
  isOnline: boolean;
  peers: number;
  user: any;
}

const P2PContext = createContext<P2PContextType>({
  gun: null,
  isOnline: false,
  peers: 0,
  user: null,
});

export function P2PProvider({ children }: { children: ReactNode }) {
  const [gun, setGun] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [peers, setPeers] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // ⭐ Dynamic import - Sadece client-side'da çalışır (SSR hatası yok)
    if (typeof window === 'undefined') return;

    import('gun/gun').then(({ default: Gun }) => {
      // ⭐ TAM DECENTRALİZED - Public Mesh Network!
      // Backend YOK! Community relay'ler üzerinden P2P!
      
      const gunInstance = Gun({
        // Public community relay'ler (gönüllü sunucular)
        peers: [
          'https://gun-matrix.herokuapp.com/gun',
          'https://gunjs.herokuapp.com/gun',
        ],
        localStorage: true,  // Her cihaz kendi verisini tutar
        radisk: true,        // IndexedDB fallback
        axe: false,          // Hata logları kapalı
      });

      // SEA için dynamic import
      import('gun/sea').then(() => {
        const userInstance = gunInstance.user();
        setUser(userInstance);
      });
      
      setGun(gunInstance);
      setIsOnline(true);

      // Monitor peer connections
      gunInstance.on('hi', (peer: any) => {
        setPeers(prev => prev + 1);
      });

      gunInstance.on('bye', (peer: any) => {
        setPeers(prev => Math.max(0, prev - 1));
      });
    }).catch(err => {
      console.warn('GunDB failed to load:', err);
      setIsOnline(false);
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <P2PContext.Provider
      value={{
        gun,
        isOnline,
        peers,
        user,
      }}
    >
      {children}
    </P2PContext.Provider>
  );
}

export const useP2P = () => useContext(P2PContext);
