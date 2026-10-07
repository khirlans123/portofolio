import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import {
  FolderKanban, Award, MessageSquare, Mail,
  TrendingUp, Clock, ArrowUpRight, Layers,
  CheckCircle2, Star, Inbox,
} from 'lucide-react';

/* ─── Helpers ──────────────────────────────────────────────────── */
function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr  = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr  / 24);
  if (diffSec < 60)  return 'Baru saja';
  if (diffMin < 60)  return `${diffMin} menit lalu`;
  if (diffHr  < 24)  return `${diffHr} jam lalu`;
  if (diffDay < 7)   return `${diffDay} hari lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/* ─── Stat Card ────────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div style={{
      padding: '1.5rem',
      borderRadius: '20px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color 0.25s, transform 0.25s',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${color}50`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '-20px', right: '-20px',
        width: '100px', height: '100px', borderRadius: '50%',
        background: `${color}15`, filter: 'blur(20px)', pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '13px',
          background: `${color}18`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={21} style={{ color }} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.25rem',
          fontSize: '0.7rem', color: `${color}cc`, fontWeight: 600,
          background: `${color}15`, padding: '0.2rem 0.6rem',
          borderRadius: '100px', border: `1px solid ${color}25`,
        }}>
          <TrendingUp size={11} />
          LIVE
        </div>
      </div>

      {/* Value */}
      <div style={{
        fontSize: '2.5rem', fontWeight: 800, lineHeight: 1,
        fontFamily: 'Syne, sans-serif', color: 'white',
      }}>
        {value}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginTop: '0.4rem', fontWeight: 500 }}>
        {label}
      </div>
      {sub && (
        <div style={{
          marginTop: '1rem', paddingTop: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', gap: '0.35rem',
        }}>
          <Clock size={11} />
          {sub}
        </div>
      )}
    </div>
  );
}

/* ─── Activity Item ────────────────────────────────────────────── */
function ActivityItem({ item, isLast }) {
  const isProject = item._type === 'project';
  const color = isProject ? '#6366f1' : '#f59e0b';
  const Icon  = isProject ? FolderKanban : Award;

  return (
    <div style={{ display: 'flex', gap: '0.875rem', position: 'relative' }}>
      {/* Timeline line */}
      {!isLast && (
        <div style={{
          position: 'absolute', left: '17px', top: '36px',
          width: '2px', height: 'calc(100% + 0.25rem)',
          background: 'rgba(255,255,255,0.06)',
        }} />
      )}

      {/* Icon Dot */}
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        background: `${color}18`, border: `2px solid ${color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, zIndex: 1,
      }}>
        <Icon size={16} style={{ color }} />
      </div>

      {/* Content */}
      <div style={{
        flex: 1, minWidth: 0,
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        padding: '0.875rem 1rem',
        marginBottom: '0.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em',
                padding: '0.15rem 0.55rem', borderRadius: '100px',
                background: `${color}18`, color,
                border: `1px solid ${color}30`,
                textTransform: 'uppercase',
              }}>
                {isProject ? 'Project' : 'Sertifikat'}
              </span>
              <span style={{
                fontSize: '0.67rem', color: 'rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', gap: '0.25rem',
              }}>
                <Clock size={10} />
                {timeAgo(item.created_at)}
              </span>
            </div>
            <div style={{
              fontWeight: 600, fontSize: '0.875rem', color: 'white',
              marginTop: '0.35rem',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {item.title}
            </div>
            {item.description && (
              <div style={{
                fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)',
                marginTop: '0.2rem', lineHeight: 1.4,
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>
                {item.description}
              </div>
            )}
          </div>
          {(item.image_url) && (
            <img
              src={item.image_url}
              alt={item.title}
              style={{
                width: '52px', height: '52px', borderRadius: '10px',
                objectFit: 'cover', flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
          )}
        </div>

        <div style={{
          marginTop: '0.625rem',
          fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)',
        }}>
          📅 {formatDate(item.created_at)}
        </div>
      </div>
    </div>
  );
}

/* ─── Message Item ─────────────────────────────────────────────── */
function MessageItem({ msg }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.875rem',
      padding: '0.875rem 1rem',
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${msg.is_read ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.25)'}`,
      borderRadius: '12px',
    }}>
      {/* Avatar */}
      <div style={{
        width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
        background: msg.is_read ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.15)',
        border: `2px solid ${msg.is_read ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.4)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: '0.85rem', color: msg.is_read ? 'rgba(255,255,255,0.4)' : '#818cf8',
        fontFamily: 'Syne, sans-serif',
      }}>
        {(msg.name?.[0] || '?').toUpperCase()}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'white' }}>{msg.name}</span>
          {!msg.is_read && (
            <span style={{
              background: '#6366f1', color: 'white', fontSize: '0.6rem',
              padding: '0.1rem 0.45rem', borderRadius: '100px', fontWeight: 700,
            }}>NEW</span>
          )}
        </div>
        <div style={{
          fontSize: '0.775rem', color: 'rgba(255,255,255,0.4)',
          marginTop: '0.1rem',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {msg.subject || msg.message?.slice(0, 50)}
        </div>
      </div>

      {/* Time */}
      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
        {timeAgo(msg.created_at)}
      </div>
    </div>
  );
}

/* ─── Quick Actions ────────────────────────────────────────────── */
function QuickAction({ icon: Icon, label, to, color }) {
  return (
    <a href={to} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.625rem',
      padding: '1.25rem 0.75rem',
      borderRadius: '16px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      textDecoration: 'none',
      transition: 'all 0.22s',
      cursor: 'pointer',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${color}12`;
        e.currentTarget.style.borderColor = `${color}35`;
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, textAlign: 'center' }}>
        {label}
      </div>
    </a>
  );
}

