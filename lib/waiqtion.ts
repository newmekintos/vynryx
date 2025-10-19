// Waiqtion (WQT) Token System
// Platform içi sanal para birimi

export interface WaiqtionBalance {
  userId: string;
  balance: number;
  earned: number;
  spent: number;
  transactions: WaiqtionTransaction[];
}

export interface WaiqtionTransaction {
  id: string;
  type: 'earn' | 'spend' | 'bonus' | 'transfer';
  amount: number;
  description: string;
  from?: string;
  to?: string;
  timestamp: number;
}

export class WaiqtionWallet {
  private static STORAGE_KEY = 'vynryx_waiqtion_wallet';
  private static INITIAL_BONUS = 100; // Yeni kullanıcılara 100 WQT

  // Yeni cüzdan oluştur
  static createWallet(userId: string): WaiqtionBalance {
    const wallet: WaiqtionBalance = {
      userId,
      balance: this.INITIAL_BONUS,
      earned: this.INITIAL_BONUS,
      spent: 0,
      transactions: [
        {
          id: Date.now().toString(),
          type: 'bonus',
          amount: this.INITIAL_BONUS,
          description: 'Hoş geldin bonusu! 🎉',
          timestamp: Date.now(),
        }
      ]
    };

    this.saveWallet(wallet);
    return wallet;
  }

  // Cüzdanı yükle
  static loadWallet(userId: string): WaiqtionBalance | null {
    const stored = localStorage.getItem(`${this.STORAGE_KEY}_${userId}`);
    if (!stored) return null;
    return JSON.parse(stored);
  }

  // Cüzdanı kaydet
  static saveWallet(wallet: WaiqtionBalance): void {
    localStorage.setItem(`${this.STORAGE_KEY}_${wallet.userId}`, JSON.stringify(wallet));
  }

  // Bakiye kontrolü
  static getBalance(userId: string): number {
    const wallet = this.loadWallet(userId);
    return wallet ? wallet.balance : 0;
  }

  // WQT kazan
  static earn(userId: string, amount: number, description: string): boolean {
    const wallet = this.loadWallet(userId);
    if (!wallet) return false;

    wallet.balance += amount;
    wallet.earned += amount;
    wallet.transactions.push({
      id: Date.now().toString(),
      type: 'earn',
      amount,
      description,
      timestamp: Date.now(),
    });

    this.saveWallet(wallet);
    return true;
  }

  // WQT harca
  static spend(userId: string, amount: number, description: string, to?: string): boolean {
    const wallet = this.loadWallet(userId);
    if (!wallet) return false;

    if (wallet.balance < amount) {
      return false; // Yetersiz bakiye
    }

    wallet.balance -= amount;
    wallet.spent += amount;
    wallet.transactions.push({
      id: Date.now().toString(),
      type: 'spend',
      amount,
      description,
      to,
      timestamp: Date.now(),
    });

    this.saveWallet(wallet);

    // Eğer transfer ise, alıcıya WQT ekle
    if (to) {
      this.earn(to, amount, `Transfer from ${userId.slice(0, 8)}`);
    }

    return true;
  }

  // Transfer
  static transfer(from: string, to: string, amount: number, description: string): boolean {
    return this.spend(from, amount, description, to);
  }

  // İşlem geçmişi
  static getTransactions(userId: string, limit: number = 10): WaiqtionTransaction[] {
    const wallet = this.loadWallet(userId);
    if (!wallet) return [];

    return wallet.transactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Tüm cüzdanları sil (reset için)
  static resetAll(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.STORAGE_KEY))
      .forEach(key => localStorage.removeItem(key));
  }
}

// WQT fiyatları
export const WQT_PRICES = {
  JOB_POST: 10,        // İlan yayınlama
  SERVICE_POST: 5,     // Servis ekleme
  FEATURED_JOB: 50,    // Öne çıkan ilan
  FEATURED_SERVICE: 30, // Öne çıkan servis
  BOOST_PROFILE: 20,   // Profil boost
  UNLOCK_CHAT: 2,      // Chat kilidi aç
};

// WQT kazanma miktarları
export const WQT_EARNINGS = {
  JOB_COMPLETE: 50,      // İş tamamlama
  SERVICE_SALE: 30,      // Servis satışı
  REVIEW_GIVEN: 5,       // Review yazma
  PROFILE_COMPLETE: 10,  // Profil tamamlama
  REFERRAL: 25,          // Referans
  DAILY_LOGIN: 5,        // Günlük giriş
};
