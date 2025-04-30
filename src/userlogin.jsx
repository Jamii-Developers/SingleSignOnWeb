import './sass/userlogin.sass';
import JsonNetworkAdapter from './configs/networkadapter';
import conn from './configs/conn';
import constants from "./utils/constants";
import ServerErrorMsg from './frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from './frequentlyUsedModals/serversuccessmsg';

import React from 'react';
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Spinner from 'react-bootstrap/Spinner';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';

const Userlogin = (  ) => {
    // Security-related constants
    const MAX_LOGIN_ATTEMPTS = 5;
    const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
    const PASSWORD_MIN_LENGTH = 8;
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const USERNAME_REGEX = /^[a-zA-Z0-9_]{5,}$/;

    const navigate = useNavigate();
    const [, setCookie] = useCookies("userSession");

    const [serverErrorResponse, setServerErrorResponse] = useState({
        serverErrorCode: "",
        serverErrorSubject: "",
        serverErrorMessage: "",
        errServMsgShow: false
    });

    const [serverSuccessResponse, setServerSuccessResponse] = useState({
        ui_subject: "",
        ui_message: "",
        succServMsgShow: false
    });


    const [pageFields, setPageFields] = useState({
        loginCredential: "",
        loginPassword: "",
        devicename: "",
        rememberLogin: true
    });

    const [errordata, setErrorData] = useState({
        loginCredentialErrorTrigger: false,
        loginCredentialErrorMessage: "",
        loginPasswordErrorTrigger: false,
        loginPasswordErrorMessage: "",
    });

    const [loginButtonSpinner, setLoginButtonSpinner] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [lockoutUntil, setLockoutUntil] = useState(null);

    // Check for existing lockout on component mount
    useEffect(() => {
        const storedLockout = localStorage.getItem('loginLockout');
        if (storedLockout) {
            const lockoutTime = parseInt(storedLockout);
            if (lockoutTime > Date.now()) {
                setLockoutUntil(lockoutTime);
            } else {
                localStorage.removeItem('loginLockout');
            }
        }
    }, []);

    async function sendUserLogin() {
        // Check for lockout
        if (lockoutUntil && Date.now() < lockoutUntil) {
            const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 60000);
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "Security Error",
                serverErrorSubject: "Account Locked",
                serverErrorMessage: `Too many failed attempts. Please try again in ${remainingTime} minutes.`,
                errServMsgShow: true
            }));
            return;
        }

        // Convert credential to lowercase
        setPageFields(prevState => ({ ...prevState, loginCredential: pageFields.loginCredential.toLowerCase() }));

        // Enhanced input validation
        if (!validateInputs()) {
            return;
        }

        setLoginButtonSpinner(true);

        try {
            // Get device and location information
            const deviceInfo = await getDeviceInfo();
            const location = await getLocation();

            const loginJson = {
                loginCredential: pageFields.loginCredential,
                loginPassword: pageFields.loginPassword,
                loginDeviceName: deviceInfo.deviceName,
                loginDeviceId: deviceInfo.deviceId,
                location,
                rememberLogin: getRememberLogin()
            };

            if (!conn.getServer()) {
                throw new Error("Server not initialized. Run networkDetector() first.");
            }

            const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.USER_LOGIN };
            const result = await JsonNetworkAdapter.post(conn.URL.PUBLIC_URL, loginJson, { headers: headers });

            if (result.status !== 200) {
                handleLoginError(result);
                return;
            }

            if (constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE === result.data.ERROR_MSG_TYPE) {
                handleLoginError(result);
                return;
            }

            if (constants.SUCCESS_MESSAGE.TYPE_USERLOGIN === result.data.MSG_TYPE) {
                await handleLoginSuccess(result);
            }
        } catch (error) {
            handleLoginError(error);
        } finally {
            setLoginButtonSpinner(false);
        }
    }

    function validateInputs() {
        // Validate login credential (email or username)
        if (pageFields.loginCredential === "") {
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "Input Error",
                serverErrorSubject: "Login Credential Required",
                serverErrorMessage: "Please enter your email address or username",
                errServMsgShow: true
            }));
            return false;
        }

        // Check if credential is email or username
        const isEmail = EMAIL_REGEX.test(pageFields.loginCredential);
        const isUsername = USERNAME_REGEX.test(pageFields.loginCredential);

        if (!isEmail && !isUsername) {
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "Input Error",
                serverErrorSubject: "Invalid Credential",
                serverErrorMessage: "Please enter a valid email address or username",
                errServMsgShow: true
            }));
            return false;
        }

        // Validate password
        if (pageFields.loginPassword === "") {
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "Input Error",
                serverErrorSubject: "Password Required",
                serverErrorMessage: "Please enter your password",
                errServMsgShow: true
            }));
            return false;
        }

        if (pageFields.loginPassword.length < PASSWORD_MIN_LENGTH) {
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "Input Error",
                serverErrorSubject: "Invalid Password",
                serverErrorMessage: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
                errServMsgShow: true
            }));
            return false;
        }

        return true;
    }

    async function getDeviceInfo() {
        const deviceName = navigator.userAgent;
        const deviceId = await generateDeviceId();
        return { deviceName, deviceId };
    }

    async function getLocation() {
        try {
            if ("geolocation" in navigator) {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                return `${position.coords.latitude}:${position.coords.longitude}`;
            }
        } catch (error) {
            console.error("Error getting geolocation:", error);
        }
        return null;
    }

    async function generateDeviceId() {
        // Generate a unique device ID based on browser fingerprint
        const components = [
            navigator.userAgent,
            navigator.language,
            navigator.platform,
            navigator.hardwareConcurrency,
            navigator.deviceMemory
        ];
        const fingerprint = components.join('|');
        return await hashString(fingerprint);
    }

    async function hashString(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function handleLoginError(error) {
        setLoginAttempts(prev => {
            const newAttempts = prev + 1;
            if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
                const lockoutTime = Date.now() + LOCKOUT_DURATION;
                setLockoutUntil(lockoutTime);
                localStorage.setItem('loginLockout', lockoutTime.toString());
            }
            return newAttempts;
        });

        setServerErrorResponse(prevState => ({
            ...prevState,
            serverErrorCode: error.status || "Error",
            serverErrorSubject: error.statusText || "Login Failed",
            serverErrorMessage: error.message || "Invalid credentials. Please try again.",
            errServMsgShow: true
        }));
    }

    async function handleLoginSuccess(result) {
        setServerSuccessResponse(prevState => ({
            ...prevState,
            ui_subject: result.data.UI_SUBJECT,
            ui_message: result.data.UI_MESSAGE,
            succServMsgShow: true
        }));
        clear();

        await new Promise(r => setTimeout(r, 3000));

        // Reset login attempts on successful login
        setLoginAttempts(0);
        localStorage.removeItem('loginLockout');

        // Create Cookie and navigate to the home page
        const expirydate = new Date(result.data.EXPIRY_DATE);
        const cookieData = {
            USER_KEY: result.data.USER_KEY,
            DEVICE_KEY: result.data.DEVICE_KEY,
            SESSION_KEY: result.data.SESSION_KEY,
            USERNAME: result.data.USERNAME,
            EMAIL_ADDRESS : result.data.EMAIL_ADDRESS
        }
        
        setCookie("userSession", cookieData , { path: "/", expires: expirydate });
        navigate("/myhome/dashboard");
    }

    function clear() {
        document.getElementById("UserLoginForm").reset();
        setPageFields(prevState => ({ ...prevState, loginCredential: "" }));
        setPageFields(prevState => ({ ...prevState, loginPassword: "" }));
        setPageFields(prevState => ({ ...prevState, rememberLogin: false }));
    }

    function ShowLoginCredentialError() {
        return (
            <Collapse in={errordata.loginCredentialErrorTrigger}>
                <Alert variant="filled" severity="warning" className='mb-3'>{errordata.loginCredentialErrorMessage}</Alert>
            </Collapse>
        );
    }

    function ShowLoginPasswordError() {
        return (
            <Collapse in={errordata.loginPasswordErrorTrigger}>
                <Alert variant="filled" severity="warning" className='mb-3'>{errordata.loginPasswordErrorMessage}</Alert>
            </Collapse>
        );
    }

    function CheckLoginCredential(loginCredential) {
        if (loginCredential === "") {
            setErrorData(prevState => ({
                ...prevState,
                loginCredentialErrorMessage: "Please enter your email address or username",
                loginCredentialErrorTrigger: true
            }));
            return;
        }

        const isEmail = EMAIL_REGEX.test(loginCredential);
        const isUsername = USERNAME_REGEX.test(loginCredential);

        if (!isEmail && !isUsername) {
            setErrorData(prevState => ({
                ...prevState,
                loginCredentialErrorMessage: "Please enter a valid email address or username",
                loginCredentialErrorTrigger: true
            }));
            return;
        }

        setErrorData(prevState => ({
            ...prevState,
            loginCredentialErrorTrigger: false
        }));
    }

    function CheckLoginPassword(loginPassword) {
        if (loginPassword === "") {
            setErrorData(prevState => ({
                ...prevState,
                loginPasswordErrorMessage: "Please enter your password",
                loginPasswordErrorTrigger: true
            }));
            return;
        }

        if (loginPassword.length < PASSWORD_MIN_LENGTH) {
            setErrorData(prevState => ({
                ...prevState,
                loginPasswordErrorMessage: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
                loginPasswordErrorTrigger: true
            }));
            return;
        }

        setErrorData(prevState => ({
            ...prevState,
            loginPasswordErrorTrigger: false
        }));
    }

    const getRememberLogin = () => {
        return pageFields.rememberLogin === true;
    }

    const gotoForgetPasswordPage = () => {
        navigate('/forgetpassword');
    };

    return (
        <>
            <div id="UserLoginPage">
                <Form id="UserLoginForm">
                    <h1 className='h1_defaults'>Login</h1>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Email address or Username"
                            onInput={(e) => setPageFields(prevState => ({ ...prevState, loginCredential: e.target.value }))}
                            onChange={(e) => CheckLoginCredential(e.target.value)}
                            disabled={lockoutUntil && Date.now() < lockoutUntil}
                        />
                    </Form.Group>

                    <ShowLoginCredentialError />

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="password"
                            placeholder="Login Password"
                            onInput={(e) => setPageFields(prevState => ({ ...prevState, loginPassword: e.target.value }))}
                            onChange={(e) => CheckLoginPassword(e.target.value)}
                            disabled={lockoutUntil && Date.now() < lockoutUntil}
                        />
                    </Form.Group>
                    <ShowLoginPasswordError />

                    <Form.Check
                        type="switch"
                        id="custom-switch"
                        label="Remember me on this device"
                        className="mb-3"
                        onChange={(e) => setPageFields(prevState => ({ ...prevState, rememberLogin: e.target.checked }))}
                    />

                    <ButtonGroup size="md" className="mb-3">
                        <Button
                            variant="outline-primary"
                            type="button"
                            onClick={() => sendUserLogin()}
                            disabled={lockoutUntil && Date.now() < lockoutUntil}
                        >
                            {loginButtonSpinner && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="false" />}
                            Login
                        </Button>
                        <Button variant="outline-secondary" type="button" onClick={gotoForgetPasswordPage}>Forget Password?</Button>
                        <Button variant="outline-info" type="button" onClick={() => clear()}>Clear</Button>
                    </ButtonGroup>
                </Form>

            <ServerErrorMsg
                show={serverErrorResponse.errServMsgShow}
                onClose={() => setServerErrorResponse(prevState => ({ ...prevState, errServMsgShow: false }))}
                subject={serverErrorResponse.serverErrorSubject}
                message={serverErrorResponse.serverErrorMessage}
            />

            <ServerSuccessMsg
                show={serverSuccessResponse.succServMsgShow}
                onClose={() => setServerSuccessResponse(prevState => ({ ...prevState, succServMsgShow: false }))}
                subject={serverSuccessResponse.ui_subject}
                message={serverSuccessResponse.ui_message}
            />

                
            </div>
            <Outlet />
        </>
    );
};

export default Userlogin;