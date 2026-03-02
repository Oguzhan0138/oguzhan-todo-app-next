'use client';

const CAT_COLORS = {
    'Genel': '#6366f1',
    'İş': '#f59e0b',
    'Okul': '#8b5cf6',
    'Kişisel': '#22d3a5',
    'Acil': '#f43f5e',
};

export default function Sidebar({
    categories, todos, tab, onTabChange, theme, onThemeToggle, onSignOut, onCloseSidebar, isOpen
}) {
    const activeTodos = todos.filter(t => !t.is_archived);
    const archivedTodos = todos.filter(t => t.is_archived);
    const completedCount = activeTodos.filter(t => t.is_completed).length;
    const progress = activeTodos.length ? Math.round((completedCount / activeTodos.length) * 100) : 0;

    function getCatColor(c) {
        return CAT_COLORS[c] || '#94a3b8';
    }

    return (
        <>
            <div className={`mobile-overlay ${isOpen ? 'visible' : ''}`} onClick={onCloseSidebar} />
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-inner">
                    <div className="sidebar-top">
                        <div className="logo">
                            <div className="logo-mark"><i className="fas fa-layer-group"></i></div>
                            <span className="logo-text">Oguz-ToDo</span>
                        </div>
                        <div className="sidebar-actions">
                            <button className="theme-toggle" onClick={onThemeToggle} title="Tema değiştir">
                                <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
                            </button>
                            <button className="sidebar-close-btn" onClick={onCloseSidebar} title="Kapat">
                                <i className="fas fa-xmark"></i>
                            </button>
                        </div>
                    </div>

                    <nav className="side-nav">
                        <p className="nav-label">MENÜ</p>
                        <button
                            className={`nav-btn ${tab === 'active' ? 'active' : ''}`}
                            onClick={() => { onTabChange('active'); onCloseSidebar(); }}
                        >
                            <span className="nav-icon"><i className="fas fa-list-check"></i></span>
                            <span className="nav-text">Görevler</span>
                            <span className="nav-badge">{activeTodos.length}</span>
                        </button>
                        <button
                            className={`nav-btn ${tab === 'archive' ? 'active' : ''}`}
                            onClick={() => { onTabChange('archive'); onCloseSidebar(); }}
                        >
                            <span className="nav-icon"><i className="fas fa-box-archive"></i></span>
                            <span className="nav-text">Arşiv</span>
                            <span className="nav-badge">{archivedTodos.length}</span>
                        </button>
                    </nav>

                    <div className="sidebar-cats">
                        <p className="nav-label">KATEGORİLER</p>
                        <div>
                            {categories.map(c => {
                                const color = getCatColor(c.name || c);
                                const name = c.name || c;
                                const count = activeTodos.filter(t => t.category === name).length;
                                return (
                                    <div className="cat-item" key={name}>
                                        <span className="cat-dot" style={{ background: color }}></span>
                                        <span>{name}</span>
                                        <span className="cat-count">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="sidebar-progress">
                        <div className="progress-header">
                            <span className="progress-label">İLERLEME</span>
                            <span className="progress-value">{completedCount}/{activeTodos.length}</span>
                        </div>
                        <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="progress-pct">%{progress} tamamlandı</p>
                    </div>

                    <div className="sidebar-footer-actions">
                        <button className="sign-out-btn" onClick={onSignOut}>
                            <i className="fas fa-right-from-bracket"></i>
                            Çıkış Yap
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
