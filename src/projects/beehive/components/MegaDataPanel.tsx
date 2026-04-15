import React from "react";
import { StatusType } from "../types/SensorTypeEnums";
import { DataPanel } from "./DataPanel";

type MegaItem = {
	value: any;
	unit?: string;
	status?: StatusType;
};

interface MegaDataPanelProps {
	left: React.ReactElement<typeof DataPanel>;
	right: React.ReactElement<typeof DataPanel>;
}

const MegaDataPanel = ({
	left,
	right,
}: MegaDataPanelProps) => {
	const card: React.CSSProperties = {
		boxShadow: "0 4px 16px #00000022",
		borderRadius: 16,
		backgroundColor: "var(--foreground-color, #ffffff)",
		display: "flex",
		flexDirection: "row" as "row",
		flexWrap: "wrap" as "wrap",
		justifyContent: "space-between",
		width: "100%",
	};

	const panelContanerStyle = {
		height: "100%",
		flex: "0 0 calc(50% - 1em)",
	}

	return (
		<div style={card} role={undefined}>
			<div style={panelContanerStyle}>{left}</div>
			<div style={panelContanerStyle}>{right}</div>
		</div>
	);
};

export { MegaDataPanel };
