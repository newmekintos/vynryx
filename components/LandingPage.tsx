"use client";

import { useState } from "react";
import { useAuth } from "./providers/AuthProvider";
import { useLanguage } from "./providers/LanguageProvider";
import { 
  Briefcase, Users, MessageCircle, Shield, Zap, Globe,
  ArrowRight, Check, Star, TrendingUp
} from "lucide-react";
import Link from "next/link";
import { Header } from "./layout/Header";

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  if (isAuthenticated) {
    // Redirect to dashboard if authenticated
    window.location.href = "/dashboard";
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-400 text-sm font-medium">
                <Zap className="w-4 h-4" />
                {t.landing.decentralizedPlatform}
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {t.landing.verifyNetwork}
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  {t.landing.realizeExpertise}
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300">
                {t.landing.heroDescription}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-lg"
                >
                  {t.landing.explorePlatform}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors font-semibold text-lg"
                >
                  {t.landing.viewServices}
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">100%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t.landing.p2pNetwork}</div>
                </div>
                <div className="w-px h-12 bg-gray-300 dark:bg-gray-700" />
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">0%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t.landing.commissionFee}</div>
                </div>
                <div className="w-px h-12 bg-gray-300 dark:bg-gray-700" />
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">∞</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t.landing.possibilities}</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">V</span>
                  </div>
                  <div>
                    <div className="font-semibold">VYNRYX Platform</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Decentralized Freelance Network</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: Shield, label: t.landing.walletAuth, color: "purple" },
                    { icon: Users, label: t.landing.p2pConnections, color: "blue" },
                    { icon: MessageCircle, label: t.landing.directMessaging, color: "green" },
                    { icon: Globe, label: t.landing.globalNetwork, color: "purple" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className={`w-10 h-10 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg flex items-center justify-center`}>
                        <item.icon className={`w-5 h-5 text-${item.color}-600 dark:text-${item.color}-400`} />
                      </div>
                      <span className="font-medium">{item.label}</span>
                      <Check className="w-5 h-5 text-green-600 ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {t.landing.whyVynryx}
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {t.landing.whyDescription}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Briefcase,
                  title: t.landing.jobsTitle,
                  desc: t.landing.jobsDesc,
                  link: "/jobs"
                },
                {
                  icon: Star,
                  title: t.landing.serviceCatalog,
                  desc: t.landing.serviceCatalogDesc,
                  link: "/services"
                },
                {
                  icon: MessageCircle,
                  title: t.landing.p2pMessagingTitle,
                  desc: t.landing.p2pMessagingDesc,
                  link: "/auth"
                },
                {
                  icon: Shield,
                  title: t.landing.walletIdTitle,
                  desc: t.landing.walletIdDesc,
                  link: "/auth"
                },
                {
                  icon: TrendingUp,
                  title: t.landing.zeroCommission,
                  desc: t.landing.zeroCommissionDesc,
                  link: "/auth"
                },
                {
                  icon: Globe,
                  title: t.landing.globalNetwork,
                  desc: t.landing.globalNetworkDesc,
                  link: "/auth"
                },
              ].map((feature, idx) => (
                <Link
                  key={idx}
                  href={feature.link}
                  className="p-8 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-600 transition-all group"
                >
                  <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              {t.landing.joinEmpire}
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              {t.landing.joinDescription}
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
            >
              {t.landing.getStarted}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="text-2xl font-bold text-white">VYNRYX</span>
            </div>
            <p className="mb-6">Verify Your Network, Realize Your eXpertise</p>
            <p className="text-sm">&copy; 2025 VYNRYX. Decentralized & Open Source.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
