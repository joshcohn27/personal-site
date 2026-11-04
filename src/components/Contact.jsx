export default function Contact() {
    return (
        <section id="contact" className="section">
            <div className="container">
                <div className="contact">
                    <div>
                        <h2>Get in touch</h2>
                        <p className="contact-text">
                            I'm always interested in opportunities to build, learn, and
                            contribute to projects that have real impact.
                        </p>
                    </div>

                    <div className="contact-links">
                        <a href="mailto:joshcohn27@gmail.com" className="text-link">
                            joshcohn27@gmail.com
                        </a>
                        {/* <a href="tel:+16102902280" className="text-link">
                            (610) 290-2280
                        </a> */}
                        <a
                            href="https://github.com/joshcohn27"
                            target="_blank"
                            rel="noreferrer"
                            className="text-link"
                        >
                            GitHub
                        </a>
                        <a
                            href="https://www.linkedin.com/in/josh-cohn-2226061ba/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-link"
                        >
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}