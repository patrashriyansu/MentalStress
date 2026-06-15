import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Smile, BarChart2, BookOpen, Wind,
  Moon, FileText, Users, Settings, LogOut, Bell, Search,
  Menu, X, Sun, ChevronDown, Heart, Calendar,
  Stethoscope, Building2, AlertTriangle, Bot
} from 'lucide-react';
import { useAuthStore, useUIStore, useHealthStore, useMoodStore } from '../../store';

const MENTAL_NAV = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/mood',       icon: Smile,           label: 'Mood Tracker' },
  { to: '/stress',     icon: BarChart2,        label: 'Stress Analysis' },
  { to: '/journal',    icon: BookOpen,         label: 'Journal' },
  { to: '/meditation', icon: Wind,             label: 'Meditation' },
  { to: '/sleep',      icon: Moon,             label: 'Sleep Tracker' },
  { to: '/reports',    icon: FileText,         label: 'Reports' },
  { to: '/community',  icon: Users,            label: 'Community' },
];

const HEALTH_NAV = [
  { to: '/appointments', icon: Calendar,      label: 'Appointments' },
  { to: '/doctors',      icon: Stethoscope,   label: 'Doctors' },
  { to: '/hospitals',    icon: Building2,      label: 'Hospitals' },
  { to: '/emergency',    icon: AlertTriangle,  label: 'Emergency', danger: true },
];

