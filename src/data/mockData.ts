export interface NavSection {
  title: string;
  slug: string;
  color: string;
  categories: { title: string; slug: string }[];
  tools?: { title: string; slug: string }[];
  featured?: { title: string; slug: string; image?: string }[];
}

export const navSections: NavSection[] = [
  {
    title: "Emergency News",
    slug: "emergency-news",
    color: "category-emergency",
    categories: [
      { title: "UK Alerts", slug: "uk-alerts" },
      { title: "NATO Updates", slug: "nato-updates" },
      { title: "Global Situation", slug: "global-situation" },
      { title: "Infrastructure Disruptions", slug: "infrastructure" },
    ],
    tools: [
      { title: "Emergency Checklist", slug: "emergency-checklist" },
      { title: "Alert Map", slug: "alert-map" },
    ],
  },
  {
    title: "Survival Guides",
    slug: "survival-guides",
    color: "category-survival",
    categories: [
      { title: "Emergency Planning", slug: "emergency-planning" },
      { title: "Evacuation & Shelter", slug: "evacuation-shelter" },
      { title: "Home Preparation", slug: "home-preparation" },
      { title: "Urban Survival", slug: "urban-survival" },
      { title: "Rural Survival", slug: "rural-survival" },
    ],
    tools: [
      { title: "72-Hour Kit Builder", slug: "kit-builder" },
      { title: "Offline Survival Pack", slug: "offline-pack" },
    ],
  },
  {
    title: "Health & Vaccination",
    slug: "health",
    color: "category-health",
    categories: [
      { title: "Children", slug: "children" },
      { title: "Adults", slug: "adults" },
      { title: "Elderly", slug: "elderly" },
      { title: "First Aid", slug: "first-aid" },
      { title: "Mental Health", slug: "mental-health" },
    ],
  },
  {
    title: "Official Directives",
    slug: "directives",
    color: "category-directives",
    categories: [
      { title: "UK Ministry of Defence", slug: "uk-mod" },
      { title: "NATO Civil Preparedness", slug: "nato-civil" },
      { title: "EU Civil Protection", slug: "eu-civil" },
      { title: "Red Cross Guidance", slug: "red-cross" },
    ],
  },
  {
    title: "Essential Supplies",
    slug: "supplies",
    color: "category-supplies",
    categories: [
      { title: "Water", slug: "water" },
      { title: "Food & Rations", slug: "food-rations" },
      { title: "Medical & Medicines", slug: "medical" },
      { title: "Power & Light", slug: "power-light" },
      { title: "Communication & Safety", slug: "communication" },
      { title: "Clothing & Shelter", slug: "clothing-shelter" },
      { title: "Hygiene & Sanitation", slug: "hygiene" },
    ],
  },
  {
    title: "Resources",
    slug: "resources",
    color: "category-resources",
    categories: [
      { title: "Checklists", slug: "checklists" },
      { title: "Templates", slug: "templates" },
      { title: "Schedules", slug: "schedules" },
      { title: "Downloads", slug: "downloads" },
    ],
  },
  {
    title: "Education",
    slug: "education",
    color: "category-education",
    categories: [
      { title: "Courses", slug: "courses" },
      { title: "Training Programmes", slug: "training" },
      { title: "Workshops", slug: "workshops" },
    ],
  },
  {
    title: "Community",
    slug: "community",
    color: "category-community",
    categories: [
      { title: "Local Feed", slug: "local-feed" },
      { title: "Questions", slug: "questions" },
      { title: "Groups", slug: "groups" },
    ],
  },
];

export interface Post {
  id: string;
  title: string;
  standfirst: string;
  section: string;
  category: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  image: string;
  tags: string[];
  viewCount: number;
  readTime: string;
  isPinned?: boolean;
}

