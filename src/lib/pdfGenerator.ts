import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface TacticalDietData {
  tmb: number;
  get: number;
  kcal: number;
  prot: number;
  carb: number;
  fat: number;
  waterL: number;
  goal: string;
  gender: string;
  age: number;
  weight: number;
  height: number;
  activityLevel: string;
  mealsCount: number;
  fastingProtocol?: boolean;
  preferences?: string[];
  options: {
    title: string;
    color: [number, number, number];
    meals: {
      name: string;
      time: string;
      desc: string;
    }[];
  }[];
}

export function generateTacticalPdf(data: TacticalDietData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const neonGreen: [number, number, number] = [0, 255, 0];
  const darkBg: [number, number, number] = [10, 10, 10];
  const lightText: [number, number, number] = [245, 245, 245];
  const mutedText: [number, number, number] = [140, 140, 140];

  // 1. Cabeçalho do Plano
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, 210, 26, 'F');

  // Faixa de destaque neon
  doc.setFillColor(...neonGreen);
  doc.rect(0, 25, 210, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PROTOCOLO SECA PEITORAL | DIETA ANTI-AROMATASE', 14, 13);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...neonGreen);
  doc.text('ORDER BUMP OFICIAL • FICHA DE TREINO SECA PEITORAL | OTIMIZAÇÃO HORMONAL MASCULINA', 14, 19);

  doc.setFontSize(7.5);
  doc.setTextColor(...mutedText);
  const now = new Date().toLocaleDateString('pt-BR');
  doc.text(`PROTOCOLO ATIVO  |  DATA: ${now}  |  FOCO: BLOQUEIO DE AROMATASE E REDUÇÃO DE GORDURA PEITORAL`, 14, 23.5);

  // 2. Quadro de Perfil & Metas Diárias
  doc.setFillColor(20, 20, 20);
  doc.roundedRect(14, 32, 182, 34, 2, 2, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...neonGreen);
  doc.text(`METAS ENERGÉTICAS E HORMONAIS (EQUAÇÃO MIFFLIN-ST JEOR)`, 18, 39);

  doc.setFontSize(8.5);
  doc.setTextColor(...lightText);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `• Perfil: Homem (${data.age} anos) | Peso: ${data.weight} kg | Altura: ${data.height} cm | Foco: ${data.goal}`,
    18,
    46
  );
  doc.text(
    `• TMB: ${data.tmb} kcal   |   GET: ${data.get} kcal   |   META DIÁRIA: ${data.kcal} kcal/dia   |   Nº Refeições: ${data.mealsCount}`,
    18,
    52
  );
  doc.text(
    `• Macros: ${data.prot}g Proteína (2.2g/kg)  |  ${data.carb}g Carbo Limpo  |  ${data.fat}g Gordura Esteroidogênica  |  Água: ${data.waterL}L/dia`,
    18,
    58
  );

  doc.setFontSize(7.5);
  doc.setTextColor(...mutedText);
  doc.text('*Alimentos pesados prontos/cozidos na balança. Otimizado para inibir a aromatase e proteger a testosterona.', 18, 63);

  let currentY = 72;

  // Box Especial de Jejum se forem 3 refeições
  if (data.mealsCount === 3 || data.fastingProtocol) {
    doc.setFillColor(15, 30, 15);
    doc.roundedRect(14, currentY, 182, 18, 1.5, 1.5, 'F');
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...neonGreen);
    doc.text('⚡ PROTOCOLO DE JEJUM INTERMITENTE 16/8 ATIVADO (3 REFEIÇÕES)', 18, currentY + 6);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(230, 230, 230);
    doc.text('• Janela em Jejum: 16 Horas (das 20:00 às 12:00) | Janela de Alimentação: 8 Horas (das 12:00 às 20:00).', 18, currentY + 11);
    doc.text('• Benefícios: Autofagia celular, aumento da sensibilidade à insulina, lipólise acelerada e máxima clareza mental.', 18, currentY + 15);
    currentY += 23;
  }

  // 3. Renderização das 3 Opções de Cardápios
  data.options.forEach((opt, idx) => {
    // Header da Opção
    doc.setFillColor(26, 26, 26);
    doc.roundedRect(14, currentY, 182, 8, 1, 1, 'F');

    // Barra lateral de cor
    doc.setFillColor(...opt.color);
    doc.rect(14, currentY, 3, 8, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...opt.color);
    doc.text(opt.title.toUpperCase(), 20, currentY + 5.5);

    currentY += 11;

    // Tabela das refeições desta opção
    const rows = opt.meals.map((m) => [m.name.toUpperCase(), m.time, m.desc.replace(/<br>/g, ' + ')]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: 14, right: 14 },
      theme: 'grid',
      headStyles: {
        fillColor: [30, 30, 30],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5,
      },
      bodyStyles: {
        fillColor: [248, 250, 252],
        textColor: [20, 20, 20],
        fontSize: 8.5,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 38, fontStyle: 'bold' },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 124 },
      },
      head: [['Refeição', 'Horário', 'Alimentos & Medidas Exatas na Balança (Cozido)']],
      body: rows,
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;

    // Quebra de página se necessário
    if (currentY > 235 && idx < data.options.length - 1) {
      doc.addPage();
      currentY = 20;
    }
  });

  // Tabela de Diretrizes Anti-Aromatase & Regras Inegociáveis
  if (currentY > 225) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFillColor(20, 20, 20);
  doc.roundedRect(14, currentY, 182, 46, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...neonGreen);
  doc.text('CHECKLIST DIÁRIO ANTI-AROMATASE & HÁBITOS DE SECAGEM PEITORAL', 18, currentY + 7);

  doc.setFontSize(7.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightText);
  doc.text(`• Ficha de Treino: [ ] Treino Peitoral Feito   |   Chá Verde (EGCG): [ ] 1 a 2 Xícaras   |   Água (${data.waterL}L): [ ] 1L  [ ] 2L  [ ] 3L`, 18, currentY + 14);
  doc.text(`• Checklist Refeições na Balança: ${Array.from({ length: data.mealsCount }).map((_, i) => `[ ] Refeição ${i + 1}`).join('      ')}`, 18, currentY + 20);
  doc.text('• Regra Crucíferos (DIM): Brócolis, couve-flor ou repolho ao menos 1x ao dia para inibir a enzima aromatase no peitoral.', 18, currentY + 26);
  doc.text('• Regra Zinco & Testosterona: Consumir carnes magras ou 20g sementes de abóbora diariamente para blindar a testosterona livre.', 18, currentY + 32);
  doc.text('• Inimigos Banidos: Cerveja/Álcool (fitoestrógenos do lúpulo) e açúcar refinado (picos de insulina que ativam a aromatase).', 18, currentY + 38);
  doc.text('• Vegetais e Folhas Livres: Rúcula, alface, espinafre e cogumelos frescos para saciedade e bloqueio estrogênico.', 18, currentY + 43);

  // Rodapé
  doc.setFontSize(8);
  doc.setTextColor(...mutedText);
  doc.text('Ficha de Treino Seca Peitoral • Dieta Anti-Aromatase • Otimização Hormonal Masculina', 14, 288);
  doc.text('Página 1 de 1', 180, 288);

  doc.save(`Protocolo_Seca_Peitoral_AntiAromatase_${Date.now()}.pdf`);
}

