'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LandingNav() {
    const pathname = usePathname();
    const isLogin = pathname === '/login';
    const isRegister = pathname === '/register';

    return (
        <header className="mk-nav">
            <div className="mk-nav-inner">
                <Link href="/" className="mk-logo">
                    <div className="mk-logo-icon">
                        <i className="fas fa-layer-group"></i>
                    </div>
                    <span className="mk-logo-text">Oguz<span className="mk-logo-accent">ToDo</span></span>
                </Link>

                <nav className="mk-nav-links">
                    <a href="#features" className="mk-nav-link">Özellikler</a>
                    <a href="#cta" className="mk-nav-link">Başla</a>
                </nav>

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
            </div>
        </header>
    );
}
