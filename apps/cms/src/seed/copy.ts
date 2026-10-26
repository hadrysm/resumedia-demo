import type { LocaleCode } from '@resumedia-demo/shared/locales'

import type { RichNode } from './lexical'

type Pair = [string, string]

export type LocaleCopy = {
  hero: {
    eyebrow: string
    toolboxHeading: string
    builderHeading: string
    sub: string
    cta: string
    tools: Pair[]
    checks: string[]
  }
  features: { heading: string; intro: string; items: Pair[] }
  gallery: { heading: string; intro: string }
  pricing: { heading: string; intro: string; button: string }
  faq: { heading: string; items: Pair[] }
  cta: { heading: string; body: string; button: string }
  homeMeta: { title: string; description: string }
  article: {
    slug: string
    eyebrow: string
    title: string
    description: string
    body: RichNode[]
    ctaHeading: string
    ctaBody: string
  }
}

const en: LocaleCopy = {
  hero: {
    eyebrow: 'Trusted by 50 million job seekers',
    toolboxHeading: 'Everything you need to land your next job',
    builderHeading: 'Build a resume that gets you hired',
    sub: 'Create a professional resume in minutes with expert templates, AI writing help and a cover letter that matches.',
    cta: 'Create my resume',
    tools: [
      ['Resume builder', 'Recruiter-approved templates'],
      ['Cover letters', 'Matched to every resume'],
      ['Job search', 'Fresh vacancies every day'],
      ['Interview prep', 'Practice the hard questions'],
    ],
    checks: ['Ready in 10 minutes', 'Download as PDF or Word', 'ATS-friendly layouts'],
  },
  features: {
    heading: 'Why {brand} works',
    intro: 'Career experts and recruiters shaped every step, so you can focus on the job you want.',
    items: [
      ['Professional templates', 'Clean layouts that pass applicant tracking systems and impress recruiters.'],
      ['Writing help with AI', 'Get suggestions for every section, tailored to your role and experience.'],
      ['Download anywhere', 'Export to PDF or Word and apply on any job site in one click.'],
    ],
  },
  gallery: { heading: 'Templates for every career', intro: 'Pick a design, then switch at any time without retyping.' },
  pricing: {
    heading: 'Simple plans, cancel any time',
    intro: 'Prices shown for your country. Every plan includes all templates.',
    button: 'Choose plan',
  },
  faq: {
    heading: 'Frequently asked questions',
    items: [
      ['Is {brand} free to use?', 'You can create and edit your resume for free. A plan is needed to download it without a watermark.'],
      ['Will my resume pass applicant tracking systems?', 'Yes. Every template uses a clear structure and real text that ATS software can read.'],
      ['Can I change my template later?', 'Yes. Your content moves to the new design automatically.'],
    ],
  },
  cta: {
    heading: 'Your next job starts with a great resume',
    body: 'Join millions of job seekers who built their resume with {brand}.',
    button: 'Get started',
  },
  homeMeta: {
    title: '{brand}: online resume builder with expert templates',
    description: 'Create a professional resume in minutes with {brand}. Expert templates, AI writing help and instant PDF download.',
  },
  article: {
    slug: 'blog/how-to-write-a-resume',
    eyebrow: 'Career advice',
    title: 'How to write a resume in 2026',
    description: 'A step-by-step guide to a resume that recruiters read to the end.',
    body: [
      { h2: 'Start with a strong summary' },
      { p: 'Open with three sentences that say who you are, what you are good at and what you want next. Recruiters spend seconds on the first scan, so make them count.' },
      { h2: 'Show results, not duties' },
      { p: 'For every role, list two to four achievements. Use numbers where you can.' },
      { ul: ['Grew newsletter sign-ups by 40% in six months', 'Cut onboarding time from three weeks to one', 'Managed a budget of $250,000'] },
      { h2: 'Keep the layout clean' },
      { p: 'Use one clear template, consistent dates and a readable font. Save as PDF unless the job ad asks for Word.' },
    ],
    ctaHeading: 'Ready to write yours?',
    ctaBody: 'Pick a template and let {brand} guide you through every section.',
  },
}

// British English differs from US English here only in vocabulary: "CV" for "resume" and pounds for dollars.
const enGB: LocaleCopy = JSON.parse(
  JSON.stringify(en).replaceAll('resumes', 'CVs').replaceAll('resume', 'CV').replaceAll('Resume', 'CV').replaceAll('$', '£'),
)
enGB.article.slug = 'blog/how-to-write-a-cv'

