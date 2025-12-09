
import React, { useState, useEffect, useRef } from 'react';
import { Message, ChatSession } from './types';
import { geminiChat } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import WelcomeSection from './components/WelcomeSection';
import AboutModal from './components/AboutModal';
import ChatHistorySidebar from './components/ChatHistorySidebar';

const INITIAL_MESSAGE: Message = {
  role: 'model',
  text: `Olá! Eu sou o PyNico. Estou aqui para te ajudar com suas dúvidas sobre Python. No que você está trabalhando hoje?`,
};

type Theme = 'light' | 'dark';

const ThemeToggleButton: React.FC<{ theme: Theme; toggleTheme: () => void }> = ({ theme, toggleTheme }) => (
    <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700" aria-label={`Mudar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}>
        {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
        )}
    </button>
);


const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('pynico-theme') as Theme) || 'dark';
    } catch (error) {
      console.warn('Erro ao acessar localStorage para tema:', error);
      return 'dark';
    }
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Gerencia o tema
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('pynico-theme', theme);
    } catch (e) {
      // Ignore storage errors
    }
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // Carrega sessões do localStorage na inicialização
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('pynico-chat-sessions');
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions);
        if (parsedSessions && Array.isArray(parsedSessions) && parsedSessions.length > 0) {
          setSessions(parsedSessions);
          setActiveSessionId(parsedSessions[0].id);
        } else {
          handleNewChat();
        }
      } else {
        handleNewChat();
      }
    } catch (error) {
      console.error("Falha ao carregar o histórico do chat:", error);
      handleNewChat();
    }
  }, []);

  // Salva sessões no localStorage sempre que mudarem
  useEffect(() => {
    try {
      if (sessions.length > 0) {
        localStorage.setItem('pynico-chat-sessions', JSON.stringify(sessions));
      }
    } catch (error) {
      console.error("Falha ao salvar o histórico do chat:", error);
    }
  }, [sessions]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sessions, activeSessionId]);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'Nova Conversa',
      messages: [INITIAL_MESSAGE],
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsSidebarOpen(false);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const messageText = customPrompt || input;
    if (!messageText.trim() || isLoading || !activeSessionId) return;

    const userMessage: Message = { role: 'user', text: messageText };
    
    // Atualiza mensagens localmente
    setSessions(prev => prev.map(session => {
        if (session.id === activeSessionId) {
            // Se for a primeira mensagem do usuário, atualiza o título
            const isFirstUserMessage = session.messages.filter(m => m.role === 'user').length === 0;
            const newTitle = isFirstUserMessage ? messageText.slice(0, 30) + (messageText.length > 30 ? '...' : '') : session.title;
            return {
                ...session,
                title: newTitle,
                messages: [...session.messages, userMessage]
            };
        }
        return session;
    }));

    setInput('');
    setIsLoading(true);

    try {
      // Pega o histórico atual para enviar à API
      const currentHistory = activeSession?.messages || [];
      const response = await geminiChat.sendMessage(currentHistory, messageText);
      
      const modelMessage: Message = { role: 'model', text: response };
      
      setSessions(prev => prev.map(session => {
          if (session.id === activeSessionId) {
              return {
                  ...session,
                  messages: [...session.messages, modelMessage]
              };
          }
          return session;
      }));
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = (id: string) => {
    const updatedSessions = sessions.filter(s => s.id !== id);
    setSessions(updatedSessions);
    if (activeSessionId === id) {
      if (updatedSessions.length > 0) {
        setActiveSessionId(updatedSessions[0].id);
      } else {
        handleNewChat();
      }
    }
  };

  return (
    <div className={`flex h-screen w-full bg-gray-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden`}>
      <ChatHistorySidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewChat={handleNewChat}
        onSelectSession={(id) => { setActiveSessionId(id); setIsSidebarOpen(false); }}
        onDeleteSession={handleDeleteSession}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 text-gray-500 hover:text-slate-900 dark:hover:text-white"
                aria-label="Abrir histórico"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center shadow-sm">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" alt="Python Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="font-bold text-lg text-slate-800 dark:text-white hidden sm:block">
                    PyNico Assistente
                </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
             <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
             <button 
                onClick={() => setIsAboutModalOpen(true)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="Sobre"
             >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
             </button>
          </div>
        </header>

        {/* Chat Content */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar"
        >
          <div className="max-w-4xl mx-auto">
            {activeSession && activeSession.messages.length <= 1 && (
              <WelcomeSection onExampleClick={(prompt) => handleSendMessage(prompt)} />
            )}
            
            {activeSession?.messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            
            {isLoading && (
               <div className="flex items-start gap-4 my-6 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  <div className="bg-slate-200 dark:bg-slate-700 rounded-lg h-10 w-32"></div>
               </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-gradient-to-t from-gray-50 dark:from-slate-900 via-gray-50 dark:via-slate-900 to-transparent pt-10 pb-4">
            <div className="max-w-4xl mx-auto px-4">
                <ChatInput 
                    value={input} 
                    onChange={setInput} 
                    onSendMessage={() => handleSendMessage()} 
                    isLoading={isLoading} 
                />
                <p className="text-[10px] text-center text-gray-400 mt-2">
                    PyNico pode cometer erros. Verifique informações importantes.
                </p>
            </div>
        </div>

        <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
      </main>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #cbd5e1; 
          border-radius: 10px; 
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default App;
