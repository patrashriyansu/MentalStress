import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore, useUIStore, useNotificationStore } from '../../store';
import { User, Bell, Shield, Download, Trash2, Moon, Sun, Lock, Heart, Target, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { sendEmailNotification } from '../../services/emailService';

const NOTIF_OPTIONS = [
  { id: 'daily_reminder', label: 'Daily mood check-in reminder', desc: 'Get reminded to log your mood each day' },
  { id: 'meditation',     label: 'Meditation reminders',          desc: 'Reminders to meditate' },
  { id: 'sleep',          label: 'Bedtime reminders',             desc: 'Reminder to log your sleep' },
  { id: 'community',      label: 'Community updates',             desc: 'Notify when someone likes your post' },
];

const WELLNESS_GOALS = [
  { id: 'meditate_daily',  label: 'Meditate daily' },
  { id: 'sleep_8h',        label: 'Sleep 8 hours' },
  { id: 'journal_daily',   label: 'Write in journal daily' },
  { id: 'stress_below_5',  label: 'Keep stress below 5' },
];

export default function Settings() {
  const { user, updateUser, logout } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const notifSettings = useNotificationStore();

  const [notifications, setNotifications] = useState({ daily_reminder: true, meditation: true, sleep: false, community: true });
  const [goals, setGoals] = useState({ meditate_daily: true, sleep_8h: false, journal_daily: true, stress_below_5: false });
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Email States
  const [emailEnabled, setEmailEnabled] = useState(notifSettings.emailEnabled);
  const [customEmailJS, setCustomEmailJS] = useState(notifSettings.customEmailJS);
  const [recipientEmail, setRecipientEmail] = useState(notifSettings.recipientEmail);
  const [serviceId, setServiceId] = useState(notifSettings.serviceId);
  const [templateId, setTemplateId] = useState(notifSettings.templateId);
  const [publicKey, setPublicKey] = useState(notifSettings.publicKey);

  const saveEmailSettings = () => {
    notifSettings.updateSettings({
      emailEnabled,
      customEmailJS,
      recipientEmail,
      serviceId,
      templateId,
      publicKey
    });
    toast.success('Email settings updated successfully!');
  };

  const handleSendTestEmail = async () => {
    const target = recipientEmail || user?.email;
    if (!target) {
      toast.error("Please configure a valid email address first!");
      return;
    }
    const tid = toast.loading("Sending test email...");
    try {
      const mockUser = {
        name: name || user?.name || 'User',
        email: target,
      };
      await sendEmailNotification(
        'Test Notification 🧪',
        'This is a test notification email sent from your MediVision AI settings panel to verify real email delivery. If you receive this, your email notifications are working perfectly!',
        mockUser
      );
      toast.success("Test email dispatched!", { id: tid });
    } catch (e) {
      toast.error(`Failed to send test email: ${e.message}`, { id: tid });
    }
  };

  const toggleNotif = (id) => setNotifications(n => ({ ...n, [id]: !n[id] }));
  const toggleGoal = (id) => setGoals(g => ({ ...g, [id]: !g[id] }));

  const saveProfile = () => {
    updateUser({ name, phone });
    toast.success('Profile updated successfully!');
  };

  const handleExport = () => {
    const data = {
      user: { name: user?.name, email: user?.email, role: user?.role },
      exportedAt: new Date().toISOString(),
      goals, notifications,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'mindspace-data.json'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported!');
  };

  const Section = ({ icon: Icon, title, children, iconColor = '#6c63ff' }) => (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-card)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: iconColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon style={{ width: 18, height: 18, color: iconColor }} />
        </div>
        <h3 className="section-title" style={{ fontSize: 15 }}>{title}</h3>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );

  const Toggle = ({ checked, onChange }) => (
    <button onClick={onChange}
      style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: checked ? '#6c63ff' : '#e5e7eb', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: checked ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
    </button>
  );

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">Settings ⚙️</h1>
        <p className="section-subtitle">Manage your profile, preferences, and privacy.</p>
      </div>

      {/* Profile */}
      <Section icon={User} title="Profile">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div className="avatar" style={{ width: 60, height: 60, fontSize: 22 }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <p style={{ fontWeight: 700, color: 'var(--text-900)', fontSize: 16 }}>{user?.name}</p>
            <p style={{ color: 'var(--text-500)', fontSize: 13 }}>{user?.email}</p>
            <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 10px', borderRadius: 20, background: 'var(--purple-100)', color: '#6c63ff', fontSize: 11, fontWeight: 700, textTransform: 'capitalize' }}>{user?.role}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 6 }}>Full Name</label>
            <input className="input-field" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 6 }}>Email (read-only)</label>
            <input className="input-field" value={user?.email || ''} readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 6 }}>Phone</label>
            <input className="input-field" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Optional" />
          </div>
          <button onClick={saveProfile} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
        </div>
      </Section>

      {/* Appearance */}
      <Section icon={theme === 'dark' ? Moon : Sun} title="Appearance" iconColor="#f59e0b">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text-900)', fontSize: 14 }}>Dark Mode</p>
            <p style={{ fontSize: 12, color: 'var(--text-400)', marginTop: 2 }}>Switch between light and dark theme</p>
          </div>
          <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
        </div>
      </Section>

      {/* Wellness Goals */}
      <Section icon={Target} title="Wellness Goals" iconColor="#10b981">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {WELLNESS_GOALS.map(g => (
            <div key={g.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-900)', fontSize: 14 }}>{g.label}</p>
              <Toggle checked={goals[g.id]} onChange={() => toggleGoal(g.id)} />
            </div>
          ))}
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {NOTIF_OPTIONS.map(opt => (
            <div key={opt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-900)', fontSize: 14 }}>{opt.label}</p>
                <p style={{ fontSize: 12, color: 'var(--text-400)', marginTop: 2 }}>{opt.desc}</p>
              </div>
              <Toggle checked={notifications[opt.id]} onChange={() => toggleNotif(opt.id)} />
            </div>
          ))}
        </div>
      </Section>

      {/* Email Notifications Config */}
      <Section icon={Mail} title="Email Notifications" iconColor="#3b82f6">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-900)', fontSize: 14 }}>Send Email Alerts</p>
              <p style={{ fontSize: 12, color: 'var(--text-400)', marginTop: 2 }}>Get emails automatically when logging details (mood, sleep, journals, appointments)</p>
            </div>
            <Toggle checked={emailEnabled} onChange={() => setEmailEnabled(!emailEnabled)} />
          </div>

          {emailEnabled && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 6 }}>Recipient Email</label>
                <input className="input-field" placeholder={user?.email || 'your-email@example.com'} value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} />
                <p style={{ fontSize: 11, color: 'var(--text-400)', marginTop: 4 }}>Leave blank to use your account email address: {user?.email}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--border-card)' }}>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-900)', fontSize: 13 }}>Custom EmailJS Integration</p>
                  <p style={{ fontSize: 11, color: 'var(--text-400)', marginTop: 2 }}>Connect your own email service to receive actual, live emails</p>
                </div>
                <Toggle checked={customEmailJS} onChange={() => setCustomEmailJS(!customEmailJS)} />
              </div>

              {customEmailJS ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 14, borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border-card)' }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 4 }}>EmailJS Service ID</label>
                    <input className="input-field" style={{ padding: '8px 12px', fontSize: 13 }} placeholder="e.g., service_xxxxxx" value={serviceId} onChange={e => setServiceId(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 4 }}>EmailJS Template ID</label>
                    <input className="input-field" style={{ padding: '8px 12px', fontSize: 13 }} placeholder="e.g., template_xxxxxx" value={templateId} onChange={e => setTemplateId(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 4 }}>EmailJS Public Key</label>
                    <input className="input-field" style={{ padding: '8px 12px', fontSize: 13 }} placeholder="e.g., user_xxxxxx / public_key_xxxxxx" value={publicKey} onChange={e => setPublicKey(e.target.value)} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-500)', lineHeight: 1.5, marginTop: 4 }}>
                    💡 <strong>Setup Instructions:</strong>
                    <ol style={{ paddingLeft: 16, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <li>Create a free account at <a href="https://www.emailjs.com" target="_blank" rel="noreferrer" style={{ color: '#6c63ff', textDecoration: 'underline', fontWeight: 600 }}>emailjs.com</a>.</li>
                      <li>Add an Email Service (e.g. Gmail) and note down your <strong>Service ID</strong>.</li>
                      <li>Create an Email Template accepting variables: <code>to_name</code>, <code>to_email</code>, <code>action_type</code>, and <code>action_details</code>. Note the <strong>Template ID</strong>.</li>
                      <li>Go to Account settings to copy your <strong>Public Key</strong>.</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div style={{ padding: 14, borderRadius: 12, background: 'rgba(16,185,129,0.06)', border: '1px dashed rgba(16,185,129,0.25)', fontSize: 12, color: '#047857', lineHeight: 1.5 }}>
                  📧 <strong>Real Email Delivery Active:</strong> By default, we use FormSubmit.co to send real email notifications to your inbox.
                  <br />
                  <span style={{ fontWeight: 600 }}>Note:</span> The very first email sent to your address will contain an activation link from FormSubmit.co. You must click that link to verify your address and start receiving all alerts.
                  <br />
                  Toggle "Custom EmailJS Integration" if you prefer to use your own private email service credentials.
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                <button onClick={saveEmailSettings} className="btn btn-primary">Save Email Configuration</button>
                <button onClick={handleSendTestEmail} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  🧪 Send Test Email
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </Section>

      {/* Privacy */}
      <Section icon={Lock} title="Privacy & Security" iconColor="#8b5cf6">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: 14, borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border-card)' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-900)', marginBottom: 4 }}>🔒 Your data stays local</p>
            <p style={{ fontSize: 12, color: 'var(--text-500)' }}>All your journal entries, mood logs, and health data are stored locally on your device. We never send your personal data to any server.</p>
          </div>
          <div style={{ padding: 14, borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border-card)' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-900)', marginBottom: 4 }}>👤 Anonymous Community</p>
            <p style={{ fontSize: 12, color: 'var(--text-500)' }}>All community posts are shared anonymously. Your name is never shown publicly.</p>
          </div>
        </div>
      </Section>

      {/* Data Management */}
      <Section icon={Download} title="Data Management" iconColor="#06b6d4">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, border: '1.5px solid #e5e7eb', background: 'white' }}>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-900)', fontSize: 14 }}>Export My Data</p>
              <p style={{ fontSize: 12, color: 'var(--text-400)', marginTop: 2 }}>Download all your wellness data as JSON</p>
            </div>
            <button onClick={handleExport} className="btn btn-secondary" style={{ fontSize: 12 }}>
              <Download style={{ width: 13, height: 13 }} /> Export
            </button>
          </div>
        </div>
      </Section>

      {/* Danger Zone */}
      <div style={{ border: '1.5px solid #fecaca', borderRadius: 20, overflow: 'hidden', marginBottom: 40 }}>
        <div style={{ padding: '14px 24px', background: '#fef2f2', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Trash2 style={{ width: 18, height: 18, color: '#ef4444' }} />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#dc2626' }}>Danger Zone</h3>
        </div>
        <div style={{ padding: 24 }}>
          {!showDeleteConfirm ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-900)', fontSize: 14 }}>Delete Account</p>
                <p style={{ fontSize: 12, color: 'var(--text-400)', marginTop: 2 }}>Permanently delete your account and all data</p>
              </div>
              <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-danger" style={{ fontSize: 12 }}>
                Delete Account
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>Are you absolutely sure?</p>
              <p style={{ fontSize: 13, color: 'var(--text-500)', marginBottom: 16 }}>This action cannot be undone. All your data will be permanently deleted.</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary">Cancel</button>
                <button onClick={() => {
                  localStorage.clear();
                  logout();
                  toast.success('Account deleted');
                }} className="btn btn-danger">Yes, Delete Everything</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
