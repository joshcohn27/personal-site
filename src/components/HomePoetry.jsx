import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeader from "./ui/SectionHeader";
import ButtonLink from "./ui/ButtonLink";

// homepage poetry section: the poems marked "Featured: yes", from the index the build writes
export default function HomePoetry() {
    const [featured, setFeatured] = useState([]);

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
                // no index means no featured list; the "View all poems" button still works
            }
        };
        load();
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
                    <ul className="poem-list featured-poems">
                        {featured.map((poem) => (
                            <li key={poem.index} className="poem-row">
                                <Link to={`/poetry?poem=${poem.slug}`} className="poem-title">
                                    {poem.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
