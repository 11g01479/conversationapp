/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from '@google/genai';
import type { Chat } from '@google/genai';

const CharacterMouthClosed = () => (
    <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="grad_skin" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#FFF5EE" />
                <stop offset="100%" stopColor="#FFE5D9" />
            </radialGradient>
            <linearGradient id="grad_hair" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#F9D78B" />
                <stop offset="100%" stopColor="#E4B84F" />
            </linearGradient>
            <radialGradient id="grad_eye" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#87CEEB" />
                <stop offset="100%" stopColor="#4682B4" />
            </radialGradient>
        </defs>

        {/* Head */}
        <circle cx="75" cy="75" r="65" fill="url(#grad_skin)" />

        {/* Hair - Back layer */}
        <path d="M10,80 Q15,130 50,140 T 100,140 Q 135,130 140,80" fill="url(#grad_hair)" />
        
        {/* Hair - Front layer */}
        <path d="M15,70 C5,50 20,20 40,15 C60,10 90,10 110,15 C130,20 145,50 135,70 Q 75, 85 15, 70" fill="url(#grad_hair)"/>
        {/* Bangs */}
        <path d="M40,15 C 45,35 75,45 75,15" fill="#D4A83F" />
        <path d="M110,15 C 105,35 75,45 75,15" fill="#D4A83F" />

        {/* Eyes */}
        <g transform="translate(-20, 0)">
            <ellipse cx="70" cy="78" rx="15" ry="17" fill="white" />
            <ellipse cx="70" cy="80" rx="11" ry="13" fill="url(#grad_eye)" />
            <circle cx="68" cy="78" r="4" fill="#1E1E1E" />
            <circle cx="74" cy="73" r="4" fill="white" opacity="0.8" />
            <circle cx="67" cy="84" r="2" fill="white" opacity="0.6" />
        </g>
        <g transform="translate(20, 0)">
            <ellipse cx="90" cy="78" rx="15" ry="17" fill="white" />
            <ellipse cx="90" cy="80" rx="11" ry="13" fill="url(#grad_eye)" />
            <circle cx="88" cy="78" r="4" fill="#1E1E1E" />
            <circle cx="94" cy="73" r="4" fill="white" opacity="0.8" />
            <circle cx="87" cy="84" r="2" fill="white" opacity="0.6" />
        </g>

        {/* Eyebrows */}
        <path d="M42,63 Q 52,59 62,63" stroke="#C19A6B" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M108,63 Q 98,59 88,63" stroke="#C19A6B" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* Nose */}
        <path d="M75,90 L 75,95" stroke="#D7CCC8" strokeWidth="1.5" strokeLinecap="round" />

        {/* Mouth */}
        <path d="M68,105 Q 75,109 82,105" stroke="#BCAAA4" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Blush */}
        <ellipse cx="40" cy="95" rx="14" ry="7" fill="#FFC0CB" opacity="0.4"/>
        <ellipse cx="110" cy="95" rx="14" ry="7" fill="#FFC0CB" opacity="0.4"/>
    </svg>
);

const CharacterMouthOpen = () => (
    <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="grad_skin_open" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#FFF5EE" />
                <stop offset="100%" stopColor="#FFE5D9" />
            </radialGradient>
            <linearGradient id="grad_hair_open" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#F9D78B" />
                <stop offset="100%" stopColor="#E4B84F" />
            </linearGradient>
            <radialGradient id="grad_eye_open" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#87CEEB" />
                <stop offset="100%" stopColor="#4682B4" />
            </radialGradient>
        </defs>

        {/* Head */}
        <circle cx="75" cy="75" r="65" fill="url(#grad_skin_open)" />

        {/* Hair - Back layer */}
        <path d="M10,80 Q15,130 50,140 T 100,140 Q 135,130 140,80" fill="url(#grad_hair_open)" />
        
        {/* Hair - Front layer */}
        <path d="M15,70 C5,50 20,20 40,15 C60,10 90,10 110,15 C130,20 145,50 135,70 Q 75, 85 15, 70" fill="url(#grad_hair_open)"/>
        {/* Bangs */}
        <path d="M40,15 C 45,35 75,45 75,15" fill="#D4A83F" />
        <path d="M110,15 C 105,35 75,45 75,15" fill="#D4A83F" />

        {/* Eyes */}
        <g transform="translate(-20, 0)">
            <ellipse cx="70" cy="78" rx="15" ry="17" fill="white" />
            <ellipse cx="70" cy="80" rx="11" ry="13" fill="url(#grad_eye_open)" />
            <circle cx="68" cy="78" r="4" fill="#1E1E1E" />
            <circle cx="74" cy="73" r="4" fill="white" opacity="0.8" />
            <circle cx="67" cy="84" r="2" fill="white" opacity="0.6" />
        </g>
        <g transform="translate(20, 0)">
            <ellipse cx="90" cy="78" rx="15" ry="17" fill="white" />
            <ellipse cx="90" cy="80" rx="11" ry="13" fill="url(#grad_eye_open)" />
            <circle cx="88" cy="78" r="4" fill="#1E1E1E" />
            <circle cx="94" cy="73" r="4" fill="white" opacity="0.8" />
            <circle cx="87" cy="84" r="2" fill="white" opacity="0.6" />
        </g>

        {/* Eyebrows */}
        <path d="M42,61 Q 52,57 62,61" stroke="#C19A6B" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M108,61 Q 98,57 88,61" stroke="#C19A6B" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* Nose */}
        <path d="M75,90 L 75,95" stroke="#D7CCC8" strokeWidth="1.5" strokeLinecap="round" />

        {/* Mouth */}
        <ellipse cx="75" cy="107" rx="10" ry="7" fill="#8c635d" />

        {/* Blush */}
        <ellipse cx="40" cy="95" rx="14" ry="7" fill="#FFC0CB" opacity="0.4"/>
        <ellipse cx="110" cy="95" rx="14" ry="7" fill="#FFC0CB" opacity="0.4"/>
    </svg>
);

