import type { ReactNode } from "react";

interface TextButtonProps {
    onClick: () => void;
    // marks the selected option in a group, like the current poetry sort
    active?: boolean;
    className?: string;
    title?: string;
    // what screen readers say when the visible text alone isn't clear, like an "x"
    label?: string;
    children: ReactNode;
}

// real button for actions, styled like a text link
export default function TextButton({ onClick, active, className, title, label, children }: TextButtonProps) {
    let classes = "text-button";
    if (active) {
        classes += " is-active";
    }
    if (className) {
        classes += " " + className;
    }

    return (
        <button
            type="button"
            className={classes}
            onClick={onClick}
            title={title}
            aria-label={label}
            aria-pressed={active}
        >
            {children}
        </button>
    );
}
