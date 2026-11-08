'use client';

import React from 'react';
import { Activity, Utensils, Dumbbell, FileText } from 'lucide-react';

interface AppNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AppNavbar({ activeTab, setActiveTab }: AppNavbarProps) {
  const tabs = [
    { id: 'metabolism', label: 'TMB & Dados', icon: Activity },
    { id: 'diet', label: 'Dieta Verão', icon: Utensils },
    { id: 'workout', label: 'Treino', icon: Dumbbell },
    { id: 'summary', label: 'Painel & PDF', icon: FileText },
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2 px-3 flex items-center justify-around shadow-lg z-40">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-[#0d2246] font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div
              className={`p-1.5 rounded-full transition-all ${
                isActive ? 'bg-[#0d2246]/10 text-[#0d2246]' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black text-[#0d2246]' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
