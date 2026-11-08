'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Dumbbell,
  ArrowRight,
  ShieldCheck,
  Zap,
  Utensils,
  Scale,
  Flame,
  FileText,
  Download,
  ChevronRight,
  Volume2,
} from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOTAL_DURATION_SEC = 60;

const CHAPTERS = [
  { id: 1, title: 'Acesso por E-mail', sub: 'Login sem senha', startSec: 0, endSec: 12 },
  { id: 2, title: 'Calculadora Metabólica', sub: 'TMB & Gasto Real', startSec: 12, endSec: 24 },
  { id: 3, title: '3 Cardápios no Grama', sub: 'Comidas populares', startSec: 24, endSec: 38 },
  { id: 4, title: 'Montador de Treino', sub: 'Academia ou Casa', startSec: 38, endSec: 50 },
  { id: 5, title: 'PDF & Hábitos', sub: 'Download Oficial', startSec: 50, endSec: 60 },
];

export default function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentSec, setCurrentSec] = useState<number>(0);

  // Controle de reprodução contínua e suave do vídeo
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSec((prev) => {
        if (prev >= TOTAL_DURATION_SEC) {
          return 0; // loop
        }
        return +(prev + 0.1).toFixed(1);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  // Resetar ao abrir
  useEffect(() => {
    if (isOpen) {
      setCurrentSec(0);
      setIsPlaying(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentChapter =
    CHAPTERS.find((c) => currentSec >= c.startSec && currentSec < c.endSec) || CHAPTERS[0];

  const progressPercent = (currentSec / TOTAL_DURATION_SEC) * 100;

  const jumpTo = (sec: number) => {
    setCurrentSec(sec);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Container Principal */}
      <div className="relative w-full max-w-4xl bg-[#090e1a] border border-[#00f2fe]/40 rounded-2xl sm:rounded-3xl shadow-[0_0_80px_rgba(0,242,254,0.25)] overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* Header do Modal */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-[#1a2538] flex items-center justify-between bg-[#060912]/95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f2fe] to-[#00ff9d] flex items-center justify-center text-slate-950 font-black shadow-md shadow-[#00f2fe]/20 flex-shrink-0">
              <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-sm sm:text-base uppercase tracking-tight font-sans">
                  Tutorial: Como Usar o Nutri de Bolso
                </h3>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00ff9d]/15 text-[#00ff9d] border border-[#00ff9d]/30">
                  PASSO A PASSO
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-mono">
                Assista em 1 minuto como utilizar 100% dos recursos do seu plano
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0f172a] border border-[#1e293b] hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 text-slate-400 flex items-center justify-center transition-all cursor-pointer"
            title="Fechar"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* ÁREA DO VÍDEO (REPRODUÇÃO CINEMATOGRÁFICA) */}
        <div className="relative bg-[#04060a] p-3 sm:p-5 flex-1 overflow-y-auto">
          
          {/* Tela 16:9 Simulada do Vídeo */}
          <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl border border-[#00f2fe]/30 overflow-hidden bg-gradient-to-b from-[#080d18] to-[#03060c] flex flex-col justify-between p-4 sm:p-8 shadow-2xl">
            
            {/* Background Grid e Efeitos de Luz */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(0, 242, 254, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 242, 254, 0.08) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-40 bg-[#00f2fe]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar do Vídeo */}
            <div className="relative z-10 flex items-center justify-between border-b border-[#1a2538]/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
                <span className="text-[10px] sm:text-xs font-mono font-bold text-[#00f2fe] uppercase tracking-wider">
                  Etapa {currentChapter.id} de 5: {currentChapter.title}
                </span>
              </div>
              <div className="text-[10px] sm:text-xs font-mono text-slate-400">
                <strong className="text-white">{Math.floor(currentSec)}s</strong> / 60s
              </div>
            </div>

            {/* CONTEÚDO CENTRAL DINÂMICO CONFORME O TEMPO */}
            <div className="relative z-10 my-auto py-2">
              
              {/* ======================================================== */}
              {/* CENA 1: ACESSO RÁPIDO (0s - 12s)                          */}
              {/* ======================================================== */}
              {currentChapter.id === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-center animate-fadeIn">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 mb-2">
                      <ShieldCheck className="w-3 h-3" /> ACESSO IMEDIATO
                    </span>
                    <h4 className="text-lg sm:text-2xl font-black uppercase text-white tracking-tight leading-tight">
                      Basta colocar o <span className="text-[#00f2fe]">E-mail da sua compra</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      Não precisa decorar senhas. O mesmo e-mail que você utilizou no checkout da Ticto libera seu acesso na hora.
                    </p>
                  </div>
                  <div className="bg-[#080e1b] border border-[#00f2fe]/30 rounded-xl p-4 sm:p-5 shadow-lg">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
                      E-mail da Compra:
                    </span>
                    <div className="p-3 rounded-lg bg-[#04070f] border border-[#00f2fe] text-white font-mono text-xs sm:text-sm flex items-center justify-between">
                      <span>aluno.oficial@gmail.com</span>
                      <span className="w-2 h-4 bg-[#00f2fe] animate-pulse" />
                    </div>
                    <div className="mt-3 py-2.5 rounded-lg bg-gradient-to-r from-[#00f2fe] to-[#00ff9d] text-slate-950 font-black text-xs text-center uppercase font-mono shadow-md">
                      ACESSAR NUTRI DE BOLSO ➔
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* CENA 2: CALCULADORA & TMB (12s - 24s)                     */}
              {/* ======================================================== */}
              {currentChapter.id === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-center animate-fadeIn">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 mb-2">
                      <Zap className="w-3 h-3" /> ETAPA 01: BIOMETRIA
                    </span>
                    <h4 className="text-lg sm:text-2xl font-black uppercase text-white tracking-tight leading-tight">
                      Cálculo da Taxa <span className="text-[#00ff9d]">Metabólica Real</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      Preencha seu peso, altura, idade e rotina. O algoritmo Mifflin-St Jeor calcula seu gasto calórico exato.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-[#080e1b] border border-[#00f2fe]/30 rounded-xl p-3 text-center">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">TMB (Repouso)</span>
                      <strong className="text-xl sm:text-2xl font-black text-white font-mono block my-1">
                        1.845 <span className="text-xs text-[#00f2fe]">kcal</span>
                      </strong>
                      <span className="text-[10px] text-slate-400">Queima do seu corpo parado</span>
                    </div>
                    <div className="bg-[#080e1b] border border-[#00ff9d]/30 rounded-xl p-3 text-center">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Gasto Total (TDEE)</span>
                      <strong className="text-xl sm:text-2xl font-black text-[#00ff9d] font-mono block my-1">
                        2.520 <span className="text-xs text-[#00ff9d]">kcal</span>
                      </strong>
                      <span className="text-[10px] text-slate-400">Com treinos e rotina diária</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* CENA 3: 3 CARDÁPIOS NO GRAMA (24s - 38s)                  */}
              {/* ======================================================== */}
              {currentChapter.id === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-center animate-fadeIn">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 mb-2">
                      <Utensils className="w-3 h-3" /> ETAPA 02: CARDÁPIOS
                    </span>
                    <h4 className="text-lg sm:text-2xl font-black uppercase text-white tracking-tight leading-tight">
                      3 Cardápios Completos <span className="text-[#00f2fe]">Pesados no Grama</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      Alimentos baratos e de feira: arroz, feijão, frango, ovos e frutas na balança para você nunca errar a dose.
                    </p>
                  </div>
                  <div className="bg-[#080e1b] border border-[#00ff9d]/30 rounded-xl p-3.5 space-y-2">
                    <div className="p-2 rounded bg-[#04070f] border-l-2 border-[#00f2fe] text-xs text-slate-200 flex justify-between items-center">
                      <span>• <strong>Café:</strong> 3 Ovos + 50g Aveia + Banana</span>
                      <span className="font-mono text-[#00f2fe] font-bold text-[11px]">420 kcal</span>
                    </div>
                    <div className="p-2 rounded bg-[#04070f] border-l-2 border-[#00ff9d] text-xs text-slate-200 flex justify-between items-center">
                      <span>• <strong>Almoço:</strong> 180g Arroz + 100g Feijão + 160g Frango</span>
                      <span className="font-mono text-[#00ff9d] font-bold text-[11px]">610 kcal</span>
                    </div>
                    <div className="p-2 rounded bg-[#04070f] border-l-2 border-purple-400 text-xs text-slate-200 flex justify-between items-center">
                      <span>• <strong>Jantar:</strong> 200g Batata doce + 150g Carne moída</span>
                      <span className="font-mono text-purple-300 font-bold text-[11px]">520 kcal</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* CENA 4: MONTADOR DE TREINO (38s - 50s)                    */}
              {/* ======================================================== */}
              {currentChapter.id === 4 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-center animate-fadeIn">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 mb-2">
                      <Dumbbell className="w-3 h-3" /> ETAPA 03: TREINOS
                    </span>
                    <h4 className="text-lg sm:text-2xl font-black uppercase text-white tracking-tight leading-tight">
                      Ficha Pronta para <span className="text-[#00ff9d]">Academia ou Casa</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      Séries, repetições, intervalos e finalizador de queima calórica estruturados para o seu nível físico.
                    </p>
                  </div>
                  <div className="bg-[#080e1b] border border-[#00f2fe]/30 rounded-xl p-3.5 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-white border-b border-[#1a2538] pb-1.5">
                      <span>DIVISÃO ABCD: PEITO & TRÍCEPS</span>
                      <span className="text-[#00ff9d] font-mono text-[11px]">4x 10-12 reps</span>
                    </div>
                    <div className="p-2 rounded bg-[#04070f] text-xs text-slate-300">
                      1. Supino Reto com Barra (4x 8-12)
                    </div>
                    <div className="p-2 rounded bg-[#04070f] text-xs text-slate-300">
                      2. Desenvolvimento Halteres (3x 10-12)
                    </div>
                    <div className="p-2 rounded bg-[#00ff9d]/10 border border-[#00ff9d]/30 text-xs text-[#00ff9d] font-bold">
                      🔥 Finalizador: 15 min cárdio ou 7.000 passos
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* CENA 5: PDF OFICIAL & CHECKLIST (50s - 60s)               */}
              {/* ======================================================== */}
              {currentChapter.id === 5 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-center animate-fadeIn">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 mb-2">
                      <Sparkles className="w-3 h-3" /> ETAPA 04: RESULTADO
                    </span>
                    <h4 className="text-lg sm:text-2xl font-black uppercase text-white tracking-tight leading-tight">
                      Baixe seu <span className="text-[#00ff9d]">PDF Oficial Completo</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      Gere o relatório oficial com as 3 opções de cardápios e seus treinos prontos para abrir no WhatsApp ou imprimir.
                    </p>
                  </div>
                  <div className="bg-[#080e1b] border border-[#00ff9d]/40 rounded-xl p-4 text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#00f2fe] to-[#00ff9d] mx-auto flex items-center justify-center text-slate-950 font-black mb-3">
                      <Download className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <span className="font-mono text-xs font-bold text-white uppercase block mb-1">
                      RELATÓRIO PRONTO PARA DOWNLOAD
                    </span>
                    <span className="text-[11px] text-slate-400 block mb-3">
                      Inclui checklist de água, hábitos e substituições
                    </span>
                    <div className="py-2 px-3 rounded-lg bg-[#00ff9d] text-slate-950 font-black text-xs uppercase font-mono shadow-md">
                      BAIXAR MEU PLANO EM PDF ➔
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Barra de Progresso Fina do Vídeo */}
            <div className="relative z-10 w-full bg-[#162032] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00f2fe] to-[#00ff9d] transition-all duration-100 shadow-[0_0_10px_#00f2fe]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Controles do Vídeo */}
            <div className="relative z-10 flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg bg-[#0f172a] border border-[#1e293b] hover:border-[#00f2fe] text-white transition-colors cursor-pointer"
                  title={isPlaying ? 'Pausar' : 'Reproduzir'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <button
                  type="button"
                  onClick={() => jumpTo(0)}
                  className="p-1.5 rounded-lg bg-[#0f172a] border border-[#1e293b] hover:border-[#00f2fe] text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[10px] sm:text-xs text-slate-400 font-mono">
                {isPlaying ? '▶ Reproduzindo Tutorial...' : '⏸ Pausado'}
              </span>
            </div>

          </div>

          {/* ATALHOS DE CAPÍTULOS ABAIXO DO VÍDEO */}
          <div className="mt-3.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
              Pular Direto para uma Funcionalidade:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CHAPTERS.map((ch) => {
                const isActive = currentChapter.id === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => jumpTo(ch.startSec)}
                    className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'bg-[#00f2fe]/15 border-[#00f2fe] text-white shadow-sm shadow-[#00f2fe]/20'
                        : 'bg-[#0a0f1d] border-[#1a2538] text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                      <span className={isActive ? 'text-[#00f2fe]' : 'text-slate-500'}>
                        0{ch.id}
                      </span>
                      <Play className="w-2.5 h-2.5 opacity-60" />
                    </div>
                    <div className="text-xs font-bold font-sans line-clamp-1">
                      {ch.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Rodapé com Botão de Ação */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-[#1a2538] bg-[#060912] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-mono hidden sm:flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9d]" />
            Tutorial 100% atualizado com a versão 2026/2027.
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-[#00f2fe] to-[#00ff9d] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#00f2fe]/20 uppercase font-mono"
          >
            <span>ENTENDI, COMEÇAR MEU PLANO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