const nl: LocaleCopy = {
  hero: {
    eyebrow: 'Vertrouwd door 50 miljoen werkzoekenden',
    toolboxHeading: 'Alles wat je nodig hebt voor je volgende baan',
    builderHeading: 'Maak een cv waarmee je wordt aangenomen',
    sub: 'Maak in een paar minuten een professioneel cv met sjablonen van experts, schrijfhulp met AI en een bijpassende sollicitatiebrief.',
    cta: 'Maak mijn cv',
    tools: [
      ['Cv-maker', 'Sjablonen goedgekeurd door recruiters'],
      ['Sollicitatiebrieven', 'Passend bij elk cv'],
      ['Vacatures', 'Elke dag nieuwe banen'],
      ['Sollicitatiegesprek', 'Oefen de lastige vragen'],
    ],
    checks: ['Klaar in 10 minuten', 'Download als PDF of Word', 'Geschikt voor ATS-systemen'],
  },
  features: {
    heading: 'Waarom {brand} werkt',
    intro: 'Loopbaanexperts en recruiters dachten mee over elke stap, zodat jij je kunt richten op de baan die je wilt.',
    items: [
      ['Professionele sjablonen', 'Strakke opmaak die door sollicitatiesystemen komt en recruiters overtuigt.'],
      ['Schrijfhulp met AI', 'Suggesties voor elke sectie, afgestemd op je functie en ervaring.'],
      ['Overal downloaden', 'Exporteer naar PDF of Word en solliciteer met één klik.'],
    ],
  },
  gallery: { heading: 'Sjablonen voor elke loopbaan', intro: 'Kies een ontwerp en wissel wanneer je wilt, zonder opnieuw te typen.' },
  pricing: {
    heading: 'Eenvoudige abonnementen, altijd opzegbaar',
    intro: 'Prijzen voor jouw land. Elk abonnement bevat alle sjablonen.',
    button: 'Kies abonnement',
  },
  faq: {
    heading: 'Veelgestelde vragen',
    items: [
      ['Is {brand} gratis?', 'Je kunt je cv gratis maken en bewerken. Voor downloaden zonder watermerk heb je een abonnement nodig.'],
      ['Komt mijn cv door ATS-systemen?', 'Ja. Elk sjabloon heeft een duidelijke structuur met echte tekst die ATS-software kan lezen.'],
      ['Kan ik later van sjabloon wisselen?', 'Ja. Je inhoud gaat automatisch mee naar het nieuwe ontwerp.'],
    ],
  },
  cta: {
    heading: 'Je volgende baan begint met een goed cv',
    body: 'Sluit je aan bij miljoenen werkzoekenden die hun cv met {brand} maakten.',
    button: 'Aan de slag',
  },
  homeMeta: {
    title: '{brand}: online cv maken met sjablonen van experts',
    description: 'Maak in een paar minuten een professioneel cv met {brand}. Sjablonen van experts, schrijfhulp met AI en direct downloaden als PDF.',
  },
  article: {
    slug: 'blog/cv-schrijven',
    eyebrow: 'Loopbaanadvies',
    title: 'Een cv schrijven in 2026',
    description: 'Stap voor stap naar een cv dat recruiters tot het einde lezen.',
    body: [
      { h2: 'Begin met een sterk profiel' },
      { p: 'Open met drie zinnen over wie je bent, waar je goed in bent en wat je zoekt. Recruiters scannen in seconden, dus laat ze tellen.' },
      { h2: 'Laat resultaten zien, geen taken' },
      { p: 'Noem per functie twee tot vier resultaten. Gebruik cijfers waar het kan.' },
      { ul: ['Nieuwsbriefaanmeldingen in zes maanden met 40% verhoogd', 'Inwerktijd teruggebracht van drie weken naar één', 'Budget van € 250.000 beheerd'] },
      { h2: 'Houd de opmaak rustig' },
      { p: 'Gebruik één duidelijk sjabloon, consistente data en een leesbaar lettertype. Sla op als PDF, tenzij de vacature om Word vraagt.' },
    ],
    ctaHeading: 'Klaar om het jouwe te schrijven?',
    ctaBody: 'Kies een sjabloon en laat {brand} je door elke sectie helpen.',
  },
}

