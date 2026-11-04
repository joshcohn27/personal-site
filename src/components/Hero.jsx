export default function Hero() {
	return (
		<section id="top" className="hero-section">
			<div className="container hero-grid">
				<div className="hero-copy">
					<p className="eyebrow">Software Engineer · Drexel MS AI/ML · Philadelphia, PA</p>

					<h1>
						Josh Cohn
					</h1>

					<p className="hero-text">
						I build software and care deeply about who it impacts. I graduated
						from RIT with a BS in Computing and Information Technologies and a
						minor in Software Engineering, and I'm now pursuing an MS in AI and
						Machine Learning at Drexel. I've completed
						two software engineering internships, building a cross-platform
						Air Force app at Discovery Machine and deployment automation at
						Chameleon Consulting Group.
					</p>

					<div className="hero-actions">
						<a href="/projects" className="button button-primary" onClick={() => window.scrollTo(0, 0)}>
							View Projects
						</a>
						<a
							href="/resume.pdf"
							target="_blank"
							rel="noreferrer"
							className="button button-secondary"
						>
							View Resume
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