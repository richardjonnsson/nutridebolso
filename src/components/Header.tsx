'use client';

import React from 'react';
import { UtensilsCrossed, Sparkles, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset?: () => void;
  showReset?: boolean;
}

export function Header({ onReset, showReset }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Logo / App Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950">
            <UtensilsCrossed className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                NutriGenius
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                APP
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Dieta & Calorias na Medida</p>
          </div>
        </div>

        {/* Botão de Novo Cálculo no topo */}
        {showReset && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-full transition active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-emerald-400" />
            <span>Início</span>
          </button>
        )}
      </div>
    </header>
  );
}