const de: LocaleCopy = {
  hero: {
    eyebrow: 'Über 50 Millionen Jobsuchende vertrauen uns',
    toolboxHeading: 'Alles, was du für deinen nächsten Job brauchst',
    builderHeading: 'Erstelle einen Lebenslauf, der überzeugt',
    sub: 'Erstelle in wenigen Minuten einen professionellen Lebenslauf mit Expertenvorlagen, KI-Schreibhilfe und passendem Anschreiben.',
    cta: 'Lebenslauf erstellen',
    tools: [
      ['Lebenslauf-Editor', 'Von Recruitern geprüfte Vorlagen'],
      ['Anschreiben', 'Passend zu jedem Lebenslauf'],
      ['Jobsuche', 'Täglich neue Stellen'],
      ['Interviewtraining', 'Übe die schwierigen Fragen'],
    ],
    checks: ['In 10 Minuten fertig', 'Download als PDF oder Word', 'ATS-freundliche Layouts'],
  },
  features: {
    heading: 'Warum {brand} funktioniert',
    intro: 'Karriereexperten und Recruiter haben jeden Schritt mitgestaltet, damit du dich auf deinen Wunschjob konzentrieren kannst.',
    items: [
      ['Professionelle Vorlagen', 'Klare Layouts, die Bewerbermanagementsysteme bestehen und Recruiter überzeugen.'],
      ['Schreibhilfe mit KI', 'Vorschläge für jeden Abschnitt, passend zu deiner Rolle und Erfahrung.'],
      ['Überall herunterladen', 'Als PDF oder Word exportieren und mit einem Klick bewerben.'],
    ],
  },
  gallery: { heading: 'Vorlagen für jede Karriere', intro: 'Wähle ein Design und wechsle jederzeit, ohne neu zu tippen.' },
  pricing: {
    heading: 'Einfache Tarife, jederzeit kündbar',
    intro: 'Preise für dein Land. Jeder Tarif enthält alle Vorlagen.',
    button: 'Tarif wählen',
  },
  faq: {
    heading: 'Häufige Fragen',
    items: [
      ['Ist {brand} kostenlos?', 'Du kannst deinen Lebenslauf kostenlos erstellen und bearbeiten. Für den Download ohne Wasserzeichen brauchst du einen Tarif.'],
      ['Besteht mein Lebenslauf ATS-Systeme?', 'Ja. Jede Vorlage nutzt eine klare Struktur mit echtem Text, den ATS-Software lesen kann.'],
      ['Kann ich die Vorlage später wechseln?', 'Ja. Deine Inhalte werden automatisch in das neue Design übernommen.'],
    ],
  },
  cta: {
    heading: 'Dein nächster Job beginnt mit einem starken Lebenslauf',
    body: 'Schließ dich Millionen Jobsuchenden an, die ihren Lebenslauf mit {brand} erstellt haben.',
    button: 'Jetzt starten',
  },
  homeMeta: {
    title: '{brand}: Lebenslauf online erstellen mit Expertenvorlagen',
    description: 'Erstelle in wenigen Minuten einen professionellen Lebenslauf mit {brand}. Expertenvorlagen, KI-Schreibhilfe und sofortiger PDF-Download.',
  },
  article: {
    slug: 'blog/lebenslauf-schreiben',
    eyebrow: 'Karrieretipps',
    title: 'Einen Lebenslauf schreiben in 2026',
    description: 'Schritt für Schritt zu einem Lebenslauf, den Recruiter bis zum Ende lesen.',
    body: [
      { h2: 'Beginne mit einem starken Profil' },
      { p: 'Starte mit drei Sätzen: wer du bist, was du gut kannst und was du als Nächstes willst. Recruiter scannen in Sekunden, also nutze sie.' },
      { h2: 'Zeige Ergebnisse statt Aufgaben' },
      { p: 'Nenne pro Position zwei bis vier Erfolge. Nutze Zahlen, wo es geht.' },
      { ul: ['Newsletter-Anmeldungen in sechs Monaten um 40 % gesteigert', 'Einarbeitungszeit von drei Wochen auf eine verkürzt', 'Budget von 250.000 € verantwortet'] },
      { h2: 'Halte das Layout klar' },
      { p: 'Nutze eine klare Vorlage, einheitliche Datumsangaben und eine gut lesbare Schrift. Speichere als PDF, außer die Stellenanzeige verlangt Word.' },
    ],
    ctaHeading: 'Bereit für deinen eigenen?',
    ctaBody: 'Wähle eine Vorlage und lass dich von {brand} durch jeden Abschnitt führen.',
  },
}

