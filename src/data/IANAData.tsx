import { VariantTagData } from '../types/DataTypes';
import { ObjectType } from '../types/PageParamTypes';

export function loadVariantTagData(raw: string): VariantTagData[] {
  const records = raw.split('%%');
  const variants: VariantTagData[] = [];

  for (const record of records) {
    const lines = record.trim().split('\n').map(line => line.trim());
    const typeLine = lines.find(line => line.startsWith('Type:'));
    if (typeLine?.includes('variant')) {
      const subtag = lines.find(l => l.startsWith('Subtag:'))?.split(': ')[1];
      const descriptions = lines.filter(l => l.startsWith('Description:')).map(l => l.replace('Description: ', ''));
      const prefixLines = lines.filter(l => l.startsWith('Prefix:')).map(l => l.replace('Prefix: ', ''));

      const nameDisplay = descriptions.join('; ');
      const associatedLanguageCodes = prefixLines.map(p => p.split('-')[0]);

      if (!subtag) continue;

      variants.push({
        type: ObjectType.VariantTag,
        ID: subtag,
        codeDisplay: subtag,
        nameDisplay,
        description: nameDisplay,
        associatedLanguageCodes,
        languages: [],
        locales: [],
        names: descriptions,
      });
    }
  }

  return variants;
}
