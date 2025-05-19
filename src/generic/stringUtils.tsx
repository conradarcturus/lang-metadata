// Extracting words in parentheses from the input string
export function separateTitleAndSubtitle(str: string): [string, string | undefined] {
  const regex = /\(([^)]+)\)/;
  const match = str.match(regex);
  const title = match ? str.replace(regex, '').trim() : str;
  const subtitle = match != null && match.length > 1 ? match[1].trim() : undefined;
  return [title, subtitle];
}

export function toTitleCase(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function toSentenceCase(str: string): string {
  return str.replace(/\b\w/, (char) => char.toUpperCase());
}

export function joinOxfordComma(strs: string[]): string {
  if (strs.length === 0) {
    return '';
  } else if (strs.length === 1) {
    return strs[0];
  } else if (strs.length === 2) {
    return strs[0] + ' and ' + strs[1];
  }
  return strs.slice(0, strs.length - 1).join(', ') + ', and ' + strs[strs.length - 1];
}

export function anyWordStartsWith(str: string, lowercaseQuery: string) {
  return str
    .toLowerCase()
    .split(/\s/)
    .some((s) => s.startsWith(lowercaseQuery));
}
