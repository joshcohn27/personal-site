export default function Hero() {
	return (
		<section id="top" className="hero-section">
			<div className="container hero-grid">
				<div className="hero-copy">
					<p className="hero-tagline">Software Engineer · React, TypeScript, Python · Philadelphia, PA</p>

					<h1>
						Josh Cohn
					</h1>

					<p className="hero-text">
						I like building things that make life a little easier. I care about
						doing right by the people who use them. Now I'm getting my MS in AI
						and Machine Learning at Drexel.
					</p>

					<div className="hero-actions">
						<a
							href="/resume.pdf"
							target="_blank"
							rel="noreferrer"
							className="button button-primary"
						>
							View Resume
						</a>
					</div>

					<div className="hero-links">
						<a href="mailto:joshcohn27@gmail.com" className="text-link">
							joshcohn27@gmail.com
						</a>
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

				<img
					className="hero-photo"
					src="/headshot.jpg"
					alt="Josh Cohn"
					width="640"
					height="800"
				/>
			</div>
		</section>
	);
}