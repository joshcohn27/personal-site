import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SessionUser = {
    token?: string;
    userID?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    organizationID?: string;
    phone?: string;
    notificationParams?: {
        Death_Notify_Email?: boolean;
        Death_Notify_Phone?: boolean;
        Death_Notify_Application?: boolean;
        Swarm_Notify_Email?: boolean;
        Swarm_Notify_Phone?: boolean;
        Swarm_Notify_Application?: boolean;
        Cleansing_Flight_Notify_Email?: boolean;
        Cleansing_Flight_Notify_Phone?: boolean;
        Cleansing_Flight_Notify_Application?: boolean;
    }
};

type AuthState = {
  user: SessionUser | null;
  expiresAt: number | null;

  setUser: (user: SessionUser | null) => void;
  setExpiresAt: (expiresAt: number | null) => void;
};

type PersistedAuthState = {
  user: SessionUser | null;
  expiresAt: number | null;
};

const DEMO_USER: SessionUser = {
    token: "static-demo-token",
    userID: "21",
    firstName: "Josh",
    lastName: "Cohn",
    email: "josh@example.com",
    organizationID: "1",
    phone: "5551234567",
    notificationParams: {
        Death_Notify_Email: false,
        Death_Notify_Phone: false,
        Death_Notify_Application: true,
        Swarm_Notify_Email: false,
        Swarm_Notify_Phone: false,
        Swarm_Notify_Application: true,
        Cleansing_Flight_Notify_Email: false,
        Cleansing_Flight_Notify_Phone: false,
        Cleansing_Flight_Notify_Application: true,
    },
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: DEMO_USER,
            expiresAt: null,
            setUser: (user) => set({ user: user ?? DEMO_USER }),
            setExpiresAt: (expiresAt) => set({ expiresAt }),
        }),
        {
            name: "app_session",
            partialize: (state): PersistedAuthState => ({
                user: state.user,
                expiresAt: state.expiresAt,
            }),
            onRehydrateStorage: () => (state) => {
                if (state && !state.user) {
                    state.setUser(DEMO_USER);
                    state.setExpiresAt(null);
                }
            },
        }
    )
);

export const setLogin = (user: SessionUser, ttlMs = 60 * 60 * 1000) => {
    useAuthStore.getState().setUser(user ?? DEMO_USER);
    useAuthStore.getState().setExpiresAt(ttlMs ? Date.now() + ttlMs : null);
};

export const getUser = (): SessionUser | null => {
    return useAuthStore.getState().user ?? DEMO_USER;
};

export const getToken = (): string | null => {
    return getUser()?.token || DEMO_USER.token || null;
};

export const setLogout = () => {
    useAuthStore.getState().setUser(DEMO_USER);
    useAuthStore.getState().setExpiresAt(null);
};

export const isAuthenticated = (): boolean => {
    return true;
};