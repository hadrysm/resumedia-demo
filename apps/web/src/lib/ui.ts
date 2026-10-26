import type { LocaleCode } from '@resumedia-demo/shared/locales'

/** Fixed interface strings. Page content comes from the CMS; these belong with the code, like product UI strings. */
export type UiStrings = {
  start: string
  language: string
  country: string
  plans: { starter: string; monthly: string; yearly: string }
  periods: { starter: string; monthly: string; yearly: string }
  bestValue: string
  features: { starter: string[]; monthly: string[]; yearly: string[] }
  notFoundTitle: string
  notFoundBody: string
  backHome: string
  footer: string
  draftPreview: string
}

const en: UiStrings = {
  start: 'Create resume',
  language: 'Language',
  country: 'Country',
  plans: { starter: 'Starter', monthly: 'Pro', yearly: 'Pro Annual' },
  periods: { starter: '14-day access', monthly: 'per month', yearly: 'per year' },
  bestValue: 'Best value',
  features: {
    starter: ['All templates', 'PDF download', 'One resume'],
    monthly: ['Unlimited resumes', 'Cover letters', 'AI writing help'],
    yearly: ['Everything in Pro', 'Priority support', 'Lowest monthly cost'],
  },
  notFoundTitle: 'Page not found',
  notFoundBody: 'This page does not exist or has moved.',
  backHome: 'Back to home',
  footer: 'Content managed in Payload CMS.',
  draftPreview: 'Draft preview',
}

