import React from "react";
import FrontArrow from "../assets/FrontArrow.svg";
import { AddLogButton } from "./AddLogButton";
import { OpenButton } from "./OpenButton";
import { LogType } from "../types/SensorTypeEnums";

interface LogPanelProps {
	title: string;
	headline: string;
	body: string;
	date: string;
	logType: LogType;

	onAdd?: () => void;
	onOpen?: () => void;
}

const LogPanel = ({
	title,
	headline,
	body,
	date,
	logType,
	onAdd,
	onOpen,
}: LogPanelProps) => {
	const cardStyle: React.CSSProperties = {
		boxShadow: "0 4px 16px #00000022",
		borderRadius: 16,
		backgroundColor: "var(--foreground-color, #ffffff)",
		width: "100%",
		boxSizing: "border-box",
		padding: "clamp(0.75rem, 1.2vw, 1rem)",
		display: "flex",
		flexDirection: "column",
		gap: "0.45rem",
		height: "100%",
	};

	const titleStyle: React.CSSProperties = {
		margin: 0,
		fontWeight: 700,
		fontSize: "0.9rem",
		opacity: 0.85,
	};

	const headlineStyle: React.CSSProperties = {
		margin: 0,
		fontWeight: 900,
		fontSize: "1.25rem",
		lineHeight: 1.15,
	};

	const bodyStyle: React.CSSProperties = {
		margin: 0,
		fontWeight: 500,
		color: "#333333",
		fontSize: "0.92rem",
		lineHeight: 1.25,
		overflow: "hidden",
		display: "-webkit-box",
		WebkitLineClamp: 5,
		WebkitBoxOrient: "vertical",
	};

	const dateStyle: React.CSSProperties = {
		margin: 0,
		fontSize: "0.7rem",
		fontWeight: 500,
		color: "#707070",
		whiteSpace: "nowrap",
	};

	const footerRowStyle: React.CSSProperties = {
		marginTop: "auto",
		display: "flex",
		alignItems: "flex-end",
		justifyContent: "space-between",
		gap: "0.75rem",
	};
	const headerStyle = {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	}

	return (
		<div style={cardStyle}>
			<div style={headerStyle}>
				<div>
					<p style={titleStyle}>{title}</p>
					<p style={headlineStyle}>{headline}</p>
				</div>
				{onAdd && (
					<AddLogButton logType={LogType.OBSERVATION} onClick={onAdd} />
				)}
				
			</div>
			<p style={bodyStyle}>{body}</p>

			<div style={footerRowStyle}>
				<p style={dateStyle}>{date}</p>
				<span />
				{onOpen && (
					<OpenButton onClick={onOpen} />
				)}
			</div>
		</div>
	);
};

export { LogPanel };
