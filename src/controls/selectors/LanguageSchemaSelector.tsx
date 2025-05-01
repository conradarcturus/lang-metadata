import React from 'react';

import ButtonGroupSingleChoice from '../ButtonGroupSingleChoice';
import { usePageParams } from '../PageParamsContext';
import { LanguageSchema } from '../PageParamTypes';

const LanguageSchemaSelector: React.FC = () => {
  const { languageSchema, updatePageParams } = usePageParams();

  return (
    <ButtonGroupSingleChoice<LanguageSchema>
      options={Object.values(LanguageSchema)}
      onChange={(languageSchema: LanguageSchema) => updatePageParams({ languageSchema })}
      selected={languageSchema}
      getOptionDescription={(languageSchema) => (
        <>
          Different groups identify what a language is. Use this option to control the schema of
          language you want to follow.
          <p>
            <LanguageSchemaDescription languageSchema={languageSchema} />
          </p>
        </>
      )}
    />
  );
};

const LanguageSchemaDescription: React.FC<{ languageSchema: LanguageSchema }> = ({
  languageSchema,
}) => {
  switch (languageSchema) {
    case LanguageSchema.Inclusive:
      return (
        <>
          <label>Inclusive:</label>Show all languages and dialects, regardless of where it was
          defined.
        </>
      );
    case LanguageSchema.ISO:
      return (
        <>
          <label>International Standards Organization (ISO):</label>The languages and macrolanguages
          defined by the International Standards Organization, standard # 639. Unicode and most
          technology companies use this list to define the possible languages.
        </>
      );
    case LanguageSchema.WAL:
      return (
        <>
          <label>World Atlas of Languages (WAL):</label>The languages that have been agreed by the
          UNESCO authorities and representatives of UN member states to show in the World Atlas of
          Languages.
        </>
      );
    case LanguageSchema.Glottolog:
      return (
        <>
          <label>Glottolog:</label>The languoids shown in the Glottolog database. This schema will
          include many more language families than ISO.
        </>
      );
  }
};

export default LanguageSchemaSelector;
