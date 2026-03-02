'use client';
import { useState, useEffect } from 'react';

const DEFAULT_CATS = ['Genel', 'İş', 'Okul', 'Kişisel'];
const CAT_COLORS = {
    'Genel': '#6366f1',
    'İş': '#f59e0b',
    'Okul': '#8b5cf6',
    'Kişisel': '#22d3a5',
    'Acil': '#f43f5e',
};
const RAND_PAL = ['#6366f1', '#ec4899', '#14b8a6', '#f97316', '#84cc16', '#a855f7', '#06b6d4', '#e11d48'];

export default function TodoModal({ mode, todo, categories, onSave, onClose }) {
    const isEdit = mode === 'edit';
    const [text, setText] = useState('');
    const [category, setCategory] = useState('Genel');
    const [priority, setPriority] = useState('normal');
    const [dueDate, setDueDate] = useState('');
    const [note, setNote] = useState('');
    const [status, setStatus] = useState('pending');
    const [error, setError] = useState('');

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (isEdit && todo) {
            setText(todo.text || '');
            setCategory(todo.category || 'Genel');
            setPriority(todo.priority || 'normal');
            setDueDate(todo.due_date || '');
            setNote(todo.note || '');
            setStatus(todo.is_failed ? 'failed' : todo.is_completed ? 'completed' : 'pending');
        } else {
            setText(''); setCategory(categories[0]?.name || categories[0] || 'Genel');
            setPriority('normal'); setDueDate(''); setNote(''); setStatus('pending');
        }
        setError('');
    }, [mode, todo]);

    function handleCategoryChange(e) {
        if (e.target.value === '__NEW__') {
            const name = window.prompt('Yeni kategori adı:');
            if (name && name.trim()) {
                onSave({ action: 'newCategory', name: name.trim() });
                setCategory(name.trim());
            }
            e.target.value = category;
        } else {
            setCategory(e.target.value);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!text.trim()) { setError('Lütfen bir görev başlığı gir!'); return; }
        onSave({
            action: isEdit ? 'update' : 'create',
            data: {
                text: text.trim(),
                category,
                priority,
                due_date: dueDate || null,
                note: note.trim() || null,
                is_completed: status === 'completed',
                is_failed: status === 'failed',
            }
        });
    }

    function getName(c) { return c?.name || c; }

    return (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-card">
                <div className="modal-header">
                    <div className="modal-title-wrap">
                        <div className="modal-icon" style={isEdit ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' } : {}}>
                            <i className={`fas ${isEdit ? 'fa-pen' : 'fa-plus-circle'}`}></i>
                        </div>
                        <h3>{isEdit ? 'Görevi Düzenle' : 'Yeni Görev'}</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}><i className="fas fa-xmark"></i></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && <div className="auth-error"><i className="fas fa-circle-exclamation"></i> {error}</div>}

                        <div className="form-field">
                            <label>Görev Başlığı *</label>
                            <input
                                type="text"
                                placeholder="Ne yapacaksın?"
                                value={text}
                                onChange={e => setText(e.target.value)}
                                autoFocus
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e); }}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label>Kategori</label>
                                <div className="select-wrap">
                                    <select value={category} onChange={handleCategoryChange}>
                                        {categories.map(c => (
                                            <option key={getName(c)} value={getName(c)}>{getName(c)}</option>
                                        ))}
                                        <option value="__NEW__">＋ Yeni Kategori...</option>
                                    </select>
                                    <i className="fas fa-chevron-down select-arrow"></i>
                                </div>
                            </div>
                            <div className="form-field">
                                <label>Öncelik</label>
                                <div className="select-wrap">
                                    <select value={priority} onChange={e => setPriority(e.target.value)}>
                                        <option value="normal">Normal</option>
                                        <option value="high">Yüksek</option>
                                        <option value="urgent">Acil</option>
                                    </select>
                                    <i className="fas fa-chevron-down select-arrow"></i>
                                </div>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Son Tarih <span className="optional">(opsiyonel)</span></label>
                            <input type="date" min={today} value={dueDate} onChange={e => setDueDate(e.target.value)} />
                        </div>

                        {isEdit && (
                            <div className="form-field">
                                <label>Durum</label>
                                <div className="status-toggle-group">
                                    {['pending', 'completed', 'failed'].map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            className={`status-toggle-btn ${status === s ? 'active' : ''}`}
                                            data-status={s}
                                            onClick={() => setStatus(s)}
                                        >
                                            <i className={`fas ${s === 'pending' ? 'fa-hourglass-half' : s === 'completed' ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
                                            {s === 'pending' ? 'Bekliyor' : s === 'completed' ? 'Tamamlandı' : 'Tamamlanamadı'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="form-field">
                            <label>Not <span className="optional">(opsiyonel)</span></label>
                            <textarea
                                placeholder="Eklemek istediğin bir not var mı?"
                                rows={3}
                                value={note}
                                onChange={e => setNote(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>İptal</button>
                        <button type="submit" className="btn-primary">
                            <i className={`fas ${isEdit ? 'fa-save' : 'fa-plus'}`}></i>
                            {isEdit ? 'Kaydet' : 'Görevi Ekle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
