import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TranslationForm from './TranslationForm';
import TranslationResult from './TranslationResult';
import './translate.css'; // Import the CSS file

const App = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [inputLanguage, setInputLanguage] = useState('en'); // Default input language
  const [outputLanguage, setOutputLanguage] = useState('es'); // Default output language
  const [languages, setLanguages] = useState([]); // Supported languages

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get('https://translation.googleapis.com/language/translate/v2/languages', {
          params: {
            key: process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY,
            target: 'en' // Optionally specify a target language to get the names of languages in a specific language
          }
        });
        setLanguages(response.data.data.languages);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchLanguages();
  }, []);

  const handleTranslate = async () => {
    try {
      const response = await axios.post('https://translation.googleapis.com/language/translate/v2', null, {
        params: {
          q: text,
          source: inputLanguage,
          target: outputLanguage,
          key: process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY
        }
      });
      setTranslatedText(response.data.data.translations[0].translatedText);
    } catch (error) {
      console.error('Error translating text:', error);
    }
  };

  return (
    <div>
      <h1>Google Translate Clone</h1>
      <TranslationForm
        text={text}
        setText={setText}
        inputLanguage={inputLanguage}
        setInputLanguage={setInputLanguage}
        outputLanguage={outputLanguage}
        setOutputLanguage={setOutputLanguage}
        handleTranslate={handleTranslate}
        languages={languages} // Pass supported languages to the form component
      />
      <TranslationResult translatedText={translatedText} />
    </div>
  );
};

export default App;
