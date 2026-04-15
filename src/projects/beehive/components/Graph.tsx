import React, { useMemo, useState, useEffect, useRef } from "react";
import Highcharts from "highcharts/esm/highcharts.js"; // your ES6 module import
import type { Options, TimeOptions, TooltipFormatterCallbackFunction, Point } from "highcharts";
import DateTimePicker from "./DateTimePicker";
import TempToggle from "./ToggleSwitch";
import { SensorType, SENSOR_JSON_KEYS } from "../types/SensorTypeEnums";
import { isSameDay } from "date-fns";

interface CustomSeriesConfig {
  name: string;
  valueKey: string;
  color?: string;
}

type LocalTimeOptions = TimeOptions & { useUTC?: boolean };

const localTimeConfig: LocalTimeOptions = { useUTC: false };
Highcharts.setOptions({ time: localTimeConfig });

interface GraphProps {
  title: string;
  dataObject: Record<string, any>;
  dateRange: { start: Date; end: Date };
  sensorType: SensorType;
  hasOutsideData?: boolean;
  allowOutsideToggle?: boolean;
  allowDateSelection?: boolean;
  getDateRange: (startDate: Date, endDate: Date) => void;
  customSeries?: CustomSeriesConfig[];
  yAxisLabel?: string;
}

const graphBoxStyle = {
  boxShadow: "0 4px 16px #00000033",
  borderRadius: "16px",
  padding: "1em",
  backgroundColor: "var(--foreground-color, #ffffff)",
};

const graphHeaderStyle = {
  display: "flex",
  flexDirection: "row" as const,
  justifyContent: "space-between" as const,
  width: "100%",
  alignItems: "start" as const,
  marginBottom: "1em",
};

const Graph = ({
  title,
  dataObject,
  dateRange,
  sensorType,
  hasOutsideData,
  allowOutsideToggle,
  allowDateSelection,
  getDateRange,
  customSeries,
  yAxisLabel,
}: GraphProps) => {
  const [outsideEnabled, setOutsideEnabled] = useState(hasOutsideData ?? false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dataArray = useMemo(() => (Array.isArray(dataObject) ? dataObject : []), [dataObject]);
  const sortedData = useMemo(() => {
    return [...dataArray].sort((a, b) => new Date(a.TimeStamp).getTime() - new Date(b.TimeStamp).getTime());
  }, [dataArray]);

  const insideSeries = useMemo(() => {
    const keys = SENSOR_JSON_KEYS[sensorType];
    return sortedData.map((entry: any) => [new Date(entry.TimeStamp).getTime(), entry[keys.insideKey]]);
  }, [sortedData, sensorType]);

  const outsideSeries = useMemo(() => {
    const keys = SENSOR_JSON_KEYS[sensorType];
    return keys.outsideKey ? sortedData.map((entry: any) => [new Date(entry.TimeStamp).getTime(), entry[keys.outsideKey!]]) : [];
  }, [sortedData, sensorType]);

  const customSeriesData = useMemo(() => {
    if (!customSeries || customSeries.length === 0) {
      return [];
    }
    return customSeries.map((series) => ({
      name: series.name,
      data: sortedData.map((entry: any) => [new Date(entry.TimeStamp).getTime(), entry[series.valueKey]]),
      color: series.color,
    }));
  }, [customSeries, sortedData]);

  const sameDay = isSameDay(dateRange.start, dateRange.end);
  const xAxisMin = useMemo(() => dateRange.start.getTime(), [dateRange.start]);
  const xAxisMax = useMemo(() => dateRange.end.getTime(), [dateRange.end]);
  type SharedTooltipContext = Point & {
    x?: number;
    color?: string;
    series: { name?: string };
    points?: Array<Point & { color?: string; series: { name?: string }; y?: number }>;
    y?: number;
  };

  const tooltipFormatter = useMemo<TooltipFormatterCallbackFunction>(
    () =>
      function () {
        const ctx = this as SharedTooltipContext;
        const headerFormat = "%b %e, %Y %l:%M %p";
        const timestampLabel = ctx.x !== undefined ? Highcharts.dateFormat(headerFormat, ctx.x) : "";
        const pointDetails = (ctx.points ?? [ctx])
          .map((point) => `<span style="color:${point.color}">&bull;</span> ${point.series?.name ?? "Value"}: <b>${point.y ?? "--"}</b>`)
          .join("<br/>");
        return `<span style="font-weight:600;">${timestampLabel}</span><br/>${pointDetails}`;
      },
    []
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const baseSeries = customSeriesData.length > 0
      ? customSeriesData
      : [
          { name: `Inside ${sensorType}`, data: insideSeries, color: "#FFD51C" },
          ...(outsideEnabled ? [{ name: `Outside ${sensorType}`, data: outsideSeries, color: "#1CD5FF" }] : []),
        ];

    const chartOptions: Options = {
      chart: { type: "line", zooming: { type: "x" } },
      time: localTimeConfig,
      title: { text: `` },
      xAxis: {
        type: "datetime",
        title: { text: "Time" },
        min: xAxisMin,
        max: xAxisMax,
        labels: {
          formatter() {
            return Highcharts.dateFormat(
              sameDay ? "%l %p" : "%b %e",
              this.value as number
            );
          },
        },
      },
      yAxis: { title: { text: yAxisLabel ?? sensorType } },
      tooltip: { shared: true, useHTML: true, formatter: tooltipFormatter },
      legend: { align: "center", verticalAlign: "bottom" },
      credits: { enabled: false },
      series: baseSeries,
    };

    Highcharts.chart(containerRef.current, chartOptions);
  }, [insideSeries, outsideSeries, outsideEnabled, sensorType, title, sameDay, customSeriesData, yAxisLabel, xAxisMin, xAxisMax, tooltipFormatter]);

  return (
    <div style={graphBoxStyle}>
      <div style={graphHeaderStyle}>
        <p style={{ margin: 0 }}>{title}</p>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "1em" }}>
          {hasOutsideData && allowOutsideToggle && <TempToggle checked={outsideEnabled} onChange={setOutsideEnabled} />}
          {allowDateSelection && <DateTimePicker getDateRange={getDateRange} />}
        </div>
      </div>
      <div ref={containerRef} />
    </div>
  );
};

export default Graph;