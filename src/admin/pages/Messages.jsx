import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, MailOpen, Trash2, X } from 'lucide-react';

function MessageDetail({ msg, onClose, onRead }) {
  useEffect(() => {
    if (!msg.is_read) {
      supabase.from('messages').update({ is_read: true }).eq('id', msg.id).then(() => onRead());
    }
  }, [msg.id]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '560px', background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Detail Pesan</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Dari</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{msg.name}</div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Email</div>
              <a href={`mailto:${msg.email}`} style={{ color: '#a5b4fc', fontSize: '0.9rem' }}>{msg.email}</a>
            </div>
          </div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Subject</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{msg.subject || '-'}</div>
          </div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Pesan</div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '1rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{msg.message}</div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>
            Diterima: {new Date(msg.created_at).toLocaleString('id-ID')}
          </div>
        </div>
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`} style={{ padding: '0.7rem 1.25rem', borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
            Balas Email
          </a>
          <button onClick={onClose} style={{ padding: '0.7rem 1.25rem', borderRadius: '10px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: '0.875rem' }}>Tutup</button>
        </div>
      </div>
    </div>
  );
}

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all'); // all | unread | read

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    setMessages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Hapus pesan ini?')) return;
    await supabase.from('messages').delete().eq('id', id);
    fetchMessages();
  };

  const filtered = messages.filter(m => filter === 'all' ? true : filter === 'unread' ? !m.is_read : m.is_read);
  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Messages</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
          {messages.length} pesan · {unreadCount} belum dibaca
        </p>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['all', 'unread', 'read'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontSize: '0.82rem', fontWeight: 500, textTransform: 'capitalize',
            background: filter === f ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
            color: filter === f ? '#a5b4fc' : 'rgba(255,255,255,0.4)',
            border: filter === f ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
          }}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>Tidak ada pesan.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.map(msg => (
            <div key={msg.id} onClick={() => setSelected(msg)} style={{
              padding: '1rem 1.25rem', borderRadius: '12px', cursor: 'pointer',
              background: msg.is_read ? 'rgba(255,255,255,0.03)' : 'rgba(99,102,241,0.08)',
              border: msg.is_read ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(99,102,241,0.2)',
              display: 'flex', alignItems: 'center', gap: '1rem',
              transition: 'background 0.2s',
            }}>
              <div style={{ color: msg.is_read ? 'rgba(255,255,255,0.3)' : '#a5b4fc', flexShrink: 0 }}>
                {msg.is_read ? <MailOpen size={18} /> : <Mail size={18} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: msg.is_read ? 400 : 600, fontSize: '0.875rem' }}>{msg.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{msg.email}</span>
                  {!msg.is_read && <span style={{ background: '#6366f1', color: 'white', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '100px' }}>NEW</span>}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)', marginRight: '0.5rem' }}>{msg.subject}</span>
                  {msg.message}
                </div>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', flexShrink: 0 }}>
                {new Date(msg.created_at).toLocaleDateString('id-ID')}
              </div>
              <button onClick={(e) => handleDelete(msg.id, e)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', flexShrink: 0 }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <MessageDetail msg={selected} onClose={() => { setSelected(null); fetchMessages(); }} onRead={fetchMessages} />
      )}
    </div>
  );
}
