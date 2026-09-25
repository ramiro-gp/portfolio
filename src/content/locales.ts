export const localeCodes = ['es', 'en', 'pt', 'fr', 'ja'] as const;
export type LocaleCode = (typeof localeCodes)[number];

export const routes: Record<LocaleCode, string> = {
  es: '/', en: '/en/', pt: '/pt/', fr: '/fr/', ja: '/ja/'
};

export const languageNames: Record<LocaleCode, string> = {
  es: 'Español', en: 'English', pt: 'Português', fr: 'Français', ja: '日本語'
};

export type Copy = {
  brandLabel: string; skip: string; menu: string; closeMenu: string; navLabel: string;
  nav: [string, string, string, string, string];
  language: string; appearance: string; light: string; dark: string; accent: string; modeLabel: string; primaryColorLabel: string;
  accentNames: [string, string, string, string, string, string, string, string, string, string];
  heroPrefix: string; heroSuffix: string; heroWords: [string, string, string, string, string, string]; fallbackWord: string;
  heroCopy: string; cta: string;
  servicesIntro: string; services: [{ title: string; body: string }, { title: string; body: string }, { title: string; body: string }];
  capabilities: [string, string, string];
  caseState: string; viewSite: string; caseContext: string; caseSolution: string; caseCapabilities: string;
  desktopCaption: string; mobileCaption: string; desktopAlt: string; mobileAlt: string;
  aboutTitle: string; professionalTitle: string; profile: string; processTitle: string; process: [string, string, string]; processNote: string; availability: string; disclosure?: string;
  contactTitle: string; guidance: string; backToTop: string; copyEmail: string; copyPhone: string; emailCopied: string; emailCopyError: string; phoneCopied: string; phoneCopyError: string;
  metaTitle: string; metaDescription: string; socialTitle: string; socialDescription: string;
};

