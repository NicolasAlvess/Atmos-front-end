// src/lib/theories.ts
export interface Theory {
  id: string;
  name: string;
  author: string;
  tagline: string;
  summary: string[];
  keyPoints: string[];
  useInAtmos: string;
}

export const THEORIES: Theory[] = [
  {
    id: 'vroom',
    name: 'Teoria da Expectativa',
    author: 'Victor Vroom',
    tagline: 'A motivação depende do que a pessoa espera alcançar.',
    summary: [
      'A Teoria da Expectativa propõe que a motivação de uma pessoa para agir de determinada forma é resultado de três percepções combinadas: a expectativa de que o esforço levará a um bom desempenho, a instrumentalidade de que esse desempenho levará a uma recompensa, e a valência, que é o quanto essa recompensa é valorizada pela pessoa.',
      'Em outras palavras, um colaborador só se sente motivado quando acredita que (1) é capaz de atingir a meta, (2) atingir a meta realmente trará algum retorno (reconhecimento, promoção, remuneração) e (3) esse retorno é algo que ele de fato valoriza.',
      'Quando qualquer uma dessas três percepções é fraca — por exemplo, quando a liderança não é clara sobre o que é esperado, ou quando o esforço extra nunca é reconhecido — a motivação despenca, mesmo que a pessoa tenha capacidade.'
    ],
    keyPoints: [
      'Expectância: "Se eu me esforçar, vou conseguir?"',
      'Instrumentalidade: "Se eu conseguir, isso vai gerar alguma recompensa?"',
      'Valência: "Essa recompensa realmente importa para mim?"',
      'A motivação é o produto dessas três percepções, não a soma — se uma for zero, a motivação também é.'
    ],
    useInAtmos: 'Usamos Vroom para interpretar dimensões como Segurança Psicológica e Liderança: quando a liderança não é clara sobre expectativas e recompensas, a instrumentalidade percebida pelos colaboradores cai, e isso aparece nas notas baixas dessas dimensões.'
  },
  {
    id: 'herzberg',
    name: 'Teoria dos Dois Fatores',
    author: 'Frederick Herzberg',
    tagline: 'Evitar a insatisfação não é o mesmo que gerar motivação.',
    summary: [
      'Herzberg propôs que satisfação e insatisfação no trabalho não são extremos opostos de uma mesma escala, mas sim resultado de dois conjuntos de fatores independentes: os fatores higiênicos e os fatores motivacionais.',
      'Os fatores higiênicos (salário, condições físicas, segurança, relação com a chefia) não motivam quando presentes — apenas evitam a insatisfação. Sua ausência, porém, gera forte insatisfação. Já os fatores motivacionais (reconhecimento, crescimento, realização, responsabilidade) são o que de fato geram engajamento e satisfação genuína quando presentes.',
      'Na prática, isso significa que melhorar só salário ou infraestrutura evita reclamações, mas não cria um ambiente em que as pessoas queiram dar o seu melhor — é preciso investir também em reconhecimento e desenvolvimento.'
    ],
    keyPoints: [
      'Fatores higiênicos: salário, condições de trabalho, políticas da empresa — evitam insatisfação.',
      'Fatores motivacionais: reconhecimento, realização, crescimento — geram satisfação real.',
      'Resolver só os fatores higiênicos deixa o colaborador neutro, não engajado.',
      'Investir em fatores motivacionais é o que de fato eleva o clima organizacional.'
    ],
    useInAtmos: 'Usamos Herzberg para interpretar Valorização e Comunicação: notas baixas nessas dimensões costumam indicar que os fatores motivacionais (reconhecimento, voz ativa) estão fracos, mesmo quando os fatores higiênicos básicos já estão resolvidos.'
  },
  {
    id: 'maslow',
    name: 'Hierarquia das Necessidades',
    author: 'Abraham Maslow',
    tagline: 'As pessoas buscam satisfazer necessidades em camadas, da mais básica à mais elevada.',
    summary: [
      'Maslow organizou as necessidades humanas em uma hierarquia de cinco níveis: fisiológicas, segurança, sociais (pertencimento), estima e autorrealização. A ideia central é que as necessidades de um nível precisam estar razoavelmente satisfeitas antes que a pessoa se engaje plenamente nas do nível seguinte.',
      'No ambiente de trabalho, isso se traduz em: segurança (estabilidade, ambiente físico e psicológico seguro), pertencimento (sentir-se parte do grupo, ser incluído), estima (ser respeitado e reconhecido) e autorrealização (poder crescer e expressar todo o seu potencial).',
      'Quando necessidades mais básicas como segurança e pertencimento não são atendidas, é muito difícil que o colaborador se engaje em busca de reconhecimento ou crescimento — a atenção dele fica presa em se sentir seguro e aceito.'
    ],
    keyPoints: [
      'Necessidades fisiológicas e de segurança: base da pirâmide, inclui segurança psicológica no trabalho.',
      'Necessidades sociais: pertencimento, sentir-se parte do grupo.',
      'Necessidades de estima: reconhecimento e respeito dos colegas e líderes.',
      'Autorrealização: topo da pirâmide, poder crescer e usar todo o potencial.'
    ],
    useInAtmos: 'Usamos Maslow para interpretar Pertencimento e Respeito/Diversidade: quando essas dimensões estão com nota baixa, o diagnóstico aponta que necessidades básicas de segurança e pertencimento ainda não estão plenamente satisfeitas, o que compromete todo o restante do engajamento.'
  },
  {
    id: 'hackman-oldham',
    name: 'Modelo de Características do Trabalho',
    author: 'J. Richard Hackman & Greg R. Oldham',
    tagline: 'O desenho do trabalho em si pode motivar — ou desmotivar.',
    summary: [
      'Hackman e Oldham propuseram que certas características centrais do trabalho — variedade de habilidades, identidade da tarefa, significado da tarefa, autonomia e feedback — influenciam diretamente estados psicológicos críticos, como o senso de significado e de responsabilidade pelo próprio trabalho.',
      'Quando essas características estão presentes, o colaborador percebe mais sentido no que faz, sente-se responsável pelos resultados e recebe informação clara sobre seu desempenho — o que gera motivação interna, satisfação e melhor desempenho.',
      'O modelo reforça que motivação não depende só de incentivos externos: a forma como o próprio trabalho é estruturado (autonomia para decidir, clareza de como a tarefa se encaixa no todo, retorno sobre o desempenho) já é, em si, uma fonte poderosa de engajamento.'
    ],
    keyPoints: [
      'Variedade de habilidades e identidade da tarefa: o quanto o trabalho exige diferentes competências e forma um todo identificável.',
      'Significado da tarefa: o impacto percebido do trabalho na vida de outras pessoas ou na organização.',
      'Autonomia: liberdade para planejar e decidir como executar o trabalho.',
      'Feedback: informação clara e constante sobre o próprio desempenho.'
    ],
    useInAtmos: 'Usamos Hackman & Oldham para interpretar Equidade e Capacitação: notas baixas aqui costumam indicar falta de autonomia, de feedback claro sobre o desempenho, ou de oportunidades reais de crescimento dentro da função.'
  }
];
