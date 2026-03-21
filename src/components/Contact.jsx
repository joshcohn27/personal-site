export default function Contact() {
    return (
        <section id="contact" className="section section-alt">
            <div className="container">
                <div className="contact-panel">
                    <div>
                        <p className="section-label">Contact</p>
                        <h2>Let's connect.</h2>
                        <p className="contact-text">
                            I'm always interested in opportunities to build, learn, and
                            contribute to projects that have real impact.
                        </p>
                    </div>

                    <div className="contact-links">
                        <a href="mailto:joshcohn27@gmail.com" className="contact-link">
                            joshcohn27@gmail.com
                        </a>
                        <a href="tel:+16102902280" className="contact-link">
                            (610) 290-2280
                        </a>
                        <a
                            href="https://github.com/joshcohn27"
                            target="_blank"
                            rel="noreferrer"
                            className="contact-link"
                        >
                            GitHub
                        </a>
                        <a
                            href="https://www.linkedin.com/in/josh-cohn-2226061ba/"
                            target="_blank"
                            rel="noreferrer"
                            className="contact-link"
                        >
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}