import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  Dumbbell,
  CheckCircle2,
  Flame,
  Utensils,
  Download,
  ShieldCheck,
  Zap,
  Target,
  ArrowRight,
  Sparkles,
  Scale,
  Calendar,
  Check,
  FileText,
  User,
  Activity,
  Play,
} from 'lucide-react';

export interface TutorialProps {
  appName?: string;
  accentColor?: string;
}

export const TUTORIAL_FPS = 30;
export const TUTORIAL_DURATION_SEC = 60; // 60 segundos dinâmicos e completos
export const TUTORIAL_TOTAL_FRAMES = TUTORIAL_DURATION_SEC * TUTORIAL_FPS; // 1800 frames

// Definição dos 5 Capítulos do Tutorial
export const TUTORIAL_CHAPTERS = [
  { id: 1, title: 'Acesso Rápido', sub: 'Login por E-mail', startSec: 0, endSec: 10 },
  { id: 2, title: 'Metabolismo', sub: 'Cálculo TMB & Gasto', startSec: 10, endSec: 22 },
  { id: 3, title: 'Objetivo & Cardápios', sub: '3 Opções no Grama', startSec: 22, endSec: 36 },
  { id: 4, title: 'Montador de Treino', sub: 'Academia ou Casa', startSec: 36, endSec: 48 },
  { id: 5, title: 'PDF & Hábitos', sub: 'Download Oficial', startSec: 48, endSec: 60 },
];

