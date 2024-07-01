import React from 'react';

const TranslationResult = ({ translatedText }) => {
  return (
    <div>
      <h2>Translated Text:</h2>
      <p>{translatedText}</p>
    </div>
  );
};

export default TranslationResult;