const UserGuide = ({ onClose }: { onClose: () => void }) => (
  <div className="guide-overlay">
    <div className="guide-content">
      <h2>利用ガイド</h2>
      <p>このAIキャラクターとの会話を楽しむためのヒントです。</p>
      <ul>
        <li><strong>テキスト入力:</strong> 下の入力ボックスにメッセージをタイプして「送信」ボタンを押すか、Enterキーで送信できます。</li>
        <li><strong>音声入力:</strong> マイクボタンを押すと録音が始まります。</li>
        <li><strong>自動送信:</strong> 話し終えてから<strong>1秒</strong>経つと、自動的にメッセージが送信されます。</li>
        <li><strong>キーワード送信:</strong> 会話の最後に「<strong>送信</strong>」と言うことでも、すぐにメッセージを送ることができます。（「送信」という言葉は表示されません）</li>
      </ul>
      <button onClick={onClose}>はじめる</button>
    </div>
  </div>
);

const App = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMouthOpen, setIsMouthOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const chatRef = useRef<Chat | null>(null);
  const recognitionRef = useRef<any | null>(null);
  const mouthAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const latestTranscriptRef = useRef('');

  useEffect(() => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'You are a friendly, conversational AI. Keep your responses concise and in Japanese.',
        },
      });
      
      const hasSeenGuide = localStorage.getItem('hasSeenGuide');
      if (!hasSeenGuide) {
        setShowGuide(true);
      } else {
        const initialMessage = 'こんにちは！またお話ししに来てくれたんですね！';
        setMessages([{ role: 'model', text: initialMessage }]);
        speak(initialMessage);
      }
    } catch (error) {
      console.error("Failed to initialize Gemini AI:", error);
      setMessages([{ role: 'model', text: '申し訳ありませんが、AIサービスに接続できませんでした。' }]);
    }
  }, []);
  
  const handleCloseGuide = () => {
    localStorage.setItem('hasSeenGuide', 'true');
    setShowGuide(false);
    const initialMessage = 'こんにちは！何かお話ししませんか？';
    setMessages([{ role: 'model', text: initialMessage }]);
    speak(initialMessage);
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    if (isSpeaking) {
      mouthAnimationRef.current = setInterval(() => {
        setIsMouthOpen(prev => !prev);
      }, 200);
    } else {
      if (mouthAnimationRef.current) {
        clearInterval(mouthAnimationRef.current);
      }
      setIsMouthOpen(false);
    }
    return () => {
      if (mouthAnimationRef.current) {
        clearInterval(mouthAnimationRef.current);
      }
    };
  }, [isSpeaking]);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) {
        console.warn("Speech synthesis not supported.");
        return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : userInput;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        throw new Error("Chat is not initialized.");
      }
      const response = await chatRef.current.sendMessage({ message: textToSend });
      const modelResponse = response.text;
      
      setMessages(prev => [...prev, { role: 'model', text: modelResponse }]);
      speak(modelResponse);

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = { role: 'model' as const, text: 'おっと！何か問題が発生したようです。' };
      setMessages(prev => [...prev, errorMessage]);
      speak(errorMessage.text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("このブラウザは音声認識に対応していません。");
      return;
    }

    if (isListening) {
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      recognitionRef.current?.stop();
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ja-JP';

      recognition.onstart = () => {
        latestTranscriptRef.current = userInput;
        setIsListening(true);
      };
      
      recognition.onend = () => {
        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
        setIsListening(false);
        if (latestTranscriptRef.current.trim()){
            handleSendMessage(latestTranscriptRef.current.trim());
        }
        latestTranscriptRef.current = '';
      };
      
      recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        if (speechTimeoutRef.current) {
          clearTimeout(speechTimeoutRef.current);
        }

        let currentTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }

        if (currentTranscript.trim().endsWith('送信')) {
            const textToSend = currentTranscript.trim().replace(/送信$/, '').trim();
            setUserInput(textToSend);
            latestTranscriptRef.current = textToSend;
            recognitionRef.current?.stop();
            return;
        }

        setUserInput(currentTranscript);
        latestTranscriptRef.current = currentTranscript;

        speechTimeoutRef.current = setTimeout(() => {
          recognitionRef.current?.stop();
        }, 1000);
      };
      
      recognition.start();
      recognitionRef.current = recognition;
    }
  };


  return (
    <div className="app-container">
      {showGuide && <UserGuide onClose={handleCloseGuide} />}
      <header className="character-container">
        <div className="character-face">
          {isMouthOpen ? <CharacterMouthOpen /> : <CharacterMouthClosed />}
        </div>
      </header>
      <main className="chat-container" aria-live="polite">
        <div className="message-list">
          {messages.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.role}`}>
              {msg.text}
            </div>
          ))}
          {isLoading && <div className="message-bubble model">...</div>}
          <div ref={messageEndRef} />
        </div>
      </main>
      <footer className="input-area">
        <button
          className={`mic-button ${isListening ? 'listening' : ''}`}
          onClick={handleToggleListening}
          disabled={isLoading}
          aria-label={isListening ? '録音停止' : '録音開始'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"></path>
            <path d="M17 11h-1c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92z"></path>
          </svg>
        </button>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="メッセージを入力..."
          disabled={isLoading}
          rows={1}
        />
        <button onClick={() => handleSendMessage()} disabled={isLoading || !userInput.trim()}>
          送信
        </button>
      </footer>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

declare global {
    interface Window {
      SpeechRecognition: any;
      webkitSpeechRecognition: any;
    }
}