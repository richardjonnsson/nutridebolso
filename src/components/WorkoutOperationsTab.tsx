'use client';

import React, { useState, useEffect } from 'react';

interface WorkoutExercise {
  id: number;
  title: string;
  tag: string;
  series: number;
  reps: string;
  repsHighlight?: boolean;
  gifUrl: string;
  alt: string;
  actionNote: string;
}

const WORKOUT_EXERCISES: WorkoutExercise[] = [
  {
    id: 1,
    title: '01. Supino Inclinado (Halteres)',
    tag: 'Foco: Parte Superior',
    series: 4,
    reps: '10 a 12',
    gifUrl: 'https://rjonnssonfit.com.br/wp-content/uploads/2026/08/Create_a_hyperrealistic_gym_exercise_animati-1.gif',
    alt: 'Supino Inclinado com Halteres',
    actionNote: 'Preencher a "saboneteira" para esticar a pele da lipomastia para cima (Lifting natural).',
  },
  {
    id: 2,
    title: '02. Supino Reto (Barra)',
    tag: 'Foco: Peitoral Central',
    series: 4,
    reps: '8 a 10',
    gifUrl: 'https://rjonnssonfit.com.br/wp-content/uploads/2026/08/Create_a_hyperrealistic_gym_exercise_animati-3.gif',
    alt: 'Supino Reto com Barra',
    actionNote: 'Criar densidade na base. Desça segurando o peso por 2 seg. Não deixe despencar no peito.',
  },
  {
    id: 3,
    title: '03. Crossover (Polia Alta)',
    tag: 'Foco: Parte Inferior',
    series: 4,
    reps: '12 a 15',
    gifUrl: 'https://rjonnssonfit.com.br/wp-content/uploads/2026/08/Create_a_hyperrealistic_gym_exercise_animati-2.gif',
    alt: 'Crossover na Polia Alta',
    actionNote: 'A Faca de Corte. Puxe para a linha abaixo do umbigo, cruze as mãos e esmague para criar o vinco inferior.',
  },
  {
    id: 4,
    title: '04. Crucifixo (Halteres)',
    tag: 'Foco: Expansão',
    series: 3,
    reps: '12',
    gifUrl: 'https://rjonnssonfit.com.br/wp-content/uploads/2026/08/crucifixo.gif',
    alt: 'Crucifixo com Halteres',
    actionNote: 'Alargar a caixa torácica. Quanto mais largo o peito, menos concentrada fica a gordura no centro.',
  },
  {
    id: 5,
    title: '05. Flexão de Braço',
    tag: 'Foco: Peitoral Geral',
    series: 3,
    reps: 'Até a Falha',
    repsHighlight: true,
    gifUrl: 'https://rjonnssonfit.com.br/wp-content/uploads/2026/08/Create_a_hyperrealistic_gym_exercise_animati.gif',
    alt: 'Flexão de Braço',
    actionNote: 'Bombeamento máximo de sangue para esticar a fáscia e queimar as últimas reservas do glicogênio.',
  },
];

interface WorkoutOperationsTabProps {
  onNavigateTab: (tab: 'home' | 'workout' | 'diet' | 'aromatase' | 'armor') => void;
  initialVideoMode?: 'shorts' | 'practical';
}

