import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0f', fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        width: '100%', maxWidth: '400px', padding: '2.5rem',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px', backdropFilter: 'blur(12px)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            fontSize: '1.5rem', fontWeight: 800, color: 'white',
            marginBottom: '1rem',
          }}>KA</div>
          <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Admin Panel</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Portfolio Manager
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>
              Email
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@email.com" required
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>
              Password
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '0.75rem 1rem', borderRadius: '10px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171', fontSize: '0.85rem',
            }}>{error}</div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              padding: '0.875rem', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', fontWeight: 600, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, marginTop: '0.5rem',
            }}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
