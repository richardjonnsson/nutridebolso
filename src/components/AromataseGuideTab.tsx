'use client';

import React, { useState, useEffect } from 'react';

interface SaboteurItem {
  id: number;
  name: string;
  cat: 'Fitoestrógenos' | 'Xenoestrogênios' | 'Vias Inflamatórias' | 'Picos de Insulina';
  mech: string;
}

const SABOTEURS_DATA: SaboteurItem[] = [
  { id: 1, name: 'Cerveja Comercial', cat: 'Fitoestrógenos', mech: 'Contém 8-PN (lúpulo), o fitoestrógeno vegetal mais potente do mundo.' },
  { id: 2, name: 'Proteína de Soja', cat: 'Fitoestrógenos', mech: 'Concentração alta de isoflavonas que mimetizam o estradiol no tecido peitoral.' },
  { id: 3, name: 'Óleo de Soja', cat: 'Fitoestrógenos', mech: 'Fitoestrógenos lipossolúveis combinados com Ômega-6 instável.' },
  { id: 4, name: 'Semente de Linhaça Crua', cat: 'Fitoestrógenos', mech: 'Lignanas que se ligam competitivamente aos receptores estrogênicos.' },
  { id: 5, name: 'Leite de Soja', cat: 'Fitoestrógenos', mech: 'Isoflavonas líquidas de rápida absorção no trato gastrointestinal.' },
  { id: 6, name: 'Marmitas Plásticas Quentes', cat: 'Xenoestrogênios', mech: 'Liberação térmica de Bisfenol-A (BPA), um desregulador endócrino direto.' },
  { id: 7, name: 'Garrafas PET no Calor', cat: 'Xenoestrogênios', mech: 'Lixiviação de ftalatos para a água, elevando a proteína SHBG.' },
  { id: 8, name: 'Desodorantes com Parabenos', cat: 'Xenoestrogênios', mech: 'Absorção transdérmica direta no sistema linfático axilar e peitoral.' },
  { id: 9, name: 'Copos Plásticos Quentes', cat: 'Xenoestrogênios', mech: 'O calor derrete monômeros plásticos para dentro da bebida quente.' },
  { id: 10, name: 'Atrazina (Agrotóxico)', cat: 'Xenoestrogênios', mech: 'Acumula cAMP celular e hiperativa o gene da aromatase (CYP19A1).' },
  { id: 11, name: 'Óleo de Girassol', cat: 'Vias Inflamatórias', mech: 'Excesso de Ômega-6 que ativa a enzima COX-2 e gera Prostaglandina E2 (PGE2).' },
  { id: 12, name: 'Óleo de Milho', cat: 'Vias Inflamatórias', mech: 'Eleva PGE2, ativando os promotores patológicos II e I.3 no peito.' },
  { id: 13, name: 'Óleo de Canola', cat: 'Vias Inflamatórias', mech: 'Gorduras altamente processadas e oxidadas que disparam TNF-alfa.' },
  { id: 14, name: 'Margarina Sintética', cat: 'Vias Inflamatórias', mech: 'Gorduras trans que inflamam os adipócitos mamários.' },
  { id: 15, name: 'Frituras Industriais', cat: 'Vias Inflamatórias', mech: 'Gorduras oxidadas que travam a lipólise do tecido adiposo.' },
  { id: 16, name: 'Açúcar Refinado', cat: 'Picos de Insulina', mech: 'Picos de insulina inibem a SHBG e favorecem o acúmulo de gordura.' },
  { id: 17, name: 'Xarope de Milho (HFCS)', cat: 'Picos de Insulina', mech: 'Sobrecarga de frutose sintética que induz esteatose hepática.' },
  { id: 18, name: 'Destilados em Excesso', cat: 'Picos de Insulina', mech: 'Bloqueia a metabolização hepática de Fase 1 do estrogênio.' },
  { id: 19, name: 'Refrigerantes Regulares', cat: 'Picos de Insulina', mech: 'Dose massiva de açúcar simples que trava a eliminação de estradiol.' },
  { id: 20, name: 'Pães e Massas Brancas', cat: 'Picos de Insulina', mech: 'Glicemia alta que mantém a insulina elevada, impedindo a secagem.' },
];

type SubTabId = 'overview' | 'cap1' | 'cap2' | 'cap3' | 'cap4' | 'cap5' | 'diagnostic';

