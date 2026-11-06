import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TextButton from "../components/ui/TextButton";
import { parsePoem } from "./parsePoem";
import type { Poem } from "./parsePoem";
import DedicationNote from "./DedicationNote";
import PoemDialog from "./PoemDialog";

type SortOption = "newest" | "oldest" | "az" | "za";

const SORT_LABELS: Record<SortOption, string> = {
    az: "A to Z",
    za: "Z to A",
    newest: "Newest",
    oldest: "Oldest",
};

export default function Poetry() {
    const [poems, setPoems] = useState<Poem[]>([]);
    const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<SortOption>("az");
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const fetchPoems = async () => {
            const loaded: Poem[] = [];
            let i = 1;

            while (true) {
                try {
                    const res = await fetch(`/poems/poem${i}.txt`);
                    // a missing number comes back as the site's html page, which means we're done
                    const isHtml = res.headers.get("content-type")?.includes("text/html");
                    if (!res.ok || isHtml) {
                        break;
                    }
                    const text = await res.text();
                    loaded.push(parsePoem(text, i));
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

    const closeModal = useCallback(() => {
        setSelectedPoem(null);
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.delete("poem");
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    const openPoem = useCallback((poem: Poem) => {
        setSelectedPoem(poem);
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("poem", poem.slug);
            return next;
        });
    }, [setSearchParams]);

    useEffect(() => {
        if (poems.length === 0) {
            return;
        }
        const poemSlug = searchParams.get("poem");
        if (!poemSlug) {
            return;
        }
        const match = poems.find(p => p.slug === poemSlug);
        if (match) {
            setSelectedPoem(match);
        }
    }, [poems, searchParams]);

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

    let results = null;
    if (!loading && filtered.length === 0) {
        results = <p>No poems match your search.</p>;
    } else if (!loading) {
        results = (
            <ul className="poem-list">
                {filtered.map((poem) => (
                    <li key={poem.index} className="poem-row">
                        <button type="button" className="poem-title" onClick={() => openPoem(poem)}>
                            {poem.title}
                        </button>
                        {poem.dedication && <DedicationNote text={poem.dedication} />}
                    </li>
                ))}
            </ul>
        );
    }

    let resultsClass = "poem-results";
    if (loading) {
        resultsClass = "poem-results is-loading";
    }

    return (
        <div className="site-shell">
            <Header />
            <main>
                <section className="section">
                    <div className="container">
                        <div className="section-heading">
                            <h1>Poetry</h1>
                            <p className="page-intro">
                                Not everything I build is software. This is where I write poetry: personal, unfiltered, self-published.
                            </p>
                        </div>

                        {/* Search + Sort */}
                        <div className="poem-controls">
                            <label htmlFor="poem-search" className="poem-search-label">
                                Search poems
                            </label>
                            <div className="poem-search">
                                <input
                                    id="poem-search"
                                    type="search"
                                    placeholder="Search by title or content..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                {search && (
                                    <TextButton className="poem-search-clear" onClick={() => setSearch("")} label="Clear search">
                                        x
                                    </TextButton>
                                )}
                            </div>

                            <div className="poem-sort">
                                <span className="muted-text">Sort:</span>
                                {(Object.keys(SORT_LABELS) as SortOption[]).map(opt => (
                                    <TextButton key={opt} onClick={() => setSort(opt)} active={sort === opt}>
                                        {SORT_LABELS[opt]}
                                    </TextButton>
                                ))}
                            </div>
                        </div>

                        {/* Results count */}
                        {!loading && search && (
                            <p className="muted-text poem-count">
                                {filtered.length} {filtered.length === 1 ? "poem" : "poems"} found
                            </p>
                        )}

                        {/* Poem list */}
                        {/* keeps room for the list while poems load, so the footer doesn't jump */}
                        <div className={resultsClass}>
                            {results}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />

            {/* Fullscreen poem view */}
            {selectedPoem && <PoemDialog poem={selectedPoem} onClose={closeModal} />}
        </div>
    );
}
