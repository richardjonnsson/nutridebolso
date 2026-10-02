export type Gender = 'masculino' | 'feminino';

export type ActivityLevel =
  | 'sedentario'
  | 'leve'
  | 'moderado'
  | 'ativo'
  | 'muito_ativo';

export type DietGoal = 'hipertrofia' | 'emagrecimento' | 'emagrecimento_agressivo' | 'recomposicao';

export interface UserDietInput {
  age: number;
  weight: number; // em kg
  height: number; // em cm
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: DietGoal;
  mealsCount?: number; // 3, 4 ou 5 refeições
  preferences: string[];
  customNotes?: string;
}

export interface NutritionalTargets {
  tmb: number; // Taxa Metabólica Basal
  get: number; // Gasto Energético Total
  targetCalories: number; // Meta calórica diária com ajuste do objetivo
  calorieDiff: number; // +400, -500 ou 0
  proteinGrams: number;
  proteinCalories: number;
  carbsGrams: number;
  carbsCalories: number;
  fatsGrams: number;
  fatsCalories: number;
  waterMl: number; // Recomendação de ingestão hídrica diária
  // Percentuais calóricos
  proteinPercent: number;
  carbsPercent: number;
  fatsPercent: number;
}

export interface FoodItem {
  name: string;
  portion: string; // Ex: "150g" ou "2 unidades"
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  tip?: string; // Dica ou substituição rápida
}

export interface Meal {
  id: string;
  name: string; // "Café da Manhã", "Almoço", "Lanche da Tarde", "Jantar"
  timeSuggestion: string; // "07:30", "12:30", etc.
  items: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

export interface DayOption {
  optionNumber: 1 | 2 | 3;
  title: string; // Ex: "Opção 1: Prática e Tradicional"
  tagline: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

export interface DietPlanResponse {
  userInput: UserDietInput;
  targets: NutritionalTargets;
  options: [DayOption, DayOption, DayOption];
  recommendations: string[];
  generatedAt: string;
  source: 'gemini' | 'deterministic_fallback';
}
