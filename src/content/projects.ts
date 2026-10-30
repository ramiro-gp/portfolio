import type { LocaleCode } from './locales';

type ProjectCopy = {
  selectLabel: string; role: string; residencias: string; lingohive: string;
  jl: string; vegan: string; jlAlt: string; veganAlt: string; previous: string; next: string;
};

export const projectCopy: Record<LocaleCode, ProjectCopy> = {
  es: {
    selectLabel: 'Seleccionar proyecto', role: 'Diseño y desarrollo: Ramiro Garcia',
    residencias: 'Sitio institucional para Grupo Casa y sus dos residencias: Casa San Juan y Casa Boedo.',
    lingohive: 'Academia de inglés inactiva; los precios y testimonios son históricos.',
    jl: 'Landing page para presentar servicios y la venta de productos.',
    vegan: 'Presentación del negocio y catálogo conectado a Google Sheets para facilitar pedidos.',
    jlAlt: 'Home de JL Aberturas en mobile: servicios, menú compacto y abertura ilustrada.',
    veganAlt: 'Home de Vegan Records en mobile: CDs, discos de vinilo y acceso al catálogo.',
    previous: 'Proyecto anterior', next: 'Proyecto siguiente'
  },
  en: {
    selectLabel: 'Select a project', role: 'Design and development: Ramiro Garcia',
    residencias: 'Institutional website for Grupo Casa and its two residences: Casa San Juan and Casa Boedo.',
    lingohive: 'English academy no longer active; prices and testimonials are historical.',
    jl: 'Landing page presenting services and products for sale.',
    vegan: 'Business website with a catalogue connected to Google Sheets to help visitors place orders.',
    jlAlt: 'JL Aberturas mobile homepage: services, compact navigation and an illustrated window.',
    veganAlt: 'Vegan Records mobile homepage: CDs, vinyl records and catalogue access.',
    previous: 'Previous project', next: 'Next project'
  },
  pt: {
    selectLabel: 'Selecionar projeto', role: 'Design e desenvolvimento: Ramiro Garcia',
    residencias: 'Site institucional para o Grupo Casa e suas duas residências: Casa San Juan e Casa Boedo.',
    lingohive: 'Escola de inglês inativa; os preços e depoimentos são históricos.',
    jl: 'Landing page para apresentar serviços e a venda de produtos.',
    vegan: 'Apresentação do negócio e catálogo conectado ao Google Sheets para facilitar pedidos.',
    jlAlt: 'Home de JL Aberturas em mobile: serviços, navegação compacta e uma janela ilustrada.',
    veganAlt: 'Home de Vegan Records em mobile: CDs, discos de vinil e acesso ao catálogo.',
    previous: 'Projeto anterior', next: 'Próximo projeto'
  },
  fr: {
    selectLabel: 'Sélectionner un projet', role: 'Design et développement : Ramiro Garcia',
    residencias: 'Site institutionnel pour Grupo Casa et ses deux résidences : Casa San Juan et Casa Boedo.',
    lingohive: 'École d’anglais qui n’est plus en activité ; tarifs et témoignages historiques.',
    jl: 'Landing page présentant les services et la vente de produits.',
    vegan: 'Présentation de l’activité et catalogue connecté à Google Sheets pour faciliter les commandes.',
    jlAlt: 'Accueil de JL Aberturas sur mobile : services, navigation compacte et fenêtre illustrée.',
    veganAlt: 'Accueil de Vegan Records sur mobile : CD, disques vinyles et accès au catalogue.',
    previous: 'Projet précédent', next: 'Projet suivant'
  },
  ja: {
    selectLabel: '制作実績を選択', role: 'デザイン・開発：Ramiro Garcia',
    residencias: 'Grupo Casa と二つの施設 Casa San Juan・Casa Boedo の施設紹介サイト。',
    lingohive: '現在は活動していない英語教室。料金と体験談は当時のものです。',
    jl: 'サービスと販売商品を紹介するランディングページ。',
    vegan: '事業紹介と Google Sheets に連携したカタログで、注文をサポートするサイト。',
    jlAlt: 'JL Aberturas のホームページのモバイル表示。サービス、コンパクトなメニュー、窓のイラスト。',
    veganAlt: 'Vegan Records のホームページのモバイル表示。CD、レコード、カタログへのリンク。',
    previous: '前の制作実績', next: '次の制作実績'
  }
};
