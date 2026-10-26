/**
 * Automatycznie kapitalizuje pierwszą literę tekstu oraz każdą literę
 * rozpoczynającą nowe zdanie (po kropce, wykrzykniku, pytajniku lub enterze ze spacją).
 */
export function autoCapitalizeSentences(text) {
  if (!text || typeof text !== 'string') return text;
  return text.replace(/(^|[.!?\n]\s*)([a-ząćęłńóśźż])/gu, (match, prefix, char) => {
    return prefix + char.toUpperCase();
  });
}

export default autoCapitalizeSentences;
