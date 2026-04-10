import { useState, useEffect, useCallback, useMemo, useRef } from "react";

interface Poem {
    title: string;
    body: string;
    index: number;
    dedication?: string;
}

type SortOption = "newest" | "oldest" | "az" | "za";

const SORT_LABELS: Record<SortOption, string> = {
    az: "A → Z",
    za: "Z → A",
    newest: "Newest",
    oldest: "Oldest",
};

function InfoTooltip({ text }: { text: string }) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
            <button
                onClick={e => { e.stopPropagation(); setVisible(v => !v); }}
                title="Note"
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0 0.25rem",
                    color: visible ? "#93c5fd" : "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    transition: "color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#93c5fd")}
                onMouseLeave={e => { if (!visible) e.currentTarget.style.color = "#94a3b8"; }}
            >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="8" strokeWidth="3" />
                    <line x1="12" y1="12" x2="12" y2="16" />
                </svg>
            </button>
            {visible && (
                <div style={{
                    position: "absolute",
                    bottom: "calc(100% + 8px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#0f172a",
                    border: "1px solid rgba(148, 163, 184, 0.25)",
                    borderRadius: "10px",
                    padding: "0.6rem 0.85rem",
                    fontSize: "0.82rem",
                    color: "#cbd5e1",
                    boxShadow: "0 8px 24px rgba(2, 6, 23, 0.5)",
                    zIndex: 10,
                    fontStyle: "italic",
                    fontWeight: 400,
                    minWidth: "180px",
                    maxWidth: "500px",
                    whiteSpace: "normal",
                }}>
                    {text}
                    <div style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: 0,
                        borderLeft: "6px solid transparent",
                        borderRight: "6px solid transparent",
                        borderTop: "6px solid rgba(148, 163, 184, 0.25)",
                    }} />
                </div>
            )}
        </div>
    );
}

