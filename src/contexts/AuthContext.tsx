import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "member";
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
  loading: boolean;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const buildUser = async (supaUser: SupabaseUser): Promise<User | null> => {
    // Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", supaUser.id)
      .maybeSingle();

    // Fetch roles
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", supaUser.id);

    const isAdmin = roles?.some(r => r.role === "admin") || false;

    return {
      id: supaUser.id,
      email: supaUser.email || "",
      name: profile?.name || supaUser.email?.split("@")[0] || "",
      role: isAdmin ? "admin" : "member",
      country: profile?.country || "GB",
      avatar: profile?.avatar_url || undefined,
      joinedAt: profile?.created_at || supaUser.created_at,
    };
  };

  const fetchNotifications = async (userId: string) => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .or(`user_id.eq.${userId},user_id.is.null`)
      .order("timestamp", { ascending: false })
      .limit(20);

    if (data) {
      setNotifications(data.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        timestamp: n.timestamp,
        read: n.read || false,
        type: (n.type as "post" | "alert" | "system") || "system",
      })));
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const u = await buildUser(session.user);
        setUser(u);
        fetchNotifications(session.user.id);
      } else {
        setUser(null);
        setNotifications([]);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const u = await buildUser(session.user);
        setUser(u);
        fetchNotifications(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Realtime notifications
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        const n = payload.new as any;
        if (n.user_id === user.id || n.user_id === null) {
          setNotifications(prev => [{
            id: n.id, title: n.title, message: n.message,
            timestamp: n.timestamp, read: n.read || false,
            type: n.type || "system",
          }, ...prev]);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  };

  const adminLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return false;
    // Check admin role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    const isAdmin = roles?.some(r => r.role === "admin") || false;
    if (!isAdmin) {
      await supabase.auth.signOut();
      return false;
    }
    return true;
  };

  const signup = async (data: { email: string; password: string; name: string; country: string }) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name, country: data.country },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return false;
    // Update profile country after signup
    // The trigger creates the profile, we just need to update country
    setTimeout(async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session.session?.user) {
        await supabase
          .from("profiles")
          .update({ country: data.country, name: data.name })
          .eq("user_id", session.session.user.id);
      }
    }, 1000);
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setNotifications([]);
  };

  const markNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (user) {
      await supabase.from("notifications").update({ read: true }).or(`user_id.eq.${user.id},user_id.is.null`);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, adminLogin, signup, logout, notifications, markNotificationRead, markAllNotificationsRead, unreadCount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
