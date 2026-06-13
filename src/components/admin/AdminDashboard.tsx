import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, BookOpen, Users, Settings, LogOut,
  Plus, Trash2, Edit3, Eye, EyeOff, Search,
  Save, X, AlertTriangle, CheckCircle, BarChart2,
  TrendingUp, Globe, Clock, Shield, Download, RefreshCw,
  ToggleLeft, ToggleRight, Star, Zap, BookMarked, PlusCircle,
} from 'lucide-react';
import { TOPICS, CATEGORIES } from '@/lib/topics';

// ─── Types ────────────────────────────────────────────────────────────────────
interface AdminTopic {
  id: string;
  title: string;
  emoji: string;
  image: string;
  category: string;
  suspended: boolean;
  featured: boolean;
  createdAt: string;
  viewCount: number;
  quizAttempts: number;
}

interface AdminPage {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'family';
  status: 'active' | 'suspended';
  joinedAt: string;
  topicsRead: number;
  lastActive: string;
}

type AdminSection = 'overview' | 'topics' | 'pages' | 'users' | 'settings';

// ─── Seed helpers ─────────────────────────────────────────────────────────────
function seedTopics(): AdminTopic[] {
  return TOPICS.map((t, i) => ({
    id: t.id,
    title: typeof t.title === 'string' ? t.title : String(t.title),
    emoji: t.emoji,
    image: t.image,
    category: t.category,
    suspended: false,
    featured: i < 3,
    createdAt: '2025-01-01',
    viewCount: Math.floor(Math.random() * 2000) + 100,
    quizAttempts: Math.floor(Math.random() * 800) + 20,
  }));
}

function seedPages(): AdminPage[] {
  return [
    { id: 'p1', title: 'Landing Page', slug: '/', status: 'published', createdAt: '2025-01-01' },
    { id: 'p2', title: 'Topic Index', slug: '/topics', status: 'published', createdAt: '2025-01-01' },
    { id: 'p3', title: 'About Us', slug: '/about', status: 'draft', createdAt: '2025-03-10' },
    { id: 'p4', title: 'Privacy Policy', slug: '/privacy', status: 'published', createdAt: '2025-02-01' },
  ];
}

function seedUsers(): AdminUser[] {
  const names = ['Aisha Rahman','Mohammed Ali','Fatima Hassan','Ibrahim Khan','Zainab Ahmed','Yusuf Omar'];
  const emails = ['aisha@example.com','mali@example.com','fatima@example.com','ibrahim@example.com','zainab@example.com','yusuf@example.com'];
  const plans: AdminUser['plan'][] = ['free','pro','family','free','pro','family'];
  return names.map((name, i) => ({
    id: `u${i+1}`, name, email: emails[i], plan: plans[i],
    status: i === 2 ? 'suspended' : 'active',
    joinedAt: `2025-0${(i % 9)+1}-01`,
    topicsRead: Math.floor(Math.random() * 30) + 1,
    lastActive: `${Math.floor(Math.random() * 7) + 1}d ago`,
  }));
}

// ─── Storage helpers ──────────────────────────────────────────────────────────
const STORAGE_KEY = 'abc_admin_data_v1';

