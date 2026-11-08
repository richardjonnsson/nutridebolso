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
  Dumbbell,
  Home,
  Building2,
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Flame,
  ArrowRight,
  Info,
} from 'lucide-react';

interface WorkoutPlanTabProps {
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

export default function WorkoutPlanTab({
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
}: WorkoutPlanTabProps) {
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
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Título da Seção */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <Dumbbell className="w-3.5 h-3.5" /> PASSO 3 DE 4
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Montador de Treino Personalizado
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Escolha onde vai treinar e sua frequência semanal. Ficha completa com séries, repetições, descanso e cárdio acelerador.
        </p>
      </div>

      {/* BLOCO 1: ESCOLHA DE LOCAL (ACADEMIA OU CASA) - GRANDE DESTAQUE */}
      <div className="fitness-card p-6 sm:p-8 space-y-6">
        <div className="pb-2 border-b border-[#232f48]">
          <h2 className="text-lg font-bold text-white">1. Onde você vai treinar?</h2>
          <p className="text-xs text-slate-400 mt-0.5">Selecione seu ambiente de treino principal:</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Opção Academia */}
          <button
            type="button"
            onClick={() => {
              setLocation('academia');
              setSelectedDayIndex(0);
            }}
            className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-4 ${
              location === 'academia'
                ? 'bg-[#15272a] border-emerald-400 text-white shadow-xl shadow-emerald-500/20'
                : 'bg-[#0d1322] border-[#232f48] text-slate-400 hover:border-slate-500 hover:text-white'
            }`}
          >
            <div
              className={`p-3 rounded-xl ${
                location === 'academia' ? 'bg-emerald-500 text-[#04120a]' : 'bg-[#1f293d] text-slate-300'
              }`}
            >
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <span className="font-black text-base sm:text-lg block text-white">
                🏢 Treino em Academia Completa
              </span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Aparelhos, halteres, barras e cárdio em esteira inclinada ou escada para máxima hipertrofia e queima.
              </p>
            </div>
          </button>

          {/* Opção Casa */}
          <button
            type="button"
            onClick={() => {
              setLocation('casa');
              setSelectedDayIndex(0);
            }}
            className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-4 ${
              location === 'casa'
                ? 'bg-[#15272a] border-emerald-400 text-white shadow-xl shadow-emerald-500/20'
                : 'bg-[#0d1322] border-[#232f48] text-slate-400 hover:border-slate-500 hover:text-white'
            }`}
          >
            <div
              className={`p-3 rounded-xl ${
                location === 'casa' ? 'bg-emerald-500 text-[#04120a]' : 'bg-[#1f293d] text-slate-300'
              }`}
            >
              <Home className="w-7 h-7" />
            </div>
            <div>
              <span className="font-black text-base sm:text-lg block text-white">
                🏠 Treino em Casa (Calistenia & HIIT)
              </span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Sem desculpas e sem precisar de aparelhos. Exercícios com o peso do corpo e circuitos metabólicos de queima rápida.
              </p>
            </div>
          </button>
        </div>

        {/* Linha de Filtros: Nível, Frequência e Duração */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Nível */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Seu Nível
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['iniciante', 'intermediario', 'avancado'] as WorkoutLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`py-2.5 rounded-xl text-xs font-extrabold capitalize border transition-all cursor-pointer ${
                    level === lvl
                      ? 'bg-emerald-500 text-[#04120a] border-emerald-400 shadow-md'
                      : 'bg-[#0d1322] text-slate-300 border-[#232f48] hover:border-slate-500'
                  }`}
                >
                  {lvl === 'intermediario' ? 'Interm.' : lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Frequência */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Dias por Semana
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([3, 4, 5] as WorkoutFrequency[]).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => {
                    setFrequency(freq);
                    setSelectedDayIndex(0);
                  }}
                  className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                    frequency === freq
                      ? 'bg-emerald-500 text-[#04120a] border-emerald-400 shadow-md'
                      : 'bg-[#0d1322] text-slate-300 border-[#232f48] hover:border-slate-500'
                  }`}
                >
                  {freq}x / sem
                </button>
              ))}
            </div>
          </div>

          {/* Duração */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Tempo por Treino
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([30, 45, 60] as WorkoutDuration[]).map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setDuration(dur)}
                  className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                    duration === dur
                      ? 'bg-emerald-500 text-[#04120a] border-emerald-400 shadow-md'
                      : 'bg-[#0d1322] text-slate-300 border-[#232f48] hover:border-slate-500'
                  }`}
                >
                  {dur} min
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BLOCO 2: CRONÔMETRO DE DESCANSO (SUPER ÚTIL NO CELULAR) */}
      <div className="fitness-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-l-cyan-400">
        <div className="flex items-center gap-3">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl font-mono border-2 ${
              timeLeft <= 5 && isTimerRunning
                ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                : 'bg-[#0d1322] border-[#232f48] text-emerald-400'
            }`}
          >
            {timeLeft}s
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-200">
              <Timer className="w-4 h-4 text-emerald-400" />
              <span>Cronômetro de Descanso entre Séries</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isTimerRunning ? 'Cronômetro ativo! Descanse e prepare a próxima série.' : 'Selecione o tempo desejado:'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[30, 45, 60, 90].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStartTimer(s)}
              className={`px-3 py-2 rounded-xl text-xs font-black font-mono border transition-all cursor-pointer ${
                restSeconds === s && isTimerRunning
                  ? 'bg-emerald-500 text-[#04120a] border-emerald-400'
                  : 'bg-[#0d1322] text-slate-300 border-[#232f48] hover:border-slate-500'
              }`}
            >
              {s}s
            </button>
          ))}

          <button
            type="button"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-2.5 rounded-xl bg-emerald-500 text-[#04120a] font-bold hover:bg-emerald-400 transition-all cursor-pointer"
            title={isTimerRunning ? 'Pausar' : 'Iniciar'}
          >
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsTimerRunning(false);
              setTimeLeft(restSeconds);
            }}
            className="p-2.5 rounded-xl bg-[#0d1322] border border-[#232f48] text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Resetar"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BLOCO 3: FICHA DE TREINO POR DIA */}
      <div className="fitness-card p-6 sm:p-8 space-y-6">
        {/* Abas dos Dias de Treino */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {workoutPlan.days.map((day, idx) => (
            <button
              key={day.id}
              type="button"
              onClick={() => setSelectedDayIndex(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer flex-shrink-0 ${
                selectedDayIndex === idx
                  ? 'bg-emerald-500 text-[#04120a] border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-[#0d1322] text-slate-300 border-[#232f48] hover:border-slate-500'
              }`}
            >
              {day.dayLabel}
            </button>
          ))}
        </div>

        {/* Título do Treino do Dia */}
        <div className="pb-3 border-b border-[#232f48] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
              {activeDay.dayLabel} • {location === 'academia' ? 'Academia' : 'Em Casa'}
            </span>
            <h3 className="text-xl font-extrabold text-white mt-0.5">{activeDay.title}</h3>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {activeDay.targetMuscles.map((m, idx) => (
              <span
                key={idx}
                className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-[#0d1322] border border-[#232f48] text-slate-300"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Lista de Exercícios */}
        <div className="space-y-3">
          {activeDay.exercises.map((ex) => {
            const isDone = !!completedExercises[ex.id];
            return (
              <div
                key={ex.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isDone
                    ? 'bg-[#0d1e1c] border-emerald-500/50 opacity-80'
                    : 'bg-[#0d1322] border-[#232f48] hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleExerciseCheck(ex.id)}
                      className="mt-0.5 cursor-pointer text-slate-500 hover:text-emerald-400"
                      title={isDone ? 'Desmarcar' : 'Marcar como concluído'}
                    >
                      <CheckCircle
                        className={`w-6 h-6 ${
                          isDone ? 'text-emerald-400 fill-emerald-500/20' : 'text-slate-600'
                        }`}
                      />
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-black text-base ${
                            isDone ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {ex.name}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#162035] text-slate-300">
                          {ex.muscle}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        <strong className="text-emerald-400 font-semibold">Técnica:</strong> {ex.notes}
                      </p>
                    </div>
                  </div>

                  {/* Séries e Repetições */}
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-black text-emerald-400 font-mono block">
                      {ex.sets} séries × {ex.reps}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                      Descanso: {ex.rest}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Queimador Finalizador de Verão */}
        <div className="p-5 rounded-xl bg-[#122325] border-2 border-emerald-500/40 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-emerald-400" />
              <h4 className="font-extrabold text-white text-base">
                Finalizador Queimador: {activeDay.cardioFinisher.title}
              </h4>
            </div>
            <span className="text-xs font-mono font-black text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded border border-emerald-500/40">
              Gasto Est.: {activeDay.cardioFinisher.caloriesBurnEst}
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            <strong className="text-white">Protocolo:</strong> {activeDay.cardioFinisher.protocol}
          </p>
          <p className="text-[11px] text-slate-400">
            Duração: <strong className="text-emerald-400">{activeDay.cardioFinisher.duration}</strong> ao término do treino de força para acelerar o déficit calórico de 700 kcal.
          </p>
        </div>

        {/* Botão de Avançar */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={onNext}
            className="w-full sm:w-auto fitness-btn-primary text-base font-black px-8 py-4 shadow-xl"
          >
            <span>Ir para o Painel Geral & PDF</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
