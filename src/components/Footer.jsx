import TextLink from "./ui/TextLink";

// showLinks is turned off on the homepage, where the Contact section right above has the same links
export default function Footer({ showLinks = true }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-meta">
          <p>© {year} Josh Cohn</p>
          <p>Built with React</p>
        </div>

        {showLinks && (
          <div className="footer-links">
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
        )}
      </div>
    </footer>
  );
}