export default function Poetry() {
    const [poems, setPoems] = useState<Poem[]>([]);
    const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<SortOption>("az");

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

                    let dedication: string | undefined;
                    let bodyStart = 1;

                    if (lines[1]?.toLowerCase().startsWith("dedication:")) {
                        dedication = lines[1].slice("dedication:".length).trim();
                        bodyStart = 2;
                    }

                    const body = lines.slice(bodyStart).join("\n").trimStart();
                    loaded.push({ title, body, index: i, dedication });
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

    useEffect(() => {
        document.body.style.overflow = selectedPoem ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [selectedPoem]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        let result = q
            ? poems.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.body.toLowerCase().includes(q)
            )
            : [...poems];

        switch (sort) {
            case "newest": result.sort((a, b) => b.index - a.index); break;
            case "oldest": result.sort((a, b) => a.index - b.index); break;
            case "az": result.sort((a, b) => a.title.localeCompare(b.title)); break;
            case "za": result.sort((a, b) => b.title.localeCompare(a.title)); break;
        }

        return result;
    }, [poems, search, sort]);

    const inputStyle: React.CSSProperties = {
        width: "100%",
        background: "rgba(15, 23, 42, 0.92)",
        border: "1px solid rgba(148, 163, 184, 0.18)",
        borderRadius: "12px",
        padding: "0.75rem 1rem 0.75rem 2.75rem",
        color: "#f8fafc",
        fontSize: "0.95rem",
        fontFamily: "inherit",
        outline: "none",
        transition: "border-color 0.18s",
        boxSizing: "border-box",
    };

    const sortBtnStyle = (active: boolean): React.CSSProperties => ({
        background: active ? "rgba(96, 165, 250, 0.14)" : "rgba(15, 23, 42, 0.92)",
        border: `1px solid ${active ? "rgba(96, 165, 250, 0.35)" : "rgba(148, 163, 184, 0.18)"}`,
        borderRadius: "999px",
        padding: "0.4rem 0.85rem",
        color: active ? "#93c5fd" : "#94a3b8",
        fontSize: "0.82rem",
        fontWeight: active ? 700 : 500,
        fontFamily: "inherit",
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap" as const,
    });

    return (
        <>
            <div style={{
                minHeight: "100vh",
                padding: "5rem 1.5rem 3rem",
                boxSizing: "border-box",
                maxWidth: "860px",
                margin: "0 auto",
            }}>
                {/* Back button */}
                <a
                    href="/"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "#94a3b8",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        marginBottom: "2rem",
                        textDecoration: "none",
                        cursor: "pointer",
                        background: "rgba(15, 23, 42, 0.92)",
                        border: "1px solid rgba(148, 163, 184, 0.18)",
                        borderRadius: "999px",
                        padding: "0.4rem 0.9rem 0.4rem 0.7rem",
                        transition: "color 0.15s, border-color 0.15s, background 0.15s",
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.color = "#f8fafc";
                        e.currentTarget.style.borderColor = "rgba(96, 165, 250, 0.35)";
                        e.currentTarget.style.background = "rgba(96, 165, 250, 0.06)";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.color = "#94a3b8";
                        e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.18)";
                        e.currentTarget.style.background = "rgba(15, 23, 42, 0.92)";
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back to Main Site
                </a>

                {/* Page heading */}
                <h1 style={{
                    fontSize: "clamp(2rem, 4vw, 3.2rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    color: "#f8fafc",
                    marginBottom: "40px",
                }}>
                    Poetry
                </h1>
                <div style={{ marginBottom: "2rem" }}>
                    <span style={{
                        display: "inline-block",
                        marginBottom: "0.75rem",
                        padding: "0.45rem 0.8rem",
                        borderRadius: "999px",
                        background: "rgba(96, 165, 250, 0.14)",
                        color: "#bfdbfe",
                        fontSize: "0.82rem",
                        // fontWeight: 700,
                        letterSpacing: "0.08em",
                        // textTransform: "italics",
                    }}>
                        <i>Not everything I build is software. This is where I write poetry: personal, unfiltered, self-published.</i>
                    </span>
                </div>

                {/* Search + Sort */}
                <div style={{ marginBottom: "1.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ position: "relative" }}>
                        <svg
                            style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by title or content..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={inputStyle}
                            onFocus={e => (e.currentTarget.style.borderColor = "rgba(96, 165, 250, 0.45)")}
                            onBlur={e => (e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.18)")}
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                style={{
                                    position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)",
                                    background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1rem", lineHeight: 1,
                                }}
                            >
                                x
                            </button>
                        )}
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: "0.82rem", color: "#94a3b8", fontWeight: 500, marginRight: "0.25rem" }}>Sort:</span>
                        {(Object.keys(SORT_LABELS) as SortOption[]).map(opt => (
                            <button key={opt} onClick={() => setSort(opt)} style={sortBtnStyle(sort === opt)}>
                                {SORT_LABELS[opt]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results count */}
                {!loading && search && (
                    <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1rem" }}>
                        {filtered.length} {filtered.length === 1 ? "poem" : "poems"} found
                    </p>
                )}

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
                ) : filtered.length === 0 ? (
                    <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>No poems match your search.</p>
                ) : (
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {filtered.map((poem) => (
                            <li key={poem.index}>
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
                                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        {poem.title}
                                        {poem.dedication && <InfoTooltip text={poem.dedication} />}
                                    </span>
                                    <span style={{ color: "#94a3b8", fontSize: "1.1rem", flexShrink: 0 }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

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
                            esc
                        </button>

                        <h2 style={{
                            fontSize: "1.4rem",
                            fontWeight: 700,
                            color: "#f8fafc",
                            margin: "0 3rem 0.5rem 0",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.2,
                        }}>
                            {selectedPoem.title}
                        </h2>

                        {selectedPoem.dedication && (
                            <p style={{
                                fontSize: "0.85rem",
                                color: "#64748b",
                                fontStyle: "italic",
                                margin: "0 0 1.25rem 0",
                            }}>
                                {selectedPoem.dedication}
                            </p>
                        )}

                        <div style={{
                            height: "1px",
                            background: "rgba(148, 163, 184, 0.18)",
                            marginBottom: "1.75rem",
                            marginTop: selectedPoem.dedication ? 0 : "1.25rem",
                        }} />

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