export const TutorialComposition: React.FC<TutorialProps> = ({
  appName = 'Nutri de Bolso',
  accentColor = '#00f2fe',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const currentTimeSec = frame / fps;
  const progressPercent = Math.min(100, (frame / TUTORIAL_TOTAL_FRAMES) * 100);

  // Capítulo Atual
  const currentChapter =
    TUTORIAL_CHAPTERS.find(
      (c) => currentTimeSec >= c.startSec && currentTimeSec < c.endSec
    ) || TUTORIAL_CHAPTERS[TUTORIAL_CHAPTERS.length - 1];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#04060a',
        fontFamily: "'Inter', sans-serif",
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* Background Holográfico e Grade Tecnológica */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 242, 254, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 242, 254, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.8,
        }}
      />

      {/* Brilhos Radiais de Luz */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '20%',
          width: '700px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.15) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '15%',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0, 255, 157, 0.12) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* TOP BAR / NAVBAR DO VÍDEO */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '90px',
          padding: '0 60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0, 242, 254, 0.2)',
          background: 'rgba(6, 9, 17, 0.85)',
          backdropFilter: 'blur(20px)',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #00f2fe, #00ff9d)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)',
            }}
          >
            <Dumbbell size={24} color="#04060a" strokeWidth={2.5} />
          </div>
          <div>
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '22px',
                fontWeight: 900,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#fff',
              }}
            >
              NUTRI <strong style={{ color: '#00f2fe' }}>DE BOLSO</strong>
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '11px',
                color: '#00ff9d',
                fontFamily: 'monospace',
                letterSpacing: '2px',
                fontWeight: 700,
              }}
            >
              GUIA OFICIAL PASSO A PASSO
            </span>
          </div>
        </div>

        {/* Indicador de Capítulo no Topo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '999px',
              background: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#00ff9d',
                boxShadow: '0 0 8px #00ff9d',
              }}
            />
            <span
              style={{
                fontSize: '13px',
                fontFamily: 'monospace',
                fontWeight: 800,
                color: '#00f2fe',
                textTransform: 'uppercase',
              }}
            >
              ETAPA {currentChapter.id} DE 5 • {currentChapter.title}
            </span>
          </div>
        </div>
      </div>

      {/* ÁREA CENTRAL PRINCIPAL: TROCA DE CENAS COM BASE NO TEMPO */}
      <div
        style={{
          position: 'absolute',
          top: '90px',
          bottom: '80px',
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 80px',
        }}
      >
        {/* ======================================================== */}
        {/* CENA 1: ACESSO IMEDIATO & LOGIN POR E-MAIL (0s - 10s)     */}
        {/* ======================================================== */}
        {currentTimeSec < 10 && (
          <SceneLogin frame={frame} fps={fps} />
        )}

        {/* ======================================================== */}
        {/* CENA 2: ETAPA 1 - CALCULADORA METABÓLICA (10s - 22s)      */}
        {/* ======================================================== */}
        {currentTimeSec >= 10 && currentTimeSec < 22 && (
          <SceneMetabolismo frame={frame - 10 * fps} fps={fps} />
        )}

        {/* ======================================================== */}
        {/* CENA 3: ETAPA 2 - 3 CARDÁPIOS NO GRAMA (22s - 36s)       */}
        {/* ======================================================== */}
        {currentTimeSec >= 22 && currentTimeSec < 36 && (
          <SceneCardapios frame={frame - 22 * fps} fps={fps} />
        )}

        {/* ======================================================== */}
        {/* CENA 4: ETAPA 3 - MONTADOR DE TREINO (36s - 48s)         */}
        {/* ======================================================== */}
        {currentTimeSec >= 36 && currentTimeSec < 48 && (
          <SceneTreino frame={frame - 36 * fps} fps={fps} />
        )}

        {/* ======================================================== */}
        {/* CENA 5: ETAPA 4 - PDF OFICIAL & CHECKLIST (48s - 60s)    */}
        {/* ======================================================== */}
        {currentTimeSec >= 48 && (
          <ScenePdfHabitos frame={frame - 48 * fps} fps={fps} />
        )}
      </div>

      {/* FOOTER BAR COM PROGRESSO E STEPS */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: 'rgba(6, 9, 17, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0 60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 50,
        }}
      >
        {/* Timeline dos 5 Capítulos */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {TUTORIAL_CHAPTERS.map((c) => {
            const isActive = currentChapter.id === c.id;
            const isCompleted = currentChapter.id > c.id;

            return (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  opacity: isActive ? 1 : isCompleted ? 0.7 : 0.35,
                  transition: 'opacity 0.3s',
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    background: isActive
                      ? 'linear-gradient(135deg, #00f2fe, #00ff9d)'
                      : isCompleted
                      ? 'rgba(0, 255, 157, 0.2)'
                      : '#0f172a',
                    color: isActive ? '#020814' : isCompleted ? '#00ff9d' : '#64748b',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isActive
                      ? '1px solid #fff'
                      : isCompleted
                      ? '1px solid rgba(0, 255, 157, 0.5)'
                      : '1px solid #1e293b',
                  }}
                >
                  {isCompleted ? '✓' : `0${c.id}`}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      color: isActive ? '#00f2fe' : '#e2e8f0',
                      fontFamily: "'Montserrat', sans-serif",
                      textTransform: 'uppercase',
                    }}
                  >
                    {c.title}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>
                    {c.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Temporizador */}
        <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: '14px', color: '#94a3b8' }}>
          <strong style={{ color: '#00f2fe' }}>
            {Math.floor(currentTimeSec).toString().padStart(2, '0')}:
            {Math.floor((currentTimeSec % 1) * 100)
              .toString()
              .padStart(2, '0')}
          </strong>{' '}
          / 01:00
        </div>
      </div>

      {/* Linha Fina de Progresso no Topo do Rodapé */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          left: 0,
          width: `${progressPercent}%`,
          height: '3px',
          background: 'linear-gradient(90deg, #00f2fe, #00ff9d)',
          boxShadow: '0 0 12px rgba(0, 242, 254, 0.8)',
          zIndex: 60,
        }}
      />
    </AbsoluteFill>
  );
};

