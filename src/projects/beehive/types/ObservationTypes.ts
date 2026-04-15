export type ObservationTag =
    | "Temperature"
    | "Humidity"
    | "Pollen"
    | "CO2"
    | "Volume"
    | "Weight"
    | "Bearding"
    | "Brood";


export type Observation = {
    id: string;
    hiveId: number;
    date: string; // YYYY-MM-DD
    tags: ObservationTag[];
    notes: string;
};

export type ObservationDraft = Omit<Observation, "id">;