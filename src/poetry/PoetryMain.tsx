import { useState, useEffect, useCallback } from "react";

interface Poem {
    title: string;
    body: string;
}

export default function Poetry() {
    const [poems, setPoems] = useState<Poem[]>([]);
    const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPoems = async () => {
            const loaded: Poem[] = [];
            let i = 1;

            while (true) {
                try {
                    const res = await fetch(`/poems/poem${i}.txt`);
                    if (!res.ok || res.headers.get("content-type")?.includes("text/html")) break;
                    const text = await res.text();
                    const lines = text.split("\n");
                    const title = lines[0].trim();
                    const body = lines.slice(1).join("\n").trimStart();
                    loaded.push({ title, body });
                    i++;
                } catch {
                    break;
                }
            }

            setPoems(loaded);
            setLoading(false);
        };

        fetchPoems();
    }, []);

    const closeModal = useCallback(() => setSelectedPoem(null), []);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [closeModal]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = selectedPoem ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [selectedPoem]);

    return (
        <>
            <div style={{
                minHeight: "100vh",
                padding: "5rem 1.5rem 3rem",
                boxSizing: "border-box",
                maxWidth: "860px",
                margin: "0 auto",
            }}>
                {/* Page heading */}
                <div style={{ marginBottom: "2.5rem" }}>
                    <span style={{
                        display: "inline-block",
                        marginBottom: "0.75rem",
                        padding: "0.45rem 0.8rem",
                        borderRadius: "999px",
                        background: "rgba(96, 165, 250, 0.14)",
                        color: "#bfdbfe",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                    }}>
                        Writing
                    </span>
                    <h1 style={{
                        fontSize: "clamp(2rem, 4vw, 3.2rem)",
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                        color: "#f8fafc",
                        margin: 0,
                    }}>
                        Poetry
                    </h1>
                    <p style={{ marginTop: "0.75rem", color: "#94a3b8", fontSize: "1rem" }}>
                        Click a poem to read it. All poems written by Josh Cohn between 2021 - 2026.
                    </p>
                </div>

                {/* Poem list */}
                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} style={{
                                height: "68px",
                                borderRadius: "16px",
                                background: "rgba(15, 23, 42, 0.92)",
                                border: "1px solid rgba(148, 163, 184, 0.18)",
                                animation: "pulse 1.4s ease-in-out infinite",
                            }} />
                        ))}
                    </div>
                ) : (
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {poems.map((poem, i) => (
                            <li key={i}>
                                <button
                                    onClick={() => setSelectedPoem(poem)}
                                    style={{
                                        width: "100%",
                                        textAlign: "left",
                                        background: "linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(11, 17, 32, 0.9))",
                                        border: "1px solid rgba(148, 163, 184, 0.18)",
                                        borderRadius: "16px",
                                        padding: "1.1rem 1.4rem",
                                        cursor: "pointer",
                                        color: "#f8fafc",
                                        fontSize: "1.05rem",
                                        fontWeight: 600,
                                        fontFamily: "inherit",
                                        transition: "transform 0.18s ease, border-color 0.18s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "1rem",
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(96, 165, 250, 0.35)";
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(148, 163, 184, 0.18)";
                                    }}
                                >
                                    <span>{poem.title}</span>
                                    <span style={{ color: "#94a3b8", fontSize: "1.1rem", flexShrink: 0 }}>→</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Footer Section */}
            <footer style={{
                marginTop: "auto",
                paddingTop: "4rem",
                paddingBottom: "2rem",
                textAlign: "center"
            }}>
                <p style={{
                    color: "#64748b",
                    fontSize: "0.85rem",
                    letterSpacing: "0.02em"
                }}>
                    &copy; {new Date().getFullYear()} Josh B Cohn. All works original.
                </p>
            </footer>

            {/* Fullscreen modal */}
            {selectedPoem && (
                <div
                    onClick={closeModal}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 100,
                        background: "rgba(8, 16, 31, 0.92)",
                        backdropFilter: "blur(12px)",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        overflowY: "auto",
                        padding: "4rem 1.5rem",
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: "linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(11, 17, 32, 0.98))",
                            border: "1px solid rgba(148, 163, 184, 0.18)",
                            borderRadius: "24px",
                            padding: "2.5rem",
                            width: "100%",
                            maxWidth: "600px",
                            position: "relative",
                            boxShadow: "0 20px 60px rgba(2, 6, 23, 0.6)",
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            style={{
                                position: "absolute",
                                top: "1.25rem",
                                right: "1.25rem",
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(148, 163, 184, 0.18)",
                                borderRadius: "999px",
                                color: "#94a3b8",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                padding: "0.3rem 0.75rem",
                                fontFamily: "inherit",
                                transition: "color 0.15s, background 0.15s",
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.color = "#f8fafc";
                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                            }}
                        >
                            back
                        </button>

                        {/* Title */}
                        <h2 style={{
                            fontSize: "1.4rem",
                            fontWeight: 700,
                            color: "#f8fafc",
                            margin: "0 3rem 1.75rem 0",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.2,
                        }}>
                            {selectedPoem.title}
                        </h2>

                        {/* Divider */}
                        <div style={{
                            height: "1px",
                            background: "rgba(148, 163, 184, 0.18)",
                            marginBottom: "1.75rem",
                        }} />

                        {/* Poem body */}
                        <pre style={{
                            fontFamily: "Georgia, 'Times New Roman', serif",
                            fontSize: "1rem",
                            lineHeight: 1.9,
                            whiteSpace: "pre-wrap",
                            margin: 0,
                            color: "#e5e7eb",
                            textAlign: "left",
                        }}>
                            {selectedPoem.body}
                        </pre>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>
        </>
    );
}