const BOTTOM_NAV = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Home' },
  { to: '/mood',       icon: Smile,           label: 'Mood' },
  { to: '/journal',    icon: BookOpen,         label: 'Journal' },
  { to: '/meditation', icon: Wind,             label: 'Meditate' },
  { to: '/settings',   icon: Settings,         label: 'Settings' },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { notifications, markAllRead } = useHealthStore();
  const { todayMood } = useMoodStore();
  const { sidebarOpen, toggleSidebar, theme, toggleTheme } = useUIStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const unread = notifications.filter(n => !n.read).length;
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const handleLogout = () => {
    logout();
    setShowProfile(false);
    navigate('/auth');
  };

  const SidebarContent = ({ collapsed }) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border-card)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(108,99,255,0.35)' }}>
            <Heart style={{ width: 18, height: 18, color: 'white' }} />
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-900)', fontFamily: "'Poppins',sans-serif", letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                Mind<span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Space</span>
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Wellness & Health</div>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        {/* Mental Health Section */}
        {!collapsed && (
          <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-400)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 8px 8px' }}>
            Mental Wellness
          </p>
        )}
        {MENTAL_NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} title={collapsed ? label : undefined}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <Icon className="nav-icon" style={{ width: 18, height: 18, flexShrink: 0 }} />
            {!collapsed && <span style={{ fontSize: 13.5, transition: 'opacity 0.2s', whiteSpace: 'nowrap', overflow: 'hidden' }}>{label}</span>}
          </NavLink>
        ))}

        <div className="divider" style={{ margin: '12px 4px' }} />

        {/* Healthcare Section */}
        {!collapsed && (
          <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-400)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 8px 8px' }}>
            Healthcare
          </p>
        )}
        {HEALTH_NAV.map(({ to, icon: Icon, label, danger }) => (
          <NavLink key={to} to={to} title={collapsed ? label : undefined}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={{ justifyContent: collapsed ? 'center' : 'flex-start', color: danger ? 'var(--red-500)' : undefined }}>
            <Icon className="nav-icon" style={{ width: 18, height: 18, flexShrink: 0, color: danger ? 'var(--red-500)' : undefined }} />
            {!collapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>{label}</span>}
          </NavLink>
        ))}

        <div className="divider" style={{ margin: '12px 4px' }} />

        <NavLink to="/settings" title={collapsed ? 'Settings' : undefined}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <Settings className="nav-icon" style={{ width: 18, height: 18, flexShrink: 0 }} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </nav>

      {/* Profile + Logout */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-card)', flexShrink: 0 }}>
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 12, background: 'var(--surface-2)' }}>
            <div className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'User'}
              </p>
              <p style={{ fontSize: 10, color: 'var(--text-400)', textTransform: 'capitalize' }}>{user?.role || 'Member'}</p>
            </div>
            <button onClick={handleLogout} title="Logout"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red-500)', padding: 6, borderRadius: 8, display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <LogOut style={{ width: 15, height: 15 }} />
            </button>
          </div>
        ) : (
          <button onClick={handleLogout} title="Logout"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red-500)' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <LogOut style={{ width: 18, height: 18 }} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="app-shell">
      {/* Desktop Sidebar */}
      <motion.div
        animate={{ width: sidebarOpen ? 228 : 60 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="sidebar"
        style={{ overflow: 'hidden' }}
      >
        <SidebarContent collapsed={!sidebarOpen} />
      </motion.div>

      {/* Mobile Overlay Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40, backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 240, zIndex: 50, background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-card)', boxShadow: '4px 0 24px rgba(0,0,0,0.1)' }}>
              <div style={{ position: 'absolute', top: 14, right: 12, zIndex: 1 }}>
                <button onClick={() => setMobileOpen(false)} className="btn-icon"><X style={{ width: 16, height: 16 }} /></button>
              </div>
              <SidebarContent collapsed={false} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="main-area">

        {/* Topbar */}
        <header className="topbar">
          {/* Hamburger / Toggle */}
          <button onClick={() => { if (window.innerWidth < 768) setMobileOpen(true); else toggleSidebar(); }}
            className="btn-icon" style={{ flexShrink: 0 }}>
            <Menu style={{ width: 18, height: 18 }} />
          </button>

          {/* Search */}
          <div className="search-bar" style={{ display: 'flex' }}>
            <Search style={{ width: 15, height: 15, color: 'var(--text-400)', flexShrink: 0 }} />
            <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div style={{ flex: 1 }} />

          {/* Today's Mood indicator */}
          {todayMood && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: 'var(--purple-50)', border: '1px solid var(--purple-200)', cursor: 'pointer' }}
              onClick={() => navigate('/mood')}>
              <span style={{ fontSize: 16 }}>{todayMood.emoji}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--purple-600)', display: 'none' }} className="sm:block">{todayMood.label}</span>
            </div>
          )}

          {/* Dark mode */}
          <button onClick={toggleTheme} className="btn-icon">
            {theme === 'dark'
              ? <Sun style={{ width: 17, height: 17, color: '#f59e0b' }} />
              : <Moon style={{ width: 17, height: 17 }} />}
          </button>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => { setShowNotifs(v => !v); setShowProfile(false); }} className="btn-icon" style={{ position: 'relative' }}>
              <Bell style={{ width: 17, height: 17 }} />
              {unread > 0 && (
                <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: '50%', background: 'var(--red-500)', border: '2px solid white' }} />
              )}
            </button>
            <AnimatePresence>
              {showNotifs && (
                <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  style={{ position: 'absolute', right: 0, top: 44, width: 300, background: 'var(--surface-1)', border: '1px solid var(--border-card)', borderRadius: 16, boxShadow: 'var(--shadow-lg)', zIndex: 100, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-900)' }}>Notifications</span>
                    {unread > 0 && <button onClick={markAllRead} style={{ fontSize: 11, color: 'var(--purple-600)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Mark all read</button>}
                  </div>
                  {notifications.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-400)', fontSize: 13 }}>No notifications yet</p>
                  ) : notifications.slice(0, 5).map(n => (
                    <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-card)', background: n.read ? 'transparent' : 'var(--purple-50)' }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-900)' }}>{n.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-400)', marginTop: 2 }}>{n.message}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => { setShowProfile(v => !v); setShowNotifs(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px 4px 4px', borderRadius: 20, background: 'var(--surface-2)', border: '1px solid var(--border-card)', cursor: 'pointer' }}>
              <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{initials}</div>
              <div style={{ display: 'none' }} className="sm:block">
                <p style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-900)', lineHeight: 1 }}>{user?.name || 'User'}</p>
                <p style={{ fontSize: 10, color: 'var(--text-400)', textTransform: 'capitalize' }}>{user?.role}</p>
              </div>
              <ChevronDown style={{ width: 13, height: 13, color: 'var(--text-400)' }} />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  style={{ position: 'absolute', right: 0, top: 44, width: 200, background: 'var(--surface-1)', border: '1px solid var(--border-card)', borderRadius: 16, boxShadow: 'var(--shadow-lg)', zIndex: 100, overflow: 'hidden', padding: 6 }}>
                  {[
                    { icon: '🧠', label: 'Dashboard',    action: () => navigate('/dashboard') },
                    { icon: '📊', label: 'My Reports',   action: () => navigate('/reports') },
                    { icon: '⚙️', label: 'Settings',     action: () => navigate('/settings') },
                  ].map(item => (
                    <button key={item.label} onClick={() => { item.action(); setShowProfile(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 10, border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--text-600)', display: 'flex', alignItems: 'center', gap: 10 }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--purple-50)'; e.currentTarget.style.color = 'var(--purple-600)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-600)'; }}>
                      <span>{item.icon}</span> {item.label}
                    </button>
                  ))}
                  <div className="divider" />
                  <button onClick={handleLogout}
                    style={{ width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 10, border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--red-500)', display: 'flex', alignItems: 'center', gap: 10 }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                    <LogOut style={{ width: 14, height: 14 }} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav">
        {BOTTOM_NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', padding: '4px 0' }}>
            {({ isActive }) => (
              <>
                <Icon style={{ width: 20, height: 20, color: isActive ? 'var(--purple-600)' : 'var(--text-400)' }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: isActive ? 'var(--purple-600)' : 'var(--text-400)' }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Click-away overlay */}
      {(showNotifs || showProfile) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => { setShowNotifs(false); setShowProfile(false); }} />
      )}
    </div>
  );
}
