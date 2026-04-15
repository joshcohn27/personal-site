import React, { useEffect } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
    open: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidthPx?: number;
};

const Modal = ({
    open,
    title,
    onClose,
    children,
    footer,
    maxWidthPx = 720,
}: ModalProps) => {
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", onKeyDown);

        // prevent background scroll
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    const overlayStyle: React.CSSProperties = {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
    };

    const cardStyle: React.CSSProperties = {
        width: "100%",
        maxWidth: maxWidthPx,
        backgroundColor: "var(--foreground-color, #ffffff)",
        borderRadius: 16,
        boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        overflow: "hidden",
    };

    const headerStyle: React.CSSProperties = {
        padding: "1rem 1.25rem",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
    };

    const titleStyle: React.CSSProperties = {
        margin: 0,
        fontSize: "1rem",
        fontWeight: 600,
    };

    const closeButtonStyle: React.CSSProperties = {
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontSize: "1.25rem",
        lineHeight: 1,
        padding: "0.25rem 0.5rem",
        borderRadius: 8,
    };

    const bodyStyle: React.CSSProperties = {
        padding: "1.25rem",
    };

    const footerStyle: React.CSSProperties = {
        padding: "1rem 1.25rem",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        justifyContent: "flex-end",
        gap: "0.75rem",
    };

    const onOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        // only close if they clicked the overlay, not the card
        if (e.target === e.currentTarget) onClose();
    };

    return createPortal(
        <div style={overlayStyle} onMouseDown={onOverlayMouseDown} role="dialog" aria-modal="true">
            <div style={cardStyle}>
                {(title ?? "").length > 0 && (
                    <div style={headerStyle}>
                        <h3 style={titleStyle}>{title}</h3>
                        <button style={closeButtonStyle} onClick={onClose} aria-label="Close">
                            ×
                        </button>
                    </div>
                )}

                <div style={bodyStyle}>{children}</div>

                {footer && <div style={footerStyle}>{footer}</div>}
            </div>
        </div>,
        document.body
    );
};

export { Modal };