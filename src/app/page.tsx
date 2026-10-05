'use client';

import React, { useState, useEffect } from 'react';
import { generateTacticalPdf, TacticalDietData } from '@/lib/pdfGenerator';
import { getProteinPortion, getCarbPortion, getHealthyFatPortion } from '@/lib/foodCalculations';
import confetti from 'canvas-confetti';

export default function Home() {
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 0. Autenticação Kiwify / Acesso de Aluno
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [activeUser, setActiveUser] = useState<{ email: string; name: string; role?: string } | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('qg_user_email');
    if (savedEmail) {
      verifyEmailAccess(savedEmail, true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const verifyEmailAccess = async (emailToVerify: string, isSilent = false) => {
    const cleanEmail = emailToVerify.trim().toLowerCase();
    if (!cleanEmail) return;

    if (!isSilent) setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/auth/verify-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (data.authorized) {
        localStorage.setItem('qg_user_email', cleanEmail);
        setActiveUser({
          email: cleanEmail,
          name: data.name || 'Aluno Oficial',
          role: data.role,
        });
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('qg_user_email');
        setIsAuthenticated(false);
        setAuthError(data.message || 'Acesso não encontrado para este e-mail.');
      }
    } catch {
      if (!isSilent) setAuthError('Erro ao conectar ao servidor de autenticação. Tente novamente.');
      setIsAuthenticated(false);
    } finally {
      if (!isSilent) setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('qg_user_email');
    setIsAuthenticated(false);
    setActiveUser(null);
    setLoginEmail('');
    setAuthError(null);
  };

  // 1. Inputs do Usuário (Requisitos de Interface)
  const [age, setAge] = useState<number | ''>(28);
  const [weight, setWeight] = useState<number | ''>(78);
  const [height, setHeight] = useState<number | ''>(178);
  const [gender, setGender] = useState<'masculino' | 'feminino'>('masculino');
  const [activity, setActivity] = useState<number>(1.55); // 1.2 a 1.9
  const [goal, setGoal] = useState<'hipertrofia' | 'emagrecimento' | 'emagrecimento_agressivo' | 'recomposicao'>('emagrecimento');
  const [mealsCount, setMealsCount] = useState<number>(4);
  const [selectedProteins, setSelectedProteins] = useState<string>('peito de frango, filé mignon, tilápia, moela, ovos');
  const [selectedCarbs, setSelectedCarbs] = useState<string>('arroz, feijão, batata-doce, batata inglesa, macarrão');

  // Checklist Diário Operacional (Água & Refeições)
  const todayKey = new Date().toISOString().slice(0, 10);
  const [waterCups, setWaterCups] = useState<number>(0);
  const [checkedMeals, setCheckedMeals] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWater = localStorage.getItem(`qg_water_${todayKey}`);
      if (savedWater) setWaterCups(Number(savedWater));

      const savedMeals = localStorage.getItem(`qg_meals_${todayKey}`);
      if (savedMeals) {
        try {
          setCheckedMeals(JSON.parse(savedMeals));
        } catch {}
      }
    }
  }, [todayKey]);

  const toggleWaterCup = (index: number) => {
    const newCups = waterCups === index + 1 ? index : index + 1;
    setWaterCups(newCups);
    localStorage.setItem(`qg_water_${todayKey}`, String(newCups));
  };

  const toggleMealCheck = (mealKey: string) => {
    const updated = { ...checkedMeals, [mealKey]: !checkedMeals[mealKey] };
    setCheckedMeals(updated);
    localStorage.setItem(`qg_meals_${todayKey}`, JSON.stringify(updated));
  };

  // Tags Rápidas de Proteína
  const quickProteinTags = [
    'Peito de Frango',
    'Filé Mignon',
    'Tilápia',
    'Moela',
    'Patinho Moído',
    'Ovos Inteiros',
    'Lombo Suíno',
    'Atum',
  ];

  const addProteinTag = (tag: string) => {
    if (!selectedProteins.toLowerCase().includes(tag.toLowerCase())) {
      setSelectedProteins((prev) => (prev ? `${prev}, ${tag}` : tag));
    }
  };

  // Tags Rápidas de Carboidrato
  const quickCarbTags = [
    'Arroz Branco',
    'Feijão Carioca',
    'Batata-Doce',
    'Batata Inglesa',
    'Macarrão',
    'Mandioca/Aipim',
    'Aveia em Flocos',
    'Pão Integral',
  ];

  const addCarbTag = (tag: string) => {
    if (!selectedCarbs.toLowerCase().includes(tag.toLowerCase())) {
      setSelectedCarbs((prev) => (prev ? `${prev}, ${tag}` : tag));
    }
  };

  // 2. Resultados Calculados
  const [calcData, setCalcData] = useState<{
    tmb: number;
    get: number;
    kcal: number;
    prot: number;
    carb: number;
    fat: number;
    waterL: number;
    mealsCount: number;
    goalLabel: string;
    activityLabel: string;
    options: {
      title: string;
      color: string;
      rgbColor: [number, number, number];
      mealsList: { name: string; time: string; desc: string }[];
    }[];
  } | null>(null);

  // 3. Lógica Estrita de Cálculo Solicitada:
  // 1. Calcule as Calorias Totais (GET) conforme o objetivo (Hipertrofia, Emagrecimento, etc).
  // 2. Calcule a Proteína Diária: 2.2g por kg de peso corporal. (Multiplique por 4 para achar as calorias da proteína).
  // 3. Calcule a Gordura Diária: 0.9g por kg de peso corporal. (Multiplique por 9 para achar as calorias da gordura).
  // 4. Calcule o Carboidrato Diário: Subtraia as calorias da proteína e da gordura do GET. O que sobrar, divida por 4 para achar as gramas de carbo.
  const generateDiet = async () => {
    if (!age || !weight || !height) {
      alert('Por favor, informe Idade, Peso e Altura para calcular!');
      return;
    }

    setIsLoading(true);

    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);

    // Passo 1: Mifflin-St Jeor TMB e Calorias Totais (GET ajustado pelo objetivo)
    const base = 10 * w + 6.25 * h - 5 * a;
    const tmb = Math.round(gender === 'masculino' ? base + 5 : base - 161);
    const get = Math.round(tmb * activity);

    let targetKcal = get;
    let goalLabel = 'Recomposição Corporal';

    if (goal === 'hipertrofia') {
      targetKcal = get + 400;
      goalLabel = 'Hipertrofia (+400 kcal)';
    } else if (goal === 'emagrecimento') {
      targetKcal = get - 500;
      goalLabel = 'Emagrecimento Moderado (-500 kcal)';
    } else if (goal === 'emagrecimento_agressivo') {
      targetKcal = get - 750;
      goalLabel = 'Emagrecimento Agressivo (-750 kcal)';
    }

    // Piso de segurança
    const minFloor = gender === 'masculino' ? 1300 : 1100;
    if (targetKcal < minFloor) targetKcal = minFloor;

    // Passo 2: Proteína Diária = 2.2g por kg de peso corporal
    const protGrams = Math.round(w * 2.2);
    const protCalories = protGrams * 4;

    // Passo 3: Gordura Diária = 0.9g por kg de peso corporal
    const fatGrams = Math.round(w * 0.9);
    const fatCalories = fatGrams * 9;

    // Passo 4: Carboidrato Diário = Subtraia proteína e gordura do GET. O que sobrar, divida por 4
    const carbCalories = Math.max(0, targetKcal - protCalories - fatCalories);
    const carbGrams = Math.round(carbCalories / 4);

    // Ingestão hídrica: 35ml por kg
    const waterL = Number(((w * 35) / 1000).toFixed(1));

    // Porcionamento das refeições conforme a quantidade escolhida (3, 4 ou 5)
    const pMeal = protGrams / mealsCount;
    const cMeal = carbGrams / mealsCount;

    // Sanitização das proteínas e carboidratos selecionados pelo usuário
    const userProteinsList = selectedProteins
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const userCarbsList = selectedCarbs
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const safeProteins =
      userProteinsList.length > 0
        ? userProteinsList
        : ['Peito de Frango', 'Filé Mignon', 'Tilápia', 'Moela', 'Ovos'];
    const safeCarbs =
      userCarbsList.length > 0
        ? userCarbsList
        : ['Arroz Branco', 'Feijão', 'Batata-Doce', 'Batata Inglesa', 'Macarrão'];

    // Chamar backend /api/generate-diet para integrar a LLM com o prompt solicitado
    let generatedOptions: {
      title: string;
      color: string;
      rgbColor: [number, number, number];
      mealsList: { name: string; time: string; desc: string }[];
    }[] = [];

    const activityMap: Record<number, string> = {
      1.2: 'sedentario',
      1.375: 'leve',
      1.55: 'moderado',
      1.725: 'ativo',
      1.9: 'muito_ativo',
    };

    try {
      const response = await fetch('/api/generate-diet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: a,
          weight: w,
          height: h,
          gender,
          activityLevel: activityMap[activity] || 'moderado',
          goal,
          mealsCount,
          proteins: safeProteins,
          carbs: safeCarbs,
          preferences: [...safeProteins, ...safeCarbs],
          customNotes: `Proteínas informadas: ${safeProteins.join(', ')}. Carboidratos informados: ${safeCarbs.join(', ')}. Gorduras: azeite, castanhas e gemas para bater ${fatGrams}g.`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.options && Array.isArray(data.options) && data.options.length >= 3) {
          const colors = ['var(--primary)', '#FFD700', '#ff3333'];
          const rgb: [number, number, number][] = [
            [0, 255, 0],
            [255, 215, 0],
            [255, 51, 51],
          ];

          generatedOptions = data.options.slice(0, 3).map((opt: any, idx: number) => ({
            title: opt.title || `Opção ${idx + 1}`,
            color: colors[idx],
            rgbColor: rgb[idx],
            mealsList: (opt.meals || []).map((m: any) => ({
              name: m.name,
              time: m.timeSuggestion || (m.name.includes('Café') ? '07:30' : m.name.includes('Almoço') ? (mealsCount === 3 ? '12:00' : '12:30') : m.name.includes('Lanche') ? '16:30' : '20:00'),
              desc: (m.items || []).map((it: any) => `${it.name} (${it.portion})`).join('<br>'),
            })),
          }));
        }
      }
    } catch (err) {
      console.log('Utilizando gerador matemático com os alimentos informados:', err);
    }

    // Se a IA estiver sem chave ou falhar, o fallback segue rigorosamente os alimentos escolhidos e as metas travadas
    if (generatedOptions.length === 0) {
      const optNames = ['Opção 1: Operação Padrão', 'Opção 2: Variação Tática', 'Opção 3: Rotação de Combate'];
      const optColors = ['var(--primary)', '#FFD700', '#ff3333'];
      const optRgb: [number, number, number][] = [
        [0, 255, 0],
        [255, 215, 0],
        [255, 51, 51],
      ];

      generatedOptions = [0, 1, 2].map((optIdx) => {
        let mealsList: { name: string; time: string; desc: string }[] = [];

        // Rotação dinâmica com os alimentos escolhidos pelo cliente
        const getFoodPair = (mealIndex: number, shift: number) => {
          const protItem = safeProteins[(mealIndex + shift) % safeProteins.length] || 'Peito de Frango';
          const carbItem = safeCarbs[(mealIndex + shift) % safeCarbs.length] || 'Arroz Branco';
          const protCalc = getProteinPortion(protItem, pMeal);
          const carbCalc = getCarbPortion(carbItem, cMeal);
          const fatCalc = getHealthyFatPortion(fatGrams, mealIndex + shift);
          return { protCalc, carbCalc, fatCalc };
        };

        if (mealsCount === 3) {
          // Protocolo de Jejum 16/8
          const m1 = getFoodPair(0, optIdx);
          const m2 = getFoodPair(1, optIdx);
          const m3 = getFoodPair(2, optIdx);

          mealsList = [
            {
              name: 'Almoço (Quebra do Jejum 16h)',
              time: '12:00',
              desc: `<strong>${m1.protCalc.name}:</strong> ${m1.protCalc.portion}<br><strong>${m1.carbCalc.name}:</strong> ${m1.carbCalc.portion}<br>Salada verde fresca + ${m1.fatCalc}`,
            },
            {
              name: 'Lanche da Tarde',
              time: '16:00',
              desc: `<strong>${m2.protCalc.name}:</strong> ${m2.protCalc.portion}<br><strong>${m2.carbCalc.name}:</strong> ${m2.carbCalc.portion}<br>${m2.fatCalc}`,
            },
            {
              name: 'Jantar (Fechamento da Janela)',
              time: '20:00',
              desc: `<strong>${m3.protCalc.name}:</strong> ${m3.protCalc.portion}<br><strong>${m3.carbCalc.name}:</strong> ${m3.carbCalc.portion}<br>Legumes no vapor com azeite + ${m3.fatCalc}`,
            },
          ];
        } else if (mealsCount === 5) {
          // 5 Refeições Fracionadas
          const m1 = getFoodPair(0, optIdx);
          const m2 = getFoodPair(1, optIdx);
          const m3 = getFoodPair(2, optIdx);
          const m4 = getFoodPair(3, optIdx);
          const m5 = getFoodPair(4, optIdx);

          mealsList = [
            {
              name: 'Café da Manhã',
              time: '07:00',
              desc: `<strong>${m1.protCalc.name}:</strong> ${m1.protCalc.portion}<br><strong>${m1.carbCalc.name}:</strong> ${m1.carbCalc.portion}<br>${m1.fatCalc}`,
            },
            {
              name: 'Lanche da Manhã',
              time: '10:00',
              desc: `<strong>${m2.protCalc.name}:</strong> ${m2.protCalc.portion}<br><strong>${m2.carbCalc.name}:</strong> ${m2.carbCalc.portion}<br>Café sem açúcar ou 1 fruta pequena`,
            },
            {
              name: 'Almoço',
              time: '13:00',
              desc: `<strong>${m3.protCalc.name}:</strong> ${m3.protCalc.portion}<br><strong>${m3.carbCalc.name}:</strong> ${m3.carbCalc.portion}<br>Salada verde à vontade + ${m3.fatCalc}`,
            },
            {
              name: 'Lanche da Tarde',
              time: '16:30',
              desc: `<strong>${m4.protCalc.name}:</strong> ${m4.protCalc.portion}<br><strong>${m4.carbCalc.name}:</strong> ${m4.carbCalc.portion}<br>${m4.fatCalc}`,
            },
            {
              name: 'Jantar',
              time: '20:00',
              desc: `<strong>${m5.protCalc.name}:</strong> ${m5.protCalc.portion}<br><strong>${m5.carbCalc.name}:</strong> ${m5.carbCalc.portion}<br>Legumes e vegetais + ${m5.fatCalc}`,
            },
          ];
        } else {
          // 4 Refeições Padrão
          const m1 = getFoodPair(0, optIdx);
          const m2 = getFoodPair(1, optIdx);
          const m3 = getFoodPair(2, optIdx);
          const m4 = getFoodPair(3, optIdx);

          mealsList = [
            {
              name: 'Café da Manhã',
              time: '07:30',
              desc: `<strong>${m1.protCalc.name}:</strong> ${m1.protCalc.portion}<br><strong>${m1.carbCalc.name}:</strong> ${m1.carbCalc.portion}<br>${m1.fatCalc}`,
            },
            {
              name: 'Almoço',
              time: '12:30',
              desc: `<strong>${m2.protCalc.name}:</strong> ${m2.protCalc.portion}<br><strong>${m2.carbCalc.name}:</strong> ${m2.carbCalc.portion}<br>Salada verde à vontade + ${m2.fatCalc}`,
            },
            {
              name: 'Lanche da Tarde',
              time: '16:30',
              desc: `<strong>${m3.protCalc.name}:</strong> ${m3.protCalc.portion}<br><strong>${m3.carbCalc.name}:</strong> ${m3.carbCalc.portion}<br>${m3.fatCalc}`,
            },
            {
              name: 'Jantar',
              time: '20:00',
              desc: `<strong>${m4.protCalc.name}:</strong> ${m4.protCalc.portion}<br><strong>${m4.carbCalc.name}:</strong> ${m4.carbCalc.portion}<br>Legumes no vapor + ${m4.fatCalc}`,
            },
          ];
        }

        return {
          title: optNames[optIdx],
          color: optColors[optIdx],
          rgbColor: optRgb[optIdx],
          mealsList,
        };
      });
    }

    const activityLabelMap: Record<number, string> = {
      1.2: 'Sedentário (1.2)',
      1.375: 'Leve (1.375)',
      1.55: 'Moderado (1.55)',
      1.725: 'Ativo (1.725)',
      1.9: 'Muito Ativo (1.9)',
    };

    setCalcData({
      tmb,
      get,
      kcal: targetKcal,
      prot: protGrams,
      carb: carbGrams,
      fat: fatGrams,
      waterL,
      mealsCount,
      goalLabel,
      activityLabel: activityLabelMap[activity] || 'Moderado (1.55)',
      options: generatedOptions,
    });

    setIsLoading(false);
    setShowResult(true);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPdf = () => {
    if (!calcData) return;

    const pdfData: TacticalDietData = {
      tmb: calcData.tmb,
      get: calcData.get,
      kcal: calcData.kcal,
      prot: calcData.prot,
      carb: calcData.carb,
      fat: calcData.fat,
      waterL: calcData.waterL,
      goal: calcData.goalLabel,
      gender: gender === 'masculino' ? 'Homem' : 'Mulher',
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      activityLevel: calcData.activityLabel,
      mealsCount: calcData.mealsCount,
      fastingProtocol: calcData.mealsCount === 3,
      preferences: [
        ...selectedProteins.split(',').map((p) => p.trim()).filter(Boolean),
        ...selectedCarbs.split(',').map((c) => c.trim()).filter(Boolean),
      ],
      options: calcData.options.map((m) => ({
        title: m.title,
        color: m.rgbColor,
        meals: m.mealsList.map((item) => ({
          name: item.name,
          time: item.time,
          desc: item.desc,
        })),
      })),
    };

    generateTacticalPdf(pdfData);
  };

  // 1. Tela de Carregamento inicial da autenticação
  if (isAuthenticated === null) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center', padding: '30px', maxWidth: '400px', width: '100%' }}>
          <p style={{ color: 'var(--primary)', fontFamily: "'Montserrat', sans-serif", fontSize: '13px', margin: 0, letterSpacing: '1px' }}>
            VERIFICANDO LICENÇA...
          </p>
        </div>
      </div>
    );
  }

  // 2. Tela de Bloqueio por E-mail (Apenas compradores da Kiwify entram)
  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="header">
          <h2>
            Acesso <span>Restrito</span>
          </h2>
          <p>Área exclusiva para compradores e membros oficiais do QG.</p>
        </div>

        <div className="card" id="form-card">
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#161616',
                border: '1px solid #333',
                fontSize: '24px',
                marginBottom: '12px',
              }}
            >
              🔒
            </div>
            <h3 style={{ margin: 0, fontFamily: "'Montserrat', sans-serif", fontSize: '18px', color: '#fff', textTransform: 'uppercase' }}>
              Identificação do Comprador
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px', lineHeight: 1.4 }}>
              Digite o e-mail que você utilizou no checkout da sua compra na Kiwify para liberar sua licença.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifyEmailAccess(loginEmail);
            }}
          >
            <div className="form-group">
              <label>Seu E-mail da Compra (Kiwify)</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  setAuthError(null);
                }}
                className="form-control"
                placeholder="Ex: seunome@email.com"
                autoFocus
              />
            </div>

            {authError && (
              <div
                style={{
                  background: 'rgba(255, 51, 51, 0.1)',
                  border: '1px solid #ff3333',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  color: '#ff6666',
                  fontSize: '12px',
                  marginBottom: '15px',
                  lineHeight: 1.4,
                }}
              >
                ⚠️ {authError}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={authLoading || !loginEmail}
              style={{ width: '100%' }}
            >
              {authLoading ? 'VALIDANDO COMPRA NA KIWIFY...' : '🔓 LIBERAR MEU ACESSO'}
            </button>
          </form>

          <div
            style={{
              marginTop: '25px',
              paddingTop: '20px',
              borderTop: '1px solid #222',
              textAlign: 'center',
              fontSize: '12px',
              color: 'var(--muted)',
            }}
          >
            <span>Ainda não possui sua licença oficial?</span>
            <br />
            <span style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'inline-block', marginTop: '6px' }}>
              Adquira na Kiwify para liberação imediata
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Aplicação Liberada para Aluno Autenticado
  return (
    <div className="container">
      {/* Barra Superior do Aluno Conectado */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#111',
          border: '1px solid #222',
          borderRadius: '6px',
          padding: '8px 12px',
          marginBottom: '15px',
          fontSize: '11px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ccc' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>● LICENÇA ATIVA:</span>
          <span style={{ color: '#fff' }}>{activeUser?.name || activeUser?.email}</span>
          {activeUser?.role === 'admin' && (
            <span style={{ background: '#222', color: '#FFD700', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
              ADMIN
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#888',
            fontSize: '11px',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Sair / Trocar e-mail
        </button>
      </div>

      <div className="header">
        <h2>
          Gerador de <span>Dieta</span>
        </h2>
        <p>Inteligência Nutricional & Protocolo Operacional QG.</p>
      </div>

      {!showResult ? (
        <div className="card" id="form-card">
          {/* Linha 1: Idade e Sexo */}
          <div className="flex-row">
            <div className="form-group flex-1">
              <label>Idade (anos)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                className="form-control"
                placeholder="Ex: 28"
                min="10"
                max="110"
              />
            </div>
            <div className="form-group flex-1">
              <label>Sexo</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="form-control"
              >
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
            </div>
          </div>

          {/* Linha 2: Peso e Altura */}
          <div className="flex-row">
            <div className="form-group flex-1">
              <label>Peso (kg)</label>
              <input
                type="number"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                className="form-control"
                placeholder="Ex: 78"
                min="30"
                max="250"
              />
            </div>
            <div className="form-group flex-1">
              <label>Altura (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                className="form-control"
                placeholder="Ex: 178"
                min="100"
                max="240"
              />
            </div>
          </div>

          {/* Linha 3: Nível de Atividade Física e Objetivo */}
          <div className="flex-row">
            <div className="form-group flex-1">
              <label>Nível de Atividade Física</label>
              <select
                value={activity}
                onChange={(e) => setActivity(Number(e.target.value))}
                className="form-control"
              >
                <option value={1.2}>Sedentário (Pouco ou nenhum exercício - 1.2)</option>
                <option value={1.375}>Leve (Exercício leve 1 a 3 dias/sem - 1.375)</option>
                <option value={1.55}>Moderado (Exercício moderado 3 a 5 dias/sem - 1.55)</option>
                <option value={1.725}>Ativo (Exercício pesado 6 a 7 dias/sem - 1.725)</option>
                <option value={1.9}>Muito Ativo (Trabalho braçal / 2x treinos - 1.9)</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label>Objetivo</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as any)}
                className="form-control"
              >
                <option value="hipertrofia">1) Hipertrofia (Ganhar Músculo / GET + 400 kcal)</option>
                <option value="emagrecimento">2) Emagrecimento Moderado (Déficit Padrão / GET - 500 kcal)</option>
                <option value="emagrecimento_agressivo">3) Emagrecimento Agressivo (Déficit Maior / GET - 750 kcal)</option>
                <option value="recomposicao">4) Recomposição Corporal (Trocar gordura por músculo)</option>
              </select>
            </div>
          </div>

          {/* Linha 4: Quantidade de Refeições Diárias */}
          <div className="form-group">
            <label>Quantidade de Refeições por Dia</label>
            <select
              value={mealsCount}
              onChange={(e) => setMealsCount(Number(e.target.value))}
              className="form-control"
            >
              <option value={3}>3 Refeições por Dia (Protocolo de Jejum Intermitente 16/8)</option>
              <option value={4}>4 Refeições por Dia (Padrão Equilibrado)</option>
              <option value={5}>5 Refeições por Dia (Fracionamento Contínuo)</option>
            </select>

            {mealsCount === 3 && (
              <div
                style={{
                  background: 'rgba(0, 255, 0, 0.05)',
                  border: '1px solid var(--primary)',
                  borderRadius: '6px',
                  padding: '12px 14px',
                  marginTop: '10px',
                  fontSize: '12px',
                  lineHeight: '1.45',
                }}
              >
                <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '4px', fontSize: '13px' }}>
                  ⏱️ PROTOCOLO DE JEJUM INTERMITENTE 16/8 SELECIONADO
                </strong>
                <span style={{ color: '#d5d5d5' }}>
                  • <strong>16 Horas de Jejum Diário:</strong> das 20:00 até as 12:00 do dia seguinte (permitido água, café e chás sem açúcar).<br />
                  • <strong>Janela Alimentar de 8 Horas:</strong> 3 refeições estratégicas (Almoço às 12:00, Lanche às 16:00 e Jantar às 20:00).<br />
                  • <strong>Benefícios Comprovados:</strong> Estímulo à autofagia celular (reciclagem celular), redução acelerada de gordura corporal, melhora drástica da sensibilidade à insulina e foco mental superior pela manhã.
                </span>
              </div>
            )}
          </div>

          {/* 1. Seleção de Proteínas */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>🥩 1. Fontes de Proteína (O que você quer comer)</span>
              <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'normal' }}>Balança exata</span>
            </label>
            <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '2px 0 6px 0' }}>
              Digite as carnes e ovos que você deseja comer. O app calcula o peso exato na balança para bater sua meta.
            </p>
            <input
              type="text"
              value={selectedProteins}
              onChange={(e) => setSelectedProteins(e.target.value)}
              className="form-control"
              placeholder="Ex: peito de frango, filé mignon, tilápia, moela, ovos"
            />
            {/* Tags rápidas de clique para proteína */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {quickProteinTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addProteinTag(tag)}
                  style={{
                    background: '#161616',
                    border: '1px solid #333',
                    color: selectedProteins.toLowerCase().includes(tag.toLowerCase()) ? 'var(--primary)' : '#888',
                    borderColor: selectedProteins.toLowerCase().includes(tag.toLowerCase()) ? 'var(--primary)' : '#333',
                    fontSize: '11px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Seleção de Carboidratos */}
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>🥔 2. Fontes de Carboidrato (O que você quer comer)</span>
              <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'normal' }}>Balança exata</span>
            </label>
            <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '2px 0 6px 0' }}>
              Digite os carboidratos da sua rotina (arroz, batata, macarrão, etc.) para montar seus pratos.
            </p>
            <input
              type="text"
              value={selectedCarbs}
              onChange={(e) => setSelectedCarbs(e.target.value)}
              className="form-control"
              placeholder="Ex: arroz, feijão, batata-doce, batata inglesa, macarrão"
            />
            {/* Tags rápidas de clique para carboidrato */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {quickCarbTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addCarbTag(tag)}
                  style={{
                    background: '#161616',
                    border: '1px solid #333',
                    color: selectedCarbs.toLowerCase().includes(tag.toLowerCase()) ? 'var(--primary)' : '#888',
                    borderColor: selectedCarbs.toLowerCase().includes(tag.toLowerCase()) ? 'var(--primary)' : '#333',
                    fontSize: '11px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Gorduras Boas: Alocação Automática do QG */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid #222',
              borderRadius: '6px',
              padding: '12px 14px',
              marginTop: '16px',
              marginBottom: '10px',
              fontSize: '12px',
              lineHeight: '1.45',
            }}
          >
            <strong style={{ color: '#00d0ff', display: 'block', marginBottom: '4px', fontSize: '12px' }}>
              🥑 3. Gorduras Boas: Alocação Automática de Precisão (0.9g/kg)
            </strong>
            <span style={{ color: '#a0a0a0' }}>
              Você não precisa escolher as gorduras! Nosso sistema distribui automaticamente fontes nobres (Azeite Extravirgem, Castanhas e Gemas) nas suas refeições para fechar sua meta com máxima precisão.
            </span>
          </div>

          <button
            className="btn btn-primary"
            style={{ marginTop: '10px' }}
            onClick={generateDiet}
            disabled={isLoading}
          >
            {isLoading ? 'GERANDO CARDÁPIOS NA IA...' : 'Gerar 3 Cardápios'}
          </button>
        </div>
      ) : (
        calcData && (
          <div id="result">
            <div className="card">
              <h3 style={{ marginTop: 0, fontFamily: "'Montserrat', sans-serif", textTransform: 'uppercase' }}>
                Sua Ração Base
              </h3>

              {/* Exibição Visual da TMB, GET e Meta Calórica Diária (Requisito 4) */}
              <div
                style={{
                  background: '#161616',
                  border: '1px solid #222',
                  borderRadius: '6px',
                  padding: '12px 14px',
                  marginBottom: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', fontWeight: 'bold' }}>
                    TMB (Basal)
                  </span>
                  <strong style={{ fontSize: '15px', color: '#fff', fontFamily: "'Montserrat', sans-serif" }}>
                    {calcData.tmb} <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 'normal' }}>kcal</span>
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', fontWeight: 'bold' }}>
                    GET (Gasto Total)
                  </span>
                  <strong style={{ fontSize: '15px', color: '#fff', fontFamily: "'Montserrat', sans-serif" }}>
                    {calcData.get} <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 'normal' }}>kcal</span>
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', display: 'block', fontWeight: 'bold' }}>
                    Meta Diária Alvo
                  </span>
                  <strong style={{ fontSize: '16px', color: 'var(--primary)', fontFamily: "'Montserrat', sans-serif" }}>
                    {calcData.kcal} <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'normal' }}>kcal/dia</span>
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: '10px', color: '#00d0ff', textTransform: 'uppercase', display: 'block', fontWeight: 'bold' }}>
                    Água Mínima
                  </span>
                  <strong style={{ fontSize: '15px', color: '#00d0ff', fontFamily: "'Montserrat', sans-serif" }}>
                    {calcData.waterL} <span style={{ fontSize: '11px', color: '#00d0ff', fontWeight: 'normal' }}>L/dia</span>
                  </strong>
                </div>
              </div>

              {/* Linha dos Macros da Operação (Exatamente como solicitado) */}
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                Macros Travados da Operação (<span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{calcData.goalLabel}</span>):<br />
                <strong style={{ color: '#fff' }}>{calcData.prot}g</strong> Proteína (2.2g/kg) |{' '}
                <strong style={{ color: '#00FF00' }}>{calcData.carb}g</strong> Carbo |{' '}
                <strong style={{ color: '#fff' }}>{calcData.fat}g</strong> Gordura (0.9g/kg).
                <br />
                <br />
                <em>*Todos os pesos abaixo referem-se ao alimento já preparado/cozido na balança de precisão.</em>
              </p>

              {/* Box de Jejum Intermitente se forem 3 refeições */}
              {calcData.mealsCount === 3 && (
                <div
                  style={{
                    background: 'rgba(0, 255, 0, 0.05)',
                    border: '1px solid var(--primary)',
                    borderRadius: '6px',
                    padding: '12px 14px',
                    marginBottom: '18px',
                  }}
                >
                  <strong style={{ color: 'var(--primary)', fontSize: '13px', display: 'block', marginBottom: '4px', fontFamily: "'Montserrat', sans-serif" }}>
                    ⚡ PROTOCOLO DE JEJUM INTERMITENTE 16/8 ATIVO
                  </strong>
                  <p style={{ margin: 0, fontSize: '12px', color: '#e0e0e0', lineHeight: 1.5 }}>
                    • <strong>Tempo em Jejum:</strong> 16 horas contínuas (das 20:00 até as 12:00 do dia seguinte). Consumo liberado: água pura, café preto e chás sem açúcar.<br />
                    • <strong>Janela Alimentar:</strong> 8 horas (das 12:00 às 20:00 com 3 refeições densas em nutrientes).<br />
                    • <strong>Benefícios Científicos:</strong> Indução da autofagia celular (reciclagem biológica de proteínas oxidadas), melhora substancial da sensibilidade à insulina e redução contínua de gordura visceral.
                  </p>
                </div>
              )}

              {/* CHECKLIST DIÁRIO OPERACIONAL (ÁGUA & REFEIÇÕES) */}
              {(() => {
                const totalWaterBottles = Math.max(1, Math.ceil((calcData.waterL * 1000) / 500));
                const completedBottles = Math.min(waterCups, totalWaterBottles);
                const waterPercent = Math.min(100, Math.round((completedBottles / totalWaterBottles) * 100));
                const checkedMealsCount = Array.from({ length: calcData.mealsCount }).filter(
                  (_, i) => checkedMeals[`meal_${todayKey}_${i + 1}`]
                ).length;
                const mealsPercent = Math.round((checkedMealsCount / calcData.mealsCount) * 100);
                const totalTasks = totalWaterBottles + calcData.mealsCount;
                const totalDone = completedBottles + checkedMealsCount;
                const overallPercent = Math.round((totalDone / totalTasks) * 100);

                return (
                  <div
                    style={{
                      background: '#121212',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginBottom: '12px',
                        borderBottom: '1px solid #222',
                        paddingBottom: '10px',
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            margin: 0,
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: '14px',
                            color: '#fff',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          📋 Checklist Operacional Diário
                        </h4>
                        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                          Hoje: {todayKey} • Progresso salvo automaticamente
                        </span>
                      </div>
                      <div
                        style={{
                          background: overallPercent === 100 ? 'rgba(0, 255, 0, 0.2)' : '#1a1a1a',
                          border: `1px solid ${overallPercent === 100 ? 'var(--primary)' : '#333'}`,
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          color: overallPercent === 100 ? 'var(--primary)' : '#fff',
                          fontWeight: 'bold',
                        }}
                      >
                        {overallPercent}% CUMPRIDO
                      </div>
                    </div>

                    {/* Barra de Progresso Geral */}
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        background: '#222',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          width: `${overallPercent}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #00d0ff, var(--primary))',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>

                    {overallPercent === 100 && (
                      <div
                        style={{
                          background: 'rgba(0, 255, 0, 0.1)',
                          border: '1px solid var(--primary)',
                          borderRadius: '6px',
                          padding: '10px 12px',
                          marginBottom: '16px',
                          textAlign: 'center',
                          color: 'var(--primary)',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        🎖️ EXCELENTE! 100% DA MISSÃO CUMPRIDA HOJE! DISCIPLINA ABSOLUTA!
                      </div>
                    )}

                    {/* Bloco 1: Água */}
                    <div style={{ marginBottom: '16px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '6px',
                        }}
                      >
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#00d0ff' }}>
                          💧 Hidratação ({calcData.waterL}L / dia)
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                          {(completedBottles * 0.5).toFixed(1)}L de {calcData.waterL}L ({waterPercent}%)
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))',
                          gap: '6px',
                          marginTop: '6px',
                        }}
                      >
                        {Array.from({ length: totalWaterBottles }).map((_, bIdx) => {
                          const isDrank = bIdx < waterCups;
                          return (
                            <button
                              key={bIdx}
                              type="button"
                              onClick={() => toggleWaterCup(bIdx)}
                              style={{
                                background: isDrank ? 'rgba(0, 208, 255, 0.12)' : '#181818',
                                border: `1px solid ${isDrank ? '#00d0ff' : '#282828'}`,
                                color: isDrank ? '#00d0ff' : '#777',
                                borderRadius: '6px',
                                padding: '8px 6px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '3px',
                                transition: 'all 0.2s',
                              }}
                            >
                              <span style={{ fontSize: '14px' }}>{isDrank ? '💧' : '⚪'}</span>
                              <span style={{ fontWeight: 'bold' }}>500ml</span>
                              <span style={{ fontSize: '9px', opacity: 0.8 }}>Garrafa #{bIdx + 1}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bloco 2: Refeições */}
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                        }}
                      >
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)' }}>
                          🍽️ Refeições ({calcData.mealsCount} refeições / dia)
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                          {checkedMealsCount} de {calcData.mealsCount} ({mealsPercent}%)
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {Array.from({ length: calcData.mealsCount }).map((_, mIdx) => {
                          const mealKey = `meal_${todayKey}_${mIdx + 1}`;
                          const isDone = !!checkedMeals[mealKey];

                          const mealName =
                            calcData.mealsCount === 3
                              ? mIdx === 0
                                ? 'Almoço (Quebra do Jejum 12:00)'
                                : mIdx === 1
                                ? 'Lanche da Tarde (16:00)'
                                : 'Jantar (Fechamento da Janela 20:00)'
                              : calcData.mealsCount === 5
                              ? mIdx === 0
                                ? 'Café da Manhã (07:00)'
                                : mIdx === 1
                                ? 'Lanche da Manhã (10:00)'
                                : mIdx === 2
                                ? 'Almoço (13:00)'
                                : mIdx === 3
                                ? 'Lanche da Tarde (16:30)'
                                : 'Jantar (20:00)'
                              : mIdx === 0
                              ? 'Café da Manhã (07:30)'
                              : mIdx === 1
                              ? 'Almoço (12:30)'
                              : mIdx === 2
                              ? 'Lanche da Tarde (16:30)'
                              : 'Jantar (20:00)';

                          return (
                            <div
                              key={mIdx}
                              onClick={() => toggleMealCheck(mealKey)}
                              style={{
                                background: isDone ? 'rgba(0, 255, 0, 0.08)' : '#181818',
                                border: `1px solid ${isDone ? 'var(--primary)' : '#282828'}`,
                                borderRadius: '6px',
                                padding: '10px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div
                                  style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '4px',
                                    border: `2px solid ${isDone ? 'var(--primary)' : '#555'}`,
                                    background: isDone ? 'var(--primary)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#000',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {isDone && '✓'}
                                </div>
                                <span
                                  style={{
                                    fontSize: '12px',
                                    color: isDone ? '#fff' : '#ccc',
                                    textDecoration: isDone ? 'line-through' : 'none',
                                    opacity: isDone ? 0.8 : 1,
                                  }}
                                >
                                  <strong>Refeição {mIdx + 1}:</strong> {mealName}
                                </span>
                              </div>
                              <span
                                style={{
                                  fontSize: '10px',
                                  textTransform: 'uppercase',
                                  fontWeight: 'bold',
                                  color: isDone ? 'var(--primary)' : '#555',
                                }}
                              >
                                {isDone ? 'CONCLUÍDA' : 'PENDENTE'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* As 3 Opções de Cardápios */}
              <div id="menus-container">
                {calcData.options.map((menu, idx) => (
                  <div
                    key={idx}
                    className="menu-box"
                    style={{ borderLeftColor: menu.color }}
                  >
                    <div className="menu-title" style={{ color: menu.color }}>
                      <span>{menu.title}</span>
                      <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 'normal' }}>
                        {calcData.mealsCount} Refeições
                      </span>
                    </div>

                    {menu.mealsList.map((m, mIdx) => (
                      <div key={mIdx} className="meal">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong>{m.name}</strong>
                          <span style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>{m.time}</span>
                        </div>
                        <span dangerouslySetInnerHTML={{ __html: m.desc }} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* BOTÃO BAIXAR DIETA EM PDF */}
              <button
                className="btn btn-primary"
                style={{ marginTop: '15px' }}
                onClick={handleDownloadPdf}
              >
                📥 Baixar Dieta em PDF
              </button>

              {/* BOTÃO PARA REFAZER CÁLCULO */}
              <button
                className="btn"
                style={{
                  background: 'transparent',
                  border: '1px solid #333',
                  color: '#888',
                  fontSize: '12px',
                  marginTop: '10px',
                }}
                onClick={() => {
                  setShowResult(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Refazer Cálculo / Alterar Dados
              </button>
            </div>

            {/* BOX DE MARKETING / UPSELL */}
            <div className="upsell-box">
              <h3>Quer o Controle Absoluto?</h3>
              <p>
                Esse cardápio é apenas o básico. Quer um aplicativo no seu celular que recalcula sua dieta toda semana,
                tem lista de mercado, checklist de água e permite substituir qualquer alimento da dieta na hora?
              </p>
              <button
                className="btn-upsell"
                onClick={handleDownloadPdf}
              >
                Baixar PDF & Conhecer o QG PRO
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