const fr: LocaleCopy = {
  hero: {
    eyebrow: 'Plus de 50 millions de candidats nous font confiance',
    toolboxHeading: 'Tout ce qu’il vous faut pour décrocher votre prochain emploi',
    builderHeading: 'Créez un CV qui vous fait embaucher',
    sub: 'Créez un CV professionnel en quelques minutes avec des modèles d’experts, une aide à la rédaction par IA et une lettre de motivation assortie.',
    cta: 'Créer mon CV',
    tools: [
      ['Créateur de CV', 'Modèles validés par des recruteurs'],
      ['Lettres de motivation', 'Assorties à chaque CV'],
      ['Offres d’emploi', 'De nouvelles offres chaque jour'],
      ['Préparation aux entretiens', 'Entraînez-vous aux questions difficiles'],
    ],
    checks: ['Prêt en 10 minutes', 'Téléchargement en PDF ou Word', 'Mises en page compatibles ATS'],
  },
  features: {
    heading: 'Pourquoi {brand} fonctionne',
    intro: 'Des experts carrière et des recruteurs ont conçu chaque étape, pour que vous puissiez vous concentrer sur le poste visé.',
    items: [
      ['Modèles professionnels', 'Des mises en page nettes qui passent les logiciels de recrutement et séduisent les recruteurs.'],
      ['Aide à la rédaction par IA', 'Des suggestions pour chaque section, adaptées à votre poste et à votre expérience.'],
      ['Téléchargez partout', 'Exportez en PDF ou Word et postulez en un clic.'],
    ],
  },
  gallery: { heading: 'Des modèles pour chaque carrière', intro: 'Choisissez un design et changez-en à tout moment, sans tout retaper.' },
  pricing: {
    heading: 'Des formules simples, sans engagement',
    intro: 'Prix affichés pour votre pays. Chaque formule inclut tous les modèles.',
    button: 'Choisir la formule',
  },
  faq: {
    heading: 'Questions fréquentes',
    items: [
      ['{brand} est-il gratuit ?', 'Vous pouvez créer et modifier votre CV gratuitement. Une formule est nécessaire pour le télécharger sans filigrane.'],
      ['Mon CV passera-t-il les logiciels ATS ?', 'Oui. Chaque modèle utilise une structure claire et du vrai texte lisible par les logiciels ATS.'],
      ['Puis-je changer de modèle plus tard ?', 'Oui. Votre contenu est transféré automatiquement dans le nouveau design.'],
    ],
  },
  cta: {
    heading: 'Votre prochain emploi commence par un excellent CV',
    body: 'Rejoignez des millions de candidats qui ont créé leur CV avec {brand}.',
    button: 'Commencer',
  },
  homeMeta: {
    title: '{brand} : créer un CV en ligne avec des modèles d’experts',
    description: 'Créez un CV professionnel en quelques minutes avec {brand}. Modèles d’experts, aide à la rédaction par IA et téléchargement PDF immédiat.',
  },
  article: {
    slug: 'blog/rediger-un-cv',
    eyebrow: 'Conseils carrière',
    title: 'Comment rédiger un CV en 2026',
    description: 'Le guide étape par étape pour un CV que les recruteurs lisent jusqu’au bout.',
    body: [
      { h2: 'Commencez par un profil percutant' },
      { p: 'Ouvrez avec trois phrases : qui vous êtes, ce que vous faites bien et ce que vous recherchez. Les recruteurs lisent en quelques secondes, faites-les compter.' },
      { h2: 'Montrez des résultats, pas des tâches' },
      { p: 'Pour chaque poste, citez deux à quatre réalisations. Utilisez des chiffres quand c’est possible.' },
      { ul: ['Inscriptions à la newsletter en hausse de 40 % en six mois', 'Durée d’intégration réduite de trois semaines à une', 'Gestion d’un budget de 250 000 €'] },
      { h2: 'Gardez une mise en page sobre' },
      { p: 'Utilisez un modèle clair, des dates cohérentes et une police lisible. Enregistrez en PDF, sauf si l’annonce demande un fichier Word.' },
    ],
    ctaHeading: 'Prêt à rédiger le vôtre ?',
    ctaBody: 'Choisissez un modèle et laissez {brand} vous guider à chaque section.',
  },
}

const es: LocaleCopy = {
  hero: {
    eyebrow: 'Más de 50 millones de candidatos confían en nosotros',
    toolboxHeading: 'Todo lo que necesitas para conseguir tu próximo empleo',
    builderHeading: 'Crea un currículum que te consiga el trabajo',
    sub: 'Crea un currículum profesional en minutos con plantillas de expertos, ayuda de redacción con IA y una carta de presentación a juego.',
    cta: 'Crear mi currículum',
    tools: [
      ['Creador de currículum', 'Plantillas aprobadas por reclutadores'],
      ['Cartas de presentación', 'A juego con cada currículum'],
      ['Búsqueda de empleo', 'Nuevas ofertas cada día'],
      ['Preparación de entrevistas', 'Practica las preguntas difíciles'],
    ],
    checks: ['Listo en 10 minutos', 'Descarga en PDF o Word', 'Diseños compatibles con ATS'],
  },
  features: {
    heading: 'Por qué funciona {brand}',
    intro: 'Expertos en empleo y reclutadores diseñaron cada paso, para que tú te centres en el trabajo que quieres.',
    items: [
      ['Plantillas profesionales', 'Diseños limpios que superan los sistemas de selección y convencen a los reclutadores.'],
      ['Ayuda de redacción con IA', 'Sugerencias para cada sección, adaptadas a tu puesto y experiencia.'],
      ['Descarga donde quieras', 'Exporta a PDF o Word y postúlate con un clic.'],
    ],
  },
  gallery: { heading: 'Plantillas para cada carrera', intro: 'Elige un diseño y cámbialo cuando quieras, sin volver a escribir.' },
  pricing: {
    heading: 'Planes sencillos, cancela cuando quieras',
    intro: 'Precios para tu país. Todos los planes incluyen todas las plantillas.',
    button: 'Elegir plan',
  },
  faq: {
    heading: 'Preguntas frecuentes',
    items: [
      ['¿{brand} es gratis?', 'Puedes crear y editar tu currículum gratis. Para descargarlo sin marca de agua necesitas un plan.'],
      ['¿Mi currículum superará los sistemas ATS?', 'Sí. Cada plantilla usa una estructura clara con texto real que el software ATS puede leer.'],
      ['¿Puedo cambiar de plantilla más tarde?', 'Sí. Tu contenido pasa automáticamente al nuevo diseño.'],
    ],
  },
  cta: {
    heading: 'Tu próximo empleo empieza con un gran currículum',
    body: 'Únete a millones de candidatos que crearon su currículum con {brand}.',
    button: 'Empezar',
  },
  homeMeta: {
    title: '{brand}: crea tu currículum online con plantillas de expertos',
    description: 'Crea un currículum profesional en minutos con {brand}. Plantillas de expertos, ayuda de redacción con IA y descarga inmediata en PDF.',
  },
  article: {
    slug: 'blog/como-hacer-un-curriculum',
    eyebrow: 'Consejos de empleo',
    title: 'Cómo hacer un currículum en 2026',
    description: 'Guía paso a paso para un currículum que los reclutadores leen hasta el final.',
    body: [
      { h2: 'Empieza con un perfil potente' },
      { p: 'Abre con tres frases: quién eres, en qué destacas y qué buscas. Los reclutadores leen en segundos, aprovéchalos.' },
      { h2: 'Muestra resultados, no tareas' },
      { p: 'En cada puesto, incluye de dos a cuatro logros. Usa cifras siempre que puedas.' },
      { ul: ['Aumenté las altas al boletín un 40 % en seis meses', 'Reduje la incorporación de tres semanas a una', 'Gestioné un presupuesto de 250.000 €'] },
      { h2: 'Mantén un diseño limpio' },
      { p: 'Usa una plantilla clara, fechas coherentes y una fuente legible. Guarda en PDF, salvo que la oferta pida Word.' },
    ],
    ctaHeading: '¿Listo para escribir el tuyo?',
    ctaBody: 'Elige una plantilla y deja que {brand} te guíe en cada sección.',
  },
}

