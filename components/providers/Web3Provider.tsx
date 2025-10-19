"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ethers, BrowserProvider } from "ethers";

interface Web3ContextType {
  address: string | null;
  isConnected: boolean;
  provider: BrowserProvider | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType>({
  address: null,
  isConnected: false,
  provider: null,
  connect: async () => {},
  disconnect: () => {},
});

export function Web3Provider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        
        setAddress(accounts[0]);
        setProvider(provider);
        
        // Save to localStorage
        localStorage.setItem("vynryx_connected", "true");
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnect = () => {
    setAddress(null);
    setProvider(null);
    localStorage.removeItem("vynryx_connected");
  };

  // Auto-connect if previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem("vynryx_connected");
    if (wasConnected && typeof window.ethereum !== "undefined") {
      connect();
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAddress(accounts[0]);
        }
      });
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        address,
        isConnected: !!address,
        provider,
        connect,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => useContext(Web3Context);
