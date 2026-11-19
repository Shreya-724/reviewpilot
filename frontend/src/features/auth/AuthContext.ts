import { createContext } from "react";

import type { Credentials, RegisterPayload } from "../../api/auth";
import type { User } from "../../types/api";

export interface AuthContextValue {
  user: User | null;
  /** True until the startup "am I already logged in?" check finishes. */
  isLoading: boolean;
  signIn: (credentials: Credentials) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);