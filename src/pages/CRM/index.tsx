import { useState } from "react";
import { motion } from "framer-motion";
import { FiMessageCircle, FiInstagram, FiMail } from "react-icons/fi";
import type { ComponentType, SVGProps } from "react";
import styles from "./styles.module.css";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "ativo" | "inativo" | "prospecto";
  lastContact: string;
  channel: "whatsapp" | "instagram" | "email";
}

const mockContacts: Contact[] = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@example.com",
    phone: "(11) 98765-4321",
    company: "Tech Corp",
    status: "ativo",
    lastContact: "2024-01-15",
    channel: "whatsapp",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@example.com",
    phone: "(11) 91234-5678",
    company: "Design Studio",
    status: "prospecto",
    lastContact: "2024-01-14",
    channel: "instagram",
  },
  {
    id: 3,
    name: "Pedro Oliveira",
    email: "pedro@example.com",
    phone: "(11) 99876-5432",
    company: "Marketing Plus",
    status: "ativo",
    lastContact: "2024-01-15",
    channel: "email",
  },
  {
    id: 4,
    name: "Ana Costa",
    email: "ana@example.com",
    phone: "(11) 97654-3210",
    company: "StartupXYZ",
    status: "inativo",
    lastContact: "2024-01-10",
    channel: "whatsapp",
  },
  {
    id: 5,
    name: "Carlos Mendes",
    email: "carlos@example.com",
    phone: "(11) 94567-8901",
    company: "Innovation Lab",
    status: "ativo",
    lastContact: "2024-01-15",
    channel: "whatsapp",
  },
];

const mockConversations = [
  {
    id: 1,
    date: "2024-01-15 14:30",
    channel: "whatsapp",
    message: "Olá! Gostaria de saber mais sobre os planos disponíveis.",
    type: "received",
  },
  {
    id: 2,
    date: "2024-01-15 14:32",
    channel: "whatsapp",
    message: "Claro! Vou enviar as informações detalhadas.",
    type: "sent",
  },
  {
    id: 3,
    date: "2024-01-15 14:35",
    channel: "whatsapp",
    message: "Perfeito, obrigado!",
    type: "received",
  },
];

const channelIcons: Record<Contact["channel"], IconType> = {
  whatsapp: FiMessageCircle,
  instagram: FiInstagram,
  email: FiMail,
};

export default function CRM() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = mockContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case "ativo":
        return styles.statusActive;
      case "prospecto":
        return styles.statusProspect;
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
          <h1 className={styles.title}>CRM Interno</h1>
          <p className={styles.subtitle}>Gerencie seus contatos e relacionamentos</p>
        </div>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Buscar contatos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h2 className={styles.sectionTitle}>Contatos</h2>
            <button className={styles.addButton}>+ Novo Contato</button>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Empresa</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Canal</th>
                  <th>Status</th>
                  <th>Último Contato</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => {
                  const ChannelIcon = channelIcons[contact.channel];
                  return (
                    <motion.tr
                      key={contact.id}
                      className={`${styles.tableRow} ${
                        selectedContact?.id === contact.id ? styles.tableRowSelected : ""
                      }`}
                      onClick={() => setSelectedContact(contact)}
                      whileHover={{ backgroundColor: "var(--color-surface)" }}
                      transition={{ duration: 0.1 }}
                    >
                      <td className={styles.tableCell}>{contact.name}</td>
                      <td className={styles.tableCell}>{contact.company}</td>
                      <td className={styles.tableCell}>{contact.email}</td>
                      <td className={styles.tableCell}>{contact.phone}</td>
                      <td className={styles.tableCell}>
                        <span className={styles.channelBadge}>
                          <ChannelIcon />
                          {contact.channel}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        <span className={`${styles.statusBadge} ${getStatusClass(contact.status)}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className={styles.tableCell}>{contact.lastContact}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {selectedContact && (
          <motion.div
            className={styles.detailsSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.detailsHeader}>
              <h2 className={styles.detailsTitle}>Detalhes do Cliente</h2>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedContact(null)}
              >
                ×
              </button>
            </div>

            <div className={styles.detailsContent}>
              <div className={styles.detailsGroup}>
                <h3 className={styles.detailsGroupTitle}>Informações Básicas</h3>
                <div className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Nome:</span>
                  <span className={styles.detailsValue}>{selectedContact.name}</span>
                </div>
                <div className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>E-mail:</span>
                  <span className={styles.detailsValue}>{selectedContact.email}</span>
                </div>
                <div className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Telefone:</span>
                  <span className={styles.detailsValue}>{selectedContact.phone}</span>
                </div>
                <div className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Empresa:</span>
                  <span className={styles.detailsValue}>{selectedContact.company}</span>
                </div>
                <div className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Status:</span>
                  <span className={`${styles.statusBadge} ${getStatusClass(selectedContact.status)}`}>
                    {selectedContact.status}
                  </span>
                </div>
              </div>

              <div className={styles.detailsGroup}>
                <h3 className={styles.detailsGroupTitle}>Histórico de Conversas</h3>
                <div className={styles.conversationsList}>
                  {mockConversations.map((conversation) => {
                    const ChannelIcon = channelIcons[conversation.channel];
                    return (
                      <div
                        key={conversation.id}
                        className={`${styles.conversationItem} ${
                          conversation.type === "sent" ? styles.conversationSent : styles.conversationReceived
                        }`}
                      >
                        <div className={styles.conversationHeader}>
                          <span className={styles.conversationChannel}>
                            <ChannelIcon /> {conversation.channel}
                          </span>
                          <span className={styles.conversationDate}>{conversation.date}</span>
                        </div>
                        <p className={styles.conversationMessage}>{conversation.message}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

