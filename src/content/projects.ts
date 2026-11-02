import type { LocaleCode } from './locales';

type ProjectCopy = {
  selectLabel: string; role: string; residencias: string; lingohive: string;
  jl: string; vegan: string; jlAlt: string; veganAlt: string; previous: string; next: string;
};

export const projectCopy: Record<LocaleCode, ProjectCopy> = {
  es: {
    selectLabel: 'Seleccionar proyecto', role: 'Diseño y desarrollo: Ramiro Garcia',
    residencias: 'Planificación, diseño y desarrollo de un sitio institucional para reunir a Grupo Casa y sus dos residencias: Casa San Juan y Casa Boedo.',
    lingohive: 'Desarrollo web para una academia de inglés, a partir de un diseño externo. Demo histórica: academia inactiva; precios y testimonios de entonces.',
    jl: 'Diseño y desarrollo de una landing page para presentar los servicios y productos de JL Aberturas.',
    vegan: 'Diseño y desarrollo de la web del negocio, con un catálogo conectado a Google Sheets para facilitar pedidos.',
    jlAlt: 'Home de JL Aberturas en mobile: servicios, menú compacto y abertura ilustrada.',
    veganAlt: 'Home de Vegan Records en mobile: CDs, discos de vinilo y acceso al catálogo.',
    previous: 'Proyecto anterior', next: 'Proyecto siguiente'
  },
  en: {
    selectLabel: 'Select a project', role: 'Design and development: Ramiro Garcia',
    residencias: 'Planning, design and development of an institutional website bringing together Grupo Casa and its two residences: Casa San Juan and Casa Boedo.',
    lingohive: 'Web development for an English academy from an external design. Historical demo: the academy is inactive; prices and testimonials are from that time.',
    jl: 'Design and development of a landing page presenting JL Aberturas’ services and products.',
    vegan: 'Design and development of the business website, with a catalogue connected to Google Sheets to help visitors place orders.',
    jlAlt: 'JL Aberturas mobile homepage: services, compact navigation and an illustrated window.',
    veganAlt: 'Vegan Records mobile homepage: CDs, vinyl records and catalogue access.',
    previous: 'Previous project', next: 'Next project'
  },
  pt: {
    selectLabel: 'Selecionar projeto', role: 'Design e desenvolvimento: Ramiro Garcia',
    residencias: 'Planejamento, design e desenvolvimento de um site institucional para reunir o Grupo Casa e suas duas residências: Casa San Juan e Casa Boedo.',
    lingohive: 'Desenvolvimento web para uma escola de inglês a partir de um design externo. Demo histórica: escola inativa; preços e depoimentos da época.',
    jl: 'Design e desenvolvimento de uma landing page para apresentar os serviços e produtos da JL Aberturas.',
    vegan: 'Design e desenvolvimento do site do negócio, com um catálogo conectado ao Google Sheets para facilitar pedidos.',
    jlAlt: 'Home de JL Aberturas em mobile: serviços, navegação compacta e uma janela ilustrada.',
    veganAlt: 'Home de Vegan Records em mobile: CDs, discos de vinil e acesso ao catálogo.',
    previous: 'Projeto anterior', next: 'Próximo projeto'
  },
  fr: {
    selectLabel: 'Sélectionner un projet', role: 'Design et développement : Ramiro Garcia',
    residencias: 'Planification, design et développement d’un site institutionnel réunissant Grupo Casa et ses deux résidences : Casa San Juan et Casa Boedo.',
    lingohive: 'Développement web pour une école d’anglais à partir d’un design externe. Démo historique : école inactive ; tarifs et témoignages de l’époque.',
    jl: 'Design et développement d’une landing page présentant les services et produits de JL Aberturas.',
    vegan: 'Design et développement du site de l’activité, avec un catalogue connecté à Google Sheets pour faciliter les commandes.',
    jlAlt: 'Accueil de JL Aberturas sur mobile : services, navigation compacte et fenêtre illustrée.',
    veganAlt: 'Accueil de Vegan Records sur mobile : CD, disques vinyles et accès au catalogue.',
    previous: 'Projet précédent', next: 'Projet suivant'
  },
  ja: {
    selectLabel: '制作実績を選択', role: 'デザイン・開発：Ramiro Garcia',
    residencias: 'Grupo Casa と二つの施設 Casa San Juan・Casa Boedo をまとめる施設紹介サイトの企画・デザイン・開発。',
    lingohive: '外部デザインをもとに英語教室のウェブサイトを開発。当時のデモで、教室は現在活動していません。料金と体験談は当時のものです。',
    jl: 'JL Aberturas のサービスと販売商品を紹介するランディングページのデザイン・開発。',
    vegan: '事業サイトのデザイン・開発。Google Sheets に連携したカタログで注文をサポート。',
    jlAlt: 'JL Aberturas のホームページのモバイル表示。サービス、コンパクトなメニュー、窓のイラスト。',
    veganAlt: 'Vegan Records のホームページのモバイル表示。CD、レコード、カタログへのリンク。',
    previous: '前の制作実績', next: '次の制作実績'
  }
};
