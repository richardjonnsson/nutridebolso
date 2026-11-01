'use client';

import React, { useState, useEffect, useRef } from 'react';

const MIRROR_CHECKLIST = [
  {
    title: 'Esterno elevado ("Osso no Teto"):',
    desc: 'Peito superior inflado, eliminando a depressão clavicular.',
  },
  {
    title: 'Escápulas no bolso de trás:',
    desc: 'Ombros relaxados para baixo e para trás, sem tensão no pescoço.',
  },
  {
    title: 'Trava Abdominal ativa (25%):',
    desc: 'Lombar protegida, impedindo a projeção das costelas e da barriga.',
  },
  {
    title: 'Tecido estruturado e fosco:',
    desc: 'Malha pesada (200+ GSM), sem reflexos de luz ou transparência de mamilo.',
  },
  {
    title: 'Respiração diafragmática fluida:',
    desc: 'Ar descendo suavemente para a base pulmonar, corpo calmo e confiante.',
  },
];

export default function ArmorPostureTab() {
  const [postureState, setPostureState] = useState<'curved' | 'alpha'>('curved');
  const [mirrorChecks, setMirrorChecks] = useState<boolean[]>([false, false, false, false, false]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qg_armor_mirror_checks');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === 5) {
            setMirrorChecks(parsed);
          }
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isAlpha = postureState === 'alpha';

    // Grid de Fundo Tático
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1;
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const headX = isAlpha ? 140 : 165;
    const headY = isAlpha ? 50 : 70;
    const neckX = headX;
    const neckY = headY + 20;
    const chestX = isAlpha ? 140 : 175;
    const chestY = isAlpha ? 130 : 145;
    const hipX = 140;
    const hipY = 250;

    // Cabeça
    ctx.strokeStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(headX, headY, 20, 0, Math.PI * 2);
    ctx.stroke();

    // Coluna
    ctx.strokeStyle = '#a1a1aa';
    ctx.beginPath();
    ctx.moveTo(neckX, neckY);
    if (!isAlpha) {
      ctx.quadraticCurveTo(195, 120, hipX, hipY);
    } else {
      ctx.lineTo(hipX, hipY);
    }
    ctx.stroke();

    // Volume da Gordura (Peito)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    if (!isAlpha) {
      ctx.arc(chestX + 22, chestY + 10, 22, 0, Math.PI * 2);
    } else {
      ctx.ellipse(chestX + 15, chestY - 5, 14, 25, Math.PI / 6, 0, Math.PI * 2);
    }
    ctx.fill();

    // Linha da Camisa (O Tecido)
    ctx.strokeStyle = isAlpha ? '#00FF00' : '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (!isAlpha) {
      ctx.moveTo(neckX + 10, neckY + 10);
      ctx.lineTo(chestX - 5, chestY - 10);
      ctx.lineTo(chestX + 44, chestY + 12);
      ctx.lineTo(hipX + 10, hipY);
    } else {
      ctx.moveTo(neckX + 15, neckY + 10);
      ctx.lineTo(chestX + 26, chestY - 15);
      ctx.lineTo(chestX + 26, hipY + 10);
    }
    ctx.stroke();

    // Alvo de Mira
    ctx.strokeStyle = isAlpha ? '#00FF00' : '#ef4444';
    ctx.lineWidth = 1;
    const targetX = isAlpha ? chestX + 26 : chestX + 44;
    const targetY = isAlpha ? chestY + 10 : chestY + 12;

    ctx.beginPath();
    ctx.moveTo(targetX - 10, targetY);
    ctx.lineTo(targetX + 10, targetY);
    ctx.moveTo(targetX, targetY - 10);
    ctx.lineTo(targetX, targetY + 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(targetX, targetY, 15, 0, Math.PI * 2);
    ctx.stroke();
  }, [postureState]);

  const toggleMirrorCheck = (idx: number) => {
    const next = [...mirrorChecks];
    next[idx] = !next[idx];
    setMirrorChecks(next);
    localStorage.setItem('qg_armor_mirror_checks', JSON.stringify(next));
  };

  return (
    <div style={{ paddingBottom: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Hero Bônus 01 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.14), rgba(17, 17, 17, 0.96))',
          border: '1px solid rgba(56, 189, 248, 0.45)',
          borderRadius: '12px',
          padding: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <span
            style={{
              background: '#38bdf8',
              color: '#000',
              fontSize: '10px',
              fontWeight: 900,
              padding: '3px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            BÔNUS EXCLUSIVO #01 • CAMUFLAGEM IMEDIATA
          </span>
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '21px',
              fontWeight: 900,
              color: '#fff',
              textTransform: 'uppercase',
              margin: '6px 0 4px 0',
            }}
          >
            O Efeito Armadura & <span style={{ color: '#38bdf8' }}>Postura Alpha</span>
          </h2>
          <p style={{ margin: 0, fontSize: '12px', color: '#ccc', lineHeight: 1.5 }}>
            Protocolo Biomecânico de Camuflagem Imediata na Roupa (em 3 segundos) e Reeducação Postural Masculina.
          </p>
        </div>

        <a
          href="/bonus-efeito-armadura.html"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#38bdf8',
            color: '#000',
            padding: '10px 15px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 900,
            textTransform: 'uppercase',
            textDecoration: 'none',
            fontFamily: "'Montserrat', sans-serif",
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          🖨️ Versão PDF / Impressão
        </a>
      </div>

      {/* 01. A FALÁCIA DA OCULTAÇÃO + SIMULADOR BIOMECÂNICO CANVAS */}
      <section style={{ background: '#111', border: '1px solid #262626', borderRadius: '10px', padding: '18px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '16px', fontFamily: "'Montserrat', sans-serif", textTransform: 'uppercase' }}>
          01. A Falácia da Ocultação: O Erro que Dobra o Volume
        </h3>
        <p style={{ fontSize: '13px', color: '#bbb', lineHeight: 1.55, margin: '0 0 14px 0' }}>
          O maior erro de quem sofre com volume no peito é o instinto de defesa: <strong>enrolar os ombros para a frente e curvar as costas</strong> para tentar esconder a lipomastia. Isso esvazia o peitoral superior, espreme a gordura para o centro (efeito pinça) e faz a camisa marcar até o dobro do volume real.
        </p>

        <div
          style={{
            background: '#080808',
            border: '1px solid #2a2a2a',
            borderRadius: '10px',
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px', fontWeight: 700 }}>
              SCANNER BIOMECÂNICO INTERATIVO
            </span>
            <canvas
              ref={canvasRef}
              width={280}
              height={300}
              style={{
                background: '#050505',
                border: '1px solid #262626',
                borderRadius: '8px',
                maxWidth: '100%',
              }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setPostureState('curved')}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  border: postureState === 'curved' ? '1px solid #FF3333' : '1px solid #333',
                  background: postureState === 'curved' ? 'rgba(255, 51, 51, 0.2)' : '#181818',
                  color: postureState === 'curved' ? '#FF5555' : '#888',
                }}
              >
                ❌ Erro: Ocultamento
              </button>
              <button
                type="button"
                onClick={() => setPostureState('alpha')}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  border: postureState === 'alpha' ? '1px solid #00FF00' : '1px solid #333',
                  background: postureState === 'alpha' ? 'rgba(0, 255, 0, 0.18)' : '#181818',
                  color: postureState === 'alpha' ? '#00FF00' : '#888',
                }}
              >
                ✅ Correção: Alpha
              </button>
            </div>
          </div>

          <div
            style={{
              background: postureState === 'curved' ? 'rgba(255, 51, 51, 0.08)' : 'rgba(0, 255, 0, 0.08)',
              border: postureState === 'curved' ? '1px solid rgba(255, 51, 51, 0.4)' : '1px solid rgba(0, 255, 0, 0.4)',
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            <h4
              style={{
                margin: '0 0 8px 0',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '16px',
                color: postureState === 'curved' ? '#FF5555' : '#00FF00',
                textTransform: 'uppercase',
              }}
            >
              {postureState === 'curved' ? 'O Efeito Cone (Aderência)' : 'O Efeito Cortina (Alpha)'}
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#ddd', lineHeight: 1.55 }}>
              {postureState === 'curved'
                ? 'Curvar os ombros esvazia o peito superior. A camisa afunda perto do pescoço e a gordura da base é projetada para a frente. O resultado? A camisa marca o dobro do volume real.'
                : 'A camisa apoia no osso levantado do peito (esterno) e cai reta como um escudo. O volume da gordura é neutralizado, criando um bolsão de ar impenetrável. O formato pontudo desaparece na hora.'}
            </p>
          </div>
        </div>
      </section>

      {/* 02. O HACK DE 3 SEGUNDOS */}
      <section style={{ background: '#111', border: '1px solid #262626', borderRadius: '10px', padding: '18px' }}>
        <h3 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '16px', fontFamily: "'Montserrat', sans-serif", textTransform: 'uppercase' }}>
          02. O Hack de 3 Segundos: &ldquo;A Postura Alpha&rdquo;
        </h3>
        <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#aaa' }}>
          Sempre que vestir uma camiseta, pare em frente ao espelho e execute estas 3 alavancas ósseas:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '14px' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#38bdf8' }}>PASSO 1 • VETOR SUPERIOR</span>
            <h4 style={{ margin: '6px 0', color: '#fff', fontSize: '15px' }}>O Osso no Teto (Elevação Esternal)</h4>
            <p style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.5, margin: '0 0 8px 0' }}>
              Coloque o dedo no meio do peito (osso esterno) e aponte esse osso levemente para cima, em direção ao teto.
            </p>
            <div style={{ fontSize: '11px', color: '#FFD700', borderTop: '1px solid #262626', paddingTop: '8px' }}>
              <strong>Efeito:</strong> Levanta a base da camisa e estica a gordura pendular contra a caixa torácica.
            </div>
          </div>

          <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '14px' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#38bdf8' }}>PASSO 2 • VETOR POSTERIOR</span>
            <h4 style={{ margin: '6px 0', color: '#fff', fontSize: '15px' }}>Guarde as Escápulas no Bolso</h4>
            <p style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.5, margin: '0 0 8px 0' }}>
              Jogue os ombros para cima, para trás e puxe firme para baixo, como se guardasse as escápulas no bolso traseiro da calça.
            </p>
            <div style={{ fontSize: '11px', color: '#FFD700', borderTop: '1px solid #262626', paddingTop: '8px' }}>
              <strong>Efeito:</strong> Alarga os ombros em &ldquo;V&rdquo; e espalha a gordura do peito, matando o formato pontudo.
            </div>
          </div>

          <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '14px' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#38bdf8' }}>PASSO 3 • CILINDRO DE TRAVA</span>
            <h4 style={{ margin: '6px 0', color: '#fff', fontSize: '15px' }}>A Trava do Abdômen (20-30%)</h4>
            <p style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.5, margin: '0 0 8px 0' }}>
              Mantenha o abdômen contraído com 20% a 30% de força para proteger a lombar e travar as costelas.
            </p>
            <div style={{ fontSize: '11px', color: '#FFD700', borderTop: '1px solid #262626', paddingTop: '8px' }}>
              <strong>Efeito:</strong> Impede que a barriga e as costelas estufem, mantendo a armadura reta até a cintura.
            </div>
          </div>
        </div>
      </section>

      {/* 03. ENGENHARIA TÊXTIL: TABELA GSM & 3 CAMADAS */}
      <section style={{ background: '#111', border: '1px solid #262626', borderRadius: '10px', padding: '18px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '16px', fontFamily: "'Montserrat', sans-serif", textTransform: 'uppercase' }}>
          03. Engenharia Têxtil: A Física das Roupas (GSM)
        </h3>
        <p style={{ fontSize: '12px', color: '#bbb', margin: '0 0 12px 0' }}>
          A roupa obedece a regras de massa por área (GSM), reflexão de luz e estrutura mecânica:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <div style={{ background: '#161616', borderLeft: '4px solid #FF3333', padding: '12px', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800 }}>
              <span style={{ color: '#fff' }}>Malha Fina / Elástica (Abaixo de 160 GSM)</span>
              <span style={{ color: '#FF3333' }}>✕ PROIBIDO</span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#aaa' }}>
              Dry-fit barato ou viscose: adere estaticamente à pele, colapsa nos vales do tórax e marca os mamilos.
            </p>
          </div>

          <div style={{ background: '#161616', borderLeft: '4px solid #FFD700', padding: '12px', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800 }}>
              <span style={{ color: '#fff' }}>Malha Comercial Comum (160 a 200 GSM)</span>
              <span style={{ color: '#FFD700' }}>⚠ CUIDADO</span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#aaa' }}>
              Funciona apenas se o corte for estruturado e a cor for 100% fosca e escura (Preto, Grafite, Azul-Marinho).
            </p>
          </div>

          <div style={{ background: '#161616', borderLeft: '4px solid #00FF00', padding: '12px', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800 }}>
              <span style={{ color: '#fff' }}>Heavyweight / Algodão Pesado (200 a 240 GSM)</span>
              <span style={{ color: '#00FF00' }}>✓ PADRÃO-OURO</span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#aaa' }}>
              Possui estrutura mecânica própria (&ldquo;esqueleto&rdquo;). Apoia no peito alto e desce reto até o umbigo.
            </p>
          </div>
        </div>

        <h4 style={{ margin: '0 0 10px 0', color: '#38bdf8', fontSize: '13px', textTransform: 'uppercase' }}>
          🛡️ O Sistema das 3 Camadas Blindadas (Para Dias Críticos)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          <div style={{ background: '#161616', padding: '12px', borderRadius: '8px', border: '1px solid #242424' }}>
            <strong style={{ color: '#fff', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
              Camada 1: Base de Nivelamento
            </strong>
            <span style={{ fontSize: '12px', color: '#aaa' }}>
              Regata de compressão firme para nivelar a aréola e eliminar qualquer balanço ao caminhar.
            </span>
          </div>
          <div style={{ background: '#161616', padding: '12px', borderRadius: '8px', border: '1px solid #242424' }}>
            <strong style={{ color: '#fff', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
              Camada 2: Cobertura Estrutural
            </strong>
            <span style={{ fontSize: '12px', color: '#aaa' }}>
              Camiseta pesada fosca (200+ GSM) repousando sobre os ombros alinhados pela Postura Alpha.
            </span>
          </div>
          <div style={{ background: '#161616', padding: '12px', borderRadius: '8px', border: '1px solid #242424' }}>
            <strong style={{ color: '#fff', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
              Camada 3: Redirecionamento Óptico
            </strong>
            <span style={{ fontSize: '12px', color: '#aaa' }}>
              Jaqueta, sobrecamisa de sarja ou camisa flanela aberta: 2 linhas verticais que apagam a silhueta lateral.
            </span>
          </div>
        </div>
      </section>

      {/* 04. PROTOCOLO MATINAL DE REABILITAÇÃO (5 MINUTOS) */}
      <section style={{ background: '#111', border: '1px solid #262626', borderRadius: '10px', padding: '18px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#FFD700', fontSize: '16px', fontFamily: "'Montserrat', sans-serif", textTransform: 'uppercase' }}>
          04. Protocolo Matinal de Reabilitação (5 Minutos ao Acordar)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ background: '#161616', padding: '12px', borderRadius: '8px', border: '1px solid #242424' }}>
            <strong style={{ color: '#fff', fontSize: '13px' }}>
              1. Destravamento no Batente da Porta (Doorway Stretch) — 2x 45 segundos
            </strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#bbb' }}>
              Apoie os antebraços nas laterais de uma porta aberta (cotovelos a 90°). Dê um passo à frente até sentir o peitoral menor abrir e segure por 45s.
            </p>
          </div>

          <div style={{ background: '#161616', padding: '12px', borderRadius: '8px', border: '1px solid #242424' }}>
            <strong style={{ color: '#fff', fontSize: '13px' }}>
              2. Elevação em &ldquo;Y&rdquo; no Chão (Prone Y-Raise) — 2x 12 repetições
            </strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#bbb' }}>
              Deitado de barriga para baixo, estenda os braços em &ldquo;Y&rdquo; com polegares para o teto. Erga os braços apertando o trapézio inferior por 1 segundo.
            </p>
          </div>

          <div style={{ background: '#161616', padding: '12px', borderRadius: '8px', border: '1px solid #242424' }}>
            <strong style={{ color: '#fff', fontSize: '13px' }}>
              3. Flexão Escapular / Wall Slides + Respiração Diafragmática 360° — 2x 15 repetições
            </strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#bbb' }}>
              Ative o serrátil anterior e inspire pelo nariz expandindo as costelas laterais em 360°, reduzindo o cortisol e mantendo os ombros assentados.
            </p>
          </div>
        </div>
      </section>

      {/* 05. CHECKLIST RÁPIDO DE BOLSO (30S NO ESPELHO) */}
      <section style={{ background: '#111', border: '1px solid #38bdf8', borderRadius: '10px', padding: '18px' }}>
        <h3 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '16px', fontFamily: "'Montserrat', sans-serif", textTransform: 'uppercase' }}>
          05. Checklist Rápido de Bolso (30s no Espelho Antes de Sair)
        </h3>
        <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#aaa' }}>
          Toque nos itens abaixo ao fazer sua checagem rápida diante do espelho:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {MIRROR_CHECKLIST.map((item, idx) => {
            const isChecked = mirrorChecks[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleMirrorCheck(idx)}
                style={{
                  background: isChecked ? 'rgba(56, 189, 248, 0.14)' : '#161616',
                  border: isChecked ? '1px solid #38bdf8' : '1px solid #262626',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '6px',
                    border: '2px solid #38bdf8',
                    background: isChecked ? '#38bdf8' : 'transparent',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '13px',
                    flexShrink: 0,
                  }}
                >
                  {isChecked ? '✓' : ''}
                </div>
                <span style={{ fontSize: '12px', color: '#eee', lineHeight: 1.45 }}>
                  <strong style={{ color: '#38bdf8' }}>{item.title}</strong> {item.desc}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
