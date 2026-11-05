import * as Popover from "@radix-ui/react-popover";

// accessible name for the info button; the visible note is the dedication itself
const BUTTON_LABEL = "Dedication";

interface DedicationNoteProps {
    text: string;
}

// the small info icon next to a poem title. radix handles opening on click, tap, enter or space,
// closing on escape or an outside click, and moving focus in and back out.
export default function DedicationNote({ text }: DedicationNoteProps) {
    const isLink = text.startsWith("http://") || text.startsWith("https://");

    let content = <span>{text}</span>;
    if (isLink) {
        content = (
            <a href={text} target="_blank" rel="noreferrer" className="text-link">
                {text}
            </a>
        );
    }

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button type="button" className="poem-note-button" aria-label={BUTTON_LABEL}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="8" strokeWidth="3" />
                        <line x1="12" y1="12" x2="12" y2="16" />
                    </svg>
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content className="poem-note-text" side="top" align="start" sideOffset={8} collisionPadding={16}>
                    {content}
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