const it: LocaleCopy = {
  hero: {
    eyebrow: 'Oltre 50 milioni di candidati si fidano di noi',
    toolboxHeading: 'Tutto ciò che serve per ottenere il tuo prossimo lavoro',
    builderHeading: 'Crea un curriculum che ti fa assumere',
    sub: 'Crea un curriculum professionale in pochi minuti con modelli di esperti, aiuto alla scrittura con l’IA e una lettera di presentazione coordinata.',
    cta: 'Crea il mio curriculum',
    tools: [
      ['Crea curriculum', 'Modelli approvati dai recruiter'],
      ['Lettere di presentazione', 'Coordinate con ogni curriculum'],
      ['Offerte di lavoro', 'Nuove offerte ogni giorno'],
      ['Preparazione ai colloqui', 'Allenati sulle domande difficili'],
    ],
    checks: ['Pronto in 10 minuti', 'Download in PDF o Word', 'Layout compatibili con ATS'],
  },
  features: {
    heading: 'Perché {brand} funziona',
    intro: 'Esperti di carriera e recruiter hanno progettato ogni passaggio, così puoi concentrarti sul lavoro che vuoi.',
    items: [
      ['Modelli professionali', 'Layout puliti che superano i sistemi di selezione e convincono i recruiter.'],
      ['Aiuto alla scrittura con l’IA', 'Suggerimenti per ogni sezione, su misura per il tuo ruolo e la tua esperienza.'],
      ['Scarica ovunque', 'Esporta in PDF o Word e candidati con un clic.'],
    ],
  },
  gallery: { heading: 'Modelli per ogni carriera', intro: 'Scegli un design e cambialo quando vuoi, senza riscrivere nulla.' },
  pricing: {
    heading: 'Piani semplici, disdici quando vuoi',
    intro: 'Prezzi per il tuo paese. Ogni piano include tutti i modelli.',
    button: 'Scegli il piano',
  },
  faq: {
    heading: 'Domande frequenti',
    items: [
      ['{brand} è gratuito?', 'Puoi creare e modificare il tuo curriculum gratis. Per scaricarlo senza filigrana serve un piano.'],
      ['Il mio curriculum supererà i sistemi ATS?', 'Sì. Ogni modello usa una struttura chiara con testo reale leggibile dai software ATS.'],
      ['Posso cambiare modello in seguito?', 'Sì. I tuoi contenuti passano automaticamente al nuovo design.'],
    ],
  },
  cta: {
    heading: 'Il tuo prossimo lavoro inizia con un ottimo curriculum',
    body: 'Unisciti a milioni di candidati che hanno creato il curriculum con {brand}.',
    button: 'Inizia ora',
  },
  homeMeta: {
    title: '{brand}: crea il curriculum online con modelli di esperti',
    description: 'Crea un curriculum professionale in pochi minuti con {brand}. Modelli di esperti, aiuto alla scrittura con l’IA e download PDF immediato.',
  },
  article: {
    slug: 'blog/come-scrivere-un-curriculum',
    eyebrow: 'Consigli di carriera',
    title: 'Come scrivere un curriculum nel 2026',
    description: 'La guida passo passo a un curriculum che i recruiter leggono fino in fondo.',
    body: [
      { h2: 'Inizia con un profilo forte' },
      { p: 'Apri con tre frasi: chi sei, in cosa sei bravo e cosa cerchi. I recruiter leggono in pochi secondi, sfruttali.' },
      { h2: 'Mostra risultati, non mansioni' },
      { p: 'Per ogni ruolo indica da due a quattro risultati. Usa i numeri quando puoi.' },
      { ul: ['Iscrizioni alla newsletter aumentate del 40% in sei mesi', 'Inserimento ridotto da tre settimane a una', 'Gestione di un budget di 250.000 €'] },
      { h2: 'Mantieni un layout pulito' },
      { p: 'Usa un modello chiaro, date coerenti e un carattere leggibile. Salva in PDF, a meno che l’annuncio non chieda Word.' },
    ],
    ctaHeading: 'Pronto a scrivere il tuo?',
    ctaBody: 'Scegli un modello e lascia che {brand} ti guidi in ogni sezione.',
  },
}

