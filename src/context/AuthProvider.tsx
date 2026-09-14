import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
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
import { ensureGuardianSession } from '../api/guardianAuth';
import { getMyGuardian } from '../api/guardians.api';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

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

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
    await ensureGuardianSession(email.split('@')[0], email, password);
    setGuardian(await getMyGuardianWithRetry(email));
    setSessionExpired(false);
  }

  async function register(name: string, email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password);
    await ensureGuardianSession(name, email, password);
    setGuardian(await getMyGuardianWithRetry(email));
    setSessionExpired(false);
  }

  async function logout() {
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
