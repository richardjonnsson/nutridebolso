export type Gender = 'masculino' | 'feminino';

export type ActivityLevel =
  | 'sedentario'
  | 'leve'
  | 'moderado'
  | 'ativo'
  | 'muito_ativo';

export type DietGoal =
  | 'emagrecimento_verao_agressivo' // -700 kcal (Foco verão)
  | 'emagrecimento_moderado'        // -500 kcal
  | 'emagrecimento_extremo'         // -900 kcal
  | 'recomposicao'                  // 0 kcal
  | 'hipertrofia'                   // +350 kcal
  | 'emagrecimento'                 // retrocompatibilidade (-500 kcal)
  | 'emagrecimento_agressivo';      // retrocompatibilidade (-750 kcal)

export interface MealRequest {
  mealIndex: number;
  name: string;
  timeSuggestion?: string;
  userFoods: string;
}

export interface MealOptionPlan {
  optionNumber: 1 | 2 | 3 | number;
  meals: {
    mealIndex: number;
    name: string;
    timeSuggestion?: string;
    userFoods: string;
  }[];
}

export interface UserDietInput {
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: DietGoal;
  mealsCount?: number;
  proteins?: string[];
  carbs?: string[];
  mealRequests?: MealRequest[];
  optionPlans?: MealOptionPlan[];
  preferences: string[];
  customNotes?: string;
}

export interface NutritionalTargets {
  tmb: number; // Taxa Metabólica Basal (Mifflin-St Jeor)
  get: number; // Gasto Energético Total Diário (TDEE)
  targetCalories: number; // Meta calórica com déficit/superávit
  calorieDiff: number; // Ex: -700
  proteinGrams: number;
  proteinCalories: number;
  carbsGrams: number;
  carbsCalories: number;
  fatsGrams: number;
  fatsCalories: number;
  waterMl: number; // Meta diária de água
  proteinPercent: number;
  carbsPercent: number;
  fatsPercent: number;
}

export interface FoodItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  tip?: string;
}

export interface Meal {
  id: string;
  name: string;
  timeSuggestion: string;
  items: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

export interface DayOption {
  optionNumber: number;
  title: string;
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

// ======================== TIPOS DE TREINO ========================

export type WorkoutLocation = 'academia' | 'casa';
export type WorkoutLevel = 'iniciante' | 'intermediario' | 'avancado';
export type WorkoutFrequency = 3 | 4 | 5 | 6;
export type WorkoutDuration = 30 | 45 | 60;
export type WorkoutFocus = 'queima_geral' | 'definicao_abdomen' | 'superiores' | 'inferiores_gluteos';

export interface ExerciseItem {
  id: string;
  name: string;
  muscle: string;
  sets: string;
  reps: string;
  rest: string;
  notes: string;
  isHomeFriendly: boolean;
}

export interface WorkoutDay {
  id: string;
  dayLabel: string;
  title: string;
  targetMuscles: string[];
  exercises: ExerciseItem[];
  cardioFinisher: {
    title: string;
    duration: string;
    protocol: string;
    caloriesBurnEst: string;
  };
}

export interface WorkoutPlan {
  location: WorkoutLocation;
  level: WorkoutLevel;
  frequency: WorkoutFrequency;
  duration: WorkoutDuration;
  focus: WorkoutFocus;
  hasDumbbellsOrBands?: boolean;
  days: WorkoutDay[];
  summerTips: string[];
}
