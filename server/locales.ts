export type OutputLocale = 'en' | 'fr' | 'ar_standard' | 'ar_algerian';

const localeAliases: Record<string, OutputLocale> = {
  en: 'en',
  english: 'en',
  'en-us': 'en',
  'en-gb': 'en',
  fr: 'fr',
  french: 'fr',
  'fr-fr': 'fr',
  'ar': 'ar_standard',
  'ar_standard': 'ar_standard',
  'ar-msa': 'ar_standard',
  'ar_sa': 'ar_standard',
  'modern standard arabic': 'ar_standard',
  msa: 'ar_standard',
  'ar-dz': 'ar_algerian',
  'ar_algerian': 'ar_algerian',
  'ar_darija': 'ar_algerian',
  'algerian darija': 'ar_algerian',
  darija: 'ar_algerian',
};

export function normalizeOutputLocale(value: unknown): OutputLocale | null {
  if (typeof value !== 'string') return null;
  return localeAliases[value.trim().toLowerCase()] || null;
}

export function outputLocaleLabel(locale: OutputLocale): string {
  switch (locale) {
    case 'en': return 'English';
    case 'fr': return 'French';
    case 'ar_algerian': return 'Algerian Darija';
    case 'ar_standard': return 'Modern Standard Arabic';
  }
}