export const ui: Record<LocaleCode, UiStrings> = {
  en,
  'en-GB': {
    ...en,
    start: 'Create CV',
    features: {
      ...en.features,
      starter: ['All templates', 'PDF download', 'One CV'],
      monthly: ['Unlimited CVs', 'Cover letters', 'AI writing help'],
    },
  },
  nl: {
    start: 'Cv maken',
    language: 'Taal',
    country: 'Land',
    plans: { starter: 'Starter', monthly: 'Pro', yearly: 'Pro jaar' },
    periods: { starter: '14 dagen toegang', monthly: 'per maand', yearly: 'per jaar' },
    bestValue: 'Voordeligst',
    features: {
      starter: ['Alle sjablonen', 'Download als pdf', 'Eén cv'],
      monthly: ['Onbeperkt cv’s', 'Sollicitatiebrieven', 'Schrijfhulp met AI'],
      yearly: ['Alles uit Pro', 'Voorrang bij support', 'Laagste prijs per maand'],
    },
    notFoundTitle: 'Pagina niet gevonden',
    notFoundBody: 'Deze pagina bestaat niet of is verplaatst.',
    backHome: 'Naar de homepage',
    footer: 'Inhoud beheerd in Payload CMS.',
    draftPreview: 'Conceptweergave',
  },
  de: {
    start: 'Lebenslauf erstellen',
    language: 'Sprache',
    country: 'Land',
    plans: { starter: 'Starter', monthly: 'Pro', yearly: 'Pro Jahr' },
    periods: { starter: '14 Tage Zugang', monthly: 'pro Monat', yearly: 'pro Jahr' },
    bestValue: 'Bester Preis',
    features: {
      starter: ['Alle Vorlagen', 'PDF-Download', 'Ein Lebenslauf'],
      monthly: ['Unbegrenzte Lebensläufe', 'Anschreiben', 'KI-Schreibhilfe'],
      yearly: ['Alles aus Pro', 'Bevorzugter Support', 'Günstigster Monatspreis'],
    },
    notFoundTitle: 'Seite nicht gefunden',
    notFoundBody: 'Diese Seite existiert nicht oder wurde verschoben.',
    backHome: 'Zur Startseite',
    footer: 'Inhalte verwaltet in Payload CMS.',
    draftPreview: 'Entwurfsvorschau',
  },
  fr: {
    start: 'Créer un CV',
    language: 'Langue',
    country: 'Pays',
    plans: { starter: 'Essentiel', monthly: 'Pro', yearly: 'Pro annuel' },
    periods: { starter: 'accès 14 jours', monthly: 'par mois', yearly: 'par an' },
    bestValue: 'Meilleur prix',
    features: {
      starter: ['Tous les modèles', 'Téléchargement PDF', 'Un CV'],
      monthly: ['CV illimités', 'Lettres de motivation', 'Aide à la rédaction par IA'],
      yearly: ['Tout le plan Pro', 'Support prioritaire', 'Prix mensuel le plus bas'],
    },
    notFoundTitle: 'Page introuvable',
    notFoundBody: 'Cette page n’existe pas ou a été déplacée.',
    backHome: 'Retour à l’accueil',
    footer: 'Contenu géré dans Payload CMS.',
    draftPreview: 'Aperçu du brouillon',
  },
  es: {
    start: 'Crear currículum',
    language: 'Idioma',
    country: 'País',
    plans: { starter: 'Inicial', monthly: 'Pro', yearly: 'Pro anual' },
    periods: { starter: 'acceso 14 días', monthly: 'al mes', yearly: 'al año' },
    bestValue: 'Mejor precio',
    features: {
      starter: ['Todas las plantillas', 'Descarga en PDF', 'Un currículum'],
      monthly: ['Currículums ilimitados', 'Cartas de presentación', 'Ayuda de redacción con IA'],
      yearly: ['Todo lo de Pro', 'Soporte prioritario', 'Menor precio mensual'],
    },
    notFoundTitle: 'Página no encontrada',
    notFoundBody: 'Esta página no existe o se ha movido.',
    backHome: 'Volver al inicio',
    footer: 'Contenido gestionado en Payload CMS.',
    draftPreview: 'Vista previa del borrador',
  },
  it: {
    start: 'Crea curriculum',
    language: 'Lingua',
    country: 'Paese',
    plans: { starter: 'Base', monthly: 'Pro', yearly: 'Pro annuale' },
    periods: { starter: 'accesso 14 giorni', monthly: 'al mese', yearly: 'all’anno' },
    bestValue: 'Più conveniente',
    features: {
      starter: ['Tutti i modelli', 'Download in PDF', 'Un curriculum'],
      monthly: ['Curriculum illimitati', 'Lettere di presentazione', 'Aiuto alla scrittura con IA'],
      yearly: ['Tutto di Pro', 'Assistenza prioritaria', 'Prezzo mensile più basso'],
    },
    notFoundTitle: 'Pagina non trovata',
    notFoundBody: 'Questa pagina non esiste o è stata spostata.',
    backHome: 'Torna alla home',
    footer: 'Contenuti gestiti in Payload CMS.',
    draftPreview: 'Anteprima bozza',
  },
  pl: {
    start: 'Stwórz CV',
    language: 'Język',
    country: 'Kraj',
    plans: { starter: 'Start', monthly: 'Pro', yearly: 'Pro roczny' },
    periods: { starter: 'dostęp na 14 dni', monthly: 'miesięcznie', yearly: 'rocznie' },
    bestValue: 'Najlepsza cena',
    features: {
      starter: ['Wszystkie szablony', 'Pobieranie PDF', 'Jedno CV'],
      monthly: ['Nielimitowane CV', 'Listy motywacyjne', 'Pomoc AI w pisaniu'],
      yearly: ['Wszystko z Pro', 'Priorytetowe wsparcie', 'Najniższa cena miesięczna'],
    },
    notFoundTitle: 'Nie znaleziono strony',
    notFoundBody: 'Ta strona nie istnieje lub została przeniesiona.',
    backHome: 'Wróć na stronę główną',
    footer: 'Treści zarządzane w Payload CMS.',
    draftPreview: 'Podgląd wersji roboczej',
  },
  sv: {
    start: 'Skapa cv',
    language: 'Språk',
    country: 'Land',
    plans: { starter: 'Start', monthly: 'Pro', yearly: 'Pro år' },
    periods: { starter: '14 dagars åtkomst', monthly: 'per månad', yearly: 'per år' },
    bestValue: 'Bäst värde',
    features: {
      starter: ['Alla mallar', 'Ladda ner som pdf', 'Ett cv'],
      monthly: ['Obegränsat antal cv', 'Personliga brev', 'AI-skrivhjälp'],
      yearly: ['Allt i Pro', 'Prioriterad support', 'Lägsta månadspris'],
    },
    notFoundTitle: 'Sidan hittades inte',
    notFoundBody: 'Sidan finns inte eller har flyttats.',
    backHome: 'Till startsidan',
    footer: 'Innehåll hanteras i Payload CMS.',
    draftPreview: 'Förhandsvisning av utkast',
  },
  fi: {
    start: 'Tee CV',
    language: 'Kieli',
    country: 'Maa',
    plans: { starter: 'Aloitus', monthly: 'Pro', yearly: 'Pro vuosi' },
    periods: { starter: '14 päivän käyttö', monthly: 'kuukaudessa', yearly: 'vuodessa' },
    bestValue: 'Edullisin',
    features: {
      starter: ['Kaikki pohjat', 'PDF-lataus', 'Yksi CV'],
      monthly: ['Rajattomasti CV:itä', 'Saatekirjeet', 'Tekoälykirjoitusapu'],
      yearly: ['Kaikki Pro-ominaisuudet', 'Ensisijainen tuki', 'Edullisin kuukausihinta'],
    },
    notFoundTitle: 'Sivua ei löytynyt',
    notFoundBody: 'Sivua ei ole olemassa tai se on siirretty.',
    backHome: 'Etusivulle',
    footer: 'Sisältö hallitaan Payload CMS:ssä.',
    draftPreview: 'Luonnoksen esikatselu',
  },
}
