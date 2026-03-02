'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LandingNav from '@/components/LandingNav';
import LandingFooter from '@/components/LandingFooter';

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleRegister(e) {
        e.preventDefault();
        setError('');
        if (password !== password2) { setError('Şifreler eşleşmiyor!'); return; }
        if (password.length < 6) { setError('Şifre en az 6 karakter olmalı.'); return; }

        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        setLoading(false);

        if (error) {
            setError(error.message || 'Kayıt sırasında bir hata oluştu.');
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
                            <i className="fas fa-user-plus"></i>
                        </div>
                        <h1 className="mk-auth-h1">Hesap Oluştur</h1>
                        <p className="mk-auth-sub">Ücretsiz kayıt ol, hemen kullanmaya başla.</p>
                    </div>

                    <form className="mk-auth-form" onSubmit={handleRegister}>
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
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="mk-field">
                            <label htmlFor="password2">Şifre Tekrar</label>
                            <input
                                id="password2"
                                type="password"
                                placeholder="••••••••"
                                value={password2}
                                onChange={e => setPassword2(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <button type="submit" className="mk-auth-submit" disabled={loading}>
                            {loading
                                ? <><i className="fas fa-circle-notch fa-spin"></i> Kaydediliyor...</>
                                : <><i className="fas fa-user-plus"></i> Kayıt Ol</>
                            }
                        </button>
                    </form>

                    <p className="mk-auth-footer-link">
                        Zaten hesabın var mı? <Link href="/login">Giriş Yap <i className="fas fa-arrow-right"></i></Link>
                    </p>
                </div>
            </div>

            <LandingFooter />
        </div>
    );
}
