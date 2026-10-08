/** Editable site copy — keep accents and punctuation exactly as written. */

import type { Locale } from "@/lib/i18n";

export const JOIN_FORM_URL = "#";

export const site = {
  lang: "pt-BR",
  title: "LADINT | Liga Acadêmica de Direito Internacional – UNDB",
  description:
    "A LADINT é uma liga acadêmica da UNDB criada para aproximar estudantes do Direito Internacional e das questões que conectam pessoas, Estados, empresas e tecnologias ao redor do mundo.",
  joinFormUrl: JOIN_FORM_URL,
  footerYear: 2026,
} as const;

export const nav = {
  logoLetter: "L",
  logoText: "LADINT",
  links: [
    { label: "Sobre", href: "#sobre" },
    { label: "Pesquisa", href: "#pesquisa" },
    { label: "Equipe", href: "#equipe" },
    { label: "Como entrar", href: "#como-entrar" },
    { label: "Contato", href: "#contato" },
  ],
} as const;

export const hero = {
  eyebrow: "LIGA ACADÊMICA DE DIREITO INTERNACIONAL",
  titleLine1: "O Direito não para nas fronteiras.",
  titleLine2: "E a nossa curiosidade também não.",
  paragraph1:
    "A LADINT é uma liga acadêmica da UNDB criada para aproximar estudantes do Direito Internacional e das questões que conectam pessoas, Estados, empresas e tecnologias ao redor do mundo.",
  paragraph2:
    "Aqui, transformamos curiosidade em pesquisa, discussão em conhecimento e interesse pelo mundo em novas possibilidades para a formação jurídica.",
  cta: "Conheça a LADINT",
  ctaHref: "#sobre",
} as const;

export const mission = {
  id: "missao",
  eyebrow: "NOSSA MISSÃO",
  title: "Estudar Direito Internacional é entender o mundo em que vivemos.",
  paragraph1:
    "A LADINT é um espaço para aprender, questionar, pesquisar e trocar experiências sobre temas que extrapolam a sala de aula. Reunimos estudantes, professores e profissionais para discutir os desafios jurídicos de um mundo cada vez mais conectado.",
  paragraph2:
    "Mais do que conhecer normas e tratados, queremos desenvolver um olhar crítico sobre como o Direito acompanha, e pode transformar, as relações internacionais.",
} as const;

export const whatWeDo = {
  id: "o-que-fazemos",
  eyebrow: "O QUE FAZEMOS",
  title: "Pessoas, ideias e experiências.",
  intro: "Nossas atividades aproximam o conhecimento acadêmico do que acontece no mundo real.",
  cards: [
    {
      title: "Debates e encontros",
      body: "Conversamos com professores e profissionais para conhecer diferentes perspectivas sobre temas do Direito Internacional.",
    },
    {
      title: "Conexões com quem já atua na área",
      body: "Criamos oportunidades para que estudantes conheçam profissionais e pesquisadores que constroem carreira no Direito Internacional.",
    },
    {
      title: "Olhares para o mundo",
      body: "Exploramos experiências, sistemas jurídicos e debates de outros países, ampliando nossa forma de enxergar o Direito.",
    },
    {
      title: "Pesquisa e produção científica",
      body: "Transformamos perguntas em pesquisa por meio de workshops, artigos, resumos e outras produções acadêmicas.",
    },
  ],
} as const;

export const about = {
  id: "sobre",
  eyebrow: "SOBRE A LADINT",
  title: "Um espaço para olhar o Direito além das fronteiras.",
  paragraph1:
    "A LADINT nasceu do interesse em entender um Direito que não se limita ao território de um país. Estudamos diferentes dimensões do Direito Internacional, do público ao privado, dos Direitos Humanos às migrações, do comércio internacional às novas tecnologias, sempre relacionando essas áreas aos desafios do mundo atual.",
  paragraph2:
    "Mas a LADINT não existe apenas para estudar conteúdos. Queremos que estudantes possam fazer perguntas, desenvolver pesquisas, conhecer outros pontos de vista e descobrir possibilidades para a própria trajetória acadêmica e profissional.",
  subheading: "O que nos move",
  paragraph3:
    "Acreditamos que uma formação jurídica internacional envolve compreender diferentes realidades, questionar perspectivas, acompanhar transformações globais e perceber onde o Direito encontra outras áreas do conhecimento. Por isso, a LADINT une academia, pesquisa, prática e mundo.",
  objectivesTitle: "Nossos objetivos",
  objectives: [
    "Estimular o interesse pelo Direito Internacional e suas diferentes áreas;",
    "Criar espaços de diálogo entre estudantes, professores e profissionais;",
    "Incentivar a pesquisa e a produção científica;",
    "Aproximar os estudantes de experiências e debates internacionais;",
    "Desenvolver uma formação jurídica crítica, interdisciplinar e sintonizada com as transformações globais;",
    "Apresentar caminhos acadêmicos e profissionais para quem deseja construir uma trajetória internacional.",
  ],
  researchLine: {
    eyebrow: "NOSSA LINHA DE PESQUISA",
    title: "Direito Internacional e Novos Desafios Globais",
    text: "Investigamos como o Direito responde a transformações globais, como migrações, conflitos, novas tecnologias, relações econômicas e outras questões que desafiam as estruturas jurídicas tradicionais.",
  },
} as const;

