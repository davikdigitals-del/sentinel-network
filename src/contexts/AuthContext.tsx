import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { natoCountries } from "@/data/mockData";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor" | "member";
  country: string;
  avatar?: string;
  joinedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "post" | "alert" | "system";
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  signup: (data: { email: string; password: string; name: string; country: string }) => Promise<boolean>;
  logout: () => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: "n1", title: "New Post Published", message: "UK Government Issues Updated Emergency Preparedness Guidelines", timestamp: new Date().toISOString(), read: false, type: "post" },
  { id: "n2", title: "Emergency Alert", message: "Power disruptions reported across Northern Europe", timestamp: new Date(Date.now() - 3600000).toISOString(), read: false, type: "alert" },
  { id: "n3", title: "New Guide Available", message: "How to Build a 14-Day Emergency Water Supply", timestamp: new Date(Date.now() - 7200000).toISOString(), read: false, type: "post" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);

  useEffect(() => {
    const stored = sessionStorage.getItem("ph_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const persistUser = (u: User | null) => {
    setUser(u);
    if (u) sessionStorage.setItem("ph_user", JSON.stringify(u));
    else sessionStorage.removeItem("ph_user");
  };

  const login = async (email: string, password: string) => {
    // Mock auth — replace with Lovable Cloud
    if (email && password.length >= 4) {
      persistUser({
        id: "member-1",
        email,
        name: email.split("@")[0],
        role: "member",
        country: "GB",
        joinedAt: new Date().toISOString(),
      });
      return true;
    }
    return false;
  };

  const adminLogin = async (email: string, password: string) => {
    // Mock admin auth — replace with Lovable Cloud + roles table
    if (email && password.length >= 4) {
      persistUser({
        id: "admin-1",
        email,
        name: "Admin",
        role: "admin",
        country: "GB",
        joinedAt: new Date().toISOString(),
      });
      return true;
    }
    return false;
  };

  const signup = async (data: { email: string; password: string; name: string; country: string }) => {
    if (data.email && data.password.length >= 4 && data.name) {
      persistUser({
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        role: "member",
        country: data.country,
        joinedAt: new Date().toISOString(),
      });
      return true;
    }
    return false;
  };

  const logout = () => persistUser(null);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, adminLogin, signup, logout, notifications, markNotificationRead, markAllNotificationsRead, unreadCount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
