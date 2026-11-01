/**
 * Funções utilitárias para cálculo de gramaturas exatas de alimentos na balança
 * com base na densidade de macronutrientes da Tabela de Composição de Alimentos (TACO/USDA).
 * Alimentos sempre calculados em peso pronto/pesado para o aluno.
 */

export interface FoodPortionResult {
  name: string;
  portion: string;
}

/**
 * Calcula a porção precisa de uma fonte proteica.
 */
export function getProteinPortion(foodName: string, targetProteinGrams: number): FoodPortionResult {
  const lower = foodName.toLowerCase().trim();

  // 1. WHEY PROTEIN / SHAKE PROTEICO / ALBUMINA
  if (
    lower.includes('whey') ||
    lower.includes('shake') ||
    lower.includes('albumina') ||
    lower.includes('isolad') ||
    lower.includes('concentrad') ||
    lower.includes('proteina em po') ||
    lower.includes('proteína em pó')
  ) {
    // 30g de pó padrão = ~24g de proteína (80% pureza)
    // O pó necessário = targetProtein / 0.8
    // Limitamos uma dose de whey realista entre 25g e 45g (aprox. 1 a 1.5 scoops)
    const rawG = Math.round(targetProteinGrams / 0.8);
    const g = Math.min(45, Math.max(25, rawG));
    const scoops = (g / 30).toFixed(1);
    return {
      name: foodName,
      portion: `${g}g na balança (~${scoops} scoop${Number(scoops) > 1.0 ? 's' : ''})`,
    };
  }

  // 2. OVOS INTEIROS E CLARAS
  if (lower.includes('clara')) {
    // 1 clara = ~3.5g de proteína
    const count = Math.max(3, Math.round(targetProteinGrams / 3.5));
    return { name: foodName, portion: `${count} claras cozidas/mexidas na balança` };
  }
  if (lower.includes('ovo')) {
    // 1 ovo inteiro = ~6g de proteína
    const count = Math.min(6, Math.max(2, Math.round(targetProteinGrams / 6)));
    return { name: foodName, portion: `${count} unidades mexidos/cozidos` };
  }

  // 3. PEITO DE FRANGO / SASSAMI / SOBRECOXA
  if (lower.includes('frango') || lower.includes('sassami') || lower.includes('peito')) {
    // 100g grelhado = ~31g de proteína (fator 3.2)
    const g = Math.min(250, Math.max(80, Math.round(targetProteinGrams * 3.2)));
    return { name: foodName, portion: `${g}g grelhado/desfiado na balança` };
  }

  // 4. CARNE VERMELHA MAGRA (Patinho, Filé Mignon, Alcatra, Carne Moída, Bife)
  if (
    lower.includes('patinho') ||
    lower.includes('mignon') ||
    lower.includes('alcatra') ||
    lower.includes('carne') ||
    lower.includes('bife') ||
    lower.includes('hamburguer') ||
    lower.includes('hambúrguer')
  ) {
    // 100g = ~30g de proteína (fator 3.3)
    const g = Math.min(250, Math.max(80, Math.round(targetProteinGrams * 3.3)));
    return { name: foodName, portion: `${g}g grelhado/refogado na balança` };
  }

  // 5. PEIXES (Tilápia, Pescada, Salmão, Peixe Branco)
  if (
    lower.includes('tilapia') ||
    lower.includes('tilápia') ||
    lower.includes('peixe') ||
    lower.includes('pescada') ||
    lower.includes('salmao') ||
    lower.includes('salmão')
  ) {
    // 100g = ~26g de proteína (fator 3.8)
    const g = Math.min(280, Math.max(90, Math.round(targetProteinGrams * 3.8)));
    return { name: foodName, portion: `${g}g grelhado/assado na balança` };
  }

  // 6. MOELA DE FRANGO
  if (lower.includes('moela')) {
    // 100g = ~28g de proteína (fator 3.5)
    const g = Math.min(250, Math.max(80, Math.round(targetProteinGrams * 3.5)));
    return { name: foodName, portion: `${g}g cozida e temperada na balança` };
  }

  // 7. ATUM DRENADO
  if (lower.includes('atum')) {
    return { name: foodName, portion: '1 lata drenada (~120g na balança)' };
  }

  // 8. IOGURTE NATURAL / GREGO / DESNATADO
  if (lower.includes('iogurte')) {
    const g = Math.min(250, Math.max(150, Math.round(targetProteinGrams * 8)));
    return { name: foodName, portion: `${g}g na balança (~1 pote grande)` };
  }

  // 9. QUEIJO / COTTAGE / RICOTA / TOFU
  if (lower.includes('cottage') || lower.includes('ricota') || lower.includes('tofu') || lower.includes('queijo')) {
    const g = Math.min(200, Math.max(50, Math.round(targetProteinGrams * 5)));
    return { name: foodName, portion: `${g}g na balança` };
  }

  // Fallback seguro de proteína
  const g = Math.min(220, Math.max(80, Math.round(targetProteinGrams * 3.3)));
  return { name: foodName, portion: `${g}g pronto na balança` };
}

