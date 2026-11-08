'use client';

import React from 'react';
import {
  ActivityLevel,
  DietGoal,
  Gender,
  NutritionalTargets,
} from '@/types/diet';
import { ACTIVITY_MULTIPLIERS, GOAL_DETAILS } from '@/lib/calculations';
import {
  Flame,
  Droplets,
  Scale,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  User,
  HeartPulse,
  Activity,
  Target,
} from 'lucide-react';

interface MetabolismTabProps {
  gender: Gender;
  setGender: (g: Gender) => void;
  age: number;
  setAge: (a: number) => void;
  weight: number;
  setWeight: (w: number) => void;
  height: number;
  setHeight: (h: number) => void;
  activityLevel: ActivityLevel;
  setActivityLevel: (a: ActivityLevel) => void;
  goal: DietGoal;
  setGoal: (g: DietGoal) => void;
  targets: NutritionalTargets;
  onNext: () => void;
}

export default function MetabolismTab({
  gender,
  setGender,
  age,
  setAge,
  weight,
  setWeight,
  height,
  setHeight,
  activityLevel,
  setActivityLevel,
  goal,
  setGoal,
  targets,
  onNext,
}: MetabolismTabProps) {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Título da Seção */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <HeartPulse className="w-3.5 h-3.5" /> PASSO 1 DE 4
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Calculadora de Taxa Metabólica & Déficit de Verão
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Insira seus dados para calcular seu gasto calórico real e definir a estratégia exata para queimar gordura.
        </p>
      </div>

      {/* BLOCO 1: FORMULÁRIO DE ENTRADA (Claro, Espaçoso e com Alto Contraste) */}
      <div className="fitness-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-[#232f48]">
          <User className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">1. Seus Dados Corporais</h2>
        </div>

        {/* Linha 1: Sexo, Idade, Peso, Altura */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Sexo */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Sexo Biológico
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('masculino')}
                className={`py-3 rounded-xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer ${
                  gender === 'masculino'
                    ? 'bg-emerald-500 text-[#04120a] border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-[#0d1322] text-slate-300 border-[#232f48] hover:border-slate-500'
                }`}
              >
                Homem
              </button>
              <button
                type="button"
                onClick={() => setGender('feminino')}
                className={`py-3 rounded-xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer ${
                  gender === 'feminino'
                    ? 'bg-emerald-500 text-[#04120a] border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-[#0d1322] text-slate-300 border-[#232f48] hover:border-slate-500'
                }`}
              >
                Mulher
              </button>
            </div>
          </div>

          {/* Idade */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Idade (anos)
            </label>
            <div className="relative">
              <input
                type="number"
                min="15"
                max="90"
                value={age}
                onChange={(e) => setAge(Math.max(10, Number(e.target.value)))}
                className="w-full fitness-input text-base text-center"
              />
            </div>
          </div>

          {/* Peso */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Peso Atual (kg)
            </label>
            <div className="relative">
              <input
                type="number"
                min="40"
                max="250"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(Math.max(30, Number(e.target.value)))}
                className="w-full fitness-input text-base text-center"
              />
            </div>
          </div>

          {/* Altura */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Altura (cm)
            </label>
            <div className="relative">
              <input
                type="number"
                min="120"
                max="220"
                value={height}
                onChange={(e) => setHeight(Math.max(100, Number(e.target.value)))}
                className="w-full fitness-input text-base text-center"
              />
            </div>
          </div>
        </div>

        {/* Linha 2: Nível de Atividade */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Nível de Atividade Física (Frequência Semanal)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {(Object.keys(ACTIVITY_MULTIPLIERS) as ActivityLevel[]).map((actKey) => {
              const act = ACTIVITY_MULTIPLIERS[actKey];
              const isSelected = activityLevel === actKey;
              return (
                <button
                  key={actKey}
                  type="button"
                  onClick={() => setActivityLevel(actKey)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-md shadow-emerald-500/10'
                      : 'bg-[#0d1322] border-[#232f48] text-slate-400 hover:text-white hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs block text-white">{act.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    fator ×{act.factor}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Linha 3: Estratégia de Déficit Calórico */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Estratégia de Queima de Gordura
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Opção Recomendada: Déficit Agressivo -700 kcal */}
            <button
              type="button"
              onClick={() => setGoal('emagrecimento_verao_agressivo')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                goal === 'emagrecimento_verao_agressivo'
                  ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-[#0d1322] border-[#232f48] text-slate-400 hover:text-white hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-black text-sm text-white">🔥 Déficit Agressivo (-700 kcal)</span>
                <span className="text-[9px] font-black px-2 py-0.5 rounded bg-emerald-500 text-[#04120a]">
                  PROJETO VERÃO
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Máxima queima de gordura para o verão mantendo proteína alta para não perder músculos.
              </p>
            </button>

            {/* Opção 2: Moderado -500 kcal */}
            <button
              type="button"
              onClick={() => setGoal('emagrecimento_moderado')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                goal === 'emagrecimento_moderado'
                  ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-[#0d1322] border-[#232f48] text-slate-400 hover:text-white hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-black text-sm text-white">⚡ Déficit Moderado (-500 kcal)</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-200">
                  PADRÃO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Perda de gordura tradicional, mais lenta e com rotina equilibrada.
              </p>
            </button>

            {/* Opção 3: Recomposição ou Hipertrofia */}
            <button
              type="button"
              onClick={() => setGoal('recomposicao')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                goal === 'recomposicao'
                  ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-[#0d1322] border-[#232f48] text-slate-400 hover:text-white hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-black text-sm text-white">⚖️ Recomposição (0 kcal)</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-200">
                  MANUTENÇÃO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Consumo igual ao gasto para trocar gordura localizada por massa magra.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* BLOCO 2: SEUS RESULTADOS METABÓLICOS (Cards Coloridos e Muito Legíveis) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">2. Seu Diagnóstico Metabólico</h2>
          </div>
          <span className="text-xs text-slate-400">Calculado para {weight} kg • {gender}</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: TMB Basal */}
          <div className="fitness-card p-5 border-l-4 border-l-indigo-500 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">
              TMB Basal
            </span>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {targets.tmb} <span className="text-xs font-normal text-slate-400">kcal</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">Gasto mínimo do seu corpo em repouso</p>
          </div>

          {/* Card 2: Gasto Total TDEE */}
          <div className="fitness-card p-5 border-l-4 border-l-amber-500 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
              Gasto Total (TDEE)
            </span>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {targets.get} <span className="text-xs font-normal text-slate-400">kcal</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">Calorias que você queima por dia</p>
          </div>

          {/* Card 3: Meta Diária com Déficit (DESTAQUE MÁXIMO) */}
          <div className="fitness-card-highlight p-5 border-l-4 border-l-emerald-400 bg-[#122325] text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 block">
                Meta para Secar
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500 text-[#04120a]">
                {targets.calorieDiff} kcal
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-300">
              {targets.targetCalories} <span className="text-xs font-normal text-emerald-400/80">kcal</span>
            </p>
            <p className="text-xs text-emerald-300/80 mt-1">Consumo diário para queimar gordura</p>
          </div>

          {/* Card 4: Meta de Água */}
          <div className="fitness-card p-5 border-l-4 border-l-cyan-400 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-1">
              Meta de Água
            </span>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {(targets.waterMl / 1000).toFixed(1)} <span className="text-xs font-normal text-slate-400">Litros</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">~{Math.round(targets.waterMl / 500)} garrafas de 500ml</p>
          </div>
        </div>
      </div>

      {/* BLOCO 3: METAS DE MACRONUTRIENTES */}
      <div className="fitness-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#232f48]">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">3. Divisão de Macronutrientes por Dia</h2>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-fit">
            Proteína Alta: 2.2g / kg para proteger músculos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Proteínas */}
          <div className="p-4 rounded-xl bg-[#0d1322] border-2 border-emerald-500/30 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
              Proteínas Diárias
            </span>
            <p className="text-3xl font-black text-white mt-1">
              {targets.proteinGrams} <span className="text-sm font-normal text-slate-400">gramas</span>
            </p>
            <p className="text-xs text-slate-400 mt-2">
              {targets.proteinCalories} kcal ({targets.proteinPercent}% da dieta)
            </p>
          </div>

          {/* Carboidratos */}
          <div className="p-4 rounded-xl bg-[#0d1322] border-2 border-cyan-500/30 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
              Carboidratos Estratégicos
            </span>
            <p className="text-3xl font-black text-white mt-1">
              {targets.carbsGrams} <span className="text-sm font-normal text-slate-400">gramas</span>
            </p>
            <p className="text-xs text-slate-400 mt-2">
              {targets.carbsCalories} kcal ({targets.carbsPercent}% da dieta)
            </p>
          </div>

          {/* Gorduras */}
          <div className="p-4 rounded-xl bg-[#0d1322] border-2 border-amber-500/30 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              Gorduras Boas (Hormônios)
            </span>
            <p className="text-3xl font-black text-white mt-1">
              {targets.fatsGrams} <span className="text-sm font-normal text-slate-400">gramas</span>
            </p>
            <p className="text-xs text-slate-400 mt-2">
              {targets.fatsCalories} kcal ({targets.fatsPercent}% da dieta)
            </p>
          </div>
        </div>

        {/* Botão de Avanço Grande */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={onNext}
            className="w-full sm:w-auto fitness-btn-primary text-base font-black px-8 py-4 shadow-xl"
          >
            <span>Ver Cardápio da Dieta de Verão</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
