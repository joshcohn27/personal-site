
import { DataPanel } from "../components/DataPanel"
import { fetchJson } from "../utils/FetchUtil";
import React, { useState } from "react";
import { ApiError } from "../utils/FetchUtil";
import { LoginSuccessResponseType } from "../types/JSONTypes";
import { useNavigate } from "react-router-dom";
import { useAuthStore, setLogin } from "../utils/AuthStore";
import { MessagePopup, MessageType } from "../components/MessagePopup";
import BeeGraphic from "/bee-graphic.svg";



const LoginPage = () => {
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [animate, setAnimate] = useState(false);

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
        margin: "2em",
        transition: "opacity 1s ease-in-out",
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
        width: '6em',
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
    const createAccountStyle = {
        textDecoration: 'underline',
        cursor: 'pointer',
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
        setAnimate(true);
    }, []);

    async function getLogin() {
        console.log("Login clicked");
        console.log(`Email: ${email}, Password: ${password}`);

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        setLoading(true);

        try {
            const created: LoginSuccessResponseType = await fetchJson("/Login", {
                method: "POST",
                body: { Email: email, Password: password },
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
                if (e.status === 401) {
                    setError("401: Invalid email or password");
                    return;
                }
                else if (e.status === 400) {
                     setError(`${e.status}: ${e.message}`)
                    return;
                }
                else if (e.status === 500) {
                     setError("500: Server error. Please try again later.")
                    return;
                }
                setError(`${e.status}: ${e.message}`)
            } else {
                setError("Unexpected error")
            };
        }
    }

    function goToRegister() {
        navigate("/register");
    }

    return (
        <div style={loginPageStyle}>
            <img src={BeeGraphic} alt="Bee" style={beeSvgStyle}/>
            <div style={{...loginBoxStyleStart, ...(animate ? loginBoxStyleEnd : {})}} id="text-block">
            <p style={loginTitleStyle}>Welcome back.</p>
            <p style={loginSubtitle}>Are you new here? <span style={createAccountStyle} onClick={goToRegister}>Create an account</span></p>
            <div style={loginFormStyle}>
                <div style={loginInnerFormStyle}>
                <div style={inputFieldStyle}>
                    <label style={labelStyle}>Email</label>
                    <input style={textfieldStyle} type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div style={inputFieldStyle}>
                    <label style={labelStyle}>Password</label>
                    <input style={textfieldStyle} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                </div>
                <p style={forgotPasswordStyle}>Forgot Password</p>
                <button style={loginButtonStyle} onClick={getLogin}>Login</button>
            </div>
            </div>
            {error && <MessagePopup message={error} type={MessageType.ERROR} onClose={() => setError("")} />}
        </div>
        )
}

export { LoginPage }