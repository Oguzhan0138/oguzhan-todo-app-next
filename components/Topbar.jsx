'use client';

export default function Topbar({ tab, onOpenModal, onHamburger, theme, onThemeToggle, userEmail }) {
    const initial = userEmail ? userEmail[0].toUpperCase() : '?';

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="hamburger" onClick={onHamburger} aria-label="Menü">
                    <span className="hbar"></span>
                    <span className="hbar"></span>
                    <span className="hbar"></span>
                </button>
                <div className="topbar-title">
                    <h1>{tab === 'archive' ? 'Arşiv' : 'Görev Panosu'}</h1>
                    <p className="topbar-sub">{tab === 'archive' ? 'Arşivlenmiş görevler' : 'Bugün ne yapacaksın?'}</p>
                </div>
            </div>
            <div className="topbar-right">
                <button className="theme-toggle" onClick={onThemeToggle} title="Tema değiştir">
                    <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
                </button>
                {userEmail && (
                    <div className="user-chip">
                        <div className="user-avatar">{initial}</div>
                        <span>{userEmail}</span>
                    </div>
                )}
                {tab !== 'archive' && (
                    <button className="add-btn" onClick={onOpenModal}>
                        <i className="fas fa-plus"></i>
                        <span className="add-btn-text">Yeni Görev</span>
                    </button>
                )}
            </div>
        </header>
    );
}
