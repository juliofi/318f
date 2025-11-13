import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiInstagram, FiMail } from "react-icons/fi";
import type { ComponentType, SVGProps } from "react";
import styles from "./styles.module.css";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface Conversation {
  id: number;
  name: string;
  channel: "whatsapp" | "instagram" | "email";
  lastMessage: string;
  time: string;
  unread: number;
  status: "online" | "offline" | "typing";
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "contact";
  time: string;
  type: "text" | "image" | "file";
}

const mockConversations: Conversation[] = [
  {
    id: 1,
    name: "João Silva",
    channel: "whatsapp",
    lastMessage: "Obrigado pela ajuda!",
    time: "14:30",
    unread: 2,
    status: "online",
  },
  {
    id: 2,
    name: "Maria Santos",
    channel: "instagram",
    lastMessage: "Quando posso agendar?",
    time: "13:45",
    unread: 0,
    status: "typing",
  },
  {
    id: 3,
    name: "Pedro Oliveira",
    channel: "email",
    lastMessage: "Preciso de mais informações...",
    time: "12:20",
    unread: 1,
    status: "offline",
  },
  {
    id: 4,
    name: "Ana Costa",
    channel: "whatsapp",
    lastMessage: "Perfeito, combinado!",
    time: "11:15",
    unread: 0,
    status: "online",
  },
];

const mockMessages: Record<number, Message[]> = {
  1: [
    { id: 1, text: "Olá! Como posso ajudar?", sender: "user", time: "14:25", type: "text" },
    { id: 2, text: "Gostaria de saber sobre os planos disponíveis.", sender: "contact", time: "14:26", type: "text" },
    { id: 3, text: "Claro! Vou enviar as informações detalhadas.", sender: "user", time: "14:27", type: "text" },
    { id: 4, text: "Obrigado pela ajuda!", sender: "contact", time: "14:30", type: "text" },
  ],
  2: [
    { id: 1, text: "Olá! Quando posso agendar uma reunião?", sender: "contact", time: "13:40", type: "text" },
    { id: 2, text: "Vou verificar a disponibilidade...", sender: "user", time: "13:42", type: "text" },
    { id: 3, text: "Quando posso agendar?", sender: "contact", time: "13:45", type: "text" },
  ],
  3: [
    { id: 1, text: "Bom dia! Preciso de mais informações sobre o produto.", sender: "contact", time: "12:15", type: "text" },
    { id: 2, text: "Claro! Qual informação específica você precisa?", sender: "user", time: "12:18", type: "text" },
    { id: 3, text: "Preciso de mais informações...", sender: "contact", time: "12:20", type: "text" },
  ],
  4: [
    { id: 1, text: "Tudo certo para amanhã?", sender: "contact", time: "11:10", type: "text" },
    { id: 2, text: "Sim, está tudo confirmado!", sender: "user", time: "11:12", type: "text" },
    { id: 3, text: "Perfeito, combinado!", sender: "contact", time: "11:15", type: "text" },
  ],
};

const channelIcons: Record<Conversation["channel"], IconType> = {
  whatsapp: FiMessageCircle,
  instagram: FiInstagram,
  email: FiMail,
};

export default function Chat() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages[1] || []);

  const handleSelectConversation = (id: number) => {
    setSelectedConversation(id);
    setMessages(mockMessages[id] || []);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: messageInput,
      sender: "user",
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");

    // Simular resposta automática após 2 segundos
    setTimeout(() => {
      const response: Message = {
        id: messages.length + 2,
        text: "Mensagem recebida! Em breve retornarei.",
        sender: "contact",
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        type: "text",
      };
      setMessages((prev) => [...prev, response]);
    }, 2000);
  };

  const selectedConv = mockConversations.find((c) => c.id === selectedConversation);
  const HeaderChannelIcon = selectedConv ? channelIcons[selectedConv.channel] : null;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Conversas</h2>
          <button className={styles.newChatButton}>+ Nova</button>
        </div>

        <div className={styles.conversationsList}>
          {mockConversations.map((conversation) => {
            const ChannelIcon = channelIcons[conversation.channel];
            return (
            <motion.div
              key={conversation.id}
              className={`${styles.conversationItem} ${
                selectedConversation === conversation.id ? styles.conversationItemActive : ""
              }`}
              onClick={() => handleSelectConversation(conversation.id)}
              whileHover={{ backgroundColor: "var(--color-surface)" }}
              transition={{ duration: 0.1 }}
            >
              <div className={styles.conversationAvatar}>
                <span className={styles.avatarIcon}>
                  <ChannelIcon />
                </span>
                {conversation.status === "online" && (
                  <span className={styles.statusIndicator} />
                )}
              </div>
              <div className={styles.conversationInfo}>
                <div className={styles.conversationHeader}>
                  <span className={styles.conversationName}>{conversation.name}</span>
                  <span className={styles.conversationTime}>{conversation.time}</span>
                </div>
                <div className={styles.conversationFooter}>
                  <span className={styles.conversationMessage}>{conversation.lastMessage}</span>
                  {conversation.unread > 0 && (
                    <span className={styles.unreadBadge}>{conversation.unread}</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
          })}
        </div>
      </aside>

      <main className={styles.chatArea}>
        {selectedConversation && selectedConv ? (
          <>
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderInfo}>
                <div className={styles.chatAvatar}>
                  <span className={styles.avatarIcon}>
                    {HeaderChannelIcon ? <HeaderChannelIcon /> : null}
                  </span>
                  {selectedConv.status === "online" && (
                    <span className={styles.statusIndicator} />
                  )}
                </div>
                <div>
                  <h3 className={styles.chatName}>{selectedConv.name}</h3>
                  <p className={styles.chatStatus}>
                    {selectedConv.status === "typing" ? "digitando..." : selectedConv.channel}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.messagesContainer}>
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`${styles.message} ${
                      message.sender === "user" ? styles.messageSent : styles.messageReceived
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
                ))}
              </AnimatePresence>

              {selectedConv.status === "typing" && (
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
            </div>

            <form className={styles.messageInputContainer} onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className={styles.messageInput}
              />
              <button type="submit" className={styles.sendButton} disabled={!messageInput.trim()}>
                Enviar
              </button>
            </form>
          </>
        ) : (
          <div className={styles.emptyState}>
            <p>Selecione uma conversa para começar</p>
          </div>
        )}
      </main>
    </div>
  );
}

