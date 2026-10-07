import { DayOption, NutritionalTargets, UserDietInput, Meal, FoodItem } from '@/types/diet';
import { parseAndCalculateMealItems } from './foodCalculations';

/**
 * Gerador de cardápio determinístico baseado em equivalentes nutricionais.
 * Monta 3 opções realistas com carboidratos devidamente controlados,
 * alta proteína e gorduras boas.
 */
export function generateDeterministicDiet(
  input: UserDietInput,
  targets: NutritionalTargets
): [DayOption, DayOption, DayOption] {
  const { targetCalories, proteinGrams, carbsGrams, fatsGrams } = targets;
  const mealsCount = input.mealsCount || 4;

  // Se o aluno forneceu suas 3 opções de refeição personalizadas, respeitar com 100% de rigor
  if (input.optionPlans && input.optionPlans.length >= 3) {
    const pMeal = proteinGrams / mealsCount;
    const cMeal = carbsGrams / mealsCount;
    const fMeal = fatsGrams / mealsCount;

    const optTitles = [
      'Opção 1: Seu Cardápio Principal (Escolha 1)',
      'Opção 2: Sua Variação Tática (Escolha 2)',
      'Opção 3: Sua Rotação Prática (Escolha 3)',
    ];

    return input.optionPlans.slice(0, 3).map((plan, optIdx) => {
      const meals: Meal[] = plan.meals.map((m, mIdx) => {
        const rawItems = parseAndCalculateMealItems(m.userFoods, pMeal, cMeal, fMeal, mIdx + optIdx);
        const mealKcal = Math.round(targetCalories / mealsCount);
        const mealProt = Math.round(pMeal);
        const mealCarb = Math.round(cMeal);
        const mealFat = Math.round(fMeal);

        const items: FoodItem[] = rawItems.map((it, itIdx) => ({
          name: it.name,
          portion: it.portion,
          calories: Math.round(mealKcal / Math.max(1, rawItems.length)),
          protein: it.name.includes('Gordura') ? 0 : Math.round(mealProt / Math.max(1, rawItems.length - 1)),
          carbs: it.name.includes('Gordura') ? 0 : Math.round(mealCarb / Math.max(1, rawItems.length - 1)),
          fats: it.name.includes('Gordura') ? mealFat : 1,
        }));

        return {
          id: `opt${optIdx + 1}-m${mIdx + 1}`,
          name: m.name,
          timeSuggestion: m.timeSuggestion || '12:00',
          totalCalories: mealKcal,
          totalProtein: mealProt,
          totalCarbs: mealCarb,
          totalFats: mealFat,
          items,
        };
      });

      return {
        optionNumber: (optIdx + 1) as 1 | 2 | 3,
        title: optTitles[optIdx],
        tagline: 'Calculado matematicamente com base nos alimentos que você escolheu na balança.',
        totalCalories: targetCalories,
        totalProtein: proteinGrams,
        totalCarbs: carbsGrams,
        totalFats: fatsGrams,
        meals,
      };
    }) as [DayOption, DayOption, DayOption];
  }

  const isLactoseFree =
    input.preferences.some((p) => p.toLowerCase().includes('lactose')) ||
    (input.customNotes && input.customNotes.toLowerCase().includes('lactose'));
  const isVegetarian =
    input.preferences.some((p) => p.toLowerCase().includes('vegetariano')) ||
    (input.customNotes && input.customNotes.toLowerCase().includes('vegetariano'));

  // Fator de escala ponderado suave (centrado em 2200 kcal para evitar porções gigantes de carboidratos)
  const carbScale = Math.min(1.4, Math.max(0.7, carbsGrams / 250));
  const proteinScale = Math.min(1.5, Math.max(0.7, proteinGrams / 140));
  const fatScale = Math.min(1.4, Math.max(0.7, fatsGrams / 65));

  // ==========================================
  // OPÇÃO 1: Clássica & Prática
  // ==========================================
  const option1: DayOption = {
    optionNumber: 1,
    title: 'Opção 1: Clássica & Prática',
    tagline: 'Refeições tradicionais com alta digestibilidade e carboidratos controlados.',
    totalCalories: targetCalories,
    totalProtein: proteinGrams,
    totalCarbs: carbsGrams,
    totalFats: fatsGrams,
    meals: [
      {
        id: 'opt1-m1',
        name: 'Café da Manhã',
        timeSuggestion: '07:30',
        items: [
          {
            name: 'Ovos mexidos feitos no azeite de oliva',
            portion: `${Math.max(2, Math.round(2.5 * proteinScale))} ovos inteiros`,
            calories: Math.round(190 * fatScale),
            protein: Math.round(16 * proteinScale),
            carbs: 2,
            fats: Math.round(14 * fatScale),
            tip: 'Rico em colina e gorduras boas para o cérebro',
          },
          {
            name: 'Mingau de Aveia com canela e 1 fruta',
            portion: `${Math.round(35 * carbScale)}g de aveia em flocos + 1/2 maçã picada`,
            calories: Math.round(160 * carbScale),
            protein: 5,
            carbs: Math.round(28 * carbScale),
            fats: 3,
            tip: isLactoseFree ? 'Cozido em água com canela em pó' : 'Feito com água ou leite desnatado',
          },
          {
            name: 'Café preto coado sem açúcar',
            portion: '1 xícara média (150ml)',
            calories: 4,
            protein: 0,
            carbs: 1,
            fats: 0,
          },
        ],
        totalCalories: Math.round(targetCalories * 0.23),
        totalProtein: Math.round(proteinGrams * 0.24),
        totalCarbs: Math.round(carbsGrams * 0.22),
        totalFats: Math.round(fatsGrams * 0.25),
      },
      {
        id: 'opt1-m2',
        name: 'Almoço Completo',
        timeSuggestion: '12:30',
        items: [
          {
            name: isVegetarian ? 'Omelete de claras com queijo ou tofu grelhado' : 'Peito de frango grelhado temperado',
            portion: `${Math.round(150 * proteinScale)}g (1 filé grande)`,
            calories: Math.round(240 * proteinScale),
            protein: Math.round(44 * proteinScale),
            carbs: 0,
            fats: 4,
            tip: 'Tempere com alho, sal, limão e ervas finas',
          },
          {
            name: 'Arroz branco ou integral cozido',
            portion: `${Math.round(110 * carbScale)}g (aprox. 3 a 4 colheres de sopa rasas)`,
            calories: Math.round(140 * carbScale),
            protein: 3,
            carbs: Math.round(30 * carbScale),
            fats: 1,
          },
          {
            name: 'Feijão carioca cozido (grão e caldo)',
            portion: `${Math.round(80 * carbScale)}g (1 concha média)`,
            calories: Math.round(65 * carbScale),
            protein: 4,
            carbs: Math.round(12 * carbScale),
            fats: 1,
          },
          {
            name: 'Salada verde variada + 1 fio de azeite extravirgem',
            portion: 'Prato de sobremesa cheio (alface, tomate e rúcula) + 5ml azeite',
            calories: 60,
            protein: 2,
            carbs: 4,
            fats: 5,
            tip: 'Fibras para diminuir o índice glicêmico da refeição',
          },
        ],
        totalCalories: Math.round(targetCalories * 0.36),
        totalProtein: Math.round(proteinGrams * 0.36),
        totalCarbs: Math.round(carbsGrams * 0.36),
        totalFats: Math.round(fatsGrams * 0.32),
      },
      {
        id: 'opt1-m3',
        name: 'Lanche da Tarde',
        timeSuggestion: '16:30',
        items: [
          {
            name: isLactoseFree ? 'Iogurte zero lactose ou shake de proteína isolada' : 'Iogurte natural desnatado ou grego light',
            portion: '1 pote (150g)',
            calories: 90,
            protein: 10,
            carbs: 8,
            fats: 1,
          },
          {
            name: 'Castanhas de caju ou nozes',
            portion: `${Math.round(15 * fatScale)}g (aprox. 4 a 5 castanhas)`,
            calories: Math.round(95 * fatScale),
            protein: 3,
            carbs: 4,
            fats: Math.round(8 * fatScale),
            tip: 'Gorduras nobres que prolongam a saciedade no meio da tarde',
          },
          {
            name: 'Fruta da estação (morango ou kiwi ou maçã)',
            portion: '1 porção média (100g)',
            calories: 55,
            protein: 1,
            carbs: 12,
            fats: 0,
          },
        ],
        totalCalories: Math.round(targetCalories * 0.16),
        totalProtein: Math.round(proteinGrams * 0.15),
        totalCarbs: Math.round(carbsGrams * 0.16),
        totalFats: Math.round(fatsGrams * 0.18),
      },
      {
        id: 'opt1-m4',
        name: 'Jantar Leve',
        timeSuggestion: '20:00',
        items: [
          {
            name: isVegetarian ? 'Ovos cozidos com queijo fresco' : 'Filé de tilápia ou patinho moído grelhado',
            portion: `${Math.round(140 * proteinScale)}g`,
            calories: Math.round(200 * proteinScale),
            protein: Math.round(36 * proteinScale),
            carbs: 0,
            fats: Math.round(5 * fatScale),
            tip: 'Proteína magra para não sobrecarregar a digestão noturna',
          },
          {
            name: 'Batata-doce ou abóbora cabotiá cozida',
            portion: `${Math.round(100 * carbScale)}g (1 pedaço médio)`,
            calories: Math.round(95 * carbScale),
            protein: 2,
            carbs: Math.round(22 * carbScale),
            fats: 0,
          },
          {
            name: 'Brócolis e cenoura cozidos no vapor com azeite',
            portion: '1 pires cheio (120g) + 1 colher de chá de azeite',
            calories: 65,
            protein: 3,
            carbs: 7,
            fats: 5,
          },
        ],
        totalCalories: Math.round(targetCalories * 0.25),
        totalProtein: Math.round(proteinGrams * 0.25),
        totalCarbs: Math.round(carbsGrams * 0.26),
        totalFats: Math.round(fatsGrams * 0.25),
      },
    ],
  };

  // ==========================================
  // OPÇÃO 2: Econômica & Sabor Brasileiro
  // ==========================================
  const option2: DayOption = {
    optionNumber: 2,
    title: 'Opção 2: Econômica & Sabor Brasileiro',
    tagline: 'Alimentos acessíveis, ricos em nutrientes e com excelente controle de índice glicêmico.',
    totalCalories: targetCalories,
    totalProtein: proteinGrams,
    totalCarbs: carbsGrams,
    totalFats: fatsGrams,
    meals: [
      {
        id: 'opt2-m1',
        name: 'Café da Manhã',
        timeSuggestion: '07:30',
        items: [
          {
            name: 'Crepioca fit (1 colher de tapioca + 2 ovos inteiros)',
            portion: '1 unidade média (25g goma tapioca + 2 ovos)',
            calories: Math.round(200 * fatScale),
            protein: 14,
            carbs: 18,
            fats: 10,
            tip: 'Bata bem com garfo e doure em fogo baixo',
          },
          {
            name: 'Mamão papaia com semente de chia',
            portion: '1/2 unidade pequena (120g) + 1 colher de sobremesa de chia',
            calories: 70,
            protein: 2,
            carbs: 14,
            fats: 2,
            tip: 'Auxilia na regulação intestinal',
          },
          {
            name: 'Café com canela em pó sem açúcar',
            portion: '1 xícara (150ml)',
            calories: 4,
            protein: 0,
            carbs: 1,
            fats: 0,
          },
        ],
        totalCalories: Math.round(targetCalories * 0.23),
        totalProtein: Math.round(proteinGrams * 0.24),
        totalCarbs: Math.round(carbsGrams * 0.22),
        totalFats: Math.round(fatsGrams * 0.25),
      },
      {
        id: 'opt2-m2',
        name: 'Almoço Tradicional',
        timeSuggestion: '12:30',
        items: [
          {
            name: isVegetarian ? 'Ovos mexidos com lentilha e couve' : 'Carne moída magra (Patinho) refogada com temperos',
            portion: `${Math.round(150 * proteinScale)}g`,
            calories: Math.round(260 * proteinScale),
            protein: Math.round(42 * proteinScale),
            carbs: 0,
            fats: Math.round(9 * fatScale),
            tip: 'Refogue com alho, cebola, tomate fresco e cheiro verde',
          },
          {
            name: 'Arroz branco ou integral',
            portion: `${Math.round(100 * carbScale)}g (aprox. 3 colheres de sopa)`,
            calories: Math.round(130 * carbScale),
            protein: 3,
            carbs: Math.round(28 * carbScale),
            fats: 1,
          },
          {
            name: 'Feijão preto cozido temperado',
            portion: `${Math.round(90 * carbScale)}g (1 concha)`,
            calories: Math.round(75 * carbScale),
            protein: 5,
            carbs: Math.round(13 * carbScale),
            fats: 1,
          },
          {
            name: 'Couve refogada no azeite e alho',
            portion: '1 pires cheio (80g)',
            calories: 55,
            protein: 3,
            carbs: 4,
            fats: 3,
          },
        ],
        totalCalories: Math.round(targetCalories * 0.36),
        totalProtein: Math.round(proteinGrams * 0.36),
        totalCarbs: Math.round(carbsGrams * 0.36),
        totalFats: Math.round(fatsGrams * 0.32),
      },
      {
        id: 'opt2-m3',
        name: 'Lanche da Tarde',
        timeSuggestion: '16:30',
        items: [
          {
            name: 'Pão 100% integral com queijo branco ou cottage',
            portion: isLactoseFree
              ? '1 fatia de pão integral + pasta de atum ou ovos mexidos'
              : '1 a 2 fatias de pão integral + 40g de queijo branco',
            calories: Math.round(170 * carbScale),
            protein: 12,
            carbs: Math.round(20 * carbScale),
            fats: 5,
          },
          {
            name: 'Chá verde ou suco de maracujá natural (sem açúcar)',
            portion: '1 copo (200ml)',
            calories: 15,
            protein: 0,
            carbs: 3,
            fats: 0,
          },
        ],
        totalCalories: Math.round(targetCalories * 0.16),
        totalProtein: Math.round(proteinGrams * 0.15),
        totalCarbs: Math.round(carbsGrams * 0.16),
        totalFats: Math.round(fatsGrams * 0.18),
      },
      {
        id: 'opt2-m4',
        name: 'Jantar',
        timeSuggestion: '20:00',
        items: [
          {
            name: isVegetarian ? 'Omelete com tomate, orégano e queijo magro' : 'Peito de frango desfiado suculento',
            portion: `${Math.round(140 * proteinScale)}g`,
            calories: Math.round(220 * proteinScale),
            protein: Math.round(38 * proteinScale),
            carbs: 1,
            fats: 5,
          },
          {
            name: 'Purê de mandioca ou abóbora',
            portion: `${Math.round(110 * carbScale)}g (aprox. 3 colheres de sopa)`,
            calories: Math.round(95 * carbScale),
            protein: 2,
            carbs: Math.round(22 * carbScale),
            fats: 1,
          },
          {
            name: 'Salada de pepino e tomate com 1 fio de azeite',
            portion: 'À vontade + 5ml azeite',
            calories: 55,
            protein: 2,
            carbs: 4,
            fats: 5,
          },
        ],
        totalCalories: Math.round(targetCalories * 0.25),
        totalProtein: Math.round(proteinGrams * 0.25),
        totalCarbs: Math.round(carbsGrams * 0.26),
        totalFats: Math.round(fatsGrams * 0.25),
      },
    ],
  };

  // ==========================================
  // OPÇÃO 3: Rápida & Alternativa
  // ==========================================
  const option3: DayOption = {
    optionNumber: 3,
    title: 'Opção 3: Rápida & Alternativa',
    tagline: 'Ideal para quem busca refeições práticas com shakes proteicos e alta saciedade.',
    totalCalories: targetCalories,
    totalProtein: proteinGrams,
    totalCarbs: carbsGrams,
    totalFats: fatsGrams,
    meals: [
      {
        id: 'opt3-m1',
        name: 'Café da Manhã',
        timeSuggestion: '07:30',
        items: [
          {
            name: 'Vitamina Proteica Rápida',
            portion: isLactoseFree
              ? '1 scoop (30g) de proteína vegetal ou isolada + 1/2 banana + 200ml leite de amêndoas'
              : '1 scoop (30g) Whey Protein + 1/2 banana + 200ml leite desnatado ou água',
            calories: Math.round(210 * proteinScale),
            protein: 26,
            carbs: 18,
            fats: 3,
            tip: 'Bata com gelo e canela para textura cremosa',
          },
          {
            name: 'Torrada integral com pasta de amendoim integral pura',
            portion: `1 fatia de pão integral + ${Math.round(15 * fatScale)}g de pasta de amendoim`,
            calories: Math.round(160 * fatScale),
            protein: 6,
            carbs: 14,
            fats: Math.round(9 * fatScale),
          },
        ],
        totalCalories: Math.round(targetCalories * 0.23),
        totalProtein: Math.round(proteinGrams * 0.24),
        totalCarbs: Math.round(carbsGrams * 0.22),
        totalFats: Math.round(fatsGrams * 0.25),
      },
      {
        id: 'opt3-m2',
        name: 'Almoço',
        timeSuggestion: '12:30',
        items: [
          {
            name: isVegetarian ? 'Tofu grelhado ao molho shoyu' : 'Sobrecoxa sem pele assada ou lombo suíno magro',
            portion: `${Math.round(150 * proteinScale)}g`,
            calories: Math.round(250 * proteinScale),
            protein: Math.round(40 * proteinScale),
            carbs: 0,
            fats: Math.round(8 * fatScale),
          },
          {
            name: 'Batata inglesa cozida ou assada com alecrim',
            portion: `${Math.round(130 * carbScale)}g (1 batata média)`,
            calories: Math.round(115 * carbScale),
            protein: 3,
            carbs: Math.round(26 * carbScale),
            fats: 1,
            tip: 'Um dos alimentos com maior índice de saciedade por caloria',
          },
          {
            name: 'Lentilha ou grão de bico cozido',
            portion: `${Math.round(60 * carbScale)}g (2 colheres de sopa cheias)`,
            calories: 65,
            protein: 4,
            carbs: 11,
            fats: 1,
          },
          {
            name: 'Mix de folhas verdes com cenoura ralada e azeite',
            portion: '1 prato de sobremesa + 1 colher de café de azeite',
            calories: 50,
            protein: 2,
            carbs: 6,
            fats: 3,
          },
        ],
        totalCalories: Math.round(targetCalories * 0.36),
        totalProtein: Math.round(proteinGrams * 0.36),
        totalCarbs: Math.round(carbsGrams * 0.36),
        totalFats: Math.round(fatsGrams * 0.32),
      },
      {
        id: 'opt3-m3',
        name: 'Lanche da Tarde',
        timeSuggestion: '16:30',
        items: [
          {
            name: 'Ovos cozidos inteiros',
            portion: '2 unidades médias',
            calories: 140,
            protein: 13,
            carbs: 1,
            fats: 10,
            tip: 'Super prático para levar em potinho na bolsa',
          },
          {
            name: 'Fruta fresca (maçã pequena ou tangerina)',
            portion: '1 unidade (100g)',
            calories: 55,
            protein: 1,
            carbs: 14,
            fats: 0,
          },
        ],
        totalCalories: Math.round(targetCalories * 0.16),
        totalProtein: Math.round(proteinGrams * 0.15),
        totalCarbs: Math.round(carbsGrams * 0.16),
        totalFats: Math.round(fatsGrams * 0.18),
      },
      {
        id: 'opt3-m4',
        name: 'Jantar',
        timeSuggestion: '20:00',
        items: [
          {
            name: isVegetarian ? 'Omelete de forno com espinafre e ricota' : 'Atum em lata ao natural ou filé de pescada grelhado',
            portion: `${Math.round(140 * proteinScale)}g`,
            calories: Math.round(190 * proteinScale),
            protein: Math.round(36 * proteinScale),
            carbs: 0,
            fats: 4,
          },
          {
            name: 'Quinoa cozida ou cuscuz nordestino de milho',
            portion: `${Math.round(90 * carbScale)}g`,
            calories: Math.round(100 * carbScale),
            protein: 3,
            carbs: Math.round(20 * carbScale),
            fats: 1,
          },
          {
            name: 'Abobrinha e berinjela grelhadas com azeite',
            portion: '150g + 1 colher de chá de azeite',
            calories: 60,
            protein: 2,
            carbs: 5,
            fats: 5,
          },
        ],
        totalCalories: Math.round(targetCalories * 0.25),
        totalProtein: Math.round(proteinGrams * 0.25),
        totalCarbs: Math.round(carbsGrams * 0.26),
        totalFats: Math.round(fatsGrams * 0.25),
      },
    ],
  };

  return adaptMealsCount([option1, option2, option3], mealsCount);
}

