import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate('/admin/login');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('messages')
      .select('id', { count: 'exact' })
      .eq('is_read', false)
      .then(({ count }) => setUnreadCount(count ?? 0));
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0f', color: 'white', fontSize: '1rem',
    }}>Loading...</div>
  );

  if (!user) return null;

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: '#0a0a0f', fontFamily: 'Inter, sans-serif', color: 'white',
      position: 'relative',
    }}>

      {/* Overlay mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 50, backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: isMobile ? 'fixed' : 'sticky',
        top: 0, left: 0,
        height: '100vh',
        zIndex: 60,
        transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.3s ease',
        flexShrink: 0,
      }}>
        <Sidebar
          onSignOut={handleSignOut}
          unreadCount={unreadCount}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>

        {/* Topbar mobile */}
        {isMobile && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            background: '#0a0a0f',
            position: 'sticky', top: 0, zIndex: 40,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white', fontSize: '0.75rem',
              }}>KA</div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Admin Panel</span>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', padding: '0.5rem', color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Menu size={20} />
            </button>
          </div>
        )}

        <main style={{ padding: isMobile ? '1.25rem' : '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