const pl: LocaleCopy = {
  hero: {
    eyebrow: 'Zaufało nam ponad 50 milionów kandydatów',
    toolboxHeading: 'Wszystko, czego potrzebujesz do nowej pracy',
    builderHeading: 'Stwórz CV, które zapewni Ci pracę',
    sub: 'Stwórz profesjonalne CV w kilka minut dzięki szablonom ekspertów, pomocy AI w pisaniu i dopasowanemu listowi motywacyjnemu.',
    cta: 'Stwórz moje CV',
    tools: [
      ['Kreator CV', 'Szablony zatwierdzone przez rekruterów'],
      ['Listy motywacyjne', 'Dopasowane do każdego CV'],
      ['Oferty pracy', 'Nowe ogłoszenia codziennie'],
      ['Przygotowanie do rozmowy', 'Przećwicz trudne pytania'],
    ],
    checks: ['Gotowe w 10 minut', 'Pobierz jako PDF lub Word', 'Układy zgodne z ATS'],
  },
  features: {
    heading: 'Dlaczego {brand} działa',
    intro: 'Eksperci od kariery i rekruterzy zaprojektowali każdy krok, abyś mógł skupić się na wymarzonej pracy.',
    items: [
      ['Profesjonalne szablony', 'Przejrzyste układy, które przechodzą systemy rekrutacyjne i przekonują rekruterów.'],
      ['Pomoc AI w pisaniu', 'Podpowiedzi do każdej sekcji, dopasowane do Twojego stanowiska i doświadczenia.'],
      ['Pobieraj wszędzie', 'Eksportuj do PDF lub Word i aplikuj jednym kliknięciem.'],
    ],
  },
  gallery: { heading: 'Szablony na każdą ścieżkę kariery', intro: 'Wybierz projekt i zmieniaj go w dowolnej chwili bez przepisywania.' },
  pricing: {
    heading: 'Proste plany, rezygnujesz kiedy chcesz',
    intro: 'Ceny dla Twojego kraju. Każdy plan obejmuje wszystkie szablony.',
    button: 'Wybierz plan',
  },
  faq: {
    heading: 'Najczęstsze pytania',
    items: [
      ['Czy {brand} jest darmowy?', 'CV możesz tworzyć i edytować za darmo. Aby pobrać je bez znaku wodnego, potrzebujesz planu.'],
      ['Czy moje CV przejdzie przez systemy ATS?', 'Tak. Każdy szablon ma przejrzystą strukturę i prawdziwy tekst, który odczyta oprogramowanie ATS.'],
      ['Czy mogę później zmienić szablon?', 'Tak. Treść automatycznie przeniesie się do nowego projektu.'],
    ],
  },
  cta: {
    heading: 'Nowa praca zaczyna się od dobrego CV',
    body: 'Dołącz do milionów kandydatów, którzy stworzyli CV z {brand}.',
    button: 'Zaczynamy',
  },
  homeMeta: {
    title: '{brand}: kreator CV online z szablonami ekspertów',
    description: 'Stwórz profesjonalne CV w kilka minut z {brand}. Szablony ekspertów, pomoc AI w pisaniu i natychmiastowe pobieranie PDF.',
  },
  article: {
    slug: 'blog/jak-napisac-cv',
    eyebrow: 'Porady kariery',
    title: 'Jak napisać CV w 2026 roku',
    description: 'Przewodnik krok po kroku do CV, które rekruterzy czytają do końca.',
    body: [
      { h2: 'Zacznij od mocnego podsumowania' },
      { p: 'Otwórz trzema zdaniami: kim jesteś, w czym jesteś dobry i czego szukasz. Rekruterzy czytają w kilka sekund, wykorzystaj je.' },
      { h2: 'Pokazuj wyniki, nie obowiązki' },
      { p: 'Przy każdym stanowisku wymień od dwóch do czterech osiągnięć. Używaj liczb, gdy to możliwe.' },
      { ul: ['Zwiększenie zapisów do newslettera o 40% w sześć miesięcy', 'Skrócenie wdrożenia z trzech tygodni do jednego', 'Zarządzanie budżetem 250 000 zł'] },
      { h2: 'Zadbaj o przejrzysty układ' },
      { p: 'Użyj jednego czytelnego szablonu, spójnych dat i wyraźnej czcionki. Zapisz jako PDF, chyba że ogłoszenie wymaga Worda.' },
    ],
    ctaHeading: 'Gotowy, by napisać swoje?',
    ctaBody: 'Wybierz szablon, a {brand} poprowadzi Cię przez każdą sekcję.',
  },
}

