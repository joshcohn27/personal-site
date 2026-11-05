import ButtonLink from "./ui/ButtonLink";
import Header from "./Header";
import Footer from "./Footer";

export default function NotFound() {
    return (
        <div className="site-shell">
            <Header />

            <main>
                <section className="section" style={{ minHeight: "60vh" }}>
                    <div className="container">
                        <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-2)" }}>
                            404 Error
                        </p>

                        <h1 style={{
                            fontSize: "var(--font-page-title)",
                            lineHeight: 1.2,
                            marginBottom: "var(--space-3)",
                        }}>
                            Page not found
                        </h1>

                        <p style={{
                            color: "var(--color-text)",
                            marginBottom: "var(--space-4)",
                        }}>
                            The page you were trying to reach does not exist, may have been moved,
                            or has not been created yet.
                        </p>

                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "var(--space-3)",
                            marginBottom: "var(--space-5)",
                        }}>
                            <ButtonLink to="/">
                                Back to home
                            </ButtonLink>

                            <ButtonLink to="/projects" variant="secondary">
                                View projects
                            </ButtonLink>
                        </div>

                        <div style={{
                            borderTop: "1px solid var(--color-border)",
                            paddingTop: "var(--space-3)",
                            fontSize: "var(--font-sm)",
                            color: "var(--color-text-muted)",
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
