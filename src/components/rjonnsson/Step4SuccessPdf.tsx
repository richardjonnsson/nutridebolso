'use client';

import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Step4Props {
  onDownloadAgain: () => void;
  onRestart: () => void;
  targetCalories: number;
  waterMl: number;
}

export default function Step4SuccessPdf({
  onDownloadAgain,
  onRestart,
  targetCalories,
  waterMl,
}: Step4Props) {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0d2246', '#0066ff', '#10b981'],
    });
  }, []);

  const [habits, setHabits] = useState([
    { id: 1, label: `Beber ${(waterMl / 1000).toFixed(1)}L de água hoje`, done: false },
    { id: 2, label: 'Pesar todas as refeições na balança', done: false },
    { id: 3, label: `Manter a meta de ${targetCalories} kcal (déficit de 700 kcal)`, done: false },
    { id: 4, label: 'Fazer o treino programado do dia', done: false },
    { id: 5, label: 'Concluir o finalizador de cárdio de verão', done: false },
  ]);

  const toggle = (id: number) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));
  };

  return (
    <div className="p-6 space-y-6 bg-white flex-1 animate-fade-in text-center">
      {/* Ícone de Sucesso */}
      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 mx-auto flex items-center justify-center">
        <CheckCircle className="w-8 h-8" />
      </div>

      <div>
        <h2 className="text-xl font-black text-[#0d2246] tracking-tight">
          Protocolo RJonnssonFit Gerado!
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          Seu download em PDF começou automaticamente com o diagnóstico metabólico, a dieta e a ficha de treino.
        </p>
      </div>

      {/* Botão de Download Novamente */}
      <button
        type="button"
        onClick={onDownloadAgain}
        className="w-full app-btn-navy py-4 text-sm font-black shadow-lg"
      >
        <Download className="w-5 h-5 text-emerald-400" />
        <span>BAIXAR PDF NOVAMENTE</span>
      </button>

      {/* Checklist Diário de Hábitos */}
      <div className="app-white-card p-4 space-y-3 text-left">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-[#0d2246] flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" /> Compromissos Diários do Verão
          </span>
          <span className="text-[10px] text-slate-400">
            {habits.filter((h) => h.done).length}/5 cumpridos
          </span>
        </div>

        <div className="space-y-2">
          {habits.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => toggle(h.id)}
              className="w-full p-2.5 rounded-lg border border-slate-100 flex items-center justify-between hover:bg-slate-50 text-left transition-colors cursor-pointer"
            >
              <span className={`text-xs ${h.done ? 'line-through text-slate-400' : 'text-slate-800 font-semibold'}`}>
                {h.label}
              </span>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  h.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                }`}
              >
                {h.done && <span className="text-[10px] font-black">✓</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Botão de Reiniciar / Editar */}
      <button
        type="button"
        onClick={onRestart}
        className="text-xs font-bold text-slate-500 hover:text-[#0d2246] inline-flex items-center gap-1.5 cursor-pointer py-2"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Ajustar ou Criar Novo Plano</span>
      </button>
    </div>
  );
}