// =========================================================================
// CENA 1: LOGIN SIMPLES POR E-MAIL
// =========================================================================
const SceneLogin: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const scale = spring({ frame, fps, config: { damping: 15, mass: 0.8 } });
  const typeTextProgress = interpolate(frame, [15, 60], [0, 20], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fullEmail = 'aluno.oficial@gmail.com';
  const displayedEmail = fullEmail.slice(0, Math.floor(typeTextProgress));
  const isButtonActive = frame > 65;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.1fr',
        gap: '60px',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1300px',
        transform: `scale(${scale})`,
      }}
    >
      {/* Texto Explicativo à Esquerda */}
      <div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'rgba(0, 255, 157, 0.1)',
            border: '1px solid rgba(0, 255, 157, 0.3)',
            color: '#00ff9d',
            fontSize: '12px',
            fontWeight: 800,
            fontFamily: 'monospace',
            marginBottom: '18px',
          }}
        >
          <ShieldCheck size={16} /> ACESSO DESCOMPLICADO E SEGURO
        </div>

        <h2
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '44px',
            fontWeight: 900,
            textTransform: 'uppercase',
            lineHeight: 1.15,
            marginBottom: '18px',
          }}
        >
          Basta digitar o <span style={{ color: '#00f2fe' }}>E-mail da sua compra</span>
        </h2>

        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
          O acesso é liberado instantaneamente pelo sistema. Você não precisa criar senha e nem confirmar código. O mesmo e-mail que você cadastrou no checkout da Ticto é a sua chave mestre.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f1f5f9', fontSize: '15px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(0, 255, 157, 0.2)', color: '#00ff9d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✓
            </div>
            <span>Liberação 100% automática após a confirmação do pagamento</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f1f5f9', fontSize: '15px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(0, 255, 157, 0.2)', color: '#00ff9d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✓
            </div>
            <span>Funciona no celular, tablet ou computador</span>
          </div>
        </div>
      </div>

      {/* Simulação Fiel do Card de Login do App */}
      <div
        style={{
          background: 'rgba(10, 15, 29, 0.95)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 254, 0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #00f2fe, #00ff9d)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(0, 242, 254, 0.4)',
              marginBottom: '14px',
            }}
          >
            <Dumbbell size={28} color="#04060a" strokeWidth={2.5} />
          </div>
          <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '20px', fontWeight: 900, textTransform: 'uppercase' }}>
            Nutri <strong style={{ color: '#00f2fe' }}>de Bolso</strong>
          </h3>
          <p style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
            PORTAL DO ALUNO OFICIAL
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#cbd5e1', marginBottom: '8px', letterSpacing: '1px' }}>
            E-mail da Compra:
          </label>
          <div
            style={{
              width: '100%',
              padding: '16px 18px',
              background: '#070b14',
              border: '1px solid #00f2fe',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '16px',
              fontFamily: 'monospace',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 0 15px rgba(0, 242, 254, 0.3)',
            }}
          >
            <span>{displayedEmail}</span>
            <span style={{ width: '2px', height: '18px', background: '#00f2fe', marginLeft: '4px', animation: 'blink 1s infinite' }} />
          </div>
        </div>

        <div
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            background: isButtonActive
              ? 'linear-gradient(135deg, #00f2fe, #00ff9d)'
              : 'linear-gradient(135deg, #00f2fe 50%, #00ff9d 100%)',
            color: '#020814',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '15px',
            fontWeight: 900,
            textTransform: 'uppercase',
            textAlign: 'center',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: isButtonActive
              ? '0 0 30px rgba(0, 242, 254, 0.7)'
              : '0 4px 15px rgba(0, 242, 254, 0.3)',
            transform: isButtonActive ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.2s',
          }}
        >
          <span>ACESSAR NUTRI DE BOLSO</span>
          <ArrowRight size={18} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// CENA 2: ETAPA 1 - CALCULADORA METABÓLICA
