import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function NotFound() {
    return (
        <div className="site-shell">
            <Header />

            <main className="relative overflow-hidden">
                <section style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    minHeight: '75vh',
                    padding: '6rem 1.5rem'
                }}>
                    <div style={{ width: '100%', maxWidth: '640px' }}>
                        <div style={{
                            borderRadius: '2rem',
                            border: '1px solid rgba(148, 163, 184, 0.18)',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '3rem 2.5rem',
                            textAlign: 'center',
                            boxShadow: '0 20px 60px rgba(2, 6, 23, 0.35)',
                            backdropFilter: 'blur(20px)',
                        }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                borderRadius: '999px',
                                border: '1px solid rgba(248, 113, 113, 0.25)',
                                background: 'rgba(239, 68, 68, 0.1)',
                                padding: '0.35rem 0.9rem',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                letterSpacing: '0.3em',
                                textTransform: 'uppercase',
                                color: '#fca5a5',
                                marginBottom: '1.5rem',
                            }}>
                                404 Error
                            </div>

                            <h1 style={{
                                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                                fontWeight: 600,
                                letterSpacing: '-0.03em',
                                color: '#f8fafc',
                                lineHeight: 1.1,
                                marginBottom: '1.25rem',
                            }}>
                                Page not found
                            </h1>

                            <p style={{
                                color: '#94a3b8',
                                fontSize: '1.05rem',
                                lineHeight: 1.7,
                                maxWidth: '42ch',
                                margin: '0 auto 2.5rem',
                            }}>
                                The page you were trying to reach does not exist, may have been moved,
                                or has not been created yet.
                            </p>

                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '1rem',
                                justifyContent: 'center',
                                marginBottom: '2.5rem',
                            }}>
                                <Link
                                    to="/"
                                    className="button button-primary"
                                    style={{ minWidth: '160px', textDecoration: 'none' }}
                                >
                                    Back to home
                                </Link>

                                <a
                                    href="/projects"
                                    className="button button-secondary"
                                    style={{ minWidth: '160px', textDecoration: 'none' }}
                                >
                                    View projects
                                </a>
                            </div>

                            <div style={{
                                borderTop: '1px solid rgba(148, 163, 184, 0.18)',
                                paddingTop: '1.25rem',
                                fontSize: '0.9rem',
                                color: 'rgba(148, 163, 184, 0.5)',
                            }}>
                                joshbcohn.com
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}