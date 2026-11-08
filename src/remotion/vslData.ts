export interface VslSegment {
  idx: number;
  srcStart: number;
  srcEnd: number;
  outStart: number;
  outEnd: number;
  zoom: number;
  originY?: string;
}

export interface VslCaptionChunk {
  id: number;
  srcStart: number;
  srcEnd: number;
  text: string;
  highlightWords?: string[];
  accentColor?: 'green' | 'yellow' | 'red';
}

export interface VslBrollItem {
  id: string;
  srcStart: number;
  srcEnd: number;
  type: 'image' | 'video';
  src: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  accent?: 'green' | 'red' | 'yellow';
  fit?: 'cover' | 'contain';
}

export interface VslSfxEvent {
  srcTime: number;
  sfx: 'whoosh' | 'impact' | 'cash' | 'alert' | 'riser';
  volume?: number;
}

export const VSL_SEGMENTS: VslSegment[] = [
  {
    "idx": 0,
    "srcStart": 0,
    "srcEnd": 0.9,
    "outStart": 0,
    "outEnd": 0.9,
    "zoom": 1,
    "originY": "35%"
  },
  {
    "idx": 1,
    "srcStart": 0.9,
    "srcEnd": 3.1,
    "outStart": 0.9,
    "outEnd": 3.1,
    "zoom": 1.12,
    "originY": "30%"
  },
  {
    "idx": 2,
    "srcStart": 3.1,
    "srcEnd": 6.5,
    "outStart": 3.1,
    "outEnd": 6.5,
    "zoom": 1.04,
    "originY": "35%"
  },
  {
    "idx": 3,
    "srcStart": 6.5,
    "srcEnd": 8.7667,
    "outStart": 6.5,
    "outEnd": 8.7667,
    "zoom": 1.16,
    "originY": "30%"
  },
  {
    "idx": 4,
    "srcStart": 8.7667,
    "srcEnd": 11.8667,
    "outStart": 8.7667,
    "outEnd": 11.8667,
    "zoom": 1.02,
    "originY": "35%"
  },
  {
    "idx": 5,
    "srcStart": 11.8667,
    "srcEnd": 15.9333,
    "outStart": 11.8667,
    "outEnd": 15.9333,
    "zoom": 1.14,
    "originY": "30%"
  },
  {
    "idx": 6,
    "srcStart": 15.9333,
    "srcEnd": 19.9333,
    "outStart": 15.9333,
    "outEnd": 19.9333,
    "zoom": 1.06,
    "originY": "35%"
  },
  {
    "idx": 7,
    "srcStart": 19.9333,
    "srcEnd": 23.5667,
    "outStart": 19.9333,
    "outEnd": 23.5667,
    "zoom": 1.18,
    "originY": "30%"
  },
  {
    "idx": 8,
    "srcStart": 23.5667,
    "srcEnd": 25.9667,
    "outStart": 23.5667,
    "outEnd": 25.9667,
    "zoom": 1,
    "originY": "35%"
  },
  {
    "idx": 9,
    "srcStart": 25.9667,
    "srcEnd": 30.5333,
    "outStart": 25.9667,
    "outEnd": 30.5333,
    "zoom": 1.12,
    "originY": "30%"
  },
  {
    "idx": 10,
    "srcStart": 30.5333,
    "srcEnd": 34.1,
    "outStart": 30.5333,
    "outEnd": 34.1,
    "zoom": 1.04,
    "originY": "35%"
  },
  {
    "idx": 11,
    "srcStart": 34.1,
    "srcEnd": 37.3667,
    "outStart": 34.1,
    "outEnd": 37.3667,
    "zoom": 1.16,
    "originY": "30%"
  },
  {
    "idx": 12,
    "srcStart": 37.3667,
    "srcEnd": 42.9,
    "outStart": 37.3667,
    "outEnd": 42.9,
    "zoom": 1.02,
    "originY": "35%"
  },
  {
    "idx": 13,
    "srcStart": 42.9,
    "srcEnd": 44.9667,
    "outStart": 42.9,
    "outEnd": 44.9667,
    "zoom": 1.14,
    "originY": "30%"
  },
  {
    "idx": 14,
    "srcStart": 44.9667,
    "srcEnd": 48.9333,
    "outStart": 44.9667,
    "outEnd": 48.9333,
    "zoom": 1.06,
    "originY": "35%"
  },
  {
    "idx": 15,
    "srcStart": 48.9333,
    "srcEnd": 52,
    "outStart": 48.9333,
    "outEnd": 52,
    "zoom": 1.18,
    "originY": "30%"
  },
  {
    "idx": 16,
    "srcStart": 52,
    "srcEnd": 55.9,
    "outStart": 52,
    "outEnd": 55.9,
    "zoom": 1,
    "originY": "35%"
  },
  {
    "idx": 17,
    "srcStart": 55.9,
    "srcEnd": 59.1333,
    "outStart": 55.9,
    "outEnd": 59.1333,
    "zoom": 1.12,
    "originY": "30%"
  },
  {
    "idx": 18,
    "srcStart": 59.1333,
    "srcEnd": 62.4667,
    "outStart": 59.1333,
    "outEnd": 62.4667,
    "zoom": 1.04,
    "originY": "35%"
  },
  {
    "idx": 19,
    "srcStart": 62.4667,
    "srcEnd": 64.4333,
    "outStart": 62.4667,
    "outEnd": 64.4333,
    "zoom": 1.16,
    "originY": "30%"
  },
  {
    "idx": 20,
    "srcStart": 64.4333,
    "srcEnd": 68.5,
    "outStart": 64.4333,
    "outEnd": 68.5,
    "zoom": 1.02,
    "originY": "35%"
  },
  {
    "idx": 21,
    "srcStart": 68.5,
    "srcEnd": 71.5333,
    "outStart": 68.5,
    "outEnd": 71.5333,
    "zoom": 1.14,
    "originY": "30%"
  },
  {
    "idx": 22,
    "srcStart": 71.5333,
    "srcEnd": 74.6,
    "outStart": 71.5333,
    "outEnd": 74.6,
    "zoom": 1.06,
    "originY": "35%"
  },
  {
    "idx": 23,
    "srcStart": 74.6,
    "srcEnd": 79.2333,
    "outStart": 74.6,
    "outEnd": 79.2333,
    "zoom": 1.18,
    "originY": "30%"
  },
  {
    "idx": 24,
    "srcStart": 79.2333,
    "srcEnd": 83.6667,
    "outStart": 79.2333,
    "outEnd": 83.6667,
    "zoom": 1,
    "originY": "35%"
  },
  {
    "idx": 25,
    "srcStart": 83.6667,
    "srcEnd": 85.8,
    "outStart": 83.6667,
    "outEnd": 85.8,
    "zoom": 1.12,
    "originY": "30%"
  },
  {
    "idx": 26,
    "srcStart": 85.8,
    "srcEnd": 90.4667,
    "outStart": 85.8,
    "outEnd": 90.4667,
    "zoom": 1.04,
    "originY": "35%"
  },
  {
    "idx": 27,
    "srcStart": 90.4667,
    "srcEnd": 92.6667,
    "outStart": 90.4667,
    "outEnd": 92.6667,
    "zoom": 1.16,
    "originY": "30%"
  },
  {
    "idx": 28,
    "srcStart": 92.6667,
    "srcEnd": 98.4667,
    "outStart": 92.6667,
    "outEnd": 98.4667,
    "zoom": 1.02,
    "originY": "35%"
  },
  {
    "idx": 29,
    "srcStart": 98.4667,
    "srcEnd": 100.5667,
    "outStart": 98.4667,
    "outEnd": 100.5667,
    "zoom": 1.14,
    "originY": "30%"
  },
  {
    "idx": 30,
    "srcStart": 100.5667,
    "srcEnd": 108.0667,
    "outStart": 100.5667,
    "outEnd": 108.0667,
    "zoom": 1.06,
    "originY": "35%"
  },
  {
    "idx": 31,
    "srcStart": 108.0667,
    "srcEnd": 110.7333,
    "outStart": 108.0667,
    "outEnd": 110.7333,
    "zoom": 1.18,
    "originY": "30%"
  },
  {
    "idx": 32,
    "srcStart": 110.7333,
    "srcEnd": 113.6667,
    "outStart": 110.7333,
    "outEnd": 113.6667,
    "zoom": 1,
    "originY": "35%"
  },
  {
    "idx": 33,
    "srcStart": 113.6667,
    "srcEnd": 116.2,
    "outStart": 113.6667,
    "outEnd": 116.2,
    "zoom": 1.12,
    "originY": "30%"
  },
  {
    "idx": 34,
    "srcStart": 116.2,
    "srcEnd": 124.9667,
    "outStart": 116.2,
    "outEnd": 124.9667,
    "zoom": 1.04,
    "originY": "35%"
  },
  {
    "idx": 35,
    "srcStart": 124.9667,
    "srcEnd": 129.0667,
    "outStart": 124.9667,
    "outEnd": 129.0667,
    "zoom": 1.16,
    "originY": "30%"
  },
  {
    "idx": 36,
    "srcStart": 129.0667,
    "srcEnd": 132.1333,
    "outStart": 129.0667,
    "outEnd": 132.1333,
    "zoom": 1.02,
    "originY": "35%"
  },
  {
    "idx": 37,
    "srcStart": 132.1333,
    "srcEnd": 135.4,
    "outStart": 132.1333,
    "outEnd": 135.4,
    "zoom": 1.14,
    "originY": "30%"
  },
  {
    "idx": 38,
    "srcStart": 135.4,
    "srcEnd": 141.7667,
    "outStart": 135.4,
    "outEnd": 141.7667,
    "zoom": 1.06,
    "originY": "35%"
  },
  {
    "idx": 39,
    "srcStart": 141.7667,
    "srcEnd": 143.9333,
    "outStart": 141.7667,
    "outEnd": 143.9333,
    "zoom": 1.18,
    "originY": "30%"
  },
  {
    "idx": 40,
    "srcStart": 143.9333,
    "srcEnd": 146.9667,
    "outStart": 143.9333,
    "outEnd": 146.9667,
    "zoom": 1,
    "originY": "35%"
  },
  {
    "idx": 41,
    "srcStart": 146.9667,
    "srcEnd": 150,
    "outStart": 146.9667,
    "outEnd": 150,
    "zoom": 1.12,
    "originY": "30%"
  },
  {
    "idx": 42,
    "srcStart": 150,
    "srcEnd": 152.8667,
    "outStart": 150,
    "outEnd": 152.8667,
    "zoom": 1.04,
    "originY": "35%"
  },
  {
    "idx": 43,
    "srcStart": 152.8667,
    "srcEnd": 154.8333,
    "outStart": 152.8667,
    "outEnd": 154.8333,
    "zoom": 1.16,
    "originY": "30%"
  },
  {
    "idx": 44,
    "srcStart": 154.8333,
    "srcEnd": 157.8333,
    "outStart": 154.8333,
    "outEnd": 157.8333,
    "zoom": 1.02,
    "originY": "35%"
  },
  {
    "idx": 45,
    "srcStart": 157.8333,
    "srcEnd": 161.1,
    "outStart": 157.8333,
    "outEnd": 161.1,
    "zoom": 1.14,
    "originY": "30%"
  },
  {
    "idx": 46,
    "srcStart": 161.1,
    "srcEnd": 163.1333,
    "outStart": 161.1,
    "outEnd": 163.1333,
    "zoom": 1.06,
    "originY": "35%"
  },
  {
    "idx": 47,
    "srcStart": 163.1333,
    "srcEnd": 166.6333,
    "outStart": 163.1333,
    "outEnd": 166.6333,
    "zoom": 1.18,
    "originY": "30%"
  },
  {
    "idx": 48,
    "srcStart": 166.6333,
    "srcEnd": 170.8667,
    "outStart": 166.6333,
    "outEnd": 170.8667,
    "zoom": 1,
    "originY": "35%"
  },
  {
    "idx": 49,
    "srcStart": 170.8667,
    "srcEnd": 178.0333,
    "outStart": 170.8667,
    "outEnd": 178.0333,
    "zoom": 1.12,
    "originY": "30%"
  },
  {
    "idx": 50,
    "srcStart": 178.0333,
    "srcEnd": 182.7,
    "outStart": 178.0333,
    "outEnd": 182.7,
    "zoom": 1.04,
    "originY": "35%"
  },
  {
    "idx": 51,
    "srcStart": 182.7,
    "srcEnd": 188.6667,
    "outStart": 182.7,
    "outEnd": 188.6667,
    "zoom": 1.16,
    "originY": "30%"
  },
  {
    "idx": 52,
    "srcStart": 188.6667,
    "srcEnd": 191.3333,
    "outStart": 188.6667,
    "outEnd": 191.3333,
    "zoom": 1.02,
    "originY": "35%"
  },
  {
    "idx": 53,
    "srcStart": 191.3333,
    "srcEnd": 194.6333,
    "outStart": 191.3333,
    "outEnd": 194.6333,
    "zoom": 1.14,
    "originY": "30%"
  },
  {
    "idx": 54,
    "srcStart": 194.6333,
    "srcEnd": 203.5333,
    "outStart": 194.6333,
    "outEnd": 203.5333,
    "zoom": 1.06,
    "originY": "35%"
  },
  {
    "idx": 55,
    "srcStart": 203.5333,
    "srcEnd": 208.7333,
    "outStart": 203.5333,
    "outEnd": 208.7333,
    "zoom": 1.18,
    "originY": "30%"
  },
  {
    "idx": 56,
    "srcStart": 208.7333,
    "srcEnd": 216.8333,
    "outStart": 208.7333,
    "outEnd": 216.8333,
    "zoom": 1,
    "originY": "35%"
  },
  {
    "idx": 57,
    "srcStart": 216.8333,
    "srcEnd": 220.4,
    "outStart": 216.8333,
    "outEnd": 220.4,
    "zoom": 1.12,
    "originY": "30%"
  },
  {
    "idx": 58,
    "srcStart": 220.4,
    "srcEnd": 226.8667,
    "outStart": 220.4,
    "outEnd": 226.8667,
    "zoom": 1.04,
    "originY": "35%"
  },
  {
    "idx": 59,
    "srcStart": 226.8667,
    "srcEnd": 231.5,
    "outStart": 226.8667,
    "outEnd": 231.5,
    "zoom": 1.16,
    "originY": "30%"
  },
  {
    "idx": 60,
    "srcStart": 231.5,
    "srcEnd": 242.3,
    "outStart": 231.5,
    "outEnd": 242.3,
    "zoom": 1.02,
    "originY": "35%"
  },
  {
    "idx": 61,
    "srcStart": 242.3,
    "srcEnd": 244.5667,
    "outStart": 242.3,
    "outEnd": 244.5667,
    "zoom": 1.14,
    "originY": "30%"
  },
  {
    "idx": 62,
    "srcStart": 244.5667,
    "srcEnd": 250.2667,
    "outStart": 244.5667,
    "outEnd": 250.2667,
    "zoom": 1.06,
    "originY": "35%"
  },
  {
    "idx": 63,
    "srcStart": 250.2667,
    "srcEnd": 254.3333,
    "outStart": 250.2667,
    "outEnd": 254.3333,
    "zoom": 1.18,
    "originY": "30%"
  },
  {
    "idx": 64,
    "srcStart": 254.3333,
    "srcEnd": 262.4,
    "outStart": 254.3333,
    "outEnd": 262.4,
    "zoom": 1,
    "originY": "35%"
  },
  {
    "idx": 65,
    "srcStart": 262.4,
    "srcEnd": 268.6,
    "outStart": 262.4,
    "outEnd": 268.6,
    "zoom": 1.12,
    "originY": "30%"
  },
  {
    "idx": 66,
    "srcStart": 268.6,
    "srcEnd": 271.8667,
    "outStart": 268.6,
    "outEnd": 271.8667,
    "zoom": 1.04,
    "originY": "35%"
  },
  {
    "idx": 67,
    "srcStart": 271.8667,
    "srcEnd": 273.6333,
    "outStart": 271.8667,
    "outEnd": 273.6333,
    "zoom": 1.16,
    "originY": "30%"
  },
  {
    "idx": 68,
    "srcStart": 273.6333,
    "srcEnd": 276.2667,
    "outStart": 273.6333,
    "outEnd": 276.2667,
    "zoom": 1.02,
    "originY": "35%"
  },
  {
    "idx": 69,
    "srcStart": 276.2667,
    "srcEnd": 281.1,
    "outStart": 276.2667,
    "outEnd": 281.1,
    "zoom": 1.14,
    "originY": "30%"
  },
  {
    "idx": 70,
    "srcStart": 281.1,
    "srcEnd": 286.6667,
    "outStart": 281.1,
    "outEnd": 286.6667,
    "zoom": 1.06,
    "originY": "35%"
  },
  {
    "idx": 71,
    "srcStart": 286.6667,
    "srcEnd": 290.2333,
    "outStart": 286.6667,
    "outEnd": 290.2333,
    "zoom": 1.18,
    "originY": "30%"
  },
  {
    "idx": 72,
    "srcStart": 290.2333,
    "srcEnd": 291.4667,
    "outStart": 290.2333,
    "outEnd": 291.4667,
    "zoom": 1,
    "originY": "35%"
  },
  {
    "idx": 73,
    "srcStart": 291.4667,
    "srcEnd": 294.5667,
    "outStart": 291.4667,
    "outEnd": 294.5667,
    "zoom": 1.12,
    "originY": "30%"
  },
  {
    "idx": 74,
    "srcStart": 294.5667,
    "srcEnd": 299.6667,
    "outStart": 294.5667,
    "outEnd": 299.6667,
    "zoom": 1.04,
    "originY": "35%"
  },
  {
    "idx": 75,
    "srcStart": 299.6667,
    "srcEnd": 305.3333,
    "outStart": 299.6667,
    "outEnd": 305.3333,
    "zoom": 1.16,
    "originY": "30%"
  }
];

