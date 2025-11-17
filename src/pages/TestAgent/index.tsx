import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiCpu, FiArrowLeft } from "react-icons/fi";
import { getDoc, doc, Timestamp } from "firebase/firestore";
import { firestore } from "../../services/firebase";
import type { AgentRecord, AgentStatus } from "../../services/agents";
import { sendMessageToOpenAI } from "../../services/openai";
import styles from "./styles.module.css";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  time: string;
}

export default function TestAgent() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<AgentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadAgent = async () => {
      if (!agentId) {
        navigate("/agents");
        return;
      }

      try {
        const agentDoc = await getDoc(doc(firestore, "agents", agentId));
        if (agentDoc.exists()) {
          const data = agentDoc.data();
          setAgent({
            id: agentDoc.id,
            name: data.name ?? "",
            persona: data.persona ?? "",
            systemPrompt: data.systemPrompt ?? "",
            status: (data.status ?? "inativo") as AgentStatus,
            conversationCount: data.conversationCount ?? 0,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : null,
          });
        } else {
          alert("Agente não encontrado");
          navigate("/agents");
        }
      } catch (error) {
        console.error("Erro ao carregar agente:", error);
        alert("Erro ao carregar agente");
        navigate("/agents");
      } finally {
        setLoading(false);
      }
    };

    loadAgent();
  }, [agentId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !agent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageInput,
      sender: "user",
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = messageInput;
    setMessageInput("");
    setIsTyping(true);

    try {
      // Obter API key do ambiente
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

      if (!apiKey) {
        throw new Error(
          "API Key não configurada. Adicione VITE_OPENAI_API_KEY no arquivo .env"
        );
      }

      // Preparar histórico de conversa (apenas mensagens anteriores, sem a atual)
      const conversationHistory = messages.map((msg) => ({
        role: msg.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.text,
      }));

      // Chamar API da OpenAI com o systemPrompt do agente
      const agentResponse = await sendMessageToOpenAI({
        apiKey: apiKey,
        systemPrompt: agent.systemPrompt || agent.persona,
        conversationHistory: conversationHistory,
        userMessage: currentInput,
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        maxTokens: 1000,
      });

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: agentResponse,
        sender: "agent",
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          error instanceof Error
            ? `Erro: ${error.message}`
            : "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        sender: "agent",
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>Carregando agente...</div>
      </div>
    );
  }

  if (!agent) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate("/agents")}>
          <FiArrowLeft /> Voltar
        </button>
        <div className={styles.agentInfo}>
          <FiCpu className={styles.agentIcon} />
          <div>
            <h1 className={styles.agentName}>{agent.name}</h1>
            <p className={styles.agentPersona}>{agent.persona}</p>
          </div>
        </div>
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.messagesContainer}>
          <AnimatePresence>
            {messages.length === 0 ? (
              <div className={styles.emptyState}>
                <FiCpu className={styles.emptyIcon} />
                <p>Inicie uma conversa com o agente</p>
                <span className={styles.emptyHint}>
                  O agente usará o prompt de sistema configurado para responder suas mensagens
                </span>
              </div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`${styles.message} ${
                    message.sender === "user" ? styles.messageUser : styles.messageAgent
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.messageBubble}>
                    <p className={styles.messageText}>{message.text}</p>
                    <span className={styles.messageTime}>{message.time}</span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              className={styles.typingIndicator}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span></span>
              <span></span>
              <span></span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className={styles.inputContainer} onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className={styles.messageInput}
            disabled={isTyping}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={!messageInput.trim() || isTyping}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

