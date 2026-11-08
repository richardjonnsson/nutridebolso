'use client';

import React from 'react';
import {
  ActivityLevel,
  DietGoal,
  Gender,
  NutritionalTargets,
} from '@/types/diet';
import { ACTIVITY_MULTIPLIERS, GOAL_DETAILS } from '@/lib/calculations';
import { ArrowRight, Flame, Scale, Droplets } from 'lucide-react';

interface MetabolismScreenProps {
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

export default function MetabolismScreen({
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
}: MetabolismScreenProps) {
  return (
    <div className="p-5 space-y-6 bg-white flex-1">
      {/* Título da Tela */}
      <div>
        <h2 className="text-lg font-black text-[#0d2246] tracking-tight">
          Calculadora de Metabolismo (TMB)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Preencha seus dados para calcular a taxa basal e seu déficit de verão.
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
            className={`py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
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
            className={`py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              gender === 'feminino'
                ? 'bg-[#0d2246] text-white border-[#0d2246] shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            Mulher
          </button>
        </div>
      </div>

      {/* 2. Idade, Peso e Altura (Inputs idênticos à imagem) */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Idade
          </label>
          <div className="relative">
            <input
              type="number"
              min="15"
              max="90"
              value={age}
              onChange={(e) => setAge(Math.max(10, Number(e.target.value)))}
              className="app-clean-input text-center text-sm font-bold"
            />
            <span className="text-[10px] text-slate-400 block text-center mt-0.5">anos</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Peso
          </label>
          <div className="relative">
            <input
              type="number"
              min="40"
              max="220"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(Math.max(30, Number(e.target.value)))}
              className="app-clean-input text-center text-sm font-bold"
            />
            <span className="text-[10px] text-slate-400 block text-center mt-0.5">kg</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Altura
          </label>
          <div className="relative">
            <input
              type="number"
              min="120"
              max="220"
              value={height}
              onChange={(e) => setHeight(Math.max(100, Number(e.target.value)))}
              className="app-clean-input text-center text-sm font-bold"
            />
            <span className="text-[10px] text-slate-400 block text-center mt-0.5">cm</span>
          </div>
        </div>
      </div>

      {/* 3. Nível de Atividade */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Nível de Atividade Diária
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

      {/* 4. Objetivo Calórico */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Estratégia de Queima de Gordura
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
                <span className="text-xs font-black">🔥 Déficit Agressivo (-700 kcal)</span>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500 text-[#04120a]">
                  VERÃO
                </span>
              </div>
              <p className={`text-[11px] mt-0.5 ${goal === 'emagrecimento_verao_agressivo' ? 'text-slate-300' : 'text-slate-500'}`}>
                Queima acelerada com alta proteína para não perder músculos.
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
                Perda de gordura tradicional com ritmo moderado.
              </p>
            </div>
            <span className="text-sm font-mono font-bold text-slate-400 ml-2">-500</span>
          </button>
        </div>
      </div>

      {/* 5. Lista de Macronutrientes (estilo lista de transações da tela 3 da imagem) */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Distribuição dos Macros Diários
        </span>

        <div className="app-white-card divide-y divide-slate-100">
          {/* Proteínas */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Proteínas (2.2g / kg)</span>
                <span className="text-[10px] text-slate-400">Protege a massa muscular</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-slate-900">{targets.proteinGrams}g</span>
              <span className="text-[10px] text-slate-400 block">{targets.proteinCalories} kcal</span>
            </div>
          </div>

          {/* Carboidratos */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-[#0066ff]" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Carboidratos</span>
                <span className="text-[10px] text-slate-400">Energia para o treino</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-slate-900">{targets.carbsGrams}g</span>
              <span className="text-[10px] text-slate-400 block">{targets.carbsCalories} kcal</span>
            </div>
          </div>

          {/* Gorduras */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Gorduras Boas</span>
                <span className="text-[10px] text-slate-400">Equilíbrio hormonal</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-slate-900">{targets.fatsGrams}g</span>
              <span className="text-[10px] text-slate-400 block">{targets.fatsCalories} kcal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botão de Ação Primário na base (como na tela 2 e 4 da imagem) */}
      <button
        type="button"
        onClick={onNext}
        className="w-full app-btn-navy py-3.5 text-sm font-black"
      >
        <span>VER CARDÁPIO DA DIETA</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
