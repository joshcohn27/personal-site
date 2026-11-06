import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface TextLinkProps {
    // internal route, e.g. "/poetry"
    to?: string;
    // external url, mailto:, or file
    href?: string;
    newTab?: boolean;
    // bold, used for the links at the bottom of project cards
    strong?: boolean;
    children: ReactNode;
}

export default function TextLink({ to, href, newTab = false, strong = false, children }: TextLinkProps) {
    let className = "text-link";
    if (strong) {
        className = "text-link text-link-strong";
    }

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
