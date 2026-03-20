import { FaLinkedin } from "react-icons/fa";


export default function Contact() {
    return (
        <section id="contact" className="contact">
            <h2>Contact Me</h2>
            <p>
                I'm always open to connecting about development, design, or new
                opportunities. Reach out any time!
            </p>

            <div className="contact-info">
                <div className="contact-item">
                    <span className="contact-label">Email:</span>
                    <a href="mailto:josh.cohn@example.com">joshcohn27@gmail.com</a>
                </div>

                <div className="contact-item">
                    <span className="contact-label">Phone:</span>
                    <a href="tel:+11234567890">+1 (610) 290-2280</a>
                </div>

                <div className="contact-item">
                    <span className="contact-label">LinkedIn:</span>
                    <a
                        href="https://www.linkedin.com/in/josh-cohn-2226061ba/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaLinkedin className="linkedin-icon" />
                    </a>
                </div>
            </div>
        </section>
    );
}
