"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./providers/AuthProvider";
import { useP2P } from "./providers/P2PProvider";
import { useLanguage } from "./providers/LanguageProvider";
import { Search, MessageCircle, User, Briefcase, Star } from "lucide-react";
import { ChatBox } from "./ChatBox";

interface Profile {
  name: string;
  title: string;
  bio: string;
  skills?: string[];
  userType: "freelancer" | "client";
  address: string;
  createdAt: number;
}

export function Dashboard() {
  const { user } = useAuth();
  const { gun } = useP2P();
  const { t } = useLanguage();
  const address = user?.vynryxAddress;
  
  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showChat, setShowChat] = useState(false);

  // Load my profile
  useEffect(() => {
    const savedProfile = localStorage.getItem('vynryx_profile');
    if (savedProfile) {
      setMyProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Load other profiles from P2P network
  useEffect(() => {
    if (!gun || !myProfile) return;

    const lookingFor = myProfile.userType === "freelancer" ? "clients" : "freelancers";
    
    gun.get('vynryx').get(lookingFor).map().on((profile: Profile, key: string) => {
      if (profile && key !== address) {
        setProfiles(prev => {
          const exists = prev.find(p => p.address === key);
          if (exists) return prev;
          return [...prev, { ...profile, address: key }];
        });
      }
    });
  }, [gun, myProfile, address]);

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (profile.skills && profile.skills.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  const handleStartChat = (profile: Profile) => {
    setSelectedProfile(profile);
    setShowChat(true);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Profiles List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            {myProfile?.userType === "freelancer" ? t.dashboard.findClients : t.dashboard.findFreelancers}
          </h2>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.dashboard.searchPlaceholder}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div className="space-y-4">
            {filteredProfiles.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>{t.dashboard.noResults}</p>
                <p className="text-sm mt-2">{t.dashboard.waitingPeers}</p>
              </div>
            ) : (
              filteredProfiles.map((profile) => (
                <div
                  key={profile.address}
                  className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-600 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{profile.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{profile.title}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleStartChat(profile)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="hidden md:inline">{t.dashboard.chat}</span>
                    </button>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">{profile.bio}</p>

                  {profile.skills && profile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {profile.address.slice(0, 6)}...{profile.address.slice(-4)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* My Profile Sidebar */}
      <div className="space-y-6">
        {myProfile && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">{t.dashboard.myProfile}</h3>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {myProfile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold">{myProfile.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{myProfile.title}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                {myProfile.userType === "freelancer" ? (
                  <>
                    <User className="w-4 h-4 text-purple-600" />
                    <span>{t.dashboard.freelancer}</span>
                  </>
                ) : (
                  <>
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>{t.dashboard.client}</span>
                  </>
                )}
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300">{myProfile.bio}</p>

              {myProfile.skills && myProfile.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {myProfile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">🔒 100% P2P</h3>
          <p className="text-sm text-purple-100">
            {t.dashboard.p2pInfo}
          </p>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && selectedProfile && (
        <ChatBox
          profile={selectedProfile}
          onClose={() => {
            setShowChat(false);
            setSelectedProfile(null);
          }}
        />
      )}
    </div>
  );
}
