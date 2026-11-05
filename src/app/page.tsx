'use client';

import React, { useState, useMemo } from 'react';
import { calculateNutritionalTargets, GOAL_DETAILS } from '@/lib/calculations';
import { generateSummerDietPlan, SUMMER_SUBSTITUTIONS } from '@/lib/summerDietGenerator';
import { generateWorkoutPlan } from '@/lib/workoutGenerator';
import { generateRJonnssonFitPdf } from '@/lib/pdfGeneratorRjonnsson';
import {
  ActivityLevel,
  DietGoal,
  Gender,
  WorkoutDuration,
  WorkoutFocus,
  WorkoutFrequency,
  WorkoutLevel,
  WorkoutLocation,
} from '@/types/diet';
import confetti from 'canvas-confetti';
import {
  Building2,
  Home,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Download,
  RotateCcw,
  RefreshCw,
  Flame,
  Check,
  Cpu,
  Zap,
  Activity,
  ShieldCheck,
  Utensils,
  Dumbbell,
} from 'lucide-react';

export default function RJonnssonFitPage() {
  // Controle de Etapa Linear (1: Calculadora/Dieta, 2: Dieta Pronta, 3: Treino, 4: Sucesso/PDF)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // 1. Dados Pessoais & Metabólicos (Campos Livres para Digitação sem Trava)
  const [gender, setGender] = useState<Gender>('masculino');
  const [ageInput, setAgeInput] = useState<string>('28');
  const [weightInput, setWeightInput] = useState<string>('82');
  const [heightInput, setHeightInput] = useState<string>('178');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderado');
  const [goal, setGoal] = useState<DietGoal>('emagrecimento_verao_agressivo');

  // Valores numéricos seguros para cálculo
  const numWeight = useMemo(() => {
    const clean = weightInput.replace(/[^\d.,]/g, '').replace(',', '.').trim();
    const val = parseFloat(clean);
    return isNaN(val) || val <= 0 ? 80 : val;
  }, [weightInput]);

  const numHeight = useMemo(() => {
    const clean = heightInput.replace(/[^\d.,]/g, '').replace(',', '.').trim();
    let val = parseFloat(clean);
    if (isNaN(val) || val <= 0) return 175;
    // Se o usuário digitou em metros (ex: 1.78 ou 1,78), converte automaticamente para cm (178)
    if (val > 0 && val < 3) val = Math.round(val * 100);
    return val;
  }, [heightInput]);

  const numAge = useMemo(() => {
    const clean = ageInput.replace(/[^\d]/g, '').trim();
    const val = parseInt(clean, 10);
    return isNaN(val) || val <= 0 ? 25 : val;
  }, [ageInput]);

  // 2. Opções da Dieta (Garante 3 opções completas)
  const [mealsCount, setMealsCount] = useState<number>(4);
  const [dietOptionIndex, setDietOptionIndex] = useState<number>(0);
  const [showSubstitutions, setShowSubstitutions] = useState<boolean>(false);
  const [subGroup, setSubGroup] = useState<'Proteínas' | 'Carboidratos' | 'Gorduras Boas'>('Proteínas');

  // 3. Opções do Treino
  const [workoutLocation, setWorkoutLocation] = useState<WorkoutLocation>('academia');
  const [workoutLevel, setWorkoutLevel] = useState<WorkoutLevel>('intermediario');
  const [workoutFrequency, setWorkoutFrequency] = useState<WorkoutFrequency>(4);
  const [workoutDuration, setWorkoutDuration] = useState<WorkoutDuration>(45);
  const [workoutFocus, setWorkoutFocus] = useState<WorkoutFocus>('queima_geral');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // 4. Checklist Diário
  const [habits, setHabits] = useState([
    { id: 1, label: 'Bater a meta diária de água calculada (35-40ml/kg)', done: false },
    { id: 2, label: 'Pesar todas as refeições na balança de cozinha', done: false },
    { id: 3, label: 'Atingir a meta de proteína para proteger a massa magra', done: false },
    { id: 4, label: 'Concluir o treino de força programado para o dia', done: false },
    { id: 5, label: 'Executar o finalizador de cárdio / caminhar 8.000 passos', done: false },
  ]);

  // Cálculos reativos
  const targets = useMemo(() => {
    return calculateNutritionalTargets({
      age: numAge,
      weight: numWeight,
      height: numHeight,
      gender,
      activityLevel,
      goal,
    });
  }, [numAge, numWeight, numHeight, gender, activityLevel, goal]);

  // Sempre gera 3 opções completas de cardápios
  const dietOptions = useMemo(() => {
    return generateSummerDietPlan(targets, mealsCount);
  }, [targets, mealsCount]);

  const workoutPlan = useMemo(() => {
    return generateWorkoutPlan({
      location: workoutLocation,
      level: workoutLevel,
      frequency: workoutFrequency,
      duration: workoutDuration,
      focus: workoutFocus,
    });
  }, [workoutLocation, workoutLevel, workoutFrequency, workoutDuration, workoutFocus]);

  const activeDiet = dietOptions[dietOptionIndex] || dietOptions[0];
  const activeWorkoutDay = workoutPlan.days[selectedDayIndex] || workoutPlan.days[0];

  // Disparo do download do PDF oficial com todas as 3 opções de cardápios
  const triggerPdfDownload = () => {
    const goalTitle = GOAL_DETAILS[goal]?.label || 'Déficit Agressivo de Verão (-700 kcal)';
    generateRJonnssonFitPdf({
      userName: 'Aluno Nutri de Bolso',
      age: numAge,
      weight: numWeight,
      height: numHeight,
      gender,
      activityLevel: activityLevel.toUpperCase(),
      goalTitle,
      targets,
      dietOptions, // Envia todas as 3 opções de cardápio para impressão!
      workoutPlan,
    });
  };

  // Finalizar e gerar o PDF
  const handleFinish = () => {
    triggerPdfDownload();
    setCurrentStep(4);
    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#00f2fe', '#00ff9d', '#ffffff', '#8b5cf6'],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleHabit = (id: number) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));
  };

  return (
    <div className="min-h-screen bg-[#06080e] text-[#d1d5db] flex flex-col">
      {/* NAVBAR TECNOLÓGICA */}
      <nav className="tactical-navbar">
        <a href="#" className="tactical-logo">
          <Dumbbell className="w-5 h-5 text-[#00f2fe]" />
          <span>Nutri<strong className="text-white"> de Bolso</strong></span>
        </a>

        {/* Indicador de Etapa Simples & Limpo */}
        <div className="text-xs font-bold uppercase tracking-wider flex items-center">
          <span className="text-[#00f2fe] flex items-center gap-2 font-mono bg-[#00f2fe]/10 border border-[#00f2fe]/25 px-3 py-1.5 rounded-full shadow-sm shadow-[#00f2fe]/10">
            <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
            Etapa {currentStep} de 4
          </span>
        </div>
      </nav>

      {/* CONTAINER PRINCIPAL CENTRALIZADO (900px) */}
      <main className="tactical-container flex-1">
        {/* STEPPER TECNOLÓGICO HIGH-TECH DE 4 ETAPAS */}
        <div className="tech-stepper">
          <div className={`step-node ${currentStep >= 1 ? 'active' : ''} ${currentStep === 1 ? 'current' : ''}`}>
            <div className="node-badge">01</div>
            <div className="node-info">
              <span className="node-title">METABOLISMO</span>
              <span className="node-sub">TMB & Gasto</span>
            </div>
          </div>
          <div className={`step-connector ${currentStep >= 2 ? 'active' : ''}`} />
          <div className={`step-node ${currentStep >= 2 ? 'active' : ''} ${currentStep === 2 ? 'current' : ''}`}>
            <div className="node-badge">02</div>
            <div className="node-info">
              <span className="node-title">3 CARDÁPIOS</span>
              <span className="node-sub">Variações Verão</span>
            </div>
          </div>
          <div className={`step-connector ${currentStep >= 3 ? 'active' : ''}`} />
          <div className={`step-node ${currentStep >= 3 ? 'active' : ''} ${currentStep === 3 ? 'current' : ''}`}>
            <div className="node-badge">03</div>
            <div className="node-info">
              <span className="node-title">TREINO</span>
              <span className="node-sub">Academia / Casa</span>
            </div>
          </div>
          <div className={`step-connector ${currentStep >= 4 ? 'active' : ''}`} />
          <div className={`step-node ${currentStep >= 4 ? 'active' : ''} ${currentStep === 4 ? 'current' : ''}`}>
            <div className="node-badge">04</div>
            <div className="node-info">
              <span className="node-title">PDF OFICIAL</span>
              <span className="node-sub">Download 100%</span>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* ETAPA 1: CALCULADORA & CONFIGURAÇÃO DA DIETA                      */}
        {/* ================================================================ */}
        {currentStep === 1 && (
          <div>
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/25">
                <Zap className="w-3 h-3" /> BIO-METABOLIC ENGINE V4.0
              </span>
            </div>

            <h1 className="section-title">
              Calculadora de Metabolismo | <span>Projeto Verão</span>
            </h1>
            <p className="subtitle">
              Insira seus dados biométricos. Nosso algoritmo calcula a Taxa Metabólica Basal (Mifflin-St Jeor), o gasto real e estrutura as 3 opções de cardápios com o déficit estratégico selecionado.
            </p>

            <div className="calc-wrapper">
              <div>
                {/* Linha 1: Gênero & Idade */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Gênero Biológico:</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as Gender)}
                    >
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Idade (anos):</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={ageInput}
                      onChange={(e) => setAgeInput(e.target.value)}
                      placeholder="Ex: 28"
                    />
                  </div>
                </div>

                {/* Linha 2: Peso & Altura (Livre para Digitação) */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Peso Corporal (kg):</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      placeholder="Ex: 82 ou 82.5"
                    />
                  </div>
                  <div className="form-group">
                    <label>Altura (cm):</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={heightInput}
                      onChange={(e) => setHeightInput(e.target.value)}
                      placeholder="Ex: 178"
                    />
                  </div>
                </div>

                {/* Linha 3: Nível de Atividade */}
                <div className="form-group">
                  <label>Rotina & Nível de Atividade Física:</label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                  >
                    <option value="sedentario">Sedentário (Trabalho sentado, sem exercícios regulares)</option>
                    <option value="leve">Leve (Caminhadas ou exercícios leves 1 a 3x por semana)</option>
                    <option value="moderado">Moderado (Treino de musculação ou cárdio 3 a 5x por semana)</option>
                    <option value="ativo">Muito Ativo (Treino intenso 6 a 7x por semana)</option>
                    <option value="muito_ativo">Extremo (Atleta de alto rendimento ou trabalho físico pesado)</option>
                  </select>
                </div>

                {/* Linha 4: Quantidade de Refeições */}
                <div className="form-group">
                  <label>Divisão Diária de Refeições Desejada:</label>
                  <select
                    value={mealsCount}
                    onChange={(e) => setMealsCount(Number(e.target.value))}
                  >
                    <option value="3">3 Refeições por Dia (Almoço, Lanche/Pré-Treino e Jantar - Estilo Jejum)</option>
                    <option value="4">4 Refeições por Dia (Café da Manhã, Almoço, Lanche e Jantar - Padrão Atleta)</option>
                    <option value="5">5 Refeições por Dia (Café, Lanche, Almoço, Lanche da Tarde e Jantar - Fracionada)</option>
                  </select>
                </div>

                {/* Linha 5: Estratégia Calórica de Queima */}
                <div className="form-group">
                  <label>Estratégia Calórica do Projeto Verão:</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value as DietGoal)}
                  >
                    <option value="emagrecimento_verao_agressivo">
                      🔥 Déficit Agressivo de Verão (-700 kcal) • Queima Rápida & Máxima Retenção Muscular [RECOMENDADO]
                    </option>
                    <option value="emagrecimento_moderado">
                      ⚡ Déficit Moderado (-500 kcal) • Ritmo Sustentável Contínuo
                    </option>
                    <option value="emagrecimento_extremo">
                      ⚠️ Corte Acelerado (-900 kcal) • Choque Metabólico de Curto Prazo
                    </option>
                    <option value="recomposicao">
                      ⚖️ Recomposição Corporal (0 kcal) • Troca de Gordura por Músculo em Manutenção
                    </option>
                  </select>
                </div>

                {/* Painel de Telemetria Metabólica em Tempo Real */}
                <div className="p-4 rounded-xl bg-[#080d16] border border-[#00f2fe]/20 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-mono text-[11px] block">TMB BASAL (REPOUSO):</span>
                    <span className="text-lg font-black text-white font-mono">{targets.tmb} kcal</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-[11px] block">GASTO TOTAL DIÁRIO (TDEE):</span>
                    <span className="text-lg font-black text-white font-mono">{targets.get} kcal</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#00f2fe] font-mono text-[11px] font-bold block">
                      META CALÓRICA ({targets.calorieDiff > 0 ? `+${targets.calorieDiff}` : targets.calorieDiff} kcal):
                    </span>
                    <span className="text-xl font-black text-[#00ff9d] font-mono">{targets.targetCalories} kcal</span>
                  </div>
                </div>

                {/* Botão de Avanço Tech */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-primary"
                >
                  <span>GERAR 3 OPÇÕES DE CARDÁPIO & AVANÇAR</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* ETAPA 2: SUA DIETA PRONTA & 3 OPÇÕES DE CARDÁPIOS               */}
        {/* ================================================================ */}
        {currentStep === 2 && (
          <div>
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/25">
                <CheckCircle2 className="w-3 h-3" /> 3 VARIAÇÕES CALCULADAS NA BALANÇA
              </span>
            </div>

            <h1 className="section-title">
              Sua Dieta de Verão | <span>3 Opções Prontas</span>
            </h1>
            <p className="subtitle">
              Seus números metabólicos calculados com precisão. Abaixo você tem 3 opções de cardápios completos para alternar e não enjoar da dieta.
            </p>

            <div className="calc-wrapper">
              {/* Grid das Métricas Base de Telemetria com TMB e GET bem distintos */}
              <div className="result-grid">
                <div className="result-box" style={{ borderColor: 'rgba(0, 242, 254, 0.35)' }}>
                  <h4 style={{ color: 'var(--primary-cyan)' }}>Taxa Metabólica Basal (TMB)</h4>
                  <p>{targets.tmb} <small style={{ fontSize: '14px', color: '#64748b' }}>kcal</small></p>
                  <div className="result-tip">Gasto biológico mínimo do corpo em repouso (Mifflin-St Jeor).</div>
                </div>

                <div className="result-box">
                  <h4>Gasto Total Diário (TDEE)</h4>
                  <p>{targets.get} <small style={{ fontSize: '14px', color: '#64748b' }}>kcal</small></p>
                  <div className="result-tip">Gasto real somando sua taxa basal com sua rotina de exercícios.</div>
                </div>

                <div className="result-box" style={{ borderColor: 'rgba(0, 255, 157, 0.45)', boxShadow: '0 0 15px rgba(0, 255, 157, 0.1)' }}>
                  <h4 style={{ color: 'var(--primary-mint)' }}>
                    Meta Calórica ({targets.calorieDiff > 0 ? `+${targets.calorieDiff}` : targets.calorieDiff} kcal)
                  </h4>
                  <p style={{ color: 'var(--primary-mint)' }}>
                    {targets.targetCalories} <small style={{ fontSize: '14px', color: '#64748b' }}>kcal</small>
                  </p>
                  <div className="result-tip">Déficit estratégico de {targets.calorieDiff} kcal para derreter gordura.</div>
                </div>

                <div className="result-box" style={{ borderColor: 'rgba(139, 92, 246, 0.45)' }}>
                  <h4 style={{ color: '#a78bfa' }}>Proteína Diária (2.2g/kg)</h4>
                  <p>{targets.proteinGrams} <small style={{ fontSize: '14px', color: '#64748b' }}>g</small></p>
                  <div className="result-tip">Blindagem muscular essencial durante o déficit calórico agressivo.</div>
                </div>

                <div className="result-box">
                  <h4>Meta Hídrica Diária</h4>
                  <p>{(targets.waterMl / 1000).toFixed(1)} <small style={{ fontSize: '14px', color: '#64748b' }}>Litros</small></p>
                  <div className="result-tip">~{Math.round(targets.waterMl / 500)} garrafas de 500ml ao longo do dia.</div>
                </div>
              </div>

              {/* 3 Opções de Cardápios em Destaque Interativo */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-[#00f2fe]" />
                    <span className="text-xs font-black uppercase text-white tracking-wide">
                      3 Cardápios de Verão Calculados (Todos inclusos no seu PDF):
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#00ff9d] bg-[#00ff9d]/10 px-2.5 py-0.5 rounded border border-[#00ff9d]/25">
                    3 VARIAÇÕES DISPONÍVEIS
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {dietOptions.map((opt, idx) => (
                    <button
                      key={opt.optionNumber}
                      type="button"
                      onClick={() => setDietOptionIndex(idx)}
                      className={`relative p-4 rounded-2xl border-2 text-left cursor-pointer transition-all duration-200 flex flex-col justify-between group active:scale-[0.98] ${
                        dietOptionIndex === idx
                          ? 'bg-gradient-to-br from-[#0c1626] to-[#0e1d33] border-[#00f2fe] shadow-[0_0_20px_rgba(0,242,254,0.25)] ring-1 ring-[#00f2fe]'
                          : 'bg-[#090e18] border-[#1e293b] hover:border-[#00f2fe]/50 hover:bg-[#0c1220] opacity-80 hover:opacity-100 hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2 w-full">
                        <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                          dietOptionIndex === idx
                            ? 'bg-gradient-to-r from-[#00f2fe] to-[#00ff9d] text-slate-950 font-black shadow-sm'
                            : 'bg-[#151f32] text-slate-400 group-hover:text-slate-200 border border-[#1e293b]'
                        }`}>
                          {dietOptionIndex === idx && <Check className="w-3 h-3 stroke-[3]" />}
                          Opção 0{idx + 1}
                        </span>
                        <span className="text-xs font-black text-[#00ff9d] font-mono">
                          ~{targets.targetCalories} kcal
                        </span>
                      </div>

                      <span className="text-sm font-black text-white block mt-1 tracking-tight">
                        {opt.title.replace(`Opção ${opt.optionNumber}: `, '')}
                      </span>
                      
                      <span className="text-[11px] text-slate-400 block mt-1 leading-snug line-clamp-2">
                        {opt.tagline}
                      </span>

                      {/* Botão de Status no Rodapé do Card */}
                      <div className="mt-3 pt-2.5 border-t border-[#1a2538] flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400">P: {targets.proteinGrams}g</span>
                        <span className={`font-black uppercase tracking-wider flex items-center gap-1 ${
                          dietOptionIndex === idx ? 'text-[#00f2fe]' : 'text-slate-500 group-hover:text-slate-300'
                        }`}>
                          {dietOptionIndex === idx ? '● SELECIONADO' : '○ SELECIONAR'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Banner de Garantia Oficial de Inclusão no PDF */}
                <div className="mt-3 p-3 rounded-lg bg-[#00f2fe]/5 border border-[#00f2fe]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ff9d] flex-shrink-0" />
                    <span className="text-slate-300">
                      Visualizando agora: <strong className="text-white">{activeDiet.title}</strong>
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#00f2fe] font-bold">
                    ✓ TODAS AS 3 OPÇÕES SERÃO IMPRESSAS NO SEU PDF FINAL
                  </span>
                </div>
              </div>

              {/* Lista das Refeições do Cardápio Selecionado */}
              <div className="space-y-4 mb-6">
                {activeDiet.meals.map((meal, mealIdx) => (
                  <div
                    key={meal.id}
                    className="p-5 rounded-xl bg-[#090e18] border border-[#1e293b] hover:border-[#00f2fe]/30 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#162032]">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded bg-[#00f2fe]/15 text-[#00f2fe] font-mono font-black text-xs flex items-center justify-center border border-[#00f2fe]/30">
                          0{mealIdx + 1}
                        </span>
                        <div>
                          <span className="font-extrabold text-sm text-white block">{meal.name}</span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                            <Clock className="w-3 h-3 text-[#00f2fe]" /> Horário Sugerido: {meal.timeSuggestion}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-[#00ff9d] font-mono block">
                          {meal.totalCalories} kcal
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          P: {meal.totalProtein}g | C: {meal.totalCarbs}g | G: {meal.totalFats}g
                        </span>
                      </div>
                    </div>

                    {/* Alimentos Pesados */}
                    <div className="space-y-2 pt-1">
                      {meal.items.map((item, itIdx) => (
                        <div
                          key={itIdx}
                          className="p-2.5 rounded-lg bg-[#0f1624] border border-[#1a2538] flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-200 block">{item.name}</span>
                            {item.tip && (
                              <span className="text-[11px] text-slate-400 block">{item.tip}</span>
                            )}
                          </div>
                          <span className="font-mono font-bold text-[#00f2fe] bg-[#00f2fe]/10 px-2.5 py-1 rounded border border-[#00f2fe]/20 flex-shrink-0">
                            {item.portion}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tabela de Substituições Inteligentes */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setShowSubstitutions(!showSubstitutions)}
                  className="w-full p-3.5 rounded-xl bg-[#090e18] border border-[#1e293b] text-xs font-bold text-white flex items-center justify-between cursor-pointer hover:border-[#00f2fe]/50"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-[#00f2fe]" />
                    <span>Tabela Oficial de Substituições de Alimentos na Balança</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {showSubstitutions ? '▲ OCULTAR' : '▼ VER EQUIVALÊNCIAS'}
                  </span>
                </button>

                {showSubstitutions && (
                  <div className="p-4 bg-[#090e18] border border-[#1e293b] border-t-0 rounded-b-xl space-y-3">
                    <div className="flex gap-2">
                      {(['Proteínas', 'Carboidratos', 'Gorduras Boas'] as const).map((grp) => (
                        <button
                          key={grp}
                          type="button"
                          onClick={() => setSubGroup(grp)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                            subGroup === grp
                              ? 'bg-[#00f2fe] text-slate-950 font-black'
                              : 'bg-[#0f1624] text-slate-400 hover:text-white'
                          }`}
                        >
                          {grp}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3 pt-2">
                      {SUMMER_SUBSTITUTIONS.filter((s) => s.group === subGroup).map((sub, i) => (
                        <div key={i} className="p-3 bg-[#0c121e] rounded-lg border border-[#1e293b] text-xs space-y-2">
                          <span className="font-bold text-[#00f2fe] block border-b border-[#1e293b] pb-1">
                            Alimento de Referência: {sub.baseFood}
                          </span>
                          <ul className="space-y-1">
                            {sub.equivalents.map((eq, eqIdx) => (
                              <li key={eqIdx} className="text-slate-300 flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9d] flex-shrink-0" />
                                <span>{eq}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botão de Avanço Tech */}
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-primary"
              >
                <span>AVANÇAR PARA MONTAR MEU TREINO</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-secondary"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar e Ajustar Dados</span>
              </button>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* ETAPA 3: MONTADOR DE TREINO PERSONALIZADO                        */}
        {/* ================================================================ */}
        {currentStep === 3 && (
          <div>
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#8b5cf6]/10 text-[#a78bfa] border border-[#8b5cf6]/25">
                <Activity className="w-3 h-3" /> HYBRID TRAINING ENGINE
              </span>
            </div>

            <h1 className="section-title">
              Montador de Treino | <span>Academia ou Casa</span>
            </h1>
            <p className="subtitle">
              Defina seu local de treinamento e frequência semanal. A ficha é estruturada com sobrecarga progressiva e finalizador metabólico para derreter gordura.
            </p>

            <div className="calc-wrapper">
              {/* 1. Escolha de Ambiente: Academia ou Casa */}
              <div className="form-group">
                <label>Ambiente de Treinamento:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Botão Academia */}
                  <button
                    type="button"
                    onClick={() => {
                      setWorkoutLocation('academia');
                      setSelectedDayIndex(0);
                    }}
                    className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-200 text-left border-2 flex flex-col justify-between group active:scale-[0.98] ${
                      workoutLocation === 'academia'
                        ? 'bg-gradient-to-br from-[#0c1626] to-[#0f1f38] border-[#00f2fe] shadow-[0_0_25px_rgba(0,242,254,0.25)] ring-1 ring-[#00f2fe]'
                        : 'bg-[#090e18] border-[#1e293b] hover:border-[#00f2fe]/50 hover:bg-[#0c1220] hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3 w-full">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        workoutLocation === 'academia'
                          ? 'bg-gradient-to-tr from-[#00f2fe] to-[#00ff9d] text-slate-950 shadow-md shadow-[#00f2fe]/30 font-black'
                          : 'bg-[#151f32] text-slate-400 group-hover:text-white border border-[#1e293b]'
                      }`}>
                        <Building2 className="w-6 h-6" />
                      </div>
                      
                      {/* Pílula Indicadora de Seleção */}
                      <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-black tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                        workoutLocation === 'academia'
                          ? 'bg-[#00f2fe] text-slate-950 shadow-sm'
                          : 'bg-[#151f32] text-slate-400 border border-[#1e293b] group-hover:border-slate-500'
                      }`}>
                        {workoutLocation === 'academia' ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> SELECIONADO
                          </>
                        ) : (
                          'CLIQUE P/ ESCOLHER'
                        )}
                      </span>
                    </div>

                    <div>
                      <span className="font-black text-base block text-white tracking-wide">
                        🏢 Treino em Academia
                      </span>
                      <span className="text-xs text-slate-400 block mt-1 leading-relaxed">
                        Musculação completa com aparelhos, halteres, barras e cárdio em esteira.
                      </span>
                    </div>
                  </button>

                  {/* Botão Casa */}
                  <button
                    type="button"
                    onClick={() => {
                      setWorkoutLocation('casa');
                      setSelectedDayIndex(0);
                    }}
                    className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-200 text-left border-2 flex flex-col justify-between group active:scale-[0.98] ${
                      workoutLocation === 'casa'
                        ? 'bg-gradient-to-br from-[#0c1626] to-[#0f1f38] border-[#00f2fe] shadow-[0_0_25px_rgba(0,242,254,0.25)] ring-1 ring-[#00f2fe]'
                        : 'bg-[#090e18] border-[#1e293b] hover:border-[#00f2fe]/50 hover:bg-[#0c1220] hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3 w-full">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        workoutLocation === 'casa'
                          ? 'bg-gradient-to-tr from-[#00f2fe] to-[#00ff9d] text-slate-950 shadow-md shadow-[#00f2fe]/30 font-black'
                          : 'bg-[#151f32] text-slate-400 group-hover:text-white border border-[#1e293b]'
                      }`}>
                        <Home className="w-6 h-6" />
                      </div>
                      
                      {/* Pílula Indicadora de Seleção */}
                      <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-black tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                        workoutLocation === 'casa'
                          ? 'bg-[#00f2fe] text-slate-950 shadow-sm'
                          : 'bg-[#151f32] text-slate-400 border border-[#1e293b] group-hover:border-slate-500'
                      }`}>
                        {workoutLocation === 'casa' ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> SELECIONADO
                          </>
                        ) : (
                          'CLIQUE P/ ESCOLHER'
                        )}
                      </span>
                    </div>

                    <div>
                      <span className="font-black text-base block text-white tracking-wide">
                        🏠 Treino em Casa
                      </span>
                      <span className="text-xs text-slate-400 block mt-1 leading-relaxed">
                        Calistenia funcional, peso do corpo e circuitos HIIT aceleradores.
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. Filtros de Nível, Frequência e Duração */}
              <div className="form-row">
                <div className="form-group">
                  <label>Nível Atual:</label>
                  <select
                    value={workoutLevel}
                    onChange={(e) => setWorkoutLevel(e.target.value as WorkoutLevel)}
                  >
                    <option value="iniciante">Iniciante (Iniciando ou retornando agora)</option>
                    <option value="intermediario">Intermediário (Treina com consistência)</option>
                    <option value="avancado">Avançado (Alta intensidade de treino)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Frequência Semanal:</label>
                  <select
                    value={workoutFrequency}
                    onChange={(e) => {
                      setWorkoutFrequency(Number(e.target.value) as WorkoutFrequency);
                      setSelectedDayIndex(0);
                    }}
                  >
                    <option value="3">3 Dias por Semana (Full Body / ABC)</option>
                    <option value="4">4 Dias por Semana (Upper / Lower)</option>
                    <option value="5">5 Dias por Semana (Push / Pull / Legs)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tempo por Treino:</label>
                  <select
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(Number(e.target.value) as WorkoutDuration)}
                  >
                    <option value="30">30 Minutos (Express / Alta Densidade)</option>
                    <option value="45">45 Minutos (Hipertrofia & Queima Equilibrada)</option>
                    <option value="60">60 Minutos (Completo com Cárdio Longo)</option>
                  </select>
                </div>
              </div>

              {/* 3. Seleção dos Dias de Treino */}
              <div className="form-group">
                <label>Ficha Dividida ({workoutPlan.days.length} Dias na Semana):</label>
                <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1">
                  {workoutPlan.days.map((day, idx) => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => setSelectedDayIndex(idx)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase cursor-pointer flex-shrink-0 transition-all font-mono border-2 active:scale-95 flex items-center gap-2 ${
                        selectedDayIndex === idx
                          ? 'bg-gradient-to-r from-[#00f2fe] to-[#00ff9d] text-slate-950 border-[#00ff9d] shadow-lg shadow-[#00f2fe]/25 font-black'
                          : 'bg-[#090e18] text-slate-400 hover:text-white border-[#1e293b] hover:border-[#00f2fe]/50 hover:bg-[#0c1220]'
                      }`}
                    >
                      {selectedDayIndex === idx && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      {day.dayLabel}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Detalhes dos Exercícios do Dia */}
              <div className="p-5 rounded-xl bg-[#090e18] border border-[#1e293b] space-y-4 mb-6">
                <div className="pb-3 border-b border-[#162032]">
                  <span className="text-[11px] font-bold text-[#00f2fe] uppercase tracking-wider block font-mono">
                    {activeWorkoutDay.dayLabel} • {workoutLocation === 'academia' ? 'Academia' : 'Em Casa'}
                  </span>
                  <span className="text-base font-black text-white block mt-0.5">{activeWorkoutDay.title}</span>
                </div>

                <div className="space-y-3">
                  {activeWorkoutDay.exercises.map((ex, exIdx) => (
                    <div
                      key={ex.id}
                      className="p-3.5 rounded-lg bg-[#0f1624] border border-[#1a2538] flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded bg-[#00f2fe]/15 text-[#00f2fe] font-mono font-black text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                          {exIdx + 1}
                        </span>
                        <div>
                          <span className="font-extrabold text-white text-sm block">{ex.name}</span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            <strong className="text-slate-300">Técnica:</strong> {ex.notes}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="font-mono font-black text-[#00ff9d] block text-sm">
                          {ex.sets} × {ex.reps}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                          Descanso: {ex.rest}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Finalizador Queimador de Verão */}
                <div className="p-4 rounded-lg bg-[#081816] border border-[#00ff9d]/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white flex items-center gap-1.5 uppercase">
                      <Flame className="w-4 h-4 text-[#00ff9d]" /> Finalizador: {activeWorkoutDay.cardioFinisher.title}
                    </span>
                    <span className="text-[10px] font-black font-mono text-[#00ff9d] bg-[#00ff9d]/15 px-2.5 py-0.5 rounded border border-[#00ff9d]/30">
                      Gasto: {activeWorkoutDay.cardioFinisher.caloriesBurnEst}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeWorkoutDay.cardioFinisher.protocol}
                  </p>
                </div>
              </div>

              {/* Botão de Finalização & Download */}
              <button
                type="button"
                onClick={handleFinish}
                className="btn-primary"
              >
                <Download className="w-5 h-5" />
                <span>FINALIZAR & BAIXAR PROTOCOLO EM PDF (3 DIETAS + TREINO)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-secondary"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar para a Dieta</span>
              </button>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* ETAPA 4: PROTOCOLO CONCLUÍDO & DOWNLOAD DO PDF                   */}
        {/* ================================================================ */}
        {currentStep === 4 && (
          <div>
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/25">
                <ShieldCheck className="w-3 h-3" /> PROTOCOLO LIBERADO COM SUCESSO
              </span>
            </div>

            <h1 className="section-title">
              Protocolo Concluído | <span>Download Liberado</span>
            </h1>
            <p className="subtitle">
              Seu plano oficial Nutri de Bolso com Diagnóstico Metabólico, as 3 Opções de Cardápios na Balança e Ficha de Treino foi finalizado com sucesso!
            </p>

            <div className="calc-wrapper text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00f2fe]/20 to-[#00ff9d]/20 text-[#00ff9d] border-2 border-[#00ff9d] mx-auto flex items-center justify-center font-black shadow-lg shadow-[#00ff9d]/20">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  Seu PDF Oficial Nutri de Bolso está Pronto!
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                  O download do documento formatado com as <strong>3 opções de cardápios</strong> e o treino completo começou automaticamente.
                </p>
              </div>

              {/* Botão de Baixar Novamente */}
              <button
                type="button"
                onClick={triggerPdfDownload}
                className="btn-primary"
              >
                <Download className="w-5 h-5" />
                <span>BAIXAR PDF NOVAMENTE</span>
              </button>

              {/* Checklist Diário de Compromissos do Verão */}
              <div className="p-6 rounded-xl bg-[#090e18] border border-[#1e293b] text-left space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#00f2fe] border-b border-[#1e293b] pb-2 font-mono">
                  CHECKLIST DIÁRIO DE DISCIPLINA • NUTRI DE BOLSO
                </h4>

                <div className="space-y-2">
                  {habits.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => toggleHabit(h.id)}
                      className="w-full p-3 rounded-lg bg-[#0f1624] border border-[#1e293b] flex items-center justify-between text-left hover:border-[#00f2fe]/40 transition-colors cursor-pointer"
                    >
                      <span className={`text-xs ${h.done ? 'line-through text-slate-500' : 'text-slate-200 font-bold'}`}>
                        {h.label}
                      </span>
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                          h.done ? 'bg-[#00ff9d] border-[#00ff9d] text-slate-950 font-black' : 'border-slate-600'
                        }`}
                      >
                        {h.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Botão para Criar Novo Plano */}
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-secondary"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Refazer Cálculo ou Criar Novo Plano</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Nutri de Bolso | Sistema Inteligente de Dieta & Treino • Projeto Verão 2026/2027.
      </footer>
    </div>
  );
}
