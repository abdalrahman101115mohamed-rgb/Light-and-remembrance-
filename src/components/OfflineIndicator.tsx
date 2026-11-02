import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 flex items-center justify-between gap-3 rounded-2xl bg-amber-600/95 text-amber-50 px-4 py-2.5 shadow-2xl backdrop-blur-md border border-amber-400/30 text-xs sm:text-sm animate-bounce">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-200 shrink-0" />
        <span className="font-medium">العمل بدون إنترنت — جميع الأذكار والقرآن والمواقيت تعمل محلياً</span>
      </div>
      <span className="inline-block w-2 h-2 rounded-full bg-amber-300 animate-ping" />
    </div>
  );
};
