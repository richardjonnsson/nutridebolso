'use client';

import React, { useState, useEffect } from 'react';
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
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface WorkoutScreenProps {
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
  onNext: () => void;
}

export default function WorkoutScreen({
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
  onNext,
}: WorkoutScreenProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  // Cronômetro
  const [restSeconds, setRestSeconds] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft]);

  const handleStartTimer = (seconds: number) => {
    setRestSeconds(seconds);
    setTimeLeft(seconds);
    setIsTimerRunning(true);
  };

  const toggleExerciseCheck = (exId: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [exId]: !prev[exId],
    }));
  };

  const activeDay = workoutPlan.days[selectedDayIndex] || workoutPlan.days[0];

  return (
    <div className="p-5 space-y-6 bg-white flex-1">
      {/* Título da Tela */}
      <div>
        <h2 className="text-lg font-black text-[#0d2246] tracking-tight">
          Montador de Treino ({location === 'academia' ? 'Academia' : 'Em Casa'})
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Ficha de treino focada na queima de gordura para o verão.
        </p>
      </div>

      {/* 1. Escolha de Local: Academia vs Em Casa (Segmented Control grande estilo imagem) */}
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
            className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
            className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
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

      {/* 2. Filtros Rápidos (Nível, Dias, Duração) */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Nível</label>
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
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Dias/Sem</label>
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
                {freq}x
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Duração</label>
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
                {dur}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Cronômetro de Descanso Embutido */}
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg font-mono border ${
              timeLeft <= 5 && isTimerRunning
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-[#0d2246] text-white'
            }`}
          >
            {timeLeft}s
          </div>
          <div>
            <span className="text-xs font-bold text-[#0d2246] block flex items-center gap-1">
              <Timer className="w-3.5 h-3.5 text-[#0066ff]" /> Descanso entre Séries
            </span>
            <span className="text-[10px] text-slate-400">
              {isTimerRunning ? 'Cronometrando...' : 'Selecione o intervalo:'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {[30, 45, 60].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStartTimer(s)}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold font-mono border ${
                restSeconds === s && isTimerRunning
                  ? 'bg-[#0d2246] text-white border-[#0d2246]'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              {s}s
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-1.5 rounded-lg bg-[#0066ff] text-white"
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsTimerRunning(false);
              setTimeLeft(restSeconds);
            }}
            className="p-1.5 rounded-lg bg-slate-200 text-slate-600"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Abas dos Dias de Treino */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {workoutPlan.days.map((day, idx) => (
          <button
            key={day.id}
            type="button"
            onClick={() => setSelectedDayIndex(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex-shrink-0 ${
              selectedDayIndex === idx
                ? 'bg-[#0d2246] text-white border-[#0d2246] shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            {day.dayLabel}
          </button>
        ))}
      </div>

      {/* 5. Lista de Exercícios do Dia (estilo extrato da imagem) */}
      <div className="app-white-card divide-y divide-slate-100">
        <div className="p-3 bg-slate-50/70 rounded-t-2xl">
          <span className="text-[10px] font-bold uppercase text-[#0066ff] block">{activeDay.dayLabel}</span>
          <h3 className="text-xs font-black text-[#0d2246]">{activeDay.title}</h3>
        </div>

        {activeDay.exercises.map((ex) => {
          const isDone = !!completedExercises[ex.id];
          return (
            <div key={ex.id} className="p-3 flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <button
                  type="button"
                  onClick={() => toggleExerciseCheck(ex.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-500 cursor-pointer"
                >
                  <CheckCircle
                    className={`w-5 h-5 ${isDone ? 'text-emerald-500 fill-emerald-100' : 'text-slate-300'}`}
                  />
                </button>
                <div>
                  <span className={`text-xs font-bold block ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {ex.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{ex.notes}</span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-xs font-black text-[#0d2246] font-mono block">
                  {ex.sets} × {ex.reps}
                </span>
                <span className="text-[10px] text-slate-400 block">{ex.rest} rest</span>
              </div>
            </div>
          );
        })}

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

      {/* Botão de Ação Primário na base */}
      <button
        type="button"
        onClick={onNext}
        className="w-full app-btn-navy py-3.5 text-sm font-black"
      >
        <span>IR PARA O PAINEL & PDF</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
