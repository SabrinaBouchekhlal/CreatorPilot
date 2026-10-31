import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  Route, 
  User, 
  BrandProfile, 
  TrendSignal, 
  ContentDecision, 
  CalendarItem, 
  ContentLibraryItem, 
  InstagramState, 
  AuditLog,
  ContentStatus
} from '../types';
import { translations, SupportedLanguage, TranslationDictionary } from '../i18n/translations';
import { supabase } from '../lib/supabase';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  route: Route;
  setRoute: (r: Route) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  direction: 'rtl' | 'ltr';
  t: TranslationDictionary;
  user: User | null;
  token: string | null;
  isAuthLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  brand: BrandProfile | null;
  isBrandLoading: boolean;
  setBrand: (b: BrandProfile | null) => void;
  saveBrandProfile: (b: BrandProfile) => Promise<void>;
  trends: TrendSignal[];
  refreshTrends: () => Promise<void>;
  decisions: ContentDecision[];
  updateDecisionStatus: (id: string, status: ContentStatus, silent?: boolean) => Promise<void>;
  regenerateDecisions: () => Promise<void>;
  calendar: CalendarItem[];
  saveCalendarItem: (item: Partial<CalendarItem>, silent?: boolean) => Promise<CalendarItem>;
  deleteCalendarItem: (id: string) => Promise<void>;
  regenerateCalendar: () => Promise<void>;
  library: ContentLibraryItem[];
  saveLibraryItem: (item: Partial<ContentLibraryItem>, silent?: boolean) => Promise<void>;
  deleteLibraryItem: (id: string) => Promise<void>;
  instagram: InstagramState | null;
  requestInstagramConnection: () => void;
  auditLogs: AuditLog[];
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  // Modals
  isGeneratorOpen: boolean;
  generatorInitialTool?: string;
  openGenerator: (tool?: string) => void;
  closeGenerator: () => void;
  editingItem: CalendarItem | null;
  isEditorOpen: boolean;
  openEditor: (item: CalendarItem | null) => void;
  closeEditor: () => void;
  // Quick navigation helpers
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<Route>('landing');
  const routeRef = useRef(route);
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const savedLang = localStorage.getItem('cp_language') as SupportedLanguage;
      if (savedLang && ['ar', 'fr', 'en'].includes(savedLang)) return savedLang;
    } catch {}
    return 'en';
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [generatorInitialTool, setGeneratorInitialTool] = useState<string | undefined>('ideas');
  const [editingItem, setEditingItem] = useState<CalendarItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Genuine Auth & In-Memory Session Token (No localStorage user identity source of truth)
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Brand profile: null for unconfigured / new users
  const [brand, setBrand] = useState<BrandProfile | null>(null);
  const [isBrandLoading, setIsBrandLoading] = useState<boolean>(false);

  const [trends, setTrends] = useState<TrendSignal[]>([]);
  const [decisions, setDecisions] = useState<ContentDecision[]>([]);
  const [calendar, setCalendar] = useState<CalendarItem[]>([]);
  const [library, setLibrary] = useState<ContentLibraryItem[]>([]);
  const [instagram, setInstagram] = useState<InstagramState | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const direction = language === 'ar' ? 'rtl' : 'ltr';
  const t = translations[language] || translations.en || translations.ar;

  useEffect(() => {
    routeRef.current = route;
  }, [route]);

  let toastCounter = 0;
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    toastCounter += 1;
    const id = `toast-${Date.now()}-${toastCounter}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('cp_language', lang);
    } catch {}
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const getAuthHeaders = (overrideToken?: string | null) => {
    const activeToken = overrideToken !== undefined ? overrideToken : token;
    const headers: Record<string, string> = {
      'x-user-language': language || 'en'
    };
    if (activeToken) {
      headers['Authorization'] = `Bearer ${activeToken}`;
    }
    return headers;
  };

  const fetchData = async (overrideToken?: string | null) => {
    const activeToken = overrideToken !== undefined ? overrideToken : token;
    if (!activeToken) {
      setBrand(null);
      setDecisions([]);
      setCalendar([]);
      setLibrary([]);
      setInstagram(null);
      setIsBrandLoading(false);
      return;
    }

    setIsBrandLoading(true);
    const headers = getAuthHeaders(activeToken);

    try {
      const [brandRes, trendsRes, decRes, calRes, libRes, igRes, auditRes] = await Promise.all([
        fetch('/api/brand-profile', { headers }).then(r => r.ok ? r.json() : null),
        fetch('/api/v1/trends', { headers }).then(r => r.ok ? r.json() : null),
        fetch('/api/v1/decisions', { headers }).then(r => r.ok ? r.json() : null),
        fetch('/api/v1/calendar', { headers }).then(r => r.ok ? r.json() : null),
        fetch('/api/v1/library', { headers }).then(r => r.ok ? r.json() : null),
        fetch('/api/v1/instagram/status', { headers }).then(r => r.ok ? r.json() : null),
        fetch('/api/v1/audit', { headers }).then(r => r.ok ? r.json() : null),
      ]);

      if (brandRes && brandRes.brand) {
        setBrand(brandRes.brand);
      } else if (brandRes && brandRes.name) {
        setBrand(brandRes);
      } else {
        setBrand(null);
      }

      if (trendsRes?.signals) setTrends(trendsRes.signals);
      if (decRes?.decisions) setDecisions(decRes.decisions);
      else setDecisions([]);

      if (calRes?.items) setCalendar(calRes.items);
      else setCalendar([]);

      if (libRes?.items) setLibrary(libRes.items);
      else setLibrary([]);

      if (igRes) setInstagram(igRes);
      if (auditRes?.logs) setAuditLogs(auditRes.logs);
    } catch (err) {
      console.warn('API fetch warning:', err);
    } finally {
      setIsBrandLoading(false);
    }
  };

  // Supabase Auth Listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      void (async () => {
        if (!session) {
          setToken(null);
          setUser(null);
          setBrand(null);
          setDecisions([]);
          setCalendar([]);
          setLibrary([]);
          setInstagram(null);
          setIsAuthLoading(false);
          return;
        }

        const accessToken = session.access_token;
        const authUser = session.user;
        const fallbackUser: User = {
          id: authUser.id,
          email: authUser.email || '',
          name:
            authUser.user_metadata?.full_name ||
            authUser.user_metadata?.name ||
            authUser.email?.split('@')[0] ||
            'Creator',
          role: 'creator_pro',
          workspaceId: `ws-${authUser.id}`
        };
        setToken(accessToken);

        try {
          const syncRes = await fetch('/api/v1/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ email: authUser.email, name: fallbackUser.name })
          });
          if (!syncRes.ok) {
            const syncError = await syncRes.json().catch(() => null);
            throw new Error(syncError?.error || 'Could not initialize your account data.');
          }
          const syncData = await syncRes.json();
          setUser(syncData.user || fallbackUser);
        } catch (err) {
          console.error('Failed to initialize Supabase session', err);
          setUser(fallbackUser);
          showToast(
            language === 'ar'
              ? 'تعذر تحميل بيانات الحساب. تحقق من اتصال قاعدة البيانات.'
              : 'Could not load account data. Check the database connection.',
            'error'
          );
        }

        await fetchData(accessToken);
        if (event === 'INITIAL_SESSION' && routeRef.current === 'landing') {
          setRoute('dashboard');
        }
        setIsAuthLoading(false);
      })().catch((err) => {
        console.error('Failed to process Supabase auth state', err);
        setIsAuthLoading(false);
      });
    });

    return () => subscription.unsubscribe();
  }, [language]);

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      setRoute('dashboard');
      showToast(language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Signed in successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  const signupWithEmail = async (email: string, pass: string, name?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { full_name: name || email.split('@')[0] },
          emailRedirectTo: window.location.origin
        }
      });
      if (error) throw error;

      if (data.session) {
        setRoute('dashboard');
        showToast(language === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully', 'success');
      } else {
        setRoute('login');
        showToast(
          language === 'ar'
            ? 'تحقق من بريدك الإلكتروني لتأكيد الحساب.'
            : 'Check your email to confirm your account.',
          'info'
        );
      }
    } catch (err: any) {
      const errorCode = String(err?.code || '').toLowerCase();
      const errorMessage = String(err?.message || '').toLowerCase();
      if (errorCode === 'email_exists' || errorCode === 'user_already_exists' ||
          /already registered|already exists|user already|email.*exist|email.*registered/.test(errorMessage)) {
        showToast(t.auth.emailAlreadyExists, 'error');
      } else if (err?.status === 429 || errorCode === 'over_request_rate_limit' ||
                 /rate limit|too many requests/.test(errorMessage)) {
        showToast(t.auth.signupRateLimited, 'error');
      } else {
        showToast(err.message || 'Registration failed', 'error');
      }
      throw err;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showToast(error.message || 'Could not sign out', 'error');
      throw error;
    }
    setToken(null);
    setUser(null);
    setBrand(null);
    setDecisions([]);
    setCalendar([]);
    setLibrary([]);
    setInstagram(null);
    setRoute('landing');
    showToast(t.nav.logout, 'info');
  };

  const saveBrandProfile = async (updated: BrandProfile) => {
    if (!token) {
      showToast('Please sign in first', 'error');
      return;
    }
    try {
      const res = await fetch('/api/brand-profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (res.ok) {
        const saved = data.brand || data;
        setBrand(saved);
        showToast(t.common.saved, 'success');
        await fetchData(token);
      } else {
        showToast(data.error || t.common.error, 'error');
      }
    } catch {
      showToast(t.common.error, 'error');
    }
  };

  const refreshTrends = async () => {
    try {
      const res = await fetch('/api/v1/trends/refresh', { 
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.signals) {
        setTrends(data.signals);
        showToast(data.message || t.trends.refreshSignals, 'success');
      }
    } catch {
      showToast(t.trends.refreshSignals, 'info');
    }
  };

  const updateDecisionStatus = async (id: string, status: ContentStatus, silent: boolean = false) => {
    try {
      setDecisions(prev => prev.map(d => d.id === id ? { ...d, status } : d));
      await fetch(`/api/v1/decisions/${id}/status`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ status })
      });
      if (!silent) {
        showToast(t.common.saved, 'success');
      }
    } catch {}
  };

  const saveCalendarItem = async (item: Partial<CalendarItem>, silent: boolean = false): Promise<CalendarItem> => {
    const previousItem = item.id ? calendar.find((existing) => existing.id === item.id) : undefined;
    const fullItem: CalendarItem = {
      id: item.id || `cal-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      title: item.title || (language === 'en' ? 'New Post' : language === 'fr' ? 'Nouvelle publication' : 'منشور جديد'),
      platform: item.platform || 'Instagram',
      format: item.format || 'Reels',
      time: item.time || new Date(Date.now() + 86400000).toISOString(),
      horizon: item.horizon || '48h',
      pillar: item.pillar || brand?.pillars?.[0]?.name || 'Authority',
      status: item.status || 'draft',
      hook: item.hook || '',
      notes: item.notes || '',
      decisionId: item.decisionId || null
    };

    setCalendar(prev => {
      const idx = prev.findIndex(i => i.id === fullItem.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = fullItem;
        return copy;
      }
      return [fullItem, ...prev];
    });

    try {
      const res = await fetch('/api/v1/calendar/item', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(fullItem)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t.common.error);
      }
      if (!data.item?.id) {
        throw new Error(t.common.error);
      }

      const localId = fullItem.id;
      fullItem.id = data.item.id;
      setCalendar((prev) => prev.map((existing) =>
        existing.id === localId ? { ...fullItem, ...data.item } : existing
      ));
    } catch (error) {
      setCalendar((prev) => {
        const remaining = prev.filter((existing) => existing.id !== fullItem.id);
        return previousItem ? [previousItem, ...remaining] : remaining;
      });
      const message = error instanceof Error ? error.message : t.common.error;
      showToast(message, 'error');
      throw error;
    }

    if (!silent) {
      showToast(t.common.saved, 'success');
    }
    return fullItem;
  };

  const deleteCalendarItem = async (id: string) => {
    setCalendar(prev => prev.filter(i => i.id !== id));
    try {
      await fetch(`/api/v1/calendar/item/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {}
    showToast(t.common.delete + ' ' + t.common.success, 'info');
  };

  const saveLibraryItem = async (item: Partial<ContentLibraryItem>, silent: boolean = false) => {
    const newItem: ContentLibraryItem = {
      id: item.id || `lib-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      type: item.type || 'script',
      title: item.title || (language === 'en' ? 'Content Draft' : language === 'fr' ? 'Brouillon de contenu' : 'مسودة محتوى'),
      content: item.content || '',
      tags: item.tags || ['Custom'],
      createdAt: new Date().toISOString()
    };
    setLibrary(prev => [newItem, ...prev]);
    try {
      await fetch('/api/v1/library', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(newItem)
      });
    } catch {}
    if (!silent) {
      showToast(t.common.saved, 'success');
    }
  };

  const deleteLibraryItem = async (id: string) => {
    setLibrary(prev => prev.filter(i => i.id !== id));
    try {
      await fetch(`/api/v1/library/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {}
    showToast(t.common.delete + ' ' + t.common.success, 'info');
  };

  const requestInstagramConnection = () => {
    const message = language === 'ar'
      ? 'ربط Instagram غير مهيأ بعد. يلزم إعداد تطبيق Meta OAuth أولاً.'
      : language === 'fr'
        ? 'La connexion Instagram n’est pas encore configurée. Configurez d’abord Meta OAuth.'
        : 'Instagram connection is not configured yet. Set up Meta OAuth first.';
    showToast(message, 'info');
  };

  const regenerateDecisions = async () => {
    try {
      const res = await fetch('/api/v1/decisions/regenerate', {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: language === 'ar' ? 'ar_standard' : language })
      });
      const data = await res.json();
      if (data.decisions) {
        setDecisions(data.decisions);
        const message = language === 'en' ? 'Decisions refreshed for your brand' : language === 'fr' ? 'Décisions actualisées pour votre marque' : 'تم تحديث القرارات بنجاح';
        showToast(message, 'success');
      } else if (data.error) {
        showToast(getGenerationErrorMessage(data.code, data.error, data.retryAt), 'error');
      }
    } catch {
      showToast(t.common.error, 'error');
    }
  };

  const regenerateCalendar = async () => {
    try {
      const res = await fetch('/api/v1/calendar/regenerate', {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: language === 'ar' ? 'ar_standard' : language,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        })
      });
      const data = await res.json();
      if (data.items) {
        setCalendar(data.items);
        const message = language === 'en' ? 'Calendar refreshed for your brand' : language === 'fr' ? 'Calendrier actualisé pour votre marque' : 'تم تحديث التقويم بنجاح';
        showToast(message, 'success');
      } else if (data.error) {
        showToast(getGenerationErrorMessage(data.code, data.error, data.retryAt), 'error');
      }
    } catch {
      showToast(t.common.error, 'error');
    }
  };

  const getGenerationErrorMessage = (code?: string, fallback?: string, retryAt?: string) => {
    const message = code === 'GEMINI_QUOTA_EXCEEDED' ? t.generator.geminiQuotaError
      : code === 'GEMINI_RATE_LIMITED' ? t.generator.geminiRateLimitError
      : code === 'GEMINI_NOT_CONFIGURED' ? t.generator.geminiConfigurationError
      : code === 'GEMINI_INVALID_RESPONSE' ? t.generator.geminiInvalidResponseError
      : code === 'GEMINI_UNAVAILABLE' ? t.generator.geminiUnavailableError
      : fallback || t.common.error;
    if (!retryAt) return message;
    const retryMessage = language === 'fr' ? 'Nouvel essai vers'
      : language === 'ar' ? 'إعادة المحاولة تقريباً في'
      : 'Retry around';
    const locale = language === 'fr' ? 'fr-FR' : language === 'ar' ? 'ar-DZ' : 'en-US';
    return `${message} ${retryMessage} ${new Date(retryAt).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' })}.`;
  };

  const openGenerator = (tool?: string) => {
    setGeneratorInitialTool(tool || 'ideas');
    setIsGeneratorOpen(true);
  };

  const closeGenerator = () => setIsGeneratorOpen(false);

  const openEditor = (item: CalendarItem | null) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };
  const closeEditor = () => {
    setEditingItem(null);
    setIsEditorOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <AppContext.Provider
      value={{
        route,
        setRoute,
        language,
        setLanguage,
        direction,
        t,
        user,
        token,
        isAuthLoading,
        loginWithEmail,
        signupWithEmail,
        logout,
        brand,
        isBrandLoading,
        setBrand,
        saveBrandProfile,
        trends,
        refreshTrends,
        decisions,
        updateDecisionStatus,
        regenerateDecisions,
        calendar,
        saveCalendarItem,
        deleteCalendarItem,
        regenerateCalendar,
        library,
        saveLibraryItem,
        deleteLibraryItem,
        instagram,
        requestInstagramConnection,
        auditLogs,
        toasts,
        showToast,
        isGeneratorOpen,
        generatorInitialTool,
        openGenerator,
        closeGenerator,
        editingItem,
        isEditorOpen,
        openEditor,
        closeEditor,
        isSidebarOpen,
        toggleSidebar
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
