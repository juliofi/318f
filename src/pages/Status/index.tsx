import { useMemo } from "react";
import type { ComponentType, CSSProperties } from "react";
import { FiCheckCircle, FiAlertTriangle, FiXCircle } from "react-icons/fi";
import styles from "./styles.module.css";

type StatusType = "operational" | "degraded" | "outage";

interface Service {
  id: number;
  name: string;
  description: string;
  status: StatusType;
  lastUpdated: string;
}

const services: Service[] = [
  {
    id: 1,
    name: "Captura de Leads",
    description: "Integrações com formulários, chatbots e landing pages.",
    status: "operational",
    lastUpdated: "Atualizado há 5 minutos",
  },
  {
    id: 2,
    name: "Automação de Fluxos",
    description: "Regras automáticas de nutrição e follow-up de contatos.",
    status: "operational",
    lastUpdated: "Atualizado há 12 minutos",
  },
  {
    id: 3,
    name: "Mensageria Omnicanal",
    description: "Envio e recebimento de mensagens via WhatsApp, Instagram e e-mail.",
    status: "degraded",
    lastUpdated: "Instabilidade detectada às 10h20",
  },
  {
    id: 4,
    name: "Análises e Relatórios",
    description: "Painéis de performance, funil de vendas e métricas de atendimento.",
    status: "operational",
    lastUpdated: "Atualizado há 18 minutos",
  },
  {
    id: 5,
    name: "Treinamento de Agentes IA",
    description: "Criação e ajuste de agentes assistidos por IA.",
    status: "outage",
    lastUpdated: "Manutenção corretiva iniciada às 09h50",
  },
  {
    id: 6,
    name: "Integrações Externas",
    description: "Conexões com CRM, ERP e plataformas de anúncios.",
    status: "operational",
    lastUpdated: "Atualizado há 7 minutos",
  },
];

type StatusIconComponent = ComponentType<{ className?: string; style?: CSSProperties }>;

type StatusConfig = {
  label: string;
  color: string;
  Icon: StatusIconComponent;
  summaryClass: string;
};

const statusConfig: Record<StatusType, StatusConfig> = {
  operational: {
    label: "Operacional",
    Icon: FiCheckCircle,
    color: "#2e7d32",
    summaryClass: styles.summaryOperational,
  },
  degraded: {
    label: "Instabilidade",
    Icon: FiAlertTriangle,
    color: "#f57f17",
    summaryClass: styles.summaryDegraded,
  },
  outage: {
    label: "Indisponível",
    Icon: FiXCircle,
    color: "#c62828",
    summaryClass: styles.summaryOutage,
  },
};

export default function StatusPage() {
  const overallStatus = useMemo(() => {
    if (services.some((service) => service.status === "outage")) return "outage";
    if (services.some((service) => service.status === "degraded")) return "degraded";
    return "operational";
  }, []);

  const summary = statusConfig[overallStatus];

  const lastUpdated = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <section className={`${styles.summaryCard} ${summary.summaryClass}`}>
          <summary.Icon className={styles.summaryIcon} style={{ color: summary.color }} />
          <div>
            <h1 className={styles.summaryTitle}>
              {overallStatus === "operational"
                ? "Todos os sistemas operacionais"
                : overallStatus === "degraded"
                ? "Algumas funcionalidades com instabilidade"
                : "Serviços críticos indisponíveis"}
            </h1>
            <p className={styles.summaryDescription}>Última atualização às {lastUpdated}</p>
          </div>
        </section>

        <section className={styles.servicesCard}>
          <header className={styles.servicesHeader}>
            <h2>Status das funcionalidades</h2>
            <span>{services.length} serviços monitorados</span>
          </header>

          <ul className={styles.servicesList}>
            {services.map((service) => {
              const config = statusConfig[service.status];
              const StatusIcon = config.Icon;

              return (
                <li key={service.id} className={styles.serviceItem}>
                  <div className={styles.serviceInfo}>
                    <button type="button" className={styles.expandButton} aria-label="Detalhes">
                      +
                    </button>
                    <div>
                      <p className={styles.serviceName}>{service.name}</p>
                      <p className={styles.serviceDescription}>{service.description}</p>
                    </div>
                  </div>
                  <div className={styles.serviceStatus}>
                    <StatusIcon className={styles.statusIcon} style={{ color: config.color }} />
                    <span className={styles.statusLabel} style={{ color: config.color }}>
                      {config.label}
                    </span>
                    <span className={styles.statusMeta}>{service.lastUpdated}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

