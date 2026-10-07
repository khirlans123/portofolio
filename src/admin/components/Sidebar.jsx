import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Award, MessageSquare, LogOut, ExternalLink, X, Settings } from 'lucide-react';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/certificates', label: 'Certificates', icon: Award },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ onSignOut, unreadCount = 0, onClose }) {
  return (
    <aside style={{
      width: '240px', height: '100vh',
      background: '#0d0d15',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', flexDirection: 'column',
      padding: '1.5rem 0',
    }}>
      {/* Logo + close button */}
      <div style={{ padding: '0 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white', fontSize: '0.9rem',
            flexShrink: 0,
          }}>KA</div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>Portfolio</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>Admin Panel</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to} to={to} end={end}
            onClick={onClose}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.7rem 0.875rem', borderRadius: '10px',
              textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
              transition: 'all 0.2s',
              color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
              background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
              border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
            })}
          >
            <Icon size={16} />
            <span style={{ flex: 1 }}>{label}</span>
            {label === 'Messages' && unreadCount > 0 && (
              <span style={{
                background: '#6366f1', color: 'white', fontSize: '0.7rem',
                padding: '0.1rem 0.45rem', borderRadius: '100px', fontWeight: 600,
              }}>{unreadCount}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <a
          href="/" target="_blank" rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.7rem 0.875rem', borderRadius: '10px',
            textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
            color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s',
          }}
        >
          <ExternalLink size={16} />
          View Portfolio
        </a>
        <button
          onClick={onSignOut}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.7rem 0.875rem', borderRadius: '10px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: 500, color: 'rgba(239,68,68,0.7)',
            transition: 'color 0.2s', width: '100%', textAlign: 'left',
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
