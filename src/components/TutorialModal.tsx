'use client';

import React, { useRef, useState } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import {
  TutorialComposition,
  TUTORIAL_FPS,
  TUTORIAL_TOTAL_FRAMES,
  TUTORIAL_CHAPTERS,
} from '@/remotion/TutorialComposition';
import {
  X,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Dumbbell,
  ArrowRight,
} from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const playerRef = useRef<PlayerRef>(null);
  const [activeChapterId, setActiveChapterId] = useState<number>(1);

  if (!isOpen) return null;

  const jumpToChapter = (chapterId: number, startSec: number) => {
    setActiveChapterId(chapterId);
    if (playerRef.current) {
      playerRef.current.seekTo(Math.round(startSec * TUTORIAL_FPS));
      playerRef.current.play();
    }
  };

  const handleRestart = () => {
    setActiveChapterId(1);
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.play();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Container Principal do Modal */}
      <div className="relative w-full max-w-4xl bg-[#090e1a] border border-[#00f2fe]/30 rounded-2xl sm:rounded-3xl shadow-[0_0_60px_rgba(0,242,254,0.2)] overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header do Modal */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-[#1a2538] flex items-center justify-between bg-[#060912]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f2fe] to-[#00ff9d] flex items-center justify-center text-slate-950 font-black shadow-md shadow-[#00f2fe]/20">
              <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base sm:text-lg uppercase tracking-tight font-sans">
                  Tutorial: Como Usar o Nutri de Bolso
                </h3>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00ff9d]/15 text-[#00ff9d] border border-[#00ff9d]/30">
                  VÍDEO OFICIAL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Aprenda a calcular seus macros, escolher os cardápios e baixar seu PDF
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#0f172a] border border-[#1e293b] hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 text-slate-400 flex items-center justify-center transition-all cursor-pointer"
            title="Fechar Tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player de Vídeo em 16:9 */}
        <div className="p-4 sm:p-6 bg-[#04060a] flex-1 overflow-y-auto">
          <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden border border-[#00f2fe]/25 shadow-2xl bg-black">
            <Player
              ref={playerRef}
              component={TutorialComposition}
              durationInFrames={TUTORIAL_TOTAL_FRAMES}
              fps={TUTORIAL_FPS}
              compositionWidth={1920}
              compositionHeight={1080}
              style={{
                width: '100%',
                aspectRatio: '16 / 9',
              }}
              controls
              autoPlay={true}
              loop={true}
              acknowledgeRemotionLicense={true}
            />
          </div>

          {/* Atalhos Rápidos para os Capítulos do Vídeo */}
          <div className="mt-4 pt-3 border-t border-[#141d2f]">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
              Pular Direto para uma Funcionalidade:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {TUTORIAL_CHAPTERS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => jumpToChapter(ch.id, ch.startSec)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeChapterId === ch.id
                      ? 'bg-[#00f2fe]/15 border-[#00f2fe] text-white shadow-sm shadow-[#00f2fe]/20'
                      : 'bg-[#0a0f1d] border-[#1a2538] text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                    <span className={activeChapterId === ch.id ? 'text-[#00f2fe]' : 'text-slate-500'}>
                      0{ch.id}
                    </span>
                    <Play className="w-2.5 h-2.5 opacity-60" />
                  </div>
                  <div className="text-xs font-bold font-sans line-clamp-1">
                    {ch.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé do Modal com Ação Rápida */}
        <div className="px-5 py-4 border-t border-[#1a2538] bg-[#070b14] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleRestart}
            className="text-xs font-mono text-slate-400 hover:text-[#00f2fe] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar Vídeo desde o Início
          </button>

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