// =========================================================================
const SceneMetabolismo: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const scale = spring({ frame, fps, config: { damping: 15, mass: 0.8 } });

  const tmbVal = Math.round(interpolate(frame, [10, 60], [1200, 1845], { extrapolateRight: 'clamp' }));
  const getdVal = Math.round(interpolate(frame, [10, 60], [1600, 2520], { extrapolateRight: 'clamp' }));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1300px',
        transform: `scale(${scale})`,
      }}
    >
      <div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'rgba(0, 242, 254, 0.1)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            color: '#00f2fe',
            fontSize: '12px',
            fontWeight: 800,
            fontFamily: 'monospace',
            marginBottom: '18px',
          }}
        >
          <Zap size={16} /> ETAPA 01: BIOMETRIA & METABOLISMO
        </div>

        <h2
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '42px',
            fontWeight: 900,
            textTransform: 'uppercase',
            lineHeight: 1.15,
            marginBottom: '18px',
          }}
        >
          Seu Gasto Calórico <span style={{ color: '#00ff9d' }}>Exato e Real</span>
        </h2>

        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
          O motor metabólico utiliza a fórmula <strong>Mifflin-St Jeor</strong> (padrão ouro mundial) para identificar exatamente quantas calorias seu corpo queima parado e em movimento.
        </p>

        {/* Caixas de Telemetria Animada */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div
            style={{
              background: '#0a0f1d',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              borderRadius: '14px',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase' }}>
              Taxa Metabólica Basal
            </span>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#fff', fontFamily: "'Montserrat', sans-serif", marginTop: '6px' }}>
              {tmbVal} <span style={{ fontSize: '16px', color: '#00f2fe' }}>kcal</span>
            </div>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Queima em repouso absoluto</span>
          </div>

          <div
            style={{
              background: '#0a0f1d',
              border: '1px solid rgba(0, 255, 157, 0.25)',
              borderRadius: '14px',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase' }}>
              Gasto Total Diário (GETD)
            </span>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#fff', fontFamily: "'Montserrat', sans-serif", marginTop: '6px' }}>
              {getdVal} <span style={{ fontSize: '16px', color: '#00ff9d' }}>kcal</span>
            </div>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Com sua rotina e treinos</span>
          </div>
        </div>
      </div>

      {/* Prévia dos Campos da Etapa 1 */}
      <div
        style={{
          background: 'rgba(10, 15, 29, 0.95)',
          border: '1px solid rgba(0, 242, 254, 0.25)',
          borderRadius: '20px',
          padding: '36px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '6px' }}>GÊNERO:</span>
            <div style={{ background: '#070b14', border: '1px solid #1a2538', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 700 }}>
              Masculino
            </div>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '6px' }}>IDADE:</span>
            <div style={{ background: '#070b14', border: '1px solid #1a2538', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 700 }}>
              28 anos
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '6px' }}>PESO ATUAL:</span>
            <div style={{ background: '#070b14', border: '1px solid #00f2fe', padding: '12px', borderRadius: '8px', fontSize: '15px', fontWeight: 800, color: '#00f2fe' }}>
              82.0 kg
            </div>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '6px' }}>ALTURA:</span>
            <div style={{ background: '#070b14', border: '1px solid #1a2538', padding: '12px', borderRadius: '8px', fontSize: '15px', fontWeight: 800 }}>
              178 cm
            </div>
          </div>
        </div>

        <div>
          <span style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '6px' }}>NÍVEL DE ATIVIDADE:</span>
          <div style={{ background: '#070b14', border: '1px solid #1a2538', padding: '12px', borderRadius: '8px', fontSize: '14px', color: '#00ff9d', fontWeight: 700 }}>
            Moderado (Treino 3 a 5x por semana)
          </div>
        </div>

        <div
          style={{
            marginTop: '24px',
            padding: '14px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00f2fe, #00ff9d)',
            color: '#020814',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '13px',
            fontWeight: 900,
            textTransform: 'uppercase',
            textAlign: 'center',
            letterSpacing: '1px',
          }}
        >
          CALCULAR & ESTRUTURAR CARDÁPIOS ➔
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// CENA 3: ETAPA 2 - 3 CARDÁPIOS NO GRAMA
// =========================================================================
const SceneCardapios: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const scale = spring({ frame, fps, config: { damping: 15, mass: 0.8 } });
  const activeTab = frame < 60 ? 1 : frame < 120 ? 2 : 3;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '60px',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1300px',
        transform: `scale(${scale})`,
      }}
    >
      <div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'rgba(0, 255, 157, 0.1)',
            border: '1px solid rgba(0, 255, 157, 0.3)',
            color: '#00ff9d',
            fontSize: '12px',
            fontWeight: 800,
            fontFamily: 'monospace',
            marginBottom: '18px',
          }}
        >
          <Utensils size={16} /> ETAPA 02: 3 OPÇÕES DE CARDÁPIOS
        </div>

        <h2
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '42px',
            fontWeight: 900,
            textTransform: 'uppercase',
            lineHeight: 1.15,
            marginBottom: '18px',
          }}
        >
          Comida Barata, <span style={{ color: '#00f2fe' }}>Pesada no Grama</span>
        </h2>

        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
          Você recebe <strong>3 opções completas de cardápios</strong> para variar seus dias. Nada de comida cara ou ingredientes difíceis: arroz, feijão, frango, carne moída, ovos e frutas com peso exato na balança.
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          {[1, 2, 3].map((tab) => (
            <div
              key={tab}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                background: activeTab === tab ? '#00f2fe' : '#0a0f1d',
                color: activeTab === tab ? '#020814' : '#94a3b8',
                border: activeTab === tab ? '1px solid #fff' : '1px solid #1e293b',
                textAlign: 'center',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '12px',
                fontWeight: 900,
                textTransform: 'uppercase',
                boxShadow: activeTab === tab ? '0 0 20px rgba(0, 242, 254, 0.5)' : 'none',
              }}
            >
              Opção 0{tab}
            </div>
          ))}
        </div>
      </div>

      {/* Visual de Refeições Pesadas */}
      <div
        style={{
          background: 'rgba(10, 15, 29, 0.95)',
          border: '1px solid rgba(0, 255, 157, 0.3)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1a2538', paddingBottom: '12px' }}>
          <div>
            <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '18px', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>
              {activeTab === 1 && 'Cardápio 01: Popular & Feira'}
              {activeTab === 2 && 'Cardápio 02: Econômico & Proteico'}
              {activeTab === 3 && 'Cardápio 03: Praticidade Sem Enrolação'}
            </h4>
            <span style={{ fontSize: '11px', color: '#00ff9d', fontFamily: 'monospace' }}>
              Meta: 1.820 kcal • 165g Proteína • 190g Carbo
            </span>
          </div>
          <Scale size={24} color="#00f2fe" />
        </div>

        {/* Refeição 1 */}
        <div style={{ background: '#070b14', padding: '14px 18px', borderRadius: '10px', marginBottom: '12px', borderLeft: '3px solid #00f2fe' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, color: '#00f2fe', textTransform: 'uppercase', marginBottom: '6px' }}>
            <span>Refeição 1: Café da Manhã</span>
            <span>420 kcal</span>
          </div>
          <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
            • <strong>3 Ovos inteiros</strong> mexidos ou cozidos<br />
            • <strong>50g de Aveia em flocos</strong> com <strong>1 Banana (80g)</strong>
          </p>
        </div>

        {/* Refeição 2 */}
        <div style={{ background: '#070b14', padding: '14px 18px', borderRadius: '10px', marginBottom: '12px', borderLeft: '3px solid #00ff9d' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, color: '#00ff9d', textTransform: 'uppercase', marginBottom: '6px' }}>
            <span>Refeição 2: Almoço Reforçado</span>
            <span>610 kcal</span>
          </div>
          <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
            • <strong>180g de Arroz Branco</strong> pesado cozido<br />
            • <strong>100g de Feijão carioca</strong> em concha<br />
            • <strong>160g de Peito de Frango</strong> grelhado na frigideira
          </p>
        </div>

        {/* Refeição 3 */}
        <div style={{ background: '#070b14', padding: '14px 18px', borderRadius: '10px', borderLeft: '3px solid #a855f7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', marginBottom: '6px' }}>
            <span>Refeição 3: Jantar Estratégico</span>
            <span>520 kcal</span>
          </div>
          <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
            • <strong>200g de Batata Doce</strong> ou Mandioca cozida<br />
            • <strong>150g de Patinho moído</strong> temperado com alho e sal
          </p>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// CENA 4: ETAPA 3 - MONTADOR DE TREINO
