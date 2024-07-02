import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './translate.css'; // Import the CSS file
import mic from '../Images/Mic.png';
import speakers from '../Images/speakers.png';

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

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleTranslate();
    }, 1000); // Wait for 1 second after the user stops typing

    return () => clearTimeout(debounceTimeout); // Clear timeout if the user types again
  }, [text, inputLanguage, outputLanguage]);

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

  const handleSpeechToText = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = inputLanguage;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log('Voice recognition started.');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };

    recognition.onend = () => {
      console.log('Voice recognition ended.');
    };

    recognition.start();
  };

  const handleTextToSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech not supported in this browser.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = outputLanguage;
    window.speechSynthesis.speak(utterance);
  };
  const handleText = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech not supported in this browser.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = outputLanguage;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <h1>Google Translate Clone</h1>
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
        <div className='textarea'>
          <div className='input'>
            <textarea
              className="input-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type Or Speak"
            />
            <div className='images'>

            <img src={mic} alt="mic" onClick={handleSpeechToText} />
            <img src={speakers} alt="speaker" onClick={handleText} />
            </div>
          </div> 

          <div className='output'>
            <textarea
              className="output-text"
              value={translatedText}
              readOnly
              placeholder="Translation"
            />

            <div className='images'>
            <img src={speakers} alt="speaker" onClick={handleTextToSpeech} />
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
