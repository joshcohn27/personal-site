import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function NotFound() {
    return (
        <div className="site-shell">
            <Header />

            <main>
                <section className="section" style={{ minHeight: "60vh" }}>
                    <div className="container">
                        <p style={{ color: "var(--muted)", marginBottom: "8px" }}>
                            404 Error
                        </p>

                        <h1 style={{
                            fontSize: "clamp(36px, 5vw, 48px)",
                            lineHeight: 1.2,
                            marginBottom: "16px",
                        }}>
                            Page not found
                        </h1>

                        <p style={{
                            color: "var(--text)",
                            maxWidth: "60ch",
                            marginBottom: "24px",
                        }}>
                            The page you were trying to reach does not exist, may have been moved,
                            or has not been created yet.
                        </p>

                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "16px",
                            marginBottom: "32px",
                        }}>
                            <Link to="/" className="button button-primary">
                                Back to home
                            </Link>

                            <a href="/projects" className="button button-secondary">
                                View projects
                            </a>
                        </div>

                        <div style={{
                            borderTop: "1px solid var(--line)",
                            paddingTop: "16px",
                            fontSize: "14px",
                            color: "var(--muted)",
                        }}>
                            joshbcohn.com
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