// =========================================================================
const SceneTreino: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const scale = spring({ frame, fps, config: { damping: 15, mass: 0.8 } });
  const isGym = frame < 90;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.15fr',
        gap: '60px',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1300px',
        transform: `scale(${scale})`,
      }}
    >
      <div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'rgba(0, 242, 254, 0.1)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            color: '#00f2fe',
            fontSize: '12px',
            fontWeight: 800,
            fontFamily: 'monospace',
            marginBottom: '18px',
          }}
        >
          <Dumbbell size={16} /> ETAPA 03: MONTADOR DE TREINO
        </div>

        <h2
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '42px',
            fontWeight: 900,
            textTransform: 'uppercase',
            lineHeight: 1.15,
            marginBottom: '18px',
          }}
        >
          Estruturado para <span style={{ color: '#00ff9d' }}>Academia ou Casa</span>
        </h2>

        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
          Escolha seu local de treino, seu nível (Iniciante, Intermediário ou Avançado) e a frequência na semana. O app entrega a divisão exata com séries, repetições e cárdio acelerador.
        </p>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '12px',
              background: isGym ? 'rgba(0, 242, 254, 0.15)' : '#0a0f1d',
              border: isGym ? '2px solid #00f2fe' : '1px solid #1e293b',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 900, color: isGym ? '#00f2fe' : '#94a3b8', textTransform: 'uppercase' }}>
              🏢 Academia (Máquinas & Halteres)
            </span>
          </div>

          <div
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '12px',
              background: !isGym ? 'rgba(0, 255, 157, 0.15)' : '#0a0f1d',
              border: !isGym ? '2px solid #00ff9d' : '1px solid #1e293b',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 900, color: !isGym ? '#00ff9d' : '#94a3b8', textTransform: 'uppercase' }}>
              🏠 Em Casa (Peso do Corpo & Faixas)
            </span>
          </div>
        </div>
      </div>

      {/* Visual da Ficha de Exercícios */}
      <div
        style={{
          background: 'rgba(10, 15, 29, 0.95)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #1a2538', paddingBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#00f2fe', fontFamily: 'monospace', fontWeight: 700 }}>
              DIVISÃO ABCD • DIA A
            </span>
            <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '18px', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>
              {isGym ? 'Peito, Tríceps & Ombros' : 'Empurrar & Peitoral Calistênico'}
            </h4>
          </div>
          <Flame size={24} color="#00ff9d" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ background: '#070b14', padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '14px', color: '#fff' }}>{isGym ? '1. Supino Reto com Barra' : '1. Flexão de Braço no Solo'}</strong>
              <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8' }}>Foco em amplitude e peitoral</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 900, color: '#00f2fe', fontFamily: 'monospace' }}>
              4x 8-12 reps
            </span>
          </div>

          <div style={{ background: '#070b14', padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '14px', color: '#fff' }}>{isGym ? '2. Desenvolvimento com Halteres' : '2. Flexão Pique / Ombros'}</strong>
              <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8' }}>Ombro anterior e lateral</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 900, color: '#00f2fe', fontFamily: 'monospace' }}>
              3x 10-12 reps
            </span>
          </div>

          <div style={{ background: '#070b14', padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '14px', color: '#fff' }}>{isGym ? '3. Tríceps Corda na Polia' : '3. Tríceps Banco / Mergulho'}</strong>
              <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8' }}>Cabeça lateral e longa</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 900, color: '#00f2fe', fontFamily: 'monospace' }}>
              3x 12-15 reps
            </span>
          </div>

          {/* Finalizador de Cárdio */}
          <div style={{ background: 'rgba(0, 255, 157, 0.08)', border: '1px solid rgba(0, 255, 157, 0.3)', padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '13px', color: '#00ff9d', textTransform: 'uppercase' }}>🔥 Finalizador: Cárdio Estratégico</strong>
              <span style={{ display: 'block', fontSize: '11px', color: '#cbd5e1' }}>15 minutos de esteira inclinada ou 7.000 passos</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 900, color: '#00ff9d', fontFamily: 'monospace' }}>
              +220 kcal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// CENA 5: ETAPA 4 - PDF OFICIAL & CHECKLIST
