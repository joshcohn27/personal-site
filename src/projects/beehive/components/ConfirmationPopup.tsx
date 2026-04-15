
import { useState } from "react";

interface ConfirmationPopupProps {
    message: string;
    onConfirm: (password: string) => Promise<void> | void;
    onCancel: () => void;
}

export const ConfirmationPopup = ({ message, onConfirm, onCancel }: ConfirmationPopupProps) => {
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const popupStyle: React.CSSProperties = {
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1em',
        bottom: '1em',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '1em',
        borderRadius: '8px',
        color: '#fff',
        backgroundColor: '#4CAF50',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        zIndex: 1000,
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        minWidth: '18rem',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.35)',
        padding: '.7em .85em',
        fontSize: '1rem',
        backgroundColor: 'rgba(255,255,255,0.15)',
        color: '#fff',
        outline: 'none',
    };

    const actionsStyle: React.CSSProperties = {
        display: 'flex',
        gap: '.75em',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    };

    const buttonStyle: React.CSSProperties = {
        border: 'none',
        borderRadius: '8px',
        padding: '.6em 1em',
        cursor: 'pointer',
        fontWeight: 600,
    };

    const confirmStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: '#ffffff',
        color: '#1e7c3b',
    };

    const cancelStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: '#fff',
    };

    const inputWrapStyle: React.CSSProperties = {
        flex: '1 1 18rem',
        minWidth: '18rem',
    };

    const buttonGroupStyle: React.CSSProperties = {
        display: 'flex',
        gap: '.75em',
        marginLeft: 'auto',
    };

    const handleConfirm = async () => {
        setError("");
        setIsSubmitting(true);

        try {
            await onConfirm(password);
            setPassword("");
        } catch (confirmError) {
            setError(confirmError instanceof Error ? confirmError.message : "Unable to confirm changes.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={popupStyle}>
            <p>{message}</p>
            {error && <p style={{ margin: 0, color: "#ffd7d7", fontSize: ".9rem" }}>{error}</p>}
            <div style={actionsStyle}>
                <div style={inputWrapStyle}>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Current password"
                        style={inputStyle}
                        autoComplete="current-password"
                    />
                </div>
                <div style={buttonGroupStyle}>
                    <button type="button" onClick={onCancel} style={cancelStyle} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        style={confirmStyle}
                        disabled={isSubmitting || password.trim().length === 0}
                    >
                        {isSubmitting ? "Checking..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    )
}