import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, Calendar, UserCheck, Building2,
  BarChart2, AlertTriangle, LogOut, Bell, Search,
  Menu, ChevronDown, Sun, Moon, X, Heart, Bot
} from 'lucide-react';
import { useAuthStore, useHealthStore, useUIStore } from '../../store';

/* ── Minimal 6-item nav ── */
const NAV_ITEMS = [
  { to: '/dashboard',       icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/appointments',    icon: Calendar,        label: 'Appointments' },
  { to: '/doctors',         icon: UserCheck,       label: 'Doctors' },
  { to: '/hospital-finder', icon: Building2,       label: 'Hospitals' },
  { to: '/analytics',       icon: BarChart2,       label: 'Reports' },
  { to: '/emergency',       icon: AlertTriangle,   label: 'Emergency', danger: true },
];

export default function Layout() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const { notifications } = useHealthStore();
  const { sidebarOpen, toggleSidebar, currentLang, setLanguage, theme, toggleTheme } = useUIStore();
  const [search, setSearch] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/').filter(Boolean)[0] || 'dashboard';

  /* sync dark-mode class */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  /* sync language */
  useEffect(() => {
    if (currentLang) i18n.changeLanguage(currentLang);
  }, [currentLang, i18n]);

  const unread = notifications.filter(n => !n.read).length;
  const handleLogout = () => { logout(); navigate('/auth'); };

  /* ─── Sidebar inner ─── */
  const SidebarInner = ({ collapsed = false, onClose }) => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 flex-shrink-0">
        <div
          className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', boxShadow: '0 4px 12px rgba(37,99,235,0.35)' }}
        >
          <Heart className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="leading-none">
            <div className="flex items-baseline gap-0.5">
              <span className="text-[15px] font-black text-slate-900 dark:text-white" style={{ fontFamily: "'Poppins',sans-serif", letterSpacing: '-0.03em' }}>
                MediVision
              </span>
              <span className="text-[15px] font-black text-gradient ml-0.5" style={{ fontFamily: "'Poppins',sans-serif" }}>
                AI
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">
              Smart Healthcare
            </p>
          </div>
        )}
        {onClose && (
          <button onClick={onClose} className="ml-auto btn btn-icon w-8 h-8">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {!collapsed && (
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-3">
            Navigation
          </p>
        )}
        {NAV_ITEMS.map(({ to, icon: Icon, label, danger }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => onClose?.()}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''} ${danger ? 'text-red-500 !text-red-500' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon
              style={{
                width: 18,
                height: 18,
                flexShrink: 0,
                color: danger ? '#ef4444' : undefined,
              }}
            />
            {!collapsed && (
              <span className="text-[13px]">{t(label)}</span>
            )}
          </NavLink>
        ))}

        {/* AI Chatbot shortcut */}
        {!collapsed && (
          <div className="pt-3 mt-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-3">AI Tools</p>
            <NavLink
              to="/chatbot"
              onClick={() => onClose?.()}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Bot style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span className="text-[13px]">AI Chatbot</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* Bottom: Profile + Logout */}
      <div className="flex-shrink-0 px-3 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
        {!collapsed ? (
          <div
            className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
            onClick={handleLogout}
            title="Logout"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}
            >
              {(user?.name?.[0] || 'U').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate leading-none">
                {user?.name || 'User'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 capitalize">
                {user?.role || 'Patient'}
              </p>
            </div>
            <LogOut className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--bg-app)', fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="fixed inset-0"
              style={{ background: 'rgba(15,23,42,0.35)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="relative z-50 h-full flex flex-col app-sidebar sidebar-bg"
              style={{ width: 240 }}
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <SidebarInner onClose={() => setMobileOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop Sidebar ── */}
      <motion.div
        className="hidden md:flex flex-col app-sidebar sidebar-bg flex-shrink-0"
        animate={{ width: sidebarOpen ? 224 : 68 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <div style={{ width: sidebarOpen ? 224 : 68, minWidth: sidebarOpen ? 224 : 68 }}>
          <SidebarInner collapsed={!sidebarOpen} />
        </div>
      </motion.div>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ── Topbar ── */}
        <header className="app-topbar flex items-center gap-4 px-5 md:px-6 h-[60px] flex-shrink-0 z-20">

          {/* Mobile menu */}
          <button onClick={() => setMobileOpen(true)} className="md:hidden btn btn-icon">
            <Menu className="w-4 h-4" />
          </button>

          {/* Sidebar collapse (desktop) */}
          <button
            onClick={toggleSidebar}
            className="hidden md:flex btn btn-icon"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* ── Centered Search ── */}
          <div className="flex-1 flex justify-center max-w-xl mx-auto w-full">
            <div className="relative w-full">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'var(--text-300)' }}
              />
              <input
                className="search-bar w-full"
                placeholder="Search doctors, hospitals, medicines..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Global search"
              />
            </div>
          </div>

          {/* ── Right controls ── */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-icon"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark'
                ? <Sun className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(v => !v)}
                className="btn btn-icon gap-1 px-2.5 text-slate-500"
                aria-label="Switch language"
              >
                <span className="text-sm leading-none">🌐</span>
                <span className="text-[11px] font-bold uppercase hidden sm:block">{currentLang}</span>
              </button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-11 w-44 card z-50 overflow-hidden p-1.5"
                    style={{ borderRadius: 16 }}
                  >
                    {[
                      { code: 'en', flag: '🇺🇸', label: 'English' },
                      { code: 'hi', flag: '🇮🇳', label: 'हिंदी' },
                      { code: 'bn', flag: '🇮🇳', label: 'বাংলা' },
                      { code: 'or', flag: '🇮🇳', label: 'ଓଡ଼ିଆ' },
                    ].map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                        className={`w-full text-left px-3 py-2.5 text-[13px] rounded-xl font-medium transition-colors flex items-center gap-2.5 ${
                          currentLang === lang.code
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                        {currentLang === lang.code && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(v => !v)}
                className="btn btn-icon relative"
                aria-label={`Notifications ${unread > 0 ? `(${unread} unread)` : ''}`}
              >
                <Bell className="w-4 h-4 text-slate-500" />
                {unread > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-slate-900"
                    style={{ fontSize: '9px', padding: '0 3px' }}
                  >
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showNotifs && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-11 w-80 card z-50 overflow-hidden"
                    style={{ borderRadius: 16 }}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                      <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">Notifications</p>
                      <button
                        onClick={() => { navigate('/notifications'); setShowNotifs(false); }}
                        className="text-[12px] font-semibold text-blue-600 hover:text-blue-700"
                      >
                        View all
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 px-4 py-3 border-b hover:bg-slate-50 dark:hover:bg-white/3 transition-colors cursor-pointer ${!n.read ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''}`}
                          style={{ borderColor: 'var(--border)' }}
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5"
                            style={{ background: n.type === 'emergency' ? '#fee2e2' : '#dbeafe' }}
                          >
                            {n.type === 'medicine' ? '💊' : n.type === 'appointment' ? '📅' : n.type === 'emergency' ? '🚨' : '🔔'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-slate-700 dark:text-slate-200 leading-snug">{n.title}</p>
                            <p className="text-[11px] mt-0.5 text-slate-400 truncate">{n.message}</p>
                          </div>
                          {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
                        </div>
                      ))}
                      {!notifications.length && (
                        <p className="text-center text-[13px] py-8 text-slate-400">No notifications</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(v => !v)}
                className="flex items-center gap-2.5 p-1 pr-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                aria-label="Open profile menu"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-[13px] font-black text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}
                >
                  {(user?.name?.[0] || 'U').toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 leading-none">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 capitalize">
                    {user?.role || 'Patient'}
                  </p>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
              </button>
              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-52 card z-50 overflow-hidden p-1.5"
                    style={{ borderRadius: 16 }}
                  >
                    {[
                      { emoji: '👤', label: 'My Profile',   action: () => navigate('/history') },
                      { emoji: '⭐', label: 'Health Score',  action: () => navigate('/health-score') },
                      { emoji: '📊', label: 'Analytics',     action: () => navigate('/analytics') },
                      { emoji: '⚙️', label: 'Settings',      action: () => navigate('/notifications') },
                    ].map(item => (
                      <button
                        key={item.label}
                        onClick={() => { item.action(); setShowProfile(false); }}
                        className="w-full text-left px-3.5 py-2.5 text-[13px] text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 rounded-xl font-medium transition-colors flex items-center gap-2.5"
                      >
                        <span>{item.emoji}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                    <div className="border-t my-1" style={{ borderColor: 'var(--border)' }} />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3.5 py-2.5 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-colors flex items-center gap-2.5"
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main
          className={`flex-1 overflow-y-auto transition-all duration-500 screen-container screen-${currentPath}`}
          style={{ padding: '28px 28px' }}
        >
          <Outlet />
        </main>
      </div>

      {/* Click-away overlay for dropdowns */}
      {(showNotifs || showProfile || showLangMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => { setShowNotifs(false); setShowProfile(false); setShowLangMenu(false); }}
        />
      )}
    </div>
  );
}
