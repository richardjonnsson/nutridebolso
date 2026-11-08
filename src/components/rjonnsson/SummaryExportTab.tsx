'use client';

import React, { useState } from 'react';
import { DayOption, NutritionalTargets, WorkoutPlan } from '@/types/diet';
import {
  Download,
  CheckCircle2,
  Trophy,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SummaryExportTabProps {
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

export default function SummaryExportTab({
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
}: SummaryExportTabProps) {
  const [habits, setHabits] = useState<{ id: string; label: string; done: boolean }[]>([
    { id: 'h-1', label: `Ingerir ${(targets.waterMl / 1000).toFixed(1)}L de água ao longo do dia`, done: false },
    { id: 'h-2', label: `Atingir ${targets.proteinGrams}g de proteína na balança para proteger os músculos`, done: false },
    { id: 'h-3', label: `Manter a meta de ${targets.targetCalories} kcal (déficit de ${Math.abs(targets.calorieDiff)} kcal)`, done: false },
    { id: 'h-4', label: `Concluir o treino (${workoutPlan.location === 'academia' ? 'Academia' : 'Em Casa'})`, done: false },
    { id: 'h-5', label: 'Fazer o finalizador de cárdio / caminhar 8.000+ passos', done: false },
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
          colors: ['#10b981', '#06b6d4', '#f59e0b'],
        });
      }
      return updated;
    });
  };

  const completedCount = habits.filter((h) => h.done).length;
  const progressPercent = Math.round((completedCount / habits.length) * 100);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Título da Seção */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <Trophy className="w-3.5 h-3.5" /> PASSO 4 DE 4
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Painel de Hábitos & Exportação do Plano
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Confira o resumo geral do seu plano RJonnssonFit e faça o download do documento oficial em PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lado Esquerdo: Resumo do Aluno */}
        <div className="lg:col-span-7 space-y-6">
          <div className="fitness-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[#232f48]">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Resumo do Aluno</h2>
            </div>

            {/* Perfil */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-[#0d1322] border border-[#232f48]">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Perfil</span>
                <span className="text-sm font-black text-white mt-0.5 block">
                  {gender === 'masculino' ? 'Homem' : 'Mulher'}, {age}a
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0d1322] border border-[#232f48]">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Peso & Altura</span>
                <span className="text-sm font-black text-white mt-0.5 block">
                  {weight} kg • {height} cm
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0d1322] border border-[#232f48]">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Treino</span>
                <span className="text-sm font-black text-emerald-400 mt-0.5 block">
                  {workoutPlan.location === 'academia' ? 'Academia' : 'Em Casa'} ({workoutPlan.frequency}x)
                </span>
              </div>
            </div>

            {/* 4 Métricas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-[#0d1322] border border-[#232f48]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">TMB Basal</span>
                <span className="text-xl font-black text-white block mt-0.5">{targets.tmb}</span>
                <span className="text-[10px] text-slate-500 block">kcal</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0d1322] border border-[#232f48]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Gasto Total</span>
                <span className="text-xl font-black text-white block mt-0.5">{targets.get}</span>
                <span className="text-[10px] text-slate-500 block">kcal</span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/20 border-2 border-emerald-400 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Meta Calorias</span>
                <span className="text-xl font-black text-emerald-300 block mt-0.5">{targets.targetCalories}</span>
                <span className="text-[10px] text-emerald-400/80 font-bold block">{targets.calorieDiff} kcal</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0d1322] border border-[#232f48]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Meta Água</span>
                <span className="text-xl font-black text-white block mt-0.5">{(targets.waterMl / 1000).toFixed(1)}L</span>
                <span className="text-[10px] text-slate-500 block">por dia</span>
              </div>
            </div>

            {/* Macros */}
            <div className="p-4 rounded-xl bg-[#0d1322] border border-[#232f48] space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Macronutrientes da Dieta:</span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-[#141b2d] border border-emerald-500/40">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Proteína</span>
                  <span className="text-base font-black text-white block">{targets.proteinGrams}g</span>
                  <span className="text-[9px] text-slate-400 block">({targets.proteinPercent}%)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#141b2d] border border-cyan-500/40">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block">Carboidrato</span>
                  <span className="text-base font-black text-white block">{targets.carbsGrams}g</span>
                  <span className="text-[9px] text-slate-400 block">({targets.carbsPercent}%)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#141b2d] border border-amber-500/40">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">Gorduras</span>
                  <span className="text-base font-black text-white block">{targets.fatsGrams}g</span>
                  <span className="text-[9px] text-slate-400 block">({targets.fatsPercent}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Download PDF & Checklist */}
        <div className="lg:col-span-5 space-y-6">
          {/* Caixa de Download Oficial */}
          <div className="fitness-card-highlight p-6 sm:p-8 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-[#04120a] mx-auto flex items-center justify-center font-black">
              <Download className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-white">Baixar Ficha & Dieta em PDF</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Gere o documento oficial completo formatado com o diagnóstico metabólico, as refeições pesadas na balança e a ficha de treino.
            </p>

            <button
              onClick={onExportPdf}
              className="w-full fitness-btn-primary text-base font-black py-4 shadow-xl cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Baixar Meu PDF Oficial</span>
            </button>
          </div>

          {/* Checklist Diário */}
          <div className="fitness-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#232f48]">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Checklist Diário do Projeto Verão
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Marque seus hábitos cumpridos no dia:</p>
              </div>
              <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded">
                {completedCount}/{habits.length}
              </span>
            </div>

            {/* Barra de Progresso */}
            <div className="w-full h-2 rounded-full bg-[#0d1322] border border-[#232f48] overflow-hidden">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-emerald-500 transition-all duration-300"
              />
            </div>

            {/* Itens */}
            <div className="space-y-2.5 pt-1">
              {habits.map((habit) => (
                <button
                  key={habit.id}
                  type="button"
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-full text-left p-3.5 rounded-xl border-2 text-xs transition-all flex items-start gap-3 cursor-pointer ${
                    habit.done
                      ? 'bg-[#0d1e1c] border-emerald-500/50 text-emerald-300 line-through'
                      : 'bg-[#0d1322] border-[#232f48] text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      habit.done ? 'text-emerald-400 fill-emerald-500/20' : 'text-slate-600'
                    }`}
                  />
                  <span className="leading-relaxed font-semibold">{habit.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
