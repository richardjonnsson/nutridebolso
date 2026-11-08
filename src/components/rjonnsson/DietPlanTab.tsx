'use client';

import React, { useState } from 'react';
import { DayOption, NutritionalTargets } from '@/types/diet';
import { SUMMER_SUBSTITUTIONS } from '@/lib/summerDietGenerator';
import {
  Utensils,
  Clock,
  ArrowRight,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Flame,
  Info,
} from 'lucide-react';

interface DietPlanTabProps {
  targets: NutritionalTargets;
  options: DayOption[];
  mealsCount: number;
  setMealsCount: (count: number) => void;
  onNext: () => void;
}

export default function DietPlanTab({
  targets,
  options,
  mealsCount,
  setMealsCount,
  onNext,
}: DietPlanTabProps) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [showSubstitutions, setShowSubstitutions] = useState(false);
  const [selectedSubGroup, setSelectedSubGroup] = useState<'Proteínas' | 'Carboidratos' | 'Gorduras Boas'>('Proteínas');

  const activeOption = options[selectedOptionIndex] || options[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Título da Seção */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <Utensils className="w-3.5 h-3.5" /> PASSO 2 DE 4
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Cardápio de Verão com Gramaturas na Balança
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Alimentos limpos com peso exato para bater sua meta de{' '}
          <strong className="text-emerald-400">{targets.targetCalories} kcal</strong> e queimar gordura com segurança.
        </p>
      </div>

      {/* Barra de Configuração do Cardápio (Contraste Alto) */}
      <div className="fitness-card p-5 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Quantidade de Refeições */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Quantas Refeições Você Faz no Dia?
          </label>
          <div className="flex gap-2">
            {[3, 4, 5].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setMealsCount(count)}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer ${
                  mealsCount === count
                    ? 'bg-emerald-500 text-[#04120a] border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-[#0d1322] text-slate-300 border-[#232f48] hover:border-slate-500'
                }`}
              >
                {count} Refeições {count === 3 ? '(Jejum)' : count === 4 ? '(Padrão Atleta)' : '(Fracionada)'}
              </button>
            ))}
          </div>
        </div>

        {/* Variação do Cardápio */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Variação de Cardápio:
          </label>
          <div className="flex gap-2">
            {options.map((opt, idx) => (
              <button
                key={opt.optionNumber}
                type="button"
                onClick={() => setSelectedOptionIndex(idx)}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer ${
                  selectedOptionIndex === idx
                    ? 'bg-emerald-500 text-[#04120a] border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-[#0d1322] text-slate-300 border-[#232f48] hover:border-slate-500'
                }`}
              >
                Opção {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Destaque da Opção + Botão de Substituições */}
      <div className="fitness-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-emerald-400">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
            Cardápio Selecionado
          </span>
          <h2 className="text-xl font-extrabold text-white mt-0.5">{activeOption.title}</h2>
          <p className="text-xs text-slate-400 mt-1">{activeOption.tagline}</p>
        </div>

        <button
          type="button"
          onClick={() => setShowSubstitutions(!showSubstitutions)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0d1322] text-emerald-400 border border-emerald-500/40 hover:bg-[#162035] text-xs font-bold transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Ver Tabela de Substituições</span>
          {showSubstitutions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Tabela de Substituições Equivalentes Expansível */}
      {showSubstitutions && (
        <div className="fitness-card p-6 space-y-4 border-2 border-emerald-500/40 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#232f48]">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                Guia de Substituição de Alimentos na Balança
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Troque qualquer alimento sem alterar as calorias do plano.
              </p>
            </div>

            <div className="flex gap-1.5 bg-[#0d1322] p-1 rounded-xl border border-[#232f48]">
              {(['Proteínas', 'Carboidratos', 'Gorduras Boas'] as const).map((grp) => (
                <button
                  key={grp}
                  type="button"
                  onClick={() => setSelectedSubGroup(grp)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedSubGroup === grp
                      ? 'bg-emerald-500 text-[#04120a]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUMMER_SUBSTITUTIONS.filter((s) => s.group === selectedSubGroup).map((sub, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#0d1322] border border-[#232f48] space-y-3">
                <div className="text-xs font-extrabold text-emerald-400 pb-2 border-b border-[#232f48]">
                  Alimento Base: {sub.baseFood}
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Equivalentes com Mesmos Macros:
                  </span>
                  <ul className="space-y-1.5">
                    {sub.equivalents.map((eq, eqIdx) => (
                      <li key={eqIdx} className="text-xs text-slate-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{eq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid das Refeições em Cards Bem Definidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeOption.meals.map((meal, mealIdx) => (
          <div
            key={meal.id}
            className="fitness-card p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-all space-y-4"
          >
            <div>
              {/* Header da Refeição */}
              <div className="flex items-center justify-between pb-3 border-b border-[#232f48]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-[#04120a] flex items-center justify-center font-black text-sm">
                    {mealIdx + 1}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">{meal.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Horário Sugerido: {meal.timeSuggestion}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-emerald-400 block">
                    {meal.totalCalories} kcal
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    P: {meal.totalProtein}g | C: {meal.totalCarbs}g | G: {meal.totalFats}g
                  </span>
                </div>
              </div>

              {/* Lista de Alimentos com visual de Caixa Individual */}
              <div className="space-y-2.5 pt-3">
                {meal.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="p-3.5 rounded-xl bg-[#0d1322] border border-[#232f48] space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-white">{item.name}</span>
                      <span className="text-xs font-black font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex-shrink-0">
                        {item.portion}
                      </span>
                    </div>
                    {item.tip && (
                      <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                        <span className="text-amber-400">💡</span> {item.tip}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dicas de Saciedade */}
      <div className="fitness-card p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-emerald-400" /> Dicas de Saciedade para o Déficit de 700 kcal
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#0d1322] border border-[#232f48]">
            <h4 className="font-bold text-white mb-1">🥗 Vegetais Verdes Livres</h4>
            <p className="text-slate-400 leading-relaxed">
              Alface, rúcula, pepino e tomate cereja não precisam ser pesados. Consuma à vontade para encher o prato e gerar saciedade mecânica.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#0d1322] border border-[#232f48]">
            <h4 className="font-bold text-white mb-1">💧 500ml de Água Pré-Almoço</h4>
            <p className="text-slate-400 leading-relaxed">
              Beba 500ml de água 15 a 20 minutos antes das refeições principais. Isso reduz a fome imediata em até 13%.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#0d1322] border border-[#232f48]">
            <h4 className="font-bold text-white mb-1">☕ Café e Chá Verde</h4>
            <p className="text-slate-400 leading-relaxed">
              Cafeína e EGCG do chá verde agem como moderadores naturais do apetite no meio da tarde sem acrescentar calorias.
            </p>
          </div>
        </div>

        {/* Botão para Avançar para Treino */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={onNext}
            className="w-full sm:w-auto fitness-btn-primary text-base font-black px-8 py-4 shadow-xl"
          >
            <span>Montar Minha Ficha de Treino</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
