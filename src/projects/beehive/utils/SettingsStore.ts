import { create } from "zustand";
import { persist } from "zustand/middleware";


export interface SettingsState {
    darkMode: boolean;
    funMode: boolean;
    celsius: boolean;
    setDarkMode: (enabled: boolean) => void;
    setFunMode: (enabled: boolean) => void;
    setCelsius: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            darkMode: false,
            funMode: false,
            celsius: false,

            setDarkMode: (enabled: boolean) => set({ darkMode: enabled }),
            setFunMode: (enabled: boolean) => set({ funMode: enabled }),
            setCelsius: (enabled: boolean) => set({ celsius: enabled }),
        }),
        {
            name: "site-settings-store",
        }
    )
);


export default useSettingsStore;