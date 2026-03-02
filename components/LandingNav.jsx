'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function LandingNav() {
    const pathname = usePathname();
    const isLogin = pathname === '/login';
    const isRegister = pathname === '/register';
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="mk-nav">
            <div className="mk-nav-inner">
                {/* Logo */}
                <Link href="/" className="mk-logo" onClick={() => setMenuOpen(false)}>
                    <div className="mk-logo-icon">
                        <i className="fas fa-layer-group"></i>
                    </div>
                    <span className="mk-logo-text">
                        Oguz<span className="mk-logo-accent">ToDo</span>
                    </span>
                </Link>

                {/* Desktop center links */}
                <nav className="mk-nav-links">
                    <a href="#features" className="mk-nav-link">Özellikler</a>
                    <a href="#cta" className="mk-nav-link">Başla</a>
                </nav>

                {/* Desktop CTA buttons */}
                <div className="mk-nav-ctas">
                    {!isLogin && (
                        <Link href="/login" className="mk-btn-ghost">Giriş Yap</Link>
                    )}
                    {!isRegister && (
                        <Link href="/register" className="mk-btn-solid">
                            Ücretsiz Başla <i className="fas fa-arrow-right"></i>
                        </Link>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="mk-hamburger"
                    onClick={() => setMenuOpen(o => !o)}
                    aria-label="Menü"
                >
                    <i className={`fas ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                </button>
            </div>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <div className="mk-mobile-menu">
                    <a href="#features" className="mk-mobile-link" onClick={() => setMenuOpen(false)}>
                        <i className="fas fa-star"></i> Özellikler
                    </a>
                    <a href="#cta" className="mk-mobile-link" onClick={() => setMenuOpen(false)}>
                        <i className="fas fa-rocket"></i> Başla
                    </a>
                    <div className="mk-mobile-divider" />
                    {!isLogin && (
                        <Link href="/login" className="mk-mobile-link" onClick={() => setMenuOpen(false)}>
                            <i className="fas fa-right-to-bracket"></i> Giriş Yap
                        </Link>
                    )}
                    {!isRegister && (
                        <Link href="/register" className="mk-mobile-cta" onClick={() => setMenuOpen(false)}>
                            <i className="fas fa-user-plus"></i> Ücretsiz Kayıt Ol
                        </Link>
                    )}
                </div>
            )}
        </header>
    );
}
