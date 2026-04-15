import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataPanel } from "../components/DataPanel";
import { MegaDataPanel } from "../components/MegaDataPanel";
import { SensorType, SENSOR_SYMBOL, StatusType, LogType, SENSOR_ROUTE } from "../types/SensorTypeEnums";
import { AllHiveDataResponse } from "../types/JSONTypes";
import { dateToSqlTimestamp } from "../utils/SQLUtils";
import { fetchJson } from "../utils/FetchUtil";
import { DashboardGraphToggle } from "../components/DashboardGraphToggle";
import "./DashboardPage.css";
import FrontArrow from "../assets/FrontArrow.svg";
import { getUser } from "../utils/AuthStore";
import GraphPage from "./GraphPage";
import { MessagePopup, MessageType } from "../components/MessagePopup";
import { useCacheStore } from "../utils/CacheHandler";
import { ObservationDialog } from "../components/ObservationDialog";
import { ObservationAddedDialog } from "../components/ObservationAddedDialog";
import { Observation, ObservationDraft } from "../types/ObservationTypes";
import { InspectionDialog } from "../components/InspectionDialog";
import { InspectionAddedDialog } from "../components/InspectionAddedDialog";
import { Inspection, InspectionDraft } from "../types/InspectionTypes";
import { useUpdatePolling } from "../utils/UpdaterUtil";

const HIVE_OPTIONS = ["Hive 1", "Hive 2", "Hive 3"] as const;
const POLL_INTERVAL_MS = 10 * 60 * 1000;

const COLORS = {
	closeRed: "#E13C00",
	black: "#181818",
	border: "rgba(0,0,0,0.10)",
	shadow: "0 4px 16px rgba(0,0,0,0.10)",
	bg: "#F3F3F3",
	cardBg: "#FFFFFF",
	text: "rgb(0,0,0)",
};

type DashboardLogCardProps = {
	title: string;
	headline: string;
	body: string;
	date: string;
	logType: LogType;
	onAdd: () => void;
	onOpen: () => void;
};

