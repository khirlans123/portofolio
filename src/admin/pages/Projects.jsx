import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { projects as sampleProjects } from '../../data/projects';
import { 
  Plus, Pencil, Trash2, X, Save, ExternalLink, Code2, 
  Upload, Image, AlertCircle, CheckCircle2, Sparkles, Copy, Check 
} from 'lucide-react';

const KNOWN_CATEGORIES = ['design', 'web', 'branding', 'video'];

const CATEGORY_COLORS = {
  design: '#6366f1',
  web: '#8b5cf6',
  branding: '#22d3ee',
  video: '#a855f7',
};

const EMPTY = {
  title: '',
  description: '',
  image_url: '',
  demo_url: '',
  github_url: '',
  tags: '',
  tools: '',
  category: 'design',
  color: '#6366f1',
  featured: false,
  order_index: 0,
};

function Modal({ project, onClose, onSave }) {
  // Parsing nilai awal jika sedang edit
  const initialData = () => {
    if (!project) return EMPTY;

    const existingTags = Array.isArray(project.tags) ? project.tags : [];
    const catFromTags = existingTags.find(t => KNOWN_CATEGORIES.includes(t?.toLowerCase()));
    const category = (project.category || catFromTags || 'design').toLowerCase();

    // Saring tag kategori agar tidak duplikat di input teks
    const cleanTags = existingTags.filter(t => !KNOWN_CATEGORIES.includes(t?.toLowerCase()));
    const tools = Array.isArray(project.tools) ? project.tools : [];

    return {
      ...project,
      category,
      color: project.color || CATEGORY_COLORS[category] || '#6366f1',
      tags: cleanTags.join(', '),
      tools: tools.join(', '),
      image_url: project.image_url || '',
      demo_url: project.demo_url || '',
      github_url: project.github_url || '',
      description: project.description || '',
      featured: Boolean(project.featured),
      order_index: project.order_index ?? 0,
    };
  };

  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(project?.image_url || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef(null);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => {
      const updated = { ...f, [name]: type === 'checkbox' ? checked : value };
      if (name === 'category' && (!f.color || Object.values(CATEGORY_COLORS).includes(f.color))) {
        updated.color = CATEGORY_COLORS[value] || '#6366f1';
      }
      return updated;
    });

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

    // Tampilkan preview lokal langsung
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      const ext = file.name.split('.').pop() || 'png';
      const cleanName = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const fileName = `projects/${cleanName}`;

      const { error: uploadErr } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file, { upsert: true });

      if (uploadErr) {
        console.error('Storage upload error:', uploadErr);
        setUploadError(`Upload storage gagal (${uploadErr.message}). Anda tetap bisa memasukkan URL gambar langsung di kolom URL di bawah.`);
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
      console.error('Unexpected error during image upload:', err);
      setUploadError(`Error upload: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setErrorMessage('Judul project wajib diisi!');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    const rawTags = typeof form.tags === 'string'
      ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
      : (form.tags || []);

    const rawTools = typeof form.tools === 'string'
      ? form.tools.split(',').map(t => t.trim()).filter(Boolean)
      : (form.tools || []);

    const category = (form.category || 'design').toLowerCase();

    // Selipkan category di tags sebagai fallback jika kolom category belum ada di tabel projects
    const tagsWithCategory = Array.from(new Set([category, ...rawTags]));

    // Payload lengkap (jika kolom category, tools, color sudah ada di Supabase)
    const fullPayload = {
      title: form.title.trim(),
      description: form.description ? form.description.trim() : '',
      image_url: form.image_url ? form.image_url.trim() : '',
      demo_url: form.demo_url ? form.demo_url.trim() : '',
      github_url: form.github_url ? form.github_url.trim() : '',
      tags: tagsWithCategory,
      tools: rawTools,
      category: category,
      color: form.color ? form.color.trim() : '#6366f1',
      featured: Boolean(form.featured),
      order_index: parseInt(form.order_index, 10) || 0,
    };

    let res;
    if (project?.id) {
      res = await supabase.from('projects').update(fullPayload).eq('id', project.id);
    } else {
      res = await supabase.from('projects').insert(fullPayload);
    }

    // Jika Supabase error karena kolom 'category' / 'tools' / 'color' belum dibuat di tabel:
    if (res.error && (res.error.code === 'PGRST204' || res.error.message?.includes('schema cache') || res.error.message?.includes('column'))) {
      console.warn('Menyimpan dengan skema dasar (kompatibilitas kolom Supabase)...', res.error.message);
      
      const compatiblePayload = {
        title: form.title.trim(),
        description: form.description ? form.description.trim() : '',
        image_url: form.image_url ? form.image_url.trim() : '',
        demo_url: form.demo_url ? form.demo_url.trim() : '',
        github_url: form.github_url ? form.github_url.trim() : '',
        tags: tagsWithCategory,
        featured: Boolean(form.featured),
        order_index: parseInt(form.order_index, 10) || 0,
      };

      if (project?.id) {
        res = await supabase.from('projects').update(compatiblePayload).eq('id', project.id);
      } else {
        res = await supabase.from('projects').insert(compatiblePayload);
      }
    }

    if (res.error) {
      console.error('Gagal menyimpan project:', res.error);
      setErrorMessage(`Gagal menyimpan: ${res.error.message || 'Terjadi kesalahan sistem'}`);
      setSaving(false);
      return;
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
  const labelStyle = { color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', display: 'block', marginBottom: '0.35rem' };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div style={{
        width: '100%', maxWidth: '580px', maxHeight: '90vh', overflow: 'auto',
        background: '#111118', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '20px', padding: '1.75rem', boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'white' }}>
            {project?.id ? 'Edit Project' : 'Tambah Project Baru'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {errorMessage && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
            padding: '0.85rem 1rem', borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#fca5a5', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5,
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{errorMessage}</div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={labelStyle}>Judul Project *</label>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              style={inputStyle} 
              placeholder="Contoh: Modern SaaS Dashboard" 
            />
          </div>

          <div>
            <label style={labelStyle}>Deskripsi</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              rows={3} 
              style={{ ...inputStyle, resize: 'vertical' }} 
              placeholder="Deskripsi singkat mengenai project ini..." 
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Kategori</label>
              <select name="category" value={form.category} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="design">Design (UI/UX)</option>
                <option value="web">Web Development</option>
                <option value="branding">Branding & Logo</option>
                <option value="video">Video & Motion</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Warna Tema (Hex)</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="color" 
                  name="color" 
                  value={form.color || '#6366f1'} 
                  onChange={handleChange} 
                  style={{ width: '38px', height: '38px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} 
                />
                <input 
                  name="color" 
                  value={form.color} 
                  onChange={handleChange} 
                  style={inputStyle} 
                  placeholder="#6366f1" 
                />
              </div>
            </div>
          </div>

          {/* Gambar Project */}
          <div>
            <label style={labelStyle}>Gambar Project</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            
            {preview ? (
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => fileRef.current?.click()}>
                <img src={preview} alt="Preview" style={{ width: '100%', height: '170px', objectFit: 'cover', display: 'block' }} />
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                >
                  <div style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Upload size={16} /> {uploading ? 'Mengunggah...' : 'Klik untuk Ganti Gambar'}
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  border: '2px dashed rgba(255,255,255,0.15)', borderRadius: '12px',
                  padding: '1.75rem', textAlign: 'center', cursor: 'pointer',
                  transition: 'border-color 0.2s, background 0.2s',
                  background: 'rgba(255,255,255,0.02)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'; e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
              >
                <Image size={32} style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem' }} />
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', fontWeight: 500 }}>
                  {uploading ? 'Sedang mengunggah ke Supabase Storage...' : 'Klik untuk upload gambar dari perangkat'}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  PNG, JPG, WebP
                </div>
              </div>
            )}

            {uploadError && (
              <div style={{
                marginTop: '0.5rem', padding: '0.6rem 0.8rem', borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#fcd34d', fontSize: '0.8rem', lineHeight: 1.4,
              }}>
                {uploadError}
              </div>
            )}

            <div style={{ marginTop: '0.75rem' }}>
              <label style={{ ...labelStyle, fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>
                Atau masukkan URL Gambar langsung (misal: Unsplash, Cloudinary):
              </label>
              <input 
                name="image_url" 
                value={form.image_url} 
                onChange={handleChange} 
                style={inputStyle} 
                placeholder="https://images.unsplash.com/photo-..." 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Demo / Live Link</label>
              <input name="demo_url" value={form.demo_url} onChange={handleChange} style={inputStyle} placeholder="https://..." />
            </div>
            <div>
              <label style={labelStyle}>GitHub URL</label>
              <input name="github_url" value={form.github_url} onChange={handleChange} style={inputStyle} placeholder="https://github.com/..." />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Tags (pisahkan koma)</label>
            <input name="tags" value={form.tags} onChange={handleChange} style={inputStyle} placeholder="UI/UX, Mobile, Fintech" />
          </div>

          <div>
            <label style={labelStyle}>Tools / Teknologi (pisahkan koma)</label>
            <input name="tools" value={form.tools} onChange={handleChange} style={inputStyle} placeholder="React, Figma, Tailwind" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Order Index (Urutan)</label>
              <input name="order_index" type="number" value={form.order_index} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingTop: '1.5rem' }}>
              <input 
                type="checkbox" 
                id="featured" 
                name="featured" 
                checked={form.featured} 
                onChange={handleChange} 
                style={{ width: '18px', height: '18px', accentColor: '#6366f1', cursor: 'pointer' }} 
              />
              <label htmlFor="featured" style={{ ...labelStyle, margin: 0, cursor: 'pointer', fontWeight: 600, color: 'white' }}>
                Featured Project
              </label>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', justifyContent: 'flex-end' }}>
          <button 
            type="button"
            onClick={onClose} 
            style={{ 
              padding: '0.7rem 1.25rem', borderRadius: '10px', 
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', 
              color: 'white', cursor: 'pointer', fontSize: '0.875rem' 
            }}
          >
            Batal
          </button>
          <button 
            type="button"
            onClick={handleSave} 
            disabled={saving || uploading} 
            style={{ 
              padding: '0.7rem 1.4rem', borderRadius: '10px', 
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', 
              color: 'white', cursor: (saving || uploading) ? 'not-allowed' : 'pointer', 
              fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', 
              opacity: (saving || uploading) ? 0.7 : 1, boxShadow: '0 4px 15px rgba(99,102,241,0.35)' 
            }}
          >
            <Save size={15} />
            {saving ? 'Menyimpan...' : (project?.id ? 'Simpan Perubahan' : 'Tambah Project')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | project object
  const [statusMsg, setStatusMsg] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlTip, setShowSqlTip] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('order_index');
    if (error) {
      console.error('Error fetching projects:', error);
    }
    setProjects(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus project ini?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      alert(`Gagal menghapus project: ${error.message}`);
      return;
    }
    setStatusMsg({ type: 'success', text: 'Project berhasil dihapus!' });
    setTimeout(() => setStatusMsg(null), 3000);
    fetchProjects();
  };

  // Muat proyek contoh ke Supabase jika masih kosong
  const handleSeedSampleProjects = async () => {
    if (!confirm('Impor 6 project contoh ke Supabase? Anda tetap bisa mengedit atau menghapusnya nanti.')) return;
    setSeeding(true);

    try {
      for (let i = 0; i < sampleProjects.length; i++) {
        const sp = sampleProjects[i];
        const tagsWithCategory = Array.from(new Set([sp.category, ...(sp.tags || [])]));

        const fullPayload = {
          title: sp.title,
          description: sp.description,
          image_url: sp.image,
          demo_url: sp.link && sp.link !== '#' ? sp.link : '',
          github_url: '',
          tags: tagsWithCategory,
          tools: sp.tools || [],
          category: sp.category,
          color: sp.color || '#6366f1',
          featured: Boolean(sp.featured),
          order_index: i,
        };

        let res = await supabase.from('projects').insert(fullPayload);

        // Fallback jika kolom category/tools belum ada
        if (res.error && (res.error.code === 'PGRST204' || res.error.message?.includes('schema cache'))) {
          const compatiblePayload = {
            title: sp.title,
            description: sp.description,
            image_url: sp.image,
            demo_url: sp.link && sp.link !== '#' ? sp.link : '',
            github_url: '',
            tags: tagsWithCategory,
            featured: Boolean(sp.featured),
            order_index: i,
          };
          res = await supabase.from('projects').insert(compatiblePayload);
        }

        if (res.error) {
          console.error(`Gagal mengimpor ${sp.title}:`, res.error);
        }
      }

      setStatusMsg({ type: 'success', text: '6 Proyek contoh berhasil diimpor ke database!' });
      setTimeout(() => setStatusMsg(null), 4000);
      fetchProjects();
    } catch (err) {
      alert(`Gagal mengimpor: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const sqlCode = `ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS category text DEFAULT 'design',
ADD COLUMN IF NOT EXISTS tools text[],
ADD COLUMN IF NOT EXISTS color text DEFAULT '#6366f1';`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div>
      {/* Top Banner / Notifikasi */}
      {statusMsg && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.85rem 1.25rem', borderRadius: '12px',
          background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)',
          color: '#86efac', marginBottom: '1.5rem', fontSize: '0.9rem',
        }}>
          <CheckCircle2 size={18} />
          {statusMsg.text}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'white' }}>Projects</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
            {projects.length} project aktif di database (tampil langsung di portofolio)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={() => setShowSqlTip(!showSqlTip)} 
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.65rem 1rem', borderRadius: '10px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '0.825rem', fontWeight: 500,
            }}
          >
            💡 Info Supabase
          </button>

          <button 
            onClick={() => setModal('add')} 
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.7rem 1.25rem', borderRadius: '10px',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none',
              color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
              boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
            }}
          >
            <Plus size={16} /> New Project
          </button>
        </div>
      </div>

      {/* SQL Helper Tip Card */}
      {showSqlTip && (
        <div style={{
          background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#c7d2fe' }}>
              ℹ️ Catatan Sinkronisasi Kolom Supabase
            </div>
            <button 
              onClick={copySql}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.35rem 0.75rem', borderRadius: '6px',
                background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
                color: '#e0e7ff', fontSize: '0.75rem', cursor: 'pointer',
              }}
            >
              {copiedSql ? <Check size={13} /> : <Copy size={13} />}
              {copiedSql ? 'Tersalin!' : 'Salin SQL'}
            </button>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.825rem', lineHeight: 1.6, margin: '0 0 0.75rem' }}>
            Sistem saat ini sudah otomatis mendukung penyimpanan project meskipun kolom belum dibuat (kategori otomatis diselipkan di dalam tags). 
            Namun jika Anda ingin kolom <code style={{ color: '#a5b4fc' }}>category</code>, <code style={{ color: '#a5b4fc' }}>tools</code>, dan <code style={{ color: '#a5b4fc' }}>color</code> tersimpan di kolom native Supabase, jalankan SQL ini di <strong>Supabase Dashboard &rarr; SQL Editor</strong>:
          </p>
          <pre style={{
            background: 'rgba(0,0,0,0.4)', padding: '0.75rem 1rem', borderRadius: '8px',
            color: '#a5b4fc', fontSize: '0.78rem', overflowX: 'auto', margin: 0,
            fontFamily: 'monospace',
          }}>{sqlCode}</pre>
        </div>
      )}

      {/* Main List */}
      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.4)', padding: '3rem 0', textAlign: 'center' }}>
          Memuat daftar project...
        </div>
      ) : projects.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '4rem 2rem',
          borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', marginBottom: '1.25rem' }}>
            Belum ada project di database Supabase.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setModal('add')} 
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.4rem', borderRadius: '10px',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none',
                color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
              }}
            >
              <Plus size={16} /> Buat Project Pertama
            </button>
            <button 
              onClick={handleSeedSampleProjects}
              disabled={seeding}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.4rem', borderRadius: '10px',
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                color: 'white', cursor: seeding ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: 500,
              }}
            >
              <Sparkles size={16} style={{ color: '#f59e0b' }} />
              {seeding ? 'Mengimpor Proyek...' : 'Impor 6 Proyek Contoh Bawaan'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {projects.map(p => {
            const cat = p.category || (Array.isArray(p.tags) && p.tags.find(t => KNOWN_CATEGORIES.includes(t?.toLowerCase()))) || 'design';
            const displayTags = Array.isArray(p.tags) ? p.tags.filter(t => !KNOWN_CATEGORIES.includes(t?.toLowerCase())) : [];
            const badgeColor = CATEGORY_COLORS[cat.toLowerCase()] || '#6366f1';

            return (
              <div key={p.id} style={{
                borderRadius: '16px', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ height: '170px', background: 'rgba(255,255,255,0.03)', position: 'relative' }}>
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
                      Tidak ada gambar
                    </div>
                  )}
                  {/* Badge Kategori */}
                  <span style={{
                    position: 'absolute', top: '0.75rem', left: '0.75rem',
                    background: `${badgeColor}30`, border: `1px solid ${badgeColor}60`,
                    color: badgeColor, fontSize: '0.7rem', fontWeight: 700,
                    padding: '0.2rem 0.6rem', borderRadius: '100px',
                    backdropFilter: 'blur(6px)', textTransform: 'uppercase',
                  }}>
                    {cat}
                  </span>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'white' }}>{p.title}</h3>
                    {p.featured && (
                      <span style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '100px', flexShrink: 0 }}>
                        Featured
                      </span>
                    )}
                  </div>

                  {p.description && (
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.825rem', lineHeight: 1.6, margin: '0 0 0.85rem' }}>
                      {p.description.slice(0, 110)}{p.description.length > 110 ? '...' : ''}
                    </p>
                  )}

                  {displayTags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                      {displayTags.slice(0, 4).map(tag => (
                        <span key={tag} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {p.demo_url && (
                      <a href={p.demo_url} target="_blank" rel="noopener noreferrer" title="Live Preview" style={{ color: 'rgba(255,255,255,0.5)', display: 'flex', padding: '4px' }}>
                        <ExternalLink size={15} />
                      </a>
                    )}
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noopener noreferrer" title="GitHub Repository" style={{ color: 'rgba(255,255,255,0.5)', display: 'flex', padding: '4px' }}>
                        <Code2 size={15} />
                      </a>
                    )}
                    <div style={{ flex: 1 }} />
                    <button 
                      onClick={() => setModal(p)} 
                      style={{ 
                        background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', 
                        color: '#a5b4fc', padding: '0.45rem 0.85rem', borderRadius: '8px', 
                        cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem',
                      }}
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      style={{ 
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', 
                        color: '#f87171', padding: '0.45rem 0.85rem', borderRadius: '8px', 
                        cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem',
                      }}
                    >
                      <Trash2 size={12} /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Tambah/Edit */}
      {modal && (
        <Modal
          project={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => {
            setModal(null);
            setStatusMsg({ type: 'success', text: modal === 'add' ? 'Project baru berhasil disimpan!' : 'Perubahan project berhasil disimpan!' });
            setTimeout(() => setStatusMsg(null), 3000);
            fetchProjects();
          }}
        />
      )}
    </div>
  );
}
