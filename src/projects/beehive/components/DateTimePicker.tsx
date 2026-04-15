import React, { useEffect, useMemo, useRef, useState } from "react";
import CalendarImage from "../assets/CalendarImage.png";

type DateRange = { start: Date | null; end: Date | null };

type Props = {
  value?: Date | DateRange | null;
  onChange?: (value: Date | DateRange | null) => void;
  label?: string;
  getDateRange: (startDate: Date, endDate: Date) => void;
};

const DateTimePicker: React.FC<Props> = ({ value, onChange, label = "", getDateRange = () => {} }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Uncontrolled state fallback
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  // If controlled `value` is provided, mirror it into internal state for display.
  useEffect(() => {
    if (value === undefined) return; // truly uncontrolled
    if (value === null) {
      setSingleDate(null);
      setRange({ start: null, end: null });
      return;
    }
    if (value instanceof Date) {
      setSingleDate(value);
      setRange({ start: null, end: null });
      return;
    }
    setRange({ start: value.start ?? null, end: value.end ?? null });
    setSingleDate(null);
  }, [value]);

  const displayValue = useMemo(() => {
    // if range has both, show range; else show single if set; else show partial range if start set.
    if (range.start && range.end) return `${formatShort(range.start)} → ${formatShort(range.end)}`;
    if (singleDate) return formatShort(singleDate);
    if (range.start && !range.end) return `${formatShort(range.start)} → End`;
    return "Today";
  }, [singleDate, range.start, range.end]);

  const pillStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    boxShadow: "0 0 4px #00000033",
    gap: "1em",
    width: "fit-content",
    padding: ".6em .8em",
    borderRadius: "16px",
    justifyContent: "space-between",
    userSelect: "none",
    background: "var(--foreground-color, #ffffff)",
  };

  const textColStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: ".15em",
    minWidth: 0,
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={pillStyle}>
        <div style={textColStyle}>
          <p style={{ margin: 0, fontSize: ".85rem", opacity: 0.8 }}>{label}</p>
          <p style={{ margin: 0, fontSize: ".95rem", fontWeight: 400 }} title={displayValue}>
            {displayValue}
          </p>
        </div>

        <img
          src={CalendarImage}
          onClick={() => setIsModalOpen(true)}
          alt="Calendar Icon"
          style={{ width: "24px", height: "24px", cursor: "pointer" }}
        />
      </div>

      {isModalOpen && (
        <DateTimePickerModal
          initialSingle={singleDate}
          initialRange={range}
          onCancel={() => setIsModalOpen(false)}
          onConfirm={(next) => {
            // next can be Date (single) or {start,end} (range) or null
            if (next === null) {
              setSingleDate(null);
              setRange({ start: null, end: null });
              onChange?.(null);
              setIsModalOpen(false);
              return;
            }

            if (next instanceof Date) {
              setSingleDate(next);
              setRange({ start: null, end: null });
              onChange?.(next);
              getDateRange(next, next);
            } else {
              setRange(next);
              setSingleDate(null);
              onChange?.(next);
              if (next.start && next.end) {
                getDateRange(startOfDay(next.start), endOfDay(next.end));
              }
            }

            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

type ModalProps = {
  initialSingle: Date | null;
  initialRange: DateRange;
  onCancel: () => void;
  onConfirm: (value: Date | DateRange | null) => void;
};

const DateTimePickerModal: React.FC<ModalProps> = ({ initialSingle, initialRange, onCancel, onConfirm }) => {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-11
  const [tempRange, setTempRange] = useState<DateRange>({
    start: initialRange.start ?? null,
    end: initialRange.end ?? null,
  });
  const [tempSingle, setTempSingle] = useState<Date | null>(initialSingle);

  useEffect(() => {
    if (initialSingle) {
      setTempSingle(initialSingle);
      setTempRange({ start: initialSingle, end: null });
    }
  }, [initialSingle]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  const overlayRef = useRef<HTMLDivElement | null>(null);

  const monthLabel = useMemo(() => {
    const d = new Date(viewYear, viewMonth, 1);
    return d.toLocaleString(undefined, { month: "long", year: "numeric" });
  }, [viewYear, viewMonth]);

  const { cells, weekdayLabels } = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const firstWeekday = first.getDay(); // 0=Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const out: Array<{ date: Date | null; dayNum: number | null }> = [];
    const totalCells = 42;

    for (let i = 0; i < totalCells; i++) {
      const dayIndex = i - firstWeekday + 1;
      if (dayIndex < 1 || dayIndex > daysInMonth) out.push({ date: null, dayNum: null });
      else out.push({ date: new Date(viewYear, viewMonth, dayIndex), dayNum: dayIndex });
    }

    return { cells: out, weekdayLabels: labels };
  }, [viewYear, viewMonth]);

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.25)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  };

  const modalStyle: React.CSSProperties = {
    width: "min(520px, 95vw)",
    backgroundColor: "var(--foreground-color, #ffffff)",
    padding: "1.25em",
    boxShadow: "0 4px 16px #00000033",
    borderRadius: "18px",
  };

  const headerWrapStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "1em",
    marginBottom: ".9em",
  };

  const titleBlockStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: ".25em",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "1.15rem",
    fontWeight: 800,
    letterSpacing: "-0.01em",
  };

  const subtitleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: ".8em",
    opacity: 0.75,
    lineHeight: 1.25,
  };

  const monthBarStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: ".5em",
    border: "1px solid #0000001a",
    borderRadius: "14px",
    padding: ".35em .5em",
  };

  const navBtnStyle: React.CSSProperties = {
    borderRadius: "12px",
    border: "1px solid #00000022",
    background: "var(--foreground-color, #ffffff)",
    padding: ".35em .6em",
    cursor: "pointer",
    fontWeight: 800,
    lineHeight: 1,
  };

  const monthLabelStyle: React.CSSProperties = {
    fontWeight: 800,
    minWidth: "11.5em",
    textAlign: "center",
    fontSize: ".95rem",
  };

  const weekdayGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: ".35em",
    marginTop: ".25em",
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: ".35em",
    marginTop: ".55em",
  };

  const footerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    gap: ".5em",
    marginTop: "1em",
    alignItems: "center",
    flexWrap: "wrap",
  };

  const btnStyle: React.CSSProperties = {
    borderRadius: "12px",
    border: "1px solid #00000022",
    background: "var(--foreground-color, #ffffff)",
    padding: ".55em .8em",
    cursor: "pointer",
    fontWeight: 700,
  };

  const primaryBtnStyle: React.CSSProperties = {
    ...btnStyle,
    background: "#000000",
    color: "#ffffff",
    border: "1px solid #000000",
  };

  const selectionSummary = useMemo(() => {
    if (tempRange.start && tempRange.end) {
      const [a, b] = orderDates(tempRange.start, tempRange.end);
      if (isSameDay(a, b)) return `Single date: ${formatLong(a)}`;
      return `${formatLong(a)} → ${formatLong(b)}`;
    }
    if (tempRange.start && !tempRange.end) {
      return `${formatLong(tempRange.start)}`;
    }
    if (tempSingle) return `Single date: ${formatLong(tempSingle)}`;
    return;
  }, [tempRange.start, tempRange.end, tempSingle]);

  const onDayClick = (d: Date) => {
    // Always drive from tempRange for unified UX
    const s = tempRange.start;
    const e = tempRange.end;

    // clear explicit single once user is interacting
    setTempSingle(null);

    if (!s || (s && e)) {
      setTempRange({ start: d, end: null });
      return;
    }

    // second click sets end
    setTempRange({ start: s, end: d });
  };

  const isInRange = (d: Date) => {
    const s = tempRange.start;
    const e = tempRange.end;
    if (!s && !e) return false;
    if (s && !e) return isSameDay(s, d);
    if (!s && e) return isSameDay(e, d);
    const [a, b] = orderDates(s!, e!);
    return d >= startOfDay(a) && d <= endOfDay(b);
  };

  const isRangeEdge = (d: Date) => {
    const s = tempRange.start;
    const e = tempRange.end;
    if (!s) return false;
    if (s && !e) return isSameDay(s, d);
    const [a, b] = orderDates(s, e!);
    return isSameDay(a, d) || isSameDay(b, d);
  };

  const isToday = (d: Date) => isSameDay(d, today);

  const canConfirm = useMemo(() => {
    if (tempRange.start) return true;
    if (tempSingle) return true;
    return false;
  }, [tempRange.start, tempSingle]);

  const handleConfirm = () => {
    if (tempRange.start && tempRange.end) {
      const [a, b] = orderDates(tempRange.start, tempRange.end);
      if (isSameDay(a, b)) onConfirm(a);
      else onConfirm({ start: a, end: b });
      return;
    }
    if (tempRange.start && !tempRange.end) {
      onConfirm(tempRange.start); // single selection
      return;
    }
    if (tempSingle) {
      onConfirm(tempSingle);
      return;
    }
    onConfirm(null);
  };

  return (
    <div
      ref={overlayRef}
      style={overlayStyle}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onCancel();
      }}
    >
      <div style={modalStyle}>
        {/* HEADER */}
        <div style={headerWrapStyle}>
          <div style={titleBlockStyle}>
          </div>

          <div style={monthBarStyle}>
            <button
              type="button"
              style={navBtnStyle}
              onClick={() => {
                const prev = new Date(viewYear, viewMonth - 1, 1);
                setViewYear(prev.getFullYear());
                setViewMonth(prev.getMonth());
              }}
              aria-label="Previous month"
            >
              ←
            </button>

            <div style={monthLabelStyle}>{monthLabel}</div>

            <button
              type="button"
              style={navBtnStyle}
              onClick={() => {
                const next = new Date(viewYear, viewMonth + 1, 1);
                setViewYear(next.getFullYear());
                setViewMonth(next.getMonth());
              }}
              aria-label="Next month"
            >
              →
            </button>
          </div>
        </div>

        {/* WEEKDAY HEADER */}
        <div style={weekdayGridStyle}>
          {weekdayLabels.map((w) => (
            <div
              key={w}
              style={{
                fontSize: ".8rem",
                fontWeight: 800,
                opacity: 0.7,
                textAlign: "center",
              }}
            >
              {w}
            </div>
          ))}
        </div>

        {/* DAYS GRID */}
        <div style={gridStyle}>
          {cells.map((cell, idx) => {
            if (!cell.date) return <div key={idx} style={{ height: "40px" }} />;

            const d = cell.date;
            const selected = isInRange(d);
            const edge = isRangeEdge(d);

            const dayStyle: React.CSSProperties = {
              height: "40px",
              borderRadius: "12px",
              border: isToday(d) ? "1px solid #00000066" : "1px solid #00000012",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              fontWeight: selected ? 900 : 650,
              background: selected ? "#00000010" : "transparent",
              outline: edge ? "2px solid #000000" : "none",
            };

            return (
              <button
                key={idx}
                type="button"
                style={dayStyle}
                onClick={() => onDayClick(d)}
                title={formatLong(d)}
              >
                {cell.dayNum}
              </button>
            );
          })}
        </div>

        {/* FOOTER */}
        <p style={subtitleStyle}>{selectionSummary}</p>
        <div style={footerStyle}>
            
          <div style={{ display: "flex", gap: ".5em", flexWrap: "wrap" }}>
            <button
              type="button"
              style={btnStyle}
              onClick={() => {
                setTempSingle(null);
                setTempRange({ start: null, end: null });
              }}
            >
              Clear
            </button>

            <button
              type="button"
              style={btnStyle}
              onClick={() => {
                // convenience: explicitly treat the current anchor (start) as a single date
                if (tempRange.start) {
                  setTempSingle(tempRange.start);
                  setTempRange({ start: tempRange.start, end: null });
                }
              }}
              disabled={!tempRange.start}
              title="Use the currently selected start day as a single date"
            >
              Use Single Date
            </button>

            <button type="button" style={btnStyle} onClick={onCancel}>
              Cancel
            </button>
          </div>

          <button
            type="button"
            style={
              canConfirm
                ? primaryBtnStyle
                : { ...primaryBtnStyle, opacity: 0.5, cursor: "not-allowed" }
            }
            disabled={!canConfirm}
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>

        <div style={{ marginTop: ".75em", fontSize: ".85rem", opacity: 0.75 }}>
          Click once for a single day, click a second day to make a range. Third click starts a new range.
        </div>
      </div>
    </div>
  );
};

function formatShort(d: Date) {
  return d.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });
}
function formatLong(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}
function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}
function orderDates(a: Date, b: Date): [Date, Date] {
  return a <= b ? [a, b] : [b, a];
}

export default DateTimePicker;
