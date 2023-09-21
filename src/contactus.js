import './sass/contactus.sass';
import ServerErrorMsg from './frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from './frequentlyUsedModals/serversuccessmsg';

import { useState } from 'react';
import React from 'react';

import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Alert from '@mui/material/Alert';
import Collapse from 'react-bootstrap/Collapse';
import Spinner from 'react-bootstrap/Spinner';

const ContactUs = ( ) => {

      const mailformat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      const specialChars =/[`!@#$%^&*()_\-+=[\]{};':"|,.<>/?~ ]/;

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
            thoughts : ""
      })

      const [errordata , setErrorData ] = useState({
            emailErrorTrigger : false,
            emailErrorMessage : "",
            usernameErrorTrigger : false,
            usernameErrorMessage : "",
            thoughtsErrorTrigger : false,
            thoughtsErrorMessage : ""
      });

      const [ submitThoughtsButtonSpinner, setSubmitThoughtsButtonSpinner ] = useState( false );

      function clear( ){
            document.getElementById("contactusform").reset( ) 
      }

      function PageUnderDevelopmentNotice(  ){
            return( 
                <Alert variant="filled" severity="info" className='mb-3' >Page under development</Alert>            
            );
      }

      function ShowEmailError(  ){
            return( 
                <Collapse in ={ errordata.emailErrorTrigger }>
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

      function ShowThoughtsError( ){
            return( 
                  <Collapse in ={ errordata.thoughtsErrorTrigger }>
                      <Alert variant="filled" severity="warning" className='mb-3' >{ errordata.thoughtsErrorMessage }</Alert>   
                  </Collapse>                    
              );
      }

      function CheckEmail( email ){

            if( email === "" ){
                  setErrorData( prevState => { return { ...prevState , emailErrorMessage : "No email address has been provided" } } );
                  setErrorData( prevState => { return { ...prevState , emailErrorTrigger : true } } );
                  return;
            }

            if( !email.match( mailformat ) ){
                  setErrorData( prevState => { return { ...prevState , emailErrorMessage : "This is not a valid Email address. Please input the format 'user@jamii.com' " } } );
                  setErrorData( prevState => { return { ...prevState , emailErrorTrigger : true } } );
                  return;
            }

            setErrorData( prevState => { return { ...prevState , emailErrorTrigger : false } } );

      }

      function CheckUsername( username ){

            if( username === "" ){
                  setErrorData( prevState => { return { ...prevState , usernameErrorMessage : "No username has been provided" } } );
                  setErrorData( prevState => { return { ...prevState , usernameErrorTrigger : true } } );
                  return;
            }

            if( username.match( specialChars ) ){
                  setErrorData( prevState => { return { ...prevState , usernameErrorMessage : "Special Characters are not allowed in usernames" } } );
                  setErrorData( prevState => { return { ...prevState , usernameErrorTrigger : true } } );
                  return;
            }

            if( username.length < 5 ){
                  setErrorData( prevState => { return { ...prevState , usernameErrorMessage : "Usernames require 5 or more characters" } } );
                  setErrorData( prevState => { return { ...prevState , usernameErrorTrigger : true } } );
                  return;
            }

            setErrorData( prevState => { return { ...prevState , usernameErrorTrigger : false } } );

      }

      function CheckThoughts( thoughts ){

            if( thoughts === "" ){
                  setErrorData( prevState => { return { ...prevState , thoughtsErrorMessage : "Please share your thoughts as this is blank currently" } } );
                  setErrorData( prevState => { return { ...prevState , thoughtsErrorTrigger : true } } );
                  return;
            }

            setErrorData( prevState => { return { ...prevState , thoughtsErrorTrigger : false } } );
      }

      async function submitThoughts( ){
            
            setPageFields( prevState => { return { ...prevState , email : pageFields.email.toLowerCase( ) } } ) ;
            setPageFields( prevState => { return { ...prevState , username : pageFields.username.toLowerCase( ) } } ) ;

            if( pageFields.email === "" ){
                  setServerErrorResponse( prevState => { return { ...prevState , errorcode : "Generated at ContactUsJS" } } )
                  setServerErrorResponse( prevState => { return { ...prevState , errorsubject : "Email Input Error!" } } )
                  setServerErrorResponse( prevState => { return { ...prevState , errormessage : "The email address is empty " } } )
                  setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
                  return;
            }

            if( !pageFields.email.match( mailformat ) ){
                  setServerErrorResponse( prevState => { return { ...prevState , errorcode : "Generated at ContactUsJS" } } )
                  setServerErrorResponse( prevState => { return { ...prevState , errorsubject : "Email Input Error!" } } )
                  setServerErrorResponse( prevState => { return { ...prevState , errormessage : "This is not a valid Email address. Please input the format 'user@jamii.com' " } } )
                  setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
                  return;
            }

            setSubmitThoughtsButtonSpinner( true );
      }


      return (
            <div id = "ContactUsPage">

            <PageUnderDevelopmentNotice />

            <Form id = "contactusform" >
                  <h1>Contact Us</h1>

                  <p>At Jamii developers as we aim to improve and grow our solutions we appreciate any feedback in form of complements or complaints provided to us.</p>

                  <FloatingLabel controlId="email" label="Email address" className="mb-3">
                        <Form.Control id = "email" type="email" placeholder="name@example.com" 
                        onInput={(e) => setPageFields( prevState => { return { ...prevState , email : e.target.value } } ) }  
                        onChange={(e) => CheckEmail( e.target.value ) }/>
                  </FloatingLabel>

                  <ShowEmailError />

                  <FloatingLabel controlId="username" label="Username" className="mb-3">
                        <Form.Control id = "username" type="text" placeholder="Username" 
                        onInput={(e) => setPageFields( prevState => { return { ...prevState , usernmae : e.target.value } } ) }  
                        onChange={(e) => CheckUsername( e.target.value ) }/>
                  </FloatingLabel>

                  <ShowUsernameError />

                  <FloatingLabel controlId="thoughts" label="Leave your thoughts here" className="mb-3" >
                        <Form.Control id = "thoughts" as="textarea" placeholder="Leave your thoughts here" style={ { height: '100px' } } 
                        onInput={(e) => setPageFields( prevState => { return { ...prevState , thoughts : e.target.value } } ) }  
                        onChange={(e) => CheckThoughts( e.target.value ) }/>
                  </FloatingLabel>

                  <ShowThoughtsError />

                  <ButtonGroup size="md" className="mb-2">
                        <Button variant="outline-primary" type="button" onClick={ ( )=>submitThoughts( ) } >
                        { submitThoughtsButtonSpinner && <Spinner as="span"animation="grow"size="sm" role="status" aria-hidden="false"/>}Send
                        </Button>
                        <Button variant="outline-info" type="button" onClick={ ( )=>clear( ) }>Clear</Button>
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
  
export default ContactUs