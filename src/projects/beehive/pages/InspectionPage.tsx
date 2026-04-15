import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Inspection, InspectionDraft, HiveCondition } from "../types/InspectionTypes";
import { InspectionDialog } from "../components/InspectionDialog";
import { InspectionAddedDialog } from "../components/InspectionAddedDialog";
import { fetchJson, ApiError } from "../utils/FetchUtil";
import { useAuthStore } from "../utils/AuthStore";
import BackArrow from "../assets/BackArrow.svg";
import DropdownIcon from "../assets/dropdown.svg";
import CalendarIcon from "../assets/calendar.svg";
import EditIcon from "../assets/edit.svg";
import DeleteIcon from "../assets/delete.svg";
import Plus from "../assets/Plus.svg";

const INSPECTIONS_ENDPOINT = "/Inspections";

const COLORS = {
	closeRed: "#E13C00",
	black: "#181818",
	border: "rgba(0,0,0,0.10)",
	shadow: "0 4px 16px rgba(0,0,0,0.10)",
	bg: "#F3F3F3",
	cardBg: "#FFFFFF",
	text: "rgb(0,0,0)",
	modalBorder: "#D9D9D9",
	modalBg: "#F7F7F7",
	inputBg: "#EFEFEF",
};

const conditionBadge = (condition: HiveCondition): React.CSSProperties => {
	const base: React.CSSProperties = {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		width: 140,
		height: 33,
		borderRadius: 6,
		paddingTop: 8,
		paddingRight: 20,
		paddingBottom: 8,
		paddingLeft: 20,
		gap: 8,
		opacity: 1,
		boxSizing: "border-box",
		whiteSpace: "nowrap",
		fontSize: "0.55rem",
		fontWeight: 800,
		border: "none",
		marginBottom: "10px",
	};

	if (condition === "Excellent") return { ...base, backgroundColor: "#BFF1BA" };
	if (condition === "Good") return { ...base, backgroundColor: "#BFF1BA" };
	if (condition === "Fair") return { ...base, backgroundColor: "#F6E39A" };
	return { ...base, backgroundColor: "#E76B6B" };
};

type TimeFilter = "All Time" | "30 Days" | "7 Days";
type ConditionFilter = "All" | HiveCondition;

type ApiInspectionTag = {
	Tag_ID?: number | string;
	Tag?: string;
	tag?: string;
};

type ApiInspection = {
	Inspection_ID?: number | string;
	inspection_id?: number | string;
	TimeStamp?: string;
	Timestamp?: string;
	timestamp?: string;
	Description?: string;
	description?: string;
	Tags?: ApiInspectionTag[] | ApiInspectionTag | string;
	tags?: ApiInspectionTag[] | ApiInspectionTag | string;
};

type ViewInspectionsResponse = {
	Hive_ID?: number | string;
	hive_id?: number | string;
	Inspections?: ApiInspection[];
	Inspection?: ApiInspection[];
	inspections?: ApiInspection[];
	data?: ApiInspection[] | { Inspections?: ApiInspection[]; inspections?: ApiInspection[] };
	result?: ApiInspection[] | { Inspections?: ApiInspection[]; inspections?: ApiInspection[] };
};

type ApiResultResponse = {
	Result?: string;
	Error?: string;
};

const CONDITION_VALUES: HiveCondition[] = ["Poor", "Fair", "Good", "Excellent"];

const normalizeDate = (timestamp: string): string => {
	if (!timestamp) return "";

	const trimmed = timestamp.trim();

	if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
		return trimmed;
	}

	if (/^\d{4}-\d{2}-\d{2}[ T]/.test(trimmed)) {
		return trimmed.slice(0, 10);
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
			return `20${year}-${month}-${day}`;
		}
	}

	const cleaned = trimmed.replace(/^DATE/, "").trim();
	const parsed = new Date(cleaned);

	if (Number.isNaN(parsed.getTime())) return "";

	return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
};

