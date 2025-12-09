
import React from 'react';

interface WelcomeSectionProps {
  onExampleClick: (prompt: string) => void;
}

const examplePrompts = [
    "Qual a diferença entre uma lista e uma tupla em Python?",
    "Como funcionam os decoradores? Me dê um exemplo.",
    "Me ajude a entender o que é o 'self' em uma classe.",
    "Crie uma função simples que retorna o fatorial de um número.",
];

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onExampleClick }) => {
  return (
    <div className="text-center my-12 animate-fade-in-up">
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
      `}</style>
      <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" alt="Python logo" className="w-full h-full object-contain" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
        Bem-vindo ao <span className="text-blue-400">Py</span><span className="text-yellow-400">Nico</span>
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        Seu assistente pessoal para desvendar os mistérios do Python.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {examplePrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onExampleClick(prompt)}
            className="group bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-slate-700/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:-translate-y-1 shadow-md hover:shadow-lg flex justify-between items-center"
          >
            <p className="font-semibold">{prompt}</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-slate-800 dark:group-hover:text-white transition-colors flex-shrink-0 ml-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeSection;
