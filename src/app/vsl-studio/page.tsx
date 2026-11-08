'use client';

import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { VslComposition } from '@/remotion/VslComposition';
import {
  TOTAL_VSL_DURATION_SEC,
  VSL_BROLLS,
  VSL_CAPTIONS,
  VSL_SEGMENTS,
  mapSrcTimeToOutTime,
} from '@/remotion/vslData';
import {
  Film,
  Sparkles,
  Volume2,
  Scissors,
  Subtitles,
  Layers,
  CheckCircle2,
  Play,
  Terminal,
} from 'lucide-react';

export default function VslStudioPage() {
  const [topHeadline, setTopHeadline] = useState('O FIM DA "TETINHA" EM 30 DIAS');
  const [topSubheadline, setTopSubheadline] = useState('PROTOCOLO BIOMECÂNICO + ANTI-AROMATASE');
  const [ctaButtonText, setCtaButtonText] = useState('QUERO SECAR MEU PEITORAL AGORA ➔');
  const [ctaPriceText, setCtaPriceText] = useState('ACESSO VITALÍCIO POR APENAS R$ 67,00');

  const [enableJumpCuts, setEnableJumpCuts] = useState(true);
  const [enableBrolls, setEnableBrolls] = useState(true);
  const [enableCaptions, setEnableCaptions] = useState(true);
  const [enableSfx, setEnableSfx] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(0.08);

  const fps = 30;
  const durationInFrames = enableJumpCuts
    ? Math.ceil(TOTAL_VSL_DURATION_SEC * fps)
    : Math.ceil(239.0 * fps);

  return (
    <div className="min-h-screen bg-[#07090e] text-white font-sans">
      {/* Header */}
      <header className="border-b border-lime-500/20 bg-[#0b0f17]/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-500/20 border border-lime-500/40 flex items-center justify-center text-lime-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-wide text-white uppercase">
                VSL Studio Pro • Seca Peitoral
              </h1>
              <p className="text-xs text-slate-400">
                Formato Vertical 9:16 (1080x1920) • {VSL_SEGMENTS.length} Jump Cuts • {VSL_BROLLS.length} B-Rolls • {VSL_CAPTIONS.length} Blocos de Legenda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="px-3 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Tempo Original: 3m59s ➔ Editado: 3m24s (-35s de pausas)
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Live 9:16 Player */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[380px] rounded-3xl overflow-hidden border-2 border-lime-500/30 shadow-[0_0_50px_rgba(132,204,22,0.15)] bg-black">
            <Player
              component={VslComposition}
              inputProps={{
                topHeadline,
                topSubheadline,
                ctaButtonText,
                ctaPriceText,
                enableJumpCuts,
                enableBrolls,
                enableCaptions,
                enableSfx,
                bgmVolume,
              }}
              durationInFrames={durationInFrames}
              fps={fps}
              compositionWidth={1080}
              compositionHeight={1920}
              style={{
                width: '100%',
                aspectRatio: '9 / 16',
              }}
              controls
              autoPlay={false}
            />
          </div>
        </div>

        {/* Right: Controls & B-Roll Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {/* Layer Toggles */}
          <div className="bg-[#0d131f] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-lime-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Camadas Ativas na Edição VSL
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 cursor-pointer hover:border-lime-500/40 transition">
                <span className="flex items-center gap-2.5 text-sm font-medium">
                  <Scissors className="w-4 h-4 text-lime-400" />
                  Jump Cuts + Zoom Dinâmico
                </span>
                <input
                  type="checkbox"
                  checked={enableJumpCuts}
                  onChange={(e) => setEnableJumpCuts(e.target.checked)}
                  className="w-4 h-4 accent-lime-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 cursor-pointer hover:border-lime-500/40 transition">
                <span className="flex items-center gap-2.5 text-sm font-medium">
                  <Layers className="w-4 h-4 text-lime-400" />
                  B-Rolls + Cards Táticos ({VSL_BROLLS.length})
                </span>
                <input
                  type="checkbox"
                  checked={enableBrolls}
                  onChange={(e) => setEnableBrolls(e.target.checked)}
                  className="w-4 h-4 accent-lime-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 cursor-pointer hover:border-lime-500/40 transition">
                <span className="flex items-center gap-2.5 text-sm font-medium">
                  <Subtitles className="w-4 h-4 text-lime-400" />
                  Legendas Hormozi (Palavra a Palavra)
                </span>
                <input
                  type="checkbox"
                  checked={enableCaptions}
                  onChange={(e) => setEnableCaptions(e.target.checked)}
                  className="w-4 h-4 accent-lime-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 cursor-pointer hover:border-lime-500/40 transition">
                <span className="flex items-center gap-2.5 text-sm font-medium">
                  <Volume2 className="w-4 h-4 text-lime-400" />
                  Efeitos Sonoros (Whoosh/Impact/Cash)
                </span>
                <input
                  type="checkbox"
                  checked={enableSfx}
                  onChange={(e) => setEnableSfx(e.target.checked)}
                  className="w-4 h-4 accent-lime-500"
                />
              </label>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Volume da Trilha Sonora Tática de Fundo (BGM)</span>
                <span className="text-lime-400 font-bold">{Math.round(bgmVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={0.35}
                step={0.01}
                value={bgmVolume}
                onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
                className="w-full accent-lime-500"
              />
            </div>
          </div>

          {/* Text Customizer */}
          <div className="bg-[#0d131f] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-lime-400">
              Personalizar Headlines & CTA
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Subtítulo Topo (Tag)</label>
                <input
                  type="text"
                  value={topSubheadline}
                  onChange={(e) => setTopSubheadline(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Headline Fixa do Topo</label>
                <input
                  type="text"
                  value={topHeadline}
                  onChange={(e) => setTopHeadline(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Texto de Ancoragem / Preço</label>
                <input
                  type="text"
                  value={ctaPriceText}
                  onChange={(e) => setCtaPriceText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Texto do Botão CTA Final</label>
                <input
                  type="text"
                  value={ctaButtonText}
                  onChange={(e) => setCtaButtonText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
            </div>
          </div>

          {/* B-Roll Timeline List */}
          <div className="bg-[#0d131f] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-lime-400 flex items-center gap-2">
              <Play className="w-4 h-4" /> Roteiro de B-Rolls Sincronizados ({VSL_BROLLS.length} Cenas)
            </h2>

            <div className="max-h-72 overflow-y-auto space-y-2.5 pr-2">
              {VSL_BROLLS.map((b, idx) => {
                const outS = mapSrcTimeToOutTime(b.srcStart);
                const outE = mapSrcTimeToOutTime(b.srcEnd);
                return (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span className="text-lime-400">#{idx + 1}</span>
                        <span>{b.title}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase text-[10px]">
                          {b.type}
                        </span>
                      </div>
                      <p className="text-slate-400">{b.subtitle}</p>
                    </div>
                    <div className="text-right font-mono text-lime-400 shrink-0 ml-4">
                      {outS.toFixed(1)}s – {outE.toFixed(1)}s
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Export Info */}
          <div className="bg-lime-500/10 border border-lime-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-300">
            <Terminal className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white mb-1">Arquivo MP4 Final Renderizado:</p>
              <p>
                A versão final em alta definição (1080x1920, H.264, 30fps) também é exportada diretamente para{' '}
                <code className="text-lime-300 bg-black/40 px-1.5 py-0.5 rounded">
                  C:\Users\richard\Downloads\VSL-SECA-PEITORAL-FINAL.mp4
                </code>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
