'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import TodoCard from '@/components/TodoCard';
import TodoModal from '@/components/TodoModal';

const DEFAULT_CATS = ['Genel', 'İş', 'Okul', 'Kişisel'];
const CAT_COLORS = {
    'Genel': '#6366f1', 'İş': '#f59e0b',
    'Okul': '#8b5cf6', 'Kişisel': '#22d3a5', 'Acil': '#f43f5e',
};
const RAND_PAL = ['#6366f1', '#ec4899', '#14b8a6', '#f97316', '#84cc16', '#a855f7', '#06b6d4', '#e11d48'];

function notify(msg, type = 'success') {
    if (typeof window === 'undefined' || !window.Toastify) return;
    const bg = {
        success: 'linear-gradient(135deg,#22d3a5,#059669)',
        error: 'linear-gradient(135deg,#f43f5e,#be123c)',
        info: 'linear-gradient(135deg,#6366f1,#4f46e5)',
        warning: 'linear-gradient(135deg,#f59e0b,#d97706)',
    }[type];
    window.Toastify({
        text: msg, duration: 2600, gravity: 'top', position: 'right',
        style: {
            background: bg, borderRadius: '12px',
            fontFamily: "'DM Sans',sans-serif", fontSize: '0.86rem',
            fontWeight: '600', padding: '11px 18px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
        },
    }).showToast();
}