export const TOTAL_VSL_DURATION_SEC = 305.3333; // 9160 frames @ 30fps

export const OFFER_CTA_START_SEC = 226.8667;
export const GUARANTEE_BADGE_START_SEC = 262.4;
export const GUARANTEE_BADGE_END_SEC = 291.4667;

export function mapSrcTimeToOutTime(srcTime: number): number {
  return Math.min(TOTAL_VSL_DURATION_SEC, Math.max(0, srcTime));
}

export const VSL_CAPTIONS: VslCaptionChunk[] = [
  {
    "id": 1,
    "srcStart": 0,
    "srcEnd": 0.8333,
    "text": "Fala, irmão!",
    "highlightWords": [
      "irmão!"
    ],
    "accentColor": "green"
  },
  {
    "id": 2,
    "srcStart": 0.9,
    "srcEnd": 3.0333,
    "text": "O VERÃO tá aqui batendo na nossa porta!",
    "highlightWords": [
      "VERÃO",
      "porta!"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 3,
    "srcStart": 3.1,
    "srcEnd": 6.4333,
    "text": "E eu sei exatamente qual é o seu MAIOR PESADELO nessa época:",
    "highlightWords": [
      "MAIOR",
      "PESADELO"
    ],
    "accentColor": "red"
  },
  {
    "id": 4,
    "srcStart": 6.5,
    "srcEnd": 8.7,
    "text": "É o momento de ir pra PRAIA, pra PISCINA,",
    "highlightWords": [
      "PRAIA,",
      "PISCINA,"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 5,
    "srcStart": 8.7667,
    "srcEnd": 11.8,
    "text": "ou para um CHURRASCO e ter que TIRAR A CAMISA na frente dos outros!",
    "highlightWords": [
      "CHURRASCO",
      "TIRAR",
      "CAMISA"
    ],
    "accentColor": "red"
  },
  {
    "id": 6,
    "srcStart": 11.8667,
    "srcEnd": 15.8667,
    "text": "Eu sei que a maioria das camisas no seu guarda-roupa são PRETAS E LARGAS.",
    "highlightWords": [
      "PRETAS",
      "LARGAS."
    ],
    "accentColor": "yellow"
  },
  {
    "id": 7,
    "srcStart": 15.9333,
    "srcEnd": 19.8667,
    "text": "Você passa o dia inteiro PUXANDO O TECIDO do peito pra frente",
    "highlightWords": [
      "PUXANDO",
      "TECIDO"
    ],
    "accentColor": "red"
  },
  {
    "id": 8,
    "srcStart": 19.9333,
    "srcEnd": 23.5,
    "text": "pra DISFARÇAR ESSE VOLUME e esconder essa TETINHA que marca a roupa!",
    "highlightWords": [
      "DISFARÇAR",
      "VOLUME",
      "TETINHA"
    ],
    "accentColor": "red"
  },
  {
    "id": 9,
    "srcStart": 23.5667,
    "srcEnd": 25.9,
    "text": "Mas FICA COMIGO nos próximos minutos,",
    "highlightWords": [
      "FICA",
      "COMIGO"
    ],
    "accentColor": "green"
  },
  {
    "id": 10,
    "srcStart": 25.9667,
    "srcEnd": 30.4667,
    "text": "porque você NÃO PRECISA passar mais um verão com VERGONHA do seu corpo!",
    "highlightWords": [
      "NÃO",
      "PRECISA",
      "VERGONHA"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 11,
    "srcStart": 30.5333,
    "srcEnd": 34.0333,
    "text": "Eu vou te mostrar como SECAR A GORDURA do seu peito",
    "highlightWords": [
      "SECAR",
      "GORDURA"
    ],
    "accentColor": "green"
  },
  {
    "id": 12,
    "srcStart": 34.1,
    "srcEnd": 37.3,
    "text": "e começar a ver RESULTADOS já nos próximos 30 DIAS!",
    "highlightWords": [
      "RESULTADOS",
      "30",
      "DIAS!"
    ],
    "accentColor": "green"
  },
  {
    "id": 13,
    "srcStart": 37.3667,
    "srcEnd": 42.8333,
    "text": "A primeira coisa: a maioria dos homens NEM TEM GINECOMASTIA,",
    "highlightWords": [
      "NEM",
      "GINECOMASTIA,"
    ],
    "accentColor": "green"
  },
  {
    "id": 14,
    "srcStart": 42.9,
    "srcEnd": 44.9,
    "text": "que é um problema GENÉTICO que ocorre",
    "highlightWords": [
      "GENÉTICO"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 15,
    "srcStart": 44.9667,
    "srcEnd": 48.8667,
    "text": "quando o homem já nasce com predisposição ao aumento da GLÂNDULA MAMÁRIA,",
    "highlightWords": [
      "GLÂNDULA",
      "MAMÁRIA,"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 16,
    "srcStart": 48.9333,
    "srcEnd": 51.9333,
    "text": "ou é causado por alguma CAGADA HORMONAL que ele tenha feito.",
    "highlightWords": [
      "CAGADA",
      "HORMONAL"
    ],
    "accentColor": "red"
  },
  {
    "id": 17,
    "srcStart": 52,
    "srcEnd": 55.8333,
    "text": "A maioria dos homens só tem LIPOMASTIA,",
    "highlightWords": [
      "LIPOMASTIA,"
    ],
    "accentColor": "green"
  },
  {
    "id": 18,
    "srcStart": 55.9,
    "srcEnd": 59.0667,
    "text": "que é apenas o ACÚMULO DE GORDURA na região do peito!",
    "highlightWords": [
      "ACÚMULO",
      "GORDURA",
      "peito!"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 19,
    "srcStart": 59.1333,
    "srcEnd": 62.4,
    "text": "Isso acontece por causa do SEDENTARISMO, falta de treino",
    "highlightWords": [
      "SEDENTARISMO,",
      "treino"
    ],
    "accentColor": "red"
  },
  {
    "id": 20,
    "srcStart": 62.4667,
    "srcEnd": 64.3667,
    "text": "e o abuso de ÁLCOOL no final de semana!",
    "highlightWords": [
      "ÁLCOOL"
    ],
    "accentColor": "red"
  },
  {
    "id": 21,
    "srcStart": 64.4333,
    "srcEnd": 68.4333,
    "text": "Tudo isso ativa uma enzima no seu corpo chamada AROMATASE!",
    "highlightWords": [
      "AROMATASE!"
    ],
    "accentColor": "red"
  },
  {
    "id": 22,
    "srcStart": 68.5,
    "srcEnd": 71.4667,
    "text": "Essa maldita enzima pega a sua TESTOSTERONA de homem",
    "highlightWords": [
      "TESTOSTERONA"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 23,
    "srcStart": 71.5333,
    "srcEnd": 74.5333,
    "text": "e converte em ESTRADIOL, que é um hormônio FEMININO!",
    "highlightWords": [
      "ESTRADIOL,",
      "FEMININO!"
    ],
    "accentColor": "red"
  },
  {
    "id": 24,
    "srcStart": 74.6,
    "srcEnd": 79.1667,
    "text": "E o resultado? O seu corpo passa a ACUMULAR GORDURA nessa região,",
    "highlightWords": [
      "ACUMULAR",
      "GORDURA"
    ],
    "accentColor": "red"
  },
  {
    "id": 25,
    "srcStart": 79.2333,
    "srcEnd": 83.6,
    "text": "dando um ASPECTO FEMININO ao seu peito! E quando o homem percebe isso,",
    "highlightWords": [
      "ASPECTO",
      "FEMININO"
    ],
    "accentColor": "red"
  },
  {
    "id": 26,
    "srcStart": 83.6667,
    "srcEnd": 85.7333,
    "text": "ele só encontra DUAS SOLUÇÕES:",
    "highlightWords": [
      "DUAS",
      "SOLUÇÕES:"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 27,
    "srcStart": 85.8,
    "srcEnd": 90.4,
    "text": "A primeira é fazer uma CIRURGIA que não sai por menos de R$ 15.000!",
    "highlightWords": [
      "CIRURGIA",
      "R$",
      "15.000!"
    ],
    "accentColor": "red"
  },
  {
    "id": 28,
    "srcStart": 90.4667,
    "srcEnd": 92.6,
    "text": "E a segunda é ir pra ACADEMIA,",
    "highlightWords": [
      "ACADEMIA,"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 29,
    "srcStart": 92.6667,
    "srcEnd": 98.4,
    "text": "se matando com CARGAS SUPER PESADAS no supino e fazendo o treino ERRADO!",
    "highlightWords": [
      "CARGAS",
      "PESADAS",
      "ERRADO!"
    ],
    "accentColor": "red"
  },
  {
    "id": 30,
    "srcStart": 98.4667,
    "srcEnd": 100.5,
    "text": "E o que acontece? O PROBLEMA PIORA!",
    "highlightWords": [
      "PROBLEMA",
      "PIORA!"
    ],
    "accentColor": "red"
  },
  {
    "id": 31,
    "srcStart": 100.5667,
    "srcEnd": 108,
    "text": "O músculo cresce por baixo da gordura, EMPURRA ELA PRA FRENTE e fica AINDA PIOR!",
    "highlightWords": [
      "EMPURRA",
      "FRENTE",
      "PIOR!"
    ],
    "accentColor": "red"
  },
  {
    "id": 32,
    "srcStart": 108.0667,
    "srcEnd": 110.6667,
    "text": "E eu sei de tudo isso porque EU VIVI ISSO NA PELE!",
    "highlightWords": [
      "VIVI",
      "PELE!"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 33,
    "srcStart": 110.7333,
    "srcEnd": 113.6,
    "text": "Foram anos passando VERGONHA, me escondendo,",
    "highlightWords": [
      "VERGONHA,",
      "escondendo,"
    ],
    "accentColor": "red"
  },
  {
    "id": 34,
    "srcStart": 113.6667,
    "srcEnd": 116.1333,
    "text": "morrendo de medo do VENTO BATER contra a minha camisa!",
    "highlightWords": [
      "VENTO",
      "BATER"
    ],
    "accentColor": "red"
  },
  {
    "id": 35,
    "srcStart": 116.2,
    "srcEnd": 124.9,
    "text": "Até que consegui HACKEAR O MEU METABOLISMO com exercícios em ÂNGULOS ESPECÍFICOS pra puxar a fáscia,",
    "highlightWords": [
      "HACKEAR",
      "METABOLISMO",
      "ÂNGULOS",
      "ESPECÍFICOS"
    ],
    "accentColor": "green"
  },
  {
    "id": 36,
    "srcStart": 124.9667,
    "srcEnd": 129,
    "text": "e a manipulação metabólica exata para TRAVAR A AROMATASE!",
    "highlightWords": [
      "TRAVAR",
      "AROMATASE!"
    ],
    "accentColor": "green"
  },
  {
    "id": 37,
    "srcStart": 129.0667,
    "srcEnd": 132.0667,
    "text": "Em poucas semanas, meu peitoral que era FLÁCIDO E ESTUFADO",
    "highlightWords": [
      "FLÁCIDO",
      "ESTUFADO"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 38,
    "srcStart": 132.1333,
    "srcEnd": 135.3333,
    "text": "voltou a ter o FORMATO MASCULINO que sempre deveria ter!",
    "highlightWords": [
      "FORMATO",
      "MASCULINO"
    ],
    "accentColor": "green"
  },
  {
    "id": 39,
    "srcStart": 135.4,
    "srcEnd": 141.7,
    "text": "E esse mesmo método já foi VALIDADO por centenas de HOMENS COMUNS, exatamente como você,",
    "highlightWords": [
      "VALIDADO",
      "HOMENS",
      "COMUNS,"
    ],
    "accentColor": "green"
  },
  {
    "id": 40,
    "srcStart": 141.7667,
    "srcEnd": 143.8667,
    "text": "com os MESMOS PROBLEMAS que você!",
    "highlightWords": [
      "MESMOS",
      "PROBLEMAS"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 41,
    "srcStart": 143.9333,
    "srcEnd": 146.9,
    "text": "Eu peguei os EXERCÍCIOS CERTOS, os ÂNGULOS EXATOS",
    "highlightWords": [
      "EXERCÍCIOS",
      "CERTOS,",
      "ÂNGULOS"
    ],
    "accentColor": "green"
  },
  {
    "id": 42,
    "srcStart": 146.9667,
    "srcEnd": 149.9333,
    "text": "e o protocolo ANTI-AROMATASE e juntei tudo!",
    "highlightWords": [
      "ANTI-AROMATASE",
      "tudo!"
    ],
    "accentColor": "green"
  },
  {
    "id": 43,
    "srcStart": 150,
    "srcEnd": 152.8,
    "text": "E não: eu NÃO estou te entregando mais um PDF INÚTIL",
    "highlightWords": [
      "NÃO",
      "PDF",
      "INÚTIL"
    ],
    "accentColor": "red"
  },
  {
    "id": 44,
    "srcStart": 152.8667,
    "srcEnd": 154.7667,
    "text": "pra você baixar e NUNCA LER!",
    "highlightWords": [
      "NUNCA",
      "LER!"
    ],
    "accentColor": "red"
  },
  {
    "id": 45,
    "srcStart": 154.8333,
    "srcEnd": 157.7667,
    "text": "Eu criei um App: o QG SECA PEITORAL!",
    "highlightWords": [
      "App:",
      "QG",
      "SECA",
      "PEITORAL!"
    ],
    "accentColor": "green"
  },
  {
    "id": 46,
    "srcStart": 157.8333,
    "srcEnd": 161.0333,
    "text": "Um aplicativo completo que você instala no seu CELULAR",
    "highlightWords": [
      "completo",
      "CELULAR"
    ],
    "accentColor": "green"
  },
  {
    "id": 47,
    "srcStart": 161.1,
    "srcEnd": 163.0667,
    "text": "e leva pro TREINO e pra COZINHA!",
    "highlightWords": [
      "TREINO",
      "COZINHA!"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 48,
    "srcStart": 163.1333,
    "srcEnd": 166.5667,
    "text": "Lá dentro você tem o RASTREADOR DE SÉRIES e o CRONÔMETRO",
    "highlightWords": [
      "RASTREADOR",
      "SÉRIES",
      "CRONÔMETRO"
    ],
    "accentColor": "green"
  },
  {
    "id": 49,
    "srcStart": 166.6333,
    "srcEnd": 170.8,
    "text": "de DESCANSO TÁTICO para treinar na academia JUNTO COMIGO em vídeo!",
    "highlightWords": [
      "DESCANSO",
      "TÁTICO",
      "VÍDEO!"
    ],
    "accentColor": "green"
  },
  {
    "id": 50,
    "srcStart": 170.8667,
    "srcEnd": 177.9667,
    "text": "Tem o Guia Completo de BLOQUEIO ENZIMÁTICO pra parar o hormônio feminino e TRAVAR A AROMATASE hoje!",
    "highlightWords": [
      "BLOQUEIO",
      "ENZIMÁTICO",
      "TRAVAR",
      "AROMATASE"
    ],
    "accentColor": "green"
  },
  {
    "id": 51,
    "srcStart": 178.0333,
    "srcEnd": 182.6333,
    "text": "E pra garantir que seu resultado seja ABSOLUTO nesse VERÃO,",
    "highlightWords": [
      "ABSOLUTO",
      "VERÃO,"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 52,
    "srcStart": 182.7,
    "srcEnd": 188.6,
    "text": "destravando seu acesso HOJE, vou adicionar 3 BÔNUS EXCLUSIVOS na sua conta de graça:",
    "highlightWords": [
      "HOJE,",
      "3",
      "BÔNUS",
      "GRAÇA:"
    ],
    "accentColor": "green"
  },
  {
    "id": 53,
    "srcStart": 188.6667,
    "srcEnd": 191.2667,
    "text": "O BÔNUS 1 é o Guia do EFEITO ARMADURA:",
    "highlightWords": [
      "BÔNUS",
      "EFEITO",
      "ARMADURA:"
    ],
    "accentColor": "green"
  },
  {
    "id": 54,
    "srcStart": 191.3333,
    "srcEnd": 194.5667,
    "text": "Um hack biomecânico de postura de apenas ALGUNS SEGUNDOS",
    "highlightWords": [
      "hack",
      "ALGUNS",
      "SEGUNDOS"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 55,
    "srcStart": 194.6333,
    "srcEnd": 203.4667,
    "text": "que DISFARÇA INSTANTANEAMENTE o volume do peito enquanto o treino QUEIMA A GORDURA por baixo!",
    "highlightWords": [
      "DISFARÇA",
      "INSTANTANEAMENTE",
      "QUEIMA",
      "GORDURA"
    ],
    "accentColor": "green"
  },
  {
    "id": 56,
    "srcStart": 203.5333,
    "srcEnd": 208.6667,
    "text": "O BÔNUS 2 é a CALCULADORA TÁTICA DE DIETA focada em travar a sua Aromatase:",
    "highlightWords": [
      "BÔNUS",
      "CALCULADORA",
      "TÁTICA",
      "DIETA"
    ],
    "accentColor": "green"
  },
  {
    "id": 57,
    "srcStart": 208.7333,
    "srcEnd": 216.7667,
    "text": "Uma ferramenta de INTELIGÊNCIA ARTIFICIAL dentro do App que calcula seus macros e monta sua DIETA INDIVIDUALIZADA",
    "highlightWords": [
      "INTELIGÊNCIA",
      "ARTIFICIAL",
      "DIETA",
      "INDIVIDUALIZADA"
    ],
    "accentColor": "green"
  },
  {
    "id": 58,
    "srcStart": 216.8333,
    "srcEnd": 220.3333,
    "text": "para começar o seu BLOQUEIO METABÓLICO o mais rápido possível!",
    "highlightWords": [
      "BLOQUEIO",
      "METABÓLICO"
    ],
    "accentColor": "green"
  },
  {
    "id": 59,
    "srcStart": 220.4,
    "srcEnd": 226.8,
    "text": "E o BÔNUS 3 é a CENTRAL DE DOWNLOADS: todos os PDFs da Ficha e CALENDÁRIOS pra imprimir!",
    "highlightWords": [
      "BÔNUS",
      "CENTRAL",
      "DOWNLOADS:",
      "CALENDÁRIOS"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 60,
    "srcStart": 226.8667,
    "srcEnd": 231.4333,
    "text": "Se você fosse pagar um ENDOCRINOLOGISTA pra alinhar seus hormônios,",
    "highlightWords": [
      "ENDOCRINOLOGISTA",
      "hormônios,"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 61,
    "srcStart": 231.5,
    "srcEnd": 242.2333,
    "text": "um PERSONAL especialista em biomecânica e um NUTRICIONISTA, gastaria mais de R$ 1.200 POR MÊS!",
    "highlightWords": [
      "PERSONAL",
      "NUTRICIONISTA,",
      "R$",
      "1.200"
    ],
    "accentColor": "red"
  },
  {
    "id": 62,
    "srcStart": 242.3,
    "srcEnd": 244.5,
    "text": "Mas você NÃO VAI PAGAR nem um terço disso!",
    "highlightWords": [
      "NÃO",
      "PAGAR"
    ],
    "accentColor": "green"
  },
  {
    "id": 63,
    "srcStart": 244.5667,
    "srcEnd": 250.2,
    "text": "Para ter o ACESSO VITALÍCIO ao App QG SECA PEITORAL hoje, com todos os bônus inclusos,",
    "highlightWords": [
      "ACESSO",
      "VITALÍCIO",
      "SECA",
      "PEITORAL"
    ],
    "accentColor": "green"
  },
  {
    "id": 64,
    "srcStart": 250.2667,
    "srcEnd": 254.2667,
    "text": "o seu investimento será de apenas R$ 107,90!",
    "highlightWords": [
      "apenas",
      "R$",
      "107,90!"
    ],
    "accentColor": "green"
  },
  {
    "id": 65,
    "srcStart": 254.3333,
    "srcEnd": 262.3333,
    "text": "Irmão, isso é mais barato que a PIZZA E A CERVEJA do fim de semana que só INFLAMAM a sua lipomastia!",
    "highlightWords": [
      "PIZZA",
      "CERVEJA",
      "INFLAMAM"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 66,
    "srcStart": 262.4,
    "srcEnd": 268.5333,
    "text": "E eu tenho tanta certeza que o App Seca Peitoral muda seu corpo, que vou fazer algo ABSURDO:",
    "highlightWords": [
      "certeza",
      "ABSURDO:"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 67,
    "srcStart": 268.6,
    "srcEnd": 271.8,
    "text": "Eu não vou te dar nem 7, nem 15 dias de garantia...",
    "highlightWords": [
      "7,",
      "15"
    ],
    "accentColor": "red"
  },
  {
    "id": 68,
    "srcStart": 271.8667,
    "srcEnd": 273.5667,
    "text": "Eu vou te dar 30 DIAS DE GARANTIA!",
    "highlightWords": [
      "30",
      "DIAS",
      "GARANTIA!"
    ],
    "accentColor": "green"
  },
  {
    "id": 69,
    "srcStart": 273.6333,
    "srcEnd": 276.2,
    "text": "Você vai acessar o App AGORA, fazer os treinos,",
    "highlightWords": [
      "App",
      "AGORA,"
    ],
    "accentColor": "green"
  },
  {
    "id": 70,
    "srcStart": 276.2667,
    "srcEnd": 281.0333,
    "text": "usar a CALCULADORA, montar sua dieta anti-aromatase e aplicar tudo 100%!",
    "highlightWords": [
      "CALCULADORA,",
      "100%!"
    ],
    "accentColor": "green"
  },
  {
    "id": 71,
    "srcStart": 281.1,
    "srcEnd": 286.6,
    "text": "Se daqui a 30 DIAS você se olhar no espelho e o volume do peito não tiver diminuído,",
    "highlightWords": [
      "30",
      "DIAS",
      "diminuído,"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 72,
    "srcStart": 286.6667,
    "srcEnd": 290.1667,
    "text": "você me manda uma mensagem, aperta um botão e eu devolvo 100% DO SEU DINHEIRO!",
    "highlightWords": [
      "100%",
      "DINHEIRO!"
    ],
    "accentColor": "green"
  },
  {
    "id": 73,
    "srcStart": 290.2333,
    "srcEnd": 291.4,
    "text": "O RISCO É TODO MEU!",
    "highlightWords": [
      "RISCO",
      "MEU!"
    ],
    "accentColor": "green"
  },
  {
    "id": 74,
    "srcStart": 291.4667,
    "srcEnd": 294.5,
    "text": "Agora A ESCOLHA É SUA: você pode ignorar esse vídeo",
    "highlightWords": [
      "ESCOLHA",
      "SUA:"
    ],
    "accentColor": "yellow"
  },
  {
    "id": 75,
    "srcStart": 294.5667,
    "srcEnd": 299.6,
    "text": "e passar mais um verão inteiro sofrendo debaixo do GUARDA-SOL numa CAMISA PRETA,",
    "highlightWords": [
      "GUARDA-SOL",
      "CAMISA",
      "PRETA,"
    ],
    "accentColor": "red"
  },
  {
    "id": 76,
    "srcStart": 299.6667,
    "srcEnd": 305.2667,
    "text": "ou tomar uma ATITUDE DE HOMEM, clicar no botão aqui embaixo e RESOLVER ISSO DE VEZ!",
    "highlightWords": [
      "ATITUDE",
      "HOMEM,",
      "RESOLVER"
    ],
    "accentColor": "green"
  }
];

export const VSL_BROLLS: VslBrollItem[] = [
  {
    "id": "broll-churrasco-verao",
    "srcStart": 6.5,
    "srcEnd": 11.8667,
    "type": "image",
    "src": "vsl/broll-churrasco-verao.jpg",
    "badge": "PESADELO NO VERÃO",
    "title": "PRAIA, PISCINA E CHURRASCO",
    "subtitle": "O pavor de precisar tirar a camisa na frente de todo mundo",
    "accent": "red",
    "fit": "cover"
  },
  {
    "id": "broll-black-shirts",
    "srcStart": 11.8667,
    "srcEnd": 23.5667,
    "type": "image",
    "src": "vsl/broll-black-shirts.jpg",
    "badge": "O UNIFORME DA INSEGURANÇA",
    "title": "SÓ CAMISAS PRETAS E LARGAS",
    "subtitle": "Puxando o tecido pra frente o dia inteiro para esconder a tetinha",
    "accent": "red",
    "fit": "cover"
  },
  {
    "id": "broll-xray",
    "srcStart": 37.3667,
    "srcEnd": 59.1333,
    "type": "video",
    "src": "vsl/broll-xray.mp4",
    "badge": "DIAGNÓSTICO REAL",
    "title": "LIPOMASTIA ≠ GINECOMASTIA",
    "subtitle": "90% dos homens não têm glândula genética — têm apenas gordura localizada",
    "accent": "green",
    "fit": "cover"
  },
  {
    "id": "broll-aromatase",
    "srcStart": 64.4333,
    "srcEnd": 83.6667,
    "type": "image",
    "src": "vsl/broll-aromatase.jpg",
    "badge": "INIMIGO INVISÍVEL: AROMATASE",
    "title": "TESTOSTERONA ➔ ESTRADIOL",
    "subtitle": "A enzima que converte seu hormônio masculino em estrogênio e estufa o peito",
    "accent": "red",
    "fit": "cover"
  },
  {
    "id": "broll-surgery",
    "srcStart": 85.8,
    "srcEnd": 90.4667,
    "type": "image",
    "src": "vsl/broll-surgery.jpg",
    "badge": "FALSA SOLUÇÃO #1: BISTURI",
    "title": "CIRURGIA: + R$ 15.000,00",
    "subtitle": "Cicatrizes permanentes, pós-operatório doloroso e custo inacessível",
    "accent": "red",
    "fit": "cover"
  },
  {
    "id": "broll-supino-erro",
    "srcStart": 90.4667,
    "srcEnd": 100.5667,
    "type": "video",
    "src": "vsl/broll-supino-video.mp4",
    "badge": "FALSA SOLUÇÃO #2: TREINO ERRADO",
    "title": "CARGAS PESADAS NO SUPINO",
    "subtitle": "Se matar no supino tradicional só piora o formato do peitoral",
    "accent": "red",
    "fit": "cover"
  },
  {
    "id": "broll-supino-fascia",
    "srcStart": 98.4667,
    "srcEnd": 108.0667,
    "type": "image",
    "src": "vsl/broll-supino-fascia.jpg",
    "badge": "POR QUE O PROBLEMA PIORA",
    "title": "O EFEITO EMPURRÃO NO PEITO",
    "subtitle": "O músculo cresce por debaixo da gordura e projeta a tetinha ainda mais pra frente",
    "accent": "red",
    "fit": "cover"
  },
  {
    "id": "broll-pool-wide",
    "srcStart": 110.7333,
    "srcEnd": 116.2,
    "type": "image",
    "src": "vsl/broll-pool-wide.jpg",
    "badge": "EU VIVI ISSO NA PELE",
    "title": "ANOS ME ESCONDENDO DO VENTO",
    "subtitle": "Passando vergonha e evitando qualquer lugar sem camisa",
    "accent": "yellow",
    "fit": "cover"
  },
  {
    "id": "broll-anatomia-plano",
    "srcStart": 116.2,
    "srcEnd": 129.0667,
    "type": "image",
    "src": "vsl/broll-anatomia-plano.png",
    "badge": "HACK BIOMECÂNICO + METABÓLICO",
    "title": "TRAÇÃO DA FÁSCIA + ANTI-AROMATASE",
    "subtitle": "Exercícios em ângulos específicos para puxar a fáscia pra cima e travar a enzima",
    "accent": "green",
    "fit": "cover"
  },
  {
    "id": "broll-antes-depois-autor",
    "srcStart": 129.0667,
    "srcEnd": 135.4,
    "type": "image",
    "src": "vsl/broll-antes-depois.jpg",
    "badge": "MINHA TRANSFORMAÇÃO REAL",
    "title": "DE PEITO ESTUFADO A PEITORAL MASCULINO",
    "subtitle": "Em poucas semanas, sem cirurgia — apenas biomecânica e bloqueio da aromatase",
    "accent": "green",
    "fit": "contain"
  },
  {
    "id": "broll-aluno-tales",
    "srcStart": 135.4,
    "srcEnd": 143.9333,
    "type": "image",
    "src": "vsl/broll-aluno-tales.jpg",
    "badge": "VALIDADO POR CENTENAS DE HOMENS",
    "title": "RESULTADOS REAIS DE ALUNOS",
    "subtitle": "Homens comuns que eliminaram o aspecto estufado do peitoral",
    "accent": "green",
    "fit": "contain"
  },
  {
    "id": "broll-app-qg",
    "srcStart": 154.8333,
    "srcEnd": 163.1333,
    "type": "image",
    "src": "vsl/broll-app-qg.jpg",
    "badge": "A EVOLUÇÃO: NÃO É UM PDF INÚTIL",
    "title": "APP QG SECA PEITORAL",
    "subtitle": "Aplicativo completo instalado no seu celular para o treino e para a cozinha",
    "accent": "green",
    "fit": "cover"
  },
  {
    "id": "broll-exercicios",
    "srcStart": 163.1333,
    "srcEnd": 170.8667,
    "type": "image",
    "src": "vsl/broll-exercicios.png",
    "badge": "DENTRO DO APLICATIVO",
    "title": "RASTREADOR DE SÉRIES + CRONÔMETRO TÁTICO",
    "subtitle": "Treine na academia junto comigo em vídeo nos ângulos exatos",
    "accent": "green",
    "fit": "contain"
  },
  {
    "id": "broll-bloqueio-enzimatico",
    "srcStart": 170.8667,
    "srcEnd": 178.0333,
    "type": "image",
    "src": "vsl/broll-bloqueio-enzimatico.jpg",
    "badge": "PROTOCOLO HORMONAL NATURAL",
    "title": "GUIA DE BLOQUEIO ENZIMÁTICO",
    "subtitle": "Pare de converter testosterona em hormônio feminino hoje mesmo",
    "accent": "green",
    "fit": "cover"
  },
  {
    "id": "broll-bonus-armadura",
    "srcStart": 188.6667,
    "srcEnd": 203.5333,
    "type": "image",
    "src": "vsl/broll-bonus-armadura.jpg",
    "badge": "BÔNUS EXCLUSIVO #1 (GRÁTIS HOJE)",
    "title": "GUIA \"O EFEITO ARMADURA\"",
    "subtitle": "Hack biomecânico de postura de poucos segundos que disfarça o volume na hora",
    "accent": "green",
    "fit": "cover"
  },
  {
    "id": "broll-bonus-calculadora",
    "srcStart": 203.5333,
    "srcEnd": 220.4,
    "type": "image",
    "src": "vsl/broll-bonus-calculadora.jpg",
    "badge": "BÔNUS EXCLUSIVO #2 (INTELIGÊNCIA ARTIFICIAL)",
    "title": "CALCULADORA TÁTICA DE DIETA IA",
    "subtitle": "Calcula seus macros e monta uma dieta individualizada anti-aromatase",
    "accent": "green",
    "fit": "cover"
  },
  {
    "id": "broll-bonus-downloads",
    "srcStart": 220.4,
    "srcEnd": 226.8667,
    "type": "image",
    "src": "vsl/broll-bonus-downloads.jpg",
    "badge": "BÔNUS EXCLUSIVO #3 (GRÁTIS HOJE)",
    "title": "CENTRAL DE DOWNLOADS + CALENDÁRIO",
    "subtitle": "Todos os PDFs da ficha de treino e calendários prontos para imprimir",
    "accent": "green",
    "fit": "cover"
  },
  {
    "id": "broll-ancoragem-107",
    "srcStart": 244.5667,
    "srcEnd": 262.4,
    "type": "image",
    "src": "vsl/broll-ancoragem-107.jpg",
    "badge": "OFERTA EXCLUSIVA DE VERÃO",
    "title": "ACESSO VITALÍCIO: R$ 107,90",
    "subtitle": "Mais barato que a pizza e a cerveja que inflamam sua lipomastia no fim de semana",
    "accent": "green",
    "fit": "cover"
  },
  {
    "id": "broll-garantia-30dias",
    "srcStart": 268.6,
    "srcEnd": 291.4667,
    "type": "image",
    "src": "vsl/broll-garantia-30dias.jpg",
    "badge": "GARANTIA INCONDICIONAL DE 30 DIAS",
    "title": "30 DIAS DE RISCO ZERO",
    "subtitle": "Se o volume do peito não diminuir em 30 dias, devolvo 100% em 1 clique",
    "accent": "green",
    "fit": "cover"
  },
  {
    "id": "broll-pool-sad",
    "srcStart": 294.5667,
    "srcEnd": 299.6667,
    "type": "image",
    "src": "vsl/broll-pool-sad.jpg",
    "badge": "A ESCOLHA É SUA",
    "title": "MAIS UM VERÃO DE CAMISA PRETA?",
    "subtitle": "Toque no botão abaixo e resolva isso de uma vez por todas",
    "accent": "red",
    "fit": "cover"
  }
];

export const VSL_SFX_EVENTS: VslSfxEvent[] = [];
