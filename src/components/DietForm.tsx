'use client';

import React, { useState } from 'react';
import { ActivityLevel, DietGoal, Gender, UserDietInput } from '@/types/diet';
import {
  User,
  Scale,
  Ruler,
  Calendar,
  Dumbbell,
  Target,
  Sparkles,
  Check,
  Plus,
  X,
  Loader2,
  Flame,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Heart,
} from 'lucide-react';

interface DietFormProps {
  onSubmit: (data: UserDietInput) => Promise<void>;
  isLoading: boolean;
}

const POPULAR_PROTEINS = ['Peito de Frango', 'Ovos', 'Patinho Moído', 'Tilápia / Peixe', 'Atum', 'Queijo Branco'];
const POPULAR_CARBS = ['Arroz & Feijão', 'Aveia', 'Batata-doce', 'Banana', 'Pão Integral'];
const DIETARY_TAGS = ['Sem Lactose', 'Sem Glúten', 'Vegetariano', 'Pouco Açúcar'];

export function DietForm({ onSubmit, isLoading }: DietFormProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Estados do formulário
  const [gender, setGender] = useState<Gender>('masculino');
  const [age, setAge] = useState<number | ''>(28);
  const [weight, setWeight] = useState<number | ''>(78);
  const [height, setHeight] = useState<number | ''>(178);

  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderado');
  const [goal, setGoal] = useState<DietGoal>('hipertrofia');

  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Peito de Frango',
    'Ovos',
    'Arroz & Feijão',
    'Aveia',
  ]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customTagInput.trim();
    if (clean && !selectedTags.includes(clean)) {
      setSelectedTags([...selectedTags, clean]);
      setCustomTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleNextFromStep1 = () => {
    setValidationError(null);
    if (!age || age < 12 || age > 110) {
      setValidationError('Por favor, informe sua idade (entre 12 e 110 anos).');
      return;
    }
    if (!weight || weight < 35 || weight > 250) {
      setValidationError('Por favor, informe seu peso (entre 35kg e 250kg).');
      return;
    }
    if (!height || height < 110 || height > 230) {
      setValidationError('Por favor, informe sua altura (entre 110cm e 230cm).');
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const payload: UserDietInput = {
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      gender,
      activityLevel,
      goal,
      preferences: selectedTags,
      customNotes,
    };

    try {
      await onSubmit(payload);
    } catch (err: any) {
      setValidationError(err.message || 'Erro ao gerar o plano de dieta.');
    }
  };

  return (
    <div className="w-full space-y-4 pb-24">
      {/* Barra de Progresso Mobile Estilo Duolingo/Stories */}
      <div className="space-y-2 px-1">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span className="text-emerald-400">
            Passo {currentStep} de 3
          </span>
          <span>
            {currentStep === 1
              ? 'Seu Corpo'
              : currentStep === 2
              ? 'Rotina & Meta'
              : 'Seus Alimentos'}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Alerta de Validação */}
      {validationError && (
        <div className="p-3.5 rounded-2xl bg-red-950/70 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* PASSO 1: DADOS FÍSICOS */}
      {/* ======================================================== */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Cartão de Seleção de Sexo */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Qual é o seu sexo biológico?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('masculino')}
                className={`py-4 px-4 rounded-2xl border-2 font-bold text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  gender === 'masculino'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-2xl">👨</span>
                <span>Homem</span>
              </button>
              <button
                type="button"
                onClick={() => setGender('feminino')}
                className={`py-4 px-4 rounded-2xl border-2 font-bold text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  gender === 'feminino'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-2xl">👩</span>
                <span>Mulher</span>
              </button>
            </div>
          </div>

          {/* Cartão de Idade, Peso e Altura */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Suas Medidas Atuais
            </h3>

            {/* Idade */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Idade</span>
                  <span className="text-[11px] text-slate-500">Em anos completos</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 w-24">
                <input
                  type="number"
                  min="12"
                  max="110"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="28"
                  className="w-full bg-slate-900 border border-slate-700 text-center text-base font-bold text-slate-100 rounded-xl py-1.5 outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-400">anos</span>
              </div>
            </div>

            {/* Peso */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Peso Atual</span>
                  <span className="text-[11px] text-slate-500">Pela manhã em jejum</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 w-24">
                <input
                  type="number"
                  step="0.5"
                  min="35"
                  max="250"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="78"
                  className="w-full bg-slate-900 border border-slate-700 text-center text-base font-bold text-slate-100 rounded-xl py-1.5 outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-400">kg</span>
              </div>
            </div>

            {/* Altura */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                  <Ruler className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Altura</span>
                  <span className="text-[11px] text-slate-500">Em centímetros</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 w-24">
                <input
                  type="number"
                  min="110"
                  max="230"
                  value={height}
                  onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="178"
                  className="w-full bg-slate-900 border border-slate-700 text-center text-base font-bold text-slate-100 rounded-xl py-1.5 outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-400">cm</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PASSO 2: ROTINA DE TREINO & META */}
      {/* ======================================================== */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Nível de Atividade */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quantas vezes você treina na semana?
            </h3>

            <div className="space-y-2">
              {[
                { id: 'sedentario', label: 'Sedentário', sub: 'Pouco ou nenhum exercício diário', icon: '🛋️' },
                { id: 'leve', label: 'Leve (1 a 3 dias/sem)', sub: 'Caminhadas ou treinos leves ocasionais', icon: '🚶‍♂️' },
                { id: 'moderado', label: 'Moderado (3 a 5 dias/sem)', sub: 'Musculação / corrida 3 a 5x por semana', icon: '🏋️‍♂️' },
                { id: 'ativo', label: 'Muito Ativo (6 a 7 dias/sem)', sub: 'Treinos intensos quase todos os dias', icon: '⚡' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActivityLevel(item.id as ActivityLevel)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    activityLevel === item.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <span className="text-xs font-bold block">{item.label}</span>
                      <span className="text-[11px] text-slate-400">{item.sub}</span>
                    </div>
                  </div>
                  {activityLevel === item.id && (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Objetivo Principal */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Qual é o seu objetivo?
            </h3>

            <div className="space-y-2">
              {[
                {
                  id: 'hipertrofia',
                  title: 'Ganhar Músculo (Hipertrofia)',
                  badge: 'Superávit Calórico (+400 kcal)',
                  desc: 'Foco em síntese proteica e volume muscular com carboidratos energéticos.',
                  icon: '💪',
                },
                {
                  id: 'emagrecimento',
                  title: 'Perder Gordura (Emagrecimento)',
                  badge: 'Déficit Calórico (-500 kcal)',
                  desc: 'Queima de gordura consistente com carboidratos estritamente controlados.',
                  icon: '🔥',
                },
                {
                  id: 'recomposicao',
                  title: 'Recomposição Corporal',
                  badge: 'Manutenção (Troca de Gordura por Músculo)',
                  desc: 'Mantém o mesmo peso na balança enquanto melhora a definição.',
                  icon: '⚖️',
                },
              ].map((obj) => (
                <div
                  key={obj.id}
                  onClick={() => setGoal(obj.id as DietGoal)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    goal === obj.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{obj.icon}</span>
                    <div>
                      <span className="text-xs font-bold block">{obj.title}</span>
                      <span className="text-[10px] font-bold text-emerald-400 block mt-0.5 mb-1">
                        {obj.badge}
                      </span>
                      <span className="text-[11px] text-slate-400 leading-tight block">
                        {obj.desc}
                      </span>
                    </div>
                  </div>
                  {goal === obj.id && (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PASSO 3: ALIMENTOS FAVORITOS */}
      {/* ======================================================== */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Alimentos que Você Gosta
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Toque nos alimentos para incluir no seu cardápio:
              </p>
            </div>

            {/* Proteínas */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                🥩 Proteínas:
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_PROTEINS.map((p) => {
                  const isSelected = selectedTags.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => toggleTag(p)}
                      className={`text-xs px-3 py-2 rounded-xl border font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-500/25 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950/70 border-slate-800 text-slate-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Carboidratos Controlados */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                🍚 Carboidratos na Medida:
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_CARBS.map((c) => {
                  const isSelected = selectedTags.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleTag(c)}
                      className={`text-xs px-3 py-2 rounded-xl border font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-cyan-500/25 border-cyan-500 text-cyan-300'
                          : 'bg-slate-950/70 border-slate-800 text-slate-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Restrições */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                🌿 Restrições ou Estilo:
              </span>
              <div className="flex flex-wrap gap-2">
                {DIETARY_TAGS.map((t) => {
                  const isSelected = selectedTags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTag(t)}
                      className={`text-xs px-3 py-2 rounded-xl border font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500/25 border-amber-500 text-amber-300'
                          : 'bg-slate-950/70 border-slate-800 text-slate-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input customizado */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Outro alimento específico:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  placeholder="Ex: Iogurte grego, Whey..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomTag(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl border border-slate-700 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Observações adicionais (opcional):
              </label>
              <textarea
                rows={2}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Ex: Não gosto de peixe, prefiro café sem açúcar..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500 resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* BARRA DE AÇÃO FLUTUANTE INFERIOR (STICKY BOTTOM BAR) */}
      {/* ======================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/90 py-3.5 px-4 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center gap-3">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => {
                setCurrentStep((prev) => (prev - 1) as 1 | 2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="py-3.5 px-4 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextFromStep1}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
            >
              <span>{currentStep === 1 ? 'Avançar para Rotina & Meta' : 'Avançar para Alimentos'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isLoading}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Calculando & Montando Dieta...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Gerar Meus 3 Cardápios Agora</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
