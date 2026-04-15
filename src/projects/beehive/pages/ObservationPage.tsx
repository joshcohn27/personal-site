import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackArrow from "../assets/BackArrow.svg";
import { Observation, ObservationDraft, ObservationTag } from "../types/ObservationTypes";
import { ObservationDialog } from "../components/ObservationDialog";
import { ObservationAddedDialog } from "../components/ObservationAddedDialog";
import DropdownIcon from "../assets/dropdown.svg";
import CalendarIcon from "../assets/calendar.svg";
import EditIcon from "../assets/edit.svg";
import DeleteIcon from "../assets/delete.svg";
import Plus from "../assets/Plus.svg";
import { fetchJson, ApiError } from "../utils/FetchUtil";
import { useAuthStore } from "../utils/AuthStore";

const COLORS = {
    closeRed: "#E13C00",
    black: "#181818",
    border: "rgba(0,0,0,0.10)",
    shadow: "0 4px 16px rgba(0,0,0,0.10)",
    bg: "#F3F3F3",
    cardBg: "#FFFFFF",
    text: "rgba(0,0,0,0.72)",
    modalBorder: "#D9D9D9",
    modalBg: "#F7F7F7",
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

const tagPillStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 82,
    height: 33,
    borderRadius: 6,
    paddingTop: 8,
    paddingRight: 20,
    paddingBottom: 8,
    paddingLeft: 20,
    gap: 8,
    opacity: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    border: `1px solid rgba(0,0,0,0.10)`,
    fontSize: "0.5rem",
    fontWeight: 800,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
};

type TimeFilter = "All Time" | "30 Days" | "7 Days";
type TagFilter = "All" | ObservationTag;

type ApiTag = {
    Tag_ID?: string | number;
    Tag?: string;
    tag?: string;
};

type ApiObservation = {
    Observation_ID?: string | number;
    observation_id?: string | number;
    TimeStamp?: string;
    Timestamp?: string;
    timestamp?: string;
    Description?: string;
    description?: string;
    Tags?: ApiTag[];
    tags?: ApiTag[] | string[];
};

type ViewObservationsResponse = {
    Hive_ID?: string | number;
    hive_id?: string | number;
    Observations?: ApiObservation[];
    Observation?: ApiObservation[];
    Obeservations?: ApiObservation[];
    observations?: ApiObservation[];
    data?: ApiObservation[] | { Observations?: ApiObservation[]; Obeservations?: ApiObservation[]; observations?: ApiObservation[] };
    result?: ApiObservation[] | { Observations?: ApiObservation[]; Obeservations?: ApiObservation[]; observations?: ApiObservation[] };
};

const OBSERVATIONS_ENDPOINT = "/Observations";

// --- Date helpers (matching InspectionPage) ---

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

// --- Edit unavailable modal (matching InspectionPage) ---

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
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <h2 style={titleStyle}>Edit not available</h2>
                <div style={messageStyle}>
                    Editing observations is not available right now.
                </div>
                <button type="button" style={buttonStyle} onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
};

// --- Main page ---

