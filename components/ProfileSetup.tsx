"use client";

import { useState } from "react";
import { useAuth } from "./providers/AuthProvider";
import { useP2P } from "./providers/P2PProvider";
import { User, Briefcase, Tag, FileText } from "lucide-react";

interface ProfileSetupProps {
  onComplete: () => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const { user } = useAuth();
  const { data, sendProfile } = useP2P();
  const address = user?.vynryxAddress;
  
  const [userType, setUserType] = useState<"freelancer" | "client" | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    skills: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userType || !address) return;

    // Create profile
    const profile = {
      ...formData,
      userType,
      address,
      skills: formData.skills.split(",").map(s => s.trim()),
      createdAt: Date.now(),
    };

    // Broadcast to P2P network
    sendProfile(profile);
    
    // Save to localStorage
    localStorage.setItem('vynryx_profile', JSON.stringify(profile));
    
    onComplete();
  };

  if (!userType) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Choose Your Role</h2>
          <p className="text-gray-600 dark:text-gray-400">
            How would you like to use VYNRYX?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => setUserType("freelancer")}
            className="p-8 bg-white dark:bg-gray-800 rounded-xl border-2 border-transparent hover:border-purple-600 transition-all group"
          >
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <User className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">I'm a Freelancer</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Offer your skills and find clients directly through P2P network
            </p>
          </button>

          <button
            onClick={() => setUserType("client")}
            className="p-8 bg-white dark:bg-gray-800 rounded-xl border-2 border-transparent hover:border-blue-600 transition-all group"
          >
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">I'm a Client</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Find talented freelancers and hire them directly on the network
            </p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {userType === "freelancer" ? "Freelancer" : "Client"} Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your profile to start connecting with peers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Your Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Briefcase className="w-4 h-4 inline mr-2" />
              {userType === "freelancer" ? "Professional Title" : "Company/Role"}
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder={userType === "freelancer" ? "Full Stack Developer" : "Tech Startup Founder"}
            />
          </div>

          {userType === "freelancer" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Skills (comma separated)
              </label>
              <input
                type="text"
                required
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="React, Node.js, Web3, Smart Contracts"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Bio
            </label>
            <textarea
              required
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setUserType(null)}
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
