import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/services/firebase";
import styles from "./styles.module.css";

export default function AuthPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const isAuthConfigured = Boolean(auth);
  const [errorMessage, setErrorMessage] = useState(
    isAuthConfigured
      ? ""
      : "Firebase não configurado. Defina as variáveis VITE_FIREBASE_* e recarregue.",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!auth) {
      setErrorMessage(
        "Firebase não configurado. Defina as variáveis VITE_FIREBASE_* e recarregue.",
      );
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao autenticar:", error);
      setErrorMessage("Não foi possível entrar. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage("");

    if (!auth) {
      setErrorMessage(
        "Firebase não configurado. Defina as variáveis VITE_FIREBASE_* e recarregue.",
      );
      return;
    }

    setIsLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao autenticar com Google:", error);
      setErrorMessage("Não foi possível entrar com Google. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.loginCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className={styles.logo}>uHunter</h1>
        <motion.form
          className={styles.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <div className={styles.inputGroup}>
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="login-password">Senha</label>
            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || !isAuthConfigured}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </motion.form>
        
        <div className={styles.divider}>
          <span>ou</span>
        </div>

        <button
          type="button"
          className={styles.googleButton}
          onClick={handleGoogleSignIn}
          disabled={isLoading || !isAuthConfigured}
        >
          <FcGoogle className={styles.googleIcon} />
          <span>{isLoading ? "Conectando..." : "Entrar com Google"}</span>
        </button>
      </motion.div>
    </div>
  );
}