export const research = {
  id: "pesquisa",
  eyebrow: "PESQUISA E PRODUÇÃO CIENTÍFICA",
  title: "Da dúvida à pesquisa.",
  paragraph1:
    "Na LADINT, pesquisa não é só uma etapa da faculdade: é a chance de transformar uma dúvida em pergunta, uma pergunta em investigação e uma investigação em conhecimento.",
  paragraph2:
    "Por meio de workshops, grupos de pesquisa, orientação acadêmica e produção científica, incentivamos os estudantes a desenvolverem suas próprias ideias e a encontrarem espaço para colocá-las no papel.",
  cta: "Produza com a LADINT",
} as const;

export const team = {
  id: "equipe",
  eyebrow: "QUEM FAZ A LADINT ACONTECER",
  title: "Uma equipe de estudantes conectada ao mundo.",
  intro:
    "Por trás de cada encontro, pesquisa, projeto e ideia da LADINT existe uma equipe de estudantes que acredita no potencial de uma formação jurídica conectada ao mundo.",
  groups: [
    {
      role: "PRESIDÊNCIA",
      members: ["Letícia Belo"],
    },
    {
      role: "VICE-PRESIDÊNCIA",
      members: ["Júlia Bordalo"],
    },
    {
      role: "SECRETARIA GERAL",
      members: ["Ana Júlia Braga"],
    },
    {
      role: "DIRETORIA ACADÊMICA",
      members: ["Geovanna Costa", "Giovanna Duarte", "Driele Jansen"],
    },
    {
      role: "DIRETORIA DE EVENTOS",
      members: ["Enny Lacerda", "Julia Ashley"],
    },
    {
      role: "DIRETORIA DE MARKETING",
      members: ["Eduardo Soares", "Letícia Brito", "Waldirlan Segundo"],
    },
  ],
} as const;

export const advisors = {
  id: "orientadores",
  eyebrow: "QUEM NOS ORIENTA",
  title: "Troca com quem pesquisa, ensina e atua no Direito.",
  intro:
    "Nossos orientadores acompanham as atividades acadêmicas e científicas da LADINT, contribuindo com conhecimento, experiência e novos olhares para os projetos da liga.",
  people: [
    { name: "Prof. Thiago Viana", role: "Orientador" },
    { name: "Profa. Glaucia Maranhão", role: "Orientadora" },
    { name: "Profa. Izabela Trajano", role: "Orientadora" },
  ],
} as const;

export const howToJoin = {
  id: "como-entrar",
  eyebrow: "COMO ENTRAR NA LADINT",
  title: "Aberto a estudantes de Direito e de Relações Internacionais.",
  text: "Nosso processo seletivo é aberto a estudantes de qualquer instituição e período, interessados em Direito Internacional, pesquisa e debate acadêmico. Não é preciso ter experiência prévia, só curiosidade e vontade de participar. As inscrições acontecem duas vezes por ano, em março e em setembro.",
  steps: [
    {
      label: "ETAPA 1",
      title: "Formulário",
      body: "Você preenche a inscrição online.",
    },
    {
      label: "ETAPA 2",
      title: "Entrevista",
      body: "Conversamos para conhecer seus interesses e suas expectativas na liga.",
    },
    {
      label: "ETAPA 3",
      title: "Resultados",
      body: "Divulgamos no nosso Instagram, @ladint.undb.",
    },
  ],
  cta: "Quero fazer parte",
} as const;

