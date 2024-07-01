import React from 'react';

const TranslationForm = ({ text, setText, inputLanguage, setInputLanguage, outputLanguage, setOutputLanguage, handleTranslate, languages }) => {
  return (
    <div className="translation-form">
      <div className="language-select">
        <select value={inputLanguage} onChange={(e) => setInputLanguage(e.target.value)}>
          {languages.map(lang => (
            <option key={lang.language} value={lang.language}>{lang.name}</option>
          ))}
        </select>
        <button className="swap-button" onClick={() => { 
          const temp = inputLanguage; 
          setInputLanguage(outputLanguage); 
          setOutputLanguage(temp); 
        }}>⇄</button>
        <select value={outputLanguage} onChange={(e) => setOutputLanguage(e.target.value)}>
          {languages.map(lang => (
            <option key={lang.language} value={lang.language}>{lang.name}</option>
          ))}
        </select>
      </div>
      <textarea
        className="input-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to translate"
      />
      <button className="translate-button" onClick={handleTranslate}>Translate</button>
    </div>
  );
};

export default TranslationForm;
