"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { VynryxWalletSystem } from "@/lib/vynryx-wallet";
import { Globe, Trash2, AlertTriangle, Key, Eye, EyeOff, Copy, Check } from "lucide-react";

export default function SettingsPage() {
  const { user, deleteIdentity } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState<string>("");
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    if (user) {
      const wallet = VynryxWalletSystem.loadWallet(user.id);
      if (wallet) {
        setSeedPhrase(wallet.seedPhrase);
      }
    }
  }, [user]);

  const handleCopySeed = () => {
    navigator.clipboard.writeText(seedPhrase);
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(user?.vynryxAddress || '');
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleDeleteIdentity = async () => {
    setIsDeleting(true);
    const success = await deleteIdentity();
    
    if (success) {
      // Başarılı - auth sayfasına yönlendir
      router.push("/auth");
    } else {
      setIsDeleting(false);
      alert(t.common.error);
    }
  };

  if (!user) {
    router.push("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t.settings.title}
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t.settings.account}
          </p>

          <div className="space-y-4">
            {/* Language Setting */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t.settings.language}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'tr' ? 'Türkçe' : 'English'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage('tr')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      language === 'tr'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    TR
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      language === 'en'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>

            {/* Identity Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold mb-4">Blockchain {t.settings.account}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t.common.name}:</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{t.auth.address}:</span>
                  <button
                    onClick={handleCopyAddress}
                    className="flex items-center gap-2 px-3 py-1 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors group"
                    title={language === 'tr' ? 'Kopyala' : 'Copy'}
                  >
                    <span className="font-mono text-xs">{user.vynryxAddress}</span>
                    {copiedAddress ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                    )}
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t.auth.chainId}:</span>
                  <span className="font-medium">#{user.chainId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Created:</span>
                  <span className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                  </span>
                </div>
              </div>
            </div>

            {/* Seed Phrase - Recovery */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Key className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-1">
                    {t.auth.seedPhrase12}
                  </h3>
                  <p className="text-sm text-purple-700 dark:text-purple-400">
                    {language === 'tr' 
                      ? 'Cüzdanınızı kurtarmak için bu 12 kelimeyi güvenli bir yerde saklayın.'
                      : 'Keep these 12 words safe to recover your wallet.'}
                  </p>
                </div>
              </div>

              {seedPhrase && (
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-900 rounded-lg border border-purple-300 dark:border-purple-700 p-4">
                    <div className={`font-mono text-sm ${showSeedPhrase ? '' : 'blur-sm select-none'}`}>
                      {seedPhrase.split(' ').map((word, idx) => (
                        <span key={idx} className="inline-block mr-2 mb-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/50 rounded">
                          {idx + 1}. {word}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                    >
                      {showSeedPhrase ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>{language === 'tr' ? 'Gizle' : 'Hide'}</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>{language === 'tr' ? 'Göster' : 'Show'}</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCopySeed}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors font-medium"
                    >
                      {copiedSeed ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{language === 'tr' ? 'Kopyalandı!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>{language === 'tr' ? 'Kopyala' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800 p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-900 dark:text-red-300">{t.settings.deleteIdentity}</h3>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                    {t.settings.deleteInfo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
              >
                <Trash2 className="w-5 h-5" />
                <span>{t.settings.deleteIdentity}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t.settings.deleteWarning}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t.settings.deleteInfo}
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700 dark:text-red-400 font-semibold">
                {language === 'tr' 
                  ? '⚠️ Bu işlem geri alınamaz! Tüm verileriniz kalıcı olarak silinecek:'
                  : '⚠️ This action cannot be undone! All your data will be permanently deleted:'}
              </p>
              <ul className="text-xs text-red-600 dark:text-red-400 mt-2 space-y-1 ml-4">
                <li>• {t.auth.seedPhrase12}</li>
                <li>• {t.auth.address}</li>
                <li>• WQT {t.header.balance}</li>
                <li>• {language === 'tr' ? 'Tüm mesajlar ve veriler' : 'All messages and data'}</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors font-semibold"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleDeleteIdentity}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50"
              >
                {isDeleting ? t.common.loading : t.settings.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
