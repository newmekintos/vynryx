"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Wallet, User, Shield, Coins } from "lucide-react";

export default function AuthPage() {
  const { isAuthenticated, createWallet, restoreWallet, chainHeight } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  
  const [walletMode, setWalletMode] = useState<'create' | 'restore'>('create');
  
  const [formData, setFormData] = useState({
    name: '',
    seedPhrase: '',
  });
  const [error, setError] = useState('');
  const [newWallet, setNewWallet] = useState<any>(null);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);

  // Eğer authenticated ise dashboard'a yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleCreateWallet = async () => {
    try {
      setError('');
      if (!formData.name.trim()) {
        setError(t.auth.nameRequired);
        return;
      }
      const wallet = await createWallet(formData.name);
      
      // Chain ID'yi wallet address'ten hesapla (deterministik)
      const generateChainId = (address: string): number => {
        let hash = 0;
        for (let i = 0; i < address.length; i++) {
          hash = ((hash << 5) - hash) + address.charCodeAt(i);
          hash = hash & hash;
        }
        return Math.abs(hash) % 1000000;
      };
      
      setNewWallet({ ...wallet, chainId: generateChainId(wallet.address) });
      setShowSeedPhrase(true);
    } catch (err) {
      setError(t.common.error);
    }
  };

  const handleRestoreWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      if (!formData.name.trim()) {
        setError(t.auth.nameRequired);
        return;
      }
      const wallet = await restoreWallet(formData.seedPhrase, formData.name);
      router.push("/dashboard");
    } catch (err: any) {
      // Daha detaylı hata mesajı
      if (err.message && err.message.includes('word list')) {
        setError('❌ ' + (language === 'tr' 
          ? 'Geçersiz kelimeler! Sadece VYNRYX kelime listesindeki kelimeler kullanılabilir.' 
          : 'Invalid words! Only words from VYNRYX word list can be used.'));
      } else {
        setError(t.auth.invalidSeedPhrase);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {t.auth.empire}
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                {t.auth.createIdentity}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {t.auth.freedom}
              </p>
            </div>

            {/* Chain Info */}
            <div className="mb-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">{t.auth.chainInfo}</div>
                  <div className="text-xs text-purple-500 dark:text-purple-500">{t.auth.ownBlockchain}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{chainHeight}</div>
                  <div className="text-xs text-purple-500">{language === 'tr' ? 'Toplam Kullanıcı' : 'Total Users'}</div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Wallet Mode Toggle */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <button
                onClick={() => setWalletMode('create')}
                className={`flex-1 py-3 px-4 rounded-md transition-all text-sm font-medium ${
                  walletMode === 'create'
                    ? 'bg-white dark:bg-gray-800 shadow-sm text-purple-600'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Wallet className="w-4 h-4 inline mr-2" />
                {t.auth.newIdentity}
              </button>
              <button
                onClick={() => setWalletMode('restore')}
                className={`flex-1 py-3 px-4 rounded-md transition-all text-sm font-medium ${
                  walletMode === 'restore'
                    ? 'bg-white dark:bg-gray-800 shadow-sm text-purple-600'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Shield className="w-4 h-4 inline mr-2" />
                {t.auth.restoreIdentity}
              </button>
            </div>

            {walletMode === 'create' ? (
              !showSeedPhrase ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      {t.auth.yourName}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder={t.auth.namePlaceholder}
                    />
                  </div>

                  <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border-2 border-purple-300 dark:border-purple-700">
                    <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-bold text-center mb-2 text-lg">{t.auth.createBlockchainIdentity}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                      {t.auth.identityInfo}
                    </p>
                    <ul className="text-sm space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>{t.auth.seedPhrase12}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>{t.auth.vynAddress}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>{t.auth.welcomeBonus}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>{t.auth.chainId}: #{chainHeight + 1}</span>
                      </li>
                    </ul>
                    <button
                      onClick={handleCreateWallet}
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity font-bold text-lg shadow-lg"
                    >
                      <Wallet className="w-6 h-6" />
                      <span>{t.auth.createBlockchainIdentity}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-xl">
                  <h3 className="font-bold text-center mb-4 text-2xl text-yellow-800 dark:text-yellow-300">🔐 {t.auth.saveSeedPhrase}</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 text-center mb-6">
                    {t.auth.seedPhraseWarning}
                  </p>
                  <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border-2 border-yellow-400 mb-6">
                    <p className="text-center font-mono text-lg break-all leading-relaxed">
                      {newWallet?.seedPhrase}
                    </p>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-400 font-semibold">
                        ⚠️ {t.auth.neverShare}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg">
                      <p className="text-xs text-green-700 dark:text-green-400">
                        ✅ <strong>{t.auth.chainId}:</strong> #{newWallet?.chainId}
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                        ✅ <strong>{t.auth.address}:</strong> <span className="font-mono">{newWallet?.address}</span>
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                        ✅ <strong>{t.auth.wqtBonus}:</strong> 100 {t.auth.wqtLoaded}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity font-bold text-lg"
                  >
                    {t.auth.joinEmpire}
                  </button>
                </div>
              )
            ) : (
              <form onSubmit={handleRestoreWallet} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    {t.common.name}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder={t.auth.namePlaceholder}
                  />
                </div>

                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-xl">
                  <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-bold text-center mb-2 text-lg">{t.auth.restoreYourIdentity}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
                    {t.auth.enterSeedPhrase}
                  </p>

                  <textarea
                    required
                    value={formData.seedPhrase}
                    onChange={(e) => setFormData({ ...formData, seedPhrase: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-blue-300 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-sm"
                    placeholder={t.auth.seedPhrasePlaceholder}
                  />
                  <button
                    type="submit"
                    className="w-full mt-6 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-bold text-lg"
                  >
                    <Shield className="w-6 h-6" />
                    <span>{t.auth.restoreButton}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Coins className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
              <div className="text-sm font-semibold">100 WQT</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{t.auth.starting}</div>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-lg font-bold text-purple-600">0%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{t.auth.commission}</div>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-lg font-bold text-green-600">P2P</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{t.auth.p2pNetwork}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
