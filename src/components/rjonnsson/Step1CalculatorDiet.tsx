'use client';

import React from 'react';
import {
  ActivityLevel,
  DietGoal,
  Gender,
  NutritionalTargets,
} from '@/types/diet';
import { ACTIVITY_MULTIPLIERS } from '@/lib/calculations';
import { ArrowRight, Flame, Scale, Sparkles } from 'lucide-react';

interface Step1Props {
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
  mealsCount: number;
  setMealsCount: (count: number) => void;
  targets: NutritionalTargets;
  onNext: () => void;
}

export default function Step1CalculatorDiet({
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
  mealsCount,
  setMealsCount,
  targets,
  onNext,
}: Step1Props) {
  return (
    <div className="p-5 sm:p-6 space-y-6 bg-white flex-1 animate-fade-in">
      {/* Cabeçalho da Etapa 1 */}
      <div>
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0066ff] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
          ETAPA 1 DE 3 • DIAGNÓSTICO & DIETA
        </span>
        <h2 className="text-xl font-black text-[#0d2246] mt-2 tracking-tight">
          Calculadora de Metabolismo & Dieta
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Informe seus dados corporais para calcularmos sua taxa metabólica e calibrar a dieta na balança.
        </p>
      </div>

      {/* 1. Sexo */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Sexo Biológico
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setGender('masculino')}
            className={`py-3 rounded-xl text-xs font-black border transition-all cursor-pointer ${
              gender === 'masculino'
                ? 'bg-[#0d2246] text-white border-[#0d2246] shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            Homem
          </button>
          <button
            type="button"
            onClick={() => setGender('feminino')}
            className={`py-3 rounded-xl text-xs font-black border transition-all cursor-pointer ${
              gender === 'feminino'
                ? 'bg-[#0d2246] text-white border-[#0d2246] shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            Mulher
          </button>
        </div>
      </div>

      {/* 2. Idade, Peso e Altura */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Idade
          </label>
          <input
            type="number"
            min="15"
            max="90"
            value={age}
            onChange={(e) => setAge(Math.max(10, Number(e.target.value)))}
            className="app-clean-input text-center text-sm font-bold"
          />
          <span className="text-[10px] text-slate-400 block text-center">anos</span>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Peso Atual
          </label>
          <input
            type="number"
            min="40"
            max="250"
            step="0.5"
            value={weight}
            onChange={(e) => setWeight(Math.max(30, Number(e.target.value)))}
            className="app-clean-input text-center text-sm font-bold"
          />
          <span className="text-[10px] text-slate-400 block text-center">kg</span>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Altura
          </label>
          <input
            type="number"
            min="120"
            max="220"
            value={height}
            onChange={(e) => setHeight(Math.max(100, Number(e.target.value)))}
            className="app-clean-input text-center text-sm font-bold"
          />
          <span className="text-[10px] text-slate-400 block text-center">cm</span>
        </div>
      </div>

      {/* 3. Nível de Atividade */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Nível de Atividade Semanal
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(ACTIVITY_MULTIPLIERS) as ActivityLevel[]).slice(0, 4).map((actKey) => {
            const act = ACTIVITY_MULTIPLIERS[actKey];
            const isSelected = activityLevel === actKey;
            return (
              <button
                key={actKey}
                type="button"
                onClick={() => setActivityLevel(actKey)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0d2246] text-white border-[#0d2246] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                <span className="text-xs font-bold block">{act.label}</span>
                <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`}>
                  fator ×{act.factor}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Quantidade de Refeições Desejada */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Quantas Refeições Você Prefere Fazer no Dia?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { count: 3, desc: 'Jejum (Almoço, Lanche, Jantar)' },
            { count: 4, desc: 'Padrão Atleta (Café, Almoço, Lanche, Jantar)' },
            { count: 5, desc: 'Fracionada (Com lanches intermediários)' },
          ].map((item) => (
            <button
              key={item.count}
              type="button"
              onClick={() => setMealsCount(item.count)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                mealsCount === item.count
                  ? 'bg-[#0d2246] text-white border-[#0d2246] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
              }`}
            >
              <span className="text-xs font-black block">{item.count} Refeições</span>
              <span className={`text-[9px] block mt-0.5 ${mealsCount === item.count ? 'text-slate-300' : 'text-slate-400'}`}>
                {item.count === 3 ? 'Jejum Interm.' : item.count === 4 ? 'Ideal Atleta' : 'Fracionada'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Objetivo / Estratégia de Queima de Verão */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Estratégia Calórica de Verão
        </label>
        <div className="space-y-2">
          {/* Déficit Agressivo -700 kcal */}
          <button
            type="button"
            onClick={() => setGoal('emagrecimento_verao_agressivo')}
            className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              goal === 'emagrecimento_verao_agressivo'
                ? 'bg-[#0d2246] text-white border-[#0d2246] shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black">🔥 Déficit Agressivo de Verão (-700 kcal)</span>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500 text-[#04120a]">
                  RECOMENDADO
                </span>
              </div>
              <p className={`text-[11px] mt-0.5 ${goal === 'emagrecimento_verao_agressivo' ? 'text-slate-300' : 'text-slate-500'}`}>
                Queima acelerada com proteína alta (2.2g/kg) para preservar músculos.
              </p>
            </div>
            <span className="text-sm font-mono font-bold text-emerald-400 ml-2">-700</span>
          </button>

          {/* Déficit Moderado -500 kcal */}
          <button
            type="button"
            onClick={() => setGoal('emagrecimento_moderado')}
            className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              goal === 'emagrecimento_moderado'
                ? 'bg-[#0d2246] text-white border-[#0d2246] shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            <div>
              <span className="text-xs font-bold">⚡ Déficit Moderado (-500 kcal)</span>
              <p className={`text-[11px] mt-0.5 ${goal === 'emagrecimento_moderado' ? 'text-slate-300' : 'text-slate-500'}`}>
                Perda constante tradicional em ritmo mais lento.
              </p>
            </div>
            <span className="text-sm font-mono font-bold text-slate-400 ml-2">-500</span>
          </button>
        </div>
      </div>

      {/* Mini-Card com Resultado do Cálculo em Tempo Real */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
            SUA META CALCULADA:
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-[#0d2246]">{targets.targetCalories}</span>
            <span className="text-xs font-bold text-slate-500">kcal / dia</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block">
            TMB: {targets.tmb} kcal • Água: {(targets.waterMl / 1000).toFixed(1)}L
          </span>
        </div>

        <div className="text-right">
          <span className="text-xs font-black text-[#0066ff] block">{targets.proteinGrams}g Prot</span>
          <span className="text-[10px] text-slate-500 block">{targets.carbsGrams}g Carbo</span>
          <span className="text-[10px] text-slate-500 block">{targets.fatsGrams}g Gord</span>
        </div>
      </div>

      {/* Botão de Ação Primário: PULA PARA A DIETA PRONTA */}
      <button
        type="button"
        onClick={onNext}
        className="w-full app-btn-navy py-4 text-sm font-black shadow-lg"
      >
        <span>GERAR MINHA DIETA DE VERÃO</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
