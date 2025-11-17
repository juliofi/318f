import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCpu } from "react-icons/fi";
import styles from "./styles.module.css";
import type { AgentRecord, AgentStatus } from "../../services/agents";
import { createAgent, deleteAgent, subscribeToAgents, updateAgent } from "../../services/agents";

interface AgentFormData {
  name: string;
  persona: string;
  systemPrompt: string;
  status: AgentStatus;
}

const emptyForm: AgentFormData = {
  name: "",
  persona: "",
  systemPrompt: "",
  status: "ativo",
};

export default function Agents() {
  const [showForm, setShowForm] = useState(false);
  const [agents, setAgents] = useState<AgentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AgentFormData>(emptyForm);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAgents(
      (data) => {
        setAgents(data);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Não foi possível carregar os agentes. Tente novamente.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const orderedAgents = useMemo(
    () =>
      [...agents].sort((a, b) => {
        const dateA = a.createdAt?.getTime() ?? 0;
        const dateB = b.createdAt?.getTime() ?? 0;
        return dateB - dateA;
      }),
    [agents]
  );

  const openForm = (agent?: AgentRecord) => {
    if (agent) {
      setFormData({
        name: agent.name,
        persona: agent.persona,
        systemPrompt: agent.systemPrompt,
        status: agent.status,
      });
      setEditingAgentId(agent.id);
    } else {
      setFormData(emptyForm);
      setEditingAgentId(null);
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingAgentId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingAgentId) {
        await updateAgent(editingAgentId, formData);
      } else {
        await createAgent(formData);
      }
      closeForm();
    } catch (submitError) {
      console.error(submitError);
      setError("Não foi possível salvar o agente. Verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
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
          onClick={() => openForm()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + Novo Agente
        </motion.button>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

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
                onClick={closeForm}
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
                  id="systemPrompt"
                  name="systemPrompt"
                  placeholder="Instruções detalhadas para o comportamento do agente..."
                  value={formData.systemPrompt}
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
                  onClick={closeForm}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                  {editingAgentId ? "Salvar Alterações" : "Criar Agente"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className={styles.loadingState}>Carregando agentes...</div>
      ) : (
        <div className={styles.agentsGrid}>
          {orderedAgents.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhum agente cadastrado ainda.</p>
              <button className={styles.newAgentButton} onClick={() => openForm()}>
                Criar primeiro agente
              </button>
            </div>
          ) : (
            orderedAgents.map((agent) => (
              <motion.div
                key={agent.id}
                className={styles.agentCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, boxShadow: "var(--shadow-lg)" }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.agentHeader}>
                  <FiCpu className={styles.agentIcon} />
                  <div className={styles.agentInfo}>
                    <h3 className={styles.agentName}>{agent.name}</h3>
                    <span className={`${styles.statusBadge} ${getStatusClass(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
                <p className={styles.agentPersona}>{agent.persona}</p>
                <div className={styles.promptPreview}>
                  <span className={styles.statLabel}>Prompt de Sistema</span>
                  <p>{agent.systemPrompt || "Sem prompt definido."}</p>
                </div>
                <div className={styles.agentStats}>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Conversas</span>
                    <span className={styles.statValue}>{agent.conversationCount ?? 0}</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Criado em</span>
                    <span className={styles.statValue}>
                      {agent.createdAt
                        ? agent.createdAt.toLocaleDateString("pt-BR")
                        : "—"}
                    </span>
                  </div>
                </div>
                <div className={styles.agentActions}>
                  <button className={styles.actionButton} onClick={() => openForm(agent)}>
                    Editar
                  </button>
                  <button
                    className={styles.dangerButton}
                    onClick={() => handleDeleteAgent(agent.id)}
                  >
                    Excluir
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const handleDeleteAgent = async (agentId: string) => {
  const confirmed = window.confirm("Tem certeza que deseja excluir este agente?");
  if (!confirmed) {
    return;
  }
  try {
    await deleteAgent(agentId);
  } catch (err) {
    console.error(err);
    alert("Erro ao excluir agente. Tente novamente.");
  }
};

