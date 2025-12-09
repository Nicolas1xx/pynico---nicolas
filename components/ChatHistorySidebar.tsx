import React from 'react';
import { ChatSession } from '../types';

interface ChatHistorySidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 z-20 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      <aside
        className={`absolute md:static top-0 left-0 h-full bg-gray-200/95 dark:bg-slate-800/95 backdrop-blur-sm border-r border-gray-300 dark:border-slate-700 flex-shrink-0 flex flex-col z-30 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'
        } md:translate-x-0 ${isCollapsed ? 'md:w-20' : 'md:w-72'}`}
      >
        <div className="p-4 border-b border-gray-300 dark:border-slate-700">
          <button
            onClick={onNewChat}
            className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 dark:focus:ring-offset-slate-800 focus:ring-blue-500 ${isCollapsed ? 'bg-gray-300 dark:bg-slate-700 hover:bg-gray-400 dark:hover:bg-slate-600 text-slate-800 dark:text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            <span className={`truncate ${isCollapsed ? 'md:hidden' : ''}`}>Nova Conversa</span>
          </button>
        </div>

        <nav className={`flex-1 overflow-y-auto p-2 space-y-1 transition-opacity duration-200 ${isCollapsed ? 'md:opacity-0 md:pointer-events-none' : 'md:opacity-100'}`}>
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`group relative flex items-center justify-between p-2.5 rounded-md cursor-pointer transition-colors ${
                activeSessionId === session.id
                  ? 'bg-blue-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-blue-500 rounded-r-full transition-opacity ${activeSessionId === session.id ? 'opacity-100' : 'opacity-0'}`} />
              <span className="truncate flex-1 pr-2 pl-2">{session.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                aria-label={`Excluir conversa ${session.title}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                   <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75V4.5h8V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4.5H5.25a.75.75 0 0 0 0 1.5H6v7.25A2.75 2.75 0 0 0 8.75 16h2.5A2.75 2.75 0 0 0 14 13.25V6h.75a.75.75 0 0 0 0-1.5H10ZM12.5 6v7.25c0 .414-.336.75-.75.75h-2.5a.75.75 0 0 1-.75-.75V6h4Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </nav>

        <div className="p-2 border-t border-gray-300 dark:border-slate-700 hidden md:block">
            <button
                onClick={onToggleCollapse}
                className="w-full flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white font-semibold py-2.5 px-2 rounded-lg transition-colors"
                aria-label={isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
            >
                 {isCollapsed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                    ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 19.5-7.5-7.5 7.5-7.5" />
                    </svg>
                )}
                 <span className={isCollapsed ? 'hidden' : ''}>Ocultar</span>
            </button>
        </div>
      </aside>
    </>
  );
};

export default ChatHistorySidebar;