const sv: LocaleCopy = {
  hero: {
    eyebrow: 'Över 50 miljoner arbetssökande litar på oss',
    toolboxHeading: 'Allt du behöver för att få ditt nästa jobb',
    builderHeading: 'Skapa ett cv som ger dig jobbet',
    sub: 'Skapa ett professionellt cv på några minuter med mallar från experter, skrivhjälp med AI och ett matchande personligt brev.',
    cta: 'Skapa mitt cv',
    tools: [
      ['Cv-verktyg', 'Mallar godkända av rekryterare'],
      ['Personliga brev', 'Matchar varje cv'],
      ['Lediga jobb', 'Nya tjänster varje dag'],
      ['Intervjuträning', 'Öva på de svåra frågorna'],
    ],
    checks: ['Klart på 10 minuter', 'Ladda ner som PDF eller Word', 'ATS-vänliga layouter'],
  },
  features: {
    heading: 'Därför fungerar {brand}',
    intro: 'Karriärexperter och rekryterare har format varje steg, så att du kan fokusera på jobbet du vill ha.',
    items: [
      ['Professionella mallar', 'Rena layouter som klarar rekryteringssystem och imponerar på rekryterare.'],
      ['Skrivhjälp med AI', 'Förslag för varje avsnitt, anpassade efter din roll och erfarenhet.'],
      ['Ladda ner var som helst', 'Exportera till PDF eller Word och sök jobb med ett klick.'],
    ],
  },
  gallery: { heading: 'Mallar för varje karriär', intro: 'Välj en design och byt när du vill, utan att skriva om något.' },
  pricing: {
    heading: 'Enkla abonnemang, avsluta när du vill',
    intro: 'Priser för ditt land. Alla abonnemang innehåller alla mallar.',
    button: 'Välj abonnemang',
  },
  faq: {
    heading: 'Vanliga frågor',
    items: [
      ['Är {brand} gratis?', 'Du kan skapa och redigera ditt cv gratis. För att ladda ner utan vattenstämpel behöver du ett abonnemang.'],
      ['Klarar mitt cv ATS-system?', 'Ja. Varje mall har en tydlig struktur med riktig text som ATS-programvara kan läsa.'],
      ['Kan jag byta mall senare?', 'Ja. Ditt innehåll flyttas automatiskt till den nya designen.'],
    ],
  },
  cta: {
    heading: 'Ditt nästa jobb börjar med ett starkt cv',
    body: 'Gör som miljontals arbetssökande som skapat sitt cv med {brand}.',
    button: 'Kom igång',
  },
  homeMeta: {
    title: '{brand}: skapa cv online med mallar från experter',
    description: 'Skapa ett professionellt cv på några minuter med {brand}. Mallar från experter, skrivhjälp med AI och direkt nedladdning som PDF.',
  },
  article: {
    slug: 'blogg/skriva-cv',
    eyebrow: 'Karriärtips',
    title: 'Så skriver du ett cv 2026',
    description: 'Steg för steg till ett cv som rekryterare läser till slutet.',
    body: [
      { h2: 'Börja med en stark profil' },
      { p: 'Inled med tre meningar om vem du är, vad du är bra på och vad du söker. Rekryterare skummar på sekunder, så få dem att räknas.' },
      { h2: 'Visa resultat, inte arbetsuppgifter' },
      { p: 'Lista två till fyra resultat för varje roll. Använd siffror där du kan.' },
      { ul: ['Ökade nyhetsbrevsregistreringar med 40 % på sex månader', 'Kortade introduktionen från tre veckor till en', 'Ansvarade för en budget på 2,5 miljoner kronor'] },
      { h2: 'Håll layouten ren' },
      { p: 'Använd en tydlig mall, konsekventa datum och ett läsbart typsnitt. Spara som PDF om inte annonsen ber om Word.' },
    ],
    ctaHeading: 'Redo att skriva ditt?',
    ctaBody: 'Välj en mall och låt {brand} guida dig genom varje avsnitt.',
  },
}