const formatDisplayDate = (dateString: string): string => {
	if (!dateString) return "";

	const [year, month, day] = dateString.split("-").map(Number);

	if (!year || !month || !day) return "";

	const date = new Date(year, month - 1, day);

	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

const DashboardLogCard = ({
	title,
	headline,
	body,
	date,
	onAdd,
	onOpen,
}: DashboardLogCardProps) => {
	const cardStyle: React.CSSProperties = {
		backgroundColor: COLORS.cardBg,
		borderRadius: 16,
		border: `1px solid ${COLORS.border}`,
		boxShadow: COLORS.shadow,
		padding: "18px 18px 14px",
		display: "flex",
		flexDirection: "column",
		position: "relative",
		boxSizing: "border-box",
		width: "100%",
		height: "100%",
	};

	const titleStyle: React.CSSProperties = {
		fontFamily: "Instrument Sans, sans-serif",
		fontWeight: 400,
		fontSize: "22px",
		color: "rgba(0,0,0,0.75)",
		marginBottom: 8,
		paddingRight: 84,
	};

	const headlineStyle: React.CSSProperties = {
		fontFamily: "Instrument Sans, sans-serif",
		fontWeight: 600,
		fontSize: "32px",
		lineHeight: "100%",
		letterSpacing: "0%",
		color: COLORS.black,
		marginBottom: 12,
		paddingRight: 90,
	};

	const bodyStyle: React.CSSProperties = {
		fontFamily: "Instrument Sans, sans-serif",
		fontWeight: 400,
		fontSize: "24px",
		lineHeight: "100%",
		letterSpacing: "0%",
		color: COLORS.text,
		display: "-webkit-box",
		WebkitLineClamp: 4,
		WebkitBoxOrient: "vertical",
		overflow: "hidden",
		marginBottom: "auto",
		paddingRight: 12,
	};

	const dateStyle: React.CSSProperties = {
		fontFamily: "Instrument Sans, sans-serif",
		fontWeight: 400,
		fontSize: "16px",
		color: "rgba(0,0,0,0.5)",
		marginTop: 16,
	};

	const plusButtonStyle: React.CSSProperties = {
		position: "absolute",
		top: 16,
		right: 16,
		width: 48,
		height: 48,
		borderRadius: 8,
		border: "none",
		backgroundColor: COLORS.black,
		color: "#FFFFFF",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		cursor: "pointer",
		fontSize: "1.6rem",
		lineHeight: 1,
		padding: 0,
	};

	const arrowButtonStyle: React.CSSProperties = {
		position: "absolute",
		right: 16,
		bottom: 12,
		width: 32,
		height: 32,
		border: "none",
		background: "transparent",
		cursor: "pointer",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
	};

	return (
		<div style={cardStyle}>
			<div style={titleStyle}>{title}</div>

			<button
				type="button"
				style={plusButtonStyle}
				onClick={onAdd}
				aria-label={`Add ${title}`}
			>
				+
			</button>

			<div style={headlineStyle}>{headline}</div>

			<div style={bodyStyle}>{body}</div>

			<div style={dateStyle}>{formatDisplayDate(date)}</div>

			<button
				type="button"
				style={arrowButtonStyle}
				onClick={onOpen}
				aria-label={`Open ${title}`}
			>
				<img src={FrontArrow} alt="" style={{ width: 30, height: 30 }} />
			</button>
		</div>
	);
};

const DashboardPage = () => {
	const navigate = useNavigate();
	const [selectedHive, setSelectedHive] = useState<(typeof HIVE_OPTIONS)[number]>("Hive 1");
	const [showAlert, setShowAlert] = useState(false);
	const [transitioning, setTransitioning] = useState(true);
	const [user, setUser] = useState(getUser());
	const [error, setError] = useState<string | null>(null);
	const [prunedData, setPrunedData] = useState<Record<string, { value: any; timestamp: string }> | null	>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isDashboardView, setIsDashboardView] = useState(true);
	const { setCache } = useCacheStore();

	const [latestObservation, setLatestObservation] = useState<{
		headline: string;
		body: string;
		date: string;
	} | null>(null);
	const [addObservationOpen, setAddObservationOpen] = useState(false);
	const [observationConfirmOpen, setObservationConfirmOpen] = useState(false);
	const [lastAddedObservation, setLastAddedObservation] = useState<Observation | null>(null);

	const [latestInspection, setLatestInspection] = useState<{
		headline: string;
		body: string;
		date: string;
	} | null>(null);
	const [addInspectionOpen, setAddInspectionOpen] = useState(false);
	const [inspectionConfirmOpen, setInspectionConfirmOpen] = useState(false);
	const [lastAddedInspection, setLastAddedInspection] = useState<Inspection | null>(null);

	const hiveNumber = Number(selectedHive.split(" ")[1]);

	function fetchHiveData() {
		const currentTime = dateToSqlTimestamp(new Date());
		const oneHourAgo = dateToSqlTimestamp(new Date(Date.now() - 60 * 60 * 1000));

		if (!user?.userID || !user?.organizationID) {
			setError("User information is missing. Please log in again.");
			setIsLoading(false);
			return;
		}

		setIsLoading(true);

		const requestBody = {
			Hive_ID: hiveNumber,
			StartDate: oneHourAgo,
			EndDate: currentTime,
			User: {
				User_ID: user.userID,
				Organization_ID: user.organizationID,
			},
		};

		fetchJson<AllHiveDataResponse>(`/HiveData`, {
			method: "POST",
			body: requestBody,
		})
		.then((response) => {
			setPrunedData(pruneHiveData(response));
			setError(null);
		})
		.catch((error) => {
			if (error.status === 400) {
				setError("400: Warning; No data available within the last hour for this hive.");
			} else {
				setError("500: Server Error. Please try again later");
			}
		})
		.finally(() => {
			setIsLoading(false)
			setCache(String(hiveNumber), prunedData);
		});
	}

	function pruneHiveData(data: AllHiveDataResponse | null) {

		const latestEntry = data?.Hive_Data[data?.Hive_Data.length - 1];
		if (!latestEntry) return data;

		const dataWithTimestamps = Object.entries(latestEntry).reduce((acc, [key, value]) => {
			if (value !== null && value !== undefined && key !== "TimeStamp") {
				acc[key] = { value, timestamp: latestEntry.TimeStamp };
			}
			return acc;
		}, {} as Record<string, { value: any; timestamp: string }>);

		return dataWithTimestamps as any;
	}

	function fetchLatestObservation() {
		if (!user?.userID || !user?.organizationID) return;

		fetchJson<any>(`/Observations`, {
			method: "POST",
			body: {
				Hive_ID: hiveNumber,
				User: {
					User_ID: user.userID,
					Organization_ID: user.organizationID,
				},
			},
		})
			.then((response) => {
				const raw: any[] =
					response?.Observations ??
					response?.Observation ??
					response?.observations ??
					[];


				if (raw.length === 0) {
					setLatestObservation(null);
					return;
				}

				const sorted = [...raw].sort((a, b) => {
					const oa = a.Observation_ID ?? a.observation_id ?? 0;
					const ob = b.Observation_ID ?? b.observation_id ?? 0;
					return ob - oa;
				});


				const latest = sorted[0];
				const rawTags: any[] = latest.Tags ?? latest.tags ?? [];
				const tagNames = rawTags
					.map((t) => (typeof t === "string" ? t : t.Tag ?? t.tag ?? ""))
					.filter(Boolean);

				setLatestObservation({
					headline: tagNames.length > 0 ? tagNames.join(", ") : "No tags",
					body: latest.Description ?? latest.description ?? "",
					date: (latest.TimeStamp ?? latest.Timestamp ?? latest.timestamp ?? "").slice(0, 10),
				});
			})
			.catch((error) => {
				console.error("Failed to fetch observations:", error);
				setLatestObservation(null);
			});
	}

	async function handleSubmitObservation(draft: ObservationDraft) {
		if (!user?.userID || !user?.organizationID) {
			setError("User information is missing. Please log in again.");
			return;
		}

		const uiDateToApiTimestamp = (date: string): string => {
			if (!date) return "";
			if (date.length >= 19) return date;
			return `${date} 00:00:00`;
		};

		const addPayload = {
			Hive_ID: hiveNumber,
			User: {
				User_ID: Number(user.userID),
				Organization_ID: Number(user.organizationID),
			},
			Observation: {
				Timestamp: uiDateToApiTimestamp(draft.date),
				Description: draft.notes,
				Tags: (draft.tags ?? []).map((t) => ({ Tag: t })),
			},
		};

		try {
			await fetchJson<{ Result?: string }>(`/Observations`, {
				method: "PUT",
				body: addPayload,
			});


			setLastAddedObservation({ id: `pending-${Date.now()}`, ...draft });
			setAddObservationOpen(false);
			setObservationConfirmOpen(true);
			fetchLatestObservation();
		} catch (e) {
			console.error("DashboardPage: failed to add observation", e);
			setError("We couldn't save the observation. Please try again.");
		}
	}

	function fetchLatestInspection() {
		if (!user?.userID || !user?.organizationID) return;

		const parseTimestamp = (value: string): number => {
			if (!value) return 0;

			const trimmed = value.trim();

			if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
				const parsed = new Date(trimmed.replace(" ", "T"));
				return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
			}

			const oracleMatch = trimmed.match(/^(\d{2})-([A-Z]{3})-(\d{2})/i);
			if (oracleMatch) {
				const [, day, monthAbbr, year] = oracleMatch;

				const monthMap: Record<string, string> = {
					JAN: "01",
					FEB: "02",
					MAR: "03",
					APR: "04",
					MAY: "05",
					JUN: "06",
					JUL: "07",
					AUG: "08",
					SEP: "09",
					OCT: "10",
					NOV: "11",
					DEC: "12",
				};

				const month = monthMap[monthAbbr.toUpperCase()];
				if (month) {
					const rebuilt = `20${year}-${month}-${day}`;
					const parsed = new Date(rebuilt);
					return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
				}
			}

			const cleaned = trimmed.replace(/^DATE/, "").trim();
			const parsed = new Date(cleaned);
			return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
		};

		fetchJson<any>(`/Inspections`, {
			method: "POST",
			body: {
				Hive_ID: hiveNumber,
				User: {
					User_ID: user.userID,
					Organization_ID: user.organizationID,
				},
			},
		})
			.then((response) => {
				const raw: any[] =
					response?.Inspections ??
					response?.Inspection ??
					response?.inspections ??
					[];

				if (raw.length === 0) {
					setLatestInspection(null);
					return;
				}

				const sorted = [...raw].sort((a, b) => {
					const ia = a.Inspection_ID ?? a.inspection_id ?? 0;
					const ib = b.Inspection_ID ?? b.inspection_id ?? 0;
					return ib - ia;
				});

				const latest = sorted[0];
				const rawTags: any[] = latest.Tags ?? latest.tags ?? [];

				const condition =
					rawTags
						.map((t) => (typeof t === "string" ? t : t.Tag ?? t.tag ?? ""))
						.find((t) => ["Poor", "Fair", "Good", "Excellent"].includes(t)) ?? "Unknown";

				const rawDate = latest.TimeStamp ?? latest.Timestamp ?? latest.timestamp ?? "";
				const normalizedDate = String(rawDate).trim().slice(0, 10);

				setLatestInspection({
					headline: condition,
					body: latest.Description ?? latest.description ?? "",
					date: normalizedDate,
				});
			})
			.catch(() => {
				setLatestInspection(null);
			});
	}

	async function handleSubmitInspection(draft: InspectionDraft) {
		if (!user?.userID || !user?.organizationID) {
			setError("User information is missing. Please log in again.");
			return;
		}

		const addPayload = {
			Hive_ID: hiveNumber,
			User: {
				User_ID: Number(user.userID),
				Organization_ID: Number(user.organizationID),
			},
			Inspection: {
				TimeStamp: `${draft.date} 00:00:00`,
				Description: draft.notes,
				Tags: [{ Tag: draft.condition }],
			},
		};

		try {
			await fetchJson<{ Result?: string }>(`/Inspections`, {
				method: "PUT",
				body: addPayload,
			});

			const created: Inspection = {
				id: `pending-${Date.now()}`,
				hiveId: hiveNumber,
				date: draft.date,
				condition: draft.condition,
				notes: draft.notes,
			};

			setLastAddedInspection(created);
			setAddInspectionOpen(false);
			setInspectionConfirmOpen(true);
			fetchLatestInspection();
		} catch (e) {
			console.error("DashboardPage: failed to add inspection", e);
			setError("We couldn't save the inspection. Please try again.");
		}
	}
	// Polling for latest hive data every 10 minutes
	useUpdatePolling(async () => {
		console.log("Polling for latest hive data...");
		fetchHiveData();
	}, { intervalMs: POLL_INTERVAL_MS, immediate: false }); 

	function toggleDashboardView() {
		setTransitioning(true);
		setIsDashboardView((prev) => !prev);
	}

	const dashboardLayoutStyle = {
		display: "flex",
		flexDirection: "row" as const,
		flexWrap: "wrap" as const,
		gap: "2em",
		margin: "4em",
		marginTop: "2em",
	};

	const dataContainerStyle = {
		display: "flex",
		flexDirection: "row" as const,
		flexWrap: "wrap" as const,
		gap: "2em",
		flex: 2,
		opacity: 1,
		transition: "opacity 0.3s ease-in",
	};

	const dataContainerStyleStart = {
		...dataContainerStyle,
		opacity: 0,
	};

	const logContainerStyle = {
		display: "flex",
		flexDirection: "column" as const,
		gap: "2em",
		flex: 1,
		maxHeight: "100%",
		opacity: 1,
		transition: "opacity 0.3s ease-in",
	};

	const logContainerStyleStart = {
		...logContainerStyle,
		opacity: 0,
	};

	const logPanelContainerStyle = {
		flexBasis: "100%",
		height: "100%",
	};

	const megaPanelContainerStyle = {
		flex: "0 0 100%",
	};

	const dataPanelContainerStyle = {
		flex: "1 1 400px",
		width: "100%",
	};

	const graphPageContainerStyleStart = {
		opacity: 0,
	};

	const graphPageContainerStyleEnd = {
		transition: "opacity 0.3s ease-in",
		opacity: 1,
	};

	useEffect(() => {
		fetchHiveData();
		fetchLatestObservation();
		fetchLatestInspection();
	}, [selectedHive, user]);

	useEffect(() => {
		if (transitioning) {
			const timeout = setTimeout(() => {
				setTransitioning(false);
			}, 250);

			return () => clearTimeout(timeout);
		}
	}, [transitioning]);

	return (
		<div>
			{showAlert && (
				<div className="alertBar" role="status" aria-live="polite">
					<span className="alertText">
						Major Event Detected: Colony Swarm in 8 minutes
					</span>
					<button className="alertLink">Learn More</button>
				</div>
			)}

			{isDashboardView ? (
				<div style={dashboardLayoutStyle}>
					<div style={transitioning ? dataContainerStyleStart : dataContainerStyle}>
						<div style={megaPanelContainerStyle}>
							<MegaDataPanel
								left={
									<DataPanel
										title="Hive Temperature"
										dataSnapshot={prunedData?.Temperature?.value}
										unit={SENSOR_SYMBOL[SensorType.TEMPERATURE]}
										status={StatusType.NORMAL}
										lastUpdated={`Last updated ${prunedData?.Temperature?.timestamp ? new Date(prunedData.Temperature.timestamp).toLocaleTimeString() : "N/A"}`}
										isMega={true}
									/>
								}
								right={
									<DataPanel
										title="Outside Temperature"
										dataSnapshot={prunedData?.Outside_Temperature?.value}
										unit={SENSOR_SYMBOL[SensorType.TEMPERATURE]}
										redirectLink={`/${SENSOR_ROUTE[SensorType.TEMPERATURE]}/${hiveNumber}`}
										lastUpdated={`Last updated ${prunedData?.Outside_Temperature?.timestamp ? new Date(prunedData.Outside_Temperature.timestamp).toLocaleTimeString() : "N/A"}`}
										isMega={true}
									/>
								}
							/>
						</div>

						<div style={dataPanelContainerStyle}>
							<DataPanel
								title="Hive Humidity"
								dataSnapshot={prunedData?.Humidity?.value}
								unit={SENSOR_SYMBOL[SensorType.HUMIDITY]}
								status={StatusType.NORMAL}
								lastUpdated={`Last updated ${prunedData?.Humidity?.timestamp ? new Date(prunedData.Humidity.timestamp).toLocaleTimeString() : "N/A"}`}
								redirectLink={`/${SENSOR_ROUTE[SensorType.HUMIDITY]}/${hiveNumber}`}
							/>
						</div>

						<div style={dataPanelContainerStyle}>
							<DataPanel
								title="Hive CO₂"
								dataSnapshot={prunedData?.Carbon_Dioxide?.value}
								unit={SENSOR_SYMBOL[SensorType.CARBON_DIOXIDE]}
								status={StatusType.HIGH}
								lastUpdated={`Last updated ${prunedData?.Carbon_Dioxide?.timestamp ? new Date(prunedData.Carbon_Dioxide.timestamp).toLocaleTimeString() : "N/A"}`}
								redirectLink={`/${SENSOR_ROUTE[SensorType.CARBON_DIOXIDE]}/${hiveNumber}`}
							/>
						</div>

						<div style={dataPanelContainerStyle}>
							<DataPanel
								title="Hive Volume"
								dataSnapshot={prunedData?.Volume?.value}
								unit={SENSOR_SYMBOL[SensorType.VOLUME]}
								status={StatusType.LOW}
								lastUpdated={`Last updated ${prunedData?.Volume?.timestamp ? new Date(prunedData.Volume.timestamp).toLocaleTimeString() : "N/A"}`}
								redirectLink={`/${SENSOR_ROUTE[SensorType.VOLUME]}/${hiveNumber}`}
							/>
						</div>

						<div style={dataPanelContainerStyle}>
							<DataPanel
								title="Hive Weight"
								dataSnapshot={prunedData?.Weight?.value}
								unit={SENSOR_SYMBOL[SensorType.WEIGHT]}
								status={StatusType.NORMAL}
								lastUpdated={`Last updated ${prunedData?.Weight?.timestamp ? new Date(prunedData.Weight.timestamp).toLocaleTimeString() : "N/A"}`}
								redirectLink={`/${SENSOR_ROUTE[SensorType.WEIGHT]}/${hiveNumber}`}
							/>
						</div>
					</div>

					<div style={transitioning ? logContainerStyleStart : logContainerStyle}>
						<div style={logPanelContainerStyle}>
							<DashboardLogCard
								title="Last Observation"
								headline={latestObservation ? latestObservation.headline : "No observations"}
								body={latestObservation ? latestObservation.body : "No observations have been recorded for this hive yet."}
								date={latestObservation ? latestObservation.date : ""}
								logType={LogType.OBSERVATION}
								onAdd={() => setAddObservationOpen(true)}
								onOpen={() => navigate(`/observations/${hiveNumber}`)}
							/>
						</div>

						<div style={logPanelContainerStyle}>
							<DashboardLogCard
								title="Last Inspection"
								headline={latestInspection ? latestInspection.headline : "No inspections"}
								body={latestInspection ? latestInspection.body : "No inspections have been recorded for this hive yet."}
								date={latestInspection ? latestInspection.date : ""}
								logType={LogType.INSPECTION}
								onAdd={() => setAddInspectionOpen(true)}
								onOpen={() => navigate(`/inspections/${hiveNumber}`)}
							/>
						</div>
					</div>
				</div>
			) : (
				<div style={transitioning ? graphPageContainerStyleStart : graphPageContainerStyleEnd}>
					<GraphPage />
				</div>
			)}

			{error && (
				<MessagePopup
					type={MessageType.ERROR}
					message={error}
					onClose={() => setError("")}
				/>
			)}

			<ObservationDialog
				open={addObservationOpen}
				hiveId={hiveNumber}
				onCancel={() => setAddObservationOpen(false)}
				onSubmit={handleSubmitObservation}
			/>

			<ObservationAddedDialog
				open={observationConfirmOpen}
				dateText={lastAddedObservation?.date}
				onClose={() => setObservationConfirmOpen(false)}
				onViewAll={() => {
					setObservationConfirmOpen(false);
					navigate(`/observations/${hiveNumber}`);
				}}
			/>

			<InspectionDialog
				open={addInspectionOpen}
				hiveId={hiveNumber}
				onCancel={() => setAddInspectionOpen(false)}
				onSubmit={(draft) => {
					void handleSubmitInspection(draft);
				}}
			/>

			<InspectionAddedDialog
				open={inspectionConfirmOpen}
				dateText={lastAddedInspection?.date}
				conditionText={lastAddedInspection ? `${lastAddedInspection.condition} Condition` : undefined}
				onClose={() => setInspectionConfirmOpen(false)}
				onViewAll={() => {
					setInspectionConfirmOpen(false);
					navigate(`/inspections/${hiveNumber}`);
				}}
			/>

			<DashboardGraphToggle
				dashboardView={isDashboardView}
				message={isDashboardView ? "View Graph Page" : "View Dashboard"}
				onToggle={toggleDashboardView}
			/>
		</div>
	);
};

export { DashboardPage };