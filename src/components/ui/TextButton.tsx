import type { ReactNode } from "react";

interface TextButtonProps {
    onClick: () => void;
    // marks the selected option in a group, like the current poetry sort
    active?: boolean;
    className?: string;
    title?: string;
    children: ReactNode;
}

// real button for actions, styled like a text link
export default function TextButton({ onClick, active, className, title, children }: TextButtonProps) {
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
            aria-pressed={active}
        >
            {children}
        </button>
    );
}
