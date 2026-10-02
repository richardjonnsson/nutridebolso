'use client';

import React, { useState } from 'react';
import { DietPlanResponse } from '@/types/diet';
import { MacroCards } from './MacroCards';
import { MealPlanCard } from './MealPlanCard';
import { generateDietPdf } from '@/lib/pdfGenerator';
import { ACTIVITY_MULTIPLIERS, GOAL_DETAILS } from '@/lib/calculations';
import confetti from 'canvas-confetti';
import {
  Download,
  RotateCcw,
  CheckCircle2,
  FileDown,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

interface DietResultsProps {
  data: DietPlanResponse;
  onReset: () => void;
}

export function DietResults({ data, onReset }: DietResultsProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const { userInput, targets, options, recommendations, source } = data;

  const handleDownloadPdf = () => {
    try {
      setIsGeneratingPdf(true);
      generateDietPdf(data);
      setPdfSuccess(true);

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.7 },
      });

      setTimeout(() => {
        setPdfSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Houve uma falha ao gerar o arquivo PDF. Tente novamente.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const sexLabel = userInput.gender === 'masculino' ? 'Homem' : 'Mulher';
  const activityLabel = ACTIVITY_MULTIPLIERS[userInput.activityLevel]?.label || userInput.activityLevel;
  const goalLabel = GOAL_DETAILS[userInput.goal]?.label || userInput.goal;

  return (
    <div className="w-full space-y-4 pb-28 animate-fadeIn">
      {/* Resumo do Usuário (Estilo Cartão de Perfil Mobile) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
            Plano Personalizado
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-100">
            {sexLabel}, {userInput.age} anos ({userInput.weight}kg, {userInput.height}cm)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Meta: <strong className="text-slate-200">{goalLabel}</strong>
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {source === 'gemini' ? 'Gemini AI' : 'Nutri Engine'}
          </span>
        </div>
      </div>

      {/* 1. Metas do Dia */}
      <section className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Suas Metas Diárias
        </h3>
        <MacroCards targets={targets} userInput={userInput} />
      </section>

      {/* 2. As 3 Opções de Cardápios */}
      <section className="space-y-2 pt-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          3 Opções de Cardápios Diários
        </h3>
        <MealPlanCard options={options} />
      </section>

      {/* 3. Dicas Práticas */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-2.5">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Orientações Nutricionais Importantes
          </h4>
          <div className="space-y-2 text-xs text-slate-300">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span className="text-[11px] leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BARRA FIXA INFERIOR (STICKY BOTTOM BAR) PARA BAIXAR PDF */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/90 py-3.5 px-4 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="py-3.5 px-4 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Editar</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {pdfSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>PDF Baixado!</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Baixar Dieta em PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
