import React from 'react';

const languages = ['english', 'spanish', 'french', 'german', 'arabic', 'chinese', 'hindi', 'swahili'];

const LanguageFilter = ({ selectedLanguage, onChange }) => {
  return (
    <div className="mb-4">
      <select
        className="form-select"
        value={selectedLanguage}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Filter by language...</option>
        {languages.map((lang) => (
          <option value={lang} key={lang}>
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageFilter;
