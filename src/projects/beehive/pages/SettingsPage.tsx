import { useAuthStore } from "../utils/AuthStore";
import { useRef, useState } from "react";
import { ConfirmationPopup } from "../components/ConfirmationPopup";
import { fetchJson, ApiError } from "../utils/FetchUtil";
import  ToggleSwitch from "../components/ToggleSwitch";
import { useSettingsStore } from "../utils/SettingsStore";

import userPlaceholderSvg from "../assets/user_placeholder.svg";
import editIcon from "../assets/edit_icon.svg";

export const SettingsPage = () => {
    const setAuthUser = useAuthStore((s) => s.setUser);
    const [user, setUser] = useState(useAuthStore((s) => s.user));
    const [deathEmail, setDeathEmail] = useState(user?.notificationParams?.Death_Notify_Email || false);
    const [deathPhone, setDeathPhone] = useState(user?.notificationParams?.Death_Notify_Phone || false);
    const [deathApp, setDeathApp] = useState(user?.notificationParams?.Death_Notify_Application || false);
    const [swarmEmail, setSwarmEmail] = useState(user?.notificationParams?.Swarm_Notify_Email || false);
    const [swarmPhone, setSwarmPhone] = useState(user?.notificationParams?.Swarm_Notify_Phone || false);
    const [swarmApp, setSwarmApp] = useState(user?.notificationParams?.Swarm_Notify_Application || false);
    const [cleansingEmail, setCleansingEmail] = useState(user?.notificationParams?.Cleansing_Flight_Notify_Email || false);
    const [cleansingPhone, setCleansingPhone] = useState(user?.notificationParams?.Cleansing_Flight_Notify_Phone || false);
    const [cleansingApp, setCleansingApp] = useState(user?.notificationParams?.Cleansing_Flight_Notify_Application || false);

    const { darkMode, funMode, celsius, setDarkMode, setFunMode, setCelsius } = useSettingsStore();

    const [showConfirmation, setShowConfirmation] = useState(false);
    const pendingToggleRef = useRef<{
        key: NotificationSettingKey;
        previousValue: boolean;
    } | null>(null);

    type NotificationSettingKey =
        | "deathEmail"
        | "deathPhone"
        | "deathApp"
        | "swarmEmail"
        | "swarmPhone"
        | "swarmApp"
        | "cleansingEmail"
        | "cleansingPhone"
        | "cleansingApp";

    const notificationValues: Record<NotificationSettingKey, boolean> = {
        deathEmail,
        deathPhone,
        deathApp,
        swarmEmail,
        swarmPhone,
        swarmApp,
        cleansingEmail,
        cleansingPhone,
        cleansingApp,
    };

    const notificationSetters: Record<NotificationSettingKey, (value: boolean) => void> = {
        deathEmail: setDeathEmail,
        deathPhone: setDeathPhone,
        deathApp: setDeathApp,
        swarmEmail: setSwarmEmail,
        swarmPhone: setSwarmPhone,
        swarmApp: setSwarmApp,
        cleansingEmail: setCleansingEmail,
        cleansingPhone: setCleansingPhone,
        cleansingApp: setCleansingApp,
    };

    const pageTitleStyle: React.CSSProperties = {
        fontSize: '3rem',
        fontWeight: '600',
        marginBottom: '1em',
    }
    const settingsPageStyle: React.CSSProperties = {
        flexWrap: 'wrap',
        flexDirection: 'column',
        padding: '2em',
        margin: '1em'
    }
    const settingsSectionStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: '4em',
    }
    const settingsOptionsStyle: React.CSSProperties = {
        flex: '2',
        display: 'flex',
        flexDirection: 'column',
        gap: '1em',
    }
    const settingsOptionsTitleStyle: React.CSSProperties = {
        flex: '1',
        fontSize: '1.25rem',
        fontWeight: '500',
        marginBottom: '1em',
    }
    const settingsSubtitleStyle: React.CSSProperties = {
        fontSize: '1.25rem',
        fontWeight: '500',
        marginBottom: '1em',
    }
    const settingsOptionsContentStyle: React.CSSProperties = {
        display: 'flex',
        alignContent: 'center',
        flexWrap: 'wrap',
        gap: '1em',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 16px #00000033',
        padding: '1em',
        borderRadius: '16px',
        marginBottom: '2em',
    }

    const userImageStyle: React.CSSProperties = {
        width: '8em',
        height: '8em',
        borderRadius: '50%',
        backgroundColor: '#eee',
    }
    const userInfoStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    }

    const editButtonStyle: React.CSSProperties = {
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
    }

    const switchSectionStyle: React.CSSProperties = {  
        display: 'flex',
        flexDirection: 'column', 
        gap: '1em',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 16px #00000033',
        padding: '1em',
        borderRadius: '16px',
    }

    const switchRowStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '5em',
    }

    function openConfirmationFor(settingKey: NotificationSettingKey) {
        if (showConfirmation) {
            return;
        }

        pendingToggleRef.current = {
            key: settingKey,
            previousValue: notificationValues[settingKey],
        };

        notificationSetters[settingKey](!notificationValues[settingKey]);
        setShowConfirmation(true);
    }

    function cancelNotificationUpdate() {
        const pendingToggle = pendingToggleRef.current;

        if (pendingToggle) {
            notificationSetters[pendingToggle.key](pendingToggle.previousValue);
        }

        pendingToggleRef.current = null;
        setShowConfirmation(false);
    }

    async function updateUserNotifications(password: string) {
        const updatedNotificationParams = {
            Death_Notify_Email: deathEmail,
            Death_Notify_Phone: deathPhone,
            Death_Notify_Application: deathApp,
            Swarm_Notify_Email: swarmEmail,
            Swarm_Notify_Phone: swarmPhone,
            Swarm_Notify_Application: swarmApp,
            Cleansing_Flight_Notify_Email: cleansingEmail,
            Cleansing_Flight_Notify_Phone: cleansingPhone,
            Cleansing_Flight_Notify_Application: cleansingApp,
        };

        const updatedUser = {
            ...user,
            notificationParams: updatedNotificationParams,
        };

        try {
            await fetchJson("/Update", {
            method: "PUT",
            body: {
                User_ID: user?.userID,
                First_Name: user?.firstName ?? "",
                Last_Name: user?.lastName ?? "",
                Email: user?.email ?? "",
                Phone: user?.phone ?? "",
                Password: password,
                Death_Notify_Email: updatedNotificationParams.Death_Notify_Email,
                Death_Notify_Phone: updatedNotificationParams.Death_Notify_Phone,
                Death_Notify_Application: updatedNotificationParams.Death_Notify_Application,
                Swarm_Notify_Email: updatedNotificationParams.Swarm_Notify_Email,
                Swarm_Notify_Phone: updatedNotificationParams.Swarm_Notify_Phone,
                Swarm_Notify_Application: updatedNotificationParams.Swarm_Notify_Application,
                Cleansing_Flight_Notify_Email: updatedNotificationParams.Cleansing_Flight_Notify_Email,
                Cleansing_Flight_Notify_Phone: updatedNotificationParams.Cleansing_Flight_Notify_Phone,
                Cleansing_Flight_Notify_Application: updatedNotificationParams.Cleansing_Flight_Notify_Application,
                Organization_ID: user?.organizationID ?? user?.organizationID ?? "",
            }
        });

        console.log(password)

        setUser(updatedUser);
        setAuthUser(updatedUser);
        pendingToggleRef.current = null;
        setShowConfirmation(false);
    } catch (error) {
        cancelNotificationUpdate();

        if (error instanceof ApiError) {
            throw new Error(error.status === 401 ? "Incorrect current password." : error.message);
        }

        throw error instanceof Error ? error : new Error("Error updating user notification settings.");
    }
    }

    return (
        <div style={settingsPageStyle}>
            <p style={pageTitleStyle}>Settings</p>
            <div style={settingsSectionStyle}>
                <p style={settingsOptionsTitleStyle}>Account Settings</p>
                <div style={settingsOptionsStyle}>
                    <div style={settingsOptionsContentStyle}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '1em', flexWrap: 'wrap'}}>
                            <img src={userPlaceholderSvg} alt="Profile" style={userImageStyle} />
                            <div style={userInfoStyle}>
                                <p style={{fontWeight: '600', fontSize: '1.5rem', marginBottom: '0.25em'}}>{user?.firstName} {user?.lastName}</p>
                                <p style={{fontWeight: '400', fontSize: '1.25rem'}}>{user?.email}</p>
                                <p style={{fontWeight: '400', fontSize: '1.25rem'}}>{user?.phone}</p>
                            </div>
                        </div>
                        <button style={editButtonStyle}>
                            <img src={editIcon} alt="Edit" style={{width: '2em', height: '2em'}} />
                        </button>
                    </div>
                </div>
            </div>

            <div style={settingsSectionStyle}>
                <p style={settingsOptionsTitleStyle}>View Settings</p>

                <div style={settingsOptionsStyle}>

                    <div style={switchSectionStyle}>
                        <p style={settingsSubtitleStyle}>Website View</p>
                        <div style={switchRowStyle}>
                            <ToggleSwitch label="Celsius" checked={celsius} onChange={() => { setCelsius(!celsius); }} />
                            <ToggleSwitch label="Dark Mode" checked={darkMode} onChange={() => { setDarkMode(!darkMode); }} />
                            <ToggleSwitch label="Fun Mode" checked={funMode} onChange={() => { setFunMode(!funMode); }} />
                        </div>
                    </div>
                </div>
            </div>

            <div style={settingsSectionStyle}>
                <p style={settingsOptionsTitleStyle}>Notification Settings</p>

                <div style={settingsOptionsStyle}>

                    <div style={switchSectionStyle}>
                        <p style={settingsSubtitleStyle}>Colony Death</p>
                        <div style={switchRowStyle}>
                            <ToggleSwitch label="Email" checked={deathEmail} onChange={() => { openConfirmationFor("deathEmail"); }} />
                            <ToggleSwitch label="SMS" checked={deathPhone} onChange={() => { openConfirmationFor("deathPhone"); }} />
                            <ToggleSwitch label="Mobile" checked={deathApp} onChange={() => { openConfirmationFor("deathApp"); }} />
                        </div>
                    </div>

                    <div style={switchSectionStyle}>
                        <p style={settingsSubtitleStyle}>Colony Swarm</p>
                        <div style={switchRowStyle}>
                            <ToggleSwitch label="Email" checked={swarmEmail} onChange={() => { openConfirmationFor("swarmEmail"); }} />
                            <ToggleSwitch label="SMS" checked={swarmPhone} onChange={() => { openConfirmationFor("swarmPhone"); }} />
                            <ToggleSwitch label="Mobile" checked={swarmApp} onChange={() => { openConfirmationFor("swarmApp"); }} />
                        </div>
                    </div>

                    <div style={switchSectionStyle}>
                        <p style={settingsSubtitleStyle}>Cleansing Flight</p>
                        <div style={switchRowStyle}>
                            <ToggleSwitch label="Email" checked={cleansingEmail} onChange={() => { openConfirmationFor("cleansingEmail"); }} />
                            <ToggleSwitch label="SMS" checked={cleansingPhone} onChange={() => { openConfirmationFor("cleansingPhone"); }} />
                            <ToggleSwitch label="Mobile" checked={cleansingApp} onChange={() => { openConfirmationFor("cleansingApp"); }} />
                        </div>
                    </div>
                </div>
            </div>
            {showConfirmation && (
                <ConfirmationPopup 
                    message="Enter your current password to confirm the notification change." 
                    onConfirm={updateUserNotifications}
                    onCancel={cancelNotificationUpdate}
                />
            )}
        </div>

    )
}