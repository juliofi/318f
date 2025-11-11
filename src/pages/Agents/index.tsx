import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./styles.module.css";

interface Agent {
  id: number;
  name: string;
  persona: string;
  status: "ativo" | "inativo" | "treinando";
  conversations: number;
  createdAt: string;
}

const mockAgents: Agent[] = [
  {
    id: 1,
    name: "Agente de Vendas",
    persona: "Atendente profissional e amigável, focado em converter leads em clientes.",
    status: "ativo",
    conversations: 234,
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Suporte Técnico",
    persona: "Especialista técnico, paciente e detalhista, resolve problemas complexos.",
    status: "ativo",
    conversations: 189,
    createdAt: "2024-01-05",
  },
  {
    id: 3,
    name: "Agente de Pré-venda",
    persona: "Consultor consultivo, ajuda clientes a entenderem o produto antes da compra.",
    status: "inativo",
    conversations: 67,
    createdAt: "2024-01-10",
  },
  {
    id: 4,
    name: "Agente de Pós-venda",
    persona: "Atendente empático, focado em satisfação e retenção de clientes.",
    status: "treinando",
    conversations: 0,
    createdAt: "2024-01-15",
  },
];

export default function Agents() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    persona: "",
    prompt: "",
    status: "ativo" as "ativo" | "inativo" | "treinando",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock - apenas previne submit padrão
    console.log("Novo agente:", formData);
    setShowForm(false);
    setFormData({ name: "", persona: "", prompt: "", status: "ativo" });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "ativo":
        return styles.statusActive;
      case "treinando":
        return styles.statusTraining;
      case "inativo":
        return styles.statusInactive;
      default:
        return "";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Agentes de IA</h1>
          <p className={styles.subtitle}>Gerencie seus agentes inteligentes de atendimento</p>
        </div>
        <motion.button
          className={styles.newAgentButton}
          onClick={() => setShowForm(!showForm)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + Novo Agente
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            className={styles.formCard}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Criar Novo Agente</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Nome do Agente</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Ex: Agente de Vendas"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="persona">Persona</label>
                <input
                  id="persona"
                  type="text"
                  name="persona"
                  placeholder="Descreva a personalidade do agente"
                  value={formData.persona}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="prompt">Prompt de Sistema</label>
                <textarea
                  id="prompt"
                  name="prompt"
                  placeholder="Instruções detalhadas para o comportamento do agente..."
                  value={formData.prompt}
                  onChange={handleInputChange}
                  rows={6}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="status">Status Inicial</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="ativo">Ativo</option>
                  <option value="treinando">Treinando</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton}>
                  Criar Agente
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.agentsGrid}>
        {mockAgents.map((agent) => (
          <motion.div
            key={agent.id}
            className={styles.agentCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: "var(--shadow-lg)" }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.agentHeader}>
              <div className={styles.agentIcon}>🤖</div>
              <div className={styles.agentInfo}>
                <h3 className={styles.agentName}>{agent.name}</h3>
                <span className={`${styles.statusBadge} ${getStatusClass(agent.status)}`}>
                  {agent.status}
                </span>
              </div>
            </div>
            <p className={styles.agentPersona}>{agent.persona}</p>
            <div className={styles.agentStats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Conversas</span>
                <span className={styles.statValue}>{agent.conversations}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Criado em</span>
                <span className={styles.statValue}>
                  {new Date(agent.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
            <div className={styles.agentActions}>
              <button className={styles.actionButton}>Editar</button>
              <button className={styles.actionButton}>Configurar</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

