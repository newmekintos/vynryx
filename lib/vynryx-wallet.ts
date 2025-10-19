// VYNRYX INTERNAL WALLET SYSTEM
// Tamamen bağımsız, platform içi cüzdan sistemi
// MetaMask'a ihtiyaç YOK!

export interface VynryxWallet {
  address: string;
  publicKey: string;
  privateKey: string; // Encrypted
  seedPhrase: string; // 12 kelime
  createdAt: number;
}

export interface WalletInfo {
  address: string;
  publicKey: string;
  createdAt: number;
  balance: number; // WQT balance
}

// VYNRYX Kelime Listesi - Sadece bu kelimeler geçerlidir!
// ⚠️ UYARI: Sadece bu listedeki kelimeler seed phrase için kullanılabilir
export const VYNRYX_WORD_LIST = [
  // Platform kelimeleri
  'vynryx', 'freedom', 'network', 'talent', 'chain', 'trust', 'skill',
  'work', 'reward', 'create', 'build', 'empire', 'power', 'future',
  'crypto', 'peer', 'node', 'block', 'smart', 'code', 'dream', 'rise',
  'growth', 'value', 'token', 'earn', 'trade', 'connect', 'innovate',
  'decentralized', 'autonomous', 'sovereign', 'independent', 'revolutionary',
  // Ek güvenlik kelimeleri
  'secure', 'wallet', 'digital', 'verify', 'realize', 'expertise', 'freelance',
  'service', 'project', 'develop', 'design', 'market', 'business', 'data',
  'system', 'platform', 'protocol', 'consensus', 'mining', 'stake', 'proof',
  'ledger', 'distributed', 'hash', 'key', 'public', 'private', 'signature',
  'transaction', 'address', 'balance', 'transfer', 'contract', 'execute',
  'deploy', 'upgrade', 'version', 'release', 'stable', 'beta', 'alpha',
  'launch', 'start', 'begin', 'end', 'complete', 'finish', 'success',
  'achieve', 'goal', 'target', 'mission', 'vision', 'strategy', 'plan',
  'action', 'result', 'outcome', 'impact', 'effect', 'change', 'transform',
  'evolve', 'adapt', 'improve', 'optimize', 'enhance', 'upgrade', 'boost',
  'increase', 'decrease', 'scale', 'expand', 'grow', 'shrink', 'adjust',
  'modify', 'update', 'refresh', 'renew', 'restore', 'backup', 'recovery'
];

export class VynryxWalletSystem {
  private static STORAGE_KEY = 'vynryx_internal_wallet';
  private static WALLETS_KEY = 'vynryx_all_wallets';

  // Yeni cüzdan oluştur
  static createWallet(): VynryxWallet {
    // Seed phrase oluştur (12 kelime)
    const seedPhrase = this.generateSeedPhrase();
    
    // Seed'den private key türet
    const privateKey = this.derivePrivateKey(seedPhrase);
    
    // Private key'den public key türet
    const publicKey = this.derivePublicKey(privateKey);
    
    // Public key'den address türet
    const address = this.deriveAddress(publicKey);

    const wallet: VynryxWallet = {
      address,
      publicKey,
      privateKey: this.encryptPrivateKey(privateKey),
      seedPhrase,
      createdAt: Date.now(),
    };

    return wallet;
  }

  // Seed phrase'den cüzdan geri yükle
  static restoreWallet(seedPhrase: string): VynryxWallet | null {
    try {
      const words = seedPhrase.trim().toLowerCase().split(' ');
      if (words.length !== 12) return null;

      // Seed'den private key türet
      const privateKey = this.derivePrivateKey(seedPhrase);
      const publicKey = this.derivePublicKey(privateKey);
      const address = this.deriveAddress(publicKey);

      return {
        address,
        publicKey,
        privateKey: this.encryptPrivateKey(privateKey),
        seedPhrase,
        createdAt: Date.now(),
      };
    } catch {
      return null;
    }
  }

  // Cüzdanı kaydet
  static saveWallet(wallet: VynryxWallet, userId: string): void {
    // Ana cüzdan
    localStorage.setItem(`${this.STORAGE_KEY}_${userId}`, JSON.stringify(wallet));
    
    // Tüm cüzdanlar listesi
    const allWallets = this.getAllWallets();
    allWallets[wallet.address] = {
      address: wallet.address,
      publicKey: wallet.publicKey,
      createdAt: wallet.createdAt,
      balance: 0,
    };
    localStorage.setItem(this.WALLETS_KEY, JSON.stringify(allWallets));
  }

  // Cüzdanı yükle
  static loadWallet(userId: string): VynryxWallet | null {
    const stored = localStorage.getItem(`${this.STORAGE_KEY}_${userId}`);
    if (!stored) return null;
    return JSON.parse(stored);
  }