function loadAdminData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveAdminData(data: any) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className={`rounded-2xl p-5 flex flex-col gap-2 border ${color}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold opacity-70">{label}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/20">{icon}</div>
      </div>
      <div className="text-3xl font-extrabold">{value}</div>
      {sub && <div className="text-xs opacity-60">{sub}</div>}
    </div>
  );
}

function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    suspended: 'bg-red-100 text-red-700',
    published: 'bg-blue-100 text-blue-700',
    draft: 'bg-amber-100 text-amber-700',
    archived: 'bg-gray-100 text-gray-600',
    free: 'bg-gray-100 text-gray-700',
    pro: 'bg-purple-100 text-purple-700',
    family: 'bg-teal-100 text-teal-700',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

// ─── OVERVIEW SECTION ─────────────────────────────────────────────────────────
function OverviewSection({ topics, users, pages }: { topics: AdminTopic[]; users: AdminUser[]; pages: AdminPage[] }) {
  const totalViews = topics.reduce((s, t) => s + t.viewCount, 0);
  const totalQuizzes = topics.reduce((s, t) => s + t.quizAttempts, 0);
  const activeUsers = users.filter(u => u.status === 'active').length;
  const suspendedTopics = topics.filter(t => t.suspended).length;

  const topByViews = [...topics].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<BookOpen className="w-5 h-5 text-white" />} label="Total Topics" value={topics.length} sub={`${suspendedTopics} suspended`} color="bg-emerald-600 text-white border-emerald-500" />
        <StatCard icon={<Users className="w-5 h-5 text-white" />} label="Users" value={users.length} sub={`${activeUsers} active`} color="bg-purple-600 text-white border-purple-500" />
        <StatCard icon={<TrendingUp className="w-5 h-5 text-white" />} label="Total Views" value={totalViews.toLocaleString()} sub="all topics" color="bg-blue-600 text-white border-blue-500" />
        <StatCard icon={<Zap className="w-5 h-5 text-white" />} label="Quiz Attempts" value={totalQuizzes.toLocaleString()} sub="all time" color="bg-amber-500 text-white border-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top topics */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-emerald-600" /> Top Topics by Views</h3>
          <div className="space-y-3">
            {topByViews.map((t, i) => (
              <div key={t.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-4">#{i+1}</span>
                <span className="text-lg">{t.emoji}</span>
                <span className="flex-1 text-sm font-medium text-gray-700 truncate">{t.title}</span>
                <span className="text-sm font-bold text-emerald-600">{t.viewCount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-purple-600" /> Recent Users</h3>
          <div className="space-y-3">
            {users.slice(0, 5).map(u => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{u.name}</div>
                  <div className="text-xs text-gray-400">{u.lastActive}</div>
                </div>
                <Badge status={u.plan} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-blue-600" /> Topics by Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map(cat => {
            const count = topics.filter(t => t.category === cat.id).length;
            const views = topics.filter(t => t.category === cat.id).reduce((s, t) => s + t.viewCount, 0);
            return (
              <div key={cat.id} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-bold text-gray-700 text-center leading-tight">{cat.name}</span>
                <span className="text-xs text-gray-500">{count} topics</span>
                <span className="text-[10px] text-emerald-600 font-semibold">{views.toLocaleString()} views</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── TOPICS SECTION ───────────────────────────────────────────────────────────
function TopicsSection({ topics, setTopics }: { topics: AdminTopic[]; setTopics: (t: AdminTopic[]) => void }) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [editingTopic, setEditingTopic] = useState<AdminTopic | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState({ id: '', title: '', emoji: '📚', image: '', category: CATEGORIES[0].id });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = topics.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || t.category === catFilter;
    return matchSearch && matchCat;
  });

  const toggle = (id: string, field: 'suspended' | 'featured') => {
    const updated = topics.map(t => t.id === id ? { ...t, [field]: !t[field] } : t);
    setTopics(updated);
    showToast(`Topic ${field === 'suspended' ? (updated.find(t=>t.id===id)?.suspended ? 'suspended' : 'activated') : 'updated'}`);
  };

  const deleteTopic = (id: string) => {
    if (!confirm('Delete this topic permanently?')) return;
    setTopics(topics.filter(t => t.id !== id));
    showToast('Topic deleted');
  };

  const saveEdit = () => {
    if (!editingTopic) return;
    setTopics(topics.map(t => t.id === editingTopic.id ? editingTopic : t));
    setEditingTopic(null);
    showToast('Topic saved');
  };

  const addTopic = () => {
    if (!newTopic.id || !newTopic.title) return;
    const topic: AdminTopic = {
      ...newTopic,
      suspended: false, featured: false,
      createdAt: new Date().toISOString().split('T')[0],
      viewCount: 0, quizAttempts: 0,
    };
    setTopics([...topics, topic]);
    setShowAddForm(false);
    setNewTopic({ id: '', title: '', emoji: '📚', image: '', category: CATEGORIES[0].id });
    showToast('Topic added');
  };

  return (
    <div className="space-y-4">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search topics…"
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300" />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300">
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <button onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Add Topic
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2"><PlusCircle className="w-4 h-4" /> New Topic</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Topic ID', field: 'id', placeholder: 'e.g. tafsir' },
                { label: 'Title', field: 'title', placeholder: 'Topic title' },
                { label: 'Emoji', field: 'emoji', placeholder: '📚' },
                { label: 'Image URL', field: 'image', placeholder: 'https://…' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="text-xs font-bold text-emerald-700 mb-1 block">{label}</label>
                  <input value={(newTopic as any)[field]} onChange={e => setNewTopic(p => ({ ...p, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-emerald-700 mb-1 block">Category</label>
                <select value={newTopic.category} onChange={e => setNewTopic(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400">
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addTopic} className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700">Save Topic</button>
              <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-white text-gray-600 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editingTopic && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setEditingTopic(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-800 text-lg">Edit Topic</h3>
                <button onClick={() => setEditingTopic(null)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="grid gap-3">
                {[
                  { label: 'Title', field: 'title' },
                  { label: 'Emoji', field: 'emoji' },
                  { label: 'Image URL', field: 'image' },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="text-xs font-bold text-gray-600 mb-1 block">{label}</label>
                    <input value={(editingTopic as any)[field]}
                      onChange={e => setEditingTopic(p => p ? ({ ...p, [field]: e.target.value }) : p)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">Category</label>
                  <select value={editingTopic.category}
                    onChange={e => setEditingTopic(p => p ? ({ ...p, category: e.target.value }) : p)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-300">
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                {editingTopic.image && (
                  <img src={editingTopic.image} alt="" className="w-full h-32 object-contain rounded-xl border border-gray-100 bg-gray-50" />
                )}
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={saveEdit} className="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
                <button onClick={() => setEditingTopic(null)} className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm rounded-xl hover:bg-gray-200">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Topic','Category','Views','Quizzes','Featured','Status','Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(t => (
                <tr key={t.id} className={`hover:bg-gray-50 transition-colors ${t.suspended ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{t.emoji}</span>
                      <div>
                        <div className="font-semibold text-gray-800 leading-tight">{t.title}</div>
                        <div className="text-[11px] text-gray-400 font-mono">{t.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500">{CATEGORIES.find(c => c.id === t.category)?.name}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-700">{t.viewCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{t.quizAttempts.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(t.id, 'featured')}>
                      <Star className={`w-4 h-4 ${t.featured ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={t.suspended ? 'suspended' : 'active'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setEditingTopic(t)} title="Edit"
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => toggle(t.id, 'suspended')} title={t.suspended ? 'Activate' : 'Suspend'}
                        className={`p-1.5 rounded-lg transition-colors ${t.suspended ? 'hover:bg-emerald-50 text-emerald-600' : 'hover:bg-amber-50 text-amber-600'}`}>
                        {t.suspended ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => deleteTopic(t.id)} title="Delete"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">No topics found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400">
          Showing {filtered.length} of {topics.length} topics
        </div>
      </div>
    </div>
  );
}

// ─── PAGES SECTION ────────────────────────────────────────────────────────────
function PagesSection({ pages, setPages }: { pages: AdminPage[]; setPages: (p: AdminPage[]) => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '', status: 'draft' as AdminPage['status'] });
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const addPage = () => {
    if (!newPage.title || !newPage.slug) return;
    const page: AdminPage = { ...newPage, id: `p${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
    setPages([...pages, page]);
    setShowAdd(false);
    setNewPage({ title: '', slug: '', status: 'draft' });
    showToast('Page added');
  };

  const cycleStatus = (id: string) => {
    const order: AdminPage['status'][] = ['draft', 'published', 'archived'];
    setPages(pages.map(p => p.id === id ? { ...p, status: order[(order.indexOf(p.status) + 1) % 3] } : p));
  };

  const deletePage = (id: string) => {
    if (!confirm('Delete this page?')) return;
    setPages(pages.filter(p => p.id !== id));
    showToast('Page deleted');
  };

  return (
    <div className="space-y-4">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-700">Site Pages</h3>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> New Page
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <h4 className="font-bold text-blue-800 mb-3">New Page</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-blue-700 mb-1 block">Title</label>
                <input value={newPage.title} onChange={e => setNewPage(p => ({ ...p, title: e.target.value }))}
                  placeholder="Page title"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-blue-700 mb-1 block">Slug</label>
                <input value={newPage.slug} onChange={e => setNewPage(p => ({ ...p, slug: e.target.value }))}
                  placeholder="/about"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-blue-700 mb-1 block">Status</label>
                <select value={newPage.status} onChange={e => setNewPage(p => ({ ...p, status: e.target.value as AdminPage['status'] }))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addPage} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700">Save</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-white text-gray-600 text-sm rounded-xl border border-gray-200">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Page Title', 'Slug', 'Status', 'Created', 'Actions'].map(h => (
                <th key={h} className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pages.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-800">{p.title}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.slug}</td>
                <td className="px-4 py-3"><Badge status={p.status} /></td>
                <td className="px-4 py-3 text-gray-400 text-xs">{p.createdAt}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => cycleStatus(p.id)} title="Cycle status"
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deletePage(p.id)} title="Delete"
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── USERS SECTION ────────────────────────────────────────────────────────────
function UsersSection({ users, setUsers }: { users: AdminUser[]; setUsers: (u: AdminUser[]) => void }) {
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === 'all' || u.plan === planFilter;
    return matchSearch && matchPlan;
  });

  const toggleSuspend = (id: string) => {
    const updated = users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u) as AdminUser[];
    setUsers(updated);
    showToast(`User ${updated.find(u=>u.id===id)?.status}`);
  };

  const changePlan = (id: string, plan: AdminUser['plan']) => {
    setUsers(users.map(u => u.id === id ? { ...u, plan } : u));
    showToast('Plan updated');
  };

  const stats = {
    free: users.filter(u => u.plan === 'free').length,
    pro: users.filter(u => u.plan === 'pro').length,
    family: users.filter(u => u.plan === 'family').length,
    suspended: users.filter(u => u.status === 'suspended').length,
  };

  return (
    <div className="space-y-4">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      {/* Plan stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Free', count: stats.free, color: 'bg-gray-50 border-gray-200 text-gray-700' },
          { label: 'Pro', count: stats.pro, color: 'bg-purple-50 border-purple-200 text-purple-700' },
          { label: 'Family', count: stats.family, color: 'bg-teal-50 border-teal-200 text-teal-700' },
          { label: 'Suspended', count: stats.suspended, color: 'bg-red-50 border-red-200 text-red-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-3 border text-center ${s.color}`}>
            <div className="text-2xl font-extrabold">{s.count}</div>
            <div className="text-xs font-semibold uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300" />
        </div>
        <select value={planFilter} onChange={e => setPlanFilter(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none">
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="family">Family</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['User','Email','Plan','Topics Read','Last Active','Status','Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => (
                <tr key={u.id} className={`hover:bg-gray-50 ${u.status === 'suspended' ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                  <td className="px-4 py-3">
                    <select value={u.plan} onChange={e => changePlan(u.id, e.target.value as AdminUser['plan'])}
                      className="text-xs rounded-lg border border-gray-200 px-2 py-1 bg-white focus:outline-none">
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="family">Family</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-semibold">{u.topicsRead}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{u.lastActive}</td>
                  <td className="px-4 py-3"><Badge status={u.status} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleSuspend(u.id)}
                      className={`p-1.5 rounded-lg transition-colors ${u.status === 'active' ? 'hover:bg-amber-50 text-amber-600' : 'hover:bg-emerald-50 text-emerald-600'}`}
                      title={u.status === 'active' ? 'Suspend' : 'Activate'}>
                      {u.status === 'active' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400">
          {filtered.length} of {users.length} users
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS SECTION ─────────────────────────────────────────────────────────
function SettingsSection({ onChangePassword }: { onChangePassword: (pw: string) => void }) {
  const [siteName, setSiteName] = useState('ABC of Islam');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [guestQuiz, setGuestQuiz] = useState(true);
  const [newPw, setNewPw] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  return (
    <div className="space-y-6 max-w-2xl">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      {/* Site settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2"><Settings className="w-4 h-4 text-gray-600" /> Site Settings</h3>
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1 block">Site Name</label>
          <input value={siteName} onChange={e => setSiteName(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
        </div>
        <div className="flex items-center justify-between py-2 border-t border-gray-50">
          <div>
            <div className="font-semibold text-gray-700 text-sm">Maintenance Mode</div>
            <div className="text-xs text-gray-400">Show maintenance page to visitors</div>
          </div>
          <button onClick={() => setMaintenanceMode(m => !m)} className="transition-colors">
            {maintenanceMode ? <ToggleRight className="w-8 h-8 text-amber-500" /> : <ToggleLeft className="w-8 h-8 text-gray-300" />}
          </button>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-gray-50">
          <div>
            <div className="font-semibold text-gray-700 text-sm">Guest Quiz Access</div>
            <div className="text-xs text-gray-400">Allow non-registered users to take quizzes</div>
          </div>
          <button onClick={() => setGuestQuiz(g => !g)} className="transition-colors">
            {guestQuiz ? <ToggleRight className="w-8 h-8 text-emerald-500" /> : <ToggleLeft className="w-8 h-8 text-gray-300" />}
          </button>
        </div>
        <button onClick={() => showToast('Settings saved')}
          className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2"><Shield className="w-4 h-4 text-red-500" /> Admin Security</h3>
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1 block">New Admin Password</label>
          <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Enter new password"
            className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-300" />
        </div>
        <button onClick={() => { if (newPw.length >= 6) { onChangePassword(newPw); setNewPw(''); showToast('Password updated'); } else showToast('Min 6 characters'); }}
          className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 flex items-center gap-2">
          <Shield className="w-4 h-4" /> Update Password
        </button>
      </div>

      {/* Data management */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2"><Download className="w-4 h-4 text-blue-500" /> Data Management</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => {
            const data = localStorage.getItem('abc_admin_data_v1');
            const blob = new Blob([data || '{}'], { type: 'application/json' });
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'admin_backup.json'; a.click();
            showToast('Backup downloaded');
          }} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Backup
          </button>
          <button onClick={() => { if (confirm('Reset all admin data to defaults?')) { localStorage.removeItem('abc_admin_data_v1'); window.location.reload(); } }}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 flex items-center gap-2 border border-gray-200">
            <RefreshCw className="w-4 h-4" /> Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: (pw: string) => boolean }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = () => {
    if (onLogin(pw)) { setError(false); }
    else { setError(true); setPw(''); setTimeout(() => setError(false), 2000); }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Admin Access</h1>
        <p className="text-sm text-gray-500 mb-6">ABC of Islam — Control Panel</p>
        <input
          ref={inputRef} type="password" value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Enter admin password"
          className={`w-full px-4 py-3 text-sm rounded-xl border-2 focus:outline-none transition-colors mb-3 ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-emerald-400'}`}
        />
        {error && <p className="text-red-500 text-xs mb-3 flex items-center justify-center gap-1"><AlertTriangle className="w-3 h-3" /> Incorrect password</p>}
        <button onClick={submit}
          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl transition-colors shadow-md">
          Enter Dashboard
        </button>
        <p className="text-xs text-gray-400 mt-4">Default password: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">admin123</code></p>
      </motion.div>
    </div>
  );
}