/* ─── Skeleton ─────────────────────────────────────────────────── */
function Skeleton({ h = '60px', r = '12px' }) {
  return (
    <div style={{
      height: h, borderRadius: r,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }} />
  );
}

/* ─── Dashboard ────────────────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ projects: 0, certificates: 0, messages: 0, unread: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [projCount, certCount, msgCount, unreadCount, recentMsgs, recentProj, recentCert] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('certificates').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(4),
        supabase.from('projects').select('id, title, description, image_url, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('certificates').select('id, title, description, image_url, created_at').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({
        projects: projCount.count ?? 0,
        certificates: certCount.count ?? 0,
        messages: msgCount.count ?? 0,
        unread: unreadCount.count ?? 0,
      });
      setRecentMessages(recentMsgs.data ?? []);

      // Merge and sort activity feed
      const proj = (recentProj.data ?? []).map(p => ({ ...p, _type: 'project' }));
      const cert = (recentCert.data ?? []).map(c => ({ ...c, _type: 'certificate' }));
      const merged = [...proj, ...cert].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8);
      setActivity(merged);
      setLoading(false);
    };
    fetch();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : hour < 18 ? 'Selamat Sore' : 'Selamat Malam';

  const STAT_CARDS = [
    { label: 'Total Projects', value: stats.projects, icon: FolderKanban, color: '#6366f1', sub: 'Project dipublish' },
    { label: 'Sertifikat', value: stats.certificates, icon: Award, color: '#f59e0b', sub: 'Sertifikat diupload' },
    { label: 'Total Pesan', value: stats.messages, icon: MessageSquare, color: '#22c55e', sub: 'Semua pesan masuk' },
    { label: 'Pesan Belum Dibaca', value: stats.unread, icon: Mail, color: '#ec4899', sub: stats.unread > 0 ? 'Perlu perhatian!' : 'Semua sudah dibaca' },
  ];

  return (
    <div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0 }
          100% { background-position: 200% 0 }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: '2rem', animation: 'fadeUp 0.5s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              👋 {greeting}
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, fontFamily: 'Syne, sans-serif' }}>
              Dashboard
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem', fontSize: '0.875rem' }}>
              Kelola portfolio dan pantau aktivitas terbaru
            </p>
          </div>

          {/* Date badge */}
          <div style={{
            padding: '0.6rem 1rem', borderRadius: '12px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)',
          }}>
            <Clock size={14} />
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        gap: '1rem', marginBottom: '2rem',
        animation: 'fadeUp 0.5s ease 0.05s both',
      }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} h="140px" r="20px" />)
          : STAT_CARDS.map(c => <StatCard key={c.label} {...c} />)
        }
      </div>

      {/* ── Quick Actions ── */}
      <div style={{
        marginBottom: '2rem',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        padding: '1.25rem',
        animation: 'fadeUp 0.5s ease 0.1s both',
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          ⚡ Aksi Cepat
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem' }}>
          <QuickAction icon={FolderKanban} label="Tambah Project" to="/admin/projects" color="#6366f1" />
          <QuickAction icon={Award}        label="Upload Sertifikat" to="/admin/certificates" color="#f59e0b" />
          <QuickAction icon={MessageSquare} label="Lihat Pesan" to="/admin/messages" color="#22c55e" />
          <QuickAction icon={Layers}       label="Semua Content" to="/admin/projects" color="#8b5cf6" />
        </div>
      </div>

      {/* ── 2 column grid: Activity + Messages ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        animation: 'fadeUp 0.5s ease 0.15s both',
      }}>
        {/* Activity Feed */}
        <div style={{
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={17} style={{ color: '#22c55e' }} />
                Aktivitas Terbaru
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.15rem' }}>
                Upload project &amp; sertifikat
              </div>
            </div>
            <div style={{
              fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)',
              background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.625rem',
              borderRadius: '100px', border: '1px solid rgba(255,255,255,0.08)',
            }}>
              {activity.length} item
            </div>
          </div>

          {/* Items */}
          <div style={{ padding: '1.25rem 1.25rem 1rem' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} h="75px" />)}
              </div>
            ) : activity.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '2.5rem 1rem',
                color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem',
              }}>
                <Layers size={36} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
                <div>Belum ada aktivitas</div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Upload project atau sertifikat untuk memulai</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {activity.map((item, i) => (
                  <ActivityItem key={`${item._type}-${item.id}`} item={item} isLast={i === activity.length - 1} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {activity.length > 0 && (
            <div style={{
              padding: '0.75rem 1.5rem 1.25rem',
              display: 'flex', justifyContent: 'center',
            }}>
              <a href="/admin/projects" style={{
                fontSize: '0.78rem', color: '#818cf8',
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem',
              }}>
                Lihat semua <ArrowUpRight size={13} />
              </a>
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div style={{
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={17} style={{ color: '#6366f1' }} />
                Pesan Terbaru
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.15rem' }}>
                Pesan dari pengunjung portfolio
              </div>
            </div>
            {stats.unread > 0 && (
              <div style={{
                fontSize: '0.7rem', color: 'white', fontWeight: 700,
                background: '#6366f1', padding: '0.25rem 0.625rem',
                borderRadius: '100px',
              }}>
                {stats.unread} baru
              </div>
            )}
          </div>

          {/* Items */}
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} h="65px" />)
            ) : recentMessages.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '2.5rem 1rem',
                color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem',
              }}>
                <Inbox size={36} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
                <div>Belum ada pesan</div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Pesan dari pengunjung akan muncul di sini</div>
              </div>
            ) : (
              recentMessages.map(msg => <MessageItem key={msg.id} msg={msg} />)
            )}
          </div>

          {/* Footer */}
          {recentMessages.length > 0 && (
            <div style={{ padding: '0.75rem 1.5rem 1.25rem', display: 'flex', justifyContent: 'center' }}>
              <a href="/admin/messages" style={{
                fontSize: '0.78rem', color: '#818cf8',
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem',
              }}>
                Lihat semua pesan <ArrowUpRight size={13} />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer info ── */}
      <div style={{
        marginTop: '2rem', textAlign: 'center',
        fontSize: '0.72rem', color: 'rgba(255,255,255,0.18)',
        animation: 'fadeUp 0.5s ease 0.2s both',
      }}>
        <Star size={11} style={{ display: 'inline', marginRight: '0.35rem' }} />
        Data diperbarui setiap kali halaman dimuat · {user?.email}
      </div>
    </div>
  );
}
