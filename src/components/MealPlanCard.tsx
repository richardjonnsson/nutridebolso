'use client';

import React, { useState } from 'react';
import { DayOption, Meal } from '@/types/diet';
import {
  Clock,
  Coffee,
  Sun,
  Sunset,
  Moon,
  Utensils,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';

interface MealPlanCardProps {
  options: [DayOption, DayOption, DayOption];
}

const MEAL_ICONS: Record<string, { icon: string; time: string }> = {
  'Café da Manhã': { icon: '☕', time: '07:30' },
  'Almoço': { icon: '🥗', time: '12:30' },
  'Almoço Completo': { icon: '🥗', time: '12:30' },
  'Almoço Tradicional': { icon: '🥗', time: '12:30' },
  'Lanche da Tarde': { icon: '🍎', time: '16:30' },
  'Jantar': { icon: '🍲', time: '20:00' },
  'Jantar Leve': { icon: '🍲', time: '20:00' },
};

export function MealPlanCard({ options }: MealPlanCardProps) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const currentOption = options[selectedOptionIndex];

  return (
    <div className="space-y-3">
      {/* Segmented Control Pills (Estilo iOS / Android) */}
      <div className="bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-1 shadow-md">
        {options.map((opt, idx) => {
          const isSelected = selectedOptionIndex === idx;
          return (
            <button
              key={opt.optionNumber}
              type="button"
              onClick={() => setSelectedOptionIndex(idx)}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Opção {opt.optionNumber}</span>
              <span className={`text-[9px] ${isSelected ? 'text-slate-900/80' : 'text-slate-500'}`}>
                {idx === 0 ? 'Clássica' : idx === 1 ? 'Econômica' : 'Rápida'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Descrição resumida da Opção */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between gap-2">
        <p className="text-xs text-slate-300 italic">
          "{currentOption.tagline}"
        </p>
        <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-lg shrink-0">
          ~{currentOption.totalCalories} kcal
        </span>
      </div>

      {/* Lista Vertical de Refeições (Timeline do Dia) */}
      <div className="space-y-3">
        {currentOption.meals.map((meal: Meal, mealIdx: number) => {
          const config = MEAL_ICONS[meal.name] || { icon: '🍽️', time: meal.timeSuggestion };

          return (
            <div
              key={meal.id || mealIdx}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg space-y-3"
            >
              {/* Topo da Refeição */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{config.icon}</span>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-100">
                      {meal.name}
                    </h5>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-slate-500" />
                      {meal.timeSuggestion || config.time}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400 block">
                    ~{meal.totalCalories} kcal
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    P: {meal.totalProtein}g | C: {meal.totalCarbs}g
                  </span>
                </div>
              </div>

              {/* Lista de Alimentos do Card */}
              <div className="space-y-2">
                {meal.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/70"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">
                            {item.name}
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-300 block mt-0.5">
                            {item.portion}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {item.calories} kcal
                      </span>
                    </div>

                    {item.tip && (
                      <div className="mt-1.5 pt-1 border-t border-slate-800/50 text-[10px] text-slate-400 flex items-center gap-1 italic">
                        <Lightbulb className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                        <span>{item.tip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
