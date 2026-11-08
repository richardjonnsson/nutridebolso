'use client';

import React, { useState } from 'react';
import { DayOption, NutritionalTargets, WorkoutPlan } from '@/types/diet';
import {
  Download,
  CheckCircle2,
  Trophy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SummaryScreenProps {
  gender: string;
  age: number;
  weight: number;
  height: number;
  activityLevel: string;
  goalTitle: string;
  targets: NutritionalTargets;
  dietOption: DayOption;
  workoutPlan: WorkoutPlan;
  onExportPdf: () => void;
}

export default function SummaryScreen({
  gender,
  age,
  weight,
  height,
  activityLevel,
  goalTitle,
  targets,
  dietOption,
  workoutPlan,
  onExportPdf,
}: SummaryScreenProps) {
  const [habits, setHabits] = useState<{ id: string; label: string; done: boolean }[]>([
    { id: 'h-1', label: `Beber ${(targets.waterMl / 1000).toFixed(1)}L de água hoje`, done: false },
    { id: 'h-2', label: `Bater ${targets.proteinGrams}g de proteína na balança`, done: false },
    { id: 'h-3', label: `Ficar dentro de ${targets.targetCalories} kcal (déficit de ${Math.abs(targets.calorieDiff)} kcal)`, done: false },
    { id: 'h-4', label: `Fazer treino (${workoutPlan.location === 'academia' ? 'Academia' : 'Em Casa'})`, done: false },
    { id: 'h-5', label: 'Caminhada / Cárdio queimador de verão', done: false },
  ]);

  const toggleHabit = (id: string) => {
    setHabits((prev) => {
      const updated = prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h));
      const allDone = updated.every((h) => h.done);
      if (allDone) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0d2246', '#0066ff', '#10b981'],
        });
      }
      return updated;
    });
  };

  const completedCount = habits.filter((h) => h.done).length;

  return (
    <div className="p-5 space-y-6 bg-white flex-1">
      {/* Título da Tela */}
      <div>
        <h2 className="text-lg font-black text-[#0d2246] tracking-tight">
          Painel de Hábitos & Exportação
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Acompanhe seu progresso e baixe seu plano oficial completo.
        </p>
      </div>

      {/* Resumo do Perfil (Card estilo imagem de referência) */}
      <div className="app-white-card p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-extrabold text-[#0d2246]">Extrato de Metas RJonnssonFit</span>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
            ATIVO
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Perfil</span>
            <span className="font-bold text-slate-800">{gender === 'masculino' ? 'Homem' : 'Mulher'}, {age} anos</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block">Peso & Altura</span>
            <span className="font-bold text-slate-800">{weight} kg • {height} cm</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block">TMB / Gasto Total</span>
            <span className="font-bold text-slate-800">{targets.tmb} / {targets.get} kcal</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block">Treino Principal</span>
            <span className="font-bold text-[#0066ff]">{workoutPlan.location === 'academia' ? 'Academia' : 'Em Casa'} ({workoutPlan.frequency}x)</span>
          </div>
        </div>
      </div>

      {/* Checklist de Hábitos Diários */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Checklist Diário do Projeto Verão
          </span>
          <span className="text-xs font-bold text-[#0066ff]">{completedCount}/5 feitos</span>
        </div>

        <div className="app-white-card divide-y divide-slate-100">
          {habits.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => toggleHabit(h.id)}
              className="w-full p-3.5 flex items-center justify-between text-left transition-colors hover:bg-slate-50 cursor-pointer"
            >
              <span className={`text-xs font-semibold ${h.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                {h.label}
              </span>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  h.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                }`}
              >
                {h.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Botão de Download do PDF Oficial (Estilo botão azul marinho grande) */}
      <button
        type="button"
        onClick={onExportPdf}
        className="w-full app-btn-navy py-4 text-sm font-black shadow-lg"
      >
        <Download className="w-5 h-5" />
        <span>BAIXAR MEU PDF OFICIAL</span>
      </button>
    </div>
  );
}