export default function WorkoutOperationsTab({
  onNavigateTab,
  initialVideoMode = 'practical',
}: WorkoutOperationsTabProps) {
  const [activeVideo, setActiveVideo] = useState<'shorts' | 'practical'>(initialVideoMode);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [restSeconds, setRestSeconds] = useState<number | null>(null);
  const [expandedGif, setExpandedGif] = useState<WorkoutExercise | null>(null);

  const todayKey = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    setActiveVideo(initialVideoMode);
  }, [initialVideoMode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`qg_workout_sets_${todayKey}`);
      if (saved) {
        try {
          setCompletedSets(JSON.parse(saved));
        } catch {}
      }
    }
  }, [todayKey]);

  useEffect(() => {
    if (restSeconds === null || restSeconds <= 0) return;
    const timer = setInterval(() => {
      setRestSeconds((prev) => (prev !== null && prev > 0 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [restSeconds]);

  const toggleSet = (exerciseId: number, setIdx: number) => {
    const key = `ex_${exerciseId}_set_${setIdx}`;
    const nextState = !completedSets[key];
    const updated = { ...completedSets, [key]: nextState };
    setCompletedSets(updated);
    localStorage.setItem(`qg_workout_sets_${todayKey}`, JSON.stringify(updated));
    if (nextState) {
      setRestSeconds(60);
    }
  };

  const resetTodaySets = () => {
    setCompletedSets({});
    localStorage.removeItem(`qg_workout_sets_${todayKey}`);
  };

  const totalSetsCount = WORKOUT_EXERCISES.reduce((acc, ex) => acc + ex.series, 0);
  const doneSetsCount = Object.values(completedSets).filter(Boolean).length;
  const workoutProgressPct = Math.round((doneSetsCount / totalSetsCount) * 100);

  return (
    <div style={{ paddingBottom: '20px' }}>
      {/* Banner Tático de Operações */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 0, 0.14), rgba(17, 17, 17, 0.95))',
          border: '1px solid rgba(0, 255, 0, 0.35)',
          borderRadius: '12px',
          padding: '18px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div>
          <span
            style={{
              background: '#00FF00',
              color: '#000',
              fontSize: '10px',
              fontWeight: 900,
              padding: '3px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            ENTREGÁVEL PRINCIPAL • ÁREA DE OPERAÇÕES
          </span>
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '21px',
              fontWeight: 900,
              color: '#fff',
              textTransform: 'uppercase',
              margin: '8px 0 4px 0',
            }}
          >
            Ficha de Treino <span style={{ color: '#00FF00' }}>Seca Peitoral</span>
          </h2>
          <p style={{ margin: 0, fontSize: '12px', color: '#bbb' }}>
            Plano de Ação + Vídeo-Aula Prática + 5 Exercícios Biomecânicos + Ambiente Metabólico
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <a
            href="/downloads/Ficha_Tatica_Secagem_Peitoral.pdf"
            download="Ficha_Tatica_Secagem_Peitoral.pdf"
            style={{
              background: '#161616',
              border: '1px solid #00FF00',
              color: '#00FF00',
              padding: '9px 13px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
            }}
          >
            📥 Baixar Ficha PDF
          </a>
          <a
            href="/downloads/Calendario_Seca_Peitoral.pdf"
            download="Calendario_Seca_Peitoral.pdf"
            style={{
              background: '#161616',
              border: '1px solid #FFD700',
              color: '#FFD700',
              padding: '9px 13px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
            }}
          >
            📅 Calendário PDF
          </a>
        </div>
      </div>

      {/* PASSO 1: O PLANO DE AÇÃO & VÍDEO-AULA PRÁTICA */}
      <section
        style={{
          background: '#111111',
          border: '1px solid #222',
          borderRadius: '12px',
          padding: '18px',
          marginBottom: '22px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <span
            style={{
              background: '#00FF00',
              color: '#000',
              width: '28px',
              height: '28px',
              display: 'grid',
              placeItems: 'center',
              borderRadius: '4px',
              fontWeight: 900,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '16px',
              flexShrink: 0,
            }}
          >
            1
          </span>
          <div>
            <h3
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '18px',
                color: '#fff',
                textTransform: 'uppercase',
                fontWeight: 900,
                margin: 0,
              }}
            >
              O Plano de Ação & Vídeo-Aula Prática
            </h3>
            <span style={{ fontSize: '12px', color: '#999' }}>
              Assista à explicação estratégica e veja a execução real de cada exercício na prática
            </span>
          </div>
        </div>

        {/* Seletor de Vídeo */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveVideo('practical')}
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              border: activeVideo === 'practical' ? '2px solid #00FF00' : '1px solid #2a2a2a',
              background: activeVideo === 'practical' ? 'rgba(0, 255, 0, 0.12)' : '#181818',
              color: activeVideo === 'practical' ? '#00FF00' : '#ccc',
              fontWeight: 800,
              fontSize: '12px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            <span>🎬</span> Vídeo-Aula Prática (Executando a Ficha)
          </button>

          <button
            type="button"
            onClick={() => setActiveVideo('shorts')}
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              border: activeVideo === 'shorts' ? '2px solid #FFD700' : '1px solid #2a2a2a',
              background: activeVideo === 'shorts' ? 'rgba(255, 215, 0, 0.12)' : '#181818',
              color: activeVideo === 'shorts' ? '#FFD700' : '#ccc',
              fontWeight: 800,
              fontSize: '12px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            <span>📹</span> O Plano de Ação (Briefing Inicial)
          </button>
        </div>

        {activeVideo === 'practical' ? (
          <div>
            <div
              style={{
                width: '100%',
                maxWidth: '340px',
                aspectRatio: '9 / 16',
                background: '#000',
                borderRadius: '10px',
                border: '1px solid #00FF00',
                overflow: 'hidden',
                margin: '0 auto 12px auto',
                position: 'relative',
                boxShadow: '0 0 25px rgba(0, 255, 0, 0.15)',
              }}
            >
              <video
                src="/videos/video-aula-ficha.mp4"
                controls
                playsInline
                preload="metadata"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backgroundColor: '#000',
                }}
              />
            </div>
            <p style={{ fontSize: '13px', color: '#ccc', textAlign: 'center', margin: '0 0 6px 0', fontWeight: 600 }}>
              🔥 <strong style={{ color: '#00FF00' }}>VÍDEO-AULA COMPLETA:</strong> Veja na prática a postura, cadência e execução correta dos 5 exercícios da Ficha Seca Peitoral.
            </p>
            <p style={{ fontSize: '11px', color: '#777', textAlign: 'center', margin: 0 }}>
              Você pode colocar em tela cheia no celular enquanto estiver na academia.
            </p>
          </div>
        ) : (
          <div>
            <div
              style={{
                width: '100%',
                maxWidth: '320px',
                aspectRatio: '9 / 16',
                background: '#000',
                borderRadius: '10px',
                border: '1px solid #333',
                overflow: 'hidden',
                margin: '0 auto 12px auto',
                position: 'relative',
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/of7_FV2f_K8?rel=0&modestbranding=1"
                title="Plano de Ação"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </div>
            <p style={{ fontSize: '13px', color: '#888', textAlign: 'center', margin: 0 }}>
              Assista à instrução acima antes de iniciar. Eu te explico o Treino e o Ambiente Metabólico.
            </p>
          </div>
        )}
      </section>

      {/* CRONÔMETRO TÁTICO DE DESCANSO & PROGRESSO DO TREINO DE HOJE */}
      <div
        style={{
          background: '#141414',
          border: '1px solid #2a2a2a',
          borderRadius: '10px',
          padding: '14px 16px',
          marginBottom: '20px',
          position: 'sticky',
          top: '68px',
          zIndex: 30,
          boxShadow: '0 8px 20px rgba(0,0,0,0.65)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#00FF00', fontWeight: 800, textTransform: 'uppercase' }}>
              ⚡ RASTREADOR DE SÉRIES NA ACADEMIA ({doneSetsCount}/{totalSetsCount} séries • {workoutProgressPct}%)
            </span>
            <div
              style={{
                width: '220px',
                maxWidth: '100%',
                height: '6px',
                background: '#222',
                borderRadius: '4px',
                overflow: 'hidden',
                marginTop: '5px',
              }}
            >
              <div
                style={{
                  width: `${workoutProgressPct}%`,
                  height: '100%',
                  background: '#00FF00',
                  transition: 'width 0.25s ease',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {restSeconds !== null && restSeconds > 0 ? (
              <div
                style={{
                  background: 'rgba(255, 215, 0, 0.15)',
                  border: '1px solid #FFD700',
                  color: '#FFD700',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>⏱️ DESCANSO: {restSeconds}s</span>
                <button
                  type="button"
                  onClick={() => setRestSeconds(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '11px',
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setRestSeconds(60)}
                  style={{
                    background: '#1f1f1f',
                    border: '1px solid #333',
                    color: '#ccc',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ⏱️ Descanso 60s
                </button>
                <button
                  type="button"
                  onClick={() => setRestSeconds(90)}
                  style={{
                    background: '#1f1f1f',
                    border: '1px solid #333',
                    color: '#ccc',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ⏱️ Descanso 90s
                </button>
              </>
            )}

            {doneSetsCount > 0 && (
              <button
                type="button"
                onClick={resetTodaySets}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#777',
                  fontSize: '11px',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Zerar séries
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PASSO 2: A FICHA DE TREINO */}
      <section style={{ marginBottom: '26px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span
            style={{
              background: '#00FF00',
              color: '#000',
              width: '28px',
              height: '28px',
              display: 'grid',
              placeItems: 'center',
              borderRadius: '4px',
              fontWeight: 900,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '16px',
            }}
          >
            2
          </span>
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '20px',
              color: '#fff',
              textTransform: 'uppercase',
              fontWeight: 900,
              margin: 0,
            }}
          >
            A Ficha de Treino
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: '#aaa', marginTop: '0', marginBottom: '16px' }}>
          Execute a ordem exata abaixo. Toque nas séries abaixo de cada exercício para marcar como concluída durante o treino.
        </p>

        {WORKOUT_EXERCISES.map((ex) => (
          <div
            key={ex.id}
            style={{
              background: '#111111',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderLeft: '4px solid #FFD700',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '14px',
            }}
          >
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 900,
                    fontSize: '15px',
                    color: '#fff',
                    textTransform: 'uppercase',
                    margin: '0 0 6px 0',
                  }}
                >
                  {ex.title}
                </h3>
                <span
                  style={{
                    display: 'inline-block',
                    background: 'rgba(0, 255, 0, 0.15)',
                    color: '#00FF00',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '3px 7px',
                    borderRadius: '3px',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                  }}
                >
                  {ex.tag}
                </span>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#aaa' }}>
                  <span>
                    Séries: <strong style={{ color: '#00FF00' }}>{ex.series}</strong>
                  </span>
                  <span>
                    Reps:{' '}
                    <strong style={{ color: ex.repsHighlight ? '#FFD700' : '#fff' }}>
                      {ex.reps}
                    </strong>
                  </span>
                </div>
              </div>

              <div
                onClick={() => setExpandedGif(ex)}
                title="Toque para ampliar animação"
                style={{
                  width: '92px',
                  height: '92px',
                  flexShrink: 0,
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid #333',
                  background: '#000',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <img
                  src={ex.gifUrl}
                  alt={ex.alt}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '3px',
                    right: '3px',
                    background: 'rgba(0,0,0,0.75)',
                    color: '#fff',
                    fontSize: '9px',
                    padding: '1px 4px',
                    borderRadius: '3px',
                  }}
                >
                  🔍
                </span>
              </div>
            </div>

            <div
              style={{
                fontSize: '12px',
                color: '#bbb',
                marginTop: '12px',
                paddingTop: '10px',
                borderTop: '1px dashed #333',
                lineHeight: 1.45,
              }}
            >
              <strong style={{ color: '#00FF00' }}>Ação:</strong> {ex.actionNote}
            </div>

            {/* Botões de Check de Séries */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
              {Array.from({ length: ex.series }).map((_, sIdx) => {
                const setKey = `ex_${ex.id}_set_${sIdx + 1}`;
                const isDone = !!completedSets[setKey];
                return (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => toggleSet(ex.id, sIdx + 1)}
                    style={{
                      flex: 1,
                      minWidth: '70px',
                      padding: '7px 8px',
                      borderRadius: '5px',
                      border: isDone ? '1px solid #00FF00' : '1px solid #2a2a2a',
                      background: isDone ? 'rgba(0, 255, 0, 0.15)' : '#181818',
                      color: isDone ? '#00FF00' : '#888',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {isDone ? `✓ Série ${sIdx + 1}` : `Série ${sIdx + 1}`}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* PASSO 3: AMBIENTE METABÓLICO */}
      <section style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span
            style={{
              background: '#00FF00',
              color: '#000',
              width: '28px',
              height: '28px',
              display: 'grid',
              placeItems: 'center',
              borderRadius: '4px',
              fontWeight: 900,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '16px',
            }}
          >
            3
          </span>
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '20px',
              color: '#fff',
              textTransform: 'uppercase',
              fontWeight: 900,
              margin: 0,
            }}
          >
            Ambiente Metabólico
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: '#aaa', marginTop: 0, marginBottom: '16px' }}>
          Se o metabolismo for lento, o treino não rasga a gordura. Siga o protocolo.
        </p>

        <div
          style={{
            background: '#161616',
            border: '1px solid #333',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: '#000',
              padding: '16px',
              borderBottom: '1px solid #333',
              textAlign: 'center',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '18px',
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              O Destravamento
            </h3>
            <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#aaa' }}>
              Obrigando o corpo a usar a lipomastia como energia
            </p>
          </div>

          <div style={{ padding: '20px', borderBottom: '1px solid #222' }}>
            <div
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '15px',
                fontWeight: 900,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ fontSize: '18px' }}>⏱️</span> A Janela de Fogo (Jejum)
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#ccc', margin: '0 0 10px 0' }}>
              Mantenha um jejum diário de <strong>14h a 16h</strong>. A lipomastia é uma reserva de energia teimosa. Sem a escassez calórica forçada pelo jejum matinal, seu corpo nunca vai acessar essa reserva para queimar.
            </p>
            <p style={{ color: '#00FF00', fontSize: '12px', fontWeight: 'bold', margin: 0 }}>
              (Ex: Última refeição às 20h, primeira refeição do dia seguinte às 12h).
            </p>
          </div>

          <div style={{ padding: '20px', borderBottom: '1px solid #222' }}>
            <div
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '15px',
                fontWeight: 900,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ fontSize: '18px' }}>💊</span> O Lança-Chamas (Ioimbina)
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#ccc', margin: '0 0 10px 0' }}>
              A Ioimbina age diretamente bloqueando os receptores Alpha-2 (que protegem a gordura resistente do peitoral e abdômen), destrancando a célula para ser queimada.
            </p>
            <div
              style={{
                background: 'rgba(255, 51, 51, 0.1)',
                borderLeft: '3px solid #FF3333',
                padding: '12px',
                fontSize: '12px',
                color: '#eee',
                borderRadius: '4px',
                marginTop: '10px',
              }}
            >
              <strong
                style={{
                  color: '#FF3333',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Protocolo de Uso:
              </strong>
              Sempre na parte da manhã, de estômago COMPLETAMENTE vazio (durante o jejum). Idealmente 30 a 45 minutos antes de um cardio ou do treino. Se você ingerir qualquer caloria junto, o pico de insulina anula o efeito da ioimbina.
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            <div
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '15px',
                fontWeight: 900,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ fontSize: '18px' }}>💧</span> Hidratação Tática
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#ccc', margin: 0 }}>
              Beba <strong>4 litros de água</strong> por dia. Retenção de líquido em cima do músculo simula gordura e deixa o peito inchado. Você precisa lavar o músculo de dentro pra fora para a pele colar de verdade.
            </p>
          </div>
        </div>
      </section>

      {/* Atalhos Táticos para os Próximos Passos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px',
        }}
      >
        <button
          type="button"
          onClick={() => onNavigateTab('diet')}
          className="btn btn-primary"
          style={{ fontSize: '13px', padding: '14px' }}
        >
          🥩 Calcular Minha Dieta Anti-Aromatase →
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab('aromatase')}
          style={{
            background: '#161616',
            border: '1px solid #FFD700',
            color: '#FFD700',
            padding: '14px',
            borderRadius: '6px',
            fontWeight: 900,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '13px',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          🛡️ Abrir Guia de Trava da Aromatase →
        </button>
      </div>

      {/* Modal de Zoom no GIF do Exercício */}
      {expandedGif && (
        <div
          onClick={() => setExpandedGif(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.88)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#111',
              border: '1px solid #00FF00',
              borderRadius: '12px',
              padding: '16px',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <h4
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: '#fff',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
              }}
            >
              {expandedGif.title}
            </h4>
            <img
              src={expandedGif.gifUrl}
              alt={expandedGif.alt}
              style={{ width: '100%', borderRadius: '8px', border: '1px solid #333' }}
            />
            <p style={{ fontSize: '12px', color: '#ccc', marginTop: '10px' }}>
              <strong style={{ color: '#00FF00' }}>Ação:</strong> {expandedGif.actionNote}
            </p>
            <button
              type="button"
              onClick={() => setExpandedGif(null)}
              className="btn btn-primary"
              style={{ marginTop: '10px', padding: '10px' }}
            >
              Fechar Visualização
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
