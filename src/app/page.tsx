'use client';

import React, { useState, useEffect } from 'react';
import { generateTacticalPdf, TacticalDietData } from '@/lib/pdfGenerator';
import { parseAndCalculateMealItems } from '@/lib/foodCalculations';
import confetti from 'canvas-confetti';
import WorkoutOperationsTab from '@/components/WorkoutOperationsTab';
import AromataseGuideTab from '@/components/AromataseGuideTab';
import ArmorPostureTab from '@/components/ArmorPostureTab';

export interface MealSlotConfig {
  id: number;
  name: string;
  time: string;
  icon: string;
  defaultOptions: [string, string, string];
  placeholders: [string, string, string];
  quickTags: string[];
}

export const getMealSlotsForCount = (count: number): MealSlotConfig[] => {
  if (count === 3) {
    return [
      {
        id: 0,
        name: 'Almoço (Quebra do Jejum 16h • Foco Anti-Aromatase)',
        time: '12:00',
        icon: '🍗',
        defaultOptions: [
          'Peito de frango grelhado, brócolis no vapor, arroz branco, feijão carioca',
          'Carne moída (patinho), cogumelos Paris frescos, batata-doce, salada de rúcula',
          'Filé de tilápia grelhado, couve-flor no vapor, mandioca na balança, azeite extravirgem',
        ],
        placeholders: [
          'Opção 1: Ex: peito de frango, brócolis, arroz, feijão',
          'Opção 2: Ex: patinho moído, cogumelos Paris, batata-doce',
          'Opção 3: Ex: tilápia, couve-flor, mandioca, azeite',
        ],
        quickTags: ['Peito de Frango', 'Patinho Moído', 'Brócolis (DIM)', 'Cogumelo Paris', 'Couve-Flor', 'Tilápia', 'Arroz Branco', 'Feijão', 'Batata-Doce', 'Rúcula e Folhas'],
      },
      {
        id: 1,
        name: 'Café / Lanche da Tarde (Controle Hormonal & Zinco)',
        time: '16:00',
        icon: '☕',
        defaultOptions: [
          'Whey Protein, sementes de abóbora, 1 banana',
          'Ovos inteiros mexidos, aveia em flocos, chá verde com limão',
          'Iogurte desnatado, morangos frescos, sementes de chia',
        ],
        placeholders: [
          'Opção 1: Ex: Whey Protein, sementes de abóbora, banana',
          'Opção 2: Ex: ovos mexidos, aveia, chá verde',
          'Opção 3: Ex: iogurte com morangos e sementes',
        ],
        quickTags: ['Whey Protein', 'Sementes de Abóbora (Zinco)', 'Chá Verde (EGCG)', 'Morangos (Resveratrol)', 'Ovos Mexidos', 'Aveia em Flocos', '1 Banana'],
      },
      {
        id: 2,
        name: 'Jantar (Fechamento da Janela • Alta Absorção)',
        time: '20:00',
        icon: '🥩',
        defaultOptions: [
          'Patinho moído refogado, brócolis no vapor, arroz branco na balança, azeite',
          'Filé de tilápia grelhado, repolho roxo refogado, batata inglesa cozida',
          'Peito de frango grelhado, cogumelos refogados no azeite, mandioca na balança',
        ],
        placeholders: [
          'Opção 1: Ex: patinho moído, brócolis, arroz',
          'Opção 2: Ex: tilápia, repolho roxo, batata inglesa',
          'Opção 3: Ex: frango, cogumelos, mandioca',
        ],
        quickTags: ['Patinho Moído (Zinco)', 'Brócolis (DIM)', 'Cogumelos Paris', 'Peito de Frango', 'Tilápia', 'Repolho Roxo', 'Batata Inglesa', 'Azeite Extravirgem'],
      },
    ];
  }

  if (count === 5) {
    return [
      {
        id: 0,
        name: 'Café da Manhã (Ativação Anti-Aromatase)',
        time: '07:00',
        icon: '🍳',
        defaultOptions: [
          'Ovos inteiros mexidos com cogumelos Paris, aveia em flocos, chá verde',
          'Pão integral com ovos mexidos, morangos frescos, café preto sem açúcar',
          'Crepioca (ovos e tapioca), sementes de abóbora, chá verde com limão',
        ],
        placeholders: [
          'Opção 1: Ex: ovos mexidos, cogumelos, aveia, chá verde',
          'Opção 2: Ex: pão integral, ovos mexidos, morangos',
          'Opção 3: Ex: crepioca, sementes de abóbora, chá verde',
        ],
        quickTags: ['Ovos Inteiros', 'Cogumelo Paris', 'Aveia em Flocos', 'Sementes de Abóbora (Zinco)', 'Chá Verde (EGCG)', 'Pão Integral', 'Morangos'],
      },
      {
        id: 1,
        name: 'Lanche da Manhã (Zinco & Antioxidantes)',
        time: '10:00',
        icon: '🍎',
        defaultOptions: [
          'Morangos frescos com sementes de abóbora na balança',
          'Ovos cozidos na balança com chá verde com limão',
          'Iogurte natural desnatado com sementes de chia e frutas vermelhas',
        ],
        placeholders: [
          'Opção 1: Ex: morangos com sementes de abóbora',
          'Opção 2: Ex: ovos cozidos com chá verde',
          'Opção 3: Ex: iogurte com sementes e morangos',
        ],
        quickTags: ['Morangos (Resveratrol)', 'Sementes de Abóbora (Zinco)', 'Ovos Cozidos', 'Chá Verde (EGCG)'],
      },
      {
        id: 2,
        name: 'Almoço Principal (Bloqueio de Estrogênio)',
        time: '13:00',
        icon: '🍗',
        defaultOptions: [
          'Peito de frango grelhado, brócolis no vapor, arroz branco, feijão carioca',
          'Carne moída (patinho), cogumelos Paris frescos, batata-doce, salada de rúcula',
          'Filé de tilápia grelhado, couve-flor no vapor, mandioca na balança, azeite',
        ],
        placeholders: [
          'Opção 1: Ex: peito de frango, brócolis, arroz, feijão',
          'Opção 2: Ex: patinho moído, cogumelos, batata-doce',
          'Opção 3: Ex: tilápia, couve-flor, mandioca',
        ],
        quickTags: ['Peito de Frango', 'Patinho Moído', 'Brócolis (DIM)', 'Cogumelo Paris', 'Couve-Flor', 'Tilápia', 'Arroz Branco', 'Feijão'],
      },
      {
        id: 3,
        name: 'Café / Lanche da Tarde (Aporte Proteico)',
        time: '16:30',
        icon: '☕',
        defaultOptions: [
          'Whey Protein, sementes de abóbora, 1 banana',
          'Ovos inteiros cozidos, aveia em flocos, chá verde com limão',
          'Iogurte desnatado com aveia em flocos e morangos frescos',
        ],
        placeholders: [
          'Opção 1: Ex: Whey Protein, sementes de abóbora, banana',
          'Opção 2: Ex: ovos cozidos com aveia e chá verde',
          'Opção 3: Ex: iogurte com aveia e morangos',
        ],
        quickTags: ['Whey Protein', 'Sementes de Abóbora (Zinco)', 'Chá Verde (EGCG)', 'Morangos (Resveratrol)', 'Ovos Cozidos', 'Aveia em Flocos', '1 Banana'],
      },
      {
        id: 4,
        name: 'Jantar (Recuperação Noturna & Saciedade)',
        time: '20:00',
        icon: '🥩',
        defaultOptions: [
          'Patinho moído refogado, brócolis no vapor, arroz branco na balança',
          'Filé de tilápia grelhado, repolho roxo refogado, batata inglesa cozida',
          'Peito de frango grelhado, mix de cogumelos refogados no azeite, mandioca cozida',
        ],
        placeholders: [
          'Opção 1: Ex: patinho moído, brócolis, arroz',
          'Opção 2: Ex: tilápia, repolho roxo, batata inglesa',
          'Opção 3: Ex: frango, cogumelos, mandioca',
        ],
        quickTags: ['Patinho Moído (Zinco)', 'Brócolis (DIM)', 'Cogumelos Paris', 'Tilápia', 'Peito de Frango', 'Repolho Roxo', 'Batata Inglesa'],
      },
    ];
  }

  // 4 refeições padrão
  return [
    {
      id: 0,
      name: 'Café da Manhã (Ativação Metabólica Anti-Aromatase)',
      time: '07:30',
      icon: '🍳',
      defaultOptions: [
        'Ovos inteiros mexidos com cogumelos Paris, aveia em flocos, chá verde',
        'Pão integral com ovos mexidos, morangos frescos, café puro sem açúcar',
        'Crepioca (ovos + goma de tapioca), sementes de abóbora, chá verde com limão',
      ],
      placeholders: [
        'Opção 1: Ex: ovos mexidos, cogumelos, aveia, chá verde',
        'Opção 2: Ex: pão integral, ovos mexidos, morangos',
        'Opção 3: Ex: crepioca, sementes de abóbora, chá verde',
      ],
      quickTags: ['Ovos Inteiros', 'Cogumelo Paris', 'Aveia em Flocos', 'Sementes de Abóbora (Zinco)', 'Chá Verde (EGCG)', 'Pão Integral', 'Morangos'],
    },
    {
      id: 1,
      name: 'Almoço Principal (Bloqueio de Aromatase & DIM)',
      time: '12:30',
      icon: '🍗',
      defaultOptions: [
        'Peito de frango grelhado, brócolis no vapor, arroz branco, feijão carioca',
        'Patinho moído refogado, cogumelos Paris frescos, batata-doce, salada de rúcula',
        'Filé de tilápia grelhado, couve-flor no vapor, mandioca na balança, azeite',
      ],
      placeholders: [
        'Opção 1: Ex: peito de frango, brócolis, arroz, feijão',
        'Opção 2: Ex: patinho moído, cogumelos Paris, batata-doce',
        'Opção 3: Ex: tilápia grelhada, couve-flor, mandioca, azeite',
      ],
      quickTags: ['Peito de Frango', 'Patinho Moído', 'Brócolis (DIM)', 'Cogumelo Paris', 'Couve-Flor', 'Tilápia', 'Arroz Branco', 'Feijão', 'Batata-Doce'],
    },
    {
      id: 2,
      name: 'Café / Lanche da Tarde (Aporte Proteico & Zinco)',
      time: '16:30',
      icon: '☕',
      defaultOptions: [
        'Whey Protein, sementes de abóbora, 1 banana',
        'Ovos inteiros cozidos, aveia em flocos, chá verde com limão',
        'Iogurte desnatado com aveia em flocos e morangos frescos',
      ],
      placeholders: [
        'Opção 1: Ex: Whey Protein, sementes de abóbora, banana',
        'Opção 2: Ex: ovos cozidos com aveia e chá verde',
        'Opção 3: Ex: iogurte com aveia e morangos',
      ],
      quickTags: ['Whey Protein', 'Sementes de Abóbora (Zinco)', 'Chá Verde (EGCG)', 'Morangos (Resveratrol)', 'Ovos Inteiros', 'Aveia em Flocos', '1 Banana'],
    },
    {
      id: 3,
      name: 'Jantar (Recuperação Noturna & Saciedade)',
      time: '20:00',
      icon: '🥩',
      defaultOptions: [
        'Patinho moído refogado, brócolis no vapor, arroz branco na balança, azeite',
        'Filé de tilápia grelhado, repolho roxo refogado, batata inglesa cozida',
        'Peito de frango grelhado, mix de cogumelos refogados no azeite, mandioca cozida',
      ],
      placeholders: [
        'Opção 1: Ex: patinho moído, brócolis, arroz, azeite',
        'Opção 2: Ex: tilápia, repolho roxo, batata inglesa',
        'Opção 3: Ex: frango grelhado, cogumelos, mandioca',
      ],
      quickTags: ['Patinho Moído (Zinco)', 'Brócolis (DIM)', 'Cogumelos Paris', 'Tilápia', 'Peito de Frango', 'Repolho Roxo', 'Batata Inglesa', 'Azeite Extravirgem'],
    },
  ];
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'workout' | 'diet' | 'aromatase' | 'armor'>('home');
  const [initialVideoMode, setInitialVideoMode] = useState<'shorts' | 'practical'>('practical');
  const [showInstallModal, setShowInstallModal] = useState(false);

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
  const [showAromataseGuide, setShowAromataseGuide] = useState<boolean>(true);

  // Checklist Diário Operacional (Água & Refeições)
  const todayKey = new Date().toISOString().slice(0, 10);
  const [waterCups, setWaterCups] = useState<number>(0);
  const [checkedMeals, setCheckedMeals] = useState<Record<string, boolean>>({});
  const [workoutChecked, setWorkoutChecked] = useState<boolean>(false);
  const [greenTeaChecked, setGreenTeaChecked] = useState<boolean>(false);

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

      const savedWorkout = localStorage.getItem(`qg_workout_${todayKey}`);
      if (savedWorkout) setWorkoutChecked(savedWorkout === 'true');

      const savedTea = localStorage.getItem(`qg_tea_${todayKey}`);
      if (savedTea) setGreenTeaChecked(savedTea === 'true');
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

  const toggleWorkoutCheck = () => {
    const val = !workoutChecked;
    setWorkoutChecked(val);
    localStorage.setItem(`qg_workout_${todayKey}`, String(val));
  };

  const toggleGreenTeaCheck = () => {
    const val = !greenTeaChecked;
    setGreenTeaChecked(val);
    localStorage.setItem(`qg_tea_${todayKey}`, String(val));
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
    let goalLabel = 'Recomposição Corporal (Trocar Gordura por Músculo)';

    if (goal === 'hipertrofia') {
      targetKcal = get + 400;
      goalLabel = 'Hipertrofia & Volume (+400 kcal • Massa Muscular)';
    } else if (goal === 'emagrecimento') {
      targetKcal = get - 500;
      goalLabel = 'Emagrecimento Moderado (-500 kcal • Foco Anti-Aromatase)';
    } else if (goal === 'emagrecimento_agressivo') {
      targetKcal = get - 750;
      goalLabel = 'Emagrecimento Agressivo (-750 kcal • Máxima Queima)';
    }

    // Piso de segurança
    const minFloor = gender === 'masculino' ? 1400 : 1200;
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

    // Configurações e as 3 opções de cada refeição geradas estritamente com base na calculadora
    const currentSlots = getMealSlotsForCount(mealsCount);
    const optionPlans = [0, 1, 2].map((optIdx) => ({
      optionNumber: (optIdx + 1) as 1 | 2 | 3,
      meals: currentSlots.map((slot) => ({
        mealIndex: slot.id + 1,
        name: slot.name,
        timeSuggestion: slot.time,
        userFoods: slot.defaultOptions[optIdx] ?? '',
      })),
    }));

    // GERAÇÃO MATEMÁTICA 100% FIEL ÀS METAS CALCULADAS
    // Calcula as gramaturas exatas na balança para cada refeição de cada opção
    const optColors = ['var(--primary)', '#FFD700', '#ff3333'];
    const optRgb: [number, number, number][] = [
      [0, 255, 0],
      [255, 215, 0],
      [255, 51, 51],
    ];
    const optTitles = [
      'Opção 1: Seu Cardápio Principal (Crucíferos & DIM)',
      'Opção 2: Sua Variação Estratégica (Inibidores de Aromatase)',
      'Opção 3: Sua Rotação Prática (Zinco & Alta Proteína)',
    ];

    const generatedOptions = [0, 1, 2].map((optIdx) => {
      const mealsList = currentSlots.map((slot) => {
        const mealFoods = slot.defaultOptions[optIdx] ?? '';
        const items = parseAndCalculateMealItems(mealFoods, pMeal, cMeal, fatGrams / mealsCount, slot.id + optIdx);
        return {
          name: slot.name,
          time: slot.time,
          desc: items.map((it) => `<strong>${it.name}:</strong> ${it.portion}`).join('<br>'),
        };
      });

      return {
        title: optTitles[optIdx],
        color: optColors[optIdx],
        rgbColor: optRgb[optIdx],
        mealsList,
      };
    });

    // Enviar dados em background para registro e telemetria (sem bloquear nem sobrepor)
    const activityMap: Record<number, string> = {
      1.2: 'sedentario',
      1.375: 'leve',
      1.55: 'moderado',
      1.725: 'ativo',
      1.9: 'muito_ativo',
    };

    fetch('/api/generate-diet', {
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
        optionPlans,
        preferences: optionPlans[0].meals.map((m) => `${m.name}: ${m.userFoods}`),
        customNotes: optionPlans
          .map((o) => `Opção ${o.optionNumber}: ` + o.meals.map((m) => `${m.name} [${m.userFoods}]`).join(', '))
          .join(' | '),
      }),
    }).catch(() => {});

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

    const currentSlots = getMealSlotsForCount(calcData.mealsCount);
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
      preferences: currentSlots.map((s) => {
        const o1 = s.defaultOptions[0] ?? '';
        const o2 = s.defaultOptions[1] ?? '';
        const o3 = s.defaultOptions[2] ?? '';
        return `${s.name}: [Op 1: ${o1}] | [Op 2: ${o2}] | [Op 3: ${o3}]`;
      }),
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
          <p>Área exclusiva para alunos e membros cadastrados.</p>
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

  const navigateToTab = (tab: 'home' | 'workout' | 'diet' | 'aromatase' | 'armor', videoMode?: 'shorts' | 'practical') => {
    if (videoMode) setInitialVideoMode(videoMode);
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 3. Aplicação Liberada para Aluno Autenticado
  return (
    <div style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* HEADER TÁTICO FIXO ESTILO APP MOBILE + NETFLIX DARK */}
      <header
        style={{
          background: 'rgba(12, 12, 12, 0.96)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #00FF00',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '10px 14px',
          width: '100%',
        }}
      >
        <div
          style={{
            maxWidth: '540px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            onClick={() => navigateToTab('home')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgba(0, 255, 0, 0.14)',
                border: '1px solid #00FF00',
                display: 'grid',
                placeItems: 'center',
                fontSize: '18px',
              }}
            >
              🦅
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 900,
                  fontSize: '15px',
                  color: '#fff',
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                }}
              >
                QG <span style={{ color: '#00FF00' }}>Seca Peitoral</span>
              </div>
              <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>
                <span style={{ color: '#00FF00', fontWeight: 700 }}>● ATIVO:</span>{' '}
                {activeUser?.name || activeUser?.email}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setShowInstallModal(true)}
              style={{
                background: 'rgba(0, 255, 0, 0.15)',
                color: '#00FF00',
                fontSize: '10px',
                fontWeight: 900,
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #00FF00',
                textTransform: 'uppercase',
                cursor: 'pointer',
                animation: 'pulse-btn 2s infinite',
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              📲 Instalar App
            </button>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: '#1a1a1a',
                border: '1px solid #333',
                color: '#aaa',
                fontSize: '11px',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        {/* ABA 1: INÍCIO (VITRINE NETFLIX DARK PREMIUM) */}
        {activeTab === 'home' && (
          <div style={{ paddingBottom: '20px' }}>
            {/* HERO BANNER ESTILO NETFLIX */}
            <div
              style={{
                background:
                  'radial-gradient(circle at 85% 15%, rgba(0, 255, 0, 0.22), rgba(255, 215, 0, 0.06) 45%, #0b0b0b 85%)',
                border: '1px solid rgba(0, 255, 0, 0.4)',
                borderRadius: '14px',
                padding: '24px 20px',
                marginBottom: '18px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7)',
              }}
            >
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span
                  style={{
                    background: '#00FF00',
                    color: '#000',
                    fontSize: '10px',
                    fontWeight: 900,
                    padding: '3px 9px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  ★ OFICIAL KIWIFY • ACESSO TOTAL LIBERADO
                </span>
                <span
                  style={{
                    background: 'rgba(255, 215, 0, 0.15)',
                    border: '1px solid #FFD700',
                    color: '#FFD700',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: '4px',
                  }}
                >
                  5 ENTREGÁVEIS + VÍDEO-AULA PRÁTICA
                </span>
              </div>

              <h1
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '26px',
                  fontWeight: 900,
                  color: '#fff',
                  textTransform: 'uppercase',
                  lineHeight: 1.15,
                  margin: '0 0 10px 0',
                }}
              >
                Operação <span style={{ color: '#00FF00' }}>Seca Peitoral</span>
              </h1>
              <p style={{ fontSize: '13px', color: '#ccc', lineHeight: 1.55, maxWidth: '580px', margin: '0 0 18px 0' }}>
                Seu Quartel-General completo para eliminar a lipomastia: assista à <strong>Vídeo-Aula Prática</strong> fazendo a ficha, siga os <strong>5 exercícios biomecânicos</strong>, gere seus <strong>3 cardápios anti-aromatase na balança</strong> e aplique o <strong>Guia de Trava da Aromatase</strong> e o <strong>Efeito Armadura</strong>.
              </p>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => navigateToTab('workout', 'practical')}
                  style={{
                    background: '#00FF00',
                    color: '#000',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '13px 18px',
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 900,
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 0 18px rgba(0, 255, 0, 0.35)',
                  }}
                >
                  ▶ Assistir Vídeo-Aula da Ficha
                </button>

                <button
                  type="button"
                  onClick={() => navigateToTab('diet')}
                  style={{
                    background: '#181818',
                    color: '#fff',
                    border: '1px solid #00FF00',
                    borderRadius: '8px',
                    padding: '13px 18px',
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🥩 Gerar Minha Dieta (App)
                </button>
              </div>
            </div>

            {/* AVISO DE WEB APP / ATALHO TÁTICO NA TELA INICIAL */}
            <div
              onClick={() => setShowInstallModal(true)}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.14), rgba(17, 17, 17, 0.9))',
                border: '1px solid rgba(255, 215, 0, 0.45)',
                borderRadius: '10px',
                padding: '14px 16px',
                marginBottom: '24px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '24px' }}>📱</span>
              <p style={{ margin: 0, fontSize: '12px', color: '#ddd', lineHeight: 1.45, flex: 1 }}>
                <strong style={{ color: '#FFD700' }}>DICA TÁTICA:</strong> Clique nos 3 pontinhos do seu navegador e selecione{' '}
                <strong style={{ color: '#FFD700' }}>&ldquo;Adicionar à Tela Inicial&rdquo;</strong>. Isso criará um aplicativo no seu celular para você abrir direto na academia.{' '}
                <span style={{ color: '#00FF00', textDecoration: 'underline', fontWeight: 700 }}>Ver passo a passo →</span>
              </p>
            </div>

            {/* TRILHA 1 NETFLIX: ENTREGÁVEIS PRINCIPAIS (TREINO, VÍDEO-AULA & DIETA) */}
            <div style={{ marginBottom: '26px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '16px',
                    fontWeight: 900,
                    color: '#fff',
                    textTransform: 'uppercase',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ color: '#00FF00' }}>▍</span> 1. Operações Principais: Treino, Vídeo-Aula & Dieta
                </h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(245px, 1fr))',
                  gap: '14px',
                }}
              >
                {/* Card 1: Ficha de Treino Seca Peitoral */}
                <div
                  onClick={() => navigateToTab('workout', 'shorts')}
                  className="netflix-card"
                  style={{
                    background: '#111',
                    border: '1px solid #282828',
                    borderTop: '4px solid #00FF00',
                    borderRadius: '10px',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span
                        style={{
                          background: 'rgba(0, 255, 0, 0.15)',
                          color: '#00FF00',
                          fontSize: '10px',
                          fontWeight: 900,
                          padding: '3px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        ENTREGÁVEL #01 • PRINCIPAL
                      </span>
                      <span style={{ fontSize: '20px' }}>🏋️</span>
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '16px',
                        color: '#fff',
                        textTransform: 'uppercase',
                        margin: '0 0 6px 0',
                      }}
                    >
                      Ficha de Treino Seca Peitoral & Ambiente Metabólico
                    </h3>
                    <p style={{ fontSize: '12px', color: '#aaa', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                      O Plano de Ação + Os 5 exercícios na ordem exata com GIFs biomecânicos, rastreador de séries e protocolo de Jejum + Ioimbina + 4L de Água.
                    </p>
                  </div>
                  <span style={{ color: '#00FF00', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>
                    Abrir Ficha de Treino →
                  </span>
                </div>

                {/* Card 2: Vídeo-Aula Prática Executando a Ficha */}
                <div
                  onClick={() => navigateToTab('workout', 'practical')}
                  className="netflix-card"
                  style={{
                    background: '#111',
                    border: '1px solid #282828',
                    borderTop: '4px solid #FFD700',
                    borderRadius: '10px',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span
                        style={{
                          background: 'rgba(255, 215, 0, 0.15)',
                          color: '#FFD700',
                          fontSize: '10px',
                          fontWeight: 900,
                          padding: '3px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        VÍDEO-AULA PRÁTICA • 6:54 MIN
                      </span>
                      <span style={{ fontSize: '20px' }}>🎬</span>
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '16px',
                        color: '#fff',
                        textTransform: 'uppercase',
                        margin: '0 0 6px 0',
                      }}
                    >
                      Vídeo-Aula: Executando a Ficha na Prática
                    </h3>
                    <p style={{ fontSize: '12px', color: '#aaa', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                      Assista à gravação real mostrando exatamente como executar cada exercício, angulação de cotovelos, cadência de 2 segundos e contração máxima.
                    </p>
                  </div>
                  <span style={{ color: '#FFD700', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>
                    ▶ Assistir Vídeo-Aula Agora →
                  </span>
                </div>

                {/* Card 3: Gerador de Dieta Anti-Aromatase */}
                <div
                  onClick={() => navigateToTab('diet')}
                  className="netflix-card"
                  style={{
                    background: '#111',
                    border: '1px solid #282828',
                    borderTop: '4px solid #00FF00',
                    borderRadius: '10px',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span
                        style={{
                          background: 'rgba(0, 255, 0, 0.15)',
                          color: '#00FF00',
                          fontSize: '10px',
                          fontWeight: 900,
                          padding: '3px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        FERRAMENTA INTERATIVA • APP
                      </span>
                      <span style={{ fontSize: '20px' }}>🥩</span>
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '16px',
                        color: '#fff',
                        textTransform: 'uppercase',
                        margin: '0 0 6px 0',
                      }}
                    >
                      Gerador de Dieta Anti-Aromatase na Balança
                    </h3>
                    <p style={{ fontSize: '12px', color: '#aaa', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                      Calcula sua TMB, GET, Proteína (2.2g/kg), Gordura (0.9g/kg) e Carboidratos, gerando 3 opções completas de cardápio com gramas exatas + PDF.
                    </p>
                  </div>
                  <span style={{ color: '#00FF00', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>
                    ⚡ Calcular Minha Dieta →
                  </span>
                </div>
              </div>
            </div>

            {/* TRILHA 2 NETFLIX: BÔNUS EXCLUSIVOS & DOSSIÊS TÁTICOS */}
            <div style={{ marginBottom: '26px' }}>
              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '16px',
                  fontWeight: 900,
                  color: '#fff',
                  textTransform: 'uppercase',
                  margin: '0 0 12px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ color: '#FFD700' }}>▍</span> 2. Bônus Táticos & Guias Especializados
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '14px',
                }}
              >
                {/* Card Bônus 02: Guia de Trava da Aromatase */}
                <div
                  onClick={() => navigateToTab('aromatase')}
                  className="netflix-card"
                  style={{
                    background: 'linear-gradient(145deg, #151208, #111111)',
                    border: '1px solid rgba(255, 215, 0, 0.35)',
                    borderLeft: '4px solid #FFD700',
                    borderRadius: '10px',
                    padding: '18px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span
                        style={{
                          background: '#FFD700',
                          color: '#000',
                          fontSize: '10px',
                          fontWeight: 900,
                          padding: '3px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        GUIA DE TRAVA DA AROMATASE • UNIFICADO
                      </span>
                      <span style={{ fontSize: '20px' }}>🛡️</span>
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '16px',
                        color: '#fff',
                        textTransform: 'uppercase',
                        margin: '0 0 6px 0',
                      }}
                    >
                      Dossiê Tático: Guia de Trava da Aromatase
                    </h3>
                    <p style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                      O Ciclo da Aromatase no Peitoral + Lista Negra pesquisável dos 20 Sabotadores + Os 5 Alimentos Bloqueadores & 4 Antídotos Naturais + Plano 30 Dias + Teste de Risco em 1 Minuto.
                    </p>
                  </div>
                  <span style={{ color: '#FFD700', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>
                    🛡️ Acessar Guia de Trava da Aromatase →
                  </span>
                </div>

                {/* Card Bônus 01: O Efeito Armadura & Postura Alpha */}
                <div
                  onClick={() => navigateToTab('armor')}
                  className="netflix-card"
                  style={{
                    background: 'linear-gradient(145deg, #0b151e, #111111)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    borderLeft: '4px solid #38bdf8',
                    borderRadius: '10px',
                    padding: '18px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span
                        style={{
                          background: '#38bdf8',
                          color: '#000',
                          fontSize: '10px',
                          fontWeight: 900,
                          padding: '3px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        BÔNUS #01 • CAMUFLAGEM IMEDIATA
                      </span>
                      <span style={{ fontSize: '20px' }}>⚡</span>
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '16px',
                        color: '#fff',
                        textTransform: 'uppercase',
                        margin: '0 0 6px 0',
                      }}
                    >
                      O Efeito Armadura & Postura Alpha
                    </h3>
                    <p style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                      O Hack de 3 Segundos no espelho + Scanner Biomecânico Interativo (Efeito Cone vs Efeito Cortina) + Engenharia Têxtil (200+ GSM) + Checklist de Bolso.
                    </p>
                  </div>
                  <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>
                    ⚡ Acessar Bônus Efeito Armadura →
                  </span>
                </div>
              </div>
            </div>

            {/* TRILHA 3 NETFLIX: CENTRAL DE ARQUIVOS EM PDF PARA DOWNLOAD */}
            <div>
              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '16px',
                  fontWeight: 900,
                  color: '#fff',
                  textTransform: 'uppercase',
                  margin: '0 0 12px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ color: '#38bdf8' }}>▍</span> 3. Apostilas & Materiais em PDF para Download
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                }}
              >
                <a
                  href="/downloads/Ficha_Tatica_Secagem_Peitoral.pdf"
                  download="Ficha_Tatica_Secagem_Peitoral.pdf"
                  className="netflix-card"
                  style={{
                    background: '#141414',
                    border: '1px solid #282828',
                    borderRadius: '10px',
                    padding: '14px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span style={{ fontSize: '26px' }}>📄</span>
                  <div>
                    <strong style={{ color: '#fff', fontSize: '13px', display: 'block' }}>
                      Ficha Tática Secagem Peitoral
                    </strong>
                    <span style={{ color: '#00FF00', fontSize: '11px', fontWeight: 700 }}>
                      📥 Baixar PDF Oficial
                    </span>
                  </div>
                </a>

                <a
                  href="/downloads/Calendario_Seca_Peitoral.pdf"
                  download="Calendario_Seca_Peitoral.pdf"
                  className="netflix-card"
                  style={{
                    background: '#141414',
                    border: '1px solid #282828',
                    borderRadius: '10px',
                    padding: '14px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span style={{ fontSize: '26px' }}>📅</span>
                  <div>
                    <strong style={{ color: '#fff', fontSize: '13px', display: 'block' }}>
                      Calendário Seca Peitoral (30 Dias)
                    </strong>
                    <span style={{ color: '#FFD700', fontSize: '11px', fontWeight: 700 }}>
                      📥 Baixar PDF Oficial
                    </span>
                  </div>
                </a>

                <a
                  href="/bonus-efeito-armadura.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="netflix-card"
                  style={{
                    background: '#141414',
                    border: '1px solid #282828',
                    borderRadius: '10px',
                    padding: '14px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span style={{ fontSize: '26px' }}>🛡️</span>
                  <div>
                    <strong style={{ color: '#fff', fontSize: '13px', display: 'block' }}>
                      Apostila O Efeito Armadura
                    </strong>
                    <span style={{ color: '#38bdf8', fontSize: '11px', fontWeight: 700 }}>
                      🖨️ Abrir Versão p/ Impressão / PDF
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: TREINO & VÍDEO-AULA (ENTREGÁVEL PRINCIPAL COMPLETO) */}
        {activeTab === 'workout' && (
          <WorkoutOperationsTab
            onNavigateTab={(tab) => navigateToTab(tab)}
            initialVideoMode={initialVideoMode}
          />
        )}

        {/* ABA 4: GUIA DE TRAVA DA AROMATASE (UNIFICADO) */}
        {activeTab === 'aromatase' && <AromataseGuideTab />}

        {/* ABA 5: BÔNUS 01 - O EFEITO ARMADURA & POSTURA ALPHA */}
        {activeTab === 'armor' && <ArmorPostureTab />}

        {/* ABA 3: GERADOR DE DIETA ANTI-AROMATASE (APP CALCULADORA + CHECKLIST DIÁRIO) */}
        {activeTab === 'diet' && (
          <div>
            <div className="header" style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(0, 255, 0, 0.1)',
                  border: '1px solid rgba(0, 255, 0, 0.3)',
                  borderRadius: '20px',
                  padding: '4px 14px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: 'var(--primary)',
                  marginBottom: '10px',
                  letterSpacing: '0.5px',
                }}
              >
                <span>🥩 FERRAMENTA OFICIAL • GERADOR DE DIETA NA BALANÇA</span>
              </div>
              <h2 style={{ margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Calculadora & Dieta <span>Anti-Aromatase</span>
              </h2>
              <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '13px', color: '#ccc', lineHeight: 1.5 }}>
                <strong>Otimização Hormonal & Secagem Peitoral:</strong> Calcule suas metas exatas e receba 3 opções completas de cardápio pesadas em gramas na balança + Checklist Diário.
              </p>
              <div style={{ marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => navigateToTab('aromatase')}
                  style={{
                    background: 'rgba(255, 215, 0, 0.12)',
                    border: '1px solid #FFD700',
                    color: '#FFD700',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  🛡️ Ver Guia Completo de Trava da Aromatase →
                </button>
              </div>
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
              <label>Sexo Biológico</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="form-control"
              >
                <option value="masculino">Masculino (Otimização Hormonal Masculina)</option>
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
              <label>Objetivo do Protocolo</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as any)}
                className="form-control"
              >
                <option value="emagrecimento">1) Emagrecimento Moderado (-500 kcal • Foco Anti-Aromatase) - RECOMENDADO</option>
                <option value="emagrecimento_agressivo">2) Emagrecimento Agressivo (-750 kcal • Máxima Definição)</option>
                <option value="recomposicao">3) Recomposição Corporal (Trocar Gordura por Músculo)</option>
                <option value="hipertrofia">4) Hipertrofia & Volume (+400 kcal • Massa Muscular)</option>
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

          {/* Card: Cardápios 100% Gerados nas Quantidades da Calculadora */}
          <div
            style={{
              background: 'rgba(0, 255, 0, 0.04)',
              border: '1px solid rgba(0, 255, 0, 0.3)',
              borderRadius: '8px',
              padding: '16px 18px',
              marginTop: '20px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>⚡</span>
              <strong style={{ color: 'var(--primary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Cardápios 100% Gerados nas Quantidades da Calculadora
              </strong>
            </div>
            <p style={{ fontSize: '12px', color: '#ccc', margin: 0, lineHeight: 1.55 }}>
              O sistema calcula as calorias e macronutrientes exatos do seu corpo e entrega <strong>3 opções completas de cardápio</strong> para as suas <strong>{mealsCount} refeições diárias</strong>. Cada alimento (proteínas magras, carboidratos limpos, gorduras boas e vegetais anti-aromatase como brócolis, cogumelos e sementes de abóbora) já virá com a pesagem precisa em gramas na balança para você seguir sem erro.
            </p>
          </div>

          <button
            className="btn btn-primary"
            style={{ marginTop: '10px' }}
            onClick={generateDiet}
            disabled={isLoading}
          >
            {isLoading ? 'CALCULANDO METAS & GERANDO CARDÁPIOS...' : '⚡ Gerar 3 Cardápios Anti-Aromatase'}
          </button>
        </div>
      ) : (
        calcData && (
          <div id="result">
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(0, 255, 0, 0.15)', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '4px', fontSize: '10px', padding: '2px 8px', fontWeight: 'bold' }}>
                  ORDER BUMP OFICIAL • SECA PEITORAL
                </span>
                <span style={{ background: 'rgba(0, 208, 255, 0.15)', color: '#00d0ff', border: '1px solid #00d0ff', borderRadius: '4px', fontSize: '10px', padding: '2px 8px', fontWeight: 'bold' }}>
                  PROTOCOLO ANTI-AROMATASE ATIVO
                </span>
              </div>

              <h3 style={{ marginTop: 0, fontFamily: "'Montserrat', sans-serif", textTransform: 'uppercase' }}>
                Seu Protocolo Nutricional Seca Peitoral
              </h3>

              {/* Box de Diretrizes Anti-Aromatase */}
              <div
                style={{
                  background: 'rgba(0, 255, 0, 0.04)',
                  border: '1px solid rgba(0, 255, 0, 0.3)',
                  borderRadius: '6px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  fontSize: '12px',
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '4px', fontSize: '12px', fontFamily: "'Montserrat', sans-serif" }}>
                  🛡️ MANDAMENTOS ANTI-AROMATASE PARA POTENCIALIZAR SUA FICHA DE TREINO
                </strong>
                <span style={{ color: '#ccc' }}>
                  • <strong>Crucíferos Diários (DIM):</strong> Mantenha brócolis, couve-flor ou repolho em ao menos uma refeição para acelerar a eliminação tecidual de estrogênio.<br />
                  • <strong>Blindagem da Testosterona:</strong> 2.2g/kg de proteína e gorduras limpas para manter a testosterona livre elevada enquanto queima a gordura do peito.<br />
                  • <strong>Chá Verde (EGCG):</strong> 1 a 2 xícaras ao dia auxiliam na redução da atividade da enzima aromatase no peitoral.<br />
                  • <strong>Corte de Cerveja e Ultraprocessados:</strong> O lúpulo da cerveja contém fitoestrógenos potentes que anulam o efeito do treino de peitoral.
                </span>
              </div>

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

              {/* Linha dos Macros Diários */}
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                Metas Diárias de Macronutrientes (<span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{calcData.goalLabel}</span>):<br />
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

              {/* CHECKLIST DIÁRIO DE HÁBITOS (ÁGUA & REFEIÇÕES & ANTI-AROMATASE) */}
              {(() => {
                const totalWaterBottles = Math.max(1, Math.ceil((calcData.waterL * 1000) / 500));
                const completedBottles = Math.min(waterCups, totalWaterBottles);
                const waterPercent = Math.min(100, Math.round((completedBottles / totalWaterBottles) * 100));
                const checkedMealsCount = Array.from({ length: calcData.mealsCount }).filter(
                  (_, i) => checkedMeals[`meal_${todayKey}_${i + 1}`]
                ).length;
                const mealsPercent = Math.round((checkedMealsCount / calcData.mealsCount) * 100);
                const totalTasks = totalWaterBottles + calcData.mealsCount + 2;
                const totalDone = completedBottles + checkedMealsCount + (workoutChecked ? 1 : 0) + (greenTeaChecked ? 1 : 0);
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
                          📋 Checklist Diário Anti-Aromatase & Treino
                        </h4>
                        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                          Hoje: {todayKey} • Sinergia com Ficha de Treino Seca Peitoral
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
                        {overallPercent}% CONCLUÍDO
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
                        🎖️ EXCELENTE! 100% DAS DIRETRIZES ANTI-AROMATASE E TREINO CUMPRIDAS HOJE!
                      </div>
                    )}

                    {/* Bloco 1: Treino e Hábitos Chave Anti-Aromatase */}
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#FFD700', display: 'block', marginBottom: '8px' }}>
                        ⚡ Ficha de Treino & Ação Anti-Aromatase
                      </span>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                        <div
                          onClick={toggleWorkoutCheck}
                          style={{
                            background: workoutChecked ? 'rgba(0, 255, 0, 0.08)' : '#181818',
                            border: `1px solid ${workoutChecked ? 'var(--primary)' : '#282828'}`,
                            borderRadius: '6px',
                            padding: '10px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '4px',
                                border: `2px solid ${workoutChecked ? 'var(--primary)' : '#555'}`,
                                background: workoutChecked ? 'var(--primary)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#000',
                                fontSize: '11px',
                                fontWeight: 'bold',
                              }}
                            >
                              {workoutChecked && '✓'}
                            </div>
                            <span style={{ fontSize: '12px', color: workoutChecked ? '#fff' : '#ccc', fontWeight: 'bold' }}>
                              🏋️ Ficha Seca Peitoral Feita
                            </span>
                          </div>
                          <span style={{ fontSize: '10px', color: workoutChecked ? 'var(--primary)' : '#555', fontWeight: 'bold' }}>
                            {workoutChecked ? 'FEITO' : 'PENDENTE'}
                          </span>
                        </div>

                        <div
                          onClick={toggleGreenTeaCheck}
                          style={{
                            background: greenTeaChecked ? 'rgba(0, 208, 255, 0.08)' : '#181818',
                            border: `1px solid ${greenTeaChecked ? '#00d0ff' : '#282828'}`,
                            borderRadius: '6px',
                            padding: '10px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '4px',
                                border: `2px solid ${greenTeaChecked ? '#00d0ff' : '#555'}`,
                                background: greenTeaChecked ? '#00d0ff' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#000',
                                fontSize: '11px',
                                fontWeight: 'bold',
                              }}
                            >
                              {greenTeaChecked && '✓'}
                            </div>
                            <span style={{ fontSize: '12px', color: greenTeaChecked ? '#fff' : '#ccc', fontWeight: 'bold' }}>
                              🍵 Chá Verde (EGCG Anti-Aromatase)
                            </span>
                          </div>
                          <span style={{ fontSize: '10px', color: greenTeaChecked ? '#00d0ff' : '#555', fontWeight: 'bold' }}>
                            {greenTeaChecked ? 'TOMADO' : 'PENDENTE'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bloco 2: Água */}
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

                    {/* Bloco 3: Refeições */}
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
                          🍽️ Refeições ({calcData.mealsCount} refeições na balança)
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                          {checkedMealsCount} de {calcData.mealsCount} ({mealsPercent}%)
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {Array.from({ length: calcData.mealsCount }).map((_, mIdx) => {
                          const mealKey = `meal_${todayKey}_${mIdx + 1}`;
                          const isDone = !!checkedMeals[mealKey];

                          const slot = getMealSlotsForCount(calcData.mealsCount)[mIdx];
                          const mealName = slot ? `${slot.name} (${slot.time})` : `Refeição ${mIdx + 1}`;

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
                📥 Baixar Protocolo Seca Peitoral em PDF
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
          </div>
        )
      )}
          </div>
        )}

        {/* RODAPÉ OFICIAL */}
        <footer
          style={{
            textAlign: 'center',
            padding: '24px 16px 12px',
            borderTop: '1px solid #191919',
            marginTop: '20px',
            fontSize: '11px',
            color: '#666',
            lineHeight: 1.6,
          }}
        >
          <p style={{ margin: 0 }}>
            Os resultados variam e dependem exclusivamente da sua execução diária e disciplina.
          </p>
          <p style={{ margin: '4px 0 0 0', fontWeight: 700, color: '#888' }}>
            Copyright © 2026 — Rjonnssonfit • Quartel-General Seca Peitoral
          </p>
        </footer>
      </div>

      {/* BARRA DE NAVEGAÇÃO INFERIOR FIXA ESTILO APP MOBILE (PWA) */}
      <nav
        aria-label="Navegação Principal do Aplicativo"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 120,
          background: 'rgba(10, 10, 10, 0.96)',
          backdropFilter: 'blur(14px)',
          borderTop: '1px solid #242424',
          padding: '6px 8px 10px',
        }}
      >
        <div
          style={{
            maxWidth: '540px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '2px',
          }}
        >
          {[
            { id: 'home' as const, icon: '🏠', label: 'Início', color: '#00FF00' },
            { id: 'workout' as const, icon: '🏋️', label: 'Treino & Vídeo', color: '#00FF00' },
            { id: 'diet' as const, icon: '🥩', label: 'Dieta (App)', color: '#00FF00' },
            { id: 'aromatase' as const, icon: '🛡️', label: 'Aromatase', color: '#FFD700' },
            { id: 'armor' as const, icon: '⚡', label: 'Armadura', color: '#38bdf8' },
          ].map((nav) => {
            const isSelected = activeTab === nav.id;
            return (
              <button
                key={nav.id}
                type="button"
                onClick={() => navigateToTab(nav.id)}
                style={{
                  background: isSelected ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                  border: 'none',
                  borderTop: isSelected ? `2px solid ${nav.color}` : '2px solid transparent',
                  borderRadius: '6px',
                  padding: '6px 2px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                  color: isSelected ? nav.color : '#888',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: '17px', lineHeight: 1 }}>{nav.icon}</span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: isSelected ? 800 : 600,
                    letterSpacing: '0.2px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {nav.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* MODAL DE INSTALAÇÃO DO APP NO CELULAR (PWA) */}
      {showInstallModal && (
        <div
          onClick={() => setShowInstallModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            zIndex: 250,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '18px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#121212',
              border: '1px solid #00FF00',
              borderRadius: '14px',
              padding: '22px',
              maxWidth: '440px',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3
                style={{
                  margin: 0,
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '17px',
                  color: '#fff',
                  textTransform: 'uppercase',
                }}
              >
                📲 Instalar App no Celular
              </h3>
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '16px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '12px', color: '#ccc', lineHeight: 1.5, margin: '0 0 14px 0' }}>
              Crie o atalho oficial do <strong>QG Seca Peitoral</strong> na tela inicial do seu celular para acessar sua Ficha, Vídeo-Aula e Dieta com 1 toque na academia:
            </p>

            <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
              <strong style={{ color: '#00FF00', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                🤖 No Android (Chrome):
              </strong>
              <span style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.45 }}>
                1. Toque nos <strong>3 pontinhos (⋮)</strong> no canto superior direito do navegador.<br />
                2. Selecione <strong>&ldquo;Adicionar à tela inicial&rdquo;</strong> ou <strong>&ldquo;Instalar aplicativo&rdquo;</strong>.
              </span>
            </div>

            <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
              <strong style={{ color: '#FFD700', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                🍎 No iPhone (Safari):
              </strong>
              <span style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.45 }}>
                1. Toque no ícone de <strong>Compartilhar (quadrado com seta p/ cima)</strong> na barra inferior.<br />
                2. Role para baixo e toque em <strong>&ldquo;Adicionar à Tela de Início&rdquo;</strong>.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowInstallModal(false)}
              className="btn btn-primary"
              style={{ padding: '12px' }}
            >
              Entendido, Voltar ao App
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
