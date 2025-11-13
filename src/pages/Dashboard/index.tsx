import { motion } from "framer-motion";
import { FiUsers, FiCpu, FiMessageSquare, FiCheckCircle } from "react-icons/fi";
import type { ComponentType, SVGProps } from "react";
import styles from "./styles.module.css";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

const metrics: Array<{
  id: number;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  Icon: IconType;
}> = [
  {
    id: 1,
    title: "Clientes Ativos",
    value: "1,234",
    change: "+12%",
    trend: "up",
    Icon: FiUsers,
  },
  {
    id: 2,
    title: "Tokens Consumidos",
    value: "45.2K",
    change: "+8%",
    trend: "up",
    Icon: FiCpu,
  },
  {
    id: 3,
    title: "Conversas Hoje",
    value: "89",
    change: "+23%",
    trend: "up",
    Icon: FiMessageSquare,
  },
  {
    id: 4,
    title: "Taxa de Resolução",
    value: "94%",
    change: "+2%",
    trend: "up",
    Icon: FiCheckCircle,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  return (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Visão geral do seu negócio</p>
      </div>

      <div className={styles.metricsGrid}>
        {metrics.map((metric) => (
          <motion.div
            key={metric.id}
            className={styles.metricCard}
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: "var(--shadow-lg)" }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.metricHeader}>
              <span className={styles.metricIcon}>
                <metric.Icon />
              </span>
              <span
                className={`${styles.metricChange} ${
                  metric.trend === "up" ? styles.metricChangeUp : styles.metricChangeDown
                }`}
              >
                {metric.change}
              </span>
            </div>
            <h3 className={styles.metricTitle}>{metric.title}</h3>
            <p className={styles.metricValue}>{metric.value}</p>
          </motion.div>
        ))}
      </div>

      <div className={styles.chartsSection}>
        <motion.div
          className={styles.chartCard}
          variants={itemVariants}
          whileHover={{ boxShadow: "var(--shadow-lg)" }}
        >
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>Atividade Mensal</h2>
            <select className={styles.chartFilter}>
              <option>Últimos 30 dias</option>
              <option>Últimos 7 dias</option>
              <option>Últimos 90 dias</option>
            </select>
          </div>
          <div className={styles.chartPlaceholder}>
            <div className={styles.chartBars}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={styles.chartBar}
                  style={{
                    height: `${Math.random() * 60 + 20}%`,
                  }}
                />
              ))}
            </div>
            <div className={styles.chartLabels}>
              {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map(
                (label) => (
                  <span key={label} className={styles.chartLabel}>
                    {label}
                  </span>
                )
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.chartCard}
          variants={itemVariants}
          whileHover={{ boxShadow: "var(--shadow-lg)" }}
        >
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>Canais de Atendimento</h2>
          </div>
          <div className={styles.pieChartPlaceholder}>
            <div className={styles.pieChart}>
              <div className={styles.pieSegment} style={{ "--percentage": "45%" } as React.CSSProperties}>
                <span>WhatsApp</span>
              </div>
              <div className={styles.pieSegment} style={{ "--percentage": "30%" } as React.CSSProperties}>
                <span>Instagram</span>
              </div>
              <div className={styles.pieSegment} style={{ "--percentage": "15%" } as React.CSSProperties}>
                <span>E-mail</span>
              </div>
              <div className={styles.pieSegment} style={{ "--percentage": "10%" } as React.CSSProperties}>
                <span>Outros</span>
              </div>
            </div>
            <div className={styles.pieLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: "var(--color-primary)" }} />
                <span>WhatsApp - 45%</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: "var(--color-secondary)" }} />
                <span>Instagram - 30%</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: "var(--color-success)" }} />
                <span>E-mail - 15%</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: "var(--color-gray)" }} />
                <span>Outros - 10%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

