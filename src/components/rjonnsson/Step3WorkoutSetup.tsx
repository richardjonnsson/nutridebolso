'use client';

import React, { useState } from 'react';
import {
  WorkoutLocation,
  WorkoutLevel,
  WorkoutFrequency,
  WorkoutDuration,
  WorkoutFocus,
  WorkoutPlan,
} from '@/types/diet';
import {
  Building2,
  Home,
  CheckCircle,
  Flame,
  ArrowRight,
  ArrowLeft,
  Download,
} from 'lucide-react';

interface Step3Props {
  location: WorkoutLocation;
  setLocation: (loc: WorkoutLocation) => void;
  level: WorkoutLevel;
  setLevel: (lvl: WorkoutLevel) => void;
  frequency: WorkoutFrequency;
  setFrequency: (freq: WorkoutFrequency) => void;
  duration: WorkoutDuration;
  setDuration: (dur: WorkoutDuration) => void;
  focus: WorkoutFocus;
  setFocus: (f: WorkoutFocus) => void;
  workoutPlan: WorkoutPlan;
  onFinish: () => void;
  onBack: () => void;
}

export default function Step3WorkoutSetup({
  location,
  setLocation,
  level,
  setLevel,
  frequency,
  setFrequency,
  duration,
  setDuration,
  focus,
  setFocus,
  workoutPlan,
  onFinish,
  onBack,
}: Step3Props) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const activeDay = workoutPlan.days[selectedDayIndex] || workoutPlan.days[0];

  return (
    <div className="p-5 sm:p-6 space-y-6 bg-white flex-1 animate-fade-in">
      {/* Topo da Etapa 3 */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
            ETAPA 3 DE 3 • SEU TREINO PERSONALIZADO
          </span>
          <button
            onClick={onBack}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar para Dieta
          </button>
        </div>

        <h2 className="text-xl font-black text-[#0d2246] mt-2 tracking-tight">
          Personalização do Seu Treino
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Escolha seu local de treino e disponibilidade semanal para gerarmos a ficha ideal.
        </p>
      </div>

      {/* 1. Onde você vai treinar? (Academia ou Casa) */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Onde você vai treinar?
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setLocation('academia');
              setSelectedDayIndex(0);
            }}
            className={`py-3.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              location === 'academia'
                ? 'bg-[#0d2246] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Na Academia</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLocation('casa');
              setSelectedDayIndex(0);
            }}
            className={`py-3.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              location === 'casa'
                ? 'bg-[#0d2246] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Em Casa (HIIT)</span>
          </button>
        </div>
      </div>

      {/* 2. Filtros de Nível, Dias e Duração */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Seu Nível</label>
          <div className="flex bg-slate-100 p-0.5 rounded-lg">
            {(['iniciante', 'intermediario', 'avancado'] as WorkoutLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevel(lvl)}
                className={`flex-1 py-1 text-[10px] font-bold rounded capitalize ${
                  level === lvl ? 'bg-[#0d2246] text-white' : 'text-slate-600'
                }`}
              >
                {lvl === 'intermediario' ? 'Int' : lvl.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Frequência</label>
          <div className="flex bg-slate-100 p-0.5 rounded-lg">
            {([3, 4, 5] as WorkoutFrequency[]).map((freq) => (
              <button
                key={freq}
                type="button"
                onClick={() => {
                  setFrequency(freq);
                  setSelectedDayIndex(0);
                }}
                className={`flex-1 py-1 text-[10px] font-bold rounded ${
                  frequency === freq ? 'bg-[#0d2246] text-white' : 'text-slate-600'
                }`}
              >
                {freq}x / sem
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Tempo/Sessão</label>
          <div className="flex bg-slate-100 p-0.5 rounded-lg">
            {([30, 45, 60] as WorkoutDuration[]).map((dur) => (
              <button
                key={dur}
                type="button"
                onClick={() => setDuration(dur)}
                className={`flex-1 py-1 text-[10px] font-bold rounded ${
                  duration === dur ? 'bg-[#0d2246] text-white' : 'text-slate-600'
                }`}
              >
                {dur} min
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Seleção de Dias do Treino Gerado */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Divisão da Sua Ficha ({workoutPlan.days.length} Dias na Semana)
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {workoutPlan.days.map((day, idx) => (
            <button
              key={day.id}
              type="button"
              onClick={() => setSelectedDayIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex-shrink-0 ${
                selectedDayIndex === idx
                  ? 'bg-[#0d2246] text-white border-[#0d2246] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              {day.dayLabel}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Exercícios do Dia Selecionado */}
      <div className="app-white-card divide-y divide-slate-100">
        <div className="p-3 bg-slate-50/70 rounded-t-2xl">
          <span className="text-[10px] font-bold uppercase text-[#0066ff] block">{activeDay.dayLabel}</span>
          <h3 className="text-xs font-black text-[#0d2246]">{activeDay.title}</h3>
        </div>

        {activeDay.exercises.map((ex) => (
          <div key={ex.id} className="p-3 flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">{ex.name}</span>
                <span className="text-[10px] text-slate-400 block">{ex.notes}</span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-xs font-black text-[#0d2246] font-mono block">
                {ex.sets} × {ex.reps}
              </span>
              <span className="text-[10px] text-slate-400 block">{ex.rest} descanso</span>
            </div>
          </div>
        ))}

        {/* Queimador Finalizador de Verão */}
        <div className="p-3 bg-blue-50/50 rounded-b-2xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#0d2246] flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" /> {activeDay.cardioFinisher.title}
            </span>
            <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
              {activeDay.cardioFinisher.caloriesBurnEst}
            </span>
          </div>
          <p className="text-[11px] text-slate-600">{activeDay.cardioFinisher.protocol}</p>
        </div>
      </div>

      {/* Botão Final: GERA O PDF E FINALIZA */}
      <button
        type="button"
        onClick={onFinish}
        className="w-full app-btn-navy py-4 text-sm font-black shadow-lg"
      >
        <Download className="w-5 h-5 text-emerald-400" />
        <span>FINALIZAR & BAIXAR PROTOCOLO EM PDF</span>
      </button>
    </div>
  );
}
