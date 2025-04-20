// Extracting words in parentheses from the input string
export function separateTitleAndSubtitle(str: string): [string, string | null] {
  const regex = /\(([^)]+)\)/;
  const match = str.match(regex);
  const title = match ? str.replace(regex, '').trim() : str;
  const subtitle = match != null && match.length > 1 ? match[1].trim() : null;
  return [title, subtitle];
}
