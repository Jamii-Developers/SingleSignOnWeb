import './sass/userlogin.sass';
import ForgetPassword from './forgetpassword';
import ServerErrorMsg from './frequentlyUsedModals/servererrormsg';


import React from 'react';
import { useState } from 'react'
import { createRoot } from 'react-dom/client';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Spinner from 'react-bootstrap/Spinner';

const UserLogin = ( ) => {

    const [serverErrorCode, setServerErrorCode ] = useState("");
    const [serverErrorSubject, setServerErrorSubject ] = useState("");
    const [serverErrorMessage, setServerErrorMessage ] = useState("");
    const [errServMsgShow, setErrServMsgShow ] = useState(false);
    

    const [ loginCredential, setLoginCredential ] = useState("");
    const [ loginPassword, setLoginPassword ] = useState("");
    const [ rememberLogin, setRememberLogin ] = useState( false );

    const [loginButtonSpinner, setLoginButtonSpinner ] = useState( false );

    const openForgetUsPage = ( ) => {
    
        const main_body_container = document.getElementById( 'main_body' )
        const main_body = createRoot( main_body_container )
        main_body.render(< ForgetPassword />)
        
    }

    async function sendUserLogin( loginCredential, loginPassword, rememberLogin ) {

        setLoginButtonSpinner( true )
        var loginJson = { loginCredential,loginPassword };
        var loginData = JSON.stringify(loginJson);
        
        var userLoginUrl = process.env.REACT_APP_SINGLE_SIGNON_URL+'userlogin';
    
        const response = await fetch(userLoginUrl, {
          method: 'POST',
          body: loginData,
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        const result = await response.json( );
        
        setLoginButtonSpinner( false );

        var error_message_type = process.env.REACT_APP_RESPONSE_TYPE_ERROR_MESSAGE
        console.log( result );
        console.log( error_message_type )
        if( error_message_type === result.MSGTYPE ){
            setServerErrorCode( result.ERROR_FIELD_CODE );
            setServerErrorSubject( result.ERROR_FIELD_SUBJECT);
            setServerErrorMessage( result.ERROR_FIELD_MESSAGE)
            setErrServMsgShow(true);
        }
    } 

    function clear( ){
        document.getElementById("UserLoginForm").reset( ) 
    }

    return (
        <div id = "UserLoginPage"> 
            <Form id = "UserLoginForm">

                <h1 className='h1_defaults'>Single Sign-On Login</h1>

                <FloatingLabel controlId="logincredential" label="Email address or Username" className="mb-3">
                    <Form.Control type="text" placeholder="user@jamii.com or jamiidev30" onChange={ (e) => setLoginCredential(e.target.value) } />
                </FloatingLabel>

                <FloatingLabel controlId="loginpassword" label="Password" className="mb-3">
                    <Form.Control type="password" placeholder="Login Password" onChange={ (e) => setLoginPassword(e.target.value) } />
                </FloatingLabel>

                <Form.Check type="switch" id="custom-switch" label="Remember me on this device" className="mb-3" onChange={ (e) => setRememberLogin( e.target.checked ) }/>

                <ButtonGroup size="md" className="mb-3">
                    <Button variant="outline-primary" type="button" onClick={ ( ) => sendUserLogin( loginCredential , loginPassword, rememberLogin ) }>
                        {loginButtonSpinner && <Spinner as="span"animation="grow"size="sm" role="status" aria-hidden="false"/>}
                        Login                           
                    </Button>
                    <Button variant="outline-secondary" type="button" onClick={ ( ) => openForgetUsPage( ) } > Forgot Password? </Button>
                    <Button variant="outline-info" type="button" onClick={ ( ) => clear( ) }>Clear</Button>
                </ButtonGroup>
                
            </Form>

            < ServerErrorMsg 
                show={errServMsgShow} 
                onHide={ ( ) => setErrServMsgShow( false ) } 
                errorcode = {serverErrorCode} 
                errorsubject = {serverErrorSubject} 
                errormessage = {serverErrorMessage}                             
            />

        </div>
    )
}

export default UserLogin