async function confirmDialog(title, text, icon = 'question') {
    if (typeof window === 'undefined' || !window.Swal) return true;
    const r = await window.Swal.fire({
        title, text, icon, showCancelButton: true,
        confirmButtonColor: '#6366f1', cancelButtonColor: '#64748b',
        confirmButtonText: '<i class="fas fa-check"></i> Onayla',
        cancelButtonText: 'Vazgeç', reverseButtons: true,
    });
    return r.isConfirmed;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [todos, setTodos] = useState([]);
    const [categories, setCategories] = useState(DEFAULT_CATS.map(n => ({ name: n, color: CAT_COLORS[n] })));
    const [tab, setTab] = useState('active');
    const [filter, setFilter] = useState('pending');
    const [archiveFilter, setArchiveFilter] = useState('all');
    const [theme, setTheme] = useState('light');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modal, setModal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadScript = (src) => new Promise(res => {
            if (document.querySelector(`script[src="${src}"]`)) return res();
            const s = document.createElement('script'); s.src = src; s.onload = res;
            document.head.appendChild(s);
        });
        Promise.all([
            loadScript('https://cdn.jsdelivr.net/npm/sweetalert2@11'),
            loadScript('https://cdn.jsdelivr.net/npm/toastify-js'),
        ]);
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('pp_theme') || 'light';
        setTheme(saved);
        document.documentElement.setAttribute('data-theme', saved);
    }, []);

    function toggleTheme() {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('pp_theme', next);
        document.documentElement.setAttribute('data-theme', next);
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) { router.push('/login'); return; }
            setUser(session.user);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
            if (!session) router.push('/login');
            else setUser(session.user);
        });
        return () => subscription.unsubscribe();
    }, [router]);

    const fetchTodos = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) console.error('fetchTodos error:', error);
        else setTodos(data || []);
    }, [user]);

    const fetchCategories = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');
        if (!error && data && data.length > 0) setCategories(data);
    }, [user]);

    useEffect(() => {
        if (user) {
            setLoading(true);
            Promise.all([fetchTodos(), fetchCategories()]).finally(() => setLoading(false));
        }
    }, [user, fetchTodos, fetchCategories]);

    useEffect(() => {
        if (!todos.length) return;
        const now = new Date(); now.setHours(0, 0, 0, 0);
        const overdue = todos.filter(t =>
            !t.is_archived && !t.is_completed && !t.is_failed && t.due_date
            && new Date(t.due_date + 'T00:00:00') < now
        );
        if (!overdue.length) return;
        Promise.all(overdue.map(t =>
            supabase.from('todos').update({ is_failed: true }).eq('id', t.id)
        )).then(() => fetchTodos());
    }, [todos, fetchTodos]);

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.push('/');
    }

    async function handleAction(action, id) {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        if (action === 'complete') {
            if (!await confirmDialog('✓ Tamamlandı', `"${todo.text}" görevi tamamlandı olarak işaretlenecek.`, 'success')) return;
            await supabase.from('todos').update({ is_completed: true, is_failed: false }).eq('id', id);
            notify('✓ Tamamlandı olarak işaretlendi');
        }
        if (action === 'fail') {
            if (!await confirmDialog('Tamamlanamadı', 'Bu görevi tamamlanamadı olarak işaretlemek istiyor musun?', 'warning')) return;
            await supabase.from('todos').update({ is_failed: true, is_completed: false }).eq('id', id);
            notify('✗ Tamamlanamadı olarak işaretlendi', 'warning');
        }
        if (action === 'archive') {
            if (!await confirmDialog('Arşivle', 'Bu görev arşive taşınacak.', 'warning')) return;
            await supabase.from('todos').update({ is_archived: true }).eq('id', id);
            notify('📦 Görev arşivlendi', 'info');
        }
        if (action === 'restore') {
            await supabase.from('todos').update({ is_archived: false }).eq('id', id);
            notify('↩ Görev geri yüklendi', 'info');
        }
        if (action === 'delete') {
            if (!await confirmDialog('Kalıcı Sil', 'Bu işlem geri alınamaz!', 'error')) return;
            await supabase.from('todos').delete().eq('id', id);
            notify('🗑 Görev silindi', 'error');
        }
        if (action === 'edit') {
            setModal({ mode: 'edit', todo });
            return;
        }
        fetchTodos();
    }

    async function handleModalSave(payload) {
        if (payload.action === 'newCategory') {
            const color = CAT_COLORS[payload.name] || RAND_PAL[Math.floor(Math.random() * RAND_PAL.length)];
            await supabase.from('categories').upsert({ user_id: user.id, name: payload.name, color });
            await fetchCategories();
            return;
        }
        if (payload.action === 'create') {
            const { error } = await supabase.from('todos').insert({ user_id: user.id, ...payload.data });
            if (!error) { notify('✓ Görev eklendi'); setModal(null); fetchTodos(); }
            else {
                console.error('insert error:', error);
                notify(`Hata: ${error.message || error.code || 'Bilinmeyen hata'}`, 'error');
            }
        }
        if (payload.action === 'update') {
            const { error } = await supabase.from('todos').update(payload.data).eq('id', modal.todo.id);
            if (!error) { notify('✏️ Görev güncellendi', 'info'); setModal(null); fetchTodos(); }
            else {
                console.error('update error:', error);
                notify(`Hata: ${error.message || error.code || 'Bilinmeyen hata'}`, 'error');
            }
        }
    }

    async function handleClearArchive() {
        const archived = todos.filter(t => t.is_archived);
        if (!archived.length) { notify('Arşiv zaten boş', 'info'); return; }
        if (!await confirmDialog('Arşivi Temizle', `${archived.length} görev kalıcı olarak silinecek!`, 'error')) return;
        await Promise.all(archived.map(t => supabase.from('todos').delete().eq('id', t.id)));
        notify('🗑 Arşiv temizlendi', 'error');
        fetchTodos();
    }

    const isArchive = tab === 'archive';
    let list = todos.filter(t => t.is_archived === isArchive);
    if (!isArchive) {
        if (filter === 'pending') list = list.filter(t => !t.is_completed && !t.is_failed);
        if (filter === 'completed') list = list.filter(t => t.is_completed);
        if (filter === 'failed') list = list.filter(t => t.is_failed);
    } else {
        if (archiveFilter === 'completed') list = list.filter(t => t.is_completed);
        if (archiveFilter === 'failed') list = list.filter(t => t.is_failed);
        if (archiveFilter === 'pending') list = list.filter(t => !t.is_completed && !t.is_failed);
    }
    const archivedTodos = todos.filter(t => t.is_archived);

    if (!user) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--text2)' }}>
            <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2rem' }}></i>
        </div>
    );

    return (
        <div className="app-shell">
            <Sidebar
                categories={categories}
                todos={todos}
                tab={tab}
                onTabChange={setTab}
                theme={theme}
                onThemeToggle={toggleTheme}
                onSignOut={handleSignOut}
                onCloseSidebar={() => setSidebarOpen(false)}
                isOpen={sidebarOpen}
            />

            <main className="main-content">
                <Topbar
                    tab={tab}
                    onOpenModal={() => setModal({ mode: 'add' })}
                    onHamburger={() => setSidebarOpen(o => !o)}
                    theme={theme}
                    onThemeToggle={toggleTheme}
                    userEmail={user?.email}
                />

                {!isArchive && (
                    <section className="filter-bar">
                        <div className="filter-select-wrap">
                            <i className="fas fa-filter filter-select-icon"></i>
                            <select value={filter} onChange={e => setFilter(e.target.value)}>
                                <option value="all">Hepsi</option>
                                <option value="pending">Bekleyenler</option>
                                <option value="completed">Tamamlananlar</option>
                                <option value="failed">Tamamlanamadı</option>
                            </select>
                            <i className="fas fa-chevron-down filter-chevron"></i>
                        </div>
                        <span className="task-count">{list.length} görev</span>
                    </section>
                )}

                {isArchive && (
                    <section className="archive-toolbar">
                        <div className="archive-stats">
                            <span className="astat"><i className="fas fa-check-circle"></i> <span>{archivedTodos.filter(t => t.is_completed).length}</span> tamamlandı</span>
                            <span className="astat astat-failed"><i className="fas fa-times-circle"></i> <span>{archivedTodos.filter(t => t.is_failed).length}</span> tamamlanamadı</span>
                            <span className="astat"><i className="fas fa-hourglass-half"></i> <span>{archivedTodos.filter(t => !t.is_completed && !t.is_failed).length}</span> bekliyor</span>
                        </div>
                        <div className="archive-toolbar-right">
                            <div className="filter-select-wrap">
                                <i className="fas fa-filter filter-select-icon"></i>
                                <select value={archiveFilter} onChange={e => setArchiveFilter(e.target.value)}>
                                    <option value="all">Hepsi</option>
                                    <option value="completed">Tamamlananlar</option>
                                    <option value="failed">Tamamlanamadı</option>
                                    <option value="pending">Bekleyenler</option>
                                </select>
                                <i className="fas fa-chevron-down filter-chevron"></i>
                            </div>
                            <button className="clear-archive-btn" onClick={handleClearArchive}>
                                <i className="fas fa-fire"></i> Arşivi Temizle
                            </button>
                        </div>
                    </section>
                )}

                <div className="content-area">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text3)' }}>
                            <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2rem' }}></i>
                            <p style={{ marginTop: '12px' }}>Yükleniyor...</p>
                        </div>
                    ) : (
                        <div className="task-grid">
                            {list.length === 0 ? (
                                <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                                    <div className="empty-icon"><i className="fas fa-clipboard-list"></i></div>
                                    <h3>{isArchive ? 'Arşiv boş' : 'Görev bulunamadı'}</h3>
                                    <p>{isArchive ? 'Henüz arşivlenmiş görev yok.' : 'Yeni bir görev ekleyerek başla.'}</p>
                                    {!isArchive && (
                                        <button className="empty-add-btn" onClick={() => setModal({ mode: 'add' })}>
                                            <i className="fas fa-plus"></i> Görev Ekle
                                        </button>
                                    )}
                                </div>
                            ) : (
                                list.map((t, i) => (
                                    <TodoCard
                                        key={t.id}
                                        todo={t}
                                        isArchive={isArchive}
                                        onAction={handleAction}
                                        animationDelay={i * 42}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>

            {modal && (
                <TodoModal
                    mode={modal.mode}
                    todo={modal.todo}
                    categories={categories}
                    onSave={handleModalSave}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    );
}
