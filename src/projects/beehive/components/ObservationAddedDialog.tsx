import React from "react";
import { Modal } from "./Modal";

type Props = {
    open: boolean;
    dateText?: string;
    onClose: () => void;
    onViewAll: () => void;
};

const COLORS = {
    closeRed: "#E13C00",
    black: "#181818",
    border: "rgba(0,0,0,0.12)",
};

const ObservationAddedDialog = ({ open, dateText, onClose, onViewAll }: Props) => {
    const buttonBase: React.CSSProperties = {
        borderRadius: 10,
        padding: "0.65rem 1.1rem",
        border: "none",
        cursor: "pointer",
        fontWeight: 800,
        fontFamily: "Instrument Sans, sans-serif",
    };

    const closeStyle: React.CSSProperties = {
        ...buttonBase,
        backgroundColor: COLORS.closeRed,
        color: "#ffffff",
    };

    const viewStyle: React.CSSProperties = {
        ...buttonBase,
        backgroundColor: COLORS.black,
        color: "#ffffff",
    };

    const titleRow: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontWeight: 900,
    };

    const check: React.CSSProperties = {
        width: 18,
        height: 18,
        borderRadius: 999,
        backgroundColor: "rgba(191,241,186,0.85)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
    };

    const footer = (
        <>
            <button onClick={onClose} style={closeStyle}>
                Close
            </button>
            <button onClick={onViewAll} style={viewStyle}>
                View All Observations
            </button>
        </>
    );

    return (
        <Modal open={open} title="" onClose={onClose} footer={footer} maxWidthPx={560}>
            <div style={titleRow}>
                <span style={check}>✓</span>
                <span>Observation Added</span>
            </div>

            {dateText && (
                <div style={{ marginTop: "0.5rem", opacity: 0.75, fontWeight: 700, fontSize: "0.9rem" }}>
                    {dateText}
                </div>
            )}

            <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        height: 22,
                        padding: "0 10px",
                        borderRadius: 999,
                        backgroundColor: "rgba(0,0,0,0.06)",
                        border: `1px solid ${COLORS.border}`,
                        fontSize: "0.75rem",
                        fontWeight: 800,
                    }}
                >
                    Observation
                </span>
            </div>
        </Modal>
    );
};

export { ObservationAddedDialog };