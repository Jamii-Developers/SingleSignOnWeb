import './sass/createnewuser.sass';
import ServerErrorMsg from './frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from './frequentlyUsedModals/serversuccessmsg';
import JsonNetworkAdapter from './configs/networkadapter';

import React from 'react';
import { useState } from 'react'
import { useNavigate } from "react-router-dom";


import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Spinner from 'react-bootstrap/Spinner';
import Alert from '@mui/material/Alert';
import Collapse from 'react-bootstrap/Collapse';
import { uniqueSort } from 'jquery';


const CreateNewUser = ( props ) => {


    const mailformat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const specialChars =/[`!@#$%^&*()_\-+=[\]{};':"|,.<>/?~ ]/;

    const navigate = useNavigate( );

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
  	})

  const[ pageFields, setPageFields ] = useState({
        email : "",
        username : "",
        password : "",
		retypedpassword : ""
  })

    
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

    const [createNewUserButtonSpinner, setCreateNewUserButtonSpinner ] = useState( false );


    function clear( ){
        document.getElementById("createnewuserform").reset( ) 
        setPageFields( prevState => { return { ...prevState , email : "" } } );
        setPageFields( prevState => { return { ...prevState , username : "" } } );
        setPageFields( prevState => { return { ...prevState , password : "" } } );
        setPageFields( prevState => { return { ...prevState , retypedpassword : "" } } );
    }

    async function signUp( ){

		setPageFields( prevState => { return { ...prevState , email : pageFields.email.toLowerCase( )} } )
		setPageFields( prevState => { return { ...prevState , username : pageFields.username.toLowerCase( )} } )

        if( pageFields.email === "" ){
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : "Generated at CreateNewUserJS"} } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : "Email Input Error!"   } } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : "No email address has been provided."} } )
			setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
            return;
        }

        if( !pageFields.email.match( mailformat ) ){
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : "Generated at CreateNewUserJS"} } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : "Email Input Error!"   } } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : "This is not a valid Email address. Please input the format 'user@jamii.com'."} } )
			setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
            return;
        }

        if( pageFields.username === "" ){
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : "Generated at CreateNewUserJS"} } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : "Username Error!"   } } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : "No username has been provided"} } )
			setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
            return;
        }

        if( pageFields.username.length < 5 ){
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : "Generated at CreateNewUserJS"} } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : "Username Error!"   } } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : "Your username cannot be less than 5 characters"} } )
			setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
            return;
        }
        if( pageFields.username.match( specialChars ) ){
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : "Generated at CreateNewUserJS"} } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : "Username Error!"   } } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : "Your username cannot contain any special characters"} } )
			setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
            return;
        }

        if( pageFields.password === "" ){
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : "Generated at CreateNewUserJS"} } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : "Password Input Error!"    } } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : "No password address has been provided"} } )
			setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
            return;
        }

        if( pageFields.password.length < 8 ){
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : "Generated at CreateNewUserJS"} } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : "Password Input Error!"    } } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : "Your password cannot be less than 8 characters" } } )
			setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
            return;
        }

        if( pageFields.retypedpassword === "" ){
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : "Generated at CreateNewUserJS"} } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : "Retyped Password Input!"    } } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : "No email address has been provided" } } )
			setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
            return;
        }

        if( pageFields.password !== pageFields.retypedpassword ){
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : "Generated at CreateNewUserJS"} } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : "Password Error:"   } } )
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : "The passwords do not match" } } )
			setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
            return;
        }

		let emailaddress = pageFields.email;
		let username = pageFields.username;
		let password = pageFields.password;
        var createNewUserJson = { 
            emailaddress,
            username,
            password };

        var createNewUserUrl = process.env.REACT_APP_SINGLE_SIGNON_URL+'createnewuser';
        setCreateNewUserButtonSpinner( true )
        
        const result = await JsonNetworkAdapter.post( createNewUserUrl, createNewUserJson )
        .then((response) =>{ return response.data });

        setCreateNewUserButtonSpinner( false );

        if( result.status === 400 ){
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : result.status } } )
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : result.statusText  } } )
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : "There is an error with your connection" } } )
            setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
            return;
        }
        
        var error_message_type = process.env.REACT_APP_RESPONSE_TYPE_ERROR_MESSAGE
		if( error_message_type === result.MSGTYPE ){
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : result.ERROR_FIELD_CODE } } )
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : result.ERROR_FIELD_SUBJECT  } } )
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : result.ERROR_FIELD_MESSAGE } } )
            setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
            return;
		}
        
        console.log( result );
        var succ_message_type = process.env.REACT_APP_RESPONSE_TYPE_CREATE_NEW_USER
		if( succ_message_type === result.MSGTYPE ){ 

				setServerSuccessResponse( prevState => { return { ...prevState , ui_subject : result.UI_SUBJECT } } )
				setServerSuccessResponse( prevState => { return { ...prevState , ui_message : result.UI_MESSAGE } } )
				setServerSuccessResponse( prevState => { return { ...prevState , succServMsgShow: true } } );
				document.getElementById("createnewuserform").reset( );
				clear( );
                await new Promise(r => setTimeout(r, 2000));
                navigate("/");

		}
        setCreateNewUserButtonSpinner( false );
    }
    
    function CheckEmail( e ){
        if( e === "" ){
            setErrorData( prevState => { return { ...prevState ,emailErrorMessage : "Email address is empty" } } );
            setErrorData( prevState => { return { ...prevState ,emailErrorTrigger : true } } );
            return;
        }

        if( !e.match( mailformat ) ){
            setErrorData( prevState => { return { ...prevState ,emailErrorMessage : "Email format should be [****]@[***].[***]" } } );
            setErrorData( prevState => { return { ...prevState ,emailErrorTrigger : true } } );
            return;
        }
        
        setErrorData( prevState => { return { ...prevState ,emailErrorTrigger : false } } );
        
    }

    function CheckUsername( u ){

        if( uniqueSort === "" ){
            setErrorData( prevState => { return { ...prevState ,usernameErrorMessage : "Username is empty" } } );
            setErrorData( prevState => { return { ...prevState ,usernameErrorTrigger : true } } );
            return;
        }

        if( u.match(specialChars ) ){
            setErrorData( prevState => { return { ...prevState ,usernameErrorMessage : "Your username cannot contain any special characters" } } );
            setErrorData( prevState => { return { ...prevState ,usernameErrorTrigger : true } } );
            return;
        }

        if( u.length < 5  ){
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

        if( e.length < 8 ){
            setErrorData( prevState => { return { ...prevState ,passwordErrorMessage : "The password cannot have less than 8 characters!" } } );
            setErrorData( prevState => { return { ...prevState ,passwordErrorTrigger : true } } );
            return;
        }
        
        setErrorData( prevState => { return { ...prevState , passwordErrorTrigger : false } } );
    }

    function checkRetypedPassword( e ){

        if( e !== pageFields.password ){
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

    function ShowUsernameError( ){
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
                        <Form.Control id="email" type="email" placeholder="name@example.com" onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , email : e.target.value } } ) } onChange={ ( e ) => CheckEmail( e.target.value ) } />
                    </FloatingLabel>

                    < ShowEmailMessageError />

                    <FloatingLabel label="Username" className="mb-3">
                        <Form.Control id="username"  type="text" placeholder="jamiiadmin" onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , username : e.target.value } } ) }  onChange={ ( e ) => CheckUsername( e.target.value ) }  />
                    </FloatingLabel>

                    <ShowUsernameError />

                    <FloatingLabel  label="Password" className="mb-3">
                        <Form.Control id = "password" type="password" placeholder="password" onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , password : e.target.value } } ) }  onChange={ ( e ) => checkPassword( e.target.value ) }/>
                    </FloatingLabel>

                    <ShowPasswordError/>

                    <FloatingLabel label="Re-type your password" className="mb-3">
                        <Form.Control id="retypedpassword" type="password" placeholder="password" onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , retypedpassword : e.target.value } } ) } onChange = { ( e ) => checkRetypedPassword( e.target.value  ) }/>
                    </FloatingLabel>

                    <ShowRetypedMessageError />

                    <ButtonGroup size="md" className="mb-2">
                        <Button variant="outline-primary" type="button" onClick={ ( ) => signUp( ) }>
                            {createNewUserButtonSpinner && <Spinner as="span"animation="grow"size="sm" role="status" aria-hidden="false"/>}
                            Sign Up
                            </Button>
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

export default CreateNewUser