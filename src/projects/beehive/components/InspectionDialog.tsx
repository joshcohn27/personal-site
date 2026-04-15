import React, { useMemo, useState } from "react";
import { Modal } from "./Modal";
import { HiveCondition, InspectionDraft } from "../types/InspectionTypes";

type Props = {
	open: boolean;
	hiveId: number;
	onCancel: () => void;
	onSubmit: (draft: InspectionDraft) => void;
};

const CONDITION_OPTIONS: HiveCondition[] = ["Excellent", "Good", "Fair", "Poor"];

const COLORS = {
	closeRed: "#E13C00",
	black: "#181818",
};

const InspectionDialog = ({ open, hiveId, onCancel, onSubmit }: Props) => {
	const today = useMemo(() => {
		const d = new Date();
		const yyyy = d.getFullYear();
		const mm = String(d.getMonth() + 1).padStart(2, "0");
		const dd = String(d.getDate()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}`;
	}, []);

	const [date, setDate] = useState<string>(today);
	const [condition, setCondition] = useState<HiveCondition>("Good");
	const [notes, setNotes] = useState<string>("");

	const [error, setError] = useState<string>("");

	const resetAndClose = () => {
		setError("");
		onCancel();
	};

	const handleAdd = () => {
		setError("");

		if (!date) {
			setError("Please select a date.");
			return;
		}
		if (!notes.trim()) {
			setError("Please enter inspection notes.");
			return;
		}

		onSubmit({
			hiveId,
			date,
			condition,
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
		border: "1px solid rgba(0,0,0,0.15)",
		padding: "0.65rem 0.75rem",
		fontFamily: "Instrument Sans, sans-serif",
		background: "var(--foreground-color, #ffffff)",
		boxSizing: "border-box",
	};

	const textAreaStyle: React.CSSProperties = {
		...inputStyle,
		minHeight: "9rem",
		resize: "vertical",
		lineHeight: 1.35,
	};

	const rowStyle: React.CSSProperties = {
		display: "flex",
		gap: "1rem",
		alignItems: "flex-start",
		flexWrap: "wrap",
	};

	const colStyle: React.CSSProperties = {
		flex: "1 1 240px",
		minWidth: 240,
	};

	const tabRowStyle: React.CSSProperties = {
		display: "flex",
		gap: "1rem",
		borderBottom: "1px solid rgba(0,0,0,0.08)",
		paddingBottom: "0.75rem",
		marginBottom: "1rem",
	};

	const tabStyle = (active: boolean): React.CSSProperties => ({
		fontWeight: active ? 700 : 600,
		cursor: active ? "default" : "not-allowed",
		opacity: active ? 1 : 0.35,
		borderBottom: active ? "2px solid #000" : "2px solid transparent",
		paddingBottom: "0.35rem",
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
		color: "#ffffff",
	};

	const addStyle: React.CSSProperties = {
		...buttonBase,
		backgroundColor: COLORS.black,
		color: "#ffffff",
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
		<Modal open={open} title="Add Inspection" onClose={resetAndClose} footer={footer}>
			{error && (
				<div
					style={{
						marginBottom: "0.85rem",
						padding: "0.75rem 0.85rem",
						borderRadius: 12,
						backgroundColor: "rgba(231,107,107,0.18)",
						border: "1px solid rgba(231,107,107,0.35)",
						fontWeight: 600,
					}}
				>
					{error}
				</div>
			)}

			<div style={rowStyle}>
				<div style={colStyle}>
					<div style={labelStyle}>Date</div>
					<input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
				</div>

				<div style={colStyle}>
					<div style={labelStyle}>Hive Condition</div>
					<select value={condition} onChange={(e) => setCondition(e.target.value as HiveCondition)} style={inputStyle}>
						{CONDITION_OPTIONS.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</div>
			</div>

			<div style={{ marginTop: "1rem" }}>
				<div style={labelStyle}>Inspection Notes</div>
				<textarea
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					style={textAreaStyle}
				/>
			</div>
		</Modal>
	);
};

export { InspectionDialog };