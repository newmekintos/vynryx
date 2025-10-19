"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { WaiqtionWallet } from "@/lib/waiqtion";
import { VynryxWalletSystem, VynryxWallet } from "@/lib/vynryx-wallet";
import { useP2P } from "./P2PProvider";

interface User {
  id: string;
  name: string;
  vynryxAddress: string; // VYNRYX blockchain address (zorunlu)
  authType: 'vynryx_wallet'; // Sadece wallet!
  createdAt: number;
  chainId: number; // Blockchain'deki sıra numarası
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  createWallet: (name: string) => Promise<VynryxWallet>;
  restoreWallet: (seedPhrase: string, name: string) => Promise<VynryxWallet>;
  logout: () => void;
  deleteIdentity: () => Promise<boolean>;
  waiqtionBalance: number;
  refreshBalance: () => void;
  chainHeight: number; // Blockchain yüksekliği
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  createWallet: async () => VynryxWalletSystem.createWallet(),
  restoreWallet: async () => VynryxWalletSystem.createWallet(),
  logout: () => {},
  deleteIdentity: async () => false,
  waiqtionBalance: 0,
  refreshBalance: () => {},
  chainHeight: 0,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { gun } = useP2P();
  const [user, setUser] = useState<User | null>(null);
  const [waiqtionBalance, setWaiqtionBalance] = useState(0);
  const [chainHeight, setChainHeight] = useState(0);

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('vynryx_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      updateBalance(parsedUser.id);
    }
  }, []);

  // ⭐ Global User Count (GunDB - LocalStorage'dan bağımsız)
  useEffect(() => {
    if (!gun) return;

    // GunDB'den global unique kullanıcı sayısını oku
    const userAddresses = new Set<string>();
    
    gun.get('vynryx').get('users').map().on((userData: any, address: string) => {
      if (userData && address && userData.address) {
        userAddresses.add(address);
        // Her güncelleme geldiğinde sayıyı güncelle
        setChainHeight(userAddresses.size);
      }
    });
  }, [gun]);

  const updateBalance = (userId: string) => {
    const balance = WaiqtionWallet.getBalance(userId);
    setWaiqtionBalance(balance);
  };

  const refreshBalance = () => {
    if (user) {
      updateBalance(user.id);
    }
  };

  // Get current chain height (kept for compatibility)
  const getChainHeight = () => {
    const users = localStorage.getItem('vynryx_chain_users');
    if (!users) return 0;
    return Object.keys(JSON.parse(users)).length;
  };

  // Create new VYNRYX wallet
  const createWallet = async (name: string): Promise<VynryxWallet> => {
    const wallet = VynryxWalletSystem.createWallet();
    await setupWalletUser(wallet, name);
    return wallet;
  };

  // Restore VYNRYX wallet from seed phrase
  const restoreWallet = async (seedPhrase: string, name: string): Promise<VynryxWallet> => {
    // ⭐ ÖNEMLİ: Seed phrase doğrulaması
    if (!VynryxWalletSystem.validateSeedPhrase(seedPhrase)) {
      throw new Error('Invalid seed phrase - words not in VYNRYX word list');
    }
    
    const wallet = VynryxWalletSystem.restoreWallet(seedPhrase);
    if (!wallet) {
      throw new Error('Invalid seed phrase');
    }
    await setupWalletUser(wallet, name);
    return wallet;
  };

  // Helper: Setup wallet user
  const setupWalletUser = async (wallet: VynryxWallet, name: string) => {
    // Check if user exists with this wallet
    const usersData = localStorage.getItem('vynryx_chain_users');
    const chainUsers: { [key: string]: User } = usersData ? JSON.parse(usersData) : {};

    let walletUser = chainUsers[wallet.address];

    if (!walletUser) {
      // ⭐ UNIQUE CHAIN ID - Wallet address'ten deterministik ID üret
      // Bu sayede aynı wallet her zaman aynı Chain ID'yi alır (P2P ağda çakışma olmaz)
      const generateChainId = (address: string): number => {
        let hash = 0;
        for (let i = 0; i < address.length; i++) {
          hash = ((hash << 5) - hash) + address.charCodeAt(i);
          hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash) % 1000000; // 6 haneli unique ID
      };
      
      // Create new user on VYNRYX Chain
      walletUser = {
        id: `vynryx_${wallet.address}`,
        name,
        vynryxAddress: wallet.address,
        authType: 'vynryx_wallet',
        createdAt: Date.now(),
        chainId: generateChainId(wallet.address), // ⭐ Unique deterministik ID
      };

      chainUsers[wallet.address] = walletUser;
      localStorage.setItem('vynryx_chain_users', JSON.stringify(chainUsers));

      // ⭐ GunDB'ye kaydet (Global P2P network)
      if (gun) {
        gun.get('vynryx').get('users').get(wallet.address).put({
          address: wallet.address,
          chainId: walletUser.chainId,
          name: name,
          createdAt: walletUser.createdAt,
        });
      }

      // Save wallet
      VynryxWalletSystem.saveWallet(wallet, walletUser.id);

      // Create Waiqtion wallet with bonus
      WaiqtionWallet.createWallet(walletUser.id);
      
      // Add to VYNRYX Chain
      const { VynryxChain } = await import('@/lib/vynryx-wallet');
      VynryxChain.addTransaction({
        from: 'GENESIS',
        to: wallet.address,
        amount: 100,
        type: 'WQT',
        timestamp: Date.now(),
      });

      // ⭐ OTOMATIK PROFIL OLUŞTUR - Sonsuz döngüyü önlemek için
      const defaultProfile = {
        userType: 'freelancer', // Default olarak freelancer
        name: name,
        title: 'VYNRYX Blockchain Kullanıcısı',
        bio: `Chain ID #${walletUser.chainId} - ${wallet.address}`,
        skills: ['Blockchain', 'Web3', 'VYNRYX'],
        address: wallet.address,
        createdAt: Date.now(),
      };
      localStorage.setItem('vynryx_profile', JSON.stringify(defaultProfile));
    } else {
      // ⭐ MEVCUT KULLANICI - Restore yapıldı, aynı Chain ID korunacak
      // Wallet'ı tekrar kaydet (sadece güncelleme için)
      VynryxWalletSystem.saveWallet(wallet, walletUser.id);
      
      // GunDB'de yoksa ekle (yeni network'te restore ediliyor olabilir)
      if (gun) {
        gun.get('vynryx').get('users').get(wallet.address).put({
          address: wallet.address,
          chainId: walletUser.chainId,
          name: walletUser.name,
          createdAt: walletUser.createdAt,
        });
      }
    }

    setUser(walletUser);
    localStorage.setItem('vynryx_user', JSON.stringify(walletUser));
    updateBalance(walletUser.id);
    // Chain height GunDB'den otomatik güncelleniyor
  };

  // Logout
  const logout = () => {
    setUser(null);
    setWaiqtionBalance(0);
    localStorage.removeItem('vynryx_user');
  };

  // Delete Identity - Kimliği tamamen sil
  const deleteIdentity = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      // 1. Wallet sil
      VynryxWalletSystem.deleteWallet(user.id);

      // 2. Chain'den kullanıcıyı sil
      const usersData = localStorage.getItem('vynryx_chain_users');
      if (usersData) {
        const chainUsers = JSON.parse(usersData);
        delete chainUsers[user.vynryxAddress];
        localStorage.setItem('vynryx_chain_users', JSON.stringify(chainUsers));
      }

      // 3. Waiqtion cüzdanını sil
      localStorage.removeItem(`vynryx_waiqtion_wallet_${user.id}`);

      // 4. Profili sil
      localStorage.removeItem('vynryx_profile');

      // 5. Current user'ı sil
      localStorage.removeItem('vynryx_user');

      // 6. State temizle
      setUser(null);
      setWaiqtionBalance(0);
      setChainHeight(getChainHeight());

      return true;
    } catch (error) {
      console.error('Identity deletion error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        createWallet,
        restoreWallet,
        logout,
        deleteIdentity,
        waiqtionBalance,
        refreshBalance,
        chainHeight,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
