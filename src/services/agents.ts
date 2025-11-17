import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "./firebase";

export type AgentStatus = "ativo" | "treinando" | "inativo";

export interface AgentRecord {
  id: string;
  name: string;
  persona: string;
  systemPrompt: string;
  status: AgentStatus;
  conversationCount: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

const agentsCollection = collection(firestore, "agents");

export const subscribeToAgents = (
  onData: (agents: AgentRecord[]) => void,
  onError: (error: Error) => void
) => {
  const q = query(agentsCollection, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const parsedAgents = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name ?? "",
          persona: data.persona ?? "",
          systemPrompt: data.systemPrompt ?? "",
          status: (data.status ?? "inativo") as AgentStatus,
          conversationCount: data.conversationCount ?? 0,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : null,
        } satisfies AgentRecord;
      });

      onData(parsedAgents);
    },
    (error) => {
      onError(error);
    }
  );

  return unsubscribe;
};

interface AgentPayload {
  name: string;
  persona: string;
  systemPrompt: string;
  status: AgentStatus;
}

export const createAgent = async (payload: AgentPayload) => {
  await addDoc(agentsCollection, {
    ...payload,
    conversationCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateAgent = async (id: string, payload: AgentPayload) => {
  const agentRef = doc(agentsCollection, id);
  await updateDoc(agentRef, {
    ...payload,
    updatedAt: serverTimestamp(),
  });
};

export const deleteAgent = async (id: string) => {
  const agentRef = doc(agentsCollection, id);
  await deleteDoc(agentRef);
};