/**
 * Calcula a porção precisa de uma fonte de carboidrato.
 */
export function getCarbPortion(foodName: string, targetCarbGrams: number): FoodPortionResult {
  const lower = foodName.toLowerCase().trim();

  // 1. ARROZ BRANCO OU INTEGRAL
  if (lower.includes('arroz')) {
    // 100g cozido = ~28g carbo (fator 3.5)
    const g = Math.min(300, Math.max(60, Math.round(targetCarbGrams * 3.5)));
    return { name: foodName, portion: `${g}g cozido na balança` };
  }

  // 2. FEIJÃO
  if (lower.includes('feijao') || lower.includes('feijão')) {
    const g = Math.min(200, Math.max(60, Math.round(targetCarbGrams * 5.0)));
    return { name: foodName, portion: `${g}g cozido na balança (~1 concha média)` };
  }

  // 3. BATATA DOCE
  if (lower.includes('batata-doce') || lower.includes('batata doce')) {
    // 100g cozida = ~24g carbo (fator 4.1)
    const g = Math.min(300, Math.max(70, Math.round(targetCarbGrams * 4.1)));
    return { name: foodName, portion: `${g}g cozida na balança` };
  }

  // 4. BATATA INGLESA
  if (lower.includes('batata inglesa') || lower.includes('batata')) {
    // 100g cozida = ~18g carbo (fator 5.5)
    const g = Math.min(350, Math.max(80, Math.round(targetCarbGrams * 5.5)));
    return { name: foodName, portion: `${g}g cozida/assada na balança` };
  }

  // 5. MACARRÃO
  if (lower.includes('macarrao') || lower.includes('macarrão')) {
    // 100g cozido = ~30g carbo (fator 3.3)
    const g = Math.min(280, Math.max(60, Math.round(targetCarbGrams * 3.3)));
    return { name: foodName, portion: `${g}g cozido na balança` };
  }

  // 6. MANDIOCA / AIPIM / MACAXEIRA
  if (lower.includes('mandioca') || lower.includes('aipim') || lower.includes('macaxeira')) {
    const g = Math.min(280, Math.max(60, Math.round(targetCarbGrams * 3.3)));
    return { name: foodName, portion: `${g}g cozida na balança` };
  }

  // 7. AVEIA EM FLOCOS
  if (lower.includes('aveia')) {
    // 100g = ~60g carbo (fator 1.6)
    const g = Math.min(80, Math.max(25, Math.round(targetCarbGrams * 1.6)));
    const colheres = Math.max(2, Math.round(g / 15));
    return { name: foodName, portion: `${g}g em flocos na balança (~${colheres} colheres de sopa)` };
  }

  // 8. BANANA
  if (lower.includes('banana')) {
    // 1 banana média = ~20g carbo (~85g descascada)
    const units = Math.min(3, Math.max(1, Math.round(targetCarbGrams / 20)));
    return {
      name: foodName,
      portion: `${units} unidade${units > 1 ? 's' : ''} média${units > 1 ? 's' : ''} (~${units * 85}g na balança)`,
    };
  }

  // 9. MORANGOS / FRUTAS VERMELHAS / MIRTILOS (Rico em Resveratrol Anti-Aromatase)
  if (
    lower.includes('morango') ||
    lower.includes('frutas vermelhas') ||
    lower.includes('mirtilo') ||
    lower.includes('amora') ||
    lower.includes('framboesa')
  ) {
    const g = Math.min(200, Math.max(100, Math.round(targetCarbGrams * 12)));
    return {
      name: foodName,
      portion: `${g}g frescos na balança (Rico em Resveratrol e Antocianinas)`,
    };
  }

  // 10. MAÇÃ / MAMÃO / FRUTA
  if (lower.includes('maca') || lower.includes('maçã')) {
    const units = Math.min(3, Math.max(1, Math.round(targetCarbGrams / 18)));
    return { name: foodName, portion: `${units} unidade${units > 1 ? 's' : ''} média${units > 1 ? 's' : ''}` };
  }
  if (lower.includes('mamao') || lower.includes('mamão')) {
    return { name: foodName, portion: '1 fatia média (~150g na balança)' };
  }
  if (lower.includes('fruta')) {
    return { name: foodName, portion: '1 unidade média fresca (~100g a 120g)' };
  }

  // 11. PÃO INTEGRAL / PÃO DE FORMA
  if (lower.includes('pao') || lower.includes('pão')) {
    // 1 fatia = ~12g carbo (~25g de peso)
    const slices = Math.min(4, Math.max(1, Math.round(targetCarbGrams / 12)));
    return { name: foodName, portion: `${slices} fatia${slices > 1 ? 's' : ''} (${slices * 25}g na balança)` };
  }

  // 12. TAPIOCA / GOMA / CREPIOCA
  if (lower.includes('tapioca') || lower.includes('crepioca') || lower.includes('goma')) {
    const g = Math.min(90, Math.max(30, Math.round(targetCarbGrams * 1.8)));
    return { name: foodName, portion: `${g}g de goma na frigideira` };
  }

  // 13. CUSCUZ
  if (lower.includes('cuscuz')) {
    const g = Math.min(250, Math.max(80, Math.round(targetCarbGrams * 3.5)));
    return { name: foodName, portion: `${g}g pronto no vapor na balança` };
  }

  // Fallback seguro de carbo
  const g = Math.min(250, Math.max(50, Math.round(targetCarbGrams * 3.3)));
  return { name: foodName, portion: `${g}g pronto na balança` };
}

