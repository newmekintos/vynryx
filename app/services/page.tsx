"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useP2P } from "@/components/providers/P2PProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { 
  Search, Plus, Package, Star, Clock, DollarSign,
  Tag, MessageCircle, Grid, List
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  deliveryTime: string;
  category: string;
  tags: string[];
  rating: number;
  createdBy: string;
  createdAt: number;
}

export default function ServicesPage() {
  const { isAuthenticated, user } = useAuth();
  const { data } = useP2P();
  const { t, language } = useLanguage();
  const router = useRouter();
  
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: "",
    deliveryTime: "",
    category: "development",
    tags: "",
  });

  const categories = [
    { value: "all", label: t.services.all },
    { value: "development", label: t.services.development },
    { value: "design", label: t.services.design },
    { value: "marketing", label: t.services.marketing },
    { value: "writing", label: t.services.writing },
    { value: "video", label: t.services.video },
    { value: "business", label: t.services.business },
  ];

  useEffect(() => {
    const savedServices = localStorage.getItem('vynryx_services');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }
  }, []);

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const service: Service = {
      id: Date.now().toString(),
      ...newService,
      tags: newService.tags.split(',').map(t => t.trim()),
      rating: 0,
      createdBy: user.vynryxAddress,
      createdAt: Date.now(),
    };

    const updatedServices = [...services, service].sort((a, b) => b.createdAt - a.createdAt);
    setServices(updatedServices);
    localStorage.setItem('vynryx_services', JSON.stringify(updatedServices));

    setNewService({
      title: "",
      description: "",
      price: "",
      deliveryTime: "",
      category: "development",
      tags: "",
    });
    setShowCreateModal(false);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Package className="w-20 h-20 text-purple-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">{language === 'tr' ? 'Servisleri Görüntülemek İçin Giriş Yapın' : 'Login to View Services'}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {language === 'tr' ? "VYNRYX'teki freelancer servislerini keşfetmek için wallet'ınızı bağlayın." : "Connect your wallet to discover freelancer services on VYNRYX."}
            </p>
            <button
              onClick={() => router.push('/auth')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              {language === 'tr' ? 'Giriş Yap / Kayıt Ol' : 'Login / Register'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {t.services.title}
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t.services.subtitle}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>{t.services.addService}</span>
            </button>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.services.searchServices}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <div className="flex bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 ${viewMode === "grid" ? "bg-purple-600 text-white" : "text-gray-600"} rounded-l-lg transition-colors`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 ${viewMode === "list" ? "bg-purple-600 text-white" : "text-gray-600"} rounded-r-lg transition-colors`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Services Grid/List */}
          {filteredServices.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || selectedCategory !== "all" ? t.dashboard.noResults : t.services.noServices}
              </p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-600 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {service.title.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold">{service.rating || (language === 'tr' ? 'Yeni' : 'New')}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm mb-4">
                    <span className="flex items-center gap-1 text-green-600 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      {service.price}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      {service.deliveryTime}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>{t.services.order}</span>
                  </button>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-mono">{service.createdBy.slice(0, 6)}...{service.createdBy.slice(-4)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Service Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{t.services.newService}</h2>
            
            <form onSubmit={handleCreateService} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t.jobs.jobTitle}</label>
                <input
                  type="text"
                  required
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder={language === 'tr' ? 'Örn: Web3 DApp Geliştirme' : 'e.g: Web3 DApp Development'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.jobs.description}</label>
                <textarea
                  required
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
                  placeholder={language === 'tr' ? 'Servisinizi detaylı açıklayın...' : 'Describe your service in detail...'}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.services.price}</label>
                  <input
                    type="text"
                    required
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="$100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t.services.deliveryTime}</label>
                  <input
                    type="text"
                    required
                    value={newService.deliveryTime}
                    onChange={(e) => setNewService({ ...newService, deliveryTime: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder={language === 'tr' ? '3 gün' : '3 days'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.services.category}</label>
                <select
                  value={newService.category}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  {categories.filter(c => c.value !== "all").map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.services.tags}</label>
                <input
                  type="text"
                  required
                  value={newService.tags}
                  onChange={(e) => setNewService({ ...newService, tags: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="React, Web3, Smart Contract"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                >
                  {t.services.publishService}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
