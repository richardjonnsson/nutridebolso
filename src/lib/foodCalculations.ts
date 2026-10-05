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
