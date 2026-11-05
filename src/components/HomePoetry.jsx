import SectionHeader from "./ui/SectionHeader";
import ButtonLink from "./ui/ButtonLink";

// homepage poetry section; featured poems are added in a later step
export default function HomePoetry() {
    return (
        <section id="poetry" className="section">
            <div className="container">
                <SectionHeader
                    title="Poetry"
                    action={
                        <ButtonLink to="/poetry" variant="secondary">
                            View all poems
                        </ButtonLink>
                    }
                />
            </div>
        </section>
    );
}
