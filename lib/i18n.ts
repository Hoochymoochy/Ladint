export type Locale = "pt" | "en";

export const locales: Locale[] = ["pt", "en"];

export function localePath(locale: Locale, path = "") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "pt") return clean === "/" ? "/" : clean;
  return clean === "/" ? "/en" : `/en${clean}`;
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.pt;
}

export type DepartmentKey = "advisory" | "executive" | "academic" | "events" | "marketing";

export interface CouncilMember {
  name: string;
  role: string;
  departmentKey: DepartmentKey;
  department: string;
  image: string;
  bio: string;
}

export interface CouncilDepartment {
  key: DepartmentKey;
  name: string;
  description: string;
}

const departmentsPt: readonly CouncilDepartment[] = [
  {
    key: "advisory",
    name: "Orientação",
    description: "Orientação científica da liga.",
  },
  {
    key: "executive",
    name: "Presidência",
    description: "Liderança e representação institucional.",
  },
  {
    key: "academic",
    name: "Acadêmica",
    description: "Grupos de estudo e produção científica.",
  },
  {
    key: "events",
    name: "Eventos",
    description: "Simpósios, palestras e moot courts.",
  },
  {
    key: "marketing",
    name: "Marketing",
    description: "Comunicação e divulgação.",
  },
];

const departmentsEn: readonly CouncilDepartment[] = [
  {
    key: "advisory",
    name: "Advisory",
    description: "Faculty guidance for the league.",
  },
  {
    key: "executive",
    name: "Executive",
    description: "Leadership and institutional direction.",
  },
  {
    key: "academic",
    name: "Academic",
    description: "Study groups and research output.",
  },
  {
    key: "events",
    name: "Events",
    description: "Lectures, symposia, and moot courts.",
  },
  {
    key: "marketing",
    name: "Marketing",
    description: "Communication and outreach.",
  },
];

