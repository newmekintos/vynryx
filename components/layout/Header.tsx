"use client";

import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";
import { useLanguage } from "../providers/LanguageProvider";
import { Briefcase, Package, LayoutDashboard, Coins, LogOut, Settings, Globe } from "lucide-react";

export function Header() {
  const { isAuthenticated, waiqtionBalance, user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {t.header.platform}
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t.header.subtitle}
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/jobs"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              <span>{t.header.jobs}</span>
            </Link>
            <Link
              href="/services"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>{t.header.services}</span>
            </Link>
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{t.header.dashboard}</span>
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'}
            >
              <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {language === 'tr' ? 'TR' : 'EN'}
              </span>
            </button>

            {isAuthenticated && (
              <>
                {/* Waiqtion Balance */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-300 dark:border-yellow-800 rounded-lg">
                  <Coins className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <div className="text-sm font-bold text-yellow-700 dark:text-yellow-300">
                      {waiqtionBalance} WQT
                    </div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">
                      {user?.name || 'User'}
                    </div>
                  </div>
                </div>

                {/* Settings Link */}
                <Link
                  href="/settings"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title={t.settings.title}
                >
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Link>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title={t.common.logout}
                >
                  <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </>
            )}
            
            {!isAuthenticated && (
              <Link
                href="/auth"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                {t.common.login} / {t.common.register}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