export const mockPosts: Post[] = [
  {
    id: "1",
    title: "UK Government Issues Updated Emergency Preparedness Guidelines for 2026",
    standfirst: "New comprehensive guidelines cover household preparedness, communication plans, and community resilience strategies across all regions.",
    section: "emergency-news",
    category: "uk-alerts",
    author: "Sarah Mitchell",
    publishedAt: "2026-02-27T08:00:00Z",
    image: "",
    tags: ["UK", "preparedness", "government", "guidelines"],
    viewCount: 12450,
    readTime: "6 min",
    isPinned: true,
  },
  {
    id: "2",
    title: "NATO Resilience Committee Announces New Civil Preparedness Framework",
    standfirst: "The framework establishes minimum preparedness standards for all member states, focusing on critical infrastructure protection.",
    section: "emergency-news",
    category: "nato-updates",
    author: "James Crawford",
    publishedAt: "2026-02-26T14:30:00Z",
    image: "",
    tags: ["NATO", "resilience", "framework", "infrastructure"],
    viewCount: 8920,
    readTime: "8 min",
  },
  {
    id: "3",
    title: "How to Build a 14-Day Emergency Water Supply for Your Family",
    standfirst: "Step-by-step guide to calculating, storing, and rotating water supplies for families of all sizes.",
    section: "survival-guides",
    category: "home-preparation",
    author: "Dr. Emily Rogers",
    publishedAt: "2026-02-25T10:00:00Z",
    image: "",
    tags: ["water", "storage", "family", "guide"],
    viewCount: 23100,
    readTime: "12 min",
  },
  {
    id: "4",
    title: "Essential First Aid Skills Every Household Member Should Know",
    standfirst: "From CPR to wound management — the critical skills that could save lives during an emergency when professional help is delayed.",
    section: "health",
    category: "first-aid",
    author: "Dr. Mark Thompson",
    publishedAt: "2026-02-24T09:00:00Z",
    image: "",
    tags: ["first-aid", "CPR", "training", "essential"],
    viewCount: 18700,
    readTime: "10 min",
  },
  {
    id: "5",
    title: "Power Grid Disruption Reported Across Northern Europe",
    standfirst: "Multiple countries report intermittent power outages affecting critical services. Authorities urge calm and provide guidance.",
    section: "emergency-news",
    category: "infrastructure",
    author: "Anna Kowalski",
    publishedAt: "2026-02-27T06:15:00Z",
    image: "",
    tags: ["power", "grid", "Europe", "infrastructure", "breaking"],
    viewCount: 45200,
    readTime: "4 min",
    isPinned: true,
  },
  {
    id: "6",
    title: "Urban Evacuation Routes: Planning Your Exit Strategy",
    standfirst: "Understanding how to identify, plan, and practise evacuation routes in dense urban environments.",
    section: "survival-guides",
    category: "urban-survival",
    author: "Captain David Hughes",
    publishedAt: "2026-02-23T11:00:00Z",
    image: "",
    tags: ["evacuation", "urban", "routes", "planning"],
    viewCount: 15600,
    readTime: "9 min",
  },
  {
    id: "7",
    title: "Red Cross Updates Emergency Shelter Guidelines for Winter",
    standfirst: "Revised guidelines address heating, insulation, and sanitation in temporary shelters during cold weather operations.",
    section: "directives",
    category: "red-cross",
    author: "Helena Voss",
    publishedAt: "2026-02-22T08:30:00Z",
    image: "",
    tags: ["Red Cross", "shelter", "winter", "guidelines"],
    viewCount: 9800,
    readTime: "7 min",
  },
  {
    id: "8",
    title: "Complete Guide to Emergency Communication Without Internet",
    standfirst: "From ham radio to mesh networks — reliable communication methods when digital infrastructure fails.",
    section: "supplies",
    category: "communication",
    author: "Tom Barrett",
    publishedAt: "2026-02-21T13:00:00Z",
    image: "",
    tags: ["communication", "radio", "mesh", "offline"],
    viewCount: 31400,
    readTime: "15 min",
  },
  {
    id: "9",
    title: "Mental Health Resilience: Preparing Your Mind for Crisis",
    standfirst: "Psychological preparedness is as important as physical. Strategies for managing stress, anxiety, and decision-making under pressure.",
    section: "health",
    category: "mental-health",
    author: "Dr. Rachel Green",
    publishedAt: "2026-02-20T10:00:00Z",
    image: "",
    tags: ["mental-health", "resilience", "stress", "psychology"],
    viewCount: 14200,
    readTime: "11 min",
  },
  {
    id: "10",
    title: "Long-Term Food Storage: A Comprehensive Rations Guide",
    standfirst: "How to build, maintain, and rotate a food supply that can sustain your family for 30 days or more.",
    section: "supplies",
    category: "food-rations",
    author: "Lisa Chen",
    publishedAt: "2026-02-19T09:00:00Z",
    image: "",
    tags: ["food", "storage", "rations", "long-term"],
    viewCount: 27800,
    readTime: "14 min",
  },
];

export const emergencyAlerts = [
  { id: "a1", text: "ALERT: Power disruptions reported across Northern Europe — stay informed", priority: "high" as const, timestamp: "2026-02-27T06:15:00Z" },
  { id: "a2", text: "UK Met Office: Severe weather warning for Scotland and Northern England", priority: "medium" as const, timestamp: "2026-02-27T05:00:00Z" },
  { id: "a3", text: "NATO Civil Readiness: Updated preparedness recommendations published", priority: "low" as const, timestamp: "2026-02-26T14:30:00Z" },
];

export const natoCountries = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "TR", name: "Türkiye", flag: "🇹🇷" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹" },
  { code: "LV", name: "Latvia", flag: "🇱🇻" },
  { code: "EE", name: "Estonia", flag: "🇪🇪" },
  { code: "AL", name: "Albania", flag: "🇦🇱" },
  { code: "ME", name: "Montenegro", flag: "🇲🇪" },
  { code: "MK", name: "North Macedonia", flag: "🇲🇰" },
  { code: "IS", name: "Iceland", flag: "🇮🇸" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
];

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

export function getSectionColor(slug: string): string {
  const section = navSections.find(s => s.slug === slug);
  return section?.color || "category-emergency";
}
