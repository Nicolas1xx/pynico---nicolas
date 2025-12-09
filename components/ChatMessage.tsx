
import React, { useState } from 'react';
import { Message } from '../types';

interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/70 rounded-md my-2 overflow-hidden border border-gray-300 dark:border-slate-700">
      <div className="bg-slate-800 text-gray-400 text-xs px-4 py-2 flex justify-between items-center">
        <span>Python</span>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-green-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Copiado!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              Copiar
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className="font-mono text-white">{code}</code>
      </pre>
    </div>
  );
};

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  const renderContent = (text: string) => {
    const parts = text.split(/(```python\n[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```python\n')) {
        const code = part.replace('```python\n', '').replace('```', '').trim();
        return <CodeBlock key={index} code={code} />;
      }
      return <p key={index} className="whitespace-pre-wrap">{part}</p>;
    });
  };

  return (
    <div className={`flex items-start gap-4 my-6 animate-fade-in-up`}>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
      {isModel ? (
        <>
            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-200 p-1.5 flex items-center justify-center shadow-md flex-shrink-0">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" alt="PyNico" className="w-full h-full object-contain" />
            </div>
            <div className="max-w-xs md:max-w-md lg:max-w-2xl rounded-lg rounded-tl-none px-4 py-3 bg-white dark:bg-slate-700 text-slate-800 dark:text-gray-200 shadow-md">
                {renderContent(message.text)}
            </div>
        </>
      ) : (
        <div className="flex items-start gap-4 ml-auto">
            <div className="max-w-xs md:max-w-md lg:max-w-2xl rounded-lg rounded-tr-none px-4 py-3 bg-blue-600 text-white shadow-md">
                <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-white font-bold flex-shrink-0 shadow-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
