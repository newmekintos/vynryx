"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { joinRoom, selfId } from "trystero/torrent";

interface P2PData {
  users: Map<string, any>;
  profiles: Map<string, any>;
}

interface P2PContextType {
  room: any;
  data: P2PData;
  isOnline: boolean;
  peers: string[];
  sendUser: (user: any) => void;
  sendProfile: (profile: any) => void;
}

const P2PContext = createContext<P2PContextType>({
  room: null,
  data: { users: new Map(), profiles: new Map() },
  isOnline: false,
  peers: [],
  sendUser: () => {},
  sendProfile: () => {},
});

export function P2PProvider({ children }: { children: ReactNode }) {
  const [room, setRoom] = useState<any>(null);
  const [data, setData] = useState<P2PData>({
    users: new Map(),
    profiles: new Map(),
  });
  const [isOnline, setIsOnline] = useState(false);
  const [peers, setPeers] = useState<string[]>([]);

  useEffect(() => {
    // ⭐ TRYSTERO - TAM P2P! Backend YOK! Relay YOK!
    // WebRTC + BitTorrent tracker'lar (sadece peer discovery için)
    if (typeof window === 'undefined') return;

    console.log('🚀 Trystero P2P başlatılıyor...');
    console.log('📍 Peer ID:', selfId);

    // VYNRYX P2P room
    const p2pRoom = joinRoom(
      { appId: 'vynryx-v1' },
      'vynryx-main-room'
    );

    setRoom(p2pRoom);
    setIsOnline(true);
    console.log('✅ P2P Room hazır!');

    // Peer tracking
    p2pRoom.onPeerJoin((peerId: string) => {
      console.log('👋 Peer joined:', peerId);
      setPeers(prev => [...prev, peerId]);
    });

    p2pRoom.onPeerLeave((peerId: string) => {
      console.log('👋 Peer left:', peerId);
      setPeers(prev => prev.filter(id => id !== peerId));
    });

    // User data sync
    const [sendUserData, receiveUserData] = p2pRoom.makeAction('user');
    receiveUserData((userData: any, peerId: string) => {
      console.log('📥 User data received from', peerId, userData);
      setData(prev => {
        const newUsers = new Map(prev.users);
        newUsers.set(userData.address, userData);
        return { ...prev, users: newUsers };
      });
    });

    // Profile data sync
    const [sendProfileData, receiveProfileData] = p2pRoom.makeAction('profile');
    receiveProfileData((profileData: any, peerId: string) => {
      console.log('📥 Profile data received from', peerId, profileData);
      setData(prev => {
        const newProfiles = new Map(prev.profiles);
        newProfiles.set(profileData.address, profileData);
        return { ...prev, profiles: newProfiles };
      });
    });

    return () => {
      console.log('👋 Leaving P2P room...');
      p2pRoom.leave();
    };
  }, []);

  // Send functions
  const sendUser = useCallback((user: any) => {
    if (!room) return;
    const [send] = room.makeAction('user');
    send(user);
    // LocalStorage'a da kaydet
    setData(prev => {
      const newUsers = new Map(prev.users);
      newUsers.set(user.address, user);
      return { ...prev, users: newUsers };
    });
  }, [room]);

  const sendProfile = useCallback((profile: any) => {
    if (!room) return;
    const [send] = room.makeAction('profile');
    send(profile);
    // LocalStorage'a da kaydet
    setData(prev => {
      const newProfiles = new Map(prev.profiles);
      newProfiles.set(profile.address, profile);
      return { ...prev, profiles: newProfiles };
    });
  }, [room]);

  return (
    <P2PContext.Provider
      value={{
        room,
        data,
        isOnline,
        peers,
        sendUser,
        sendProfile,
      }}
    >
      {children}
    </P2PContext.Provider>
  );
}

export const useP2P = () => useContext(P2PContext);