export const copy: Record<LocaleCode, Copy> = {
  es: {
    brandLabel: 'ramita.dev, inicio', skip: 'Saltar al contenido', menu: 'Menú', closeMenu: 'Cerrar menú', navLabel: 'Navegación principal',
    nav: ['Inicio', 'Servicios', 'Proyectos', 'Ramiro Garcia', 'Contacto'],
    language: 'Idiomas', appearance: 'Aspecto', light: 'Light', dark: 'Dark', accent: 'Accent', modeLabel: 'MODO', primaryColorLabel: 'COLOR PRINCIPAL',
    accentNames: ['Verde oscuro', 'Azul', 'Rojo', 'Violeta', 'Negro', 'Naranja', 'Celeste', 'Fucsia', 'Verde lima', 'Blanco'],
    heroPrefix: 'Diseño y desarrollo de sitios web para presentar tu ', heroSuffix: '',
    heroWords: ['servicio', 'proyecto', 'marca', 'producto', 'portfolio', 'campaña'], fallbackWord: 'proyecto',
    heroCopy: 'Soy Ramiro Garcia. Trabajo con vos desde la definición hasta la publicación de tu web.', cta: 'Hablemos de tu proyecto',
    servicesIntro: 'Una web nueva o una que necesita cambiar. El punto de partida es entender qué necesitás y definir el alcance.',
    services: [
      { title: 'Sitios institucionales', body: 'Para presentar tu actividad, explicar tus servicios y reunir la información de contacto en una web clara, tanto en computadora como en celular.' },
      { title: 'Landing pages', body: 'Para un servicio, campaña o lanzamiento que necesita una página enfocada en explicar una propuesta y orientar al visitante hacia una acción principal.' },
      { title: 'Rediseños', body: 'Para una web que necesita mejorar su estructura, diseño o adaptación a celulares. Primero evalúo si conviene trabajar sobre la base actual o reconstruirla.' }
    ],
    capabilities: [
      'Según el alcance, puedo integrar adaptación a celulares, formularios y otras herramientas, SEO técnico, cuidado de la velocidad de carga y publicación.',
      'Para negocios locales, puedo trabajar en el Perfil de Empresa de Google. También puedo preparar la estructura y el contenido para buscadores y asistentes de IA, sin prometer visibilidad.',
      '¿Ya tenés un diseño? También puedo desarrollarlo, revisando primero las pantallas, los materiales y los comportamientos necesarios.'
    ],
    caseState: 'Sitio institucional · En desarrollo', viewSite: 'Ver sitio',
    caseContext: 'Una web para reunir al grupo y sus dos sedes: Casa San Juan y Casa Boedo. Ese fue el requerimiento inicial. Casa San Juan está operativa; Casa Boedo figura como próxima apertura.',
    caseSolution: 'Me encargué de la planificación, el diseño visual, la arquitectura y el desarrollo. La solución combina una entrada institucional con espacios diferenciados para cada residencia, a partir de sus identidades preexistentes.',
    caseCapabilities: 'El proyecto reúne diseño, desarrollo responsive, formularios y SEO técnico, además de la preparación para publicación. Las capturas muestran la interfaz; no representan métricas de resultados.',
    desktopCaption: 'Página de Casa San Juan en desktop: presentación de la sede y foto de su espacio exterior.',
    mobileCaption: 'Home en mobile, sección «Nuestras residencias»: Casa San Juan y navegación compacta.',
    desktopAlt: 'Captura de la página de Casa San Juan de Residencias Grupo Casa en desktop: título, texto introductorio y fotografía del espacio exterior.',
    mobileAlt: 'Captura de la Home de Residencias Grupo Casa en mobile: sección «Nuestras residencias», foto exterior de Casa San Juan y menú compacto.',
    aboutTitle: 'Ramiro Garcia', professionalTitle: 'Full Stack Developer',
    profile: 'Trabajo de forma independiente y directamente con cada cliente. Mi especialidad es frontend; también participo en UX/UI y decisiones de producto, y puedo trabajar full stack cuando el proyecto lo requiere.',
    processTitle: 'Cómo trabajo',
    process: [
      'Entender qué necesitás y en qué contexto. Definir juntos la estructura y el alcance.',
      'Diseñar la interfaz y desarrollar una web funcional a partir de ella.',
      'Revisar responsive, accesibilidad y performance. Publicar y comprobar la entrega en su entorno público.'
    ],
    processNote: 'Si el diseño es externo, reviso el material y los faltantes acordados.', availability: 'Disponible para proyectos freelance.',
    contactTitle: 'Contame qué web necesitás.', backToTop: 'IR ARRIBA',
    guidance: 'Podés contarme qué necesitás, para qué, si ya tenés una web y compartir referencias o un plazo deseado. No hace falta tener todo definido para escribirme.',
    copyEmail: 'Copiar email', copyPhone: 'Copiar teléfono', emailCopied: 'Email copiado', emailCopyError: 'No se pudo copiar el email; podés seleccionarlo manualmente', phoneCopied: 'Teléfono copiado', phoneCopyError: 'No se pudo copiar el teléfono; podés seleccionarlo manualmente',
    metaTitle: 'ramita | Diseño y desarrollo web', metaDescription: 'Diseño y desarrollo de sitios web nuevos y rediseños. Trabajo directo con Ramiro Garcia desde la definición hasta la publicación.', socialTitle: 'Ramiro Garcia — Diseño y desarrollo de sitios web', socialDescription: 'Sitios institucionales, landing pages y rediseños, con trato directo.'
  },
  en: {
    brandLabel: 'ramita.dev, home', skip: 'Skip to content', menu: 'Menu', closeMenu: 'Close menu', navLabel: 'Main navigation',
    nav: ['Home', 'Services', 'Projects', 'Ramiro Garcia', 'Contact'],
    language: 'Languages', appearance: 'Appearance', light: 'Light', dark: 'Dark', accent: 'Accent', modeLabel: 'MODE', primaryColorLabel: 'PRIMARY COLOR',
    accentNames: ['Dark green', 'Blue', 'Red', 'Violet', 'Black', 'Orange', 'Light blue', 'Fuchsia', 'Lime green', 'White'],
    heroPrefix: 'Website design and development for your ', heroSuffix: '',
    heroWords: ['service', 'project', 'brand', 'product', 'portfolio', 'campaign'], fallbackWord: 'project',
    heroCopy: 'I’m Ramiro Garcia. I work with you from defining your website through to its launch.', cta: 'Let’s talk about your project',
    servicesIntro: 'A new website, or an existing one that needs a rethink. The starting point is to understand what you need and define the scope.',
    services: [
      { title: 'Institutional websites', body: 'To present your activity, explain your services and bring your contact details together in a clear website, on both desktop and mobile.' },
      { title: 'Landing pages', body: 'For a service, campaign or launch that needs a focused page to explain a proposal and guide visitors toward one main action.' },
      { title: 'Redesigns', body: 'For a website that needs a better structure, design or mobile experience. I first assess whether it makes sense to build on the current site or rebuild it.' }
    ],
    capabilities: [
      'Depending on the scope, I can include responsive design, forms and other tools, technical SEO, performance and publication.',
      'For local businesses, I can work on their Google Business Profile. I can also prepare the structure and content for search engines and AI assistants, without promising visibility.',
      'Already have a design? I can develop it too, after reviewing the screens, materials and required behaviors.'
    ],
    caseState: 'Institutional website · In development', viewSite: 'View website',
    caseContext: 'A website to bring the group and its two residences, Casa San Juan and Casa Boedo, together. That was the initial requirement. Casa San Juan is operating; Casa Boedo is presented as opening soon.',
    caseSolution: 'I was responsible for planning, visual design, architecture and development. The solution combines an institutional entry point with distinct spaces for each residence, based on their existing identities.',
    caseCapabilities: 'The project includes design, responsive development, forms and technical SEO, as well as preparation for publication. The screenshots show the interface; they do not represent performance metrics.',
    desktopCaption: 'Desktop view of the Casa San Juan page: residence introduction and exterior photograph.', mobileCaption: 'Mobile view of the home page’s “Nuestras residencias” section: Casa San Juan and compact navigation.',
    desktopAlt: 'Screenshot of the Casa San Juan page on the Residencias Grupo Casa website on desktop: title, introductory text and photograph of its outdoor space.', mobileAlt: 'Screenshot of the Residencias Grupo Casa home page on mobile: “Nuestras residencias” section, exterior photograph of Casa San Juan and compact menu.',
    aboutTitle: 'Ramiro Garcia', professionalTitle: 'Full Stack Developer',
    profile: 'I work independently and directly with each client. My specialty is frontend; I also take part in UX/UI and product decisions, and I can work full stack when the project calls for it.',
    processTitle: 'How I work', process: [
      'Understand what you need and in what context. Define the structure and scope together.',
      'Design the interface and develop a functional website from it.',
      'Review responsiveness, accessibility and performance. Launch the site and verify it in its live environment.'
    ],
    processNote: 'If the design comes from someone else, I review the material and the agreed missing pieces.', availability: 'Available for freelance projects.',
    disclosure: 'I speak Spanish. For projects in other languages, I use AI and translation tools alongside each project’s context to communicate and work accurately.',
    contactTitle: 'Tell me what kind of website you need.', backToTop: 'BACK TO TOP', guidance: 'You can tell me what you need, what it’s for, whether you already have a website, and share references or a desired timeframe. You don’t need to have everything defined before writing to me.',
    copyEmail: 'Copy email', copyPhone: 'Copy phone number', emailCopied: 'Email copied', emailCopyError: 'Could not copy email; you can select it manually.', phoneCopied: 'Phone number copied', phoneCopyError: 'Could not copy the phone number; you can select it manually.',
    metaTitle: 'ramita | Web design & development', metaDescription: 'Website design and development for new sites and redesigns. Work directly with Ramiro Garcia, from definition through publication.', socialTitle: 'Ramiro Garcia — Website design and development', socialDescription: 'Institutional websites, landing pages and redesigns, with a direct point of contact.'
  },
  pt: {
    brandLabel: 'ramita.dev, início', skip: 'Ir para o conteúdo', menu: 'Menu', closeMenu: 'Fechar menu', navLabel: 'Navegação principal',
    nav: ['Início', 'Serviços', 'Projetos', 'Ramiro Garcia', 'Contato'],
    language: 'Idiomas', appearance: 'Aparência', light: 'Claro', dark: 'Escuro', accent: 'Cor de destaque', modeLabel: 'MODO', primaryColorLabel: 'COR PRINCIPAL',
    accentNames: ['Verde escuro', 'Azul', 'Vermelho', 'Violeta', 'Preto', 'Laranja', 'Azul-claro', 'Fúcsia', 'Verde-limão', 'Branco'],
    heroPrefix: 'Design e desenvolvimento de sites para apresentar ', heroSuffix: '',
    heroWords: ['seu serviço', 'seu projeto', 'sua marca', 'seu produto', 'seu portfólio', 'sua campanha'], fallbackWord: 'seu projeto',
    heroCopy: 'Sou Ramiro Garcia. Trabalho com você desde a definição até a publicação do seu site.', cta: 'Vamos conversar sobre seu projeto',
    servicesIntro: 'Um site novo ou um que precisa mudar. O ponto de partida é entender o que você precisa e definir o escopo.',
    services: [
      { title: 'Sites institucionais', body: 'Para apresentar sua atividade, explicar seus serviços e reunir as informações de contato em um site claro, tanto no computador quanto no celular.' },
      { title: 'Landing pages', body: 'Para um serviço, campanha ou lançamento que precisa de uma página focada em explicar uma proposta e orientar o visitante para uma ação principal.' },
      { title: 'Redesigns', body: 'Para um site que precisa melhorar a estrutura, o design ou a responsividade. Primeiro avalio se vale trabalhar sobre a base atual ou reconstruí-la.' }
    ],
    capabilities: [
      'Conforme o escopo, posso incluir responsividade, formulários e outras ferramentas, SEO técnico, performance e publicação.',
      'Para negócios locais, posso trabalhar no Perfil da Empresa no Google. Também posso preparar a estrutura e o conteúdo para buscadores e assistentes de IA, sem prometer visibilidade.',
      'Já tem um design? Também posso desenvolvê-lo, após revisar as telas, os materiais e os comportamentos necessários.'
    ],
    caseState: 'Site institucional · Em desenvolvimento', viewSite: 'Ver site',
    caseContext: 'Um site para reunir o grupo e suas duas residências, Casa San Juan e Casa Boedo. Esse foi o pedido inicial. Casa San Juan está em funcionamento; Casa Boedo é apresentada como futura inauguração.',
    caseSolution: 'Fiquei responsável pelo planejamento, design visual, arquitetura e desenvolvimento. A solução combina uma entrada institucional com espaços distintos para cada residência, a partir das identidades preexistentes de cada uma.',
    caseCapabilities: 'O projeto reúne design, desenvolvimento responsivo, formulários e SEO técnico, além da preparação para publicação. As capturas mostram a interface; não representam métricas de resultados.',
    desktopCaption: 'Página da Casa San Juan no computador: apresentação da residência e foto da área externa.', mobileCaption: 'Página inicial no celular, seção “Nuestras residencias”: Casa San Juan e navegação compacta.',
    desktopAlt: 'Captura da página da Casa San Juan no site de Residencias Grupo Casa no computador: título, texto de apresentação e foto da área externa.', mobileAlt: 'Captura da página inicial de Residencias Grupo Casa no celular: seção “Nuestras residencias”, foto da área externa da Casa San Juan e menu compacto.',
    aboutTitle: 'Ramiro Garcia', professionalTitle: 'Full Stack Developer',
    profile: 'Trabalho de forma independente e diretamente com cada cliente. Minha especialidade é frontend; também participo de UX/UI e decisões de produto e posso trabalhar full stack quando o projeto exige.',
    processTitle: 'Como trabalho', process: [
      'Entender o que você precisa e em que contexto. Definir juntos a estrutura e o escopo.',
      'Desenhar a interface e desenvolver um site funcional a partir dela.',
      'Revisar a responsividade, a acessibilidade e a performance. Publicar e verificar o site no ambiente online.'
    ],
    processNote: 'Se o design vier de outra pessoa, reviso o material e os pontos pendentes acordados.', availability: 'Disponível para projetos freelance.',
    disclosure: 'Eu falo espanhol. Em projetos em outros idiomas, uso ferramentas de IA e tradução, junto com o contexto de cada projeto, para me comunicar e trabalhar com precisão.',
    contactTitle: 'Conte-me de que site você precisa.', backToTop: 'VOLTAR AO TOPO', guidance: 'Você pode contar o que precisa, para quê, se já tem um site e compartilhar referências ou um prazo desejado. Não é preciso ter tudo definido para me escrever.',
    copyEmail: 'Copiar email', copyPhone: 'Copiar telefone', emailCopied: 'Email copiado', emailCopyError: 'Não foi possível copiar o email; você pode selecioná-lo manualmente.', phoneCopied: 'Telefone copiado', phoneCopyError: 'Não foi possível copiar o telefone; você pode selecioná-lo manualmente.',
    metaTitle: 'ramita | Design e desenvolvimento web', metaDescription: 'Design e desenvolvimento de sites novos e redesigns. Trabalho direto com Ramiro Garcia, da definição à publicação.', socialTitle: 'Ramiro Garcia — Design e desenvolvimento de sites', socialDescription: 'Sites institucionais, landing pages e redesigns, com contato direto.'
  },
  fr: {
    brandLabel: 'ramita.dev, accueil', skip: 'Aller au contenu', menu: 'Menu', closeMenu: 'Fermer le menu', navLabel: 'Navigation principale',
    nav: ['Accueil', 'Services', 'Projets', 'Ramiro Garcia', 'Contact'],
    language: 'Langues', appearance: 'Apparence', light: 'Clair', dark: 'Sombre', accent: 'Couleur d’accent', modeLabel: 'MODE', primaryColorLabel: 'COULEUR PRINCIPALE',
    accentNames: ['Vert foncé', 'Bleu', 'Rouge', 'Violet', 'Noir', 'Orange', 'Bleu clair', 'Fuchsia', 'Vert citron', 'Blanc'],
    heroPrefix: 'Conception et développement de sites web pour présenter votre ', heroSuffix: '',
    heroWords: ['service', 'projet', 'marque', 'produit', 'portfolio', 'campagne'], fallbackWord: 'projet',
    heroCopy: 'Je suis Ramiro Garcia. Je travaille avec vous de la définition de votre site jusqu’à sa mise en ligne.', cta: 'Parlons de votre projet',
    servicesIntro: 'Un nouveau site, ou un site qui doit évoluer. La première étape consiste à comprendre vos besoins et à définir le périmètre.',
    services: [
      { title: 'Sites institutionnels', body: 'Pour présenter votre activité, expliquer vos services et réunir vos coordonnées sur un site clair, sur ordinateur comme sur mobile.' },
      { title: 'Landing pages', body: 'Pour un service, une campagne ou un lancement qui demande une page centrée sur la présentation d’une offre et une action principale pour le visiteur.' },
      { title: 'Refontes', body: 'Pour un site dont la structure, le design ou l’affichage sur mobile doit être amélioré. J’évalue d’abord s’il vaut mieux partir de l’existant ou le reconstruire.' }
    ],
    capabilities: [
      'Selon le périmètre, je peux inclure l’adaptation aux mobiles, des formulaires et d’autres outils, le référencement technique, l’attention portée à la vitesse de chargement et la mise en ligne.',
      'Pour les entreprises locales, je peux travailler sur leur fiche d’établissement Google. Je peux aussi préparer la structure et le contenu pour les moteurs de recherche et les assistants IA, sans promettre de visibilité.',
      'Vous avez déjà une maquette ou un design ? Je peux aussi le développer, après avoir examiné les écrans, les éléments fournis et les comportements nécessaires.'
    ],
    caseState: 'Site institutionnel · En développement', viewSite: 'Voir le site',
    caseContext: 'Un site réunissant le groupe et ses deux résidences, Casa San Juan et Casa Boedo. C’était la demande initiale. Casa San Juan est en activité ; Casa Boedo est présentée comme ouvrant prochainement.',
    caseSolution: 'Je me suis chargé de la planification, du design visuel, de l’architecture et du développement. La solution associe une entrée institutionnelle à des espaces distincts pour chaque résidence, à partir de leurs identités existantes.',
    caseCapabilities: 'Le projet comprend le design, le développement responsive, les formulaires et le référencement technique, ainsi que la préparation à la mise en ligne. Les captures montrent l’interface ; elles ne représentent pas des indicateurs de résultats.',
    desktopCaption: 'Page Casa San Juan sur ordinateur : présentation de la résidence et photo de son espace extérieur.', mobileCaption: 'Page d’accueil sur mobile, rubrique « Nuestras residencias » : Casa San Juan et navigation compacte.',
    desktopAlt: 'Capture de la page Casa San Juan du site Residencias Grupo Casa sur ordinateur : titre, texte de présentation et photo de l’espace extérieur.', mobileAlt: 'Capture de la page d’accueil de Residencias Grupo Casa sur mobile : rubrique « Nuestras residencias », photo extérieure de Casa San Juan et menu compact.',
    aboutTitle: 'Ramiro Garcia', professionalTitle: 'Full Stack Developer',
    profile: 'Je travaille de façon indépendante et directement avec chaque client. Ma spécialité est le frontend ; je participe aussi aux décisions UX/UI et produit, et je peux travailler full stack lorsque le projet le demande.',
    processTitle: 'Ma façon de travailler', process: [
      'Comprendre vos besoins et leur contexte. Définir ensemble la structure et le périmètre.',
      'Concevoir l’interface et développer un site fonctionnel à partir de celle-ci.',
      'Vérifier l’adaptation aux écrans, l’accessibilité et les performances. Mettre le site en ligne et le vérifier dans son environnement public.'
    ],
    processNote: 'Si le design vient d’un tiers, j’examine les éléments fournis et les points manquants convenus.', availability: 'Disponible pour des projets freelance.',
    disclosure: 'Je parle espagnol. Pour les projets dans d’autres langues, j’utilise des outils d’IA et de traduction ainsi que le contexte propre à chaque projet pour communiquer et travailler avec précision.',
    contactTitle: 'Parlez-moi du site dont vous avez besoin.', backToTop: 'RETOUR EN HAUT', guidance: 'Vous pouvez m’expliquer ce dont vous avez besoin et dans quel but, me dire si vous avez déjà un site et partager des références ou un délai souhaité. Vous n’avez pas besoin d’avoir tout défini pour m’écrire.',
    copyEmail: 'Copier l’adresse email', copyPhone: 'Copier le numéro de téléphone', emailCopied: 'Adresse email copiée', emailCopyError: 'Impossible de copier l’adresse email ; vous pouvez la sélectionner manuellement.', phoneCopied: 'Numéro de téléphone copié', phoneCopyError: 'Impossible de copier le numéro ; vous pouvez le sélectionner manuellement.',
    metaTitle: 'ramita | Design et développement web', metaDescription: 'Conception et développement de nouveaux sites web et refontes. Un travail direct avec Ramiro Garcia, de la définition à la mise en ligne.', socialTitle: 'Ramiro Garcia — Conception et développement de sites web', socialDescription: 'Sites institutionnels, landing pages et refontes, avec un interlocuteur direct.'
  },
  ja: {
    brandLabel: 'ramita.dev、トップへ', skip: '本文へ移動', menu: 'メニュー', closeMenu: 'メニューを閉じる', navLabel: 'メインナビゲーション',
    nav: ['トップ', 'サービス', '制作実績', 'Ramiro Garcia', 'お問い合わせ'],
    language: '言語', appearance: '表示設定', light: 'ライト', dark: 'ダーク', accent: 'アクセントカラー', modeLabel: '表示モード', primaryColorLabel: 'メインカラー',
    accentNames: ['深緑', '青', '赤', '紫', '黒', 'オレンジ', '水色', 'フクシア', 'ライムグリーン', '白'],
    heroPrefix: '', heroSuffix: 'を紹介するウェブサイトのデザイン・開発',
    heroWords: ['サービス', 'プロジェクト', 'ブランド', '製品', 'ポートフォリオ', 'キャンペーン'], fallbackWord: 'プロジェクト',
    heroCopy: 'Ramiro Garcia です。ウェブサイトの構想を定めるところから公開まで、一緒に取り組みます。', cta: 'プロジェクトについて相談する',
    servicesIntro: '新しくウェブサイトを作る場合も、既存サイトを変える場合も。まず必要なことを理解し、対応範囲を決めます。',
    services: [
      { title: '企業・団体サイト', body: '活動やサービスを紹介し、連絡先を分かりやすくまとめるウェブサイトを制作します。パソコンでもスマートフォンでも使いやすくします。' },
      { title: 'ランディングページ', body: 'サービス、キャンペーン、新しい取り組みについて、内容を明確に伝え、訪問者を一つの主な行動へ導くページです。' },
      { title: 'リニューアル', body: '構成、デザイン、スマートフォンでの表示を改善したいサイト向けです。既存の基盤を生かすか、作り直すかを最初に検討します。' }
    ],
    capabilities: [
      'スマートフォン対応、フォームやその他のツール、技術的な SEO、読み込み速度への配慮、公開作業を、合意した範囲に応じて組み込めます。',
      '地域の事業者向けには Google ビジネス プロフィールにも対応できます。また、検索エンジンや AI アシスタントが扱いやすいよう、構造とコンテンツを整えることもできます。表示や露出の成果は保証しません。',
      'すでにデザインがありますか。画面、素材、必要な動作を先に確認したうえで、その実装にも対応できます。'
    ],
    caseState: '施設紹介サイト · 開発中', viewSite: 'サイトを見る',
    caseContext: 'グループと二つの施設、Casa San Juan と Casa Boedo を一つのサイトにまとめることが、当初の依頼でした。Casa San Juan は運営中で、Casa Boedo は開設予定として紹介されています。',
    caseSolution: '企画、ビジュアルデザイン、情報設計、開発を担当しました。既存の各施設のアイデンティティを踏まえ、グループ全体の入口と施設ごとに分かれた領域を組み合わせました。',
    caseCapabilities: 'デザイン、レスポンシブ開発、フォーム、技術的な SEO、公開準備に取り組んだプロジェクトです。スクリーンショットは画面を示すもので、成果指標ではありません。',
    desktopCaption: 'Casa San Juan のページのデスクトップ表示。施設の紹介と屋外スペースの写真。', mobileCaption: 'ホームページのモバイル表示。「Nuestras residencias」セクションに Casa San Juan とコンパクトなメニューが見えます。',
    desktopAlt: 'Residencias Grupo Casa の Casa San Juan ページのスクリーンショット。見出し、紹介文、屋外スペースの写真が写っています。', mobileAlt: 'Residencias Grupo Casa のホームページをモバイルで撮影した画面。「Nuestras residencias」セクション、Casa San Juan の外観写真、コンパクトなメニューが見えます。',
    aboutTitle: 'Ramiro Garcia', professionalTitle: 'Full Stack Developer',
    profile: '個人で仕事を受け、各クライアントと直接やり取りします。専門はフロントエンドです。UX/UI やプロダクトに関する判断にも関わり、必要に応じてフルスタックの開発も行います。',
    processTitle: '仕事の進め方', process: [
      '必要なことと、その背景を理解します。構成と対応範囲を一緒に定めます。',
      '画面をデザインし、それをもとにウェブサイトを開発します。',
      '画面サイズへの対応、アクセシビリティ、パフォーマンスを確認します。合意した成果物を公開し、本番環境で動作を確認します。'
    ],
    processNote: 'デザインが外部で作られた場合は、提供された素材と、合意した不足点を確認します。', availability: 'フリーランス案件を受け付けています。',
    disclosure: '会話はスペイン語を基本としています。他の言語のプロジェクトでは、AI や翻訳ツールを使い、各プロジェクトの背景も踏まえながら、正確なコミュニケーションと作業を心がけています。',
    contactTitle: '必要なウェブサイトについて教えてください。', backToTop: 'ページ上部へ', guidance: '何が必要か、何のために使うか、現在サイトがあるかを教えてください。参考資料や希望時期があれば共有できます。すべてが決まっていなくても、気軽にご連絡ください。',
    copyEmail: 'メールアドレスをコピー', copyPhone: '電話番号をコピー', emailCopied: 'メールアドレスをコピーしました', emailCopyError: 'メールアドレスをコピーできませんでした。手動で選択できます。', phoneCopied: '電話番号をコピーしました', phoneCopyError: '電話番号をコピーできませんでした。手動で選択できます。',
    metaTitle: 'ramita | Webデザイン・開発', metaDescription: '新規サイトとリニューアルのデザイン・開発。Ramiro Garcia が構想の整理から公開まで直接対応します。', socialTitle: 'Ramiro Garcia — ウェブサイトのデザインと開発', socialDescription: '企業・団体サイト、ランディングページ、リニューアルに直接対応します。'
  }
};
