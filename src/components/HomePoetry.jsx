import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeader from "./ui/SectionHeader";
import ButtonLink from "./ui/ButtonLink";
import PoemDialog from "../poetry/PoemDialog";
import { parsePoem } from "../poetry/parsePoem";

// homepage poetry section: a card for each poem marked "Featured: yes", from the index the build writes.
// a card opens its poem right here, in the same poem card the Poetry page uses.
export default function HomePoetry() {
    const [featured, setFeatured] = useState([]);
    const [openPoem, setOpenPoem] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/poems/index.json");
                if (!res.ok) {
                    return;
                }
                const data = await res.json();
                setFeatured(data.poems.filter((poem) => poem.featured));
            } catch {
                // no index means no cards; the "View all poems" button still works
            }
        };
        load();
    }, []);

    // the index only has the first lines, so load the whole poem when it's opened
    const showPoem = async (event, poem) => {
        event.preventDefault();
        try {
            const res = await fetch(`/poems/poem${poem.index}.txt`);
            if (!res.ok) {
                return;
            }
            const text = await res.text();
            setOpenPoem(parsePoem(text, poem.index));
        } catch {
            // couldn't load it: go to the poem on the Poetry page instead
            window.location.href = `/poetry?poem=${poem.slug}`;
        }
    };

    const closePoem = useCallback(() => {
        setOpenPoem(null);
    }, []);

    return (
        <section id="poetry" className="section">
            <div className="container">
                <SectionHeader
                    title="Poetry"
                    subtitle="My creative outlet"
                    action={
                        <ButtonLink to="/poetry" variant="secondary">
                            View all poems
                        </ButtonLink>
                    }
                />

                {featured.length > 0 && (
                    <ul className="project-grid poem-cards">
                        {featured.map((poem) => (
                            <li key={poem.index} className="project-card poem-card">
                                <h3 className="project-title">{poem.title}</h3>
                                <p className="poem-card-lines">
                                    {poem.excerpt.map((line, i) => (
                                        <span key={i}>{line}</span>
                                    ))}
                                </p>
                                {/* stretches over the whole card, so clicking anywhere on it opens the poem */}
                                <Link
                                    to={`/poetry?poem=${poem.slug}`}
                                    className="text-link text-link-strong poem-card-link"
                                    aria-label={`Read the poem ${poem.title}`}
                                    onClick={(event) => showPoem(event, poem)}
                                >
                                    Read the poem
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {openPoem && <PoemDialog poem={openPoem} onClose={closePoem} />}
        </section>
    );
}
