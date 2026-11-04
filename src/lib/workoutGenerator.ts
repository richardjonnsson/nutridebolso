import {
  WorkoutLocation,
  WorkoutLevel,
  WorkoutFrequency,
  WorkoutDuration,
  WorkoutFocus,
  WorkoutPlan,
  WorkoutDay,
  ExerciseItem,
} from '@/types/diet';

export function generateWorkoutPlan(params: {
  location: WorkoutLocation;
  level: WorkoutLevel;
  frequency: WorkoutFrequency;
  duration: WorkoutDuration;
  focus: WorkoutFocus;
  hasDumbbellsOrBands?: boolean;
}): WorkoutPlan {
  const { location, level, frequency, duration, focus, hasDumbbellsOrBands } = params;

  const isGym = location === 'academia';

  // Gerar dias conforme frequência e local
  const days: WorkoutDay[] = [];

  if (isGym) {
    if (frequency === 3) {
      // Divisão 3x na semana Academia: Full Body ou ABC
      days.push({
        id: 'gym-3-a',
        dayLabel: 'Treino A (Segunda)',
        title: 'Força & Queima: Peito, Ombros e Tríceps + Esteira Inclinada',
        targetMuscles: ['Peitoral', 'Deltóide Anterior/Lateral', 'Tríceps'],
        exercises: [
          {
            id: 'ex-1',
            name: 'Supino Reto com Halteres',
            muscle: 'Peitoral Maior',
            sets: level === 'iniciante' ? '3' : '4',
            reps: '8 - 12 reps',
            rest: '60s',
            notes: 'Desça controlando em 3 segundos, amplitude completa sem bater os halteres no topo.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-2',
            name: 'Crucifixo Inclinado no Banco 30°',
            muscle: 'Peitoral Superior',
            sets: '3',
            reps: '10 - 12 reps',
            rest: '45s',
            notes: 'Foco em abrir bem a caixa torácica no ponto mais baixo e contrair o topo.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-3',
            name: 'Desenvolvimento Militar com Halteres',
            muscle: 'Deltóides',
            sets: '3',
            reps: '10 - 12 reps',
            rest: '45s',
            notes: 'Tronco firme, abdômen contraído, empurre acima da cabeça sem arquear a lombar.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-4',
            name: 'Elevação Lateral na Polia ou Halteres',
            muscle: 'Deltóide Lateral',
            sets: '4',
            reps: '12 - 15 reps',
            rest: '30s',
            notes: 'Mantenha os cotovelos levemente flexionados, eleve até a altura do ombro.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-5',
            name: 'Tríceps Corda na Polia Alta',
            muscle: 'Tríceps',
            sets: '3',
            reps: '12 - 15 reps',
            rest: '45s',
            notes: 'Abra a corda no final do movimento apertando bem a porção lateral do tríceps.',
            isHomeFriendly: false,
          },
        ],
        cardioFinisher: {
          title: 'Cárdio Metabólico de Verão (Esteira Inclinada)',
          duration: '15 a 20 min',
          protocol: 'Velocidade 5.5 a 6.0 km/h com inclinação de 8% a 12%. Mantenha ritmo constante sem segurar nas barras.',
          caloriesBurnEst: '~180 - 220 kcal',
        },
      });

      days.push({
        id: 'gym-3-b',
        dayLabel: 'Treino B (Quarta)',
        title: 'Densidade & Postura: Costas, Trapézio, Bíceps e Abdômen',
        targetMuscles: ['Dorsal', 'Rombóides', 'Bíceps', 'Core'],
        exercises: [
          {
            id: 'ex-6',
            name: 'Puxada Frontal no Pulley (Pegada Pronada)',
            muscle: 'Grande Dorsal',
            sets: level === 'iniciante' ? '3' : '4',
            reps: '10 - 12 reps',
            rest: '60s',
            notes: 'Puxe em direção à parte superior do peito com escápulas travadas para trás.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-7',
            name: 'Remada Baixa no Triângulo',
            muscle: 'Espessura de Costas',
            sets: '3',
            reps: '10 - 12 reps',
            rest: '45s',
            notes: 'Puxe o triângulo contra o umbigo, esmagando as escápulas por 1 segundo.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-8',
            name: 'Crucifixo Invertido no Voador ou Halteres',
            muscle: 'Deltóide Posterior & Trapézio',
            sets: '3',
            reps: '12 - 15 reps',
            rest: '45s',
            notes: 'Fundamental para alinhar os ombros e dar porte atlético no verão.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-9',
            name: 'Rosca Direta com Barra W ou Halteres',
            muscle: 'Bíceps Braquial',
            sets: '3',
            reps: '10 - 12 reps',
            rest: '45s',
            notes: 'Cotovelos travados ao lado do corpo, sem balançar o tronco.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-10',
            name: 'Abdominal Supra na Polia ou Prancha Declivada',
            muscle: 'Reto Abdominal',
            sets: '4',
            reps: '15 - 20 reps',
            rest: '30s',
            notes: 'Expire todo o ar no topo contraindo o abdômen ao máximo.',
            isHomeFriendly: false,
          },
        ],
        cardioFinisher: {
          title: 'HIIT Queima Rápida no Transport / Elíptico',
          duration: '12 min',
          protocol: '1 minuto moderado / 30 segundos em intensidade máxima (sprint). Repita por 8 ciclos.',
          caloriesBurnEst: '~160 - 200 kcal',
        },
      });

      days.push({
        id: 'gym-3-c',
        dayLabel: 'Treino C (Sexta)',
        title: 'Potência Metabólica: Pernas Completas & Queimador Final',
        targetMuscles: ['Quadríceps', 'Posteriores', 'Glúteos', 'Panturrilhas'],
        exercises: [
          {
            id: 'ex-11',
            name: 'Leg Press 45°',
            muscle: 'Quadríceps & Glúteos',
            sets: '4',
            reps: '10 - 12 reps',
            rest: '60s',
            notes: 'Pés na largura dos ombros, desça até 90° sem desgrudar o quadril do banco.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-12',
            name: 'Cadeira Extensora',
            muscle: 'Quadríceps',
            sets: '3',
            reps: '12 - 15 reps',
            rest: '45s',
            notes: 'Segure 1 segundo no pico de contração para máxima definição muscular.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-13',
            name: 'Mesa Flexora ou Cadeira Flexora',
            muscle: 'Posteriores de Coxa',
            sets: '4',
            reps: '10 - 12 reps',
            rest: '45s',
            notes: 'Movimento cadenciado, não deixe os pesos baterem no retorno.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-14',
            name: 'Elevação de Panturrilha em Pé ou no Smith',
            muscle: 'Gastrocnêmio',
            sets: '4',
            reps: '15 - 20 reps',
            rest: '30s',
            notes: 'Amplitude máxima: alongue bem embaixo e fique na ponta dos dedos em cima.',
            isHomeFriendly: false,
          },
        ],
        cardioFinisher: {
          title: 'Simulador de Escada (StairMaster Fat Burn)',
          duration: '15 min',
          protocol: 'Passo ritmado nível 6 a 8. Maior ativador de gasto calórico e definição de glúteos e pernas.',
          caloriesBurnEst: '~220 - 260 kcal',
        },
      });
    } else if (frequency === 4) {
      // Divisão 4x na semana Academia: Upper / Lower A e B
      days.push({
        id: 'gym-4-a',
        dayLabel: 'Treino A (Segunda)',
        title: 'Upper Focus 1: Peito, Costas & Ombros',
        targetMuscles: ['Peitoral', 'Dorsal', 'Deltóides', 'Tríceps'],
        exercises: [
          {
            id: 'ex-41',
            name: 'Supino Inclinado com Halteres',
            muscle: 'Peitoral Superior',
            sets: '4',
            reps: '8 - 10 reps',
            rest: '60s',
            notes: 'Banco a 30°, amplitude máxima para preencher a parte alta do peito.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-42',
            name: 'Puxada Alta Articulada ou Pulley',
            muscle: 'Dorsal',
            sets: '4',
            reps: '10 - 12 reps',
            rest: '60s',
            notes: 'Puxe com os cotovelos apontando para o chão, focando nas costas.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-43',
            name: 'Desenvolvimento Halteres Sentado',
            muscle: 'Ombros',
            sets: '3',
            reps: '10 - 12 reps',
            rest: '45s',
            notes: 'Controle na descida até o nível da orelha e impulsione para cima.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-44',
            name: 'Elevação Lateral com Halteres',
            muscle: 'Deltóide Lateral',
            sets: '4',
            reps: '12 - 15 reps',
            rest: '30s',
            notes: 'Crie formato em V na silhueta para afinar visualmente a cintura.',
            isHomeFriendly: false,
          },
        ],
        cardioFinisher: {
          title: 'Caminhada Rápida Inclinada',
          duration: '15 min',
          protocol: 'Inclinação 10%, velocidade 5.8 km/h. Queima contínua sem quebrar massa magra.',
          caloriesBurnEst: '~180 kcal',
        },
      });

      days.push({
        id: 'gym-4-b',
        dayLabel: 'Treino B (Terça)',
        title: 'Lower Focus 1: Quadríceps, Glúteos & Panturrilhas',
        targetMuscles: ['Quadríceps', 'Glúteos', 'Panturrilhas'],
        exercises: [
          {
            id: 'ex-45',
            name: 'Agachamento no Hack ou Livre',
            muscle: 'Quadríceps & Glúteos',
            sets: '4',
            reps: '8 - 12 reps',
            rest: '75s',
            notes: 'Desça até a paralela com tronco estável, pés bem apoiados.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-46',
            name: 'Leg Press 45°',
            muscle: 'Quadríceps',
            sets: '4',
            reps: '10 - 12 reps',
            rest: '60s',
            notes: 'Foco na empurrada com os calcanhares.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-47',
            name: 'Cadeira Extensora',
            muscle: 'Quadríceps',
            sets: '3',
            reps: '12 - 15 reps',
            rest: '45s',
            notes: 'Pausa isométrica de 1 segundo em cima.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-48',
            name: 'Gêmeos Sentado na Máquina',
            muscle: 'Sóleo / Panturrilha',
            sets: '4',
            reps: '15 - 20 reps',
            rest: '30s',
            notes: 'Alongamento profundo no ponto inferior.',
            isHomeFriendly: false,
          },
        ],
        cardioFinisher: {
          title: 'Cárdio na Bicicleta Ergométrica',
          duration: '15 min',
          protocol: 'Giro ágil (85+ RPM) com carga moderada para acelerar a drenagem das pernas.',
          caloriesBurnEst: '~150 kcal',
        },
      });

      days.push({
        id: 'gym-4-c',
        dayLabel: 'Treino C (Quinta)',
        title: 'Upper Focus 2: Costas Espessura, Braços & Abdômen',
        targetMuscles: ['Costas', 'Bíceps', 'Tríceps', 'Core'],
        exercises: [
          {
            id: 'ex-49',
            name: 'Remada Curvada com Barra ou Halteres',
            muscle: 'Dorsal & Rombóides',
            sets: '4',
            reps: '8 - 12 reps',
            rest: '60s',
            notes: 'Costas retas em 45°, puxe a barra rente às coxas até o abdômen.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-50',
            name: 'Supino Reto com Barra ou Halteres',
            muscle: 'Peitoral Geral',
            sets: '3',
            reps: '10 - 12 reps',
            rest: '60s',
            notes: 'Controle a barra no peito e suba explosivo.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-51',
            name: 'Rosca Martelo com Halteres',
            muscle: 'Braquial & Antebraço',
            sets: '3',
            reps: '10 - 12 reps',
            rest: '45s',
            notes: 'Palmas voltadas para dentro, dá densidade aos braços.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-52',
            name: 'Tríceps Testa com Barra W ou Halteres',
            muscle: 'Tríceps Cabeça Longa',
            sets: '3',
            reps: '10 - 12 reps',
            rest: '45s',
            notes: 'Desça em direção à testa mantendo os cotovelos fixos.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-53',
            name: 'Prancha Abdominal com Toque no Ombro',
            muscle: 'Core / Transverso Abdominal',
            sets: '3',
            reps: '30s a 45s',
            rest: '30s',
            notes: 'Segure a estabilidade do quadril sem balançar.',
            isHomeFriendly: true,
          },
        ],
        cardioFinisher: {
          title: 'HIIT Esteira (Sprints de 30s)',
          duration: '12 min',
          protocol: '6 tiros de 30s na velocidade máxima com 60s de caminhada de recuperação.',
          caloriesBurnEst: '~180 kcal',
        },
      });

      days.push({
        id: 'gym-4-d',
        dayLabel: 'Treino D (Sexta)',
        title: 'Lower Focus 2: Posterior, Glúteo & Queima Acelerada',
        targetMuscles: ['Posteriores de Coxa', 'Glúteos', 'Lombar'],
        exercises: [
          {
            id: 'ex-54',
            name: 'Stiff com Halteres ou Barra',
            muscle: 'Isquiotibiais & Glúteos',
            sets: '4',
            reps: '10 - 12 reps',
            rest: '60s',
            notes: 'Empurre o quadril para trás, coluna 100% alinhada sentindo o posterior queimar.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-55',
            name: 'Mesa Flexora',
            muscle: 'Posterior de Coxa',
            sets: '4',
            reps: '12 - 15 reps',
            rest: '45s',
            notes: 'Controle o retorno sem soltar o peso repentinamente.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-56',
            name: 'Elevação Pélvica com Barra ou Halter',
            muscle: 'Glúteo Máximo',
            sets: '4',
            reps: '10 - 12 reps',
            rest: '60s',
            notes: 'Segure 2 segundos contraindo fortemente os glúteos no topo.',
            isHomeFriendly: false,
          },
          {
            id: 'ex-57',
            name: 'Passada / Avanço com Halteres',
            muscle: 'Pernas Completas & Queima',
            sets: '3',
            reps: '12 passos por perna',
            rest: '60s',
            notes: 'Passo largo, joelho de trás quase encosta no chão.',
            isHomeFriendly: false,
          },
        ],
        cardioFinisher: {
          title: 'Simulador de Escada / Queima Extrema',
          duration: '15 min',
          protocol: 'Ritmo contínuo moderado. O melhor exercício para firmar o quadril e queimar gordura.',
          caloriesBurnEst: '~230 kcal',
        },
      });
    } else {
      // 5x ou 6x Academia: Push / Pull / Legs / Superior / Inferior
      days.push(
        {
          id: 'gym-5-a',
          dayLabel: 'Dia 1 - Push',
          title: 'Peitoral, Ombros & Tríceps (Desenho & Firmeza)',
          targetMuscles: ['Peitoral', 'Ombros', 'Tríceps'],
          exercises: [
            { id: 'p-1', name: 'Supino Inclinado Halteres', muscle: 'Peitoral Superior', sets: '4', reps: '8-10', rest: '60s', notes: 'Amplitude máxima para preenchimento estético.', isHomeFriendly: false },
            { id: 'p-2', name: 'Supino Reto Barra ou Halter', muscle: 'Peitoral Maior', sets: '3', reps: '10-12', rest: '60s', notes: 'Controle e contração no topo.', isHomeFriendly: false },
            { id: 'p-3', name: 'Desenvolvimento Halteres', muscle: 'Deltóides', sets: '3', reps: '10-12', rest: '45s', notes: 'Coluna ereta, empurre sem bater os halteres.', isHomeFriendly: false },
            { id: 'p-4', name: 'Elevação Lateral Polia ou Halter', muscle: 'Deltóide Lateral', sets: '4', reps: '12-15', rest: '30s', notes: 'Dá o aspecto de ombros marcados e cintura fina.', isHomeFriendly: false },
            { id: 'p-5', name: 'Tríceps Corda na Polia', muscle: 'Tríceps', sets: '3', reps: '12-15', rest: '45s', notes: 'Abertura no final do movimento.', isHomeFriendly: false },
          ],
          cardioFinisher: { title: 'Esteira Inclinada', duration: '15 min', protocol: 'Inclinação 10%, vel 5.5 km/h.', caloriesBurnEst: '~180 kcal' }
        },
        {
          id: 'gym-5-b',
          dayLabel: 'Dia 2 - Pull',
          title: 'Dorsais, Deltoide Posterior & Bíceps',
          targetMuscles: ['Costas', 'Trapézio', 'Bíceps'],
          exercises: [
            { id: 'pl-1', name: 'Puxada Frontal Pulley', muscle: 'Grande Dorsal', sets: '4', reps: '10-12', rest: '60s', notes: 'Abra as costas e puxe com as escápulas travadas.', isHomeFriendly: false },
            { id: 'pl-2', name: 'Remada Curvada com Halteres', muscle: 'Espessura Costas', sets: '4', reps: '10-12', rest: '60s', notes: 'Aperte as costas no ponto mais alto.', isHomeFriendly: false },
            { id: 'pl-3', name: 'Crucifixo Invertido', muscle: 'Posterior Ombro', sets: '3', reps: '12-15', rest: '30s', notes: 'Postura reta e alinhada.', isHomeFriendly: false },
            { id: 'pl-4', name: 'Rosca Scott ou Direta', muscle: 'Bíceps', sets: '3', reps: '10-12', rest: '45s', notes: 'Isolamento máximo dos braços.', isHomeFriendly: false },
          ],
          cardioFinisher: { title: 'Transport / Elíptico Frequência Estável', duration: '15 min', protocol: 'Cadência contínua acima de 60 RPM.', caloriesBurnEst: '~170 kcal' }
        },
        {
          id: 'gym-5-c',
          dayLabel: 'Dia 3 - Legs & Core',
          title: 'Membros Inferiores Completos & Abdômen',
          targetMuscles: ['Quadríceps', 'Posteriores', 'Glúteos', 'Abdômen'],
          exercises: [
            { id: 'lg-1', name: 'Agachamento Livre ou no Hack', muscle: 'Pernas Gerais', sets: '4', reps: '8-12', rest: '75s', notes: 'Profundidade máxima segura.', isHomeFriendly: false },
            { id: 'lg-2', name: 'Leg Press 45°', muscle: 'Quadríceps', sets: '4', reps: '10-12', rest: '60s', notes: 'Pés na base empurrando com o calcanhar.', isHomeFriendly: false },
            { id: 'lg-3', name: 'Mesa Flexora', muscle: 'Posterior', sets: '4', reps: '12-15', rest: '45s', notes: 'Queima profunda dos posteriores.', isHomeFriendly: false },
            { id: 'lg-4', name: 'Abdominal Infra na Barra ou Paralela', muscle: 'Abdômen Baixo', sets: '4', reps: '12-15', rest: '45s', notes: 'Elevação de pernas sem balanço do tronco.', isHomeFriendly: false },
          ],
          cardioFinisher: { title: 'Escada Metabólica', duration: '15 min', protocol: 'Nível 7 constante. Derrete gordura acelerada.', caloriesBurnEst: '~220 kcal' }
        },
        {
          id: 'gym-5-d',
          dayLabel: 'Dia 4 - Upper Shred',
          title: 'Superiores Dinâmico & Braços Alta Definição',
          targetMuscles: ['Peitoral', 'Costas', 'Braços'],
          exercises: [
            { id: 'us-1', name: 'Crucifixo Máquina / Voador', muscle: 'Peitoral', sets: '4', reps: '12-15', rest: '45s', notes: 'Squeeze no centro por 1s.', isHomeFriendly: false },
            { id: 'us-2', name: 'Remada Baixa Cabo', muscle: 'Costas', sets: '4', reps: '10-12', rest: '45s', notes: 'Cotovelos raspando as costelas.', isHomeFriendly: false },
            { id: 'us-3', name: 'Bi-Set Rosca Martelo + Tríceps Francês', muscle: 'Braços', sets: '3', reps: '12 reps cada', rest: '45s', notes: 'Sem descanso entre os dois exercícios.', isHomeFriendly: false },
          ],
          cardioFinisher: { title: 'HIIT na Esteira', duration: '12 min', protocol: 'Tiros de 30s vel 12-14km/h x 60s descanso.', caloriesBurnEst: '~180 kcal' }
        },
        {
          id: 'gym-5-e',
          dayLabel: 'Dia 5 - Posterior, Glúteo & Cárdio Final',
          title: 'Cadeia Posterior & Finalizador de Verão',
          targetMuscles: ['Glúteos', 'Isquiotibiais', 'Panturrilha'],
          exercises: [
            { id: 'gl-1', name: 'Stiff Barra ou Halteres', muscle: 'Posteriores', sets: '4', reps: '10-12', rest: '60s', notes: 'Alongue ao máximo a parte de trás das pernas.', isHomeFriendly: false },
            { id: 'gl-2', name: 'Elevação Pélvica', muscle: 'Glúteos', sets: '4', reps: '12-15', rest: '60s', notes: 'Aperto estrito de 2s no topo.', isHomeFriendly: false },
            { id: 'gl-3', name: 'Panturrilha em Pé', muscle: 'Panturrilha', sets: '4', reps: '15-20', rest: '30s', notes: 'Contração forte na subida.', isHomeFriendly: false },
          ],
          cardioFinisher: { title: 'Cárdio Longo em Zona 2', duration: '20 min', protocol: 'Caminhada inclinada ou bike em ritmo de conversa confortável para oxidar ácidos graxos.', caloriesBurnEst: '~220 kcal' }
        }
      );
    }
  } else {
    // ================= TREINO EM CASA (HOME WORKOUT / CALISTENIA METABÓLICA) =================
    // Ideal para quem não vai para academia, focado 100% em queima de gordura para o verão!

    if (frequency === 3) {
      days.push({
        id: 'home-3-a',
        dayLabel: 'Treino A (Segunda)',
        title: 'Full Body Metabólico: Peito, Ombros e Core Intenso',
        targetMuscles: ['Peitoral', 'Ombros', 'Tríceps', 'Core'],
        exercises: [
          {
            id: 'h-1',
            name: 'Flexão de Braço (Push-ups) Tradicional ou no Joelho',
            muscle: 'Peitoral & Tríceps',
            sets: '4',
            reps: level === 'iniciante' ? '8 - 12 reps' : '15 - 20 reps',
            rest: '45s',
            notes: 'Mãos na linha do peito, abdômen travado feito uma tábua. Não deixe o quadril cair.',
            isHomeFriendly: true,
          },
          {
            id: 'h-2',
            name: 'Pike Push-ups (Flexão em V para Ombros)',
            muscle: 'Deltóides & Trapézio',
            sets: '3',
            reps: '8 - 12 reps',
            rest: '45s',
            notes: 'Quadril elevado em posição de V invertido, empurre o chão com a força dos ombros.',
            isHomeFriendly: true,
          },
          {
            id: 'h-3',
            name: 'Tríceps no Banco ou Cadeira Firme (Dips)',
            muscle: 'Tríceps',
            sets: '3',
            reps: '12 - 15 reps',
            rest: '30s',
            notes: 'Costas rente ao assento, desça até 90° nos cotovelos e suba estendendo os braços.',
            isHomeFriendly: true,
          },
          {
            id: 'h-4',
            name: 'Prancha Frontal com Toque no Ombro (Shoulder Taps)',
            muscle: 'Core & Estabilidade',
            sets: '4',
            reps: '20 toques (10 cada lado)',
            rest: '30s',
            notes: 'Mantenha o tronco e quadril o mais imóveis possível durante a troca de mãos.',
            isHomeFriendly: true,
          },
          {
            id: 'h-5',
            name: 'Abdominal Bicicleta (Bicycle Crunches)',
            muscle: 'Oblíquos & Reto Abdominal',
            sets: '3',
            reps: '20 reps alternadas',
            rest: '30s',
            notes: 'Cotovelo direito vai no joelho esquerdo e vice-versa, ritmo controlado.',
            isHomeFriendly: true,
          },
        ],
        cardioFinisher: {
          title: 'Queimador HIIT Verão (Tabata Caseiro)',
          duration: '8 min (2 blocos de 4 min)',
          protocol: '20 segundos de Polichinelos rápidos + 10 segundos de descanso, seguido de 20s de Corrida Estacionária alta. 8 rounds sem parar.',
          caloriesBurnEst: '~140 - 180 kcal',
        },
      });

      days.push({
        id: 'home-3-b',
        dayLabel: 'Treino B (Quarta)',
        title: 'Pernas Firmes & Glúteos: Alta Densidade em Casa',
        targetMuscles: ['Quadríceps', 'Glúteos', 'Posteriores', 'Panturrilhas'],
        exercises: [
          {
            id: 'h-6',
            name: 'Agachamento Livre (Air Squats) com Pausa de 2s',
            muscle: 'Quadríceps & Glúteos',
            sets: '4',
            reps: '15 - 20 reps',
            rest: '45s',
            notes: 'Desça até a linha de 90°, segure 2 segundos embaixo antes de subir com explosão.',
            isHomeFriendly: true,
          },
          {
            id: 'h-7',
            name: 'Agachamento Búlgaro no Sofá ou Cadeira',
            muscle: 'Glúteos & Isolamento de Perna',
            sets: '3',
            reps: '10 - 12 reps cada perna',
            rest: '45s',
            notes: 'Um pé apoiado atrás, desça o joelho de trás em direção ao chão. Maior ativador de glúteos em casa.',
            isHomeFriendly: true,
          },
          {
            id: 'h-8',
            name: 'Elevação Pélvica Unilateral no Chão',
            muscle: 'Glúteos & Isquiotibiais',
            sets: '3',
            reps: '12 - 15 reps cada lado',
            rest: '30s',
            notes: 'Apoie um pé no chão, estique a outra perna e suba o quadril contraindo o glúteo.',
            isHomeFriendly: true,
          },
          {
            id: 'h-9',
            name: 'Panturrilha Unilateral no Degrau da Escada',
            muscle: 'Panturrilhas',
            sets: '4',
            reps: '20 reps cada lado',
            rest: '30s',
            notes: 'Desça o calcanhar o máximo possível e suba na ponta extrema dos pés.',
            isHomeFriendly: true,
          },
        ],
        cardioFinisher: {
          title: 'Finalizador Metabólico: Mountain Climbers + Agachamento Saltado',
          duration: '10 min',
          protocol: '30s de Mountain Climbers acelerados + 30s de Agachamento Saltado + 30s de descanso. Repita 6 vezes.',
          caloriesBurnEst: '~160 - 200 kcal',
        },
      });

      days.push({
        id: 'home-3-c',
        dayLabel: 'Treino C (Sexta)',
        title: 'Circuito Queima Total & Abdômen Trincado',
        targetMuscles: ['Corpo Inteiro', 'Costas / Cadeia Posterior', 'Core'],
        exercises: [
          {
            id: 'h-10',
            name: 'Burpees Adaptados ou Completos',
            muscle: 'Corpo Inteiro & Gasto Metabólico',
            sets: '4',
            reps: level === 'iniciante' ? '8 - 10 reps' : '12 - 15 reps',
            rest: '60s',
            notes: 'Mãos no chão, jogue os pés para trás, faça a flexão (ou não se iniciante) e salte no topo.',
            isHomeFriendly: true,
          },
          {
            id: 'h-11',
            name: 'Remada Invertida na Toalha (porta) ou Superman no Chão',
            muscle: 'Dorsais & Lombar',
            sets: '4',
            reps: '12 - 15 reps',
            rest: '45s',
            notes: 'Deitado de bruços, eleve peito e pernas apertando as escápulas por 2 segundos no alto.',
            isHomeFriendly: true,
          },
          {
            id: 'h-12',
            name: 'Flexão Diamante (Diamond Push-ups) ou nas mãos fechadas',
            muscle: 'Tríceps & Miolo do Peito',
            sets: '3',
            reps: '8 - 12 reps',
            rest: '45s',
            notes: 'Polegares e indicadores juntos formando um diamante. Apoie os joelhos se necessário.',
            isHomeFriendly: true,
          },
          {
            id: 'h-13',
            name: 'Prancha Lateral com Elevação de Quadril',
            muscle: 'Oblíquos & Cintura Fina',
            sets: '3',
            reps: '12 subidas cada lado',
            rest: '30s',
            notes: 'Apoie o antebraço, desça e suba o quadril desenhando as laterais do abdômen.',
            isHomeFriendly: true,
          },
        ],
        cardioFinisher: {
          title: 'Mega Queima de Gordura Verão 2026/2027',
          duration: '12 min',
          protocol: 'Corrida no lugar com joelhos altos (30s) + Polichinelo frontal (30s) + Prancha isométrica (30s) + 30s de água. 6 rounds.',
          caloriesBurnEst: '~190 - 240 kcal',
        },
      });
    } else {
      // 4x, 5x ou 6x em Casa: Divisão Superior / Inferior ou Push-Pull-Legs-Core
      days.push(
        {
          id: 'home-4-a',
          dayLabel: 'Dia 1 - Superior Queima',
          title: 'Peito, Ombros e Tríceps com Peso do Corpo',
          targetMuscles: ['Peito', 'Ombros', 'Tríceps'],
          exercises: [
            { id: 'ha-1', name: 'Flexão de Braço Padrão', muscle: 'Peitoral Maior', sets: '4', reps: '12-15', rest: '45s', notes: 'Desça controlando até o peito quase encostar no chão.', isHomeFriendly: true },
            { id: 'ha-2', name: 'Flexão Declinada (pés na cadeira)', muscle: 'Peitoral Superior', sets: '3', reps: '8-12', rest: '45s', notes: 'Pés elevados para sobrecarregar a parte superior do peito.', isHomeFriendly: true },
            { id: 'ha-3', name: 'Pike Push-ups', muscle: 'Deltóides', sets: '3', reps: '10-12', rest: '45s', notes: 'Empurre verticalmente para dar largura aos ombros.', isHomeFriendly: true },
            { id: 'ha-4', name: 'Mergulho de Tríceps no Sofá', muscle: 'Tríceps', sets: '3', reps: '15-20', rest: '30s', notes: 'Amplitude completa com queima acentuada.', isHomeFriendly: true },
          ],
          cardioFinisher: { title: 'HIIT de Polichinelos & Shadow Boxing', duration: '10 min', protocol: '30s socos rápidos no ar + 30s polichinelos. 5 rounds.', caloriesBurnEst: '~150 kcal' }
        },
        {
          id: 'home-4-b',
          dayLabel: 'Dia 2 - Pernas e Glúteos',
          title: 'Esculpir Pernas, Glúteos e Queima Calórica',
          targetMuscles: ['Quadríceps', 'Glúteos', 'Posteriores'],
          exercises: [
            { id: 'hb-1', name: 'Agachamento Búlgaro', muscle: 'Glúteos & Pernas', sets: '4', reps: '12 cada perna', rest: '45s', notes: 'Controle total da descida.', isHomeFriendly: true },
            { id: 'hb-2', name: 'Afundo Alternado Passo Atrás (Reverse Lunge)', muscle: 'Quadríceps', sets: '3', reps: '12 cada perna', rest: '45s', notes: 'Mais seguro para o joelho e maior ativação.', isHomeFriendly: true },
            { id: 'hb-3', name: 'Elevação Pélvica com Isometria de 3s', muscle: 'Glúteos', sets: '4', reps: '15 reps', rest: '30s', notes: 'Esmague os glúteos no topo.', isHomeFriendly: true },
            { id: 'hb-4', name: 'Agachamento com Salto (Jump Squats)', muscle: 'Potência & Queima', sets: '3', reps: '12-15 reps', rest: '45s', notes: 'Aterrissagem suave na ponta dos pés.', isHomeFriendly: true },
          ],
          cardioFinisher: { title: 'Circuito Queima de Coxas e Glúteos', duration: '8 min', protocol: 'Agachamento isométrico na parede (Wall Sit) 45s + 15s descanso. 4 rounds.', caloriesBurnEst: '~130 kcal' }
        },
        {
          id: 'home-4-c',
          dayLabel: 'Dia 3 - Costas, Bíceps & Postura',
          title: 'Cadeia Posterior, Postura de Verão & Bíceps',
          targetMuscles: ['Dorsais', 'Lombar', 'Rombóides', 'Core'],
          exercises: [
            { id: 'hc-1', name: 'Superman Hold com Remada no Chão', muscle: 'Dorsal & Rombóides', sets: '4', reps: '12-15', rest: '45s', notes: 'Puxe os cotovelos para trás como se estivesse remando.', isHomeFriendly: true },
            { id: 'hc-2', name: 'Prancha Dinâmica (Subir e Descer nos Braços)', muscle: 'Core & Ombros', sets: '3', reps: '10 cada lado', rest: '45s', notes: 'Suba para a palma da mão e desça para o cotovelo.', isHomeFriendly: true },
            { id: 'hc-3', name: 'Flexão Escapular no Chão', muscle: 'Serrátil & Escápulas', sets: '3', reps: '15 reps', rest: '30s', notes: 'Abra e feche as escápulas com braços esticados.', isHomeFriendly: true },
            { id: 'hc-4', name: 'Elevação de Quadril em Ponte Reversa', muscle: 'Posteriores & Lombar', sets: '3', reps: '12 reps', rest: '30s', notes: 'Excelente contra a postura curvada de celular.', isHomeFriendly: true },
          ],
          cardioFinisher: { title: 'HIIT Mountain Climbers + Corrida no Lugar', duration: '10 min', protocol: '20s tiro rápido / 10s descanso x 8 séries.', caloriesBurnEst: '~160 kcal' }
        },
        {
          id: 'home-4-d',
          dayLabel: 'Dia 4 - Abdomen & Seca Total',
          title: 'Definição Abdominal Máxima & Cardio Queimador',
          targetMuscles: ['Reto Abdominal', 'Oblíquos', 'Transverso'],
          exercises: [
            { id: 'hd-1', name: 'Abdominal Canivete / V-Ups ou Encolhimento', muscle: 'Reto Abdominal', sets: '4', reps: '12-15', rest: '45s', notes: 'Aproxime joelhos do peito contraindo forte.', isHomeFriendly: true },
            { id: 'hd-2', name: 'Prancha Estática com Sucção Abdominal (Vacuum)', muscle: 'Cintura Fina', sets: '4', reps: '30s a 45s', rest: '30s', notes: 'Puxe o umbigo para dentro em direção à coluna.', isHomeFriendly: true },
            { id: 'hd-3', name: 'Toque no Calcanhar (Heel Touches)', muscle: 'Oblíquos Laterais', sets: '3', reps: '20 toques', rest: '30s', notes: 'Costas no chão, toque alternado nos calcanhares.', isHomeFriendly: true },
            { id: 'hd-4', name: 'Burpees Finais de Alta Intensidade', muscle: 'Full Body', sets: '4', reps: '10-12 reps', rest: '60s', notes: 'Ritmo contínuo sem parar.', isHomeFriendly: true },
          ],
          cardioFinisher: { title: 'Derretimento Final de Gordura de Verão', duration: '12 min', protocol: 'Sessão corrida estacionária + polichinelos + descanso ativo.', caloriesBurnEst: '~200 kcal' }
        }
      );
    }
  }

  const summerTips = [
    '🔥 Hidratação no Treino: Beba pelo menos 500ml a 700ml de água gelada durante a sessão para manter o rendimento no calor.',
    '⚡ Frequência Cardíaca Elevada: Mantenha os intervalos de descanso entre 45s e 60s para manter o gasto calórico alto durante todo o treino.',
    '🎯 Regra da Sobrecarga Progressiva: Se treina em casa, aumente as repetições ou diminua o descanso. Na academia, busque aumentar a carga mantendo a técnica.',
    '🥗 Pós-Treino com Proteína: Consuma sua porção de proteína e carbo calculada pelo RJonnssonFit logo após o treino para recuperar o glicogênio e proteger a musculatura.',
  ];

  return {
    location,
    level,
    frequency,
    duration,
    focus,
    hasDumbbellsOrBands,
    days,
    summerTips,
  };
}
