'use client';
import Link from 'next/link';

export default function LandingFooter() {
    return (
        <footer className="mk-footer">
            <div className="mk-footer-inner">
                <div className="mk-footer-brand">
                    <div className="mk-logo">
                        <div className="mk-logo-icon mk-logo-icon--sm">
                            <i className="fas fa-layer-group"></i>
                        </div>
                        <span className="mk-logo-text" style={{ fontSize: '0.95rem' }}>
                            Oguz<span className="mk-logo-accent">ToDo</span>
                        </span>
                    </div>
                    <p className="mk-footer-tagline">Akıllı görev yönetimi, herkes için.</p>
                </div>
                <div className="mk-footer-links">
                    <Link href="/login" className="mk-footer-link">Giriş Yap</Link>
                    <Link href="/register" className="mk-footer-link">Kayıt Ol</Link>
                </div>
                <p className="mk-footer-copy">© 2026 OguzToDo</p>
            </div>
        </footer>
    );
}
