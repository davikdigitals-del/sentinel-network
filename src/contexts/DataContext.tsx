import { createContext, useContext, useState, ReactNode } from "react";
import { mockPosts, emergencyAlerts, navSections, type Post } from "@/data/mockData";
import { useAuth } from "./AuthContext";

/* ── Media ────────────────────────────────────── */
export interface MediaItem {
  id: string;
  title: string;
  description: string;
  type: "podcast" | "video";
  duration: string;
  views: number;
  publishedAt: string;
  thumbnail?: string;
  url?: string;
  author: string;
  tags: string[];
}

/* ── Library ──────────────────────────────────── */
export interface LibraryItem {
  id: string;
  title: string;
  author: string;
  category: string;
  pages: number;
  format: string;
  description: string;
  fileUrl: string;
  coverColor: string;
}

/* ── Encyclopaedia ────────────────────────────── */
export interface EncEntry {
  id: string;
  title: string;
  letter: string;
  content: string;
}

/* ── Banner ───────────────────────────────────── */
export interface BannerSettings {
  enabled: boolean;
  text: string;
  priority: "high" | "medium" | "low";
}

/* ── Admin Post (extends Post) ────────────────── */
export type PostStatus = "published" | "draft" | "archived";
export interface AdminPost extends Post {
  status: PostStatus;
  body: string;
}