// =========================================================================
const ScenePdfHabitos: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const scale = spring({ frame, fps, config: { damping: 15, mass: 0.8 } });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1300px',
        transform: `scale(${scale})`,
      }}
    >
      <div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'rgba(0, 255, 157, 0.1)',
            border: '1px solid rgba(0, 255, 157, 0.3)',
            color: '#00ff9d',
            fontSize: '12px',
            fontWeight: 800,
            fontFamily: 'monospace',
            marginBottom: '18px',
          }}
        >
          <Sparkles size={16} /> ETAPA 04: SEU PLANO FINALIZADO
        </div>

        <h2
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '44px',
            fontWeight: 900,
            textTransform: 'uppercase',
            lineHeight: 1.15,
            marginBottom: '18px',
          }}
        >
          Baixe seu <span style={{ color: '#00ff9d' }}>PDF Oficial</span> no Celular
        </h2>

        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
          Com um único clique, você faz o download do relatório completo em PDF contendo todas as 3 opções de cardápios pesados, lista de substituição e fichas de treino para imprimir ou abrir no WhatsApp.
        </p>

        <div
          style={{
            padding: '20px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #00f2fe, #00ff9d)',
            color: '#020814',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '16px',
            fontWeight: 900,
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            letterSpacing: '1px',
            boxShadow: '0 10px 30px rgba(0, 242, 254, 0.5)',
          }}
        >
          <Download size={22} strokeWidth={3} />
          <span>BAIXAR MEU PLANO COMPLETO (PDF)</span>
        </div>
      </div>

      {/* Visual do Documento PDF e Hábitos */}
      <div
        style={{
          background: 'rgba(10, 15, 29, 0.95)',
          border: '1px solid rgba(0, 255, 157, 0.3)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', borderBottom: '1px solid #1a2538', paddingBottom: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0, 255, 157, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00ff9d' }}>
            <FileText size={22} />
          </div>
          <div>
            <strong style={{ fontSize: '16px', color: '#fff', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif" }}>
              Relatório Nutri de Bolso 2026/2027
            </strong>
            <span style={{ display: 'block', fontSize: '11px', color: '#00ff9d', fontFamily: 'monospace' }}>
              DOCUMENTO OFICIAL COMPLETO (PRONTO PARA IMPRIMIR)
            </span>
          </div>
        </div>

        {/* Checklist de Hábitos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ background: '#070b14', padding: '12px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: '#00ff9d', color: '#020814', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
              ✓
            </div>
            <span style={{ fontSize: '13px', color: '#f1f5f9' }}>Ingerir 35ml de água por kg de peso corporal</span>
          </div>

          <div style={{ background: '#070b14', padding: '12px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: '#00ff9d', color: '#020814', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
              ✓
            </div>
            <span style={{ fontSize: '13px', color: '#f1f5f9' }}>Pesar todas as refeições na balança de cozinha</span>
          </div>

          <div style={{ background: '#070b14', padding: '12px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: '#00ff9d', color: '#020814', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
              ✓
            </div>
            <span style={{ fontSize: '13px', color: '#f1f5f9' }}>Atingir a meta de proteína para proteger a massa magra</span>
          </div>

          <div style={{ background: '#070b14', padding: '12px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: '#00ff9d', color: '#020814', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
              ✓
            </div>
            <span style={{ fontSize: '13px', color: '#f1f5f9' }}>Concluir o treino de força e bater 8.000 passos</span>
          </div>
        </div>
      </div>
    </div>
  );
};
