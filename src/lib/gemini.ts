import { GoogleGenAI } from '@google/genai';
import { DayOption, NutritionalTargets, UserDietInput } from '@/types/diet';
import { generateDeterministicDiet } from './fallbackDiet';

export async function generateDietPlan(
  input: UserDietInput,
  targets: NutritionalTargets
): Promise<{ options: [DayOption, DayOption, DayOption]; source: 'gemini' | 'deterministic_fallback' }> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.log('Chave GEMINI_API_KEY não encontrada. Utilizando gerador determinístico inteligente com metas exatas.');
    return {
      options: generateDeterministicDiet(input, targets),
      source: 'deterministic_fallback',
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const userProteins = input.proteins && input.proteins.length > 0 ? input.proteins.join(', ') : 'Peito de frango, patinho moído, ovos, tilápia';
    const userCarbs = input.carbs && input.carbs.length > 0 ? input.carbs.join(', ') : 'Arroz branco, feijão, batata-doce, aveia';
    const customNotes = input.customNotes ? ` (Observações adicionais: ${input.customNotes})` : '';
    const mealsCount = input.mealsCount || 4;
    const fastingDirective =
      mealsCount === 3
        ? 'Como o usuário optou por 3 refeições, utilize o protocolo de Jejum Intermitente 16/8 (16h em jejum das 20:00 às 12:00, e 8h de janela alimentar: 12:00 Almoço/Quebra de Jejum, 16:00 Lanche da Tarde e 20:00 Jantar).'
        : `Divida harmoniosamente em ${mealsCount} refeições ao longo do dia.`;

    let optionDirectives = '';
    if (input.optionPlans && input.optionPlans.length > 0) {
      optionDirectives = input.optionPlans
        .map(
          (opt) =>
            `CARDÁPIO OPÇÃO ${opt.optionNumber}:\n` +
            opt.meals
              .map(
                (m) =>
                  `  - Refeição ${m.mealIndex} (${m.name}): O cliente quer comer [${m.userFoods}].`
              )
              .join('\n')
        )
        .join('\n\n');
    }

    let mealDirectives = '';
    if (input.mealRequests && input.mealRequests.length > 0) {
      mealDirectives = input.mealRequests
        .map(
          (m) =>
            `- Refeição ${m.mealIndex} (${m.name}${m.timeSuggestion ? ` às ${m.timeSuggestion}` : ''}): O cliente quer comer [${m.userFoods}]. Calcule as quantidades exatas na balança para estes alimentos.`
        )
        .join('\n');
    }

    const prompt = `Você é um nutricionista esportivo de elite. Monte 3 opções de cardápio diário batendo EXATAMENTE estas metas:
- Calorias Totais: ${targets.targetCalories} kcal
- Proteína: ${targets.proteinGrams}g
- Carboidrato: ${targets.carbsGrams}g
- Gordura: ${targets.fatsGrams}g

O CLIENTE ESCOLHEU ESPECIFICAMENTE O QUE DESEJA COMER NAS 3 OPÇÕES DE CARDÁPIO:
${optionDirectives || mealDirectives || `- Fontes de Proteína selecionadas: ${userProteins}\n- Fontes de Carboidrato selecionadas: ${userCarbs}`}
- Gorduras boas: Distribua automaticamente azeite de oliva extravirgem, castanhas e gemas dos ovos para bater com perfeição ${targets.fatsGrams}g de gordura em cada uma das 3 opções.
${customNotes ? `Observações adicionais: ${customNotes}` : ''}

REGRAS:
1. Monte as 3 opções de cardápio (Opção 1, Opção 2 e Opção 3) correspondendo fielmente às escolhas de alimentos que o cliente fez para cada uma delas, prescrevendo as gramaturas exatas na balança (peso do alimento já pronto/cozido) para bater rigorosamente as metas.
2. Divida em ${mealsCount} refeições. ${fastingDirective}
3. Mostre as gramaturas aproximadas na balança (peso do alimento já cozido/preparado) ao lado de cada item para fechar a matemática dos macros com rigor.

RETORNE ESTRITAMENTE UM JSON VÁLIDO no seguinte formato (sem blocos de texto antes ou depois):
[
  {
    "optionNumber": 1,
    "title": "Opção 1: Combate Padrão",
    "tagline": "Prático e de alta digestibilidade",
    "totalCalories": ${targets.targetCalories},
    "totalProtein": ${targets.proteinGrams},
    "totalCarbs": ${targets.carbsGrams},
    "totalFats": ${targets.fatsGrams},
    "meals": [
      {
        "id": "opt1-m1",
        "name": "${mealsCount === 3 ? 'Almoço (Quebra do Jejum)' : 'Café da Manhã'}",
        "timeSuggestion": "${mealsCount === 3 ? '12:00' : '07:30'}",
        "totalCalories": ${Math.round(targets.targetCalories / mealsCount)},
        "totalProtein": ${Math.round(targets.proteinGrams / mealsCount)},
        "totalCarbs": ${Math.round(targets.carbsGrams / mealsCount)},
        "totalFats": ${Math.round(targets.fatsGrams / mealsCount)},
        "items": [
          {
            "name": "Ovos inteiros mexidos",
            "portion": "3 ovos médios na balança",
            "calories": 210,
            "protein": 18,
            "carbs": 2,
            "fats": 15,
            "tip": "Feitos com fio de azeite"
          }
        ]
      }
    ]
  }
]
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const responseText = response.text?.trim() || '';
    if (!responseText) {
      throw new Error('Resposta vazia da API do Gemini');
    }

    const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
    const parsedOptions = JSON.parse(cleanJson) as DayOption[];

    if (Array.isArray(parsedOptions) && parsedOptions.length >= 3) {
      return {
        options: [parsedOptions[0], parsedOptions[1], parsedOptions[2]],
        source: 'gemini',
      };
    }

    throw new Error('A resposta do Gemini não retornou o formato de 3 opções esperado.');
  } catch (error) {
    console.error('Erro ao gerar dieta com Gemini API, acionando fallback com metas exatas:', error);
    return {
      options: generateDeterministicDiet(input, targets),
      source: 'deterministic_fallback',
    };
  }
}
