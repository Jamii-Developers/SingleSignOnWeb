import './sass/userlogin.sass';
import JsonNetworkAdapter from './configs/networkadapter';
import conn from './configs/conn';
import constants from "./utils/constants";
import useServerResponse from './hooks/useServerResponse';
import FieldValidationError from './components/FieldValidationError';
import { validateLoginCredential, validatePassword, PASSWORD_MIN_LENGTH } from './utils/validators';

import React from 'react';
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Spinner from 'react-bootstrap/Spinner';

const Userlogin = (  ) => {
    const MAX_LOGIN_ATTEMPTS = 5;
    const LOCKOUT_DURATION = 15 * 60 * 1000;

    const navigate = useNavigate();
    const [, setCookie] = useCookies("userSession");
    const { showError, showSuccess, ServerResponseModals } = useServerResponse();

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
        if (lockoutUntil && Date.now() < lockoutUntil) {
            const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 60000);
            showError("Security Error", "Account Locked", `Too many failed attempts. Please try again in ${remainingTime} minutes.`);
            return;
        }

        setPageFields(prevState => ({ ...prevState, loginCredential: pageFields.loginCredential.toLowerCase() }));

        if (!validateInputs()) {
            return;
        }

        setLoginButtonSpinner(true);

        try {
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
            const result = await JsonNetworkAdapter.post(conn.URL.JPUBLIC_URL, loginJson, { headers: headers });

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
        const credentialResult = validateLoginCredential(pageFields.loginCredential);
        if (!credentialResult.valid) {
            showError("Input Error", "Invalid Credential", credentialResult.message);
            return false;
        }

        const passwordResult = validatePassword(pageFields.loginPassword);
        if (!passwordResult.valid) {
            showError("Input Error", "Invalid Password", passwordResult.message);
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

        showError(
            error.status || "Error",
            error.statusText || "Login Failed",
            error.message || "Invalid credentials. Please try again."
        );
    }

    async function handleLoginSuccess(result) {
        showSuccess(result.data.UI_SUBJECT, result.data.UI_MESSAGE);
        clear();

        await new Promise(r => setTimeout(r, 3000));

        setLoginAttempts(0);
        localStorage.removeItem('loginLockout');

        const expirydate = new Date(result.data.expiryDate);
        const cookieData = {
            USER_KEY: result.data.userKey,
            DEVICE_KEY: result.data.deviceKey,
            SESSION_KEY: result.data.sessionKey,
            USERNAME: result.data.username,
            EMAIL_ADDRESS : result.data.emailAddress
        }
        
        setCookie("userSession", cookieData , { path: "/", expires: expirydate, secure: true, sameSite: "strict" });
        navigate("/myhome/dashboard");
    }

    function clear() {
        document.getElementById("UserLoginForm").reset();
        setPageFields(prevState => ({ ...prevState, loginCredential: "" }));
        setPageFields(prevState => ({ ...prevState, loginPassword: "" }));
        setPageFields(prevState => ({ ...prevState, rememberLogin: false }));
    }

    function CheckLoginCredential(loginCredential) {
        const result = validateLoginCredential(loginCredential);
        if (!result.valid) {
            setErrorData(prevState => ({
                ...prevState,
                loginCredentialErrorMessage: result.message,
                loginCredentialErrorTrigger: true
            }));
            return;
        }
        setErrorData(prevState => ({ ...prevState, loginCredentialErrorTrigger: false }));
    }

    function CheckLoginPassword(loginPassword) {
        const result = validatePassword(loginPassword);
        if (!result.valid) {
            setErrorData(prevState => ({
                ...prevState,
                loginPasswordErrorMessage: result.message,
                loginPasswordErrorTrigger: true
            }));
            return;
        }
        setErrorData(prevState => ({ ...prevState, loginPasswordErrorTrigger: false }));
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

                    <FieldValidationError show={errordata.loginCredentialErrorTrigger} message={errordata.loginCredentialErrorMessage} />

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="password"
                            placeholder="Login Password"
                            onInput={(e) => setPageFields(prevState => ({ ...prevState, loginPassword: e.target.value }))}
                            onChange={(e) => CheckLoginPassword(e.target.value)}
                            disabled={lockoutUntil && Date.now() < lockoutUntil}
                        />
                    </Form.Group>

                    <FieldValidationError show={errordata.loginPasswordErrorTrigger} message={errordata.loginPasswordErrorMessage} />

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

            <ServerResponseModals />

                
            </div>
            <Outlet />
        </>
    );
};

export default Userlogin;
