import './sass/createnewuser.sass';
import ServerErrorMsg from './frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from './frequentlyUsedModals/serversuccessmsg';
import UserLogin from './userlogin';

import React from 'react';
import { useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Spinner from 'react-bootstrap/Spinner';
import Alert from '@mui/material/Alert';
import Collapse from 'react-bootstrap/Collapse';


const CreateNewUser = ( props ) => {

    const [serverErrorCode, setServerErrorCode ] = useState("");
    const [serverErrorSubject, setServerErrorSubject ] = useState("");
    const [serverErrorMessage, setServerErrorMessage ] = useState("");
    const [errServMsgShow, setErrServMsgShow ] = useState(false);

    const [ui_subject, setUi_subject ] = useState("");
    const [ui_message, setUi_message ] = useState("");
    const [succServMsgShow, setSuccServMsgShow ] = useState(false);

    const [ emailaddress , setEmailAddress] = useState( "" );
    const [ username , setUsername ] = useState( "" );
    const [ password , setPassword ] = useState( "" );
    const [ retypedpassword , setRetypedPassword ] = useState( "" );

    const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;
    const specialChars =/[`!@#$%^&*()_\-+=[\]{};':"|,.<>/?~ ]/;

    
    const [errordata , setErrorData ] = useState({
        emailErrorTrigger : false,
        emailErrorMessage : "",
        usernameErrorTrigger : false,
        usernameErrorMessage : "",
        passwordErrorTrigger : false,
        passwordErrorMessage : "",
        retypedPasswordErrorTrigger : false,
        retypedPasswordErrorMessage : ""

    });

    const [loginButtonSpinner, setLoginButtonSpinner ] = useState( false );


    function clear( ){
        document.getElementById("createnewuserform").reset( ) 
    }

    async function signUp( ){
        setEmailAddress( emailaddress.toLowerCase( ) );
        setUsername( username.toLowerCase( ) );

        if( emailaddress === "" ){
            setServerErrorCode( "Generated at CreateNewUserJS" );
            setServerErrorSubject( "Email Input Error!" );
            setServerErrorMessage( "No email address has been provided")
            setErrServMsgShow(true);
            return;
        }

        if( !emailaddress.match( mailformat ) ){
            setServerErrorCode( "Generated at CreateNewUserJS" );
            setServerErrorSubject( "Email Input Error!" );
            setServerErrorMessage( "This is not a valid Email address. Please input the format 'user@jamii.com' ")
            setErrServMsgShow(true);
            return;
        }

        if( username === "" ){
            setServerErrorCode( "Generated at CreateNewUserJS" );
            setServerErrorSubject( "Username Error!" );
            setServerErrorMessage( "No username has been provided")
            setErrServMsgShow(true);
            return;
        }

        if( username.length < 5 ){
            setServerErrorCode( "Generated at CreateNewUserJS" );
            setServerErrorSubject( "Username Error!" );
            setServerErrorMessage( "Your username cannot be less than 5 characters")
            setErrServMsgShow(true);
            return;
        }
        if( username.match( specialChars ) ){
            setServerErrorCode( "Generated at CreateNewUserJS" );
            setServerErrorSubject( "Username Error!" );
            setServerErrorMessage( "Your username cannot contain any special characters")
            setErrServMsgShow(true);
            return;
        }

        if( password === "" ){
            setServerErrorCode( "Generated at CreateNewUserJS" );
            setServerErrorSubject( "Password Input Error! " );
            setServerErrorMessage( "No password address has been provided")
            setErrServMsgShow(true);
            return;
        }

        if( password.length < 8 ){
            setServerErrorCode( "Generated at CreateNewUserJS" );
            setServerErrorSubject( "Password Input Error! " );
            setServerErrorMessage( "Your password cannot be less than 8 characters")
            setErrServMsgShow(true);
            return;
        }

        if( retypedpassword === "" ){
            setServerErrorCode( "Generated at CreateNewUserJS" );
            setServerErrorSubject( "Retyped Password Input!" );
            setServerErrorMessage( "No email address has been provided")
            setErrServMsgShow(true);
            return;
        }

        if( password !== retypedpassword ){
            setServerErrorCode( "Generated at CreateNewUserJS" );
            setServerErrorSubject( "Password Error:" );
            setServerErrorMessage( "The passwords do not match")
            setErrServMsgShow(true);
            return;
        }

        var createNewUserJson = { 
            emailaddress,
            username,
            password };

        var createNewUserData = JSON.stringify( createNewUserJson );

        setLoginButtonSpinner( true )
        var createNewUserUrl = process.env.REACT_APP_SINGLE_SIGNON_URL+'createnewuser';
    
        const response = await fetch( createNewUserUrl, {
          method: 'POST',
          body: createNewUserData,
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
        console.log( result.MSGTYPE )
        var succ_message_type = process.env.REACT_APP_RESPONSE_TYPE_CREATE_NEW_USER
        if( succ_message_type === result.MSGTYPE ){
            setUi_subject( result.UI_SUBJECT);
            setUi_message( result.UI_MESSAGE)
            setSuccServMsgShow(true);
            document.getElementById("createnewuserform").reset( );
            props.main_body.render( < UserLogin main_body = {props.main_body}  /> ); 
        }

        

    }

    
    function CheckEmail( email ){
        if( email === "" ){
            setErrorData( prevState => { return { ...prevState ,emailErrorMessage : "Email address is empty" } } );
            setErrorData( prevState => { return { ...prevState ,emailErrorTrigger : true } } );
            return;
        }

        if( !email.match( mailformat ) ){
            setErrorData( prevState => { return { ...prevState ,emailErrorMessage : "Email format should be [****]@[***].[***]" } } );
            setErrorData( prevState => { return { ...prevState ,emailErrorTrigger : true } } );
            return;
        }
        
        setErrorData( prevState => { return { ...prevState ,emailErrorTrigger : false } } );
        
    }

    function CheckUsername( username ){

        if( username === "" ){
            setErrorData( prevState => { return { ...prevState ,usernameErrorMessage : "Username is empty" } } );
            setErrorData( prevState => { return { ...prevState ,usernameErrorTrigger : true } } );
            return;
        }

        if( username.match(specialChars ) ){
            setErrorData( prevState => { return { ...prevState ,usernameErrorMessage : "Your username cannot contain any special characters" } } );
            setErrorData( prevState => { return { ...prevState ,usernameErrorTrigger : true } } );
            return;
        }

        if( username.length < 5  ){
            setErrorData( prevState => { return { ...prevState ,usernameErrorMessage : "Username cannot be less than 5 characters" } } );
            setErrorData( prevState => { return { ...prevState ,usernameErrorTrigger : true } } );
            return;
        }

        setErrorData( prevState => { return { ...prevState ,usernameErrorTrigger : false } } );
    }

    function checkPassword( e ){

        if( e === "" ){
            setErrorData( prevState => { return { ...prevState ,passwordErrorMessage : "Password is empty!" } } );
            setErrorData( prevState => { return { ...prevState ,passwordErrorTrigger : true } } );
            return;
        }

        if( password.length < 8 ){
            setErrorData( prevState => { return { ...prevState ,passwordErrorMessage : "The password cannot have less than 8 characters!" } } );
            setErrorData( prevState => { return { ...prevState ,passwordErrorTrigger : true } } );
            return;
        }
        
        setErrorData( prevState => { return { ...prevState , passwordErrorTrigger : false } } );
    }

    function checkRetypedPassword( e ){

        if( e !== password ){
            setErrorData( prevState => { return { ...prevState ,retypedPasswordErrorMessage : "Retyped password does not match!" } } );
            setErrorData( prevState => { return { ...prevState ,retypedPasswordErrorTrigger : true } } );
            return;
        }
        
        setErrorData( prevState => { return { ...prevState ,retypedPasswordErrorTrigger : false } } );
    }

    function ShowEmailMessageError(  ){
        return( 
            <Collapse in ={ errordata.emailErrorTrigger } >
                <Alert variant="filled" severity="warning" className='mb-3' >{ errordata.emailErrorMessage }</Alert>   
            </Collapse>                    
        );
    }

    function ShowUsernameError(  ){
        return( 
            <Collapse in ={ errordata.usernameErrorTrigger }>
                <Alert variant="filled" severity="warning" className='mb-3' >{ errordata.usernameErrorMessage }</Alert>   
            </Collapse>                    
        );
    }

    function ShowPasswordError(  ){
        return( 
            <Collapse in ={ errordata.passwordErrorTrigger }>
                <Alert variant="filled" severity="warning" className='mb-3' >{ errordata.passwordErrorMessage }</Alert>   
            </Collapse>                    
        );
    }

    function ShowRetypedMessageError(  ){
        return( 
            <Collapse in ={ errordata.retypedPasswordErrorTrigger }>
                <Alert variant="filled" severity="warning" className='mb-3' >{ errordata.retypedPasswordErrorMessage }</Alert>   
            </Collapse>                    
        );
    }

    return (
          <div id = "CreateNewUserPage">
                <Form id = "createnewuserform">
                    <h1>Single Sign-On Sign Up</h1>

                    <FloatingLabel label="Email address" className="mb-3">
                        <Form.Control id="email" type="email" placeholder="name@example.com" onInput={ ( e ) => setEmailAddress( e.target.value ) } onChange={ ( e ) => CheckEmail( e.target.value ) } />
                    </FloatingLabel>

                    < ShowEmailMessageError />

                    <FloatingLabel controlId="username" label="Username" className="mb-3">
                        <Form.Control type="text" placeholder="jamiiadmin" onInput={ ( e ) => setUsername( e.target.value  )} onChange={ ( e ) => CheckUsername( e.target.value ) }  />
                    </FloatingLabel>

                    <ShowUsernameError />

                    <FloatingLabel controlId="password" label="Password" className="mb-3">
                        <Form.Control type="password" placeholder="password" onInput={ ( e ) => setPassword( e.target.value  )} onChange={ ( e ) => checkPassword( e.target.value ) }/>
                    </FloatingLabel>

                    <ShowPasswordError/>

                    <FloatingLabel controlId="retypedpassword" label="Re-type your password" className="mb-3">
                        <Form.Control type="password" placeholder="password" onInput={ ( e ) => setRetypedPassword( e.target.value  ) } onChange = { ( e ) => checkRetypedPassword( e.target.value  ) }/>
                    </FloatingLabel>

                    <ShowRetypedMessageError />

                    <ButtonGroup size="md" className="mb-2">
                        <Button variant="outline-primary" type="button" onClick={ ( ) => signUp( ) }>
                            {loginButtonSpinner && <Spinner as="span"animation="grow"size="sm" role="status" aria-hidden="false"/>}
                            Sign Up
                            </Button>
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

export default CreateNewUser