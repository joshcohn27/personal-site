export type HiveCondition = "Excellent" | "Good" | "Fair" | "Poor";

export type InspectionDraft = {
    hiveId: number;
    date: string; // yyyy-mm-dd
    condition: HiveCondition;
    notes: string;
};

export type Inspection = InspectionDraft & {
    id: string;
};