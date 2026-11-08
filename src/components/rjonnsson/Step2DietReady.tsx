'use client';

import React, { useState } from 'react';
import { DayOption, NutritionalTargets } from '@/types/diet';
import { SUMMER_SUBSTITUTIONS } from '@/lib/summerDietGenerator';
import {
  Utensils,
  Clock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Coffee,
  Apple,
  Moon,
  Flame,
} from 'lucide-react';

interface Step2Props {
  targets: NutritionalTargets;
  options: DayOption[];
  mealsCount: number;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2DietReady({
  targets,
  options,
  mealsCount,
  onNext,
  onBack,
}: Step2Props) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [showSubstitutions, setShowSubstitutions] = useState(false);
  const [selectedSubGroup, setSelectedSubGroup] = useState<'Proteínas' | 'Carboidratos' | 'Gorduras Boas'>('Proteínas');

  const activeOption = options[selectedOptionIndex] || options[0];

  const mealIcons = [
    { icon: Coffee, bg: 'bg-amber-500' },
    { icon: Utensils, bg: 'bg-[#0066ff]' },
    { icon: Apple, bg: 'bg-emerald-500' },
    { icon: Moon, bg: 'bg-[#0d2246]' },
  ];

  return (
    <div className="p-5 sm:p-6 space-y-6 bg-white flex-1 animate-fade-in">
      {/* Topo da Etapa 2 */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            ETAPA 2 DE 3 • SUA DIETA PRONTA
          </span>
          <button
            onClick={onBack}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Editar Dados
          </button>
        </div>

        <h2 className="text-xl font-black text-[#0d2246] mt-2 tracking-tight">
          Cardápio de Verão Calculado ({targets.targetCalories} kcal)
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Distribuído em {mealsCount} refeições com peso exato na balança de cozinha para garantir seu déficit calórico de {targets.calorieDiff} kcal.
        </p>
      </div>

      {/* Card de Resumo das Metas da Dieta */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-white rounded-xl border border-slate-100">
          <span className="text-[10px] font-bold uppercase text-emerald-600 block">Proteínas</span>
          <span className="text-sm font-black text-slate-900 block">{targets.proteinGrams}g</span>
          <span className="text-[9px] text-slate-400 block">{targets.proteinCalories} kcal</span>
        </div>

        <div className="p-2 bg-white rounded-xl border border-slate-100">
          <span className="text-[10px] font-bold uppercase text-[#0066ff] block">Carboidratos</span>
          <span className="text-sm font-black text-slate-900 block">{targets.carbsGrams}g</span>
          <span className="text-[9px] text-slate-400 block">{targets.carbsCalories} kcal</span>
        </div>

        <div className="p-2 bg-white rounded-xl border border-slate-100">
          <span className="text-[10px] font-bold uppercase text-amber-600 block">Gorduras</span>
          <span className="text-sm font-black text-slate-900 block">{targets.fatsGrams}g</span>
          <span className="text-[9px] text-slate-400 block">{targets.fatsCalories} kcal</span>
        </div>
      </div>

      {/* Variação de Cardápio */}
      <div className="flex items-center justify-between p-3 bg-slate-100/70 rounded-xl">
        <span className="text-xs font-bold text-slate-700">Alternar Variação:</span>
        <div className="flex gap-1.5">
          {options.map((opt, idx) => (
            <button
              key={opt.optionNumber}
              type="button"
              onClick={() => setSelectedOptionIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                selectedOptionIndex === idx
                  ? 'bg-[#0d2246] text-white border-[#0d2246]'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              Opção {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela de Substituições Expansível */}
      <button
        type="button"
        onClick={() => setShowSubstitutions(!showSubstitutions)}
        className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-[#0d2246] flex items-center justify-between transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-[#0066ff]" />
          <span>Tabela de Substituições Equivalentes</span>
        </div>
        {showSubstitutions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {showSubstitutions && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200">
            {(['Proteínas', 'Carboidratos', 'Gorduras Boas'] as const).map((grp) => (
              <button
                key={grp}
                type="button"
                onClick={() => setSelectedSubGroup(grp)}
                className={`flex-1 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  selectedSubGroup === grp
                    ? 'bg-[#0d2246] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {grp}
              </button>
            ))}
          </div>

          <div className="space-y-2.5 pt-1">
            {SUMMER_SUBSTITUTIONS.filter((s) => s.group === selectedSubGroup).map((sub, i) => (
              <div key={i} className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-[#0d2246] block border-b border-slate-100 pb-1">
                  Base: {sub.baseFood}
                </span>
                <ul className="space-y-1">
                  {sub.equivalents.map((eq, eqIdx) => (
                    <li key={eqIdx} className="text-slate-600 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{eq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista das Refeições do Aluno */}
      <div className="space-y-3">
        {activeOption.meals.map((meal, mealIdx) => {
          const styleConfig = mealIcons[mealIdx % mealIcons.length];
          const IconComponent = styleConfig.icon;

          return (
            <div key={meal.id} className="app-white-card p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${styleConfig.bg} text-white flex items-center justify-center shadow-sm`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0d2246]">{meal.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>Horário Sugerido: {meal.timeSuggestion}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-[#0d2246] block">{meal.totalCalories} kcal</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    P: {meal.totalProtein}g | C: {meal.totalCarbs}g | G: {meal.totalFats}g
                  </span>
                </div>
              </div>

              {/* Alimentos da Refeição */}
              <div className="space-y-2">
                {meal.items.map((item, itIdx) => (
                  <div
                    key={itIdx}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-2"
                  >
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-800 block">{item.name}</span>
                      {item.tip && (
                        <span className="text-[10px] text-slate-500 block">{item.tip}</span>
                      )}
                    </div>
                    <span className="text-xs font-bold font-mono text-[#0066ff] bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex-shrink-0">
                      {item.portion}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Botão de Avanço para o Treino */}
      <button
        type="button"
        onClick={onNext}
        className="w-full app-btn-navy py-4 text-sm font-black shadow-lg"
      >
        <span>AVANÇAR PARA MONTAR MEU TREINO</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
