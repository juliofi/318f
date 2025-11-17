import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import CRM from "./pages/CRM";
import Chat from "./pages/Chat";
import Agents from "./pages/Agents";
import TestAgent from "./pages/TestAgent";
import Settings from "./pages/Settings";
import Status from "./pages/Status";

export default function App() {
  // Mock: permitindo acesso direto às páginas para desenvolvimento
  // Em produção, isso seria controlado por um contexto de autenticação

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/status" element={<Status />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agents/test/:agentId" element={<TestAgent />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
