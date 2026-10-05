import { NextRequest, NextResponse } from 'next/server';
import { UserDietInput } from '@/types/diet';
import { calculateNutritionalTargets } from '@/lib/calculations';
import { generateDietPlan } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const age = Number(body.age);
    const weight = Number(body.weight);
    const height = Number(body.height);
    const gender = body.gender;
    const activityLevel = body.activityLevel;
    const goal = body.goal;
    const proteins = Array.isArray(body.proteins) ? body.proteins : [];
    const carbs = Array.isArray(body.carbs) ? body.carbs : [];
    const mealRequests = Array.isArray(body.mealRequests) ? body.mealRequests : [];
    const optionPlans = Array.isArray(body.optionPlans) ? body.optionPlans : [];
    const preferences = Array.isArray(body.preferences) ? body.preferences : [];
    const customNotes = typeof body.customNotes === 'string' ? body.customNotes.trim() : '';

    // Validações básicas
    if (!age || age < 10 || age > 120) {
      return NextResponse.json({ error: 'Idade inválida (deve estar entre 10 e 120 anos).' }, { status: 400 });
    }
    if (!weight || weight < 30 || weight > 300) {
      return NextResponse.json({ error: 'Peso inválido (deve estar entre 30 e 300 kg).' }, { status: 400 });
    }
    if (!height || height < 100 || height > 250) {
      return NextResponse.json({ error: 'Altura inválida (deve estar entre 100 e 250 cm).' }, { status: 400 });
    }
    if (gender !== 'masculino' && gender !== 'feminino') {
      return NextResponse.json({ error: 'Sexo inválido.' }, { status: 400 });
    }
    if (!['sedentario', 'leve', 'moderado', 'ativo', 'muito_ativo'].includes(activityLevel)) {
      return NextResponse.json({ error: 'Nível de atividade inválido.' }, { status: 400 });
    }
    if (!['hipertrofia', 'emagrecimento', 'emagrecimento_agressivo', 'recomposicao'].includes(goal)) {
      return NextResponse.json({ error: 'Objetivo inválido.' }, { status: 400 });
    }

    const mealsCount = Number(body.mealsCount) === 3 || Number(body.mealsCount) === 5 ? Number(body.mealsCount) : 4;

    const userInput: UserDietInput = {
      age,
      weight,
      height,
      gender,
      activityLevel,
      goal,
      mealsCount,
      proteins,
      carbs,
      mealRequests,
      optionPlans,
      preferences,
      customNotes,
    };

    // 1. Cálculos nutricionais matemáticos exatos
    const targets = calculateNutritionalTargets(userInput);

    // 2. Geração dos cardápios (Gemini AI com fallback determinístico)
    const { options, source } = await generateDietPlan(userInput, targets);

    const mealProt = Math.round(targets.proteinGrams / mealsCount);
    const recommendations = [
      `Beba no mínimo ${(targets.waterMl / 1000).toFixed(1)}L de água diariamente fracionados ao longo do dia.`,
      `Mantenha a ingestão proteica constante nas ${mealsCount} refeições (~${mealProt}g por refeição).`,
      ...(mealsCount === 3
        ? [
            `Protocolo de Jejum Intermitente 16/8 ativo: Janela de alimentação de 8 horas (das 12:00 às 20:00) e 16 horas de jejum.`,
            `Benefícios do jejum: Estímulo à autofagia celular, melhora acentuada da sensibilidade à insulina e queima otimizada de gordura corporal.`,
          ]
        : []),
      `Você pode alternar entre as Opções 1, 2 e 3 em dias diferentes da semana conforme sua preferência.`,
      `Priorize alimentos in natura e evite ultraprocessados para otimizar seus resultados e saciedade.`,
    ];

    return NextResponse.json({
      userInput,
      targets,
      options,
      recommendations,
      generatedAt: new Date().toISOString(),
      source,
    });
  } catch (error) {
    console.error('Erro na rota de geração de dieta:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro interno ao processar seu plano alimentar.' },
      { status: 500 }
    );
  }
}
