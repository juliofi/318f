import axios from "axios";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface SendMessageOptions {
  apiKey: string;
  systemPrompt: string;
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;
  userMessage: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export const sendMessageToOpenAI = async (
  options: SendMessageOptions
): Promise<string> => {
  const {
    apiKey,
    systemPrompt,
    conversationHistory,
    userMessage,
    model = "gpt-3.5-turbo",
    temperature = 0.7,
    maxTokens = 1000,
  } = options;

  if (!apiKey || !apiKey.startsWith("sk-")) {
    throw new Error("API Key inválida ou não configurada");
  }

  try {
    // Montar array de mensagens: system prompt primeiro, depois histórico, depois mensagem do usuário
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })) as ChatMessage[],
      { role: "user", content: userMessage },
    ];

    const response = await axios.post<OpenAIResponse>(
      OPENAI_API_URL,
      {
        model: model,
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error("Resposta vazia da API da OpenAI");
    }

    const assistantMessage = response.data.choices[0].message.content;

    if (!assistantMessage) {
      throw new Error("Mensagem do assistente vazia");
    }

    return assistantMessage;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("API Key inválida. Verifique sua chave no arquivo .env");
      }
      if (error.response?.status === 429) {
        throw new Error(
          "Limite de requisições excedido. Aguarde alguns instantes e tente novamente."
        );
      }
      if (error.response?.status === 500) {
        throw new Error("Erro interno da API da OpenAI. Tente novamente mais tarde.");
      }
      throw new Error(
        error.response?.data?.error?.message || "Erro ao comunicar com a API da OpenAI"
      );
    }
    throw error;
  }
};

