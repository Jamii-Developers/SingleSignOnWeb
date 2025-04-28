import './sass/createnewuser.sass';
import Servererrormsg from './frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from './frequentlyUsedModals/serversuccessmsg';
import JsonNetworkAdapter from './configs/networkadapter';
import conn from './configs/conn';
import constants from "./utils/constants";

import React from 'react';
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Spinner from 'react-bootstrap/Spinner';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { uniqueSort } from 'jquery';

const Createnewuser = (props) => {
    // Enhanced email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const specialChars = /[`!@#$%^&*()_\-+=[\]{};':"|,.<>/?~ ]/;

    const navigate = useNavigate();

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
        email: "",
        username: "",
        password: "",
        retypedpassword: ""
    });

    const [errordata, setErrorData] = useState({
        emailErrorTrigger: false,
        emailErrorMessage: "",
        usernameErrorTrigger: false,
        usernameErrorMessage: "",
        passwordErrorTrigger: false,
        passwordErrorMessage: "",
        retypedPasswordErrorTrigger: false,
        retypedPasswordErrorMessage: ""
    });

    const [createNewUserButtonSpinner, setCreateNewUserButtonSpinner] = useState(false);

    function clear() {
        document.getElementById("createnewuserform").reset();
        setPageFields(prevState => ({ ...prevState, email: "" }));
        setPageFields(prevState => ({ ...prevState, username: "" }));
        setPageFields(prevState => ({ ...prevState, password: "" }));
        setPageFields(prevState => ({ ...prevState, retypedpassword: "" }));
    }

    async function signUp() {
        // Convert email and username to lowercase
        setPageFields(prevState => ({ ...prevState, email: pageFields.email.toLowerCase() }));
        setPageFields(prevState => ({ ...prevState, username: pageFields.username.toLowerCase() }));

        // Enhanced email validation
        if (pageFields.email === "") {
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "Generated at CreateNewUserJS",
                serverErrorSubject: "Email Input Error!",
                serverErrorMessage: "No email address has been provided.",
                errServMsgShow: true
            }));
            return;
        }

        if (!emailRegex.test(pageFields.email)) {
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "Generated at CreateNewUserJS",
                serverErrorSubject: "Email Input Error!",
                serverErrorMessage: "Please enter a valid email address (e.g., user@example.com).",
                errServMsgShow: true
            }));
            return;
        }

        // Check for common disposable email domains
        const disposableDomains = ['tempmail.com', 'throwawaymail.com', 'mailinator.com'];
        const emailDomain = pageFields.email.split('@')[1];
        if (disposableDomains.includes(emailDomain)) {
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "Generated at CreateNewUserJS",
                serverErrorSubject: "Email Input Error!",
                serverErrorMessage: "Please use a valid email address. Disposable email addresses are not allowed.",
                errServMsgShow: true
            }));
            return;
        }

        if (pageFields.username === "") {
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "Generated at CreateNewUserJS",
                serverErrorSubject: "Username Error!",
                serverErrorMessage: "No username has been provided",
                errServMsgShow: true
            }));
            return;
        }

        if (pageFields.username.length < 5) {
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "Generated at CreateNewUserJS",
                serverErrorSubject: "Username Error!",
                serverErrorMessage: "Your username cannot be less than 5 characters",
                errServMsgShow: true
            }));
            return;
        }
        if (pageFields.username.match(specialChars)) {
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "Generated at CreateNewUserJS",
                serverErrorSubject: "Username Error!",
                serverErrorMessage: "Your username cannot contain any special characters",
                errServMsgShow: true
            }));
            return;
        }

        if (pageFields.password === "") {
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "Generated at CreateNewUserJS",
                serverErrorSubject: "Password Input Error!",
                serverErrorMessage: "No password address has been provided",
                errServMsgShow: true
            }));
            return;
        }

        if (pageFields.password.length < 8) {
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "Generated at CreateNewUserJS",
                serverErrorSubject: "Password Input Error!",
                serverErrorMessage: "Your password cannot be less than 8 characters",
                errServMsgShow: true
            }));
            return;
        }

        if (pageFields.retypedpassword === "") {
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "Generated at CreateNewUserJS",
                serverErrorSubject: "Retyped Password Input!",
                serverErrorMessage: "No email address has been provided",
                errServMsgShow: true
            }));
            return;
        }

        if (pageFields.password !== pageFields.retypedpassword) {
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "Generated at CreateNewUserJS",
                serverErrorSubject: "Password Error:",
                serverErrorMessage: "The passwords do not match",
                errServMsgShow: true
            }));
            return;
        }

        let emailaddress = pageFields.email;
        let username = pageFields.username;
        let password = pageFields.password;
        var createNewUserJson = {
            emailaddress,
            username,
            password
        };

        setCreateNewUserButtonSpinner(true);

        try {
            const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.CREATE_NEW_USER };
            const result = await JsonNetworkAdapter.post(conn.URL.PUBLIC_URL, createNewUserJson, { headers: headers });

            if (result.status !== 200) {
                setServerErrorResponse(prevState => ({
                    ...prevState,
                    serverErrorCode: result.status,
                    serverErrorSubject: result.statusText,
                    serverErrorMessage: result.message,
                    errServMsgShow: true
                }));
                return;
            }

            if (constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE === result.data.ERROR_MSG_TYPE) {
                setServerErrorResponse(prevState => ({
                    ...prevState,
                    serverErrorCode: result.data.ERROR_FIELD_CODE,
                    serverErrorSubject: result.data.ERROR_FIELD_SUBJECT,
                    serverErrorMessage: result.data.ERROR_FIELD_MESSAGE,
                    errServMsgShow: true
                }));
                return;
            }

            if (constants.SUCCESS_MESSAGE.TYPE_CREATE_NEW_USER === result.data.MSG_TYPE) {
                setServerSuccessResponse(prevState => ({
                    ...prevState,
                    ui_subject: result.data.UI_SUBJECT,
                    ui_message: result.data.UI_MESSAGE,
                    succServMsgShow: true
                }));
                document.getElementById("createnewuserform").reset();
                clear();
                await new Promise(r => setTimeout(r, 2000));
                navigate("/");
            }
        } catch (error) {
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "Network Error",
                serverErrorSubject: "Connection Error",
                serverErrorMessage: "Unable to connect to the server. Please try again later.",
                errServMsgShow: true
            }));
        } finally {
            setCreateNewUserButtonSpinner(false);
        }
    }

    function CheckEmail(e) {
        if (e === "") {
            setErrorData(prevState => ({
                ...prevState,
                emailErrorMessage: "Email address is required",
                emailErrorTrigger: true
            }));
            return;
        }

        if (!emailRegex.test(e)) {
            setErrorData(prevState => ({
                ...prevState,
                emailErrorMessage: "Please enter a valid email address (e.g., user@example.com)",
                emailErrorTrigger: true
            }));
            return;
        }

        // Check for common disposable email domains
        const disposableDomains = ['tempmail.com', 'throwawaymail.com', 'mailinator.com'];
        const emailDomain = e.split('@')[1];
        if (disposableDomains.includes(emailDomain)) {
            setErrorData(prevState => ({
                ...prevState,
                emailErrorMessage: "Please use a valid email address. Disposable email addresses are not allowed.",
                emailErrorTrigger: true
            }));
            return;
        }

        setErrorData(prevState => ({
            ...prevState,
            emailErrorTrigger: false
        }));
    }

    function CheckUsername(u) {
        if (uniqueSort === "") {
            setErrorData(prevState => ({
                ...prevState,
                usernameErrorMessage: "Username is empty",
                usernameErrorTrigger: true
            }));
            return;
        }

        if (u.match(specialChars)) {
            setErrorData(prevState => ({
                ...prevState,
                usernameErrorMessage: "Your username cannot contain any special characters",
                usernameErrorTrigger: true
            }));
            return;
        }

        if (u.length < 5) {
            setErrorData(prevState => ({
                ...prevState,
                usernameErrorMessage: "Username cannot be less than 5 characters",
                usernameErrorTrigger: true
            }));
            return;
        }

        setErrorData(prevState => ({
            ...prevState,
            usernameErrorTrigger: false
        }));
    }

    function checkPassword(e) {
        if (e === "") {
            setErrorData(prevState => ({
                ...prevState,
                passwordErrorMessage: "Password is empty!",
                passwordErrorTrigger: true
            }));
            return;
        }

        if (e.length < 8) {
            setErrorData(prevState => ({
                ...prevState,
                passwordErrorMessage: "The password cannot have less than 8 characters!",
                passwordErrorTrigger: true
            }));
            return;
        }
        
        setErrorData(prevState => ({
            ...prevState,
            passwordErrorTrigger: false
        }));
    }

    function checkRetypedPassword(e) {
        if (e !== pageFields.password) {
            setErrorData(prevState => ({
                ...prevState,
                retypedPasswordErrorMessage: "Retyped password does not match!",
                retypedPasswordErrorTrigger: true
            }));
            return;
        }
        
        setErrorData(prevState => ({
            ...prevState,
            retypedPasswordErrorTrigger: false
        }));
    }

    function ShowEmailMessageError() {
        return (
            <Collapse in={errordata.emailErrorTrigger}>
                <Alert variant="filled" severity="warning" className='mb-3'>{errordata.emailErrorMessage}</Alert>
            </Collapse>
        );
    }

    function ShowUsernameError() {
        return (
            <Collapse in={errordata.usernameErrorTrigger}>
                <Alert variant="filled" severity="warning" className='mb-3'>{errordata.usernameErrorMessage}</Alert>
            </Collapse>
        );
    }

    function ShowPasswordError() {
        return (
            <Collapse in={errordata.passwordErrorTrigger}>
                <Alert variant="filled" severity="warning" className='mb-3'>{errordata.passwordErrorMessage}</Alert>
            </Collapse>
        );
    }

    function ShowRetypedMessageError() {
        return (
            <Collapse in={errordata.retypedPasswordErrorTrigger}>
                <Alert variant="filled" severity="warning" className='mb-3'>{errordata.retypedPasswordErrorMessage}</Alert>
            </Collapse>
        );
    }

    return (
        < >
        <div id = "CreateNewUserPage">

                <Form id = "createnewuserform">

                    <h1>Sign Up</h1>

                    <Form.Group className="mb-3">
                        <Form.Control id="email" type="email" placeholder="Email Address" onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , email : e.target.value } } ) } onChange={ ( e ) => CheckEmail( e.target.value ) } />
                    </Form.Group>

                    < ShowEmailMessageError />

                    <Form.Group label="Username" className="mb-3">
                        <Form.Control id="username"  type="text" placeholder="Username" onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , username : e.target.value } } ) }  onChange={ ( e ) => CheckUsername( e.target.value ) }  />
                    </Form.Group>

                    <ShowUsernameError />

                    <Form.Group  label="Password" className="mb-3">
                        <Form.Control id = "password" type="password" placeholder="Password" onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , password : e.target.value } } ) }  onChange={ ( e ) => checkPassword( e.target.value ) }/>
                    </Form.Group>

                    <ShowPasswordError/>

                    <Form.Group label="Re-type your password" className="mb-3">
                        <Form.Control id="retypedpassword" type="password" placeholder="Re-type your password" onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , retypedpassword : e.target.value } } ) } onChange = { ( e ) => checkRetypedPassword( e.target.value  ) }/>
                    </Form.Group>

                    <ShowRetypedMessageError />

                    <ButtonGroup size="md" className="mb-3">
                        <Button variant="outline-primary" type="button" onClick={ ( ) => signUp( ) }>
                            {createNewUserButtonSpinner && <Spinner as="span"animation="grow"size="sm" role="status" aria-hidden="false"/>}
                            Sign Up
                            </Button>
                        <Button variant="outline-info" type="button" onClick={ ( ) => clear( ) }>Clear</Button>
                    </ButtonGroup>
                </Form>

                < Servererrormsg
                    open={serverErrorResponse.errServMsgShow}  
                    onClose={ ( ) => setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : false } } ) }
                    errorcode = {serverErrorResponse.serverErrorCode} 
                    errorsubject = {serverErrorResponse.serverErrorSubject} 
                    errormessage = {serverErrorResponse.serverErrorMessage}                             
                />

                < ServerSuccessMsg 
					open={serverSuccessResponse.succServMsgShow}  
					onClose={ ( ) => setServerSuccessResponse( prevState => { return { ...prevState , succServMsgShow : false } } ) }
					ui_subject = {serverSuccessResponse.ui_subject} 
					ui_message = {serverSuccessResponse.ui_message}                             
                />
           
          </div>
            <Outlet/>
            </>
    )
}

export default Createnewuser