const councilPt: readonly CouncilMember[] = [
  // Orientação Docente
  {
    name: "Prof. Thiago Viana",
    role: "Orientador",
    departmentKey: "advisory",
    department: "Orientação Docente",
    image: "/profiles/Thiago-Viana.jpeg",
    bio: "Docente orientador dedicado ao fomento da pesquisa científica e excelência acadêmica na LADINT.",
  },
  {
    name: "Prof. Glaucia Maranhão",
    role: "Orientadora",
    departmentKey: "advisory",
    department: "Orientação Docente",
    image: "/profiles/Glaucia-Maranhao.jpeg",
    bio: "Docente orientadora com foco no desenvolvimento teórico e interdisciplinar em Direito Internacional.",
  },
  {
    name: "Prof. Izabela Trajano",
    role: "Orientadora",
    departmentKey: "advisory",
    department: "Orientação Docente",
    image: "/profiles/Izabela-Trajano.jpeg",
    bio: "Docente orientadora apoiando a formação crítica e internacionalista dos membros da liga.",
  },
  // Presidência & Secretaria
  {
    name: "Letícia Belo",
    role: "Presidente",
    departmentKey: "executive",
    department: "Presidência & Secretaria",
    image: "/profiles/Leticia-Belo.jpg",
    bio: "Liderança institucional, representação geral e coordenação estratégica da liga acadêmica.",
  },
  {
    name: "Júlia Bordalo",
    role: "Vice Presidente",
    departmentKey: "executive",
    department: "Presidência & Secretaria",
    image: "/profiles/Julia-Bordalo.jpeg",
    bio: "Vice-liderança institucional e supervisão direta das frentes e diretorias da liga.",
  },
  {
    name: "Ana Júlia Braga",
    role: "Secretária Geral",
    departmentKey: "executive",
    department: "Presidência & Secretaria",
    image: "/profiles/Ana-Julia-Braga.jpeg",
    bio: "Gestão documental, articulação administrativa e apoio executivo aos membros.",
  },
  // Diretoria Acadêmica
  {
    name: "Geovanna Costa",
    role: "Diretoria Acadêmica",
    departmentKey: "academic",
    department: "Diretoria Acadêmica",
    image: "/profiles/Geovanna-Costa.jpeg",
    bio: "Coordenação de grupos de estudos, produções científicas e publicação de artigos jurídicos.",
  },
  {
    name: "Giovanna Duarte",
    role: "Diretoria Acadêmica",
    departmentKey: "academic",
    department: "Diretoria Acadêmica",
    image: "/profiles/Giovanna-Duarte.jpeg",
    bio: "Coordenação de grupos de estudos, produções científicas e publicação de artigos jurídicos.",
  },
  {
    name: "Driele Jansen",
    role: "Diretoria Acadêmica",
    departmentKey: "academic",
    department: "Diretoria Acadêmica",
    image: "/profiles/Driele-Jansen.jpeg",
    bio: "Coordenação de grupos de estudos, produções científicas e publicação de artigos jurídicos.",
  },
  // Diretoria de Eventos
  {
    name: "Enny Lacerda",
    role: "Diretoria de Eventos",
    departmentKey: "events",
    department: "Diretoria de Eventos",
    image: "/profiles/Enny-Lacerda.jpeg",
    bio: "Organização de palestras magnas, simpósios e coordenação de delegações em moot courts.",
  },
  {
    name: "Julia Ashley",
    role: "Diretoria de Eventos",
    departmentKey: "events",
    department: "Diretoria de Eventos",
    image: "/profiles/Julia-Ashley.jpeg",
    bio: "Organização de palestras magnas, simpósios e coordenação de delegações em moot courts.",
  },
  // Diretoria de Marketing
  {
    name: "Eduardo Soares",
    role: "Diretoria de Marketing",
    departmentKey: "marketing",
    department: "Diretoria de Marketing",
    image: "/profiles/Eduardo-Soares.jpeg",
    bio: "Criação visual, estratégias de divulgação e posicionamento nas plataformas digitais da liga.",
  },
  {
    name: "Letícia Brito",
    role: "Diretoria de Marketing",
    departmentKey: "marketing",
    department: "Diretoria de Marketing",
    image: "/profiles/Leticia-Brito.jpeg",
    bio: "Criação visual, estratégias de divulgação e posicionamento nas plataformas digitais da liga.",
  },
  {
    name: "Waldirlan Segundo",
    role: "Diretoria de Marketing",
    departmentKey: "marketing",
    department: "Diretoria de Marketing",
    image: "/profiles/Waldirlan-Segundo.jpeg",
    bio: "Criação visual, estratégias de divulgação e posicionamento nas plataformas digitais da liga.",
  },
];

