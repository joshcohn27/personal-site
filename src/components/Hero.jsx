import ButtonLink from "./ui/ButtonLink";
import TextLink from "./ui/TextLink";

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
						<ButtonLink href="/JoshuaCohnResume.pdf" newTab>
							View Resume
						</ButtonLink>
					</div>

					<div className="hero-links">
						<TextLink href="mailto:joshcohn27@gmail.com">
							joshcohn27@gmail.com
						</TextLink>
						<TextLink href="https://github.com/joshcohn27" newTab>
							GitHub
						</TextLink>
						<TextLink href="https://www.linkedin.com/in/josh-cohn-2226061ba/" newTab>
							LinkedIn
						</TextLink>
					</div>
				</div>

				<img
					className="hero-photo"
					src="/headshot.jpg"
					srcSet="/headshot-256.webp 256w, /headshot-400.webp 400w, /headshot-640.webp 640w"
					sizes="(max-width: 720px) 128px, (max-width: 960px) 280px, 320px"
					alt="Josh Cohn"
					width="640"
					height="800"
					loading="eager"
					fetchPriority="high"
				/>
			</div>
		</section>
	);
}