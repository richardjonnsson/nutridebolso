'use client';

import React, { useState } from 'react';
import { DayOption, NutritionalTargets } from '@/types/diet';
import { SUMMER_SUBSTITUTIONS } from '@/lib/summerDietGenerator';
import {
  Utensils,
  Clock,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Coffee,
  Apple,
  Moon,
  Flame,
} from 'lucide-react';

interface DietScreenProps {
  targets: NutritionalTargets;
  options: DayOption[];
  mealsCount: number;
  setMealsCount: (count: number) => void;
  onNext: () => void;
}

export default function DietScreen({
  targets,
  options,
  mealsCount,
  setMealsCount,
  onNext,
}: DietScreenProps) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [showSubstitutions, setShowSubstitutions] = useState(false);
  const [selectedSubGroup, setSelectedSubGroup] = useState<'Proteínas' | 'Carboidratos' | 'Gorduras Boas'>('Proteínas');

  const activeOption = options[selectedOptionIndex] || options[0];

  // Cores circulares por refeição (idêntico à tela 8 da imagem)
  const mealIcons = [
    { icon: Coffee, bg: 'bg-amber-500' },
    { icon: Utensils, bg: 'bg-[#0066ff]' },
    { icon: Apple, bg: 'bg-emerald-500' },
    { icon: Moon, bg: 'bg-[#0d2246]' },
  ];

  return (
    <div className="p-5 space-y-6 bg-white flex-1">
      {/* Título da Tela */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-[#0d2246] tracking-tight">
            Dieta de Verão ({targets.targetCalories} kcal)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Refeições balanceadas com peso exato na balança de cozinha.
          </p>
        </div>
      </div>

      {/* Controles de Refeição (Segmented Control estilo tela 6 da imagem) */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Número de Refeições
        </label>
        <div className="flex p-1 bg-slate-100 rounded-xl">
          {[3, 4, 5].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setMealsCount(count)}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                mealsCount === count
                  ? 'bg-[#0d2246] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {count} {count === 3 ? '(Jejum)' : count === 4 ? '(Atleta)' : '(5x)'}
            </button>
          ))}
        </div>
      </div>

      {/* Variação de Cardápio */}
      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Variação Ativa:</span>
          <span className="text-xs font-bold text-slate-800">{activeOption.title}</span>
        </div>

        <div className="flex gap-1.5">
          {options.map((opt, idx) => (
            <button
              key={opt.optionNumber}
              type="button"
              onClick={() => setSelectedOptionIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                selectedOptionIndex === idx
                  ? 'bg-[#0d2246] text-white border-[#0d2246]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
              }`}
            >
              Opção {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Botão de Tabela de Substituições */}
      <button
        type="button"
        onClick={() => setShowSubstitutions(!showSubstitutions)}
        className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-[#0d2246] flex items-center justify-between transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-[#0066ff]" />
          <span>Tabela de Substituições Diretas de Alimentos</span>
        </div>
        {showSubstitutions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Painel Expansível de Substituições */}
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

          <div className="space-y-3 pt-1">
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

      {/* Lista de Refeições no Estilo Círculos Coloridos da Imagem */}
      <div className="space-y-3">
        {activeOption.meals.map((meal, mealIdx) => {
          const styleConfig = mealIcons[mealIdx % mealIcons.length];
          const IconComponent = styleConfig.icon;

          return (
            <div key={meal.id} className="app-white-card p-4 space-y-3">
              {/* Header da Refeição com ícone circular colorido */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${styleConfig.bg} text-white flex items-center justify-center shadow-sm`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0d2246]">{meal.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{meal.timeSuggestion}</span>
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

      {/* Botão de Ação Primário na base */}
      <button
        type="button"
        onClick={onNext}
        className="w-full app-btn-navy py-3.5 text-sm font-black"
      >
        <span>MONTAR MEU TREINO</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