// ─── MAIN ADMIN DASHBOARD ─────────────────────────────────────────────────────
export default function AdminDashboard({ onExit }: { onExit: () => void }) {
  // Auth
  const PW_KEY = 'abc_admin_pw_v1';
  const getStoredPw = () => { try { return localStorage.getItem(PW_KEY) || 'admin123'; } catch { return 'admin123'; } };
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem('abc_admin_authed') === '1'; } catch { return false; }
  });

  const handleLogin = (pw: string): boolean => {
    if (pw === getStoredPw()) {
      setAuthed(true);
      try { sessionStorage.setItem('abc_admin_authed', '1'); } catch {}
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setAuthed(false);
    try { sessionStorage.removeItem('abc_admin_authed'); } catch {}
    onExit();
  };

  const changePassword = (pw: string) => {
    try { localStorage.setItem(PW_KEY, pw); } catch {}
  };

  // Data
  const [section, setSection] = useState<AdminSection>('overview');
  const [topics, setTopics] = useState<AdminTopic[]>(() => {
    const saved = loadAdminData();
    return saved?.topics ?? seedTopics();
  });
  const [pages, setPages] = useState<AdminPage[]>(() => {
    const saved = loadAdminData();
    return saved?.pages ?? seedPages();
  });
  const [users, setUsers] = useState<AdminUser[]>(() => {
    const saved = loadAdminData();
    return saved?.users ?? seedUsers();
  });

  // Auto-save
  useEffect(() => { saveAdminData({ topics, pages, users }); }, [topics, pages, users]);

  if (!authed) return <AdminLogin onLogin={handleLogin} />;

  const navItems: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'topics', label: 'Topics', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'pages', label: 'Pages', icon: <BookMarked className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-[#0a1628] text-white px-4 sm:px-6 h-14 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-sm tracking-tight">ABC of Islam — Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold transition-colors">
            ← View Site
          </button>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-semibold transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 bg-white border-r border-gray-100 shadow-sm hidden md:flex flex-col pt-4 pb-6 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setSection(item.id)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all mx-2 rounded-xl my-0.5 text-left ${section === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span className={section === item.id ? 'text-emerald-600' : 'text-gray-400'}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 flex">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setSection(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition-colors ${section === item.id ? 'text-emerald-600' : 'text-gray-400'}`}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 h-full p-4 sm:p-6 pb-24 md:pb-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-gray-900 capitalize">{section}</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {section === 'overview' && 'Site-wide analytics and activity'}
                {section === 'topics' && 'Manage all Islamic education topics'}
                {section === 'pages' && 'Manage site pages and routes'}
                {section === 'users' && 'Manage users and subscriptions'}
                {section === 'settings' && 'Site configuration and security'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                {section === 'overview' && <OverviewSection topics={topics} users={users} pages={pages} />}
                {section === 'topics' && <TopicsSection topics={topics} setTopics={setTopics} />}
                {section === 'pages' && <PagesSection pages={pages} setPages={setPages} />}
                {section === 'users' && <UsersSection users={users} setUsers={setUsers} />}
                {section === 'settings' && <SettingsSection onChangePassword={changePassword} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
