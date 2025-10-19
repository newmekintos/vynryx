"use client";

import { useP2P } from "./providers/P2PProvider";
import { Wifi, WifiOff, Users } from "lucide-react";

export function NetworkStatus() {
  const { isOnline, peers } = useP2P();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-400 font-medium">Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-red-700 dark:text-red-400 font-medium">Offline</span>
          </>
        )}
      </div>
      
      <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
        <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        <span className="text-gray-700 dark:text-gray-300">
          <span className="font-semibold text-purple-600 dark:text-purple-400">{peers}</span> peers
        </span>
      </div>
    </div>
  );
}
