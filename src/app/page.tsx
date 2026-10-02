'use client';

import React, { useState, useEffect } from 'react';
import { generateTacticalPdf, TacticalDietData } from '@/lib/pdfGenerator';
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
  const [preferences, setPreferences] = useState<string>('peito de frango, patinho moído, tilápia, ovos, arroz, aveia');

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

  // Tags rápidas de clique
  const quickTags = ['Peito de Frango', 'Patinho Moído', 'Tilápia', 'Ovos', 'Arroz', 'Aveia', 'Batata-Doce', 'Evitar Lactose'];

  const addTag = (tag: string) => {
    if (!preferences.toLowerCase().includes(tag.toLowerCase())) {
      setPreferences((prev) => (prev ? `${prev}, ${tag}` : tag));
    }
  };

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

    // Pesos na Balança (Alimento já preparado/cozido)
    // Fontes prioritárias de proteína: peito de frango, patinho moído, tilápia e ovos
    const meatG = Math.round(pMeal * 3.3);
    const riceG = Math.round(cMeal * 0.6 * 3.3);
    const beansG = Math.round(cMeal * 0.4 * 5.0);
    const sweetPotatoG = Math.round(cMeal * 4.0);
    const oatsG = Math.max(20, Math.round(cMeal * 1.4));
    const eggsCount = Math.max(2, Math.round(pMeal / 6));

    const prefsLower = preferences.toLowerCase();
    const hasLactoseFree = prefsLower.includes('lactose');

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
          preferences: preferences.split(',').map((p) => p.trim()),
          customNotes: preferences,
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
      console.log('Utilizando fallback matemático local com as metas travadas:', err);
    }

    // Se a IA estiver sem chave ou falhar, o fallback segue rigorosamente as metas travadas
    if (generatedOptions.length === 0) {
      const optNames = ['Opção 1: Combate Padrão', 'Opção 2: Rotação Tática', 'Opção 3: Ração de Fogo'];
      const optColors = ['var(--primary)', '#FFD700', '#ff3333'];
      const optRgb: [number, number, number][] = [
        [0, 255, 0],
        [255, 215, 0],
        [255, 51, 51],
      ];

      generatedOptions = [1, 2, 3].map((opt, optIdx) => {
        let mealsList: { name: string; time: string; desc: string }[] = [];

        if (mealsCount === 3) {
          // Protocolo de Jejum 16/8
          mealsList = [
            {
              name: 'Almoço (Quebra do Jejum 16h)',
              time: '12:00',
              desc:
                opt === 1
                  ? `${Math.round(meatG * 1.2)}g de Peito de Frango Grelhado<br>${Math.round(riceG * 1.2)}g de Arroz Branco + ${beansG}g de Feijão + 2 Ovos cozidos na balança.`
                  : opt === 2
                  ? `${Math.round(meatG * 1.2)}g de Carne Moída (Patinho)<br>${Math.round(riceG * 1.2)}g de Arroz Branco + ${beansG}g de Feijão + Couve refogada no azeite.`
                  : `${Math.round(meatG * 1.3)}g de Filé de Tilápia Grelhado<br>${Math.round(riceG * 1.2)}g de Arroz + 2 Ovos mexidos + Salada com azeite.`,
            },
            {
              name: 'Lanche da Tarde',
              time: '16:00',
              desc:
                opt === 1
                  ? `${Math.round(oatsG * 1.1)}g de Aveia + 2 Ovos inteiros mexidos + 15g de Castanhas do Pará + café sem açúcar.`
                  : opt === 2
                  ? `Crepioca (${eggsCount} Ovos + 25g de tapioca) + 1 fruta média (maçã ou mamão).`
                  : hasLactoseFree
                  ? `Shake proteico vegetal com água + 20g de Castanhas + 1 banana.`
                  : `${Math.round(meatG * 0.9)}g de Frango Desfiado + ${sweetPotatoG}g de Batata-Doce cozida.`,
            },
            {
              name: 'Jantar (Fechamento da Janela)',
              time: '20:00',
              desc:
                opt === 1
                  ? `${meatG}g de Carne Moída (Patinho) + ${sweetPotatoG}g de Batata-Doce + Brócolis no vapor com azeite extravirgem.`
                  : opt === 2
                  ? `${Math.round(meatG * 1.15)}g de Filé de Tilápia + ${riceG}g de Arroz Branco + Salada colorida.`
                  : `${meatG}g de Peito de Frango Grelhado + ${sweetPotatoG}g de Mandioca cozida + Legumes no vapor.`,
            },
          ];
        } else if (mealsCount === 5) {
          // 5 Refeições Fracionadas
          mealsList = [
            {
              name: 'Café da Manhã',
              time: '07:00',
              desc: `${Math.max(2, eggsCount - 1)} Ovos inteiros mexidos no azeite + ${Math.round(oatsG * 0.8)}g de Aveia com canela.`,
            },
            {
              name: 'Lanche da Manhã',
              time: '10:00',
              desc: '1 Maçã média ou 1 fatia de mamão (120g) + 12g de Castanhas de Caju.',
            },
            {
              name: 'Almoço',
              time: '13:00',
              desc: `${meatG}g de Proteína magra (Frango, Patinho ou Tilápia)<br>${riceG}g de Arroz Branco + ${beansG}g de Feijão + Salada verde com azeite.`,
            },
            {
              name: 'Lanche da Tarde',
              time: '16:30',
              desc: `${Math.round(meatG * 0.7)}g de Peito de Frango Desfiado ou 2 Ovos cozidos + ${Math.round(sweetPotatoG * 0.7)}g de Batata-Doce.`,
            },
            {
              name: 'Jantar',
              time: '20:00',
              desc: `${meatG}g de Carne moída ou Filé de Peixe + Legumes no vapor + ${Math.round(riceG * 0.8)}g de Arroz ou Batata-doce.`,
            },
          ];
        } else {
          // 4 Refeições Padrão
          mealsList = [
            {
              name: 'Café da Manhã',
              time: '07:30',
              desc:
                opt === 1
                  ? `${eggsCount} Ovos Inteiros mexidos com 1 colher de chá de azeite + 1 fatia de mamão (100g).`
                  : opt === 2
                  ? `Crepioca (${eggsCount - 1} Ovos + 20g de goma de tapioca) + café preto sem açúcar.`
                  : `Mingau com ${oatsG}g de Aveia e canela + ${eggsCount} Ovos cozidos na balança.`,
            },
            {
              name: 'Almoço',
              time: '12:30',
              desc:
                opt === 1
                  ? `${meatG}g de Peito de Frango Grelhado<br>${riceG}g de Arroz Branco cozido + ${beansG}g de Feijão cozido + Salada verde à vontade com azeite.`
                  : opt === 2
                  ? `${meatG}g de Carne Moída (Patinho refogado com alho e cebola)<br>${riceG}g de Arroz Branco + ${beansG}g de Feijão + Couve refogada.`
                  : `${Math.round(meatG * 1.15)}g de Filé de Tilápia Grelhado<br>${Math.round(riceG * 1.1)}g de Arroz Branco + Salada colorida com azeite.`,
            },
            {
              name: 'Lanche',
              time: '16:30',
              desc:
                opt === 1
                  ? `${Math.round(meatG * 0.8)}g de Peito de Frango Desfiado + 15g de Castanhas do Pará.`
                  : opt === 2
                  ? `${eggsCount} Ovos Cozidos na balança + 1 maçã média com canela.`
                  : hasLactoseFree
                  ? `Shake de proteína vegetal/isolada com água + 15g de Castanhas do Pará + 1 banana média.`
                  : `${Math.round(meatG * 0.8)}g de Peito de Frango Grelhado + ${Math.round(sweetPotatoG * 0.8)}g de Batata-Doce cozida.`,
            },
            {
              name: 'Jantar',
              time: '20:00',
              desc:
                opt === 1
                  ? `${meatG}g de Carne Moída (Patinho) + ${sweetPotatoG}g de Batata-Doce cozida + Brócolis no vapor com azeite.`
                  : opt === 2
                  ? `${Math.round(meatG * 1.15)}g de Filé de Tilápia Grelhado + ${riceG + beansG}g de Arroz Branco + Salada de tomate e pepino.`
                  : `${meatG}g de Peito de Frango Grelhado + ${sweetPotatoG}g de Mandioca ou Batata inglesa cozida + Azeite extravirgem.`,
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
      preferences: preferences.split(',').map((p) => p.trim()),
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

          {/* Linha 5: Preferências Alimentares */}
          <div className="form-group">
            <label>Preferências Alimentares & Restrições</label>
            <input
              type="text"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              className="form-control"
              placeholder="Ex: frango, patinho moído, tilápia, ovos, evitar lactose"
            />
            {/* Tags rápidas de clique */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  style={{
                    background: '#161616',
                    border: '1px solid #333',
                    color: '#888',
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
