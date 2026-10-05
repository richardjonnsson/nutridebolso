/**
 * Funções utilitárias para cálculo de gramaturas exatas de alimentos na balança
 * com base na densidade de macronutrientes (alimentos prontos/cozidos).
 */

export function getProteinPortion(foodName: string, targetProteinGrams: number): { name: string; portion: string } {
  const lower = foodName.toLowerCase().trim();

  if (lower.includes('ovo')) {
    const count = Math.max(2, Math.round(targetProteinGrams / 6));
    return { name: 'Ovos Inteiros', portion: `${count} unidades mexidos/cozidos` };
  }

  if (lower.includes('tilapia') || lower.includes('tilápia') || lower.includes('peixe') || lower.includes('pescada')) {
    const g = Math.round(targetProteinGrams * 3.8);
    return { name: foodName, portion: `${g}g grelhado na balança` };
  }

  if (lower.includes('moela')) {
    const g = Math.round(targetProteinGrams * 3.5);
    return { name: foodName, portion: `${g}g cozida e temperada na balança` };
  }

  if (lower.includes('frango')) {
    const g = Math.round(targetProteinGrams * 3.2);
    return { name: foodName, portion: `${g}g grelhado/desfiado na balança` };
  }

  if (lower.includes('mignon') || lower.includes('file mignon') || lower.includes('filé mignon')) {
    const g = Math.round(targetProteinGrams * 3.3);
    return { name: foodName, portion: `${g}g grelhado na balança` };
  }

  if (lower.includes('patinho') || lower.includes('carne moida') || lower.includes('carne moída')) {
    const g = Math.round(targetProteinGrams * 3.3);
    return { name: foodName, portion: `${g}g refogado na balança` };
  }

  if (lower.includes('lombo') || lower.includes('suino') || lower.includes('suíno')) {
    const g = Math.round(targetProteinGrams * 3.4);
    return { name: foodName, portion: `${g}g grelhado na balança` };
  }

  if (lower.includes('atum')) {
    const g = Math.round(targetProteinGrams * 3.7);
    return { name: foodName, portion: `${g}g drenado na balança` };
  }

  const g = Math.round(targetProteinGrams * 3.3);
  return { name: foodName, portion: `${g}g pronto na balança` };
}

export function getCarbPortion(foodName: string, targetCarbGrams: number): { name: string; portion: string } {
  const lower = foodName.toLowerCase().trim();

  if (lower.includes('arroz') && (lower.includes('feijao') || lower.includes('feijão'))) {
    const riceG = Math.round(targetCarbGrams * 0.6 * 3.4);
    const beansG = Math.round(targetCarbGrams * 0.4 * 5.0);
    return { name: 'Arroz Branco + Feijão', portion: `${riceG}g de arroz + ${beansG}g de feijão cozidos` };
  }

  if (lower.includes('arroz')) {
    const g = Math.round(targetCarbGrams * 3.4);
    return { name: foodName, portion: `${g}g cozido na balança` };
  }

  if (lower.includes('feijao') || lower.includes('feijão')) {
    const g = Math.round(targetCarbGrams * 5.0);
    return { name: foodName, portion: `${g}g cozido na balança` };
  }

  if (lower.includes('batata-doce') || lower.includes('batata doce')) {
    const g = Math.round(targetCarbGrams * 4.1);
    return { name: foodName, portion: `${g}g cozida na balança` };
  }

  if (lower.includes('batata inglesa') || lower.includes('batata')) {
    const g = Math.round(targetCarbGrams * 5.3);
    return { name: foodName, portion: `${g}g cozida/assada na balança` };
  }

  if (lower.includes('macarrao') || lower.includes('macarrão')) {
    const g = Math.round(targetCarbGrams * 3.3);
    return { name: foodName, portion: `${g}g cozido na balança` };
  }

  if (lower.includes('mandioca') || lower.includes('aipim') || lower.includes('macaxeira')) {
    const g = Math.round(targetCarbGrams * 3.6);
    return { name: foodName, portion: `${g}g cozida na balança` };
  }

  if (lower.includes('aveia')) {
    const g = Math.max(20, Math.round(targetCarbGrams * 1.5));
    return { name: foodName, portion: `${g}g em flocos na balança` };
  }

  if (lower.includes('pao') || lower.includes('pão')) {
    const slices = Math.max(1, Math.round(targetCarbGrams / 24));
    return { name: foodName, portion: `${slices} fatias (${slices * 50}g)` };
  }

  const g = Math.round(targetCarbGrams * 3.5);
  return { name: foodName, portion: `${g}g pronto na balança` };
}

export function getHealthyFatPortion(targetFatGrams: number, index: number): string {
  const fatOptions = [
    '1 fio de azeite de oliva extravirgem (5ml no preparo/salada)',
    '15g de castanhas de caju ou do Pará na balança',
    '1 colher de sobremesa de pasta de amendoim integral',
    '1 colher de chá de azeite extravirgem (5ml) + sementes de chia',
  ];
  return fatOptions[index % fatOptions.length];
}