/* ── Context type ─────────────────────────────── */
interface DataContextType {
  posts: AdminPost[];
  setPosts: React.Dispatch<React.SetStateAction<AdminPost[]>>;
  alerts: typeof emergencyAlerts;
  setAlerts: React.Dispatch<React.SetStateAction<typeof emergencyAlerts>>;
  mediaItems: MediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  libraryItems: LibraryItem[];
  setLibraryItems: React.Dispatch<React.SetStateAction<LibraryItem[]>>;
  encEntries: EncEntry[];
  setEncEntries: React.Dispatch<React.SetStateAction<EncEntry[]>>;
  banner: BannerSettings;
  setBanner: React.Dispatch<React.SetStateAction<BannerSettings>>;
  publishedPosts: AdminPost[];
  incrementView: (postId: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

/* ── Initial data ─────────────────────────────── */
const initialPosts: AdminPost[] = mockPosts.map(p => ({ ...p, status: "published" as PostStatus, body: "" }));

const initialMedia: MediaItem[] = [
  { id: "v1", title: "Emergency Preparedness 101: Getting Started", description: "A beginner's guide to building your emergency preparedness plan from scratch.", type: "video", duration: "24:15", views: 12400, publishedAt: "2026-02-25", author: "Sarah Mitchell", tags: ["beginner", "planning"], url: "" },
  { id: "p1", title: "Survival Mindset: Building Mental Resilience", description: "Psychologist Dr. Rachel Green discusses mental preparedness strategies.", type: "podcast", duration: "45:30", views: 8900, publishedAt: "2026-02-24", author: "Dr. Rachel Green", tags: ["mental-health", "resilience"], url: "" },
  { id: "v2", title: "How to Build a 72-Hour Emergency Kit", description: "Step-by-step video guide to assembling the essential emergency kit.", type: "video", duration: "18:42", views: 23100, publishedAt: "2026-02-22", author: "Captain David Hughes", tags: ["kit", "essentials"], url: "" },
  { id: "p2", title: "NATO Civil Preparedness Explained", description: "Understanding what NATO's civilian readiness framework means for you.", type: "podcast", duration: "38:20", views: 6700, publishedAt: "2026-02-20", author: "James Crawford", tags: ["NATO", "policy"], url: "" },
  { id: "v3", title: "Water Purification Methods Demonstrated", description: "Practical demonstration of 5 water purification techniques.", type: "video", duration: "15:33", views: 31500, publishedAt: "2026-02-18", author: "Dr. Emily Rogers", tags: ["water", "purification"], url: "" },
  { id: "p3", title: "Community Resilience: Learning from Past Disasters", description: "Case studies of communities that thrived during crisis situations.", type: "podcast", duration: "52:10", views: 5400, publishedAt: "2026-02-15", author: "Tom Barrett", tags: ["community", "resilience"], url: "" },
];

const initialLibrary: LibraryItem[] = [
  { id: "lib1", title: "Complete Emergency Planning Guide", author: "Dr. Sarah Mitchell", category: "Emergency Planning", pages: 124, format: "PDF", description: "Comprehensive guide covering all aspects of emergency planning for families and communities.", fileUrl: "", coverColor: "bg-primary" },
  { id: "lib2", title: "Water Purification Methods & Storage", author: "James Crawford", category: "Water Safety", pages: 68, format: "PDF", description: "Everything you need to know about water purification, storage, and rationing during emergencies.", fileUrl: "", coverColor: "bg-info" },
  { id: "lib3", title: "First Aid Field Manual", author: "Dr. Mark Thompson", category: "First Aid", pages: 156, format: "PDF", description: "Military-grade first aid techniques adapted for civilian emergency use.", fileUrl: "", coverColor: "bg-alert" },
  { id: "lib4", title: "Urban Survival Handbook", author: "Captain David Hughes", category: "Urban Survival", pages: 210, format: "PDF", description: "Survival strategies specifically designed for urban environments during crisis situations.", fileUrl: "", coverColor: "bg-success" },
  { id: "lib5", title: "Emergency Communication Systems", author: "Tom Barrett", category: "Communication", pages: 92, format: "PDF", description: "Guide to alternative communication methods when digital infrastructure fails.", fileUrl: "", coverColor: "bg-warning" },
  { id: "lib6", title: "Food Storage & Rationing Guide", author: "Lisa Chen", category: "Food & Rations", pages: 88, format: "PDF", description: "How to build, maintain, and rotate food supplies for long-term survival.", fileUrl: "", coverColor: "bg-category-directives" },
  { id: "lib7", title: "Mental Health in Crisis Situations", author: "Dr. Rachel Green", category: "Mental Health", pages: 145, format: "PDF", description: "Psychological resilience strategies for maintaining mental health during emergencies.", fileUrl: "", coverColor: "bg-category-health" },
  { id: "lib8", title: "NATO Civil Preparedness Standards", author: "Helena Voss", category: "Official Documents", pages: 78, format: "PDF", description: "Simplified guide to NATO's civilian preparedness requirements and standards.", fileUrl: "", coverColor: "bg-category-directives" },
];

const initialEnc: EncEntry[] = [
  { id: "e1", title: "Ammunition Storage", letter: "A", content: "Safe storage practices for ammunition in emergency stockpiles." },
  { id: "e2", title: "Air Filtration", letter: "A", content: "Methods and devices for filtering air during chemical or biological events." },
  { id: "e3", title: "Bug-Out Bag", letter: "B", content: "A portable kit containing essential items for survival during evacuation." },
  { id: "e4", title: "Blackout Preparedness", letter: "B", content: "Steps to prepare for and survive extended power outages." },
  { id: "e5", title: "CPR Techniques", letter: "C", content: "Cardiopulmonary resuscitation methods for emergency first aid." },
  { id: "e6", title: "Communication Systems", letter: "C", content: "Alternative communication methods when normal infrastructure fails." },
  { id: "e7", title: "Decontamination", letter: "D", content: "Procedures for removing harmful substances from people and equipment." },
  { id: "e8", title: "Evacuation Planning", letter: "E", content: "Steps and strategies for planning safe evacuation routes." },
  { id: "e9", title: "EMP Protection", letter: "E", content: "Protecting electronic equipment from electromagnetic pulse events." },
  { id: "e10", title: "First Aid Kits", letter: "F", content: "Essential supplies and how to maintain a comprehensive first aid kit." },
  { id: "e11", title: "Fire Starting Methods", letter: "F", content: "Multiple techniques for starting fire in survival situations." },
  { id: "e12", title: "Generator Operation", letter: "G", content: "Safe operation and maintenance of emergency power generators." },
  { id: "e13", title: "Ham Radio", letter: "H", content: "Amateur radio communication systems for emergency situations." },
  { id: "e14", title: "Hypothermia", letter: "H", content: "Recognition, prevention, and treatment of hypothermia." },
  { id: "e15", title: "NATO Civil Preparedness", letter: "N", content: "Overview of NATO's framework for civilian emergency preparedness." },
  { id: "e16", title: "Nuclear Fallout", letter: "N", content: "Understanding and surviving nuclear fallout scenarios." },
  { id: "e17", title: "Shelter Building", letter: "S", content: "Techniques for constructing emergency shelters from available materials." },
  { id: "e18", title: "Solar Power", letter: "S", content: "Using solar energy systems for emergency power supply." },
  { id: "e19", title: "Water Purification", letter: "W", content: "Methods to purify water in emergency and survival situations." },
  { id: "e20", title: "Wound Care", letter: "W", content: "Emergency wound treatment and management techniques." },
];

/* ── Provider ─────────────────────────────────── */
export function DataProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<AdminPost[]>(initialPosts);
  const [alerts, setAlerts] = useState(emergencyAlerts.map(a => ({ ...a })));
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMedia);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(initialLibrary);
  const [encEntries, setEncEntries] = useState<EncEntry[]>(initialEnc);
  const [banner, setBanner] = useState<BannerSettings>({
    enabled: true,
    text: "ALERT: Power disruptions reported across Northern Europe — stay informed",
    priority: "high",
  });

  const publishedPosts = posts.filter(p => p.status === "published");

  const incrementView = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, viewCount: p.viewCount + 1 } : p));
  };

  return (
    <DataContext.Provider value={{
      posts, setPosts, alerts, setAlerts, mediaItems, setMediaItems,
      libraryItems, setLibraryItems, encEntries, setEncEntries,
      banner, setBanner, publishedPosts, incrementView,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be inside DataProvider");
  return ctx;
}
