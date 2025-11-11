import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./styles.module.css";

export default function Settings() {
  const [settings, setSettings] = useState({
    theme: "light",
    notifications: true,
    emailNotifications: true,
    pushNotifications: false,
    apiKey: "",
    webhookUrl: "",
    gmailAccount: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock - apenas previne submit padrão
    console.log("Configurações salvas:", settings);
    alert("Configurações salvas com sucesso!");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Configurações</h1>
        <p className={styles.subtitle}>Gerencie suas preferências e integrações</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <motion.section
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className={styles.sectionTitle}>Preferências Gerais</h2>
          <div className={styles.sectionContent}>
            <div className={styles.inputGroup}>
              <label htmlFor="theme">Tema</label>
              <select
                id="theme"
                name="theme"
                value={settings.theme}
                onChange={handleInputChange}
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>
          </div>
        </motion.section>

        <motion.section
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className={styles.sectionTitle}>Notificações</h2>
          <div className={styles.sectionContent}>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                <span>Ativar notificações</span>
              </label>
            </div>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                <span>Notificações por e-mail</span>
              </label>
            </div>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="pushNotifications"
                  checked={settings.pushNotifications}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                <span>Notificações push</span>
              </label>
            </div>
          </div>
        </motion.section>

        <motion.section
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className={styles.sectionTitle}>Conexões e Integrações</h2>
          <div className={styles.sectionContent}>
            <div className={styles.inputGroup}>
              <label htmlFor="apiKey">API Key</label>
              <input
                id="apiKey"
                type="password"
                name="apiKey"
                placeholder="sk-..."
                value={settings.apiKey}
                onChange={handleInputChange}
                className={styles.input}
              />
              <p className={styles.inputHint}>
                Sua chave de API para integração com serviços externos
              </p>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="webhookUrl">Webhook URL</label>
              <input
                id="webhookUrl"
                type="url"
                name="webhookUrl"
                placeholder="https://exemplo.com/webhook"
                value={settings.webhookUrl}
                onChange={handleInputChange}
                className={styles.input}
              />
              <p className={styles.inputHint}>
                URL para receber eventos e notificações em tempo real
              </p>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="gmailAccount">Conta Gmail</label>
              <input
                id="gmailAccount"
                type="email"
                name="gmailAccount"
                placeholder="seu@email.com"
                value={settings.gmailAccount}
                onChange={handleInputChange}
                className={styles.input}
              />
              <p className={styles.inputHint}>
                E-mail para integração com Gmail (requer autenticação OAuth)
              </p>
            </div>
          </div>
        </motion.section>

        <motion.div
          className={styles.formActions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button type="button" className={styles.cancelButton}>
            Cancelar
          </button>
          <button type="submit" className={styles.submitButton}>
            Salvar Configurações
          </button>
        </motion.div>
      </form>
    </div>
  );
}