export const finalCta = {
  title: "O mundo está cheio de questões que ainda precisam ser discutidas.",
  subtitle: "E talvez uma delas seja a próxima pesquisa que você vai fazer.",
  text: "Participe da LADINT e venha conhecer novas pessoas, ideias, pesquisas e possibilidades dentro do Direito Internacional.",
  cta: "Quero fazer parte",
} as const;

export const footer = {
  id: "contato",
  name: "LADINT",
  fullName: "Liga Acadêmica de Direito Internacional",
  contactLabel: "CONTATO",
  instagramLabel: "Instagram: @ladint.undb",
  instagramUrl: "https://instagram.com/ladint.undb",
  emailLabel: "E-mail: ladint.undb@gmail.com",
  emailHref: "mailto:ladint.undb@gmail.com",
  bottomPrefix: "UNDB · São Luís, Maranhão · ©",
} as const;

const aboutEn = {
  id: "about",
  eyebrow: "ABOUT LADINT",
  title: "A space to look at Law beyond borders.",
  paragraph1:
    "LADINT was born from the interest in understanding a Law that is not limited to the territory of one country. We study different dimensions of International Law, from public to private, from Human Rights to migration, from international trade to new technologies, always relating these areas to the challenges of today’s world.",
  paragraph2:
    "But LADINT does not exist only to study content. We want students to be able to ask questions, develop research, encounter other points of view, and discover possibilities for their own academic and professional path.",
  subheading: "What drives us",
  paragraph3:
    "We believe that an international legal education involves understanding different realities, questioning perspectives, following global transformations, and seeing where Law meets other fields of knowledge. That is why LADINT brings together academia, research, practice, and the world.",
  objectivesTitle: "Our objectives",
  objectives: [
    "Stimulate interest in International Law and its different areas;",
    "Create spaces for dialogue among students, professors, and professionals;",
    "Encourage research and academic production;",
    "Bring students closer to international experiences and debates;",
    "Develop a critical, interdisciplinary legal education attuned to global transformations;",
    "Present academic and professional paths for those who want to build an international trajectory.",
  ],
  researchLine: {
    eyebrow: "OUR RESEARCH LINE",
    title: "International Law and New Global Challenges",
    text: "We investigate how Law responds to global transformations such as migration, conflicts, new technologies, economic relations, and other issues that challenge traditional legal structures.",
  },
} as const;

const missionEn = {
  id: "mission",
  eyebrow: "OUR MISSION",
  title: "Studying International Law is understanding the world we live in.",
  paragraph1:
    "LADINT is a space to learn, question, research, and exchange experiences on topics that go beyond the classroom. We bring together students, professors, and professionals to discuss the legal challenges of an increasingly connected world.",
  paragraph2:
    "More than learning norms and treaties, we want to develop a critical perspective on how Law accompanies — and can transform — international relations.",
} as const;

const whatWeDoEn = {
  id: "what-we-do",
  eyebrow: "WHAT WE DO",
  title: "People, ideas, and experiences.",
  intro: "Our activities bring academic knowledge closer to what happens in the real world.",
  cards: [
    {
      title: "Debates and meetings",
      body: "We talk with professors and professionals to learn different perspectives on International Law topics.",
    },
    {
      title: "Connections with those already in the field",
      body: "We create opportunities for students to meet professionals and researchers building careers in International Law.",
    },
    {
      title: "Looking toward the world",
      body: "We explore experiences, legal systems, and debates from other countries, broadening how we see the Law.",
    },
    {
      title: "Research and academic production",
      body: "We turn questions into research through workshops, articles, abstracts, and other academic work.",
    },
  ],
} as const;

const researchEn = {
  id: "research",
  eyebrow: "RESEARCH AND ACADEMIC PRODUCTION",
  title: "From doubt to research.",
  paragraph1:
    "At LADINT, research is not just a stage of university: it is the chance to turn a doubt into a question, a question into investigation, and an investigation into knowledge.",
  paragraph2:
    "Through workshops, research groups, academic guidance, and scientific production, we encourage students to develop their own ideas and find space to put them on paper.",
  cta: "Produce with LADINT",
} as const;

export function getAboutPageContent(locale: Locale = "pt") {
  if (locale === "en") {
    return {
      about: aboutEn,
      mission: missionEn,
      whatWeDo: whatWeDoEn,
      research: researchEn,
    };
  }

  return {
    about,
    mission,
    whatWeDo,
    research,
  };
}