export function generateDietPdf(dietData: any): void {
  const options = (dietData.options || []).map((opt: any, idx: number) => ({
    title: opt.title,
    color: (idx === 0 ? [0, 255, 0] : idx === 1 ? [255, 215, 0] : [255, 51, 51]) as [number, number, number],
    meals: (opt.meals || []).map((m: any) => ({
      name: m.name,
      time: m.timeSuggestion || '12:00',
      desc: (m.items || []).map((i: any) => `${i.name} (${i.portion})`).join(' + '),
    })),
  }));

  generateTacticalPdf({
    tmb: dietData.targets?.tmb || 1700,
    get: dietData.targets?.get || 2500,
    kcal: dietData.targets?.targetCalories || 2200,
    prot: dietData.targets?.proteinGrams || 170,
    carb: dietData.targets?.carbsGrams || 200,
    fat: dietData.targets?.fatsGrams || 60,
    waterL: dietData.targets?.waterMl ? Number((dietData.targets.waterMl / 1000).toFixed(1)) : 2.8,
    goal: dietData.userInput?.goal || 'Hipertrofia',
    gender: dietData.userInput?.gender || 'masculino',
    age: dietData.userInput?.age || 28,
    weight: dietData.userInput?.weight || 78,
    height: dietData.userInput?.height || 178,
    activityLevel: dietData.userInput?.activityLevel || 'moderado',
    mealsCount: 4,
    options,
  });
}