  // Cüzdan bilgisi al (private key olmadan)
  static getWalletInfo(userId: string): WalletInfo | null {
    const wallet = this.loadWallet(userId);
    if (!wallet) return null;

    return {
      address: wallet.address,
      publicKey: wallet.publicKey,
      createdAt: wallet.createdAt,
      balance: 0, // WQT balance ayrı sistemde
    };
  }

  // Tüm cüzdanlar
  static getAllWallets(): { [address: string]: WalletInfo } {
    const stored = localStorage.getItem(this.WALLETS_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  // Seed phrase oluştur (12 kelime)
  private static generateSeedPhrase(): string {
    const words: string[] = [];
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * VYNRYX_WORD_LIST.length);
      words.push(VYNRYX_WORD_LIST[randomIndex]);
    }
    return words.join(' ');
  }

  // Simple hash function for browser (SHA-256 alternative)
  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    // Convert to hex and pad
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    // Create longer hash by repeating and mixing
    return (hex + hex + hex + hex + hex + hex + hex + hex).substring(0, 64);
  }

  // Seed'den private key türet
  private static derivePrivateKey(seedPhrase: string): string {
    // Basit hash (production'da PBKDF2 veya scrypt kullan)
    return this.simpleHash(seedPhrase + 'VYNRYX_PRIVATE');
  }

  // Private key'den public key türet
  private static derivePublicKey(privateKey: string): string {
    // Basit türetme (production'da ECC kullan)
    return this.simpleHash(privateKey + 'PUBLIC_KEY');
  }

  // Public key'den address türet
  private static deriveAddress(publicKey: string): string {
    // VYNRYX address formatı: VYN-XXXX-XXXX-XXXX
    const hash = this.simpleHash(publicKey + 'ADDRESS');
    const part1 = hash.substring(0, 4).toUpperCase();
    const part2 = hash.substring(4, 8).toUpperCase();
    const part3 = hash.substring(8, 12).toUpperCase();
    return `VYN-${part1}-${part2}-${part3}`;
  }

  // Private key'i şifrele
  private static encryptPrivateKey(privateKey: string): string {
    // Basit XOR şifreleme (production'da AES kullan)
    const key = 'VYNRYX_EMPIRE_2025';
    let encrypted = '';
    for (let i = 0; i < privateKey.length; i++) {
      encrypted += String.fromCharCode(
        privateKey.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(encrypted); // Browser-compatible base64
  }

  // Private key'i çöz
  private static decryptPrivateKey(encrypted: string): string {
    const key = 'VYNRYX_EMPIRE_2025';
    const decoded = atob(encrypted); // Browser-compatible base64 decode
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
      decrypted += String.fromCharCode(
        decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return decrypted;
  }

  // Seed phrase'i doğrula
  static validateSeedPhrase(seedPhrase: string): boolean {
    const words = seedPhrase.trim().toLowerCase().split(' ');
    if (words.length !== 12) return false;
    
    // Tüm kelimelerin listede olup olmadığını kontrol et
    return words.every(word => VYNRYX_WORD_LIST.includes(word));
  }

  // Cüzdanı sil
  static deleteWallet(userId: string): void {
    localStorage.removeItem(`${this.STORAGE_KEY}_${userId}`);
  }

  // Export wallet (yedekleme)
  static exportWallet(userId: string): string | null {
    const wallet = this.loadWallet(userId);
    if (!wallet) return null;
    
    return JSON.stringify({
      address: wallet.address,
      seedPhrase: wallet.seedPhrase,
      createdAt: wallet.createdAt,
    }, null, 2);
  }

  // Import wallet (geri yükleme)
  static importWallet(data: string, userId: string): boolean {
    try {
      const parsed = JSON.parse(data);
      const wallet = this.restoreWallet(parsed.seedPhrase);
      if (!wallet) return false;
      
      this.saveWallet(wallet, userId);
      return true;
    } catch {
      return false;
    }
  }
}

// VYNRYX Chain - Gelecek için blockchain vizyonu
export interface VynryxChainBlock {
  index: number;
  timestamp: number;
  transactions: VynryxTransaction[];
  previousHash: string;
  hash: string;
  nonce: number;
}

export interface VynryxTransaction {
  from: string;
  to: string;
  amount: number;
  type: 'WQT' | 'transfer' | 'reward';
  timestamp: number;
  signature?: string;
}

// Basit blockchain simülasyonu (gelecek özellik)
export class VynryxChain {
  private static CHAIN_KEY = 'vynryx_blockchain';
  
  static addTransaction(tx: VynryxTransaction): void {
    const chain = this.getChain();
    chain.push({
      ...tx,
      timestamp: Date.now(),
    });
    localStorage.setItem(this.CHAIN_KEY, JSON.stringify(chain));
  }

  static getChain(): VynryxTransaction[] {
    const stored = localStorage.getItem(this.CHAIN_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static getTransactionHistory(address: string): VynryxTransaction[] {
    const chain = this.getChain();
    return chain.filter(tx => tx.from === address || tx.to === address);
  }
}
