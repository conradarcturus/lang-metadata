// src/data/LocaleParser.ts

import fs from 'fs';
import path from 'path';

export interface LocaleParts {
  language: string | null;
  script: string | null;
  region: string | null;
  variant: string | null;
}

interface SubtagRegistry {
  language: Set<string>;
  script: Set<string>;
  region: Set<string>;
  variant: Set<string>;
  preferred: Record<string, string>;
}

export class LocaleParser {
  private subtags: SubtagRegistry = {
    language: new Set(),
    script: new Set(),
    region: new Set(),
    variant: new Set(),
    preferred: {}
  };

  constructor(registryPath: string) {
    const data = fs.readFileSync(registryPath, 'utf-8');
    this.parseRegistry(data);
  }

  private parseRegistry(content: string) {
    const records = content.split("%%\n");
    for (const record of records) {
      const typeMatch = record.match(/Type: (\w+)/);
      const subtagMatch = record.match(/Subtag: ([\w\-]+)/);
      const preferredMatch = record.match(/Preferred-Value: ([\w\-]+)/);

      if (typeMatch && subtagMatch) {
        const type = typeMatch[1].toLowerCase();
        const subtag = subtagMatch[1].toLowerCase();
        if (type in this.subtags && typeof this.subtags[type as keyof SubtagRegistry] !== 'object') {
  ((this.subtags[type as keyof SubtagRegistry]) as Set<string>).add(subtag);
}
        if (preferredMatch) {
          this.subtags.preferred[subtag] = preferredMatch[1].toLowerCase();
        }
      }
    }
  }

  public parseLocale(locale: string): LocaleParts {
    const parts = locale.toLowerCase().split(/[-_]/);
    const result: LocaleParts = {
      language: null,
      script: null,
      region: null,
      variant: null,
    };

    let i = 0;
    if (parts[i] && this.subtags.language.has(parts[i])) {
      result.language = this.normalize(parts[i]);
      i++;
    }
    if (parts[i] && this.subtags.script.has(parts[i])) {
      result.script = this.normalize(parts[i]);
      i++;
    }
    if (parts[i] && this.subtags.region.has(parts[i])) {
      result.region = this.normalize(parts[i]);
      i++;
    }
    if (parts[i] && this.subtags.variant.has(parts[i])) {
      result.variant = this.normalize(parts[i]);
    }

    return result;
  }

  private normalize(subtag: string): string {
    return this.subtags.preferred[subtag] || subtag;
  }
}