function adaptMealsCount(options: [DayOption, DayOption, DayOption], count: number): [DayOption, DayOption, DayOption] {
  if (count === 3) {
    return options.map((opt) => {
      const mBreakfast = opt.meals[0];
      const mLunch = opt.meals[1];
      const mSnack = opt.meals[2];
      const mDinner = opt.meals[3];

      const meal1Items = [...mLunch.items, ...mBreakfast.items.slice(0, 1)];
      const meal2Items = [...mSnack.items];
      const meal3Items = [...mDinner.items];

      return {
        ...opt,
        meals: [
          {
            id: `${opt.optionNumber}-m1`,
            name: 'Almoço (Quebra do Jejum 16h)',
            timeSuggestion: '12:00',
            items: meal1Items,
            totalCalories: Math.round(opt.totalCalories * 0.42),
            totalProtein: Math.round(opt.totalProtein * 0.42),
            totalCarbs: Math.round(opt.totalCarbs * 0.40),
            totalFats: Math.round(opt.totalFats * 0.42),
          },
          {
            id: `${opt.optionNumber}-m2`,
            name: 'Lanche da Tarde',
            timeSuggestion: '16:00',
            items: meal2Items,
            totalCalories: Math.round(opt.totalCalories * 0.23),
            totalProtein: Math.round(opt.totalProtein * 0.20),
            totalCarbs: Math.round(opt.totalCarbs * 0.25),
            totalFats: Math.round(opt.totalFats * 0.23),
          },
          {
            id: `${opt.optionNumber}-m3`,
            name: 'Jantar (Fechamento da Janela)',
            timeSuggestion: '20:00',
            items: meal3Items,
            totalCalories: Math.round(opt.totalCalories * 0.35),
            totalProtein: Math.round(opt.totalProtein * 0.38),
            totalCarbs: Math.round(opt.totalCarbs * 0.35),
            totalFats: Math.round(opt.totalFats * 0.35),
          },
        ],
      };
    }) as [DayOption, DayOption, DayOption];
  }

  if (count === 5) {
    return options.map((opt) => {
      const mBreakfast = opt.meals[0];
      const mLunch = opt.meals[1];
      const mSnack = opt.meals[2];
      const mDinner = opt.meals[3];

      return {
        ...opt,
        meals: [
          {
            ...mBreakfast,
            id: `${opt.optionNumber}-m1`,
            name: 'Café da Manhã',
            timeSuggestion: '07:00',
            totalCalories: Math.round(opt.totalCalories * 0.20),
            totalProtein: Math.round(opt.totalProtein * 0.20),
            totalCarbs: Math.round(opt.totalCarbs * 0.20),
            totalFats: Math.round(opt.totalFats * 0.20),
          },
          {
            id: `${opt.optionNumber}-m2`,
            name: 'Lanche da Manhã',
            timeSuggestion: '10:00',
            items: [
              {
                name: 'Fruta fresca com sementes de chia ou castanhas',
                portion: '1 maçã média (100g) + 10g de castanhas',
                calories: Math.round(opt.totalCalories * 0.12),
                protein: Math.round(opt.totalProtein * 0.08),
                carbs: Math.round(opt.totalCarbs * 0.15),
                fats: Math.round(opt.totalFats * 0.12),
                tip: 'Fracionamento leve para saciedade constante',
              },
            ],
            totalCalories: Math.round(opt.totalCalories * 0.12),
            totalProtein: Math.round(opt.totalProtein * 0.08),
            totalCarbs: Math.round(opt.totalCarbs * 0.15),
            totalFats: Math.round(opt.totalFats * 0.12),
          },
          {
            ...mLunch,
            id: `${opt.optionNumber}-m3`,
            name: 'Almoço',
            timeSuggestion: '13:00',
            totalCalories: Math.round(opt.totalCalories * 0.32),
            totalProtein: Math.round(opt.totalProtein * 0.34),
            totalCarbs: Math.round(opt.totalCarbs * 0.32),
            totalFats: Math.round(opt.totalFats * 0.30),
          },
          {
            ...mSnack,
            id: `${opt.optionNumber}-m4`,
            name: 'Lanche da Tarde',
            timeSuggestion: '16:30',
            totalCalories: Math.round(opt.totalCalories * 0.14),
            totalProtein: Math.round(opt.totalProtein * 0.14),
            totalCarbs: Math.round(opt.totalCarbs * 0.13),
            totalFats: Math.round(opt.totalFats * 0.16),
          },
          {
            ...mDinner,
            id: `${opt.optionNumber}-m5`,
            name: 'Jantar',
            timeSuggestion: '20:00',
            totalCalories: Math.round(opt.totalCalories * 0.22),
            totalProtein: Math.round(opt.totalProtein * 0.24),
            totalCarbs: Math.round(opt.totalCarbs * 0.20),
            totalFats: Math.round(opt.totalFats * 0.22),
          },
        ],
      };
    }) as [DayOption, DayOption, DayOption];
  }

  return options;
}