const councilEn: readonly CouncilMember[] = [
  // Faculty Advisory
  {
    name: "Prof. Thiago Viana",
    role: "Faculty Advisor",
    departmentKey: "advisory",
    department: "Faculty Advisory",
    image: "/profiles/Thiago-Viana.jpeg",
    bio: "Faculty advisor dedicated to fostering scientific research and academic excellence at LADINT.",
  },
  {
    name: "Prof. Glaucia Maranhão",
    role: "Faculty Advisor",
    departmentKey: "advisory",
    department: "Faculty Advisory",
    image: "/profiles/Glaucia-Maranhao.jpeg",
    bio: "Faculty advisor focused on theoretical and interdisciplinary international law scholarship.",
  },
  {
    name: "Prof. Izabela Trajano",
    role: "Faculty Advisor",
    departmentKey: "advisory",
    department: "Faculty Advisory",
    image: "/profiles/Izabela-Trajano.jpeg",
    bio: "Faculty advisor supporting critical and international legal education for league members.",
  },
  // Executive Board
  {
    name: "Letícia Belo",
    role: "President",
    departmentKey: "executive",
    department: "Executive Board",
    image: "/profiles/Leticia-Belo.jpg",
    bio: "Institutional leadership, overall representation, and strategic direction of the academic league.",
  },
  {
    name: "Júlia Bordalo",
    role: "Vice President",
    departmentKey: "executive",
    department: "Executive Board",
    image: "/profiles/Julia-Bordalo.jpeg",
    bio: "Vice-leadership and strategic coordination across all league directorships.",
  },
  {
    name: "Ana Júlia Braga",
    role: "Secretary General",
    departmentKey: "executive",
    department: "Executive Board",
    image: "/profiles/Ana-Julia-Braga.jpeg",
    bio: "Document management, administrative coordination, and executive support for members.",
  },
  // Academic Board
  {
    name: "Geovanna Costa",
    role: "Academic Director",
    departmentKey: "academic",
    department: "Academic Board",
    image: "/profiles/Geovanna-Costa.jpeg",
    bio: "Coordination of research groups, legal publications, and scientific output.",
  },
  {
    name: "Giovanna Duarte",
    role: "Academic Director",
    departmentKey: "academic",
    department: "Academic Board",
    image: "/profiles/Giovanna-Duarte.jpeg",
    bio: "Coordination of research groups, legal publications, and scientific output.",
  },
  {
    name: "Driele Jansen",
    role: "Academic Director",
    departmentKey: "academic",
    department: "Academic Board",
    image: "/profiles/Driele-Jansen.jpeg",
    bio: "Coordination of research groups, legal publications, and scientific output.",
  },
  // Events Board
  {
    name: "Enny Lacerda",
    role: "Events Director",
    departmentKey: "events",
    department: "Events Board",
    image: "/profiles/Enny-Lacerda.jpeg",
    bio: "Planning and organizing keynote lectures, symposia, and moot court delegations.",
  },
  {
    name: "Julia Ashley",
    role: "Events Director",
    departmentKey: "events",
    department: "Events Board",
    image: "/profiles/Julia-Ashley.jpeg",
    bio: "Planning and organizing keynote lectures, symposia, and moot court delegations.",
  },
  // Marketing Board
  {
    name: "Eduardo Soares",
    role: "Marketing Director",
    departmentKey: "marketing",
    department: "Marketing Board",
    image: "/profiles/Eduardo-Soares.jpeg",
    bio: "Visual design, promotional campaigns, and brand presence across digital platforms.",
  },
  {
    name: "Letícia Brito",
    role: "Marketing Director",
    departmentKey: "marketing",
    department: "Marketing Board",
    image: "/profiles/Leticia-Brito.jpeg",
    bio: "Visual design, promotional campaigns, and brand presence across digital platforms.",
  },
  {
    name: "Waldirlan Segundo",
    role: "Marketing Director",
    departmentKey: "marketing",
    department: "Marketing Board",
    image: "/profiles/Waldirlan-Segundo.jpeg",
    bio: "Visual design, promotional campaigns, and brand presence across digital platforms.",
  },
];

