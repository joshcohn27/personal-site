import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HiveReading {
    TimeStamp: string;
    Outside_Temperature: string;
    Outside_Humidity: string;
    Temperature: string;
    Humidity: string;
    Carbon_Dioxide: string;
    Volume: string;
    Weight: string;
}

interface HiveData {
    Hive_ID: string;
    Hive_Name: string;
    Hive_Data: HiveReading[];
}

export interface CacheEntry {
    data: any;
    timestamp: number;
}

type CacheState = {
    cache: Record<string, CacheEntry>;
    setCache: (hiveId: string, data: any) => void;
    getCache: (hiveId: string) => any | null;
    clearCache: (hiveId?: string) => void;
};

export const useCacheStore = create<CacheState>()(
    persist(
        (set, get) => ({
            cache: {},

            setCache: (hiveId: string, data: any) => {
                const newCache = { ...get().cache };
                newCache[hiveId] = {
                    data,
                    timestamp: Date.now(),
                };
                set({ cache: newCache });
            },

            getCache: (hiveId: string) => {
                const entry = get().cache[hiveId];
                return entry ? entry.data : null;
            },

            clearCache: (hiveId?: string) => {
                const newCache = { ...get().cache };
                if (hiveId) {
                    delete newCache[hiveId];
                } else {
                    for (const key of Object.keys(newCache)) {
                        delete newCache[key];
                    }
                }
                set({ cache: newCache });
            },
        }),
        {
            name: "hive-cache-store",
        }
    )
);

export default useCacheStore;