'use client';

import React, { useState, useEffect } from 'react';
import { generateTacticalPdf, TacticalDietData } from '@/lib/pdfGenerator';
import { getProteinPortion, getCarbPortion, getHealthyFatPortion, parseAndCalculateMealItems } from '@/lib/foodCalculations';
import confetti from 'canvas-confetti';

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
        name: 'Almoço (Quebra do Jejum 16h)',
        time: '12:00',
        icon: '🍗',
        defaultOptions: [
          'Peito de frango grelhado, arroz branco, feijão carioca, salada verde',
          'Filé mignon ou carne moída (patinho), batata-doce, salada',
          'Filé de tilápia grelhado, macarrão ou mandioca, brócolis com azeite',
        ],
        placeholders: [
          'Opção 1: Ex: peito de frango, arroz, feijão, salada',
          'Opção 2: Ex: filé mignon, batata-doce, legumes',
          'Opção 3: Ex: tilápia grelhada, macarrão, brócolis',
        ],
        quickTags: ['Peito de Frango', 'Filé Mignon', 'Tilápia', 'Moela', 'Patinho Moído', 'Arroz Branco', 'Feijão', 'Batata-Doce', 'Salada Verde'],
      },
      {
        id: 1,
        name: 'Café / Lanche da Tarde',
        time: '16:00',
        icon: '☕',
        defaultOptions: [
          'Ovos inteiros mexidos, aveia em flocos, 1 fruta fresca',
          'Frango desfiado na balança, pão integral ou tapioca, 1 maçã',
          'Crepioca (ovos + tapioca), castanhas do Pará, 1 banana',
        ],
        placeholders: [
          'Opção 1: Ex: ovos mexidos, aveia em flocos, fruta',
          'Opção 2: Ex: frango desfiado, pão integral, maçã',
          'Opção 3: Ex: crepioca, castanhas, banana',
        ],
        quickTags: ['Ovos Mexidos', 'Aveia em Flocos', 'Banana', 'Pão Integral', 'Frango Desfiado', 'Castanhas'],
      },
      {
        id: 2,
        name: 'Jantar (Fechamento da Janela)',
        time: '20:00',
        icon: '🥩',
        defaultOptions: [
          'Patinho moído refogado, arroz branco, legumes no vapor',
          'Filé de tilápia grelhado, batata inglesa cozida, salada colorida',
          'Moela cozida ou peito de frango, mandioca na balança, legumes',
        ],
        placeholders: [
          'Opção 1: Ex: patinho moído, arroz, legumes no vapor',
          'Opção 2: Ex: tilápia, batata inglesa, salada',
          'Opção 3: Ex: moela cozida, mandioca, brócolis',
        ],
        quickTags: ['Patinho Moído', 'Tilápia', 'Moela', 'Batata Inglesa', 'Mandioca', 'Macarrão', 'Legumes no vapor'],
      },
    ];
  }

  if (count === 5) {
    return [
      {
        id: 0,
        name: 'Café da Manhã',
        time: '07:00',
        icon: '🍳',
        defaultOptions: [
          'Ovos inteiros mexidos, aveia em flocos, café sem açúcar',
          'Pão integral com ovos mexidos, café preto sem açúcar',
          'Crepioca (ovos e tapioca), mamão com canela',
        ],
        placeholders: [
          'Opção 1: Ex: ovos mexidos, aveia, café',
          'Opção 2: Ex: pão integral, ovos mexidos',
          'Opção 3: Ex: crepioca, fruta com canela',
        ],
        quickTags: ['Ovos Mexidos', 'Aveia em Flocos', 'Pão Integral', 'Tapioca', 'Fruta'],
      },
      {
        id: 1,
        name: 'Lanche da Manhã',
        time: '10:00',
        icon: '🍎',
        defaultOptions: [
          '1 maçã ou mamão com castanhas de caju na balança',
          'Ovos cozidos na balança com 1 fruta fresca',
          'Iogurte natural desnatado com sementes de chia e fruta',
        ],
        placeholders: [
          'Opção 1: Ex: fruta com castanhas de caju',
          'Opção 2: Ex: ovos cozidos com fruta',
          'Opção 3: Ex: iogurte com sementes e fruta',
        ],
        quickTags: ['1 Fruta', 'Castanhas de Caju', 'Ovos Cozidos', 'Shake de Proteína'],
      },
      {
        id: 2,
        name: 'Almoço Principal',
        time: '13:00',
        icon: '🍗',
        defaultOptions: [
          'Peito de frango grelhado, arroz branco, feijão, salada verde',
          'Filé mignon ou carne moída (patinho), batata-doce, salada',
          'Filé de tilápia grelhado, macarrão cozido, legumes no vapor',
        ],
        placeholders: [
          'Opção 1: Ex: peito de frango, arroz, feijão, salada',
          'Opção 2: Ex: filé mignon, batata-doce, salada',
          'Opção 3: Ex: tilápia, macarrão, legumes',
        ],
        quickTags: ['Peito de Frango', 'Filé Mignon', 'Patinho Moído', 'Arroz Branco', 'Feijão', 'Salada Verde'],
      },
      {
        id: 3,
        name: 'Café / Lanche da Tarde',
        time: '16:30',
        icon: '☕',
        defaultOptions: [
          'Frango desfiado na balança, batata-doce cozida',
          'Ovos inteiros cozidos, aveia em flocos, 1 banana',
          'Shake proteico isolado com aveia em flocos e castanhas',
        ],
        placeholders: [
          'Opção 1: Ex: frango desfiado com batata-doce',
          'Opção 2: Ex: ovos cozidos com aveia e fruta',
          'Opção 3: Ex: shake proteico com aveia',
        ],
        quickTags: ['Frango Desfiado', 'Ovos Cozidos', 'Batata-Doce', 'Aveia em Flocos'],
      },
      {
        id: 4,
        name: 'Jantar',
        time: '20:00',
        icon: '🥩',
        defaultOptions: [
          'Patinho moído refogado, arroz branco, legumes no vapor',
          'Filé de tilápia grelhado, batata inglesa cozida, salada',
          'Moela cozida ou frango, mandioca na balança, brócolis',
        ],
        placeholders: [
          'Opção 1: Ex: patinho moído, arroz, legumes',
          'Opção 2: Ex: tilápia, batata inglesa, salada',
          'Opção 3: Ex: moela cozida, mandioca, brócolis',
        ],
        quickTags: ['Patinho Moído', 'Tilápia', 'Moela', 'Macarrão', 'Legumes no vapor'],
      },
    ];
  }

  // 4 refeições padrão
  return [
    {
      id: 0,
      name: 'Café da Manhã',
      time: '07:30',
      icon: '🍳',
      defaultOptions: [
        'Ovos inteiros mexidos, aveia em flocos, café sem açúcar',
        'Pão integral com ovos mexidos, 1 maçã ou mamão',
        'Crepioca (ovos + goma de tapioca), café preto sem açúcar',
      ],
      placeholders: [
        'Opção 1: Ex: ovos mexidos, aveia em flocos, café',
        'Opção 2: Ex: pão integral com ovos, fruta',
        'Opção 3: Ex: crepioca, café preto',
      ],
      quickTags: ['Ovos Inteiros', 'Aveia em Flocos', 'Pão Integral', '1 Banana', 'Café sem açúcar'],
    },
    {
      id: 1,
      name: 'Almoço Principal',
      time: '12:30',
      icon: '🍗',
      defaultOptions: [
        'Peito de frango grelhado, arroz branco, feijão carioca, salada verde',
        'Filé mignon ou carne moída (patinho), batata-doce na balança, salada',
        'Filé de tilápia grelhado, arroz branco ou macarrão, brócolis no vapor',
      ],
      placeholders: [
        'Opção 1: Ex: peito de frango, arroz, feijão, salada',
        'Opção 2: Ex: filé mignon, batata-doce, salada',
        'Opção 3: Ex: tilápia grelhada, macarrão, brócolis',
      ],
      quickTags: ['Peito de Frango', 'Filé Mignon', 'Tilápia', 'Arroz Branco', 'Feijão', 'Salada Verde'],
    },
    {
      id: 2,
      name: 'Café / Lanche da Tarde',
      time: '16:30',
      icon: '☕',
      defaultOptions: [
        'Frango desfiado na balança, batata-doce cozida',
        'Ovos inteiros cozidos, aveia em flocos, 1 fruta fresca',
        'Shake proteico isolado com aveia e castanhas do Pará',
      ],
      placeholders: [
        'Opção 1: Ex: frango desfiado com batata-doce',
        'Opção 2: Ex: ovos cozidos com aveia e fruta',
        'Opção 3: Ex: shake proteico com castanhas',
      ],
      quickTags: ['Frango Desfiado', 'Ovos Mexidos', 'Batata-Doce', 'Castanhas', 'Aveia em Flocos'],
    },
    {
      id: 3,
      name: 'Jantar',
      time: '20:00',
      icon: '🥩',
      defaultOptions: [
        'Patinho moído refogado, mandioca ou arroz, legumes no vapor',
        'Peito de frango grelhado, batata inglesa cozida, legumes',
        'Moela cozida ou tilápia grelhada, macarrão cozido, salada com azeite',
      ],
      placeholders: [
        'Opção 1: Ex: patinho moído, mandioca, legumes',
        'Opção 2: Ex: frango grelhado, batata inglesa, salada',
        'Opção 3: Ex: moela cozida ou tilápia, macarrão',
      ],
      quickTags: ['Patinho Moído', 'Tilápia', 'Moela', 'Macarrão', 'Mandioca', 'Legumes no vapor'],
    },
  ];
};

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
  const [mealOptionChoices, setMealOptionChoices] = useState<Record<string, [string, string, string]>>({});
  const [draftFoodInputs, setDraftFoodInputs] = useState<Record<string, string>>({});
  const [focusedOptionIdx, setFocusedOptionIdx] = useState<Record<number, 0 | 1 | 2>>({});

  const getOptionValue = (mCount: number, slotId: number, optIdx: 0 | 1 | 2): string => {
    const key = `${mCount}_${slotId}`;
    if (mealOptionChoices[key]?.[optIdx] !== undefined) {
      return mealOptionChoices[key][optIdx];
    }
    const slots = getMealSlotsForCount(mCount);
    const slot = slots.find((s) => s.id === slotId);
    return slot?.defaultOptions[optIdx] ?? '';
  };

  const getOptionItems = (mCount: number, slotId: number, optIdx: 0 | 1 | 2): string[] => {
    const val = getOptionValue(mCount, slotId, optIdx);
    if (!val.trim()) return [];
    return val
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const updateOptionValue = (mCount: number, slotId: number, optIdx: 0 | 1 | 2, newValue: string) => {
    const key = `${mCount}_${slotId}`;
    setMealOptionChoices((prev) => {
      const current: [string, string, string] = [
        getOptionValue(mCount, slotId, 0),
        getOptionValue(mCount, slotId, 1),
        getOptionValue(mCount, slotId, 2),
      ];
      current[optIdx] = newValue;
      return { ...prev, [key]: current };
    });
  };

  const handleRemoveFoodItem = (slotId: number, optIdx: 0 | 1 | 2, itemIdx: number) => {
    const items = getOptionItems(mealsCount, slotId, optIdx);
    if (itemIdx >= 0 && itemIdx < items.length) {
      items.splice(itemIdx, 1);
    }
    updateOptionValue(mealsCount, slotId, optIdx, items.join(', '));
  };

  const handleRemoveLastFoodItem = (slotId: number, optIdx: 0 | 1 | 2) => {
    const items = getOptionItems(mealsCount, slotId, optIdx);
    if (items.length > 0) {
      items.pop();
    }
    updateOptionValue(mealsCount, slotId, optIdx, items.join(', '));
  };

  const handleClearOption = (slotId: number, optIdx: 0 | 1 | 2) => {
    updateOptionValue(mealsCount, slotId, optIdx, '');
  };

  const handleAddFoodItem = (slotId: number, optIdx: 0 | 1 | 2, rawText: string) => {
    const cleanText = rawText.trim();
    if (!cleanText) return;
    const newItems = cleanText
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const currentItems = getOptionItems(mealsCount, slotId, optIdx);
    newItems.forEach((it) => {
      if (!currentItems.some((existing) => existing.toLowerCase() === it.toLowerCase())) {
        currentItems.push(it);
      }
    });
    updateOptionValue(mealsCount, slotId, optIdx, currentItems.join(', '));
    setDraftFoodInputs((prev) => ({ ...prev, [`${mealsCount}_${slotId}_${optIdx}`]: '' }));
  };

  const handleAddTagToMealOption = (slotId: number, tag: string) => {
    const targetIdx = focusedOptionIdx[slotId] !== undefined ? focusedOptionIdx[slotId] : 0;
    handleAddFoodItem(slotId, targetIdx, tag);
  };

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

    // Configurações e as 3 opções de cada refeição escolhidas pelo aluno
    const currentSlots = getMealSlotsForCount(mealsCount);
    const optionPlans = [0, 1, 2].map((optIdx) => ({
      optionNumber: (optIdx + 1) as 1 | 2 | 3,
      meals: currentSlots.map((slot) => ({
        mealIndex: slot.id + 1,
        name: slot.name,
        timeSuggestion: slot.time,
        userFoods: getOptionValue(mealsCount, slot.id, optIdx as 0 | 1 | 2).trim(),
      })),
    }));

    // GERAÇÃO MATEMÁTICA 100% FIEL ÀS ESCOLHAS DO ALUNO
    // Calcula as gramaturas exatas na balança para cada refeição de cada opção escolhida
    const optColors = ['var(--primary)', '#FFD700', '#ff3333'];
    const optRgb: [number, number, number][] = [
      [0, 255, 0],
      [255, 215, 0],
      [255, 51, 51],
    ];
    const optTitles = [
      'Opção 1: Seu Cardápio Principal (Escolha 1)',
      'Opção 2: Sua Variação Estratégica (Escolha 2)',
      'Opção 3: Sua Rotação Prática (Escolha 3)',
    ];

    const generatedOptions = [0, 1, 2].map((optIdx) => {
      const mealsList = currentSlots.map((slot) => {
        const userText = getOptionValue(mealsCount, slot.id, optIdx as 0 | 1 | 2).trim();
        const items = parseAndCalculateMealItems(userText, pMeal, cMeal, fatGrams / mealsCount, slot.id + optIdx);
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
        const o1 = mealOptionChoices[s.id]?.[0] || s.defaultOptions[0];
        const o2 = mealOptionChoices[s.id]?.[1] || s.defaultOptions[1];
        const o3 = mealOptionChoices[s.id]?.[2] || s.defaultOptions[2];
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
        <p>Inteligência Nutricional & Protocolo Fitness Personalizado.</p>
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

          {/* SELEÇÃO PERSONALIZADA POR REFEIÇÃO */}
          <div style={{ marginTop: '20px', marginBottom: '10px' }}>
            <div style={{ marginBottom: '14px' }}>
              <span style={{ fontSize: '14px', fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
                🍽️ O Que Você Quer Comer em Cada Refeição?
              </span>
              <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '4px 0 0 0', lineHeight: 1.45 }}>
                Digite livremente o que deseja comer em cada uma das suas <strong>{mealsCount} refeições</strong>. O app vai calcular as quantidades e pesagens exatas na balança para bater suas metas!
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {getMealSlotsForCount(mealsCount).map((slot) => {
                const optConfigs: { idx: 0 | 1 | 2; label: string; color: string; border: string }[] = [
                  { idx: 0, label: '🟢 Opção 1 (Cardápio Principal)', color: 'var(--primary)', border: 'rgba(0, 255, 0, 0.3)' },
                  { idx: 1, label: '🟡 Opção 2 (Variação Estratégica)', color: '#FFD700', border: 'rgba(255, 215, 0, 0.3)' },
                  { idx: 2, label: '🔴 Opção 3 (Rotação Prática)', color: '#ff5555', border: 'rgba(255, 85, 85, 0.3)' },
                ];

                const currentFocusedOpt = focusedOptionIdx[slot.id] !== undefined ? focusedOptionIdx[slot.id] : 0;

                return (
                  <div
                    key={slot.id}
                    style={{
                      background: '#121212',
                      border: '1px solid #242424',
                      borderRadius: '8px',
                      padding: '14px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                        borderBottom: '1px solid #1c1c1c',
                        paddingBottom: '8px',
                      }}
                    >
                      <label
                        style={{
                          fontSize: '13px',
                          fontWeight: 'bold',
                          color: '#fff',
                          margin: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>{slot.icon}</span>
                        <span>Refeição {slot.id + 1}: {slot.name}</span>
                      </label>
                      <span style={{ fontSize: '11px', color: '#00d0ff', fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {slot.time}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {optConfigs.map((cfg) => {
                        const items = getOptionItems(mealsCount, slot.id, cfg.idx);
                        const draftKey = `${mealsCount}_${slot.id}_${cfg.idx}`;
                        const draftVal = draftFoodInputs[draftKey] || '';
                        const isFocused = currentFocusedOpt === cfg.idx;

                        return (
                          <div
                            key={cfg.idx}
                            onClick={() => setFocusedOptionIdx((prev) => ({ ...prev, [slot.id]: cfg.idx }))}
                            style={{
                              background: isFocused ? '#171717' : '#141414',
                              border: `1px solid ${isFocused ? cfg.color : '#262626'}`,
                              borderRadius: '6px',
                              padding: '10px 12px',
                              cursor: 'pointer',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '8px',
                                flexWrap: 'wrap',
                                gap: '6px',
                              }}
                            >
                              <span style={{ fontSize: '11px', color: cfg.color, fontWeight: 'bold' }}>
                                {cfg.label}
                              </span>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  disabled={items.length === 0}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveLastFoodItem(slot.id, cfg.idx);
                                  }}
                                  title="Apagar o último alimento adicionado nesta opção"
                                  style={{
                                    background: items.length === 0 ? '#1c1c1c' : 'rgba(255, 170, 0, 0.15)',
                                    border: `1px solid ${items.length === 0 ? '#2a2a2a' : '#ffaa00'}`,
                                    color: items.length === 0 ? '#555' : '#ffaa00',
                                    fontSize: '11px',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    cursor: items.length === 0 ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <span>⌫</span> Apagar Último
                                </button>
                                <button
                                  type="button"
                                  disabled={items.length === 0}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleClearOption(slot.id, cfg.idx);
                                  }}
                                  title="Limpar todos os alimentos desta opção para começar do zero"
                                  style={{
                                    background: items.length === 0 ? '#1c1c1c' : 'rgba(255, 50, 50, 0.15)',
                                    border: `1px solid ${items.length === 0 ? '#2a2a2a' : '#ff5555'}`,
                                    color: items.length === 0 ? '#555' : '#ff5555',
                                    fontSize: '11px',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    cursor: items.length === 0 ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <span>🗑️</span> Limpar
                                </button>
                              </div>
                            </div>

                            {/* Chips de Alimentos com botão individual [✕] */}
                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '6px',
                                marginBottom: '8px',
                                minHeight: '28px',
                                alignItems: 'center',
                              }}
                            >
                              {items.map((it, itIdx) => (
                                <span
                                  key={itIdx}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: '#222222',
                                    border: `1px solid ${cfg.border}`,
                                    color: '#eee',
                                    fontSize: '12px',
                                    padding: '4px 8px',
                                    borderRadius: '5px',
                                  }}
                                >
                                  <span>{it}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveFoodItem(slot.id, cfg.idx, itIdx);
                                    }}
                                    title={`Remover "${it}"`}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#ff6666',
                                      cursor: 'pointer',
                                      padding: '0 2px',
                                      fontSize: '13px',
                                      fontWeight: 'bold',
                                      lineHeight: 1,
                                    }}
                                  >
                                    ✕
                                  </button>
                                </span>
                              ))}
                              {items.length === 0 && (
                                <span style={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
                                  Nenhum alimento nesta opção. Digite abaixo ou toque nas sugestões.
                                </span>
                              )}
                            </div>

                            {/* Digitação rápida de alimento */}
                            <div
                              style={{ display: 'flex', gap: '6px' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="text"
                                value={draftVal}
                                onFocus={() => setFocusedOptionIdx((prev) => ({ ...prev, [slot.id]: cfg.idx }))}
                                onChange={(e) =>
                                  setDraftFoodInputs((prev) => ({ ...prev, [draftKey]: e.target.value }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddFoodItem(slot.id, cfg.idx, draftVal);
                                  }
                                }}
                                className="form-control"
                                placeholder={slot.placeholders[cfg.idx]}
                                style={{
                                  margin: 0,
                                  fontSize: '12px',
                                  padding: '7px 10px',
                                  flex: 1,
                                  borderColor: isFocused ? cfg.color : '#2d2d2d',
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => handleAddFoodItem(slot.id, cfg.idx, draftVal)}
                                style={{
                                  background: cfg.color,
                                  color: '#000',
                                  fontWeight: 'bold',
                                  fontSize: '11px',
                                  padding: '0 12px',
                                  border: 'none',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                + Adicionar
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Tags Rápidas de Sugestão */}
                    <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #1a1a1a' }}>
                      <span style={{ fontSize: '10px', color: '#777', display: 'block', marginBottom: '5px' }}>
                        Toque para adicionar à <strong>{optConfigs[currentFocusedOpt]?.label.split(' ')[1]} {optConfigs[currentFocusedOpt]?.label.split(' ')[2]}</strong>:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {slot.quickTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleAddTagToMealOption(slot.id, tag)}
                            style={{
                              background: '#1a1a1a',
                              border: '1px solid #333',
                              color: '#999',
                              fontSize: '11px',
                              padding: '3px 7px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                          >
                            + {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Gorduras Boas: Alocação Automática Inteligente */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid #222',
              borderRadius: '6px',
              padding: '12px 14px',
              marginTop: '8px',
              marginBottom: '10px',
              fontSize: '12px',
              lineHeight: '1.45',
            }}
          >
            <strong style={{ color: '#00d0ff', display: 'block', marginBottom: '4px', fontSize: '12px' }}>
              🥑 Gorduras Boas: Alocação Automática de Precisão (0.9g/kg)
            </strong>
            <span style={{ color: '#a0a0a0' }}>
              Você só escolhe o que quer comer nas caixas acima! Nosso sistema distribui automaticamente fontes puras e saudáveis (Azeite Extravirgem, Castanhas e Gemas) nas suas refeições para fechar sua meta com máxima precisão metabólica.
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
                Seu Plano Alimentar Personalizado
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

              {/* CHECKLIST DIÁRIO DE HÁBITOS (ÁGUA & REFEIÇÕES) */}
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
                          📋 Checklist Diário de Hábitos
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
          </div>
        )
      )}
    </div>
  );
}
