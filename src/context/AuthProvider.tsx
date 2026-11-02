import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import { auth } from '../config/firebase';
import { onSessionExpired } from '../api/client';
import { ensureGuardianSession } from '../api/guardianAuth';
import { getMyGuardian } from '../api/guardians.api';
import { wakeJavaApi } from '../api/health.api';
import { cancelAllAppointmentReminders } from '../services/appointmentReminders';

import type { GuardianDTO } from '../types/api.types';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getMyGuardianWithRetry(email: string): Promise<GuardianDTO> {
  try {
    return await getMyGuardian(email);
  } catch {
    await delay(1000);
    return getMyGuardian(email);
  }
}

interface AuthContextData {
  user: User | null;
  guardian: GuardianDTO | null;
  isLoading: boolean;
  sessionExpired: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [guardian, setGuardian] = useState<GuardianDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Enquanto login/cadastro estão em andamento, a sessão da API Java ainda não
  // existe: o aviso do Firebase (onAuthStateChanged) e os redirecionamentos para
  // /login nesse meio-tempo não significam sessão expirada
  const authInProgress = useRef(false);

  // Sessão da API Java perdida (servidor reiniciou): volta para o login com o
  // aviso "Sua sessão expirou", em vez de deixar as telas quebrarem
  useEffect(
    () =>
      onSessionExpired(() => {
        if (!authInProgress.current) setSessionExpired(true);
      }),
    [],
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      // login()/register() buscam o tutor depois de abrir a sessão na API Java
      if (authInProgress.current) {
        setIsLoading(false);
        return;
      }

      if (firebaseUser?.email) {
        try {
          const me = await getMyGuardian(firebaseUser.email);
          setGuardian(me);
          setSessionExpired(false);
        } catch {
          setGuardian(null);
          setSessionExpired(true);
        }
      } else {
        setGuardian(null);
        setSessionExpired(false);
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  async function openSession(action: () => Promise<void>) {
    authInProgress.current = true;
    try {
      await action();
      setSessionExpired(false);
    } finally {
      authInProgress.current = false;
    }
  }

  function login(email: string, password: string) {
    return openSession(async () => {
      await signInWithEmailAndPassword(auth, email, password);
      await wakeJavaApi();
      await ensureGuardianSession(email.split('@')[0], email, password);
      setGuardian(await getMyGuardianWithRetry(email));
    });
  }

  function register(name: string, email: string, password: string) {
    return openSession(async () => {
      await createUserWithEmailAndPassword(auth, email, password);
      await wakeJavaApi();
      await ensureGuardianSession(name, email, password);
      setGuardian(await getMyGuardianWithRetry(email));
    });
  }

  async function logout() {
    await cancelAllAppointmentReminders().catch(() => {});
    await signOut(auth);
    setGuardian(null);
    setSessionExpired(false);
  }

  return (
    <AuthContext.Provider
      value={{ user, guardian, isLoading, sessionExpired, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
