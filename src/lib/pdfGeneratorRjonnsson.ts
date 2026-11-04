import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DayOption, NutritionalTargets, WorkoutPlan } from '@/types/diet';
import { SUMMER_SUBSTITUTIONS } from '@/lib/summerDietGenerator';

export interface RJonnssonPdfData {
  userName?: string;
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: string;
  goalTitle: string;
  targets: NutritionalTargets;
  dietOptions: DayOption[]; // Array com todas as opções de cardápios
  dietOption?: DayOption;   // Retrocompatibilidade
  workoutPlan: WorkoutPlan;
}

export function generateRJonnssonFitPdf(data: RJonnssonPdfData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const navyBrand: [number, number, number] = [15, 23, 42]; // Slate 900
  const emeraldAccent: [number, number, number] = [16, 185, 129]; // Emerald 500
  const slateDark: [number, number, number] = [30, 41, 59]; // Slate 800
  const textDark: [number, number, number] = [51, 65, 85]; // Slate 700

  // 1. Cabeçalho Moderno & Minimalista
  doc.setFillColor(...navyBrand);
  doc.rect(0, 0, 210, 28, 'F');

  // Faixa de acento esmeralda
  doc.setFillColor(...emeraldAccent);
  doc.rect(0, 27, 210, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('RJONNSSONFIT', 14, 13);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 220, 210);
  doc.text('PROTOCOLO OFICIAL DE ALTA PERFORMANCE • PROJETO VERÃO', 14, 19);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  const now = new Date().toLocaleDateString('pt-BR');
  doc.text(`GERADO EM: ${now}  |  STATUS: PLANO ATIVO  |  METODOLOGIA CIENTÍFICA & RESULTADOS`, 14, 24);

  // 2. Cartão de Diagnóstico Metabólico
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 33, 182, 38, 2, 2, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...navyBrand);
  doc.text('1. DIAGNÓSTICO METABÓLICO & METAS NUTRICIONAIS', 18, 40);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textDark);
  doc.text(
    `Perfil: ${data.gender === 'masculino' ? 'Homem' : 'Mulher'} | ${data.age} anos | Peso: ${data.weight} kg | Altura: ${data.height} cm | Atividade: ${data.activityLevel}`,
    18,
    46
  );
  doc.text(`Estratégia Selecionada: ${data.goalTitle}`, 18, 51);

  // Mini-tabela de Métricas
  const metricsData = [
    [
      `TMB (Basal): ${data.targets.tmb} kcal`,
      `Gasto Total (TDEE): ${data.targets.get} kcal`,
      `Calorias Alvo: ${data.targets.targetCalories} kcal`,
      `Déficit: ${data.targets.calorieDiff} kcal`,
    ],
    [
      `Proteínas: ${data.targets.proteinGrams}g (${data.targets.proteinPercent}%)`,
      `Carboidratos: ${data.targets.carbsGrams}g (${data.targets.carbsPercent}%)`,
      `Gorduras: ${data.targets.fatsGrams}g (${data.targets.fatsPercent}%)`,
      `Hidratação: ${(data.targets.waterMl / 1000).toFixed(1)}L de água/dia`,
    ],
  ];

  autoTable(doc, {
    startY: 55,
    margin: { left: 18, right: 18 },
    body: metricsData,
    theme: 'plain',
    styles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 1.2,
      fontStyle: 'bold',
    },
  });

  // 3. Renderização de TODAS as opções de cardápio (Opção 1, Opção 2, Opção 3...)
  const allDietOptions = data.dietOptions && data.dietOptions.length > 0
    ? data.dietOptions
    : data.dietOption
    ? [data.dietOption]
    : [];

  let currentY = (doc as any).lastAutoTable.finalY + 8;

  allDietOptions.forEach((option, optIdx) => {
    // Garante que cada opção tenha espaço vertical suficiente sem quebrar no meio
    if (optIdx > 0 && currentY > 140) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...navyBrand);
    doc.text(
      `2.${optIdx + 1} PROTOCOLO NUTRICIONAL: ${option.title.toUpperCase()}`,
      14,
      currentY
    );

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textDark);
    doc.text(option.tagline, 14, currentY + 4);

    const mealTableBody: any[] = [];
    option.meals.forEach((m) => {
      const itemsText = m.items
        .map((it) => `• ${it.name} - ${it.portion}${it.tip ? ` (${it.tip})` : ''}`)
        .join('\n');

      mealTableBody.push([
        `${m.name}\n[${m.timeSuggestion}]`,
        itemsText,
        `${m.totalCalories} kcal\nP: ${m.totalProtein}g\nC: ${m.totalCarbs}g\nG: ${m.totalFats}g`,
      ]);
    });

    autoTable(doc, {
      startY: currentY + 6,
      margin: { left: 14, right: 14 },
      head: [['Refeição & Horário', 'Alimentos Pesados na Balança de Cozinha', 'Macros']],
      body: mealTableBody,
      theme: 'striped',
      headStyles: {
        fillColor: navyBrand,
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: [30, 41, 59],
        cellPadding: 2.2,
      },
      columnStyles: {
        0: { cellWidth: 38, fontStyle: 'bold' },
        1: { cellWidth: 108 },
        2: { cellWidth: 36, fontStyle: 'bold' },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  });

  // 4. Tabela de Substituições Inteligentes de Alimentos no PDF
  if (currentY > 210) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...navyBrand);
  doc.text('3. GUIA DE SUBSTITUIÇÕES DE ALIMENTOS NA BALANÇA', 14, currentY);

  const subTableBody: any[] = [];
  SUMMER_SUBSTITUTIONS.forEach((sub) => {
    subTableBody.push([
      sub.group.toUpperCase(),
      sub.baseFood,
      sub.equivalents.join('\n• '),
    ]);
  });

  autoTable(doc, {
    startY: currentY + 3,
    margin: { left: 14, right: 14 },
    head: [['Grupo', 'Alimento Base', 'Equivalentes Diretos com Mesmos Macronutrientes']],
    body: subTableBody,
    theme: 'grid',
    headStyles: {
      fillColor: slateDark,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [30, 41, 59],
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 28, fontStyle: 'bold' },
      1: { cellWidth: 50, fontStyle: 'bold' },
      2: { cellWidth: 104 },
    },
  });

  // 5. Nova Página: Ficha de Treino Personalizada
  doc.addPage();

  // Cabeçalho Página de Treino
  doc.setFillColor(...navyBrand);
  doc.rect(0, 0, 210, 18, 'F');
  doc.setFillColor(...emeraldAccent);
  doc.rect(0, 17, 210, 1, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('RJONNSSONFIT | PROTOCOLO DE TREINO & QUEIMA METABÓLICA', 14, 11);

  currentY = 24;

  const locLabel = data.workoutPlan.location === 'academia' ? 'Academia Completa' : 'Treino em Casa (Calistenia/HIIT)';
  doc.setFontSize(8.5);
  doc.setTextColor(...textDark);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Ambiente: ${locLabel}  |  Nível: ${data.workoutPlan.level.toUpperCase()}  |  Frequência: ${data.workoutPlan.frequency}x por semana  |  Duração: ${data.workoutPlan.duration} min`,
    14,
    currentY
  );

  currentY += 6;

  // Renderizar cada um dos dias de treino
  data.workoutPlan.days.forEach((day, index) => {
    // Quebra de página se necessário
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...navyBrand);
    doc.text(`${day.dayLabel}: ${day.title}`, 14, currentY);

    const exerciseRows = day.exercises.map((ex) => [
      ex.name,
      ex.muscle,
      ex.sets,
      ex.reps,
      ex.rest,
      ex.notes,
    ]);

    // Linha do Finalizador de Cárdio
    exerciseRows.push([
      `[FINALIZADOR] ${day.cardioFinisher.title}`,
      'Queima Calórica',
      '-',
      day.cardioFinisher.duration,
      '-',
      `${day.cardioFinisher.protocol} (Gasto est.: ${day.cardioFinisher.caloriesBurnEst})`,
    ]);

    autoTable(doc, {
      startY: currentY + 2,
      margin: { left: 14, right: 14 },
      head: [['Exercício', 'Músculo', 'Séries', 'Reps', 'Descanso', 'Execução Técnica']],
      body: exerciseRows,
      theme: 'grid',
      headStyles: {
        fillColor: slateDark,
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [30, 41, 59],
        cellPadding: 2,
      },
      columnStyles: {
        0: { cellWidth: 42, fontStyle: 'bold' },
        1: { cellWidth: 26 },
        2: { cellWidth: 14, halign: 'center' },
        3: { cellWidth: 22, halign: 'center' },
        4: { cellWidth: 16, halign: 'center' },
        5: { cellWidth: 62 },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 6;
  });

  // 6. Checklist de Hábitos do Projeto Verão
  if (currentY > 245) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, currentY, 182, 32, 2, 2, 'F');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...navyBrand);
  doc.text('CHECKLIST DIÁRIO DO PROJETO VERÃO RJONNSSONFIT', 18, currentY + 6);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textDark);
  doc.text('[  ] Ingerir a meta diária de água calculada (35-40ml por kg)', 18, currentY + 12);
  doc.text('[  ] Pesar as proteínas e carboidratos da dieta na balança de cozinha', 18, currentY + 17);
  doc.text('[  ] Concluir o treino de força programado para o dia', 18, currentY + 22);
  doc.text('[  ] Executar o finalizador de cárdio para acelerar o déficit de 700 kcal', 18, currentY + 27);

  // Rodapé em todas as páginas
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(
      `RJonnssonFit • Sistema de Prescrição Nutricional & Treinamento • Página ${i} de ${pageCount}`,
      105,
      292,
      { align: 'center' }
    );
  }

  doc.save(`RJonnssonFit_Plano_Completo_${data.weight}kg.pdf`);
}
