import './sass/createnewuser.sass';
import JsonNetworkAdapter from './configs/networkadapter';
import conn from './configs/conn';
import constants from "./utils/constants";
import useServerResponse from './hooks/useServerResponse';
import FieldValidationError from './components/FieldValidationError';
import { validateEmail, validateUsername, validatePassword, validatePasswordMatch } from './utils/validators';

import React from 'react';
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Spinner from 'react-bootstrap/Spinner';

const Createnewuser = (props) => {
    const navigate = useNavigate();
    const { showError, showSuccess, showNetworkError, ServerResponseModals } = useServerResponse();

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
        setPageFields(prevState => ({ ...prevState, email: pageFields.email.toLowerCase() }));
        setPageFields(prevState => ({ ...prevState, username: pageFields.username.toLowerCase() }));

        const emailResult = validateEmail(pageFields.email);
        if (!emailResult.valid) {
            showError("Generated at CreateNewUserJS", "Email Input Error!", emailResult.message);
            return;
        }

        const usernameResult = validateUsername(pageFields.username);
        if (!usernameResult.valid) {
            showError("Generated at CreateNewUserJS", "Username Error!", usernameResult.message);
            return;
        }

        const passwordResult = validatePassword(pageFields.password);
        if (!passwordResult.valid) {
            showError("Generated at CreateNewUserJS", "Password Input Error!", passwordResult.message);
            return;
        }

        const matchResult = validatePasswordMatch(pageFields.password, pageFields.retypedpassword);
        if (!matchResult.valid) {
            showError("Generated at CreateNewUserJS", "Password Error:", matchResult.message);
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
            const result = await JsonNetworkAdapter.post(conn.URL.JPUBLIC_URL, createNewUserJson, { headers: headers });

            if (result.status !== 200) {
                showError(result.status, result.statusText, result.message);
                return;
            }

            if (constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE === result.data.ERROR_MSG_TYPE) {
                showError(result.data.ERROR_FIELD_CODE, result.data.ERROR_FIELD_SUBJECT, result.data.ERROR_FIELD_MESSAGE);
                return;
            }

            if (constants.SUCCESS_MESSAGE.TYPE_CREATE_NEW_USER === result.data.MSG_TYPE) {
                showSuccess(result.data.UI_SUBJECT, result.data.UI_MESSAGE);
                document.getElementById("createnewuserform").reset();
                clear();
                await new Promise(r => setTimeout(r, 2000));
                navigate("/");
            }
        } catch (error) {
            showNetworkError();
        } finally {
            setCreateNewUserButtonSpinner(false);
        }
    }

    function CheckEmail(e) {
        const result = validateEmail(e);
        if (!result.valid) {
            setErrorData(prevState => ({ ...prevState, emailErrorMessage: result.message, emailErrorTrigger: true }));
            return;
        }
        setErrorData(prevState => ({ ...prevState, emailErrorTrigger: false }));
    }

    function CheckUsername(u) {
        const result = validateUsername(u);
        if (!result.valid) {
            setErrorData(prevState => ({ ...prevState, usernameErrorMessage: result.message, usernameErrorTrigger: true }));
            return;
        }
        setErrorData(prevState => ({ ...prevState, usernameErrorTrigger: false }));
    }

    function checkPassword(e) {
        const result = validatePassword(e);
        if (!result.valid) {
            setErrorData(prevState => ({ ...prevState, passwordErrorMessage: result.message, passwordErrorTrigger: true }));
            return;
        }
        setErrorData(prevState => ({ ...prevState, passwordErrorTrigger: false }));
    }

    function checkRetypedPassword(e) {
        const result = validatePasswordMatch(pageFields.password, e);
        if (!result.valid) {
            setErrorData(prevState => ({ ...prevState, retypedPasswordErrorMessage: result.message, retypedPasswordErrorTrigger: true }));
            return;
        }
        setErrorData(prevState => ({ ...prevState, retypedPasswordErrorTrigger: false }));
    }

    return (
        < >
        <div id = "CreateNewUserPage">

                <Form id = "createnewuserform">

                    <h1>Sign Up</h1>

                    <Form.Group className="mb-3">
                        <Form.Control id="email" type="email" placeholder="Email Address" onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , email : e.target.value } } ) } onChange={ ( e ) => CheckEmail( e.target.value ) } />
                    </Form.Group>

                    <FieldValidationError show={errordata.emailErrorTrigger} message={errordata.emailErrorMessage} />

                    <Form.Group label="Username" className="mb-3">
                        <Form.Control id="username"  type="text" placeholder="Username" onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , username : e.target.value } } ) }  onChange={ ( e ) => CheckUsername( e.target.value ) }  />
                    </Form.Group>

                    <FieldValidationError show={errordata.usernameErrorTrigger} message={errordata.usernameErrorMessage} />

                    <Form.Group  label="Password" className="mb-3">
                        <Form.Control id = "password" type="password" placeholder="Password" onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , password : e.target.value } } ) }  onChange={ ( e ) => checkPassword( e.target.value ) }/>
                    </Form.Group>

                    <FieldValidationError show={errordata.passwordErrorTrigger} message={errordata.passwordErrorMessage} />

                    <Form.Group label="Re-type your password" className="mb-3">
                        <Form.Control id="retypedpassword" type="password" placeholder="Re-type your password" onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , retypedpassword : e.target.value } } ) } onChange = { ( e ) => checkRetypedPassword( e.target.value  ) }/>
                    </Form.Group>

                    <FieldValidationError show={errordata.retypedPasswordErrorTrigger} message={errordata.retypedPasswordErrorMessage} />

                    <ButtonGroup size="md" className="mb-3">
                        <Button variant="outline-primary" type="button" onClick={ ( ) => signUp( ) }>
                            {createNewUserButtonSpinner && <Spinner as="span"animation="grow"size="sm" role="status" aria-hidden="false"/>}
                            Sign Up
                            </Button>
                        <Button variant="outline-info" type="button" onClick={ ( ) => clear( ) }>Clear</Button>
                    </ButtonGroup>
                </Form>

            <ServerResponseModals />
           
          </div>
            <Outlet/>
            </>
    )
}

export default Createnewuser
