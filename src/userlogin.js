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

    const[ serverErrorResponse , setServerErrorResponse ] = useState({
        serverErrorCode : "",
        serverErrorSubject: "",
        serverErrorMessage: "",
        errServMsgShow : false
  	});

  	const[ serverSuccessResponse, setServerSuccessResponse ] = useState({
        ui_subject : "",
        ui_message : "",
        succServMsgShow: false
  	});

    const [ pageFields , setPageFields ] = useState({
        loginCredential : "",
        loginPassword : "",
        devicename : "",
        rememberLogin : false
    });

    const [errordata , setErrorData ] = useState({
        loginCredentialErrorTrigger : false,
        loginCredentialErrorMessage : "",
        loginPasswordErrorTrigger : false,
        loginPasswordErrorMessage : "",
    });


    const [ loginButtonSpinner, setLoginButtonSpinner ] = useState( false );

    const openForgetUsPage = ( ) => {
        props.main_body.render(< ForgetPassword />)
    }

    async function sendUserLogin( ) {
        setPageFields( prevState => { return { ...prevState ,loginCredential : pageFields.loginCredential.toLowerCase( ) } } );

        if( pageFields.loginCredential === ""  ){
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : "Generated at CreateNewUserJS"} } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : "Login Credential!"   } } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage :  "No login credential has been provided" } } )
			setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
            return;
        }

        if( pageFields.loginPassword === ""  ){
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : "Generated at CreateNewUserJS"} } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : "Login Password!"   } } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage :  "No login password has been provided" } } )
			setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
            return;
        }
        
        
        setLoginButtonSpinner( true )
        let loginCredential = pageFields.loginCredential;
        let loginPassword = pageFields.loginPassword;
        let rememberLogin = pageFields.rememberLogin;

        var loginJson = { 
            loginCredential,
            loginPassword,
            rememberLogin
        };
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
    
        const result = await response.json( ) ;
        
        setLoginButtonSpinner( false ) ;

        var error_message_type = process.env.REACT_APP_RESPONSE_TYPE_ERROR_MESSAGE
        if( error_message_type === result.MSGTYPE ){
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : result.ERROR_FIELD_CODE } } )
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : result.ERROR_FIELD_SUBJECT  } } )
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : result.ERROR_FIELD_MESSAGE } } )
            setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
            return;
        }

        var succ_message_type = process.env.REACT_APP_RESPONSE_TYPE_USERLOGIN
        if( succ_message_type === result.MSGTYPE ){ 
            setServerSuccessResponse( prevState => { return { ...prevState , ui_subject : result.UI_SUBJECT } } )
            setServerSuccessResponse( prevState => { return { ...prevState , ui_message : result.UI_MESSAGE } } )
            setServerSuccessResponse( prevState => { return { ...prevState , succServMsgShow: true } } );
            document.getElementById("createnewuserform").reset( );
            clear( );
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
                    <Form.Control type="text" placeholder="user@jamii.com or jamiidev30" 
                        onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , loginCredential : e.target.value } } ) }
                        onChange = { (e) => CheckLoginCredential( e.target.value ) } 
                    />
                </FloatingLabel>

                <ShowLoginCredentialError />

                <FloatingLabel label="Password" className="mb-3">
                    <Form.Control type="password" placeholder="Login Password"  
                        onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , loginCredential : e.target.value } } ) }
                        onChange = { (e) => CheckLoginPassword( e.target.value ) }
                    />
                </FloatingLabel>
                <ShowLoginPasswordError />

                <Form.Check type="switch" id="custom-switch" label="Remember me on this device" className="mb-3" 
                    onSelect={ ( e ) => setPageFields( prevState => { return { ...prevState , rememberLogin : e.target.value } } ) }
                />

                <ButtonGroup size="md" className="mb-3">
                    <Button variant="outline-primary" type="button" onClick={ ( ) => sendUserLogin( ) }>
                        {loginButtonSpinner && <Spinner as="span"animation="grow"size="sm" role="status" aria-hidden="false"/>}
                        Login                           
                    </Button>
                    <Button variant="outline-secondary" type="button" onClick={ ( ) => openForgetUsPage( ) } > Forgot Password? </Button>
                    <Button variant="outline-info" type="button" onClick={ ( ) => clear( ) }>Clear</Button>
                </ButtonGroup>
                
            </Form>

            < ServerErrorMsg 
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
    )
}

export default UserLogin;