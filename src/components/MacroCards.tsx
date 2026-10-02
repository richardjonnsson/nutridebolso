'use client';

import React from 'react';
import { NutritionalTargets, UserDietInput } from '@/types/diet';
import { Flame, Droplet, Dumbbell, Zap, Activity } from 'lucide-react';

interface MacroCardsProps {
  targets: NutritionalTargets;
  userInput: UserDietInput;
}

export function MacroCards({ targets, userInput }: MacroCardsProps) {
  const goalBadge =
    targets.calorieDiff > 0
      ? { text: `Superávit (+${targets.calorieDiff} kcal)`, color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' }
      : targets.calorieDiff < 0
      ? { text: `Déficit (${targets.calorieDiff} kcal)`, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' }
      : { text: 'Calorias de Manutenção', color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' };

  return (
    <div className="space-y-3">
      {/* Card Principal da Meta Diária (Estilo Apple Fitness / Lifesum) */}
      <div className="bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            Meta Calórica Diária
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${goalBadge.color}`}>
            {goalBadge.text}
          </span>
        </div>

        <div className="flex items-baseline gap-2 my-1">
          <span className="text-4xl font-black font-mono text-emerald-300 tracking-tight">
            {targets.targetCalories}
          </span>
          <span className="text-xs font-bold text-slate-400">kcal/dia</span>
        </div>

        {/* Barra de Macronutrientes Visual */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1.5">
            <span>Divisão de Nutrientes</span>
            <span className="text-emerald-400 font-mono">100% equilibrado</span>
          </div>

          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
            <div
              style={{ width: `${targets.proteinPercent}%` }}
              className="bg-emerald-400 h-full"
              title={`Proteína: ${targets.proteinPercent}%`}
            />
            <div
              style={{ width: `${targets.carbsPercent}%` }}
              className="bg-cyan-400 h-full"
              title={`Carboidratos: ${targets.carbsPercent}%`}
            />
            <div
              style={{ width: `${targets.fatsPercent}%` }}
              className="bg-amber-400 h-full"
              title={`Gorduras: ${targets.fatsPercent}%`}
            />
          </div>
        </div>

        {/* 3 Pills dos Macros */}
        <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-800/80">
          {/* Proteína */}
          <div className="text-center p-2 rounded-xl bg-slate-950/60 border border-emerald-500/20">
            <span className="text-[10px] font-bold text-emerald-400 block uppercase">
              Proteína
            </span>
            <span className="text-base font-black font-mono text-slate-100 block">
              {targets.proteinGrams}g
            </span>
            <span className="text-[9px] text-slate-500 block">
              {(targets.proteinGrams / userInput.weight).toFixed(1)}g/kg
            </span>
          </div>

          {/* Carboidratos */}
          <div className="text-center p-2 rounded-xl bg-slate-950/60 border border-cyan-500/20">
            <span className="text-[10px] font-bold text-cyan-400 block uppercase">
              Carbos
            </span>
            <span className="text-base font-black font-mono text-slate-100 block">
              {targets.carbsGrams}g
            </span>
            <span className="text-[9px] text-slate-500 block">
              Controlados
            </span>
          </div>

          {/* Gorduras */}
          <div className="text-center p-2 rounded-xl bg-slate-950/60 border border-amber-500/20">
            <span className="text-[10px] font-bold text-amber-400 block uppercase">
              Gorduras
            </span>
            <span className="text-base font-black font-mono text-slate-100 block">
              {targets.fatsGrams}g
            </span>
            <span className="text-[9px] text-slate-500 block">
              Hormonal
            </span>
          </div>
        </div>
      </div>

      {/* Mini-Cards de Apoio: GET, TMB e Água */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-[10px] text-slate-400 font-bold block uppercase flex items-center justify-center gap-1">
            <Zap className="w-3 h-3 text-indigo-400" /> TMB
          </span>
          <span className="text-sm font-black font-mono text-slate-200 block mt-0.5">
            {targets.tmb}
          </span>
          <span className="text-[9px] text-slate-500">kcal repouso</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-[10px] text-slate-400 font-bold block uppercase flex items-center justify-center gap-1">
            <Activity className="w-3 h-3 text-teal-400" /> GET
          </span>
          <span className="text-sm font-black font-mono text-slate-200 block mt-0.5">
            {targets.get}
          </span>
          <span className="text-[9px] text-slate-500">kcal total/dia</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-[10px] text-slate-400 font-bold block uppercase flex items-center justify-center gap-1">
            <Droplet className="w-3 h-3 text-cyan-400" /> Água
          </span>
          <span className="text-sm font-black font-mono text-cyan-300 block mt-0.5">
            {(targets.waterMl / 1000).toFixed(1)}L
          </span>
          <span className="text-[9px] text-slate-500">ao longo do dia</span>
        </div>
      </div>
    </div>
  );
}
