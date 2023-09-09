import './sass/userlogin.sass';
import ForgetPassword from './forgetpassword';
import ServerErrorMsg from './frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from './frequentlyUsedModals/serversuccessmsg'


import React from 'react';
import { useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Spinner from 'react-bootstrap/Spinner';
import Alert from '@mui/material/Alert';
import Collapse from 'react-bootstrap/Collapse';


const UserLogin = ( props ) => {

    const [serverErrorCode, setServerErrorCode ] = useState("");
    const [serverErrorSubject, setServerErrorSubject ] = useState("");
    const [serverErrorMessage, setServerErrorMessage ] = useState("");
    const [errServMsgShow, setErrServMsgShow ] = useState(false);

    const [ui_subject, setUi_subject ] = useState("");
    const [ui_message, setUi_message ] = useState("");
    const [succServMsgShow, setSuccServMsgShow ] = useState(false);
    

    const [ loginCredential, setLoginCredential ] = useState("");
    const [ loginPassword, setLoginPassword ] = useState("");
    const [ rememberLogin, setRememberLogin ] = useState( false );

    const [errordata , setErrorData ] = useState({
        loginCredentialErrorTrigger : false,
        loginCredentialErrorMessage : "",
        loginPasswordErrorTrigger : false,
        loginPasswordErrorMessage : "",
    });


    const [loginButtonSpinner, setLoginButtonSpinner ] = useState( false );

    const openForgetUsPage = ( ) => {
        props.main_body.render(< ForgetPassword />)
    }

    async function sendUserLogin( ) {

        setLoginCredential( loginCredential.toLowerCase( ) );

        if( loginCredential === ""  ){
            setServerErrorCode( "Generated at CreateNewUserJS" );
            setServerErrorSubject( "Login Credential!" );
            setServerErrorMessage( "No login credential has been provided")
            setErrServMsgShow(true);
            return;
        }

        if( loginPassword === ""  ){
            setServerErrorCode( "Generated at CreateNewUserJS" );
            setServerErrorSubject( "Login Password!" );
            setServerErrorMessage( "No login password has been provided")
            setErrServMsgShow(true);
            return;
        }
        
        
        setLoginButtonSpinner( true )
        var loginJson = { 
            loginCredential,
            loginPassword };
        var loginData = JSON.stringify(loginJson);

        console.log( loginData );
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

        if( error_message_type === result.MSGTYPE ){
            setServerErrorCode( result.ERROR_FIELD_CODE );
            setServerErrorSubject( result.ERROR_FIELD_SUBJECT);
            setServerErrorMessage( result.ERROR_FIELD_MESSAGE)
            setErrServMsgShow(true);
            return;
        }

        var succ_message_type = process.env.REACT_APP_RESPONSE_TYPE_USERLOGIN
        if( succ_message_type === result.MSGTYPE ){
            setUi_subject( result.UI_SUBJECT);
            setUi_message( result.UI_MESSAGE)
            setSuccServMsgShow(true);
        }
    } 

    function clear( ){
        document.getElementById("UserLoginForm").reset( ) 
    }

    function ShowLoginCredentialError(  ){
        return( 
            <Collapse in ={ errordata.loginCredentialErrorTrigger }>
                <Alert variant="filled" severity="warning" className='mb-3' >{ errordata.loginCredentialErrorMessage }</Alert>   
            </Collapse>                    
        );
    }

    function ShowLoginPasswordError(  ){
        return( 
            <Collapse in ={ errordata.loginPasswordErrorTrigger }>
                <Alert variant="filled" severity="warning" className='mb-3' >{ errordata.loginPasswordErrorMessage }</Alert>   
            </Collapse>                    
        );
    }

    function CheckLoginCredential( loginCredential ){
        if( loginCredential === "" ){
            setErrorData( prevState => { return { ...prevState ,loginCredentialErrorMessage : "Your Login Credential is empty" } } );
            setErrorData( prevState => { return { ...prevState ,loginCredentialErrorTrigger : true } } );
            return;
        }

        setErrorData( prevState => { return { ...prevState ,loginCredentialErrorTrigger : false } } );
    }

    function CheckLoginPassword( loginPassword){

        if( loginPassword === "" ){
            setErrorData( prevState => { return { ...prevState ,loginPasswordErrorMessage : "Your Login Password is empty" } } );
            setErrorData( prevState => { return { ...prevState ,loginPasswordErrorTrigger : true } } );
            return;
        }

        setErrorData( prevState => { return { ...prevState ,loginPasswordErrorTrigger : false } } );
    }

    return (
        <div id = "UserLoginPage"> 
            <Form id = "UserLoginForm">

                <h1 className='h1_defaults'>Single Sign-On Login</h1>

                <FloatingLabel label="Email address or Username" className="mb-3">
                    <Form.Control type="text" placeholder="user@jamii.com or jamiidev30" onInput={ (e) => setLoginCredential( e.target.value ) } onChange = { (e) => CheckLoginCredential( e.target.value ) } />
                </FloatingLabel>

                <ShowLoginCredentialError />

                <FloatingLabel label="Password" className="mb-3">
                    <Form.Control type="password" placeholder="Login Password" onInput={ (e) => setLoginPassword( e.target.value ) } onChange = { (e) => CheckLoginPassword( e.target.value ) }/>
                </FloatingLabel>

                <ShowLoginPasswordError />

                <Form.Check type="switch" id="custom-switch" label="Remember me on this device" className="mb-3" onSelect={ (e) => setRememberLogin( e.target.checked ) }/>

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
                open={errServMsgShow}  
                onClose={ ( ) => setErrServMsgShow( false )  }
                errorcode = {serverErrorCode} 
                errorsubject = {serverErrorSubject} 
                errormessage = {serverErrorMessage}                             
            />

            < ServerSuccessMsg 
                open={succServMsgShow}  
                onClose={ ( ) => setSuccServMsgShow( false )  }
                ui_subject = {ui_subject} 
                ui_message = {ui_message}                             
            />

        </div>
    )
}

export default UserLogin