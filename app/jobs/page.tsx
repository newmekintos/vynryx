"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useP2P } from "@/components/providers/P2PProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { 
  Search, Plus, Briefcase, Clock, DollarSign,
  MapPin, Tag, MessageCircle, TrendingUp
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string;
  budget: string;
  duration: string;
  skills: string[];
  location: string;
  postedBy: string;
  postedAt: number;
}

export default function JobsPage() {
  const { isAuthenticated, user } = useAuth();
  const { data, room } = useP2P();
  const { t, language } = useLanguage();
  const router = useRouter();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    budget: "",
    duration: "",
    skills: "",
    location: "Remote",
  });

  // Jobs will be loaded from P2P data when available
  // For now, use localStorage
  useEffect(() => {
    const savedJobs = localStorage.getItem('vynryx_jobs');
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    }
  }, []);

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const job: Job = {
      id: Date.now().toString(),
      ...newJob,
      skills: newJob.skills.split(',').map(s => s.trim()),
      postedBy: user.vynryxAddress,
      postedAt: Date.now(),
    };

    // Save to localStorage
    const updatedJobs = [...jobs, job].sort((a, b) => b.postedAt - a.postedAt);
    setJobs(updatedJobs);
    localStorage.setItem('vynryx_jobs', JSON.stringify(updatedJobs));

    setNewJob({
      title: "",
      description: "",
      budget: "",
      duration: "",
      skills: "",
      location: "Remote",
    });
    setShowCreateModal(false);
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Briefcase className="w-20 h-20 text-purple-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">{language === 'tr' ? 'İş İlanlarını Görüntülemek İçin Giriş Yapın' : 'Login to View Job Listings'}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {language === 'tr' ? "VYNRYX'teki binlerce iş ilanını keşfetmek ve teklif vermek için wallet'ınızı bağlayın." : "Connect your wallet to discover thousands of job listings on VYNRYX and place bids."}
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {t.jobs.title}
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t.jobs.subtitle}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>{t.jobs.createJob}</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.jobs.searchJobs}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{jobs.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t.jobs.activeJobs}</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{filteredJobs.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t.jobs.results}</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">0%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t.auth.commission}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? t.dashboard.noResults : t.jobs.noJobs}
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-600 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{job.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm mb-4">
                        <span className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <strong>{job.budget}</strong>
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          {job.duration}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-purple-600" />
                          {job.location}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>{t.jobs.bid}</span>
                    </button>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-mono">{job.postedBy.slice(0, 6)}...{job.postedBy.slice(-4)}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(job.postedAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">{t.jobs.createNewJob}</h2>
            
            <form onSubmit={handleCreateJob} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t.jobs.jobTitle}</label>
                <input
                  type="text"
                  required
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder={t.jobs.jobTitlePlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.jobs.description}</label>
                <textarea
                  required
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
                  placeholder={t.jobs.descriptionPlaceholder}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.jobs.budget}</label>
                  <input
                    type="text"
                    required
                    value={newJob.budget}
                    onChange={(e) => setNewJob({ ...newJob, budget: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="$500 - $1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t.jobs.duration}</label>
                  <input
                    type="text"
                    required
                    value={newJob.duration}
                    onChange={(e) => setNewJob({ ...newJob, duration: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="2-3 hafta"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.jobs.requiredSkills}</label>
                <input
                  type="text"
                  required
                  value={newJob.skills}
                  onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder={t.jobs.skillsPlaceholder}
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
                  {t.jobs.publishJob}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
