import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

// O tipo de 'history' no método 'create' do SDK mudou,
// ele espera 'Content[]' ou, para um histórico mais simples,
// o array pode ser mapeado como feito abaixo.

const SYSTEM_INSTRUCTION = `Você é PyNico, um desenvolvedor Python especialista e um mentor amigável para jovens programadores. 
Sua personalidade é paciente, profissional e prestativa.

**REGRAS PRINCIPAIS:**
1.  **Seja Conciso:** Mantenha suas respostas curtas e diretas. Evite parágrafos longos.
2.  **Divida e Conquiste:** Divida explicações complexas em partes menores e fáceis de entender. Responda a uma parte e espere que o usuário peça a continuação.
3.  **Incentive a Interação:** Termine suas respostas com perguntas como "Isso faz sentido?" ou "Quer que eu detalhe alguma parte específica?" para encorajar um diálogo.
4.  **Código Claro:** Forneça exemplos de código úteis e bem comentados. Sempre formate trechos de código em markdown usando \`\`\`python ... \`\`\`.
5.  **Boas Práticas:** Incentive boas práticas de codificação, como escrever código limpo e testá-lo.`;

const model = 'gemini-2.5-flash';

export const geminiChat = {
  sendMessage: async (history: Message[], newMessage: string): Promise<string> => {
    try {
        // Inicializa o cliente da API aqui para garantir que a chave da API esteja carregada.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        // Mapeia o histórico para o formato da API (Content[]).
        // Cada 'Content' precisa de 'role' (user/model) e 'parts' (que contêm o 'text').
        const mappedHistory = history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model', // Ajuste a role se necessário
          parts: [{ text: msg.text }]
        }));

        // O SDK usa 'chats' ou 'models'. Para criar o chat com histórico,
        // usamos o método 'chats.create' ou 'models.generateContentStream'.
        // O método 'chats.create' é o mais adequado para manter a conversa.
        const chat = ai.chats.create({
          model: model,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
          },
          history: mappedHistory,
        });

        // Envia a nova mensagem no contexto do chat.
        const response = await chat.sendMessage({ message: newMessage });

        return response.text;
    } catch (error) {
      console.error("Erro na API Gemini:", error);
      if (error instanceof Error) {
        return `Desculpe, encontrei um erro: ${error.message}`;
      }
      return "Desculpe, ocorreu um erro desconhecido.";
    }
  },
};