/**
 * Calcula a porção de gorduras, sementes e oleaginosas (Foco em Zinco e Anti-Aromatase).
 */
export function getFatPortion(foodName: string): FoodPortionResult {
  const lower = foodName.toLowerCase().trim();

  // Sementes de Abóbora (Riquíssimas em Zinco - Mineral Anti-Aromatase Nº 1)
  if (lower.includes('abobora') || lower.includes('abóbora') || lower.includes('pepita')) {
    return {
      name: foodName,
      portion: '20g na balança (~1 a 2 colheres de sopa - Alta concentração de Zinco Anti-Aromatase)',
    };
  }
  if (lower.includes('pasta de amendoim') || lower.includes('amendoim')) {
    return { name: foodName, portion: '1 colher de sopa rasa (~15g na balança)' };
  }
  if (lower.includes('castanha') || lower.includes('nozes')) {
    return { name: foodName, portion: '15g na balança (aprox. 3 a 4 unidades - Selênio & Gorduras Boas)' };
  }
  if (lower.includes('azeite')) {
    return { name: foodName, portion: '1 colher de sobremesa (~5ml no preparo/salada - Anti-inflamatório)' };
  }
  if (lower.includes('abacate')) {
    return { name: foodName, portion: '80g na balança (~2 colheres de sopa cheias)' };
  }
  if (lower.includes('chia') || lower.includes('linhaca') || lower.includes('linhaça')) {
    return { name: foodName, portion: '1 colher de sobremesa (~10g - Fibras & Ômega-3)' };
  }

  return { name: foodName, portion: '1 porção controlada (~10g a 15g)' };
}

/**
 * Retorna sugestão de gordura boa para compatibilidade.
 */
export function getHealthyFatPortion(targetFatGrams: number, index: number): string {
  const fatOptions = [
    '1 fio de azeite de oliva extravirgem (5ml no preparo/salada)',
    '15g de castanhas de caju ou do Pará na balança',
    '1 colher de sobremesa de pasta de amendoim integral',
    '1 colher de chá de azeite extravirgem (5ml) + sementes de chia',
  ];
  return fatOptions[index % fatOptions.length];
}

/**
 * Processa rigorosamente o texto digitado pelo usuário e calcula porções reais na balança.
 * NUNCA adiciona salada, gorduras ou carboidratos/proteínas que o usuário não tenha inserido!
 */