const formatDisplayDate = (dateString: string): string => {
	if (!dateString) return "";

	const [year, month, day] = dateString.split("-").map(Number);

	if (!year || !month || !day) return "Invalid Date";

	const date = new Date(year, month - 1, day);

	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

const extractConditionFromTags = (
	tags?: ApiInspectionTag[] | ApiInspectionTag | string
): HiveCondition => {
	console.log("RAW CONDITION TAGS", tags);

	if (!tags) return "Fair";

	const tagArray = Array.isArray(tags) ? tags : [tags];

	for (const tag of tagArray) {
		console.log("RAW SINGLE TAG", tag);
		console.log("RAW SINGLE TAG KEYS", typeof tag === "object" && tag ? Object.keys(tag) : "not-object");

		const rawValue =
			typeof tag === "string"
				? tag
				: (tag.Tag ?? tag.tag ?? "");

		const value = rawValue.trim().toLowerCase();

		console.log("PARSED CONDITION TAG", rawValue, value);

		if (value === "poor") return "Poor";
		if (value === "fair") return "Fair";
		if (value === "good") return "Good";
		if (value === "excellent") return "Excellent";
	}

	return "Fair";
};

const inspectionFromApi = (item: ApiInspection, hiveId: number): Inspection => {
	const rawTimestamp = String(item.TimeStamp ?? item.Timestamp ?? item.timestamp ?? "");
	const rawTags = item.Tags ?? item.tags;
	const normalizedDate = normalizeDate(rawTimestamp);
	const condition = extractConditionFromTags(rawTags);

	console.log("INSPECTION MAP", {
		rawItem: item,
		rawTimestamp,
		rawTags,
		normalizedDate,
		condition,
	});

	return {
		id: String(item.Inspection_ID ?? item.inspection_id ?? `unknown-${Date.now()}`),
		hiveId,
		date: normalizedDate,
		condition,
		notes: String(item.Description ?? item.description ?? ""),
	};
};

const extractInspectionArray = (res: unknown): ApiInspection[] => {
	if (Array.isArray(res)) return res as ApiInspection[];

	if (!res || typeof res !== "object") return [];

	const obj = res as ViewInspectionsResponse;

	if (Array.isArray(obj.Inspections)) return obj.Inspections;
	if (Array.isArray(obj.Inspection)) return obj.Inspection;
	if (Array.isArray(obj.inspections)) return obj.inspections;

	if (Array.isArray(obj.data)) return obj.data as ApiInspection[];
	if (Array.isArray(obj.result)) return obj.result as ApiInspection[];

	if (obj.data && typeof obj.data === "object") {
		if (Array.isArray(obj.data.Inspections)) return obj.data.Inspections;
		if (Array.isArray(obj.data.inspections)) return obj.data.inspections;
	}

	if (obj.result && typeof obj.result === "object") {
		if (Array.isArray(obj.result.Inspections)) return obj.result.Inspections;
		if (Array.isArray(obj.result.inspections)) return obj.result.inspections;
	}

	return [];
};

const buildUserPayload = (user: { userID?: string | number; organizationID?: string | number } | null) => ({
	User_ID: Number(user?.userID ?? 0),
	Organization_ID: Number(user?.organizationID ?? 0),
});

const buildCreatePayload = (
	hiveId: number,
	user: { userID?: string | number; organizationID?: string | number } | null,
	draft: InspectionDraft
) => ({
	Hive_ID: hiveId,
	User: buildUserPayload(user),
	Inspection: {
		TimeStamp: `${draft.date} 00:00:00`,
		Description: draft.notes,
		Tags: [{ Tag: draft.condition }],
	},
});

const buildDeletePayload = (
	hiveId: number,
	user: { userID?: string | number; organizationID?: string | number } | null,
	inspectionId: string
) => ({
	Hive_ID: hiveId,
	User: buildUserPayload(user),
	Inspections: {
		Inspection_ID: Number(inspectionId),
	},
});

const toErrorMessage = (error: unknown): string => {
	if (error instanceof ApiError) {
		if (error.status === 401 || error.status === 403) return "You do not have permission to perform this action.";
		if (error.status === 404) return "The requested inspection data could not be found.";
		if (error.status >= 500) return "Something went wrong on the server. Please try again.";
		return error.message || "Something went wrong.";
	}

	if (error instanceof Error) return error.message;
	return "Something went wrong.";
};

type EditUnavailableModalProps = {
	open: boolean;
	onClose: () => void;
};

const EditUnavailableModal = ({ open, onClose }: EditUnavailableModalProps) => {
	useEffect(() => {
		if (!open) return;

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, [open, onClose]);

	if (!open) return null;

	const overlayStyle: React.CSSProperties = {
		position: "fixed",
		inset: 0,
		backgroundColor: "rgba(0,0,0,0.25)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
		zIndex: 1000,
	};

	const modalStyle: React.CSSProperties = {
		width: "100%",
		maxWidth: 420,
		backgroundColor: COLORS.modalBg,
		borderRadius: 12,
		border: `1px solid ${COLORS.modalBorder}`,
		boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
		padding: "24px 20px 20px",
		boxSizing: "border-box",
		textAlign: "center",
	};

	const titleStyle: React.CSSProperties = {
		margin: 0,
		fontSize: "1.2rem",
		fontWeight: 900,
		color: COLORS.black,
	};

	const messageStyle: React.CSSProperties = {
		marginTop: 12,
		marginBottom: 20,
		fontSize: "1rem",
		lineHeight: 1.4,
		color: "rgba(0,0,0,0.8)",
	};

	const buttonStyle: React.CSSProperties = {
		height: 46,
		minWidth: 110,
		padding: "0 24px",
		borderRadius: 6,
		border: "none",
		backgroundColor: COLORS.black,
		color: "#FFFFFF",
		fontWeight: 800,
		fontSize: "1rem",
		cursor: "pointer",
	};

	return (
		<div
			style={overlayStyle}
			onClick={onClose}
		>
			<div
				style={modalStyle}
				onClick={(e) => e.stopPropagation()}
			>
				<h2 style={titleStyle}>Edit not available</h2>
				<div style={messageStyle}>
					Editing inspections is not available right now.
				</div>

				<button
					type="button"
					style={buttonStyle}
					onClick={onClose}
				>
					OK
				</button>
			</div>
		</div>
	);
};

const InspectionPage = () => {
	const navigate = useNavigate();
	const params = useParams();
	const { user } = useAuthStore();

	const hiveId = Number(params.id ?? "1");

	const [inspections, setInspections] = useState<Inspection[]>([]);
	const [addOpen, setAddOpen] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [lastAdded, setLastAdded] = useState<Inspection | null>(null);
	const [conditionFilter, setConditionFilter] = useState<ConditionFilter>("All");
	const [timeFilter, setTimeFilter] = useState<TimeFilter>("All Time");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [editUnavailableOpen, setEditUnavailableOpen] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const loadInspections = async () => {
		if (!user?.userID || !user?.organizationID) {
			setInspections([]);
			setLoading(false);
			setError("Missing user session.");
			return;
		}

		if (!Number.isFinite(hiveId)) {
			setInspections([]);
			setLoading(false);
			setError("Invalid hive.");
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const response = await fetchJson<ViewInspectionsResponse>(INSPECTIONS_ENDPOINT, {
				method: "POST",
				body: {
					Hive_ID: hiveId,
					User: buildUserPayload(user),
				},
			});
			console.log("INSPECTIONS RAW RESPONSE", response);

			const apiInspections = extractInspectionArray(response);
			console.log("INSPECTIONS ARRAY", apiInspections);
			setInspections(apiInspections.map((item) => inspectionFromApi(item, hiveId)));
		} catch (err) {
			if (err instanceof ApiError && err.status === 400) {
				setInspections([]);
				setLoading(false);
				return;
			}
			setError(toErrorMessage(err));
			setInspections([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void loadInspections();
	}, [hiveId, user?.userID, user?.organizationID]);

	const pageWrap: React.CSSProperties = {
		minHeight: "100vh",
		backgroundColor: COLORS.bg,
	};

	const innerWrap: React.CSSProperties = {
		maxWidth: '100%',
		margin: "1.5em 8em",
		padding: "26px 18px 40px",
	};

	const backRow: React.CSSProperties = {
		display: "inline-flex",
		alignItems: "center",
		gap: "0.5rem",
		cursor: "pointer",
		fontWeight: 700,
		color: "rgba(0,0,0,0.75)",
	};

	const headerRow: React.CSSProperties = {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 10,
		flexWrap: "nowrap",
		gap: 16,
	};

	const titleStyle: React.CSSProperties = {
		fontSize: "2.1rem",
		fontWeight: 600,
		margin: 0,
		paddingRight: 10,
		whiteSpace: "nowrap",
		flex: "0 0 auto",
	};

	const toolbarStyle: React.CSSProperties = {
		display: "flex",
		alignItems: "center",
		gap: 16,
		flex: 1,
		justifyContent: "flex-end",
		minWidth: 0,
	};

	const selectStyle: React.CSSProperties = {
		width: "100%",
		display: "block",
		height: 60,
		borderRadius: 8,
		backgroundColor: "#FFFFFF",
		border: `1px solid ${COLORS.border}`,
		padding: "0 16px",
		fontFamily: "Instrument Sans, sans-serif",
		fontWeight: 400,
		fontSize: "1rem",
		color: COLORS.text,
		boxSizing: "border-box",
		appearance: "none",
	};

	const plusButtonStyle: React.CSSProperties = {
		width: 60,
		height: 60,
		borderRadius: 8,
		border: "none",
		backgroundColor: COLORS.black,
		cursor: submitting ? "not-allowed" : "pointer",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
		padding: 0,
		opacity: submitting ? 0.7 : 1,
	};

	const listWrap: React.CSSProperties = {
		display: "flex",
		flexDirection: "column",
		gap: '1em',
		marginTop: 14,
	};

	const cardStyle: React.CSSProperties = {
		backgroundColor: COLORS.cardBg,
		borderRadius: 12,
		boxShadow: COLORS.shadow,
		border: `1px solid ${COLORS.border}`,
		display: "flex",
		overflow: "hidden",
		minHeight: '8em'
	};

	const leftCol: React.CSSProperties = {
		width: 245,
		padding: "12px 12px 10px",
		display: "flex",
		flexDirection: "column",
	};

	const rightCol: React.CSSProperties = {
		flex: 1,
		padding: "12px 14px",
		minWidth: 0,
	};

	const dateStyle: React.CSSProperties = {
		fontWeight: 600,
		fontSize: "0.98rem",
		marginBottom: 8,
	};

	const actionsRow: React.CSSProperties = {
		display: "flex",
		alignItems: "center",
		gap: 10,
		fontWeight: 800,
		fontSize: "0.85rem",
		marginTop: "auto",
	};

	const actionLink: React.CSSProperties = {
		display: "inline-flex",
		alignItems: "center",
		gap: 6,
		cursor: submitting ? "not-allowed" : "pointer",
		color: "rgba(0,0,0,0.70)",
		opacity: submitting ? 0.65 : 1,
	};

	const deleteLink: React.CSSProperties = {
		...actionLink,
		color: COLORS.closeRed,
	};

	const notesStyle: React.CSSProperties = {
		color: COLORS.text,
		lineHeight: 1.35,
		fontSize: "0.92rem",
		whiteSpace: "pre-wrap",
		wordBreak: "break-word",
	};

	const messageStyle: React.CSSProperties = {
		marginTop: 14,
		padding: "14px 16px",
		borderRadius: 10,
		backgroundColor: "#FFFFFF",
		border: `1px solid ${COLORS.border}`,
		boxShadow: COLORS.shadow,
		fontWeight: 700,
		color: error ? COLORS.closeRed : "rgba(0,0,0,0.7)",
	};

	const filteredList = useMemo(() => {
		const now = new Date();
		const cutoff =
			timeFilter === "7 Days"
				? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
				: timeFilter === "30 Days"
					? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
					: null;

		return [...inspections]
			.filter((insp) => (conditionFilter === "All" ? true : insp.condition === conditionFilter))
			.filter((insp) => {
				if (!cutoff) return true;
				const d = new Date(`${insp.date}T00:00:00`);
				return !Number.isNaN(d.getTime()) && d >= cutoff;
			})
			.sort((a, b) =>
				new Date(b.date).getTime() - new Date(a.date).getTime()
			);
	}, [inspections, conditionFilter, timeFilter]);

	const handleSubmitAdd = async (draft: InspectionDraft) => {
		if (!user?.userID || !user?.organizationID) {
			setError("Missing user session.");
			return;
		}

		try {
			setSubmitting(true);
			setError(null);

			await fetchJson<ApiResultResponse>(INSPECTIONS_ENDPOINT, {
				method: "PUT",
				body: buildCreatePayload(hiveId, user, draft),
			});

			const created: Inspection = {
				id: `temp-${Date.now()}`,
				hiveId,
				date: draft.date,
				condition: draft.condition,
				notes: draft.notes,
			};

			setLastAdded(created);
			setAddOpen(false);
			setConfirmOpen(true);
			await loadInspections();
		} catch (err) {
			setError(toErrorMessage(err));
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (inspectionId: string) => {
		if (!user?.userID || !user?.organizationID) {
			setError("Missing user session.");
			return;
		}

		try {
			setSubmitting(true);
			setError(null);

			await fetchJson<ApiResultResponse>(INSPECTIONS_ENDPOINT, {
				method: "DELETE",
				body: buildDeletePayload(hiveId, user, inspectionId),
			});

			setInspections((prev) => prev.filter((x) => x.id !== inspectionId));
		} catch (err) {
			setError(toErrorMessage(err));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div style={pageWrap}>
			<div style={innerWrap}>
				<div style={backRow} onClick={() => navigate("/dashboard")}>
					<img src={BackArrow} alt="Back to Dashboard" />
					<span>Back to Dashboard</span>
				</div>

				<div style={headerRow}>
					<h1 style={titleStyle}>Inspections</h1>

					<div style={toolbarStyle}>
						<div style={{ position: "relative", flex: 1, minWidth: 0 }}>
							<select
								style={{ ...selectStyle, paddingRight: 48 }}
								value={conditionFilter}
								onChange={(e) => setConditionFilter(e.target.value as ConditionFilter)}
							>
								<option value="All">Filter</option>
								<option value="Poor">Poor</option>
								<option value="Fair">Fair</option>
								<option value="Good">Good</option>
								<option value="Excellent">Excellent</option>
							</select>

							<img
								src={DropdownIcon}
								alt=""
								style={{
									position: "absolute",
									right: 16,
									top: "50%",
									transform: "translateY(-50%)",
									width: 16,
									height: 16,
									pointerEvents: "none",
									opacity: 0.6,
								}}
							/>
						</div>

						<div style={{ position: "relative", flex: 1, minWidth: 0 }}>
							<select
								style={{ ...selectStyle, paddingRight: 48 }}
								value={timeFilter}
								onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
							>
								<option value="All Time">All Time</option>
								<option value="30 Days">Last 30 Days</option>
								<option value="7 Days">Last 7 Days</option>
							</select>

							<img
								src={CalendarIcon}
								alt=""
								style={{
									position: "absolute",
									right: 16,
									top: "50%",
									transform: "translateY(-50%)",
									width: 18,
									height: 18,
									pointerEvents: "none",
									opacity: 0.6,
								}}
							/>
						</div>

						<button
							style={plusButtonStyle}
							onClick={() => setAddOpen(true)}
							aria-label="Add Inspection"
							disabled={submitting}
						>
							<img src={Plus} alt="" style={{ width: 18, height: 18 }} />
						</button>
					</div>
				</div>

				{error && <div style={messageStyle}>{error}</div>}

				{loading ? (
					<div style={messageStyle}>Loading inspections...</div>
				) : filteredList.length === 0 ? (
					<div style={messageStyle}>No inspections found.</div>
				) : (
					<div style={listWrap}>
						{filteredList.map((insp) => (
							<div key={insp.id} style={cardStyle}>
								<div style={leftCol}>
									<div style={dateStyle}>
										{formatDisplayDate(insp.date) || "Unknown date"}
									</div>

									<div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
										<span style={conditionBadge(insp.condition)}>{insp.condition} Condition</span>
									</div>

									<div style={actionsRow}>
										{/*<span
											style={actionLink}
											onClick={() => {
												if (!submitting) {
													setEditUnavailableOpen(true);
												}
											}}
										>
											<img src={EditIcon} alt="" style={{ width: 16, height: 16 }} />
											Edit
										</span>*/}

										<span
											style={deleteLink}
											onClick={() => {
												if (!submitting) {
													void handleDelete(insp.id);
												}
											}}
										>
											<img src={DeleteIcon} alt="" style={{ width: 16, height: 16 }} />
											Delete
										</span>
									</div>
								</div>

								<div style={rightCol}>
									<div style={notesStyle}>{insp.notes}</div>
								</div>
							</div>
						))}
					</div>
				)}

				<InspectionDialog
					open={addOpen}
					hiveId={hiveId}
					onCancel={() => setAddOpen(false)}
					onSubmit={(draft) => {
						void handleSubmitAdd(draft);
					}}
				/>

				<InspectionAddedDialog
					open={confirmOpen}
					dateText={lastAdded?.date}
					conditionText={lastAdded ? `${lastAdded.condition} Condition` : undefined}
					onClose={() => setConfirmOpen(false)}
					onViewAll={() => setConfirmOpen(false)}
				/>

				<EditUnavailableModal
					open={editUnavailableOpen}
					onClose={() => setEditUnavailableOpen(false)}
				/>
			</div>
		</div>
	);
};

export { InspectionPage };