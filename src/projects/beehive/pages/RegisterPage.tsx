
import { DataPanel } from "../components/DataPanel"
import { fetchJson } from "../utils/FetchUtil";
import React, { useState } from "react";
import { ApiError } from "../utils/FetchUtil";
import { LoginSuccessResponseType } from "../types/JSONTypes";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../utils/AuthStore";
import { MessagePopup, MessageType } from "../components/MessagePopup";


const RegisterPage = () => {
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [organizationID, setOrganizationID] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [provider, setProvider] = useState("");


    const loginPageStyle = {
        overflow: "hidden" as const,
        height: "100vh",
        margin: "0",
        position: "relative" as const,
    }
        
    const loginBoxStyleStart = {
        position: "absolute" as const,
        right: "8%",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        display: "flex",
        flexDirection: "column" as const,
        opacity: 0,
        transition: "opacity 1s ease-in-out",
        maxWidth: "25em",
        margin: "2em",
    }

    const loginBoxStyleEnd = {
        opacity: 1,
        transition: "opacity 1s ease-in-out",
    }

    const loginButtonStyle = {
        padding: '0.5em 1em',
        fontSize: '1em',
        cursor: 'pointer',
        backgroundColor: '#181818',
        color: '#fff',
        borderRadius: '8px',
        width: '9em',
        alignSelf: 'flex-end' as const,
        marginTop: '2em',
    }

    const textfieldStyle = {
        padding: '0.5em',
        fontSize: '24px',
        borderRadius: '16px',
        boxShadow: '0 0 4px #00000033',
        textDecoration: 'none',
        border: "none",
        fontWeight: '400',
    }

    const loginInnerFormStyle = {
        display: 'flex',
        flexDirection: 'row' as 'row',
        flexWrap: 'wrap' as 'wrap',
        flex: '50%',
        gap: '1em',
        justifyContent: 'space-between',
    }

    const loginFormStyle = {
        display: 'flex',
        flexDirection: 'column' as 'column',
    }

    const inputFieldStyle = {
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: '0.5em',
    }

    const labelStyle = {
        fontSize: '.6em',
    }
    const forgotPasswordStyle = {
        fontSize: '.6em',
        cursor: 'pointer',
        textDecoration: 'underline',
        alignSelf: 'flex-end' as const,
    }

    const loginTitleStyle = {
        fontSize: '2rem',
        fontWeight: '600',
        marginBottom: '0.25em',
    }

    const loginSubtitle = {
        fontWeight: '500',
        fontSize: '1rem',
        marginBottom: '1.5em',
    }

    const beeSvgStyle: React.CSSProperties = {
        position: "absolute",
        top: "50%",
        left: "-15%",
        transform: "translateY(-50%)",
        width: "50em",
        height: "50em",
        zIndex: 1,
        pointerEvents: "none",
        userSelect: "none",
    }


    React.useEffect(() => {
        const textBlock = document.getElementById('text-block') as HTMLDivElement | null;
        if (textBlock) {
            Object.assign(textBlock.style, loginBoxStyleEnd);
        }

    }, []);
    
    async function registerUser() {
        console.log("Register clicked");

        if (!firstName || !lastName || !email || !password || !phoneNumber || !provider || !organizationID) {
            setError("Please fill out all fields.");
            return;
        }

        setLoading(true);

        try {
            const created: LoginSuccessResponseType = await fetchJson("/Register", {
                method: "POST",
                body: { 
                        First_Name: firstName,
                        Last_Name: lastName,
                        Email: email,
                        Phone: phoneNumber,
                        Provider: provider,
                        Password: password,
                        Organization_ID: 1
                },
            });

            const sessionUser = {
                token: created.Token,
                userID: created.User.User_ID,
                firstName: created.User.First_Name,
                lastName: created.User.Last_Name,
                email: created.User.Email,
                organizationID: created.User.Organization_ID,
                phone: created.User.Phone,
                notificationParams: {
                    Death_Notify_Email: created.User.Death_Notify_Email,
                    Death_Notify_Phone: created.User.Death_Notify_Phone,
                    Death_Notify_Application: created.User.Death_Notify_Application,
                    Swarm_Notify_Email: created.User.Swarm_Notify_Email,
                    Swarm_Notify_Phone: created.User.Swarm_Notify_Phone,
                    Swarm_Notify_Application: created.User.Swarm_Notify_Application,
                    Cleansing_Flight_Notify_Email: created.User.Cleansing_Flight_Notify_Email,
                    Cleansing_Flight_Notify_Phone: created.User.Cleansing_Flight_Notify_Phone,
                    Cleansing_Flight_Notify_Application: created.User.Cleansing_Flight_Notify_Application,
                },
            };

            setError("");
            setLoading(false);
            setLogin(sessionUser);
            navigate("/dashboard", { replace: true });


        } catch (e) {

            if (e instanceof ApiError){
                if (e.status === 400) {
                    setError("400: Invalid input, please check your information and try again.");
                    return;
                }
                else if (e.status === 500) {
                    setError("500: An account with this email already exists or there is a server error.");
                    return;
                }
                setError(`${e.status}: ${e.message}`)
            } else {
                setError("Unexpected error")
            };
        }
    }

    return (
        <div style={loginPageStyle}>
            <img src="/public/bee-graphic.svg" alt="Bee" style={beeSvgStyle}/>
            <div style={loginBoxStyleStart} id="text-block">
                <p style={loginTitleStyle}>We're glad you're here.</p>
                <p style={loginSubtitle}>Let's set up your account.</p>
                <div style={loginFormStyle}>
                    <div style={loginInnerFormStyle}>
                        <div style={inputFieldStyle}>
                            <label style={labelStyle}>First Name</label>
                            <input style={textfieldStyle} type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div style={inputFieldStyle}>
                            <label style={labelStyle}>Last Name</label>
                            <input style={textfieldStyle} type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <div style={inputFieldStyle}>
                            <label style={labelStyle}>Email</label>
                            <input style={textfieldStyle} type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div style={inputFieldStyle}>
                            <label style={labelStyle}>Password</label>
                            <input style={textfieldStyle} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div style={inputFieldStyle}>
                            <label style={labelStyle}>Phone Number</label>
                            <input
                                style={textfieldStyle}
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                            />
                        </div>
                        <div style={inputFieldStyle}>
                            <label style={labelStyle}>Organization ID</label>
                            <input
                                style={textfieldStyle}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="Organization ID"
                                value={organizationID}
                                onChange={(e) => setOrganizationID(e.target.value.replace(/\D/g, ""))}
                            />
                        </div>
                        <div style={inputFieldStyle}>
                            <label style={labelStyle}>Phone Provider</label>
                            <select style={textfieldStyle} value={provider} onChange={(e) => setProvider(e.target.value)}>
                                <option style={{fontWeight: "400"}} value="" disabled>Select Provider</option>
                                <option value="verizon">Verizon</option>
                                <option value="at&t">AT&T</option>
                                <option value="t-mobile">T-Mobile</option>
                                <option value="sprint">Sprint</option>
                                <option value="google fi">Google Fi</option>
                                <option value="us cellular">US Cellular</option>
                                <option value="cricket">Cricket</option>
                                <option value="boost mobile">Boost Mobile</option>
                                <option value="metro pcs">Metro PCS</option>
                            </select>
                        </div>
                    </div>
                    <p style={forgotPasswordStyle}>Forgot Password</p>
                    <button style={loginButtonStyle} onClick={registerUser}>Create Account</button>
                </div>
            </div>
            {error && <MessagePopup message={error} type={MessageType.ERROR} onClose={() => setError("")} />}
        </div>
    )
}

export { RegisterPage }