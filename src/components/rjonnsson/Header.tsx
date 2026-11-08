'use client';

import React from 'react';
import { Flame, Download, Check, Sparkles } from 'lucide-react';

interface HeaderProps {
  onExportPdf: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const STEPS = [
  { id: 'metabolism', step: 1, label: 'Metabolismo & TMB', short: '1. Metabolismo' },
  { id: 'diet', step: 2, label: 'Dieta de Verão', short: '2. Dieta' },
  { id: 'workout', step: 3, label: 'Treino (Academia/Casa)', short: '3. Treino' },
  { id: 'summary', step: 4, label: 'Painel & PDF', short: '4. Painel' },
];

export default function Header({ onExportPdf, activeTab, setActiveTab }: HeaderProps) {
  const currentStepIndex = STEPS.findIndex((s) => s.id === activeTab);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#232f48] bg-[#0d1322] shadow-md">
      {/* Top Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-[#04120a]">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-white tracking-tight">
                RJONNSSON<span className="text-emerald-400">FIT</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                PROJETO VERÃO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden xs:block">
              Calculadora de TMB • Gerador de Dieta • Treino Sob Medida
            </p>
          </div>
        </div>

        {/* Action Button: Baixar PDF */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExportPdf}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#04120a] font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Baixar PDF Oficial</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>

      {/* Stepper Navigation Bar (Progresso Cristalino) */}
      <div className="border-t border-[#1b253b] bg-[#0a0e17]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5">
          <nav className="grid grid-cols-4 gap-2">
            {STEPS.map((s, idx) => {
              const isActive = activeTab === s.id;
              const isPassed = currentStepIndex > idx;

              return (
                <button
                  key={s.id}
                  onClick={() => setActiveTab(s.id)}
                  className={`flex items-center justify-center gap-2 py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-[#04120a] border-emerald-400 shadow-md shadow-emerald-500/20'
                      : isPassed
                      ? 'bg-[#141b2d] text-emerald-400 border-[#232f48] hover:border-emerald-500/50'
                      : 'bg-[#101624] text-slate-400 border-[#1a2336] hover:bg-[#141b2d] hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isActive
                        ? 'bg-[#04120a] text-emerald-400'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-[#1f293d] text-slate-400'
                    }`}
                  >
                    {isPassed ? <Check className="w-3 h-3" /> : s.step}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.short}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
