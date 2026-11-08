import React, { useEffect, useState } from 'react';
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  GUARANTEE_BADGE_END_SEC,
  GUARANTEE_BADGE_START_SEC,
  mapSrcTimeToOutTime,
  OFFER_CTA_START_SEC,
  VSL_BROLLS,
  VSL_CAPTIONS,
  VSL_SEGMENTS,
  VSL_SFX_EVENTS,
  VslBrollItem,
  VslCaptionChunk,
} from './vslData';

export interface VslProps {
  topHeadline?: string;
  topSubheadline?: string;
  ctaButtonText?: string;
  ctaPriceText?: string;
  enableJumpCuts?: boolean;
  enableBrolls?: boolean;
  enableCaptions?: boolean;
  enableSfx?: boolean;
  bgmVolume?: number;
}

const FONT_FAMILY = "'TheBoldFont', 'Impact', 'Arial Black', sans-serif";

const ACCENT_HEX: Record<'green' | 'yellow' | 'red', string> = {
  green: '#84cc16',  // Tactical lime green
  yellow: '#facc15', // High-retention VSL yellow
  red: '#ef4444',    // Danger / Pain red
};

export const VslComposition: React.FC<VslProps> = ({
  topHeadline = 'O FIM DA "TETINHA" NESSE VERÃO',
  topSubheadline = 'APP QG SECA PEITORAL • ANTI-AROMATASE',
  ctaButtonText = 'QUERO DESTRAVAR MEU ACESSO AGORA ➔',
  ctaPriceText = 'ACESSO VITALÍCIO POR APENAS R$ 107,90',
  enableJumpCuts = true,
  enableBrolls = true,
  enableCaptions = true,
  enableSfx = false,
  bgmVolume = 0.08,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [fontHandle] = useState(() => delayRender('Loading TheBoldFont'));

  useEffect(() => {
    const font = new FontFace('TheBoldFont', `url(${staticFile('theboldfont.ttf')})`);
    font
      .load()
      .then(() => {
        document.fonts.add(font);
        continueRender(fontHandle);
      })
      .catch(() => {
        continueRender(fontHandle);
      });
  }, [fontHandle]);

  // Compute current source timestamp and active segment zoom
  const currentOutSec = frame / fps;
  const activeSeg =
    VSL_SEGMENTS.find((s) => currentOutSec >= s.outStart && currentOutSec <= s.outEnd) ||
    VSL_SEGMENTS[VSL_SEGMENTS.length - 1];
  const currentSrcSec = enableJumpCuts
    ? activeSeg.srcStart + (currentOutSec - activeSeg.outStart)
    : currentOutSec;

  // Active B-roll at current source time
  const activeBroll: VslBrollItem | undefined = enableBrolls
    ? VSL_BROLLS.find((b) => currentSrcSec >= b.srcStart && currentSrcSec <= b.srcEnd)
    : undefined;

  // Active Caption at current source time
  const activeCaption: VslCaptionChunk | undefined = enableCaptions
    ? VSL_CAPTIONS.find((c) => currentSrcSec >= c.srcStart && currentSrcSec <= c.srcEnd)
    : undefined;

  // Show pitch / offer CTA card and 30-day guarantee badge at exact script timestamps
  const showOfferCta = currentSrcSec >= OFFER_CTA_START_SEC;
  const showGuaranteeBadge =
    currentSrcSec >= GUARANTEE_BADGE_START_SEC && currentSrcSec <= GUARANTEE_BADGE_END_SEC;

  return (
    <AbsoluteFill style={{ backgroundColor: '#07090e', overflow: 'hidden', fontFamily: FONT_FAMILY }}>
      {/* 1. BASE LAYER: PRE-CUT LINEAR VSL STREAM WITH DYNAMIC JUMP-CUT ZOOM */}
      <OffthreadVideo
        src={staticFile('vsl/main-vsl-cut.mp4')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${activeSeg?.zoom ?? 1})`,
          transformOrigin: `50% ${activeSeg?.originY || '32%'}`,
        }}
      />

      {/* 2. CINEMATIC VIGNETTE & GRADIENT SCRIM FOR TEXT LEGIBILITY */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.12) 18%, rgba(0,0,0,0.08) 55%, rgba(0,0,0,0.88) 88%, rgba(0,0,0,0.96) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* 3. B-ROLL OVERLAY LAYER */}
      {enableBrolls &&
        VSL_BROLLS.map((broll) => {
          const outStart = mapSrcTimeToOutTime(broll.srcStart);
          const outEnd = mapSrcTimeToOutTime(broll.srcEnd);
          const fromFrame = Math.max(0, Math.round(outStart * fps));
          const durFrames = Math.max(1, Math.round((outEnd - outStart) * fps));

          return (
            <Sequence key={broll.id} from={fromFrame} durationInFrames={durFrames}>
              <BrollOverlay broll={broll} durationInFrames={durFrames} />
            </Sequence>
          );
        })}

      {/* 4. TOP TACTICAL VSL BANNER (NO PROGRESS BAR) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Top Headline Pill */}
        <div
          style={{
            marginTop: 32,
            padding: '14px 30px',
            backgroundColor: 'rgba(10, 14, 20, 0.92)',
            border: '2px solid rgba(132, 204, 22, 0.65)',
            borderRadius: 18,
            boxShadow: '0 12px 32px rgba(0,0,0,0.75)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '92%',
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 2.5,
              color: '#a3e635',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 800,
              marginBottom: 4,
              textTransform: 'uppercase',
            }}
          >
            ⚡ {topSubheadline}
          </div>
          <div
            style={{
              fontSize: 40,
              color: '#ffffff',
              letterSpacing: 1,
              textAlign: 'center',
              lineHeight: 1.08,
              textShadow: '0 4px 12px rgba(0,0,0,0.9)',
            }}
          >
            {topHeadline}
          </div>
        </div>
      </div>

      {/* 5. GUARANTEE BADGE FLOATING OVERLAY */}
      {showGuaranteeBadge && (
        <div
          style={{
            position: 'absolute',
            top: 200,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 35,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '3px solid #facc15',
            borderRadius: 20,
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            boxShadow: '0 15px 40px rgba(0,0,0,0.85)',
          }}
        >
          <div style={{ fontSize: 54 }}>🛡️</div>
          <div>
            <div style={{ color: '#facc15', fontSize: 32, lineHeight: 1.05 }}>
              GARANTIA INCONDICIONAL DE 30 DIAS
            </div>
            <div
              style={{
                color: '#e2e8f0',
                fontSize: 22,
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 700,
              }}
            >
              Risco Zero: 100% do seu dinheiro de volta em 1 clique
            </div>
          </div>
        </div>
      )}

      {/* 6. HORMOZI-STYLE WORD-BY-WORD DYNAMIC CAPTIONS */}
      {activeCaption && (
        <DynamicCaptionBar
          caption={activeCaption}
          currentSrcSec={currentSrcSec}
          hasOfferCta={showOfferCta}
        />
      )}

      {/* 7. LOWER CTA BANNER DURING PITCH & CLOSE (185s -> END) */}
      {showOfferCta && (
        <OfferCtaBanner
          frame={frame}
          fps={fps}
          ctaButtonText={ctaButtonText}
          ctaPriceText={ctaPriceText}
        />
      )}

      {/* 8. BACKGROUND MUSIC (LOOPED) + SOUND EFFECTS */}
      {bgmVolume > 0 && (
        <Audio
          src={staticFile('vsl/audio/bgm-tactical.wav')}
          loop
          volume={bgmVolume}
        />
      )}

      {enableSfx &&
        VSL_SFX_EVENTS.map((ev, i) => {
          const outTime = mapSrcTimeToOutTime(ev.srcTime);
          const fromFrame = Math.max(0, Math.round(outTime * fps));
          return (
            <Sequence key={`sfx-${i}`} from={fromFrame} durationInFrames={Math.round(fps * 1.6)}>
              <Audio
                src={staticFile(`vsl/audio/sfx-${ev.sfx}.wav`)}
                volume={ev.volume ?? 0.6}
              />
            </Sequence>
          );
        })}
    </AbsoluteFill>
  );
};

const BrollOverlay: React.FC<{
  broll: VslBrollItem;
  durationInFrames: number;
}> = ({ broll, durationInFrames }) => {
  const frame = useCurrentFrame();

  const enterOpacity = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: 'clamp' });
  const exitOpacity = interpolate(
    frame,
    [Math.max(0, durationInFrames - 6), durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const opacity = Math.min(enterOpacity, exitOpacity);

  const scale = interpolate(frame, [0, durationInFrames], [1.02, 1.12], {
    extrapolateRight: 'clamp',
  });

  const accentColor = ACCENT_HEX[broll.accent || 'green'];

  return (
    <AbsoluteFill
      style={{
        opacity,
        zIndex: 15,
        backgroundColor: '#070a0f',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Background blurred fill for contain images */}
      {broll.fit === 'contain' && broll.type === 'image' && (
        <Img
          src={staticFile(broll.src)}
          style={{
            position: 'absolute',
            width: '115%',
            height: '115%',
            objectFit: 'cover',
            filter: 'blur(28px) brightness(0.32)',
          }}
        />
      )}

      {/* Main B-roll visual */}
      <div
        style={{
          width: '100%',
          height: broll.fit === 'contain' ? '68%' : '100%',
          marginTop: broll.fit === 'contain' ? -60 : 0,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {broll.type === 'image' ? (
          <Img
            src={staticFile(broll.src)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: broll.fit || 'cover',
              transform: broll.fit === 'contain' ? `scale(${1 + (scale - 1) * 0.4})` : `scale(${scale})`,
            }}
          />
        ) : (
          <OffthreadVideo
            src={staticFile(broll.src)}
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: broll.fit || 'cover',
              transform: `scale(${scale})`,
            }}
          />
        )}
      </div>

      {/* Dark gradient overlay for captions and HUD card */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.92) 85%, rgba(0,0,0,0.98) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Tactical HUD Card on B-Roll */}
      {(broll.badge || broll.title) && (
        <div
          style={{
            position: 'absolute',
            top: 205,
            left: 44,
            right: 44,
            backgroundColor: 'rgba(9, 13, 22, 0.90)',
            borderLeft: `8px solid ${accentColor}`,
            borderRadius: '0 16px 16px 0',
            padding: '16px 24px',
            boxShadow: '0 14px 34px rgba(0,0,0,0.8)',
          }}
        >
          {broll.badge && (
            <div
              style={{
                color: accentColor,
                fontSize: 22,
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 900,
                letterSpacing: 2,
                marginBottom: 4,
              }}
            >
              ● {broll.badge}
            </div>
          )}
          {broll.title && (
            <div
              style={{
                color: '#ffffff',
                fontSize: 38,
                lineHeight: 1.08,
                letterSpacing: 0.8,
              }}
            >
              {broll.title}
            </div>
          )}
          {broll.subtitle && (
            <div
              style={{
                color: '#cbd5e1',
                fontSize: 23,
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 600,
                marginTop: 6,
                lineHeight: 1.25,
              }}
            >
              {broll.subtitle}
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

const DynamicCaptionBar: React.FC<{
  caption: VslCaptionChunk;
  currentSrcSec: number;
  hasOfferCta: boolean;
}> = ({ caption, currentSrcSec, hasOfferCta }) => {
  const words = caption.text.split(/\s+/);
  const progress = Math.min(
    0.999,
    Math.max(0, (currentSrcSec - caption.srcStart) / Math.max(0.2, caption.srcEnd - caption.srcStart))
  );
  const activeWordIdx = Math.floor(progress * words.length);
  const accentHex = ACCENT_HEX[caption.accentColor || 'green'];

  const normalize = (w: string) =>
    w.replace(/[.,!?:;"]/g, '').toLowerCase();

  const highlightSet = new Set(
    (caption.highlightWords || []).map((w) => normalize(w))
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: hasOfferCta ? 340 : 180,
        left: 40,
        right: 40,
        zIndex: 40,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(8, 11, 18, 0.82)',
          border: '2px solid rgba(255,255,255,0.14)',
          borderRadius: 24,
          padding: '22px 30px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.85)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px 14px',
          maxWidth: 980,
        }}
      >
        {words.map((word, idx) => {
          const isCurrent = idx === activeWordIdx;
          const isImportant = highlightSet.has(normalize(word));

          let textColor = '#ffffff';
          if (isCurrent || isImportant) {
            textColor = accentHex;
          }

          return (
            <span
              key={idx}
              style={{
                fontSize: isCurrent || isImportant ? 62 : 56,
                lineHeight: 1.12,
                color: textColor,
                textTransform: 'uppercase',
                transform: isCurrent ? 'scale(1.12) translateY(-3px)' : 'scale(1)',
                display: 'inline-block',
                padding: isCurrent ? '2px 10px' : '0px',
                backgroundColor: isCurrent ? 'rgba(255,255,255,0.10)' : 'transparent',
                borderRadius: 10,
                textShadow:
                  '0 4px 0 #000, 0 -2px 0 #000, 3px 0 0 #000, -3px 0 0 #000, 0 8px 20px rgba(0,0,0,0.95)',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const OfferCtaBanner: React.FC<{
  frame: number;
  fps: number;
  ctaButtonText: string;
  ctaPriceText: string;
}> = ({ frame, fps, ctaButtonText, ctaPriceText }) => {
  const pulse = 1 + 0.035 * Math.sin((frame / fps) * Math.PI * 3);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 48,
        left: 44,
        right: 44,
        zIndex: 45,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
      }}
    >
      {/* Price & Anchor Tag */}
      <div
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          border: '2px solid rgba(132, 204, 22, 0.5)',
          borderRadius: 14,
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span
          style={{
            color: '#94a3b8',
            fontSize: 24,
            textDecoration: 'line-through',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 700,
          }}
        >
          De R$ 1.200/mês
        </span>
        <span style={{ color: '#facc15', fontSize: 28, letterSpacing: 1 }}>
          {ctaPriceText}
        </span>
      </div>

      {/* Pulsing Green CTA Button */}
      <div
        style={{
          width: '100%',
          padding: '26px 32px',
          borderRadius: 22,
          background: 'linear-gradient(90deg, #65a30d 0%, #84cc16 50%, #4d7c0f 100%)',
          boxShadow: '0 0 40px rgba(132, 204, 22, 0.75), 0 12px 28px rgba(0,0,0,0.9)',
          border: '3px solid #ecfccb',
          transform: `scale(${pulse})`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            color: '#052e16',
            fontSize: 44,
            letterSpacing: 1.2,
            textShadow: '0 1px 0 rgba(255,255,255,0.4)',
          }}
        >
          {ctaButtonText}
        </span>
      </div>
    </div>
  );
};
