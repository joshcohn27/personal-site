import React, { useMemo, useState } from "react";
import { Modal } from "./Modal";
import { ObservationDraft, ObservationTag } from "../types/ObservationTypes";

type Props = {
    open: boolean;
    hiveId: number;
    onCancel: () => void;
    onSubmit: (draft: ObservationDraft) => void;
};

const TAG_OPTIONS: ObservationTag[] = [
    "Temperature",
    "Humidity",
    "Pollen",
    "CO2",
    "Volume",
    "Weight",
    "Bearding",
    "Brood",
];

const COLORS = {
    closeRed: "#E13C00",
    black: "#181818",
    border: "rgba(0,0,0,0.15)",
};

const ObservationDialog = ({ open, hiveId, onCancel, onSubmit }: Props) => {
    const today = useMemo(() => {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }, []);

    const [date, setDate] = useState(today);
    const [tags, setTags] = useState<ObservationTag[]>([]);
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");

    const resetAndClose = () => {
        setError("");
        onCancel();
    };

    const toggleTag = (tag: ObservationTag) => {
        setTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const handleAdd = () => {
        setError("");

        if (!date) {
            setError("Please select a date.");
            return;
        }
        if (!notes.trim()) {
            setError("Please enter observation notes.");
            return;
        }

        onSubmit({
            hiveId,
            date,
            tags,
            notes: notes.trim(),
        });
    };

    const labelStyle: React.CSSProperties = {
        fontSize: "0.85rem",
        fontWeight: 600,
        marginBottom: "0.35rem",
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        borderRadius: 12,
        border: `1px solid ${COLORS.border}`,
        padding: "0.65rem 0.75rem",
        fontFamily: "Instrument Sans, sans-serif",
        boxSizing: "border-box",
    };

    const textAreaStyle: React.CSSProperties = {
        ...inputStyle,
        minHeight: "9rem",
        resize: "vertical",
        lineHeight: 1.35,
    };

    const tagGrid: React.CSSProperties = {
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        marginTop: "0.5rem",
    };

    const tagChip = (active: boolean): React.CSSProperties => ({
        padding: "0.4rem 0.7rem",
        borderRadius: 999,
        border: `1px solid ${COLORS.border}`,
        backgroundColor: active ? "rgba(0,0,0,0.08)" : "transparent",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: "0.82rem",
    });

    const buttonBase: React.CSSProperties = {
        borderRadius: 10,
        padding: "0.65rem 1.1rem",
        border: "none",
        cursor: "pointer",
        fontWeight: 800,
        fontFamily: "Instrument Sans, sans-serif",
    };

    const cancelStyle: React.CSSProperties = {
        ...buttonBase,
        backgroundColor: COLORS.closeRed,
        color: "#fff",
    };

    const addStyle: React.CSSProperties = {
        ...buttonBase,
        backgroundColor: COLORS.black,
        color: "#fff",
    };

    const footer = (
        <>
            <button onClick={resetAndClose} style={cancelStyle}>
                Cancel
            </button>
            <button onClick={handleAdd} style={addStyle}>
                Add
            </button>
        </>
    );

    return (
        <Modal open={open} title="Add Observation" onClose={resetAndClose} footer={footer}>
            {error && (
                <div style={{ marginBottom: "1rem", color: "#E76B6B", fontWeight: 600 }}>
                    {error}
                </div>
            )}

            <div>
                <div style={labelStyle}>Date</div>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ marginTop: "1rem" }}>
                <div style={labelStyle}>Tags</div>
                <div style={tagGrid}>
                    {TAG_OPTIONS.map((tag) => {
                        const active = tags.includes(tag);
                        return (
                            <div key={tag} style={tagChip(active)} onClick={() => toggleTag(tag)}>
                                {tag}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
                <div style={labelStyle}>Observation Notes</div>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    maxLength={500}
                    style={textAreaStyle}
                />
            </div>
        </Modal>
    );
};

export { ObservationDialog };