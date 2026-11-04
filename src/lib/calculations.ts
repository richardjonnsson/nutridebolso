import { ActivityLevel, DietGoal, Gender, NutritionalTargets } from '@/types/diet';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, { factor: number; label: string; description: string }> = {
  sedentario: {
    factor: 1.2,
    label: 'Sedentário',
    description: 'Pouco ou nenhum exercício diário (trabalho em escritório/home office)',
  },
  leve: {
    factor: 1.375,
    label: 'Leve (1 a 3x/sem)',
    description: 'Caminhadas ou treinos leves de 1 a 3 dias por semana',
  },
  moderado: {
    factor: 1.55,
    label: 'Moderado (3 a 5x/sem)',
    description: 'Treinos regulares com intensidade média 3 a 5 dias por semana',
  },
  ativo: {
    factor: 1.725,
    label: 'Muito Ativo (6 a 7x/sem)',
    description: 'Treino intenso quase todos os dias ou trabalho fisicamente ativo',
  },
  muito_ativo: {
    factor: 1.9,
    label: 'Atleta / Extremo',
    description: 'Dois treinos por dia ou rotina de alto rendimento físico',
  },
};

export const GOAL_DETAILS: Record<DietGoal, { label: string; diff: number; badge: string; description: string }> = {
  emagrecimento_verao_agressivo: {
    label: 'Déficit Agressivo de Verão (-700 kcal)',
    diff: -700,
    badge: '🔥 RECOMENDADO PROJETO VERÃO',
    description: 'Queima rápida de gordura com alta ingestão de proteínas para secar e definir para o verão sem perder massa magra.',
  },
  emagrecimento_moderado: {
    label: 'Déficit Moderado (-500 kcal)',
    diff: -500,
    badge: '⚡ RITMO SUSTENTÁVEL',
    description: 'Perda de gordura consistente e contínua com déficit calórico tradicional seguro.',
  },
  emagrecimento_extremo: {
    label: 'Corte Acelerado de Verão (-900 kcal)',
    diff: -900,
    badge: '⚠️ MÁXIMA VELOCIDADE',
    description: 'Protocolo de choque de curto prazo para queima acelerada. Exige disciplina estrita e alta ingestão de água.',
  },
  recomposicao: {
    label: 'Recomposição Corporal (Manutenção 0 kcal)',
    diff: 0,
    badge: '⚖️ TONIFICAÇÃO PURA',
    description: 'Consumo igual ao gasto para queimar gordura enquanto tonifica e desenha os músculos.',
  },
  hipertrofia: {
    label: 'Hipertrofia Limpa (+350 kcal)',
    diff: 350,
    badge: '💪 GANHO DE MASSA',
    description: 'Superávit calórico controlado para ganhar volume muscular com o mínimo de retenção de gordura.',
  },
  emagrecimento: {
    label: 'Emagrecimento (-500 kcal)',
    diff: -500,
    badge: '⚡ SUSTENTÁVEL',
    description: 'Déficit calórico padrão de 500 kcal.',
  },
  emagrecimento_agressivo: {
    label: 'Emagrecimento Agressivo (-750 kcal)',
    diff: -750,
    badge: '🔥 AGRESSIVO',
    description: 'Déficit calórico agressivo de 750 kcal.',
  },
};

/**
 * Equação de Mifflin-St Jeor para Taxa Metabólica Basal (TMB):
 * Homens: TMB = (10 x peso em kg) + (6.25 x altura em cm) - (5 x idade em anos) + 5
 * Mulheres: TMB = (10 x peso em kg) + (6.25 x altura em cm) - (5 x idade em anos) - 161
 */
export function calculateTMB(weight: number, height: number, age: number, gender: Gender): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'masculino' ? base + 5 : base - 161;
}

/**
 * Cálculo das Metas Nutricionais completas:
 * 1. TMB (Mifflin-St Jeor) e Gasto Calórico Total (TDEE).
 * 2. Meta calórica com o déficit estratégico de verão selecionado (-700 kcal por padrão).
 * 3. Proteínas: 2.2g por kg (fundamental no déficit agressivo para preservar tecido muscular).
 * 4. Gorduras: 0.85g por kg (essencial para regulação hormonal e absorção de vitaminas).
 * 5. Carboidratos: preenche as calorias restantes para fornecer energia no treino.
 * 6. Meta hídrica: 35 a 40 ml por kg de peso corporal.
 */
export function calculateNutritionalTargets(input: {
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: DietGoal;
}): NutritionalTargets {
  const { weight, height, age, gender, activityLevel, goal } = input;

  const tmb = Math.round(calculateTMB(weight, height, age, gender));
  const activityConfig = ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS.moderado;
  const get = Math.round(tmb * activityConfig.factor);

  const goalConfig = GOAL_DETAILS[goal] || GOAL_DETAILS.emagrecimento_verao_agressivo;
  let targetCalories = get + goalConfig.diff;

  // Piso calórico de segurança para saúde
  const minFloor = gender === 'masculino' ? 1400 : 1200;
  if (targetCalories < minFloor) {
    targetCalories = minFloor;
  }

  // 1. Proteínas: 2.2g/kg (4 kcal/g)
  const proteinGrams = Math.round(weight * 2.2);
  const proteinCalories = proteinGrams * 4;

  // 2. Gorduras: 0.85g/kg (9 kcal/g)
  const fatsGrams = Math.round(weight * 0.85);
  const fatsCalories = fatsGrams * 9;

  // 3. Carboidratos: Restante calórico (4 kcal/g)
  const remainingCalories = targetCalories - (proteinCalories + fatsCalories);
  const carbsCalories = Math.max(30 * 4, remainingCalories); // mínimo de 30g de carbo para função cerebral
  const carbsGrams = Math.round(carbsCalories / 4);

  // Recalcula o total calórico exato da soma dos macros
  const calculatedTotal = proteinCalories + carbsCalories + fatsCalories;

  // Meta Hídrica: 38 ml por kg
  const waterMl = Math.round(weight * 38);

  const proteinPercent = Math.round((proteinCalories / calculatedTotal) * 100);
  const carbsPercent = Math.round((carbsCalories / calculatedTotal) * 100);
  const fatsPercent = Math.round((fatsCalories / calculatedTotal) * 100);

  return {
    tmb,
    get,
    targetCalories: calculatedTotal,
    calorieDiff: goalConfig.diff,
    proteinGrams,
    proteinCalories,
    carbsGrams,
    carbsCalories,
    fatsGrams,
    fatsCalories,
    waterMl,
    proteinPercent,
    carbsPercent,
    fatsPercent,
  };
}