const ObservationPage = () => {
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const hiveId = Number(params.id ?? "1");

    const authState = useAuthStore() as any;
    const user = authState?.user;

    const userId = user?.userID ?? user?.User_ID ?? null;
    const orgId = user?.organizationID ?? user?.Organization_ID ?? null;

    const [observations, setObservations] = useState<Observation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [addOpen, setAddOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [editUnavailableOpen, setEditUnavailableOpen] = useState(false);
    const [lastAdded, setLastAdded] = useState<Observation | null>(null);

    const [tagFilter, setTagFilter] = useState<TagFilter>("All");
    const [timeFilter, setTimeFilter] = useState<TimeFilter>("All Time");

    const uiDateToApiTimestamp = (date: string): string => {
        if (!date) return "";
        if (date.length >= 19) return date;
        return `${date} 00:00:00`;
    };

    const normalizeTags = (rawTags: ApiObservation["Tags"] | ApiObservation["tags"]): ObservationTag[] => {
        if (!Array.isArray(rawTags)) return [];

        return rawTags
            .map((t) => {
                if (typeof t === "string") return t;
                if (t && typeof t === "object") return (t as ApiTag).Tag ?? (t as ApiTag).tag ?? "";
                return "";
            })
            .filter((t): t is string => typeof t === "string" && t.length > 0)
            .filter((t) => (TAG_OPTIONS as string[]).includes(t)) as ObservationTag[];
    };

    const mapApiObservationToUi = (hId: number, o: ApiObservation, index: number): Observation => {
        const rawId = o.Observation_ID ?? o.observation_id ?? `unknown-${index}`;
        const rawTimestamp = o.TimeStamp ?? o.Timestamp ?? o.timestamp ?? "";
        const rawDescription = o.Description ?? o.description ?? "";
        const rawTags = o.Tags ?? o.tags ?? [];

        return {
            id: String(rawId),
            hiveId: hId,
            date: normalizeDate(String(rawTimestamp)),
            tags: normalizeTags(rawTags),
            notes: String(rawDescription ?? ""),
        };
    };

    const extractObservationArray = (res: unknown): ApiObservation[] => {
        if (Array.isArray(res)) {
            return res as ApiObservation[];
        }

        if (!res || typeof res !== "object") {
            return [];
        }

        const obj = res as ViewObservationsResponse;

        if (Array.isArray(obj.Observations)) return obj.Observations;
        if (Array.isArray(obj.Observation)) return obj.Observation;
        if (Array.isArray(obj.Obeservations)) return obj.Obeservations;
        if (Array.isArray(obj.observations)) return obj.observations;

        if (Array.isArray(obj.data)) return obj.data as ApiObservation[];
        if (Array.isArray(obj.result)) return obj.result as ApiObservation[];

        if (obj.data && typeof obj.data === "object") {
            if (Array.isArray(obj.data.Observations)) return obj.data.Observations;
            if (Array.isArray(obj.data.Obeservations)) return obj.data.Obeservations;
            if (Array.isArray(obj.data.observations)) return obj.data.observations;
        }

        if (obj.result && typeof obj.result === "object") {
            if (Array.isArray(obj.result.Observations)) return obj.result.Observations;
            if (Array.isArray(obj.result.Obeservations)) return obj.result.Obeservations;
            if (Array.isArray(obj.result.observations)) return obj.result.observations;
        }

        return [];
    };

    const getFriendlyErrorMessage = (e: unknown, fallback: string) => {
        if (e instanceof ApiError) {
            if (e.status === 401 || e.status === 403) return "You do not have permission to perform this action.";
            if (e.status === 404) return "The requested observation data could not be found.";
            if (e.status >= 500) return "Something went wrong on the server. Please try again.";
            return e.message || fallback;
        }
        return fallback;
    };

    const fetchObservations = async () => {
        if (!userId || !orgId) {
            setObservations([]);
            setError("We couldn't verify your account information. Please log in again.");
            return;
        }

        if (!Number.isFinite(hiveId)) {
            setObservations([]);
            setError("We couldn't load this hive.");
            return;
        }

        const payload = {
            Hive_ID: Number(hiveId),
            User: {
                User_ID: Number(userId),
                Organization_ID: Number(orgId),
            },
        };

        setLoading(true);
        setError(null);

        try {
            const res = await fetchJson<ViewObservationsResponse>(OBSERVATIONS_ENDPOINT, {
                method: "POST",
                body: payload,
            });

            const rawList = extractObservationArray(res);
            const mappedList = rawList.map((o, index) => mapApiObservationToUi(hiveId, o, index));

            setObservations(mappedList);
        } catch (e) {
            if (e instanceof ApiError && e.status === 400) {
                return
            }
            setError(getFriendlyErrorMessage(e, "We couldn't load observations right now."));
            setObservations([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchObservations();
    }, [hiveId, userId, orgId]);

    const filteredList = useMemo(() => {
        const now = new Date();
        const cutoff =
            timeFilter === "7 Days"
                ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                : timeFilter === "30 Days"
                    ? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                    : null;

        return [...observations]
            .filter((obs) => (tagFilter === "All" ? true : obs.tags.includes(tagFilter)))
            .filter((obs) => {
                if (!cutoff) return true;
                const d = new Date(`${obs.date}T00:00:00`);
                return !Number.isNaN(d.getTime()) && d >= cutoff;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [observations, tagFilter, timeFilter]);

    const handleSubmitAdd = async (draft: ObservationDraft) => {
        if (!userId || !orgId) {
            setError("We couldn't verify your account information. Please log in again.");
            return;
        }

        if (!Number.isFinite(hiveId)) {
            setError("We couldn't save this observation because the hive is invalid.");
            return;
        }

        const addPayload = {
            Hive_ID: Number(hiveId),
            User: {
                User_ID: Number(userId),
                Organization_ID: Number(orgId),
            },
            Observation: {
                Timestamp: uiDateToApiTimestamp(draft.date),
                Description: draft.notes,
                Tags: (draft.tags ?? []).map((t) => ({ Tag: t })),
            },
        };

        setSubmitting(true);
        setError(null);

        try {
            await fetchJson<{ Result?: string }>(OBSERVATIONS_ENDPOINT, {
                method: "PUT",
                body: addPayload,
            });

            setLastAdded({ id: `pending-${Date.now()}`, ...draft });
            setAddOpen(false);
            setConfirmOpen(true);
            await fetchObservations();
        } catch (e) {
            setError(getFriendlyErrorMessage(e, "We couldn't save the observation."));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!userId || !orgId) {
            setError("We couldn't verify your account information. Please log in again.");
            return;
        }

        if (!Number.isFinite(hiveId)) {
            setError("We couldn't delete this observation because the hive is invalid.");
            return;
        }

        const deletePayload = {
            Hive_ID: Number(hiveId),
            User: {
                User_ID: Number(userId),
                Organization_ID: Number(orgId),
            },
            Observations: {
                Observation_ID: Number(id),
            },
        };

        setSubmitting(true);
        setError(null);

        try {
            await fetchJson<{ Result?: string }>(OBSERVATIONS_ENDPOINT, {
                method: "DELETE",
                body: deletePayload,
            });

            setObservations((prev) => prev.filter((x) => x.id !== id));
        } catch (e) {
            setError(getFriendlyErrorMessage(e, "We couldn't delete the observation."));
        } finally {
            setSubmitting(false);
        }
    };

    const hasRequiredIds = Boolean(userId && orgId);

    const pageWrap: React.CSSProperties = { minHeight: "100vh", backgroundColor: COLORS.bg };
    const innerWrap: React.CSSProperties = { maxWidth: 980, margin: "0 auto", padding: "26px 18px 40px" };
    const backRow: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontWeight: 700, color: "rgba(0,0,0,0.75)" };
    const headerRow: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, flexWrap: "nowrap", gap: 16 };
    const titleStyle: React.CSSProperties = { fontSize: "2.1rem", fontWeight: 600, margin: 0, paddingRight: 10, whiteSpace: "nowrap", flex: "0 0 auto" };
    const toolbarStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 16, flex: 1, justifyContent: "flex-end", minWidth: 0 };
    const selectStyle: React.CSSProperties = { width: "100%", display: "block", height: 60, borderRadius: 8, backgroundColor: "#FFFFFF", border: `1px solid ${COLORS.border}`, padding: "0 16px", fontFamily: "Instrument Sans, sans-serif", fontWeight: 400, fontSize: "1rem", color: COLORS.text, boxSizing: "border-box", appearance: "none" };
    const plusButtonStyle: React.CSSProperties = { width: 60, height: 60, borderRadius: 8, border: "none", backgroundColor: COLORS.black, cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 0, opacity: submitting ? 0.7 : 1 };
    const listWrap: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 12, marginTop: 14 };
    const cardStyle: React.CSSProperties = { backgroundColor: COLORS.cardBg, borderRadius: 12, boxShadow: COLORS.shadow, border: `1px solid ${COLORS.border}`, display: "flex", overflow: "hidden" };
    const leftCol: React.CSSProperties = { width: 245, padding: "12px 12px 10px", borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column" };
    const rightCol: React.CSSProperties = { flex: 1, padding: "12px 14px", minWidth: 0 };
    const dateStyle: React.CSSProperties = { fontWeight: 600, fontSize: "0.98rem", marginBottom: 8 };
    const pillsRow: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 };
    const actionsRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: "0.85rem", marginTop: "auto" };
    const actionLink: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 6, cursor: submitting ? "not-allowed" : "pointer", color: "rgba(0,0,0,0.70)", opacity: submitting ? 0.65 : 1 };
    const deleteLink: React.CSSProperties = { ...actionLink, color: COLORS.closeRed };
    const notesStyle: React.CSSProperties = { color: COLORS.text, lineHeight: 1.35, fontSize: "0.92rem", whiteSpace: "pre-wrap", wordBreak: "break-word" };
    const messageStyle: React.CSSProperties = { marginTop: 14, padding: "14px 16px", borderRadius: 10, backgroundColor: "#FFFFFF", border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, fontWeight: 700, color: error ? COLORS.closeRed : "rgba(0,0,0,0.7)" };

    return (
        <div style={pageWrap}>
            <div style={innerWrap}>
                <div style={backRow} onClick={() => navigate("/dashboard")}>
                    <img src={BackArrow} alt="Back to Dashboard" />
                    <span>Back to Dashboard</span>
                </div>

                <div style={headerRow}>
                    <h1 style={titleStyle}>Observations</h1>
                    <div style={toolbarStyle}>
                        <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
                            <select
                                style={{ ...selectStyle, paddingRight: 48 }}
                                value={tagFilter}
                                onChange={(e) => setTagFilter(e.target.value as TagFilter)}
                            >
                                <option value="All">Filter</option>
                                {TAG_OPTIONS.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                            <img
                                src={DropdownIcon}
                                alt=""
                                style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, pointerEvents: "none", opacity: 0.6 }}
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
                                style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, pointerEvents: "none", opacity: 0.6 }}
                            />
                        </div>

                        <button
                            style={plusButtonStyle}
                            onClick={() => setAddOpen(true)}
                            aria-label="Add Observation"
                            disabled={submitting || !hasRequiredIds}
                        >
                            <img src={Plus} alt="" style={{ width: 18, height: 18, opacity: hasRequiredIds ? 1 : 0.5 }} />
                        </button>
                    </div>
                </div>

                {!hasRequiredIds && (
                    <div style={{ ...messageStyle, color: COLORS.closeRed }}>
                        Please log in again to view observations.
                    </div>
                )}

                {error && <div style={messageStyle}>{error}</div>}

                {loading ? (
                    <div style={messageStyle}>Loading observations...</div>
                ) : filteredList.length === 0 && !error && hasRequiredIds ? (
                    <div style={messageStyle}>No observations found for this hive.</div>
                ) : (
                    <div style={listWrap}>
                        {filteredList.map((obs) => (
                            <div key={obs.id} style={cardStyle}>
                                <div style={leftCol}>
                                    <div style={dateStyle}>
                                        {formatDisplayDate(obs.date) || "Unknown date"}
                                    </div>

                                    <div style={pillsRow}>
                                        {obs.tags.map((t) => (
                                            <span key={t} style={tagPillStyle}>{t}</span>
                                        ))}
                                    </div>

                                    <div style={actionsRow}>
                                        {/*<span
                                            style={actionLink}
                                            onClick={() => { if (!submitting) setEditUnavailableOpen(true); }}
                                        >
                                            <img src={EditIcon} alt="" style={{ width: 16, height: 16 }} />
                                            Edit
                                        </span>*/}
                                        <span
                                            style={deleteLink}
                                            onClick={() => { if (!submitting) void handleDelete(obs.id); }}
                                        >
                                            <img src={DeleteIcon} alt="" style={{ width: 16, height: 16 }} />
                                            Delete
                                        </span>
                                    </div>
                                </div>

                                <div style={rightCol}>
                                    <div style={notesStyle}>{obs.notes}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <ObservationDialog
                    open={addOpen}
                    hiveId={hiveId}
                    onCancel={() => setAddOpen(false)}
                    onSubmit={handleSubmitAdd}
                />

                <ObservationAddedDialog
                    open={confirmOpen}
                    dateText={lastAdded?.date}
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

export { ObservationPage };