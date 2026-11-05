import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ButtonLinkProps {
    // internal route, e.g. "/projects"
    to?: string;
    // external url or file, e.g. "/resume.pdf"
    href?: string;
    variant?: "primary" | "secondary";
    newTab?: boolean;
    children: ReactNode;
}

// link styled as a button, for navigation (use a real <button> for actions)
export default function ButtonLink({ to, href, variant = "primary", newTab = false, children }: ButtonLinkProps) {
    const className = `button button-${variant}`;

    // external links that open a new tab
    let target;
    let rel;
    if (newTab) {
        target = "_blank";
        rel = "noreferrer";
    }

    if (to) {
        return (
            <Link to={to} className={className}>
                {children}
            </Link>
        );
    }

    return (
        <a
            href={href}
            className={className}
            target={target}
            rel={rel}
        >
            {children}
        </a>
    );
}
