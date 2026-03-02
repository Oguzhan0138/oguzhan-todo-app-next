'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import LandingNav from '@/components/LandingNav';
import LandingFooter from '@/components/LandingFooter';

const FEATURES = [
    { icon: 'fa-shield-halved', color: '#6366f1', title: 'Güvenli & Kişisel', desc: 'Her kullanıcı yalnızca kendi görevlerini görür. Row Level Security ile veritabanı seviyesinde koruma.' },
    { icon: 'fa-tags', color: '#f59e0b', title: 'Akıllı Kategoriler', desc: 'Genel, İş, Okul, Kişisel veya kendi özel kategorilerinizle görevlerinizi sınıflandırın.' },
    { icon: 'fa-fire', color: '#f43f5e', title: 'Öncelik Sistemi', desc: 'Normal, Yüksek ve Acil seviyelerle en kritik işlerinize odaklanın.' },
    { icon: 'fa-calendar-check', color: '#22d3a5', title: 'Son Tarih Takibi', desc: 'Tarihi geçen görevler otomatik olarak başarısız sayılır, hiçbir şeyi kaçırmazsınız.' },
    { icon: 'fa-box-archive', color: '#8b5cf6', title: 'Arşiv Sistemi', desc: 'Tamamlanan görevleri arşivleyin. Geçmiş kayıtlarınıza dilediğiniz zaman ulaşın.' },
    { icon: 'fa-chart-pie', color: '#06b6d4', title: 'İlerleme Takibi', desc: 'Tamamlanan görev oranınızı anlık izleyin, motivasyonunuzu canlı tutun.' },
];

export default function LandingPage() {
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) router.push('/dashboard');
        });
    }, [router]);

    return (
        <div className="mk-page">
            <LandingNav />

            {/* ── HERO ── */}
            <section className="mk-hero">
                <div className="mk-hero-grid-bg" aria-hidden="true" />
                <div className="mk-hero-inner">
                    <div className="mk-hero-eyebrow">
                        <span className="mk-eyebrow-dot"></span>
                        Ücretsiz · Hızlı · Güvenli
                    </div>

                    <h1 className="mk-hero-h1">
                        Görevlerini yönet,<br />
                        <span className="mk-text-gradient">hedeflerine odaklan.</span>
                    </h1>

                    <p className="mk-hero-p">
                        Kişisel projeler, iş görevleri, okul ödevleri — hepsi tek bir yerde.
                        Her kullanıcıya özel, bulut tabanlı, anlık senkronize.
                    </p>

                    <div className="mk-hero-btns">
                        <Link href="/register" className="mk-btn-hero-primary">
                            <i className="fas fa-rocket"></i>
                            Hemen Başla
                        </Link>
                        <Link href="/login" className="mk-btn-hero-secondary">
                            Giriş Yap <i className="fas fa-arrow-right"></i>
                        </Link>
                    </div>

                    <div className="mk-hero-pills">
                        <span className="mk-pill"><i className="fas fa-check"></i> Kredi kartı gerekmez</span>
                        <span className="mk-pill"><i className="fas fa-check"></i> Anında kayıt</span>
                        <span className="mk-pill"><i className="fas fa-check"></i> Sınırsız görev</span>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="mk-stats-bar">
                    <div className="mk-stat">
                        <span className="mk-stat-n">∞</span>
                        <span className="mk-stat-l">Görev kapasitesi</span>
                    </div>
                    <div className="mk-stat-sep" />
                    <div className="mk-stat">
                        <span className="mk-stat-n">5+</span>
                        <span className="mk-stat-l">Kategori tipi</span>
                    </div>
                    <div className="mk-stat-sep" />
                    <div className="mk-stat">
                        <span className="mk-stat-n">3</span>
                        <span className="mk-stat-l">Öncelik seviyesi</span>
                    </div>
                    <div className="mk-stat-sep" />
                    <div className="mk-stat">
                        <span className="mk-stat-n">100%</span>
                        <span className="mk-stat-l">Güvenli</span>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="mk-features" id="features">
                <div className="mk-section-inner">
                    <div className="mk-section-head">
                        <span className="mk-section-tag">Özellikler</span>
                        <h2 className="mk-section-h2">İhtiyacınız olan her şey, <br />fazlası değil.</h2>
                        <p className="mk-section-p">Sade, güçlü ve odaklı. Gereksiz karmaşıklık yok.</p>
                    </div>
                    <div className="mk-feat-grid">
                        {FEATURES.map(f => (
                            <div key={f.title} className="mk-feat-card">
                                <div className="mk-feat-icon" style={{ '--feat-color': f.color }}>
                                    <i className={`fas ${f.icon}`}></i>
                                </div>
                                <h3 className="mk-feat-h3">{f.title}</h3>
                                <p className="mk-feat-p">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="mk-cta-section" id="cta">
                <div className="mk-cta-card">
                    <div className="mk-cta-glow" aria-hidden="true" />
                    <span className="mk-section-tag" style={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)' }}>
                        Başlamaya hazır mısın?
                    </span>
                    <h2 className="mk-cta-h2">Saniyeler içinde kayıt ol.</h2>
                    <p className="mk-cta-p">Kredi kartı gerekmez. Hemen kullanmaya başla.</p>
                    <Link href="/register" className="mk-btn-cta">
                        <i className="fas fa-user-plus"></i>
                        Ücretsiz Hesap Oluştur
                    </Link>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}