export function parseAndCalculateMealItems(
  userText: string,
  targetProteinGrams: number,
  targetCarbGrams: number,
  targetFatGrams: number,
  mealIndex: number
): { name: string; portion: string }[] {
  const clean = (userText || '').trim();
  if (!clean) {
    return [
      getProteinPortion('Peito de Frango', targetProteinGrams),
      getCarbPortion('Arroz Branco', targetCarbGrams),
      { name: 'Gordura Boa', portion: getHealthyFatPortion(targetFatGrams, mealIndex) },
    ];
  }

  // Tokenizar por separadores comuns
  const rawTokens = clean
    .split(/[,+;\n]|\se\s|\sou\s/gi)
    .map((t) => t.trim())
    .filter(Boolean);

  const protKeywords = [
    'frango', 'peito', 'mignon', 'filé', 'file', 'tilapia', 'tilápia', 'peixe',
    'moela', 'patinho', 'carne', 'ovo', 'ovos', 'atum', 'lombo', 'suino', 'suíno',
    'whey', 'shake', 'proteina', 'proteína', 'albumina', 'tofu', 'queijo', 'iogurte'
  ];

  const carbKeywords = [
    'arroz', 'feijao', 'feijão', 'batata', 'doce', 'inglesa', 'macarrao', 'macarrão',
    'mandioca', 'aipim', 'macaxeira', 'aveia', 'pao', 'pão', 'tapioca', 'crepioca',
    'banana', 'maca', 'maçã', 'mamao', 'mamão', 'fruta', 'cuscuz'
  ];

  const greensKeywords = ['salada', 'alface', 'tomate', 'brocolis', 'brócolis', 'couve', 'cenoura', 'legumes', 'folhas', 'pepino', 'rucula', 'rúcula'];

  const foundProts: string[] = [];
  const foundCarbs: string[] = [];
  const foundGreens: string[] = [];

  rawTokens.forEach((token) => {
    const lower = token.toLowerCase();
    const isProt = protKeywords.some((k) => lower.includes(k));
    const isCarb = carbKeywords.some((k) => lower.includes(k));
    const isGreen = greensKeywords.some((k) => lower.includes(k));

    if (isProt) foundProts.push(token);
    else if (isCarb) foundCarbs.push(token);
    else if (isGreen) foundGreens.push(token);
    else {
      if (lower.includes('bife') || lower.includes('hamburguer') || lower.includes('hambúrguer')) {
        foundProts.push(token);
      } else {
        foundCarbs.push(token);
      }
    }
  });

  const results: { name: string; portion: string }[] = [];

  // Calcular Proteínas
  if (foundProts.length === 0) {
    results.push(getProteinPortion('Proteína Magra (Frango, Patinho ou Tilápia)', targetProteinGrams));
  } else if (foundProts.length === 1) {
    results.push(getProteinPortion(foundProts[0], targetProteinGrams));
  } else {
    const splitProt = Math.round(targetProteinGrams / foundProts.length);
    foundProts.forEach((p) => {
      results.push(getProteinPortion(p, splitProt));
    });
  }

  // Calcular Carboidratos
  const hasArroz = foundCarbs.some((c) => c.toLowerCase().includes('arroz'));
  const hasFeijao = foundCarbs.some((c) => c.toLowerCase().includes('feijao') || c.toLowerCase().includes('feijão'));

  if (hasArroz && hasFeijao && foundCarbs.length === 2) {
    results.push(getCarbPortion('arroz e feijão', targetCarbGrams));
  } else if (foundCarbs.length === 0) {
    results.push(getCarbPortion('Carboidrato de sua escolha (Arroz, Batata ou Aveia)', targetCarbGrams));
  } else if (foundCarbs.length === 1) {
    results.push(getCarbPortion(foundCarbs[0], targetCarbGrams));
  } else {
    const splitCarb = Math.round(targetCarbGrams / foundCarbs.length);
    foundCarbs.forEach((c) => {
      results.push(getCarbPortion(c, splitCarb));
    });
  }

  // Saladas / Vegetais
  if (foundGreens.length > 0) {
    results.push({
      name: foundGreens.join(' + '),
      portion: 'À vontade com folhas e legumes frescos',
    });
  } else if (mealIndex === 1 || mealIndex === 3) {
    results.push({
      name: 'Salada verde / Legumes frescos',
      portion: '1 prato de sobremesa cheio temperado com limão e sal',
    });
  }

  // Gordura Boa calculada
  results.push({
    name: 'Gordura Boa Essencial',
    portion: getHealthyFatPortion(targetFatGrams, mealIndex),
  });

  return results;
}
