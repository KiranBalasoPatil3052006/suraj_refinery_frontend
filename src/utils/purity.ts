const DIGIT_WORDS: Record<string, string> = {
  '0': 'Zero',
  '1': 'One',
  '2': 'Two',
  '3': 'Three',
  '4': 'Four',
  '5': 'Five',
  '6': 'Six',
  '7': 'Seven',
  '8': 'Eight',
  '9': 'Nine',
};

/**
 * Converts numeric string digits into capitalized English words.
 * Example: "89.45" -> "Eight Nine Four Five"
 * Example: "92.50" -> "Nine Two Five Zero"
 */
export function convertPurityToWords(purityStr: string): string {
  if (!purityStr) return '';
  
  // Extract all digits ignoring dots and other symbols
  const digits = purityStr.replace(/[^\d]/g, '').split('');
  if (digits.length === 0) return '';

  return digits.map((d) => DIGIT_WORDS[d] || '').filter(Boolean).join(' ');
}

/**
 * Splits purity into whole and fractional parts.
 * Example: "89.45" -> { whole1: "8", whole2: "9", dec1: "4", dec2: "5" }
 */
export function parsePurityDigits(purityStr: string): {
  d1: string;
  d2: string;
  d3: string;
  d4: string;
} {
  const clean = purityStr.replace(/[^\d.]/g, '');
  const [whole = '', dec = ''] = clean.split('.');

  return {
    d1: whole[0] || '',
    d2: whole[1] || '',
    d3: dec[0] || '',
    d4: dec[1] || '',
  };
}

/**
 * Formats date into standard certificate format "DD/MM/YYYY" (e.g. "11/09/2026")
 */
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  // If already in DD/MM/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
  
  // If in YYYY-MM-DD format (from input type="date")
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const [y, m, d] = parts;
    return `${d}/${m}/${y}`;
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