export const dictionaries = {
  pt: {
    locale: "pt" as const,
    htmlLang: "pt-BR",
    dateLocale: "pt-BR",
    navSubtitle: "Liga de Direito Internacional",
    navMission: "Missão & Objetivos",
    navAbout: "Sobre",
    navArticles: "Artigos Científicos",
    navEvents: "Grandes Eventos",
    navNewsletter: "Newsletter",
    navCouncil: "Conselho",
    becomeMember: "Torne-se Membro",
    adminPanel: "Painel Admin",
    langPt: "PT",
    langEn: "EN",
    heroBadge: "Pesquisa • Debate • Competições Globais",
    replayTitle: "Reiniciar animação",
    replayFrozen: "Repetir",
    exploreSite: "Explorar",
    defaultClubName: "Liga Acadêmica de Direito Internacional",
    defaultTagline:
      "A LADINT é uma liga acadêmica da UNDB criada para aproximar estudantes do Direito Internacional e das questões que conectam pessoas, Estados, empresas e tecnologias ao redor do mundo.",
    joinLeague: "Fazer Parte da Liga",
    subscribeNewsletter: "Assinar Newsletter",
    brandMark: "LADINT",
    statArticles: "Artigos Publicados",
    statEvents: "Grandes Eventos",
    statMoot: "Competições Globais",
    statUn: "Simulações & Diplomacia",
    foundationsBadge: "Sobre a LADINT",
    missionTitle: "Sobre a LADINT",
    ourMission: "Estudar Direito Internacional é entender o mundo em que vivemos.",
    missionP1:
      "A LADINT é um espaço para aprender, questionar, pesquisar e trocar experiências sobre temas que extrapolam a sala de aula. Reunimos estudantes, professores e profissionais para discutir os desafios jurídicos de um mundo cada vez mais conectado.",
    missionP2:
      "Mais do que conhecer normas e tratados, queremos desenvolver um olhar crítico sobre como o Direito acompanha, e pode transformar, as relações internacionais.",
    aboutMoreCta: "Saiba mais sobre a LADINT",
    aboutPath: "/sobre",
    pillarsTitle: "Pilares Estratégicos",
    pillar1: "Organizar debates, simpósios acadêmicos e seminários de Direito Internacional.",
    pillar2: "Conectar estudantes com diplomatas, magistrados e juristas de renome global.",
    pillar3: "Preparar e enviar equipes para simulações internacionais e Moot Courts prestigiados.",
    pillar4: "Incentivar a publicação científica em periódicos indexados e anais acadêmicos.",
    articlesPath: "/artigos",
    joinPath: "/ingressar",
    homePath: "/",
    backHome: "Voltar ao início",
    academicBadge: "Produção Acadêmica",
    articlesTitle: "Artigos Científicos Publicados",
    articlesSubtitle:
      "Pesquisas originais desenvolvidas por membros e orientadores da LADINT em cooperação com periódicos jurídicos.",
    manageArticles: "Gerenciar Artigos no Admin",
    noArticles: "Nenhum artigo publicado no momento.",
    byAuthors: "Por:",
    readAbstract: "Ver Resumo Completo",
    access: "Acessar",
    representBadge: "Representatividade",
    eventsTitle: "Participação em Grandes Eventos",
    eventsSubtitle:
      "Nossa presença ativa em julgamentos simulados (Moot Courts), conferências diplomáticas e fóruns internacionais.",
    manageEvents: "Gerenciar Eventos no Admin",
    noEvents: "Nenhum evento registrado no momento.",
    eventDetails: "Ver Detalhes do Evento",
    newsletterBadge: "Boletim Informativo LADINT",
    newsletterTitle: "Receba nossas edições, análises e convites em primeira mão.",
    newsletterBody:
      "Assine nossa newsletter periódica gratuita com curadoria de temas quentes de direito internacional, decisões de cortes globais, oportunidades de estágio e chamadas de artigos.",
    namePlaceholder: "Nome completo",
    emailPlaceholder: "E-mail",
    subscribing: "Inscrevendo...",
    subscribeFree: "Inscrever-se Gratuitamente",
    privacyNote: "Respeitamos sua privacidade. Sem spam, cancele quando desejar.",
    recentIssues: "Últimas Edições Publicadas",
    noIssues: "Nenhuma edição arquivada ainda.",
    readIssue: "Ler Edição Completa",
    leadershipBadge: "Liderança",
    councilTitle: "Conselho Diretor",
    councilSubtitle: "A equipe à frente da LADINT.",
    ctaTitle: "Faça Parte da Nossa História",
    ctaBody:
      "Seja você um estudante iniciante ou avançado, a LADINT oferece a plataforma ideal para desenvolver oratória, redação de memoriais, networking e publicação científica.",
    becomeMemberCta: "Torne-se um Membro",
    openJoinForm: "Abrir formulário de inscrição",
    ctaClosedTitle: "Inscrições temporariamente fechadas",
    ctaClosedBody:
      "Não estamos aceitando novos membros neste momento. Volte em breve para acompanhar a reabertura das vagas.",
    ctaClosedAction: "Voltar ao início",
    joinFormMissingBody:
      "As inscrições estão abertas, mas o formulário ainda não foi configurado. Tente novamente em breve.",
    loadingPage: "Carregando...",
    footerRights: "Todos os direitos reservados.",
    contact: "Contato:",
    adminControl: "Painel de Controle (Admin)",
    applyTitle: "Candidatura para Membro LADINT",
    applyDescription:
      "Preencha os dados abaixo para participar dos próximos processos seletivos e grupos de pesquisa.",
    fullName: "Nome Completo *",
    fullNamePlaceholder: "Nome completo",
    emailLabel: "E-mail Acadêmico / Pessoal *",
    emailExample: "exemplo@universidade.br",
    phoneLabel: "WhatsApp / Telefone",
    phonePlaceholder: "+55 11 98765-4321",
    courseLabel: "Curso & Semestre",
    coursePlaceholder: "Ex: Direito - 5º Período",
    motivationLabel: "Por que deseja ingressar na LADINT?",
    motivationPlaceholder: "Conte brevemente sobre seus interesses acadêmicos e expectativas...",
    cancel: "Cancelar",
    submitApplication: "Enviar Candidatura",
    applySuccessTitle: "Obrigado por se candidatar!",
    applySuccessBody:
      "Recebemos sua inscrição. Entraremos em contato em breve com os próximos passos.",
    abstractLabel: "Resumo / Abstract",
    keywordsLabel: "Palavras-chave",
    authorsLabel: "Autores:",
    accessFullArticle: "Acessar Artigo Completo no Periódico",
    openPdf: "Abrir PDF",
    awardLabel: "Destaque / Premiação:",
    aboutActuation: "Sobre a Atuação",
    invalidEmail: "Por favor, digite um e-mail válido.",
    councilDepartments: departmentsPt,
    allDepartmentsLabel: "Todos",
    membersCountLabel: "membros",
    councilMembers: councilPt,
  },
  en: {
    locale: "en" as const,
    htmlLang: "en",
    dateLocale: "en-US",
    navSubtitle: "International Law League",
    navMission: "Mission & Goals",
    navAbout: "About",
    navArticles: "Scientific Articles",
    navEvents: "Major Events",
    navNewsletter: "Newsletter",
    navCouncil: "Council",
    becomeMember: "Become a Member",
    adminPanel: "Admin Panel",
    langPt: "PT",
    langEn: "EN",
    heroBadge: "Research • Debate • Global Competitions",
    replayTitle: "Replay animation",
    replayFrozen: "Replay",
    exploreSite: "Explore",
    defaultClubName: "Academic League of International Law",
    defaultTagline:
      "Promote the critical and interdisciplinary study of International Law in light of today's global challenges.",
    joinLeague: "Join the League",
    subscribeNewsletter: "Subscribe to Newsletter",
    brandMark: "LADINT",
    statArticles: "Published Articles",
    statEvents: "Major Events",
    statMoot: "Global Competitions",
    statUn: "Simulations & Diplomacy",
    foundationsBadge: "About LADINT",
    missionTitle: "About LADINT",
    ourMission: "Studying International Law is understanding the world we live in.",
    missionP1:
      "LADINT is a space to learn, question, research, and exchange experiences on topics that go beyond the classroom. We bring together students, professors, and professionals to discuss the legal challenges of an increasingly connected world.",
    missionP2:
      "More than knowing norms and treaties, we want to develop a critical view of how Law accompanies — and can transform — international relations.",
    aboutMoreCta: "Learn more about LADINT",
    aboutPath: "/en/about",
    pillarsTitle: "Strategic Pillars",
    pillar1: "Organize debates, academic symposia, and seminars on International Law.",
    pillar2: "Connect students with diplomats, judges, and renowned global jurists.",
    pillar3: "Prepare and send teams to prestigious international simulations and Moot Courts.",
    pillar4: "Encourage scientific publication in indexed journals and academic proceedings.",
    articlesPath: "/en/articles",
    joinPath: "/en/join",
    homePath: "/en",
    backHome: "Back to home",
    academicBadge: "Academic Output",
    articlesTitle: "Published Scientific Articles",
    articlesSubtitle:
      "Original research developed by LADINT members and advisors in collaboration with legal journals.",
    manageArticles: "Manage Articles in Admin",
    noArticles: "No articles published at the moment.",
    byAuthors: "By:",
    readAbstract: "Read Full Abstract",
    access: "Access",
    representBadge: "Representation",
    eventsTitle: "Participation in Major Events",
    eventsSubtitle:
      "Our active presence in moot courts, diplomatic conferences, and international forums.",
    manageEvents: "Manage Events in Admin",
    noEvents: "No events registered at the moment.",
    eventDetails: "View Event Details",
    newsletterBadge: "LADINT Newsletter",
    newsletterTitle: "Get our editions, analyses, and invitations first.",
    newsletterBody:
      "Subscribe to our free periodic newsletter with curated hot topics in international law, global court decisions, internship opportunities, and calls for papers.",
    namePlaceholder: "Full name",
    emailPlaceholder: "Email",
    subscribing: "Subscribing...",
    subscribeFree: "Subscribe for Free",
    privacyNote: "We respect your privacy. No spam — unsubscribe anytime.",
    recentIssues: "Latest Published Editions",
    noIssues: "No archived editions yet.",
    readIssue: "Read Full Edition",
    leadershipBadge: "Leadership",
    councilTitle: "Board of Directors",
    councilSubtitle: "The team leading LADINT.",
    ctaTitle: "Be Part of Our Story",
    ctaBody:
      "Whether you are a beginning or advanced student, LADINT offers the ideal platform to develop oratory, memorial drafting, networking, and scientific publication.",
    becomeMemberCta: "Become a Member",
    openJoinForm: "Open application form",
    ctaClosedTitle: "Applications temporarily closed",
    ctaClosedBody:
      "We are not accepting new members right now. Check back soon for when applications reopen.",
    ctaClosedAction: "Back to home",
    joinFormMissingBody:
      "Applications are open, but the form has not been configured yet. Please try again soon.",
    loadingPage: "Loading...",
    footerRights: "All rights reserved.",
    contact: "Contact:",
    adminControl: "Control Panel (Admin)",
    applyTitle: "LADINT Membership Application",
    applyDescription:
      "Fill in the details below to join upcoming selection processes and research groups.",
    fullName: "Full Name *",
    fullNamePlaceholder: "Full name",
    emailLabel: "Academic / Personal Email *",
    emailExample: "example@university.edu",
    phoneLabel: "WhatsApp / Phone",
    phonePlaceholder: "+55 11 98765-4321",
    courseLabel: "Course & Semester",
    coursePlaceholder: "e.g. Law - 5th Term",
    motivationLabel: "Why do you want to join LADINT?",
    motivationPlaceholder: "Briefly share your academic interests and expectations...",
    cancel: "Cancel",
    submitApplication: "Submit Application",
    applySuccessTitle: "Thanks for applying!",
    applySuccessBody:
      "We received your application. We'll get back to you soon about the next steps.",
    abstractLabel: "Abstract",
    keywordsLabel: "Keywords",
    authorsLabel: "Authors:",
    accessFullArticle: "Access Full Article in Journal",
    openPdf: "Open PDF",
    awardLabel: "Highlight / Award:",
    aboutActuation: "About Our Participation",
    invalidEmail: "Please enter a valid email.",
    councilDepartments: departmentsEn,
    allDepartmentsLabel: "All",
    membersCountLabel: "members",
    councilMembers: councilEn,
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

