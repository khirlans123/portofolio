import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, X, Save, ExternalLink, Upload, Image, AlertCircle } from 'lucide-react';

const EMPTY = { title: '', issuer: '', date: '', image_url: '', credential_url: '', order_index: 0 };

const FALLBACK_CERT_IMAGE = 'https://images.unsplash.com/photo-1589330694653-dad6bc01cf0e?w=800&q=80';

function Modal({ cert, onClose, onSave }) {
  const [form, setForm] = useState(cert ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(cert?.image_url || '');
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'image_url') {
      setPreview(value);
      setUploadError('');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError('');
    setUploading(true);

    // Tampilkan preview lokal sementara
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      const ext = file.name.split('.').pop() || 'png';
      const cleanName = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const fileName = `certificates/${cleanName}`;

      const { error: uploadErr } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file, { upsert: true });

      if (uploadErr) {
        console.error('Storage upload error:', uploadErr);
        setUploadError(`Upload storage gagal (${uploadErr.message}). Silakan masukkan link/URL gambar langsung di kolom Image URL di bawah.`);
      } else {
        const { data: urlData } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(fileName);

        if (urlData?.publicUrl) {
          setForm(f => ({ ...f, image_url: urlData.publicUrl }));
          setPreview(urlData.publicUrl);
        }
      }
    } catch (err) {
      console.error('Unexpected upload error:', err);
      setUploadError(`Error upload: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.issuer.trim()) return;
    setSaving(true);
    if (cert?.id) {
      await supabase.from('certificates').update(form).eq('id', cert.id);
    } else {
      await supabase.from('certificates').insert(form);
    }
    setSaving(false);
    onSave();
  };

  const inputStyle = {
    width: '100%', padding: '0.7rem 0.875rem', borderRadius: '10px',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    color: 'white', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
  };
  const labelStyle = { color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', display: 'block', marginBottom: '0.35rem' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '520px', maxHeight: '90vh', overflow: 'auto', background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{cert?.id ? 'Edit Certificate' : 'Add Certificate'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div><label style={labelStyle}>Title *</label><input name="title" value={form.title} onChange={handleChange} style={inputStyle} placeholder="Contoh: Google UX Design Professional" /></div>
          <div><label style={labelStyle}>Issuer *</label><input name="issuer" value={form.issuer} onChange={handleChange} style={inputStyle} placeholder="Contoh: Coursera, Google, Dicoding" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><label style={labelStyle}>Date / Tahun</label><input name="date" value={form.date} onChange={handleChange} style={inputStyle} placeholder="2024" /></div>
            <div><label style={labelStyle}>Order Index</label><input name="order_index" type="number" value={form.order_index} onChange={handleChange} style={inputStyle} /></div>
          </div>

          {/* Image Upload & URL */}
          <div>
            <label style={labelStyle}>Gambar Sertifikat</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            
            {preview ? (
              <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => fileRef.current?.click()}>
                <img src={preview} alt="Preview" style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                  <div style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Upload size={16} />{uploading ? 'Uploading...' : 'Ganti Gambar File'}
                  </div>
                </div>
              </div>
            ) : (
              <div onClick={() => fileRef.current?.click()}
                style={{ border: '2px dashed rgba(255,255,255,0.15)', borderRadius: '10px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s', marginBottom: '0.75rem' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}>
                <Image size={26} style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem' }} />
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 500 }}>{uploading ? 'Uploading...' : 'Klik untuk upload file gambar'}</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '0.25rem' }}>PNG, JPG, WebP</div>
              </div>
            )}

            {uploadError && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', color: '#f87171', fontSize: '0.78rem', background: 'rgba(239,68,68,0.1)', padding: '0.5rem 0.75rem', borderRadius: '8px', marginBottom: '0.75rem', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Kolom URL Langsung */}
            <div>
              <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Atau masukkan Image URL langsung (Unsplash, Drive, dll):</label>
              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                style={inputStyle}
                placeholder="https://images.unsplash.com/... atau URL gambar lainnya"
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Credential / Verification URL</label>
            <input name="credential_url" value={form.credential_url} onChange={handleChange} style={inputStyle} placeholder="https://coursera.org/verify/... atau link sertifikat" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '0.7rem 1.25rem', borderRadius: '10px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving || uploading} style={{ padding: '0.7rem 1.25rem', borderRadius: '10px', background: 'linear-gradient(135deg,#f59e0b,#f97316)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: (saving || uploading) ? 0.7 : 1 }}>
            <Save size={15} />{saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const fetchCerts = async () => {
    setLoading(true);
    const { data } = await supabase.from('certificates').select('*').order('order_index');
    setCerts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCerts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Hapus certificate ini?')) return;
    await supabase.from('certificates').delete().eq('id', id);
    fetchCerts();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Certificates</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem', fontSize: '0.9rem' }}>{certs.length} certificate total</p>
        </div>
        <button onClick={() => setModal('add')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.25rem', borderRadius: '10px', background: 'linear-gradient(135deg,#f59e0b,#f97316)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
          <Plus size={16} /> Add Certificate
        </button>
      </div>

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
      ) : certs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>Belum ada certificate.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {certs.map(c => {
            const cardImg = c.image_url?.trim() || FALLBACK_CERT_IMAGE;
            return (
              <div key={c.id} style={{ borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div style={{ height: '140px', overflow: 'hidden', background: '#1a1a24' }}>
                  <img
                    src={cardImg}
                    alt={c.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.currentTarget.src = FALLBACK_CERT_IMAGE; }}
                  />
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 0.25rem' }}>{c.title}</h3>
                  <div style={{ color: '#fbbf24', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{c.issuer}</div>
                  {c.date && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>{c.date}</div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {c.credential_url && <a href={c.credential_url} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', display: 'flex' }}><ExternalLink size={14} /></a>}
                    <div style={{ flex: 1 }} />
                    <button onClick={() => setModal(c)} style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', padding: '0.4rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => handleDelete(c.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '0.4rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <Modal cert={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={() => { setModal(null); fetchCerts(); }} />
      )}
    </div>
  );
}
