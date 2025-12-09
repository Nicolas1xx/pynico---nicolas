
import React, { useEffect } from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  // Fecha o modal ao pressionar ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Impede scroll no fundo
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        .animate-slide-in-up { animation: slide-in-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
      
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-slate-700 animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
          <h2 id="modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
            Sobre o <span className="text-blue-500">Py</span><span className="text-yellow-500">Nico</span>
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors" 
            aria-label="Fechar modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <div className="p-4 bg-blue-50 dark:bg-slate-700/50 rounded-lg border border-blue-100 dark:border-slate-600">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                <strong>Projeto Autoral:</strong> Este é um projeto desenvolvido inteiramente por <strong>Nicolas Ricardo</strong>.
              </p>
            </div>

            <p>
              O <strong>PyNico</strong> é um assistente de IA projetado para ser seu mentor pessoal de Python. Utilizando o poder do <strong>Google Gemini</strong>, ele ajuda desenvolvedores a desvendar conceitos complexos através de um diálogo amigável e focado em boas práticas.
            </p>
            
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-slate-900 dark:text-white">Autoria e Desenvolvimento</h3>
              <p className="text-blue-500 dark:text-blue-400 font-bold text-lg">Nicolas Ricardo</p>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-slate-900 dark:text-white">Contato</h3>
              <a href="mailto:nirizalu@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                nirizalu@gmail.com
              </a>
            </div>

            <div className="flex flex-col gap-1 pt-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">Privacidade e Tecnologia</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                As conversas são processadas pela API do Gemini e o histórico é armazenado estritamente no seu dispositivo via <code className="bg-gray-100 dark:bg-slate-700 px-1 rounded">localStorage</code>.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-500/20"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