const fi: LocaleCopy = {
  hero: {
    eyebrow: 'Yli 50 miljoonaa työnhakijaa luottaa meihin',
    toolboxHeading: 'Kaikki mitä tarvitset seuraavaan työpaikkaasi',
    builderHeading: 'Tee CV, jolla saat työpaikan',
    sub: 'Tee ammattimainen CV muutamassa minuutissa asiantuntijoiden pohjilla, tekoälyn kirjoitusavulla ja yhteensopivalla saatekirjeellä.',
    cta: 'Tee oma CV',
    tools: [
      ['CV-työkalu', 'Rekrytoijien hyväksymät pohjat'],
      ['Saatekirjeet', 'Sopivat jokaiseen CV:hen'],
      ['Työpaikat', 'Uusia paikkoja joka päivä'],
      ['Haastatteluvalmennus', 'Harjoittele vaikeita kysymyksiä'],
    ],
    checks: ['Valmis 10 minuutissa', 'Lataa PDF- tai Word-muodossa', 'ATS-yhteensopivat asettelut'],
  },
  features: {
    heading: 'Miksi {brand} toimii',
    intro: 'Ura-asiantuntijat ja rekrytoijat suunnittelivat jokaisen vaiheen, jotta voit keskittyä haluamaasi työhön.',
    items: [
      ['Ammattimaiset pohjat', 'Selkeät asettelut, jotka läpäisevät rekrytointijärjestelmät ja vakuuttavat rekrytoijat.'],
      ['Kirjoitusapu tekoälyllä', 'Ehdotuksia jokaiseen osioon roolisi ja kokemuksesi mukaan.'],
      ['Lataa missä vain', 'Vie PDF- tai Word-muotoon ja hae työtä yhdellä klikkauksella.'],
    ],
  },
  gallery: { heading: 'Pohjat jokaiselle uralle', intro: 'Valitse ulkoasu ja vaihda sitä milloin haluat ilman uudelleenkirjoittamista.' },
  pricing: {
    heading: 'Selkeät tilaukset, peru milloin tahansa',
    intro: 'Hinnat maallesi. Jokainen tilaus sisältää kaikki pohjat.',
    button: 'Valitse tilaus',
  },
  faq: {
    heading: 'Usein kysytyt kysymykset',
    items: [
      ['Onko {brand} ilmainen?', 'Voit tehdä ja muokata CV:täsi ilmaiseksi. Lataamiseen ilman vesileimaa tarvitset tilauksen.'],
      ['Läpäiseekö CV:ni ATS-järjestelmät?', 'Kyllä. Jokaisessa pohjassa on selkeä rakenne ja oikeaa tekstiä, jota ATS-ohjelmat osaavat lukea.'],
      ['Voinko vaihtaa pohjaa myöhemmin?', 'Kyllä. Sisältösi siirtyy automaattisesti uuteen ulkoasuun.'],
    ],
  },
  cta: {
    heading: 'Seuraava työpaikkasi alkaa hyvästä CV:stä',
    body: 'Liity miljooniin työnhakijoihin, jotka ovat tehneet CV:nsä {brand}-palvelussa.',
    button: 'Aloita nyt',
  },
  homeMeta: {
    title: '{brand}: tee CV verkossa asiantuntijoiden pohjilla',
    description: 'Tee ammattimainen CV muutamassa minuutissa {brand}-palvelussa. Asiantuntijoiden pohjat, tekoälyn kirjoitusapu ja PDF-lataus heti.',
  },
  article: {
    slug: 'blogi/cv-n-kirjoittaminen',
    eyebrow: 'Uravinkit',
    title: 'Näin kirjoitat CV:n vuonna 2026',
    description: 'Vaihe vaiheelta CV:hen, jonka rekrytoijat lukevat loppuun asti.',
    body: [
      { h2: 'Aloita vahvalla profiililla' },
      { p: 'Aloita kolmella lauseella: kuka olet, missä olet hyvä ja mitä haet. Rekrytoijat silmäilevät sekunneissa, joten käytä ne hyvin.' },
      { h2: 'Näytä tuloksia, älä tehtäviä' },
      { p: 'Kirjaa jokaisesta roolista kahdesta neljään saavutusta. Käytä lukuja aina kun voit.' },
      { ul: ['Kasvatin uutiskirjeen tilaajia 40 % kuudessa kuukaudessa', 'Lyhensin perehdytyksen kolmesta viikosta yhteen', 'Vastasin 250 000 euron budjetista'] },
      { h2: 'Pidä asettelu selkeänä' },
      { p: 'Käytä yhtä selkeää pohjaa, johdonmukaisia päivämääriä ja helppolukuista fonttia. Tallenna PDF-muodossa, ellei ilmoitus pyydä Wordia.' },
    ],
    ctaHeading: 'Valmis kirjoittamaan omasi?',
    ctaBody: 'Valitse pohja ja anna {brand}-palvelun opastaa sinua jokaisessa osiossa.',
  },
}

export const copy: Record<LocaleCode, LocaleCopy> = { en, 'en-GB': enGB, nl, de, fr, es, it, pl, sv, fi }
