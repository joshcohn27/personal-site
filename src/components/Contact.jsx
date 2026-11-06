import TextLink from "./ui/TextLink";
import SectionHeader from "./ui/SectionHeader";

export default function Contact() {
    return (
        <section id="contact" className="section">
            <div className="container">
                <SectionHeader title="Contact" subtitle="Get in touch" />

                <div className="contact">
                    <div>
                        <p className="contact-text">
                            I'm always interested in opportunities to build, learn, and
                            contribute to projects that have real impact.
                        </p>
                    </div>

                    <div className="contact-links">
                        <TextLink href="mailto:joshcohn27@gmail.com">
                            joshcohn27@gmail.com
                        </TextLink>
                        {/* <TextLink href="tel:+16102902280">
                            (610) 290-2280
                        </TextLink> */}
                        <TextLink href="https://github.com/joshcohn27" newTab>
                            GitHub
                        </TextLink>
                        <TextLink href="https://www.linkedin.com/in/josh-cohn-2226061ba/" newTab>
                            LinkedIn
                        </TextLink>
                    </div>
                </div>
            </div>
        </section>
    );
}