export default function AromataseGuideTab() {
  const [subTab, setSubTab] = useState<SubTabId>('overview');

  // Cap 2: Auditoria EDC
  const [edcChecks, setEdcChecks] = useState<boolean[]>([false, false, false, false]);

  // Cap 3: Lista Negra filtro + busca
  const [saboteurFilter, setSaboteurFilter] = useState<string>('all');
  const [saboteurSearch, setSaboteurSearch] = useState<string>('');

  // Cap 5: Plano 30 Dias (6 checkboxes salvos no localStorage)
  const [protocolChecks, setProtocolChecks] = useState<boolean[]>([false, false, false, false, false, false]);

  // Diagnóstico de Risco (6 perguntas)
  const [q1, setQ1] = useState<number>(0);
  const [q2, setQ2] = useState<number>(0);
  const [q3, setQ3] = useState<number>(0);
  const [q4, setQ4] = useState<number>(0);
  const [q5, setQ5] = useState<number>(0);
  const [q6, setQ6] = useState<number>(0);
  const [riskResult, setRiskResult] = useState<{
    pct: number;
    level: 'BAIXO RISCO' | 'RISCO MODERADO' | 'RISCO ALTO';
    color: string;
    explanation: string;
    directive: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lipomastia_quick_protocol');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === 6) {
            setProtocolChecks(parsed);
          }
        } catch {}
      }
    }
  }, []);

  const toggleProtocolCheck = (idx: number) => {
    const next = [...protocolChecks];
    next[idx] = !next[idx];
    setProtocolChecks(next);
    localStorage.setItem('lipomastia_quick_protocol', JSON.stringify(next));
  };

  const resetProtocol = () => {
    const empty = [false, false, false, false, false, false];
    setProtocolChecks(empty);
    localStorage.removeItem('lipomastia_quick_protocol');
  };

  const edcActiveCount = edcChecks.filter(Boolean).length;
  const protocolDoneCount = protocolChecks.filter(Boolean).length;
  const protocolPct = Math.round((protocolDoneCount / protocolChecks.length) * 100);

  const filteredSaboteurs = SABOTEURS_DATA.filter((item) => {
    const matchesCat = saboteurFilter === 'all' || item.cat === saboteurFilter;
    const q = saboteurSearch.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(q) || item.mech.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleCalculateRisk = () => {
    const total = q1 + q2 + q3 + q4 + q5 + q6;
    const pct = Math.min(100, Math.round((total / 150) * 100));
    if (pct < 30) {
      setRiskResult({
        pct,
        level: 'BAIXO RISCO',
        color: '#00FF00',
        explanation: 'Sua exposição e hábitos estão relativamente equilibrados.',
        directive: 'Mantenha os treinos de força da Ficha Seca Peitoral e continue consumindo vegetais crucíferos diariamente.',
      });
    } else if (pct < 60) {
      setRiskResult({
        pct,
        level: 'RISCO MODERADO',
        color: '#FFD700',
        explanation: 'Há presença de xenoestrogênios ou inflamação ativando a enzima aromatase no peitoral.',
        directive: 'Elimine plásticos quentes, desodorantes com parabenos e substitua óleos vegetais imediatamente.',
      });
    } else {
      setRiskResult({
        pct,
        level: 'RISCO ALTO',
        color: '#FF3333',
        explanation: 'Aromatização ativa acelerada por dieta e agentes ambientais sequestrando sua testosterona.',
        directive: 'URGENTE: Aplique a Fase 1 do Plano de 30 dias hoje! Corte cerveja e introduza 150g de brócolis + 100g de cogumelos diários.',
      });
    }
  };

  const navItems: { id: SubTabId; label: string; highlight?: boolean }[] = [
    { id: 'overview', label: '⚡ Visão Geral & Ciclo' },
    { id: 'cap1', label: '🧬 1. O Mecanismo' },
    { id: 'cap2', label: '☣️ 2. Xenoestrogênios' },
    { id: 'cap3', label: '🚫 3. Lista Negra (20)' },
    { id: 'cap4', label: '🛡️ 4. Antídotos & Alimentos' },
    { id: 'cap5', label: '📅 5. Plano 30 Dias' },
    { id: 'diagnostic', label: '🎯 Teste de Risco', highlight: true },
  ];

  return (
    <div style={{ paddingBottom: '20px' }}>
      {/* Header do Guia de Trava da Aromatase */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.16), rgba(17, 17, 17, 0.96))',
          border: '1px solid rgba(245, 158, 11, 0.45)',
          borderRadius: '12px',
          padding: '18px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
          <span
            style={{
              background: '#FFD700',
              color: '#000',
              fontSize: '10px',
              fontWeight: 900,
              padding: '3px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            DOSSIÊ TÁTICO UNIFICADO • BÔNUS #02
          </span>
          <span
            style={{
              background: 'rgba(0, 255, 0, 0.14)',
              border: '1px solid #00FF00',
              color: '#00FF00',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >
            PROTOCOLO ANTI-LIPOMASTIA
          </span>
        </div>
        <h2
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '21px',
            fontWeight: 900,
            color: '#fff',
            textTransform: 'uppercase',
            margin: '4px 0',
          }}
        >
          Guia de Trava da <span style={{ color: '#FFD700' }}>Aromatase</span>
        </h2>
        <p style={{ margin: 0, fontSize: '12px', color: '#ccc', lineHeight: 1.5 }}>
          Manual completo para bloquear a enzima CYP19A1, blindar sua testosterona livre, cortar os 20 sabotadores e destravar a queima da gordura peitoral.
        </p>
      </div>

      {/* Sub-navegação horizontal do Guia */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '18px',
        }}
      >
        {navItems.map((item) => {
          const isActive = subTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSubTab(item.id)}
              style={{
                whiteSpace: 'nowrap',
                padding: '9px 13px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                border: isActive
                  ? '1px solid #FFD700'
                  : item.highlight
                  ? '1px solid rgba(255, 215, 0, 0.45)'
                  : '1px solid #262626',
                background: isActive
                  ? '#FFD700'
                  : item.highlight
                  ? 'rgba(255, 215, 0, 0.12)'
                  : '#141414',
                color: isActive ? '#000' : item.highlight ? '#FFD700' : '#ccc',
                transition: 'all 0.15s',
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* ABA 1: VISÃO GERAL & CICLO DA AROMATASE (FUSÃO ENTREGÁVEL PRINCIPAL + BÔNUS 02) */}
      {subTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Resumo Executivo */}
          <div
            style={{
              background: '#111',
              border: '1px solid #282828',
              borderLeft: '4px solid #FFD700',
              borderRadius: '10px',
              padding: '18px',
            }}
          >
            <span style={{ fontSize: '11px', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase' }}>
              ⚡ RESUMO EXECUTIVO
            </span>
            <h3
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '18px',
                color: '#fff',
                margin: '6px 0 8px 0',
                textTransform: 'uppercase',
              }}
            >
              Gordura Peitoral Não É Falta de Cardio. É Excesso de Aromatase.
            </h3>
            <p style={{ fontSize: '13px', color: '#ccc', lineHeight: 1.6, margin: 0 }}>
              A enzima <strong style={{ color: '#fff' }}>aromatase (CYP19A1)</strong> fica concentrada nas células de gordura do homem (especialmente no peito) e pega sua{' '}
              <strong style={{ color: '#00FF00' }}>testosterona</strong> convertendo-a diretamente em{' '}
              <strong style={{ color: '#FF5555' }}>estradiol (E2 / estrogênio)</strong> no tecido adiposo mamário. Tentar queimar essa gordura apenas com aeróbico longo sem bloquear a enzima só eleva o cortisol e piora a conversão.
            </p>
          </div>

          {/* 3 Ações Imediatas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div
              style={{
                background: '#141414',
                border: '1px solid #2a2a2a',
                borderTop: '4px solid #FF3333',
                borderRadius: '10px',
                padding: '15px',
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#FF3333', textTransform: 'uppercase' }}>
                1. PARAR HOJE
              </span>
              <h4 style={{ margin: '6px 0', color: '#fff', fontSize: '15px', fontFamily: "'Montserrat', sans-serif" }}>
                Plásticos Quentes & Cerveja
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#bbb', lineHeight: 1.5 }}>
                BPA de marmitas plásticas aquecidas e fitoestrógenos (8-PN do lúpulo) da cerveja ligam diretamente os receptores mamários.
              </p>
            </div>

            <div
              style={{
                background: '#141414',
                border: '1px solid #2a2a2a',
                borderTop: '4px solid #FFD700',
                borderRadius: '10px',
                padding: '15px',
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#FFD700', textTransform: 'uppercase' }}>
                2. CORTAR HOJE
              </span>
              <h4 style={{ margin: '6px 0', color: '#fff', fontSize: '15px', fontFamily: "'Montserrat', sans-serif" }}>
                Óleos Vegetais (Soja/Canola)
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#bbb', lineHeight: 1.5 }}>
                Óleos oxidados disparam a molécula inflamatória PGE2, que hiperativa o gene da aromatase no peitoral.
              </p>
            </div>

            <div
              style={{
                background: '#141414',
                border: '1px solid #2a2a2a',
                borderTop: '4px solid #00FF00',
                borderRadius: '10px',
                padding: '15px',
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#00FF00', textTransform: 'uppercase' }}>
                3. INICIAR HOJE
              </span>
              <h4 style={{ margin: '6px 0', color: '#fff', fontSize: '15px', fontFamily: "'Montserrat', sans-serif" }}>
                Crucíferas + Treino Pesado
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#bbb', lineHeight: 1.5 }}>
                Brócolis/DIM e cogumelos ajustam a metabolização hepática do estrogênio enquanto cargas pesadas estimulam andrógenos.
              </p>
            </div>
          </div>

          {/* Os 4 Pilares Estratégicos (Unificados do Entregável Principal) */}
          <div
            style={{
              background: '#111',
              border: '1px solid #242424',
              borderRadius: '10px',
              padding: '18px',
            }}
          >
            <h3
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '15px',
                color: '#00FF00',
                textTransform: 'uppercase',
                margin: '0 0 14px 0',
              }}
            >
              🛡️ Os 4 Pilares da Trava da Aromatase & Secagem Peitoral
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              <div style={{ background: '#161616', padding: '14px', borderRadius: '8px', border: '1px solid #222' }}>
                <strong style={{ color: '#00d0ff', display: 'block', marginBottom: '6px', fontSize: '13px' }}>
                  1. O Ciclo da Aromatase no Peitoral
                </strong>
                <p style={{ margin: 0, fontSize: '12px', color: '#ccc', lineHeight: 1.55 }}>
                  Quanto mais gordura acumulada no tórax, mais aromatase ativa você tem — criando um ciclo vicioso de <em>pseudoginecomastia</em> e retenção local. Travar a enzima corta o combustível que mantém essa gordura presa.
                </p>
              </div>

              <div style={{ background: '#161616', padding: '14px', borderRadius: '8px', border: '1px solid #222' }}>
                <strong style={{ color: '#00FF00', display: 'block', marginBottom: '6px', fontSize: '13px' }}>
                  2. Os 5 Alimentos Bloqueadores de Aromatase
                </strong>
                <div style={{ fontSize: '12px', color: '#ccc', lineHeight: 1.55 }}>
                  • <strong>Brócolis e Crucíferos:</strong> Ricos em DIM e I3C, depuram estrogênio.<br />
                  • <strong>Cogumelos Paris/Frescos:</strong> Inibem a enzima nos adipócitos.<br />
                  • <strong>Sementes de Abóbora & Zinco:</strong> Blindam a testosterona livre.<br />
                  • <strong>Chá Verde (EGCG):</strong> Supressor natural comprovado da aromatase.<br />
                  • <strong>Morangos/Frutas Vermelhas:</strong> Resveratrol anti-estrogênico.
                </div>
              </div>

              <div style={{ background: '#161616', padding: '14px', borderRadius: '8px', border: '1px solid #222' }}>
                <strong style={{ color: '#FF5555', display: 'block', marginBottom: '6px', fontSize: '13px' }}>
                  3. Os Inimigos Que Você Deve Eliminar
                </strong>
                <div style={{ fontSize: '12px', color: '#ccc', lineHeight: 1.55 }}>
                  • <strong>Cerveja e Álcool:</strong> O lúpulo é o fitoestrógeno mais forte da natureza e o álcool trava o fígado.<br />
                  • <strong>Açúcar e Farinha Branca:</strong> Picos de insulina ativam a aromatase e derrubam o SHBG.<br />
                  • <strong>Potes Plásticos Quentes:</strong> Liberam BPA (xenoestrogênio sintético).
                </div>
              </div>

              <div style={{ background: '#161616', padding: '14px', borderRadius: '8px', border: '1px solid #222' }}>
                <strong style={{ color: '#FFD700', display: 'block', marginBottom: '6px', fontSize: '13px' }}>
                  4. Sinergia com a Ficha de Treino Seca Peitoral
                </strong>
                <p style={{ margin: 0, fontSize: '12px', color: '#ccc', lineHeight: 1.55 }}>
                  O treino de musculação pesada rompe fibras peitorais e estimula receptores androgênicos locais. Ao combinar com o déficit calórico e alimentos anti-aromatase, seu corpo queima as reservas do peito e desenha um tórax quadrado e firme.
                </p>
              </div>
            </div>
          </div>

          {/* Callout para o Diagnóstico de 1 Minuto */}
          <div
            style={{
              background: 'rgba(255, 215, 0, 0.08)',
              border: '1px solid rgba(255, 215, 0, 0.4)',
              borderRadius: '10px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#FFD700', textTransform: 'uppercase' }}>
                AUDITORIA INDIVIDUAL
              </span>
              <h4 style={{ margin: '4px 0 0 0', color: '#fff', fontSize: '15px', fontFamily: "'Montserrat', sans-serif" }}>
                Quer descobrir seu Nível de Risco de Aromatização agora?
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setSubTab('diagnostic')}
              style={{
                background: '#FFD700',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '12px',
                fontWeight: 900,
                cursor: 'pointer',
                fontFamily: "'Montserrat', sans-serif",
                textTransform: 'uppercase',
              }}
            >
              🎯 Iniciar Diagnóstico (1 Min)
            </button>
          </div>
        </div>
      )}

      {/* ABA 2: CAPÍTULO 1 - O MECANISMO EM 60 SEGUNDOS */}
      {subTab === 'cap1' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              background: '#111',
              borderLeft: '4px solid #FFD700',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #262626',
            }}
          >
            <h3 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '17px', fontFamily: "'Montserrat', sans-serif" }}>
              Capítulo 1: O Mecanismo da Aromatização em 60 Segundos
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>
              Entenda sem rodeios a reação bioquímica que sequestra a testosterona masculina e como reverter a razão hormonal.
            </p>
          </div>

          <div
            style={{
              background: '#141414',
              border: '1px solid #2a2a2a',
              borderRadius: '10px',
              padding: '18px',
            }}
          >
            <span style={{ fontSize: '11px', color: '#FFD700', fontWeight: 800, fontFamily: 'monospace' }}>
              A REAÇÃO QUE VOCÊ PRECISA BLOQUEAR
            </span>
            <div
              style={{
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '8px',
                padding: '14px',
                textAlign: 'center',
                fontFamily: 'monospace',
                fontSize: '15px',
                fontWeight: 800,
                color: '#FFD700',
                margin: '10px 0 14px 0',
              }}
            >
              Testosterona + Aromatase (CYP19A1) ➔ Estradiol (E2)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#ccc' }}>
              <div>
                <span style={{ color: '#FF3333', fontWeight: 900 }}>▪ O Problema: </span>
                Quanto mais gordura no peito, mais enzima aromatase é fabricada localmente.
              </div>
              <div>
                <span style={{ color: '#FF3333', fontWeight: 900 }}>▪ Por que o cardio longo falha: </span>
                Aeróbico contínuo longo aumenta o cortisol (TNF-alfa) e ativa os promotores patológicos I.3 e II do gene da aromatase.
              </div>
              <div>
                <span style={{ color: '#00FF00', fontWeight: 900 }}>▪ A Solução Tática: </span>
                Treino de carga pesada (baixo volume / alta intensidade) + bloqueadores nutricionais enzimáticos.
              </div>
            </div>
          </div>

          {/* Comparação Rápida */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(255, 51, 51, 0.08)',
                border: '1px solid rgba(255, 51, 51, 0.35)',
                borderRadius: '10px',
                padding: '15px',
              }}
            >
              <strong style={{ color: '#FF5555', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                ❌ Cardio Longo + Dieta Restritiva Cega
              </strong>
              <p style={{ margin: 0, fontSize: '12px', color: '#ddd', lineHeight: 1.5 }}>
                Sobe Cortisol ➔ Eleva Aromatase ➔ Queima Músculo ➔ Mantém o Peito Inflado e Flácido.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(0, 255, 0, 0.08)',
                border: '1px solid rgba(0, 255, 0, 0.35)',
                borderRadius: '10px',
                padding: '15px',
              }}
            >
              <strong style={{ color: '#00FF00', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                ✅ Força Pesada + Inibição Enzimática
              </strong>
              <p style={{ margin: 0, fontSize: '12px', color: '#ddd', lineHeight: 1.5 }}>
                Sobe Testosterona Livre ➔ Reduz Aromatase ➔ Preserva Músculo ➔ Seca e Cola a Pele do Peitoral.
              </p>
            </div>
          </div>

          {/* Gráfico Visual da Evolução da Razão Testosterona / Estradiol (12 Semanas) */}
          <div
            style={{
              background: '#111',
              border: '1px solid #262626',
              borderRadius: '10px',
              padding: '18px',
            }}
          >
            <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '15px', fontFamily: "'Montserrat', sans-serif" }}>
              📈 Evolução da Razão Testosterona / Estradiol (12 Semanas)
            </h4>
            <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#888' }}>
              Comparativo da proporção androgênica entre o Protocolo Tático Seca Peitoral vs Apenas Cardio.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { week: 'Semana 1', tactical: 12, cardio: 12 },
                { week: 'Semana 3', tactical: 20, cardio: 10 },
                { week: 'Semana 6', tactical: 30, cardio: 9 },
                { week: 'Semana 9', tactical: 40, cardio: 8 },
                { week: 'Semana 12', tactical: 48, cardio: 7 },
              ].map((row) => (
                <div key={row.week} style={{ background: '#161616', padding: '10px 12px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <strong style={{ color: '#fff' }}>{row.week}</strong>
                    <span style={{ color: '#00FF00', fontWeight: 700 }}>
                      Protocolo Tático: {row.tactical} vs Cardio: <span style={{ color: '#FF5555' }}>{row.cardio}</span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ width: '100%', background: '#222', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(row.tactical / 50) * 100}%`, background: '#00FF00', height: '100%' }} />
                    </div>
                    <div style={{ width: '100%', background: '#222', height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(row.cardio / 50) * 100}%`, background: '#FF3333', height: '100%' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: CAPÍTULO 2 - XENOESTROGÊNIOS */}
      {subTab === 'cap2' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              background: '#111',
              borderLeft: '4px solid #FFD700',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #262626',
            }}
          >
            <h3 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '17px', fontFamily: "'Montserrat', sans-serif" }}>
              Capítulo 2: Xenoestrogênios (Os Infiltrados Ambientais)
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>
              Compostos sintéticos que entram no seu corpo, ligam-se aos receptores estrogênicos e enganam seu sistema endócrino.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '16px' }}>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#FF3333' }}>AMEAÇA #1</span>
              <h4 style={{ margin: '6px 0', color: '#fff', fontSize: '15px' }}>BPA em Plásticos Quentes</h4>
              <p style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.5 }}>
                Aquecer potes plásticos no micro-ondas solta Bisfenol-A diretamente na comida. O BPA age como estrogênio artificial no tecido mamário.
              </p>
              <div style={{ background: 'rgba(0,255,0,0.1)', color: '#00FF00', padding: '8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                ✓ Substituição: Use vidro ou cerâmica.
              </div>
            </div>

            <div style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '16px' }}>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#FF3333' }}>AMEAÇA #2</span>
              <h4 style={{ margin: '6px 0', color: '#fff', fontSize: '15px' }}>Parabenos em Desodorantes</h4>
              <p style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.5 }}>
                Aplicar desodorante aerossol comercial com parabenos e alumínio na axila permite absorção transdérmica direta no sistema linfático do peito.
              </p>
              <div style={{ background: 'rgba(0,255,0,0.1)', color: '#00FF00', padding: '8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                ✓ Substituição: Use Pedra-Ume (Alúmen) ou sem parabenos.
              </div>
            </div>

            <div style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '16px' }}>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#FF3333' }}>AMEAÇA #3</span>
              <h4 style={{ margin: '6px 0', color: '#fff', fontSize: '15px' }}>Atrazina na Água Não Filtrada</h4>
              <p style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.5 }}>
                Agrotóxico comum que hiperativa a produção celular de cAMP e força a expressão da aromatase pelo fígado.
              </p>
              <div style={{ background: 'rgba(0,255,0,0.1)', color: '#00FF00', padding: '8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                ✓ Substituição: Use filtro de carvão ativado.
              </div>
            </div>
          </div>

          {/* Auditoria Interativa de 4 Itens */}
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '18px' }}>
            <h4 style={{ margin: '0 0 6px 0', color: '#FFD700', fontSize: '15px', fontFamily: "'Montserrat', sans-serif" }}>
              🔍 Auditoria Rápida de Exposição Ambiental
            </h4>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#aaa' }}>
              Marque os hábitos que ainda fazem parte da sua rotina atual:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px', marginBottom: '14px' }}>
              {[
                'Aqueço marmitas plásticas no micro-ondas',
                'Bebo água em garrafas PET esquentadas no carro/sol',
                'Uso desodorante aerossol comercial sem checar rótulo',
                'Tomo café quente em copinhos plásticos descartáveis finos',
              ].map((label, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const next = [...edcChecks];
                    next[idx] = !next[idx];
                    setEdcChecks(next);
                  }}
                  style={{
                    background: edcChecks[idx] ? 'rgba(255, 51, 51, 0.14)' : '#181818',
                    border: edcChecks[idx] ? '1px solid #FF3333' : '1px solid #2a2a2a',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '12px',
                    color: '#eee',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: edcChecks[idx] ? '2px solid #FF3333' : '2px solid #555',
                      background: edcChecks[idx] ? '#FF3333' : 'transparent',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 900,
                      flexShrink: 0,
                    }}
                  >
                    {edcChecks[idx] ? '✓' : ''}
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                padding: '12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                background:
                  edcActiveCount === 0
                    ? 'rgba(0, 255, 0, 0.1)'
                    : edcActiveCount <= 2
                    ? 'rgba(255, 215, 0, 0.12)'
                    : 'rgba(255, 51, 51, 0.15)',
                border:
                  edcActiveCount === 0
                    ? '1px solid #00FF00'
                    : edcActiveCount <= 2
                    ? '1px solid #FFD700'
                    : '1px solid #FF3333',
                color: edcActiveCount === 0 ? '#00FF00' : edcActiveCount <= 2 ? '#FFD700' : '#FF5555',
              }}
            >
              {edcActiveCount === 0
                ? '✅ Excelente! Nenhuma exposição crítica detectada nestes 4 itens ambientais.'
                : edcActiveCount <= 2
                ? `⚠️ Alerta: ${edcActiveCount} fonte(s) de Xenoestrogênios ativa(s) na sua rotina. Substitua-as esta semana.`
                : `🚨 Risco Alto: ${edcActiveCount} fontes ativas! Seu peitoral está recebendo sinais estrogênicos contínuos.`}
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: CAPÍTULO 3 - LISTA NEGRA DOS 20 SABOTADORES */}
      {subTab === 'cap3' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              background: '#111',
              borderLeft: '4px solid #FFD700',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #262626',
            }}
          >
            <h3 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '17px', fontFamily: "'Montserrat', sans-serif" }}>
              Capítulo 3: A Lista Negra dos 20 Sabotadores
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>
              Pesquise ou filtre os 20 compostos e alimentos que alimentam diretamente a aromatase peitoral.
            </p>
          </div>

          <div style={{ background: '#111', border: '1px solid #262626', borderRadius: '10px', padding: '16px' }}>
            <input
              type="text"
              value={saboteurSearch}
              onChange={(e) => setSaboteurSearch(e.target.value)}
              placeholder="🔎 Pesquisar item (ex: Cerveja, Soja, Óleo, Plástico)..."
              className="form-control"
              style={{ marginBottom: '12px', fontSize: '13px', padding: '11px 14px' }}
            />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
              {[
                { key: 'all', label: 'Todos (20)' },
                { key: 'Fitoestrógenos', label: 'Fitoestrógenos' },
                { key: 'Xenoestrogênios', label: 'Xenoestrogênios' },
                { key: 'Vias Inflamatórias', label: 'Inflamatórios (PGE2)' },
                { key: 'Picos de Insulina', label: 'Insulina & Fígado' },
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setSaboteurFilter(f.key)}
                  style={{
                    padding: '6px 11px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: saboteurFilter === f.key ? '1px solid #FFD700' : '1px solid #2a2a2a',
                    background: saboteurFilter === f.key ? '#FFD700' : '#1a1a1a',
                    color: saboteurFilter === f.key ? '#000' : '#ccc',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredSaboteurs.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#161616',
                    border: '1px solid #242424',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <strong style={{ color: '#fff', fontSize: '13px' }}>
                      <span style={{ color: '#FFD700', fontFamily: 'monospace', marginRight: '6px' }}>
                        #{String(item.id).padStart(2, '0')}
                      </span>
                      {item.name}
                    </strong>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: '#222',
                        color: '#FFD700',
                        border: '1px solid #333',
                      }}
                    >
                      {item.cat}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#bbb', lineHeight: 1.45 }}>{item.mech}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA 5: CAPÍTULO 4 - OS 4 ANTÍDOTOS NATURAIS + SIMULADOR DIM */}
      {subTab === 'cap4' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              background: '#111',
              borderLeft: '4px solid #00FF00',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #262626',
            }}
          >
            <h3 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '17px', fontFamily: "'Montserrat', sans-serif" }}>
              Capítulo 4: Os Antídotos Naturais & Bloqueadores Enzimáticos
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>
              Ativos nutricionais comprovados que bloqueiam a aromatase e forçam a excreção hepática do estrogênio ruim.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            <div style={{ background: '#141414', border: '1px solid #282828', borderRadius: '10px', padding: '16px' }}>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#00FF00' }}>ANTÍDOTO #1</span>
              <h4 style={{ margin: '6px 0', color: '#fff', fontSize: '15px' }}>Di-indolilmetano (DIM)</h4>
              <p style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.5 }}>
                Presente em crucíferas (brócolis, couve-flor, repolho). Altera o metabolismo hepático do estrogênio para a via segura 2-OHE1 (estrogênio benigno).
              </p>
              <div style={{ background: '#1c1c1c', padding: '8px', borderRadius: '6px', fontSize: '11px', color: '#00FF00' }}>
                <strong>Dose / Fonte:</strong> 150g a 200g de brócolis cozido no vapor por dia.
              </div>
            </div>

            <div style={{ background: '#141414', border: '1px solid #282828', borderRadius: '10px', padding: '16px' }}>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#00FF00' }}>ANTÍDOTO #2</span>
              <h4 style={{ margin: '6px 0', color: '#fff', fontSize: '15px' }}>Agaricus bisporus (Cogumelo Paris)</h4>
              <p style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.5 }}>
                Contém fitoquímicos que se ligam diretamente à enzima aromatase, paralisando a conversão de testosterona em estradiol no tecido peitoral.
              </p>
              <div style={{ background: '#1c1c1c', padding: '8px', borderRadius: '6px', fontSize: '11px', color: '#00FF00' }}>
                <strong>Dose / Fonte:</strong> 100g de cogumelo Paris fresco salteado diariamente.
              </div>
            </div>

            <div style={{ background: '#141414', border: '1px solid #282828', borderRadius: '10px', padding: '16px' }}>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#00FF00' }}>ANTÍDOTO #3</span>
              <h4 style={{ margin: '6px 0', color: '#fff', fontSize: '15px' }}>Zinco Mineral & Sementes</h4>
              <p style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.5 }}>
                Reduz a sensibilidade do receptor ER-alfa no peito e evita que a testosterona livre sofra conversão periférica acelerada.
              </p>
              <div style={{ background: '#1c1c1c', padding: '8px', borderRadius: '6px', fontSize: '11px', color: '#00FF00' }}>
                <strong>Dose / Fonte:</strong> Carne vermelha magra (patinho), sementes de abóbora ou zinco quelato.
              </div>
            </div>

            <div style={{ background: '#141414', border: '1px solid #282828', borderRadius: '10px', padding: '16px' }}>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#00FF00' }}>ANTÍDOTO #4</span>
              <h4 style={{ margin: '6px 0', color: '#fff', fontSize: '15px' }}>D-Glucarato + Chá Verde (EGCG)</h4>
              <p style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.5 }}>
                Inibe a enzima intestinal beta-glucuronidase, impedindo que o estrogênio já inativado pelo fígado seja reabsorvido no intestino.
              </p>
              <div style={{ background: '#1c1c1c', padding: '8px', borderRadius: '6px', fontSize: '11px', color: '#00FF00' }}>
                <strong>Dose / Fonte:</strong> 1-2 xícaras de chá verde + frutas vermelhas (morangos) e crucíferos.
              </div>
            </div>
          </div>

          {/* Simulador Visual de Mudança de Metabólitos Hepáticos (DIM) */}
          <div style={{ background: '#111', border: '1px solid #262626', borderRadius: '10px', padding: '18px' }}>
            <h4 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '15px', fontFamily: "'Montserrat', sans-serif" }}>
              🔬 Simulador de Mudança de Metabólitos Hepáticos (Efeito do DIM)
            </h4>
            <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#aaa' }}>
              Veja como o consumo diário de crucíferos (DIM) inverte a proporção de estrogênio no seu fígado:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <strong style={{ color: '#ccc' }}>Sem DIM (Dieta Comum Inflamatória)</strong>
                  <span style={{ color: '#FF5555', fontWeight: 700 }}>80% Estrogênio Ruim (16-alfa-OHE1) / 20% Protetor</span>
                </div>
                <div style={{ display: 'flex', height: '18px', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: '20%', background: '#00FF00' }} title="20% 2-OHE1 Protetor" />
                  <div style={{ width: '80%', background: '#FF3333' }} title="80% 16-alfa-OHE1 Ruim" />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <strong style={{ color: '#fff' }}>Com DIM (Crucíferas Diárias na Dieta Seca Peitoral)</strong>
                  <span style={{ color: '#00FF00', fontWeight: 700 }}>80% Estrogênio Protetor (2-OHE1) / 20% Ruim</span>
                </div>
                <div style={{ display: 'flex', height: '18px', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: '80%', background: '#00FF00' }} title="80% 2-OHE1 Protetor" />
                  <div style={{ width: '20%', background: '#FF3333' }} title="20% 16-alfa-OHE1 Ruim" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 6: CAPÍTULO 5 - PLANO TÁTICO DE 30 DIAS */}
      {subTab === 'cap5' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              background: '#111',
              borderLeft: '4px solid #FFD700',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #262626',
            }}
          >
            <h3 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '17px', fontFamily: "'Montserrat', sans-serif" }}>
              Capítulo 5: Plano Tático de 30 Dias (Checklist Dinâmico)
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>
              Marque as diretrizes conforme as implementa. Seu progresso fica salvo automaticamente.
            </p>
          </div>

          <div style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, color: '#FFD700', marginBottom: '8px' }}>
              <span>PROGRESSO DO PROTOCOLO DE 30 DIAS</span>
              <span>{protocolDoneCount} / 6 Concluídos ({protocolPct}%)</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: '#222', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${protocolPct}%`, height: '100%', background: '#00FF00', transition: 'width 0.3s' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {[
              {
                phase: 'DIAS 1 A 10',
                title: 'Fase 1: Purga Total',
                items: [
                  { idx: 0, text: 'Trocar desodorantes com parabenos por pedra-ume.' },
                  { idx: 1, text: 'Banir potes plásticos quentes e garrafas PET expostas ao sol.' },
                ],
              },
              {
                phase: 'DIAS 11 A 20',
                title: 'Fase 2: Bloqueio Enzimático',
                items: [
                  { idx: 2, text: 'Comer 150g de brócolis/couve-flor + 100g de cogumelo Paris diariamente.' },
                  { idx: 3, text: 'Executar a Ficha de Treino Seca Peitoral com carga intensa 3-4x/semana.' },
                ],
              },
              {
                phase: 'DIAS 21 A 30',
                title: 'Fase 3: Excreção Hepática',
                items: [
                  { idx: 4, text: 'Eliminar 100% óleos vegetais de soja/canola e cerveja.' },
                  { idx: 5, text: 'Manter hidratação tática alta (35ml/kg a 4L) para excreção renal.' },
                ],
              },
            ].map((group) => (
              <div key={group.phase} style={{ background: '#111', border: '1px solid #262626', borderRadius: '10px', padding: '16px' }}>
                <span style={{ fontSize: '10px', fontWeight: 900, color: '#FFD700' }}>{group.phase}</span>
                <h4 style={{ margin: '4px 0 12px 0', color: '#fff', fontSize: '15px', fontFamily: "'Montserrat', sans-serif" }}>
                  {group.title}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {group.items.map((it) => {
                    const checked = protocolChecks[it.idx];
                    return (
                      <div
                        key={it.idx}
                        onClick={() => toggleProtocolCheck(it.idx)}
                        style={{
                          background: checked ? 'rgba(0, 255, 0, 0.1)' : '#181818',
                          border: checked ? '1px solid #00FF00' : '1px solid #2a2a2a',
                          borderRadius: '8px',
                          padding: '10px',
                          fontSize: '12px',
                          color: checked ? '#fff' : '#ccc',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                        }}
                      >
                        <span style={{ color: checked ? '#00FF00' : '#666', fontWeight: 900 }}>
                          {checked ? '✓' : '○'}
                        </span>
                        <span style={{ textDecoration: checked ? 'line-through' : 'none' }}>{it.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              onClick={resetProtocol}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#777',
                fontSize: '11px',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Resetar Checklist de 30 Dias
            </button>
          </div>
        </div>
      )}

      {/* ABA 7: DIAGNÓSTICO DE RISCO DE AROMATIZAÇÃO (6 PERGUNTAS) */}
      {subTab === 'diagnostic' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              background: '#111',
              borderLeft: '4px solid #FFD700',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #262626',
            }}
          >
            <h3 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '17px', fontFamily: "'Montserrat', sans-serif" }}>
              🎯 Auditoria Rápida: Teste Seu Risco de Aromatização
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>
              Responda às 6 perguntas abaixo para calcular seu índice metabólico de carga estrogênica.
            </p>
          </div>

          <div style={{ background: '#111', border: '1px solid #262626', borderRadius: '10px', padding: '18px' }}>
            <div className="form-group">
              <label>1. Frequência de consumo de cerveja?</label>
              <select className="form-control" value={q1} onChange={(e) => setQ1(Number(e.target.value))}>
                <option value={0}>Raramente ou nunca</option>
                <option value={15}>1 a 2 vezes por semana</option>
                <option value={30}>3 ou mais vezes por semana (Carga alta de 8-PN)</option>
              </select>
            </div>

            <div className="form-group">
              <label>2. Esquenta alimentos em potes plásticos no micro-ondas?</label>
              <select className="form-control" value={q2} onChange={(e) => setQ2(Number(e.target.value))}>
                <option value={0}>Nunca, uso vidro/cerâmica</option>
                <option value={15}>Às vezes uso potes plásticos</option>
                <option value={25}>Frequente em qualquer pote plástico</option>
              </select>
            </div>

            <div className="form-group">
              <label>3. Tipo de desodorante diário?</label>
              <select className="form-control" value={q3} onChange={(e) => setQ3(Number(e.target.value))}>
                <option value={0}>Pedra-ume ou sem parabenos</option>
                <option value={20}>Aerossol comercial comum</option>
              </select>
            </div>

            <div className="form-group">
              <label>4. Óleos usados para cozinhar na sua casa?</label>
              <select className="form-control" value={q4} onChange={(e) => setQ4(Number(e.target.value))}>
                <option value={0}>Azeite de oliva, banha, manteiga/ghee ou óleo de coco</option>
                <option value={25}>Óleo de soja, milho, canola ou girassol</option>
              </select>
            </div>

            <div className="form-group">
              <label>5. Gordura ou sensibilidade visível no peitoral?</label>
              <select className="form-control" value={q5} onChange={(e) => setQ5(Number(e.target.value))}>
                <option value={0}>Pouco ou nenhum acúmulo</option>
                <option value={15}>Gordura moderada e sem firmeza</option>
                <option value={30}>Acúmulo evidente / mamilos projetados (efeito cone)</option>
              </select>
            </div>

            <div className="form-group">
              <label>6. Come brócolis/couve-flor e cogumelos frescos?</label>
              <select className="form-control" value={q6} onChange={(e) => setQ6(Number(e.target.value))}>
                <option value={0}>Quase todos os dias</option>
                <option value={10}>2 a 3 vezes por semana</option>
                <option value={20}>Raramente ou nunca</option>
              </select>
            </div>

            <button type="button" onClick={handleCalculateRisk} className="btn btn-primary" style={{ marginTop: '10px' }}>
              🎯 Gerar Meu Diagnóstico de Aromatização
            </button>

            {riskResult && (
              <div
                style={{
                  marginTop: '18px',
                  background: '#161616',
                  border: `2px solid ${riskResult.color}`,
                  borderRadius: '10px',
                  padding: '18px',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', fontWeight: 800 }}>
                  ÍNDICE DE CARGA DE AROMATIZAÇÃO
                </span>
                <div style={{ fontSize: '42px', fontWeight: 900, color: riskResult.color, fontFamily: "'Montserrat', sans-serif", margin: '6px 0' }}>
                  {riskResult.pct}%
                </div>
                <span
                  style={{
                    display: 'inline-block',
                    background: riskResult.color,
                    color: '#000',
                    fontWeight: 900,
                    fontSize: '12px',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    marginBottom: '12px',
                  }}
                >
                  {riskResult.level}
                </span>
                <p style={{ fontSize: '13px', color: '#ddd', margin: '0 0 12px 0' }}>{riskResult.explanation}</p>
                <div
                  style={{
                    background: '#111',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '12px',
                    color: '#FFD700',
                    textAlign: 'left',
                  }}
                >
                  <strong>⚡ Diretriz Tática Imediata:</strong> {riskResult.directive}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
