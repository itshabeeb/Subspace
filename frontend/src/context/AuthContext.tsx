import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type UserRole = "admin" | "customer";

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem("subspace_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (userData: User, token?: string) => {
    setUser(userData);
    localStorage.setItem("subspace_user", JSON.stringify(userData));

    if (token) {
      localStorage.setItem("subspace_access_token", token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("subspace_user");
    localStorage.removeItem("subspace_access_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}