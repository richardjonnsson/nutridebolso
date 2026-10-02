import { ActivityLevel, DietGoal, Gender, NutritionalTargets, UserDietInput } from '@/types/diet';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, { factor: number; label: string; description: string }> = {
  sedentario: {
    factor: 1.2,
    label: 'Sedentário',
    description: 'Pouco ou nenhum exercício diário',
  },
  leve: {
    factor: 1.375,
    label: 'Leve (1 a 3x/sem)',
    description: 'Exercício leve de 1 a 3 dias na semana',
  },
  moderado: {
    factor: 1.55,
    label: 'Moderado (3 a 5x/sem)',
    description: 'Exercício moderado de 3 a 5 dias por semana',
  },
  ativo: {
    factor: 1.725,
    label: 'Muito Ativo (6 a 7x/sem)',
    description: 'Exercício intenso de 6 a 7 dias por semana',
  },
  muito_ativo: {
    factor: 1.9,
    label: 'Extremamente Ativo',
    description: 'Treinos pesados diários ou trabalho físico intenso',
  },
};

export const GOAL_DETAILS: Record<DietGoal, { label: string; diff: number; description: string }> = {
  hipertrofia: {
    label: 'Hipertrofia (Ganhar Músculo)',
    diff: 400,
    description: 'Superávit calórico (+400 kcal) para estimular ganho de massa magra.',
  },
  emagrecimento: {
    label: 'Emagrecimento Moderado (-500 kcal)',
    diff: -500,
    description: 'Déficit calórico padrão (-500 kcal) para queima consistente de gordura.',
  },
  emagrecimento_agressivo: {
    label: 'Emagrecimento Agressivo (-750 kcal)',
    diff: -750,
    description: 'Déficit calórico maior (-750 kcal) para secar com maior velocidade.',
  },
  recomposicao: {
    label: 'Recomposição Corporal',
    diff: 0,
    description: 'Calorias de manutenção para trocar gordura por massa muscular.',
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
 * Lógica estrita solicitada pelo usuário:
 * 1. Calcule as Calorias Totais (GET) conforme o objetivo (Hipertrofia, Emagrecimento, etc).
 * 2. Calcule a Proteína Diária: 2.2g por kg de peso corporal. (Multiplique por 4 para achar as calorias da proteína).
 * 3. Calcule a Gordura Diária: 0.9g por kg de peso corporal. (Multiplique por 9 para achar as calorias da gordura).
 * 4. Calcule o Carboidrato Diário: Subtraia as calorias da proteína e da gordura do GET. O que sobrar, divida por 4 para achar as gramas de carbo.
 */
export function calculateNutritionalTargets(
  input: Pick<UserDietInput, 'age' | 'weight' | 'height' | 'gender' | 'activityLevel' | 'goal'>
): NutritionalTargets {
  const { weight, height, age, gender, activityLevel, goal } = input;

  // 1. TMB (Mifflin-St Jeor) e Calorias Totais (GET ajustado pelo objetivo)
  const tmb = Math.round(calculateTMB(weight, height, age, gender));
  const activityConfig = ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS.moderado;
  const get = Math.round(tmb * activityConfig.factor);

  const goalConfig = GOAL_DETAILS[goal] || GOAL_DETAILS.recomposicao;
  let targetCalories = get + goalConfig.diff;

  // Piso calórico seguro
  const minFloor = gender === 'masculino' ? 1400 : 1200;
  if (targetCalories < minFloor) {
    targetCalories = minFloor;
  }

  // 2. Proteína Diária: 2.2g por kg de peso corporal
  const proteinGrams = Math.round(weight * 2.2);
  const proteinCalories = proteinGrams * 4;

  // 3. Gordura Diária: 0.9g por kg de peso corporal
  const fatsGrams = Math.round(weight * 0.9);
  const fatsCalories = fatsGrams * 9;

  // 4. Carboidrato Diário: Subtraia as calorias da proteína e da gordura do total. O que sobrar divide por 4
  const carbsCalories = Math.max(0, targetCalories - (proteinCalories + fatsCalories));
  const carbsGrams = Math.round(carbsCalories / 4);

  // Meta Hídrica: 35ml por kg
  const waterMl = Math.round(weight * 35);

  const totalCalculated = proteinCalories + carbsCalories + fatsCalories;
  const proteinPercent = Math.round((proteinCalories / totalCalculated) * 100);
  const carbsPercent = Math.round((carbsCalories / totalCalculated) * 100);
  const fatsPercent = Math.round((fatsCalories / totalCalculated) * 100);

  return {
    tmb,
    get,
    targetCalories,
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
