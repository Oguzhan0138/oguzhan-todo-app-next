'use client';

const CAT_COLORS = {
    'Genel': '#6366f1',
    'İş': '#f59e0b',
    'Okul': '#8b5cf6',
    'Kişisel': '#22d3a5',
    'Acil': '#f43f5e',
};
const RAND_PAL = ['#6366f1', '#ec4899', '#14b8a6', '#f97316', '#84cc16', '#a855f7', '#06b6d4', '#e11d48'];
function randColor() { return RAND_PAL[Math.floor(Math.random() * RAND_PAL.length)]; }

const PRIORITY_META = {
    normal: { label: 'Normal', icon: '' },
    high: { label: 'Yüksek', icon: 'fa-bolt' },
    urgent: { label: 'Acil', icon: 'fa-fire' },
};

function getCatColor(c) { return CAT_COLORS[c] || '#94a3b8'; }

function formatDue(dateStr) {
    if (!dateStr) return null;
    const due = new Date(dateStr + 'T00:00:00');
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const d = Math.ceil((due - now) / 86400000);
    const fmt = due.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    if (d < 0) return { text: `Geçti · ${fmt}`, cls: 'overdue' };
    if (d === 0) return { text: 'Bugün', cls: 'soon' };
    if (d <= 2) return { text: `${d}g kaldı`, cls: 'soon' };
    return { text: fmt, cls: '' };
}

function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default function TodoCard({ todo: t, isArchive, onAction, animationDelay }) {
    const color = getCatColor(t.category);
    const pMeta = PRIORITY_META[t.priority || 'normal'];
    const due = formatDue(t.due_date);

    let cardClass = 'task-card';
    if (t.is_completed) cardClass += ' completed';
    if (t.is_failed) cardClass += ' failed';

    return (
        <div
            className={cardClass}
            style={{ '--card-accent': color, animationDelay: `${animationDelay}ms` }}
        >
            {/* Top bar */}
            <div className="card-top-bar">
                <div className="card-badges">
                    <span className="cat-chip" style={{ background: `${color}22`, color, borderColor: `${color}55` }}>
                        <i className="fas fa-tag"></i>{t.category}
                    </span>
                    {t.priority && t.priority !== 'normal' && (
                        <span className={`priority-tag ${t.priority}`}>
                            <i className={`fas ${pMeta.icon}`}></i>{pMeta.label}
                        </span>
                    )}
                </div>
                {due && (
                    <span className={`due-pill ${due.cls}`}>
                        <i className="fas fa-calendar-days"></i>{due.text}
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="card-body">
                <h3 className="card-title">{t.text}</h3>
                {t.note && (
                    <p className="card-note">
                        <i className="fas fa-note-sticky"></i>{t.note}
                    </p>
                )}
            </div>

            {/* Status chip */}
            {(t.is_failed || t.is_completed) && (
                <div className="card-status-row">
                    {t.is_failed
                        ? <span className="status-chip chip-failed"><i className="fas fa-circle-xmark"></i>Tamamlanamadı</span>
                        : <span className="status-chip chip-done"><i className="fas fa-circle-check"></i>Tamamlandı</span>
                    }
                </div>
            )}

            {/* Footer actions */}
            <div className="card-footer">
                {isArchive ? (
                    <div className="card-actions">
                        <div className="ca-text-row">
                            <button className="ca-text-btn ca-restore" onClick={() => onAction('restore', t.id)}>
                                <i className="fas fa-rotate-left"></i> Geri Yükle
                            </button>
                            <button className="ca-text-btn ca-delete" onClick={() => onAction('delete', t.id)}>
                                <i className="fas fa-trash"></i> Sil
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="card-actions">
                        {!t.is_completed && !t.is_failed && (
                            <div className="ca-status-row">
                                <button className="ca-status-btn ca-status-done" title="Tamamlandı" onClick={() => onAction('complete', t.id)}>
                                    <i className="fas fa-check"></i>
                                </button>
                                <button className="ca-status-btn ca-status-fail" title="Tamamlanamadı" onClick={() => onAction('fail', t.id)}>
                                    <i className="fas fa-xmark"></i>
                                </button>
                            </div>
                        )}
                        <div className="ca-text-row">
                            <button className="ca-text-btn ca-edit" onClick={() => onAction('edit', t.id)}>
                                <i className="fas fa-pen-to-square"></i> Düzenle
                            </button>
                            <button className="ca-text-btn ca-archive-t" onClick={() => onAction('archive', t.id)}>
                                <i className="fas fa-box-archive"></i> Arşivle
                            </button>
                            <button className="ca-text-btn ca-del-t" onClick={() => onAction('delete', t.id)}>
                                <i className="fas fa-trash"></i> Sil
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
