import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { User, Lock, Save, CheckCircle2, AlertCircle, Eye, EyeOff, Mail, Shield } from 'lucide-react';

const inputStyle = {
  width: '100%',
  padding: '0.8rem 1rem',
  borderRadius: '12px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'white',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 0.2s',
};

const labelStyle = {
  color: 'rgba(255,255,255,0.6)',
  fontSize: '0.8rem',
  fontWeight: 600,
  display: 'block',
  marginBottom: '0.5rem',
  letterSpacing: '0.03em',
};

function Alert({ type, message }) {
  if (!message) return null;
  const isSuccess = type === 'success';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      padding: '0.8rem 1rem', borderRadius: '10px',
      background: isSuccess ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
      border: `1px solid ${isSuccess ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
      color: isSuccess ? '#4ade80' : '#f87171',
      fontSize: '0.875rem',
    }}>
      {isSuccess ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      <span>{message}</span>
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder, id }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...inputStyle, paddingRight: '3rem' }}
        onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        style={{
          position: 'absolute', right: '0.875rem', top: '50%',
          transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.4)', display: 'flex', padding: 0,
        }}
      >
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}

function Card({ icon: Icon, title, subtitle, children }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px',
      overflow: 'hidden',
    }}>
      {/* Card Header */}
      <div style={{
        padding: '1.5rem 1.75rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: '0.875rem',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '12px',
          background: 'rgba(99,102,241,0.15)',
          border: '1px solid rgba(99,102,241,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={20} style={{ color: '#818cf8' }} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>{title}</div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>{subtitle}</div>
        </div>
      </div>
      {/* Card Body */}
      <div style={{ padding: '1.75rem' }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Change Email Section ───────────────────────────────────── */
function ChangeEmailSection({ user }) {
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email.trim() || email === user?.email) {
      setStatus({ type: 'error', msg: 'Email baru harus berbeda dengan email saat ini.' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ type: 'error', msg: 'Format email tidak valid.' });
      return;
    }

    setSaving(true);
    setStatus({ type: '', msg: '' });

    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      setStatus({ type: 'error', msg: `Gagal mengubah email: ${error.message}` });
    } else {
      setStatus({ type: 'success', msg: 'Link konfirmasi telah dikirim ke email baru. Silakan cek inbox dan konfirmasi perubahan.' });
    }
    setSaving(false);
  };

  return (
    <Card icon={Mail} title="Ubah Email / Username" subtitle="Email digunakan untuk login ke admin panel">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={labelStyle} htmlFor="current-email">Email Saat Ini</label>
          <input
            id="current-email"
            type="email"
            value={user?.email || ''}
            disabled
            style={{
              ...inputStyle,
              background: 'rgba(255,255,255,0.02)',
              color: 'rgba(255,255,255,0.4)',
              cursor: 'not-allowed',
            }}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="new-email">Email Baru</label>
          <input
            id="new-email"
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setStatus({ type: '', msg: '' }); }}
            placeholder="email@baru.com"
            style={inputStyle}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          <p style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
            Setelah disimpan, email konfirmasi akan dikirim ke alamat email baru.
          </p>
        </div>

        <Alert type={status.type} message={status.msg} />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.5rem', borderRadius: '10px',
              background: saving ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', color: 'white', cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem', fontWeight: 600,
              transition: 'opacity 0.2s',
              opacity: saving ? 0.7 : 1,
            }}
          >
            <Save size={16} />
            {saving ? 'Menyimpan...' : 'Simpan Email Baru'}
          </button>
        </div>
      </form>
    </Card>
  );
}

/* ─── Change Password Section ────────────────────────────────── */
function ChangePasswordSection() {
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const set = field => e => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setStatus({ type: '', msg: '' });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.newPassword.trim()) {
      setStatus({ type: 'error', msg: 'Password baru tidak boleh kosong.' });
      return;
    }
    if (form.newPassword.length < 6) {
      setStatus({ type: 'error', msg: 'Password minimal 6 karakter.' });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: 'error', msg: 'Password baru dan konfirmasi tidak cocok.' });
      return;
    }

    setSaving(true);
    setStatus({ type: '', msg: '' });

    const { error } = await supabase.auth.updateUser({ password: form.newPassword });

    if (error) {
      setStatus({ type: 'error', msg: `Gagal mengubah password: ${error.message}` });
    } else {
      setStatus({ type: 'success', msg: 'Password berhasil diubah! Harap gunakan password baru untuk login berikutnya.' });
      setForm({ newPassword: '', confirmPassword: '' });
    }
    setSaving(false);
  };

  const strength = (() => {
    const p = form.newPassword;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: 'Lemah', color: '#ef4444', width: '25%' };
    if (score === 2) return { label: 'Cukup', color: '#f59e0b', width: '50%' };
    if (score === 3) return { label: 'Kuat', color: '#22c55e', width: '75%' };
    return { label: 'Sangat Kuat', color: '#6366f1', width: '100%' };
  })();

  return (
    <Card icon={Lock} title="Ubah Password" subtitle="Gunakan password yang kuat dan unik">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={labelStyle} htmlFor="new-password">Password Baru</label>
          <PasswordInput
            id="new-password"
            value={form.newPassword}
            onChange={set('newPassword')}
            placeholder="Masukkan password baru (min. 6 karakter)"
          />
          {/* Strength Indicator */}
          {strength && (
            <div style={{ marginTop: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Kekuatan Password</span>
                <span style={{ fontSize: '0.72rem', color: strength.color, fontWeight: 600 }}>{strength.label}</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: strength.width,
                  background: strength.color, borderRadius: '2px',
                  transition: 'width 0.3s, background 0.3s',
                }} />
              </div>
            </div>
          )}
        </div>

        <div>
          <label style={labelStyle} htmlFor="confirm-password">Konfirmasi Password Baru</label>
          <PasswordInput
            id="confirm-password"
            value={form.confirmPassword}
            onChange={set('confirmPassword')}
            placeholder="Ulangi password baru"
          />
          {form.confirmPassword && form.newPassword !== form.confirmPassword && (
            <p style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#f87171' }}>
              ⚠️ Password tidak cocok
            </p>
          )}
          {form.confirmPassword && form.newPassword === form.confirmPassword && form.newPassword && (
            <p style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#4ade80' }}>
              ✓ Password cocok
            </p>
          )}
        </div>

        <Alert type={status.type} message={status.msg} />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.5rem', borderRadius: '10px',
              background: saving ? 'rgba(139,92,246,0.4)' : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              border: 'none', color: 'white', cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem', fontWeight: 600,
              opacity: saving ? 0.7 : 1,
            }}
          >
            <Shield size={16} />
            {saving ? 'Menyimpan...' : 'Simpan Password Baru'}
          </button>
        </div>
      </form>
    </Card>
  );
}

/* ─── Account Info Section ───────────────────────────────────── */
function AccountInfoSection({ user }) {
  return (
    <div style={{
      background: 'rgba(99,102,241,0.06)',
      border: '1px solid rgba(99,102,241,0.2)',
      borderRadius: '16px',
      padding: '1.25rem 1.5rem',
      display: 'flex', alignItems: 'center', gap: '1rem',
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.25rem', fontWeight: 800, color: 'white',
        flexShrink: 0, fontFamily: 'Syne, sans-serif',
      }}>
        {(user?.email?.[0] || 'A').toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white' }}>Admin Account</div>
        <div style={{
          fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          marginTop: '0.15rem',
        }}>
          {user?.email || '—'}
        </div>
        <div style={{ fontSize: '0.72rem', color: '#818cf8', marginTop: '0.2rem' }}>
          UID: {user?.id?.slice(0, 16)}...
        </div>
      </div>
      <div style={{
        padding: '0.25rem 0.75rem', borderRadius: '100px',
        background: 'rgba(34,197,94,0.15)',
        border: '1px solid rgba(34,197,94,0.3)',
        color: '#4ade80', fontSize: '0.72rem', fontWeight: 700,
        flexShrink: 0,
      }}>
        ● Aktif
      </div>
    </div>
  );
}

/* ─── Settings Page ──────────────────────────────────────────── */
export default function Settings() {
  const { user } = useAuth();

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Pengaturan Akun</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
          Kelola kredensial dan keamanan akun admin Anda
        </p>
      </div>

      {/* Account Info Card */}
      <div style={{ marginBottom: '2rem' }}>
        <AccountInfoSection user={user} />
      </div>

      {/* Form Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <ChangeEmailSection user={user} />
        <ChangePasswordSection />
      </div>

      {/* Security Tips */}
      <div style={{
        marginTop: '2rem',
        padding: '1.25rem 1.5rem',
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          💡 Tips Keamanan
        </div>
        <ul style={{ margin: 0, padding: '0 0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {[
            'Gunakan password minimal 8 karakter dengan kombinasi huruf besar, angka, dan simbol.',
            'Jangan bagikan password atau akses admin kepada pihak lain.',
            'Aktifkan notifikasi email untuk memantau perubahan akun.',
            'Logout setelah selesai menggunakan panel admin.',
          ].map((tip, i) => (
            <li key={i} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
