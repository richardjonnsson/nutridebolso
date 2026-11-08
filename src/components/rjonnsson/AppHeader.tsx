'use client';

import React from 'react';
import { User, Flame, ArrowLeft } from 'lucide-react';
import { NutritionalTargets } from '@/types/diet';

interface AppHeaderProps {
  currentStep: number;
  targets: NutritionalTargets;
  weight: number;
  gender: string;
  onBack?: () => void;
}

export default function AppHeader({
  currentStep,
  targets,
  weight,
  gender,
  onBack,
}: AppHeaderProps) {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const stepLabels = [
    '1. Dados & Dieta',
    '2. Dieta Pronta',
    '3. Seu Treino',
    'Concluído',
  ];

  return (
    <div className="app-header-navy px-5 pt-3 pb-5 rounded-b-[28px] shadow-lg relative">
      {/* 1. Status Bar do Smartphone */}
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 pb-2 tracking-wider">
        <span>{timeString}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]">5G</span>
          <div className="w-5 h-2.5 border border-white/60 rounded-[3px] p-[1px] flex items-center">
            <div className="w-full h-full bg-white rounded-[1.5px]" />
          </div>
        </div>
      </div>

      {/* 2. Top Bar */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          {onBack && currentStep > 1 && (
            <button
              onClick={onBack}
              className="p-1 -ml-1 text-slate-300 hover:text-white cursor-pointer"
              title="Voltar"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white">
            <Flame className="w-4 h-4 fill-emerald-400 text-emerald-400" />
          </div>
          <span className="font-extrabold text-base text-white tracking-tight">
            RJONNSSON<span className="text-emerald-400">FIT</span>
          </span>
        </div>

        {/* Indicador do Passo */}
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-white">
          {currentStep <= 3 ? `Passo ${currentStep} de 3` : 'Pronto!'}
        </span>
      </div>

      {/* 3. Card Branco de "SALDO CALÓRICO" idêntico ao layout.avif */}
      <div className="w-full bg-white rounded-2xl p-4 shadow-md text-slate-900 border border-slate-100 flex items-center justify-between">
        <div className="text-left">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            META CALÓRICA DIÁRIA
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-[#0d2246] tracking-tight">
              {targets.targetCalories}
            </span>
            <span className="text-xs font-bold text-slate-500">kcal</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">
            🔥 Déficit Verão: {targets.calorieDiff} kcal
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            ÁGUA DIÁRIA
          </span>
          <span className="text-lg font-black text-[#0066ff] block mt-0.5">
            {(targets.waterMl / 1000).toFixed(1)}L
          </span>
          <span className="text-[10px] text-slate-400">
            TMB: {targets.tmb} kcal
          </span>
        </div>
      </div>
    </div>
  );
}
