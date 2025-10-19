"use client";

import { useState, useEffect, useRef } from "react";
import { useWeb3 } from "./providers/Web3Provider";
import { useP2P } from "./providers/P2PProvider";
import { X, Send } from "lucide-react";

interface Profile {
  name: string;
  title: string;
  address: string;
}

interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  timestamp: number;
}

interface ChatBoxProps {
  profile: Profile;
  onClose: () => void;
}

export function ChatBox({ profile, onClose }: ChatBoxProps) {
  const { address } = useWeb3();
  const { gun } = useP2P();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Create chat room ID (sorted addresses to ensure same ID for both users)
  const chatId = [address, profile.address].sort().join("_");

  // Load messages
  useEffect(() => {
    if (!gun) return;

    gun.get('vynryx').get('chats').get(chatId).map().on((msg: Message, id: string) => {
      if (msg && msg.text) {
        setMessages(prev => {
          const exists = prev.find(m => m.id === id);
          if (exists) return prev;
          return [...prev, { ...msg, id }].sort((a, b) => a.timestamp - b.timestamp);
        });
      }
    });
  }, [gun, chatId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !gun || !address) return;

    const message: Message = {
      id: Date.now().toString(),
      from: address,
      to: profile.address,
      text: newMessage.trim(),
      timestamp: Date.now(),
    };

    // Send to Gun.js
    gun.get('vynryx').get('chats').get(chatId).set(message);

    setNewMessage("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold">{profile.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{profile.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <p>Start a conversation! Send your first message.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === address ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.from === address
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  <p className="break-words">{msg.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.from === address
                        ? "text-purple-100"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
