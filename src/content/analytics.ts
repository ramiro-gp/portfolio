import type { LocaleCode } from './locales';

// Public stream ID only. No tag, consent notice or requests without a real ID.
const measurementId = import.meta.env.PUBLIC_GA_MEASUREMENT_ID || '';
export const analyticsId = /^G-[A-Z0-9]+$/.test(measurementId) ? measurementId : '';
export const privacyCopy: Record<LocaleCode, { text: string; accept: string; reject: string; privacy: string; preferences: string }> = {
  es: { text: 'Uso cookies de Google Analytics para estadísticas. Podés aceptarlas o rechazarlas.', accept: 'Aceptar', reject: 'Rechazar', privacy: 'Privacidad', preferences: 'Cookies' },
  en: { text: 'I use Google Analytics cookies for statistics. You can accept or reject them.', accept: 'Accept', reject: 'Reject', privacy: 'Privacy (Spanish)', preferences: 'Cookies' },
  pt: { text: 'Uso cookies do Google Analytics para estatísticas. Você pode aceitar ou rejeitar.', accept: 'Aceitar', reject: 'Rejeitar', privacy: 'Privacidade (espanhol)', preferences: 'Cookies' },
  fr: { text: 'J’utilise les cookies Google Analytics pour les statistiques. Vous pouvez accepter ou refuser.', accept: 'Accepter', reject: 'Refuser', privacy: 'Confidentialité (espagnol)', preferences: 'Cookies' },
  ja: { text: '統計のために Google Analytics の Cookie を使用します。同意または拒否を選択できます。', accept: '同意する', reject: '拒否する', privacy: 'プライバシー（スペイン語）', preferences: 'Cookie' }
};