export function parseAndCalculateMealItems(
  userText: string,
  targetProteinGrams: number,
  targetCarbGrams: number,
  targetFatGrams: number,
  mealIndex: number
): FoodPortionResult[] {
  const clean = (userText || '').trim();
  if (!clean) {
    return [
      getProteinPortion('Peito de Frango', targetProteinGrams),
      getCarbPortion('Arroz Branco', targetCarbGrams),
    ];
  }

  // Quebrar pelos separadores de lista comuns
  const rawTokens = clean
    .split(/[,+;\n]|\se\s|\sou\s/gi)
    .map((t) => t.trim())
    .filter(Boolean);

  if (rawTokens.length === 0) {
    return [
      getProteinPortion('Peito de Frango', targetProteinGrams),
      getCarbPortion('Arroz Branco', targetCarbGrams),
    ];
  }

  // Palavras-chave de identificação
  const protKeywords = [
    'whey', 'shake', 'albumina', 'proteina', 'proteína', 'frango', 'peito', 'sassami',
    'sobrecoxa', 'mignon', 'filé', 'file', 'tilapia', 'tilápia', 'peixe', 'pescada',
    'salmao', 'salmão', 'moela', 'patinho', 'carne', 'alcatra', 'bife', 'ovo', 'ovos',
    'clara', 'claras', 'atum', 'lombo', 'suino', 'suíno', 'tofu', 'queijo', 'cottage',
    'ricota', 'iogurte'
  ];

  const carbKeywords = [
    'arroz', 'feijao', 'feijão', 'batata', 'doce', 'inglesa', 'macarrao', 'macarrão',
    'mandioca', 'aipim', 'macaxeira', 'aveia', 'pao', 'pão', 'tapioca', 'crepioca',
    'goma', 'banana', 'maca', 'maçã', 'mamao', 'mamão', 'fruta', 'frutas', 'cuscuz'
  ];

  const fatKeywords = [
    'azeite', 'castanha', 'castanhas', 'amendoim', 'pasta de amendoim', 'nozes',
    'abacate', 'chia', 'linhaca', 'linhaça'
  ];

  const antiAromataseKeywords = [
    'cogumelo', 'cogumelos', 'champignon', 'paris', 'shiitake', 'shimeji', 'portobello'
  ];

  const cruciferousKeywords = [
    'brocolis', 'brócolis', 'couve-flor', 'couve flor', 'repolho', 'rucula', 'rúcula', 'espinafre', 'couve'
  ];

  const greenKeywords = [
    'salada', 'alface', 'tomate', 'cenoura', 'legumes', 'folhas', 'pepino'
  ];

  const drinkKeywords = ['cafe', 'café', 'cha', 'chá', 'agua', 'água'];

  // Categorizar CADA token digitado pelo usuário
  const categorized: {
    token: string;
    type: 'antiAromatase' | 'cruciferous' | 'protein' | 'carb' | 'fat' | 'green' | 'drink' | 'other';
  }[] = [];

  rawTokens.forEach((token) => {
    const lower = token.toLowerCase();

    // 1. Inibidores de Aromatase (Cogumelos frescos)
    if (antiAromataseKeywords.some((k) => lower.includes(k))) {
      categorized.push({ token, type: 'antiAromatase' });
      return;
    }
    // 2. Crucíferos / DIM Anti-Estrogênicos
    if (cruciferousKeywords.some((k) => lower.includes(k))) {
      categorized.push({ token, type: 'cruciferous' });
      return;
    }
    // 3. Bebidas (Chá Verde, Café, Água)
    if (drinkKeywords.some((k) => lower.includes(k))) {
      categorized.push({ token, type: 'drink' });
      return;
    }
    // 4. Whey / Proteínas
    if (protKeywords.some((k) => lower.includes(k))) {
      categorized.push({ token, type: 'protein' });
      return;
    }
    // 5. Carboidratos
    if (carbKeywords.some((k) => lower.includes(k))) {
      categorized.push({ token, type: 'carb' });
      return;
    }
    // 6. Gorduras boas / Sementes de Abóbora (Zinco)
    if (fatKeywords.some((k) => lower.includes(k)) || lower.includes('abobora') || lower.includes('abóbora')) {
      categorized.push({ token, type: 'fat' });
      return;
    }
    // 7. Saladas e outros vegetais
    if (greenKeywords.some((k) => lower.includes(k))) {
      categorized.push({ token, type: 'green' });
      return;
    }
    // 8. Outros
    categorized.push({ token, type: 'other' });
  });

  const antiAromatases = categorized.filter((c) => c.type === 'antiAromatase');
  const cruciferous = categorized.filter((c) => c.type === 'cruciferous');
  const prots = categorized.filter((c) => c.type === 'protein');
  const carbs = categorized.filter((c) => c.type === 'carb');
  const fats = categorized.filter((c) => c.type === 'fat');
  const greens = categorized.filter((c) => c.type === 'green');
  const drinks = categorized.filter((c) => c.type === 'drink');
  const others = categorized.filter((c) => c.type === 'other');

  const results: FoodPortionResult[] = [];

  // 1. Processar PROTEÍNAS digitadas pelo usuário
  if (prots.length > 0) {
    const protPerItem = targetProteinGrams / prots.length;
    prots.forEach((p) => {
      results.push(getProteinPortion(p.token, protPerItem));
    });
  }

  // 2. Processar INIBIDORES DE AROMATASE (Cogumelos Paris, Champignon, etc)
  antiAromatases.forEach((a) => {
    results.push({
      name: a.token,
      portion: '100g frescos refogados no azeite ou grelhados (Inibidor Natural de Aromatase)',
    });
  });

  // 3. Processar CRUCÍFEROS (Brócolis, Couve-Flor, Repolho - Ricos em DIM)
  cruciferous.forEach((c) => {
    results.push({
      name: c.token,
      portion: '150g no vapor na balança (Rico em DIM e I3C - Redutor de Estrogênio)',
    });
  });

  // 4. Processar CARBOIDRATOS digitados pelo usuário
  const hasArroz = carbs.some((c) => c.token.toLowerCase().includes('arroz'));
  const hasFeijao = carbs.some((c) => c.token.toLowerCase().includes('feijao') || c.token.toLowerCase().includes('feijão'));

  if (hasArroz && hasFeijao && carbs.length === 2) {
    // Caso clássico: Arroz + Feijão juntos
    const remainingCarb = Math.max(20, targetCarbGrams - 15);
    const riceG = Math.min(280, Math.max(60, Math.round(remainingCarb * 3.5)));
    results.push({ name: 'Arroz Branco ou Integral', portion: `${riceG}g cozido na balança` });
    results.push({ name: 'Feijão Carioca ou Preto', portion: '100g cozido na balança (1 concha média)' });
  } else if (carbs.length > 0) {
    const carbPerItem = targetCarbGrams / carbs.length;
    carbs.forEach((c) => {
      results.push(getCarbPortion(c.token, carbPerItem));
    });
  }

  // 5. Processar GORDURAS BOAS & SEMENTES DE ZINCO digitadas pelo usuário
  fats.forEach((f) => {
    results.push(getFatPortion(f.token));
  });

  // 6. Processar SALADAS/VEGETAIS digitados pelo usuário
  greens.forEach((g) => {
    results.push({
      name: g.token,
      portion: 'À vontade com folhas frescas no prato',
    });
  });

  // 7. Processar BEBIDAS digitadas pelo usuário (Chá Verde, Café Puro)
  drinks.forEach((d) => {
    const lower = d.token.toLowerCase();
    if (lower.includes('cha verde') || lower.includes('chá verde')) {
      results.push({ name: d.token, portion: '1 xícara ou copo (200ml a 300ml - Rico em EGCG Inibidor de Aromatase)' });
    } else if (lower.includes('cafe') || lower.includes('café')) {
      results.push({ name: d.token, portion: '1 xícara média sem açúcar (100ml a 150ml puro)' });
    } else {
      results.push({ name: d.token, portion: '1 copo (200ml a 300ml de água mineral)' });
    }
  });

  // 6. Processar OUTROS alimentos digitados pelo usuário
  others.forEach((o) => {
    results.push({
      name: o.token,
      portion: '1 porção moderada (~100g na balança)',
    });
  });

  // Se por algum motivo nenhum item foi reconhecido, retorna o texto limpo
  if (results.length === 0) {
    results.push({
      name: clean,
      portion: '1 porção calculada para suas metas',
    });
  }

  return results;
}
