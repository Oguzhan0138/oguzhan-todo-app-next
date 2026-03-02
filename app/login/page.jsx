'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LandingNav from '@/components/LandingNav';
import LandingFooter from '@/components/LandingFooter';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
            setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
        } else {
            router.push('/dashboard');
        }
    }

    return (
        <div className="mk-page">
            <LandingNav />

            <div className="mk-auth-wrapper">
                <div className="mk-auth-box">
                    <div className="mk-auth-head">
                        <div className="mk-auth-icon">
                            <i className="fas fa-right-to-bracket"></i>
                        </div>
                        <h1 className="mk-auth-h1">Tekrar Hoş Geldin</h1>
                        <p className="mk-auth-sub">Hesabına giriş yap ve görevlerine devam et.</p>
                    </div>

                    <form className="mk-auth-form" onSubmit={handleLogin}>
                        {error && (
                            <div className="mk-alert mk-alert-error">
                                <i className="fas fa-circle-exclamation"></i> {error}
                            </div>
                        )}

                        <div className="mk-field">
                            <label htmlFor="email">E-posta</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="ornek@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="mk-field">
                            <label htmlFor="password">Şifre</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <button type="submit" className="mk-auth-submit" disabled={loading}>
                            {loading
                                ? <><i className="fas fa-circle-notch fa-spin"></i> Giriş yapılıyor...</>
                                : <><i className="fas fa-right-to-bracket"></i> Giriş Yap</>
                            }
                        </button>
                    </form>

                    <p className="mk-auth-footer-link">
                        Hesabın yok mu? <Link href="/register">Kayıt Ol <i className="fas fa-arrow-right"></i></Link>
                    </p>
                </div>
            </div>

            <LandingFooter />
        </div>
    );
}
