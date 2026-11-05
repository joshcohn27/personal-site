import TextLink from "./ui/TextLink";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-meta">
          <p>© {year} Josh Cohn</p>
          <p>Built with React</p>
        </div>

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
      </div>
    </footer>
  );
}
