/**
 * adminStore.ts
 * Single source of truth for all admin overrides.
 * Written by AdminDashboard, read by the real app at runtime.
 */

export const ADMIN_STORE_KEY    = 'abc_admin_v2';
export const ADMIN_STATS_KEY    = 'abc_admin_stats_v1';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface AdminTopicOverride {
  id: string;
  suspended?: boolean;
  featured?: boolean;
  title?: string;
  emoji?: string;
  image?: string;
  category?: string;
}

export interface AdminSettings {
  maintenanceMode: boolean;
  guestQuizAccess: boolean;
  siteName: string;
}

export interface AdminStore {
  overrides: Record<string, AdminTopicOverride>;
  deletedIds: string[];
  settings: AdminSettings;
}

export interface AdminStats {
  views: Record<string, number>;
  quizAttempts: Record<string, number>;
}

// ── Defaults ──────────────────────────────────────────────────────────────────
export const DEFAULT_SETTINGS: AdminSettings = {
  maintenanceMode: false,
  guestQuizAccess: true,
  siteName: 'ABC of Islam',
};

const DEFAULT_STORE: AdminStore = {
  overrides: {},
  deletedIds: [],
  settings: DEFAULT_SETTINGS,
};

// ── Read / Write ──────────────────────────────────────────────────────────────
export function readAdminStore(): AdminStore {
  try {
    const raw = localStorage.getItem(ADMIN_STORE_KEY);
    if (!raw) return { ...DEFAULT_STORE, settings: { ...DEFAULT_SETTINGS } };
    const p = JSON.parse(raw);
    return {
      overrides:  p.overrides  ?? {},
      deletedIds: p.deletedIds ?? [],
      settings:   { ...DEFAULT_SETTINGS, ...(p.settings ?? {}) },
    };
  } catch {
    return { ...DEFAULT_STORE, settings: { ...DEFAULT_SETTINGS } };
  }
}

export function writeAdminStore(store: AdminStore): void {
  try {
    localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent('abc_admin_updated'));
  } catch {}
}

export function readAdminStats(): AdminStats {
  try {
    const raw = localStorage.getItem(ADMIN_STATS_KEY);
    if (!raw) return { views: {}, quizAttempts: {} };
    return JSON.parse(raw);
  } catch {
    return { views: {}, quizAttempts: {} };
  }
}

export function writeAdminStats(stats: AdminStats): void {
  try { localStorage.setItem(ADMIN_STATS_KEY, JSON.stringify(stats)); } catch {}
}

// ── Stat trackers (called by the real app) ────────────────────────────────────
export function trackTopicView(topicId: string): void {
  const s = readAdminStats();
  s.views[topicId] = (s.views[topicId] ?? 0) + 1;
  writeAdminStats(s);
}

export function trackQuizAttempt(topicId: string): void {
  const s = readAdminStats();
  s.quizAttempts[topicId] = (s.quizAttempts[topicId] ?? 0) + 1;
  writeAdminStats(s);
}

// ── Convenience helpers (used by app to gate content) ────────────────────────
export function isSuspended(topicId: string): boolean {
  const store = readAdminStore();
  return store.deletedIds.includes(topicId) ||
         (store.overrides[topicId]?.suspended ?? false);
}

export function getAdminSettings(): AdminSettings {
  return readAdminStore().settings;
}
