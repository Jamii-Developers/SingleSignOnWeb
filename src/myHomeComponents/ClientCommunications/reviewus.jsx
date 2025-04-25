import JsonNetworkAdapter from "../../configs/networkadapter";
import '../../sass/clientcommunication.sass';
import Servererrormsg from '../../frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from '../../frequentlyUsedModals/serversuccessmsg';

import React from 'react';
import { useState } from "react";


import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Alert from '@mui/material/Alert';
import Collapse from 'react-bootstrap/Collapse';
import Spinner from 'react-bootstrap/Spinner';
import conn from "../../configs/conn";
import {useCookies} from "react-cookie";


const Reviewus = ( ) => {

      const [ cookies ] = useCookies( "userSession" );

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
            email : cookies.userSession.EMAIL_ADDRESS,
            username : cookies.userSession.USERNAME,
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
            document.getElementById("ReviewUs").reset( )
            setPageFields( prevState => { return { ...prevState , thoughts : "" } } );
      }

      // function PageUnderDevelopmentNotice(  ){
      //       return(
      //           <Alert variant="filled" severity="info" className='mb-3' >Page under development</Alert>
      //       );
      // }

      function ShowThoughtsError( ){
            return( 
                  <Collapse in ={ errordata.thoughtsErrorTrigger }>
                      <Alert variant="filled" severity="warning" className='mb-3' >{ errordata.thoughtsErrorMessage }</Alert>   
                  </Collapse>                    
              );
      }

      function CheckThoughts( thoughts ){

            if( thoughts === "" ){
                  setErrorData( prevState => { return { ...prevState , thoughtsErrorMessage : "Please share your thoughts as this is blank currently" } } );
                  setErrorData( prevState => { return { ...prevState , thoughtsErrorTrigger : true } } );
                  return;
            }

            if( pageFields.thoughts.length <  5  ){
                  setErrorData( prevState => { return { ...prevState , thoughtsErrorMessage : "Please enter more than 5 characters." } } );
                  setErrorData( prevState => { return { ...prevState , thoughtsErrorTrigger : true } } );
                  return;
            }

            setErrorData( prevState => { return { ...prevState , thoughtsErrorTrigger : false } } );
      }

      async function submitThoughts( ){

            if( pageFields.thoughts === ""  ){
                  setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : "Generated at ContactUsJS" } } )
                  setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : "Thought Input Error!" } } )
                  setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : "Your thoughts are empty, please share your thoughts" } } )
                  setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
                  return;
            }

            if( pageFields.thoughts.length <  5  ){
                  setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : "Generated at ContactUsJS" } } )
                  setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : "Thought Input Error!" } } )
                  setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : "Your thoughts are empty, please share your thoughts" } } )
                  setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
                  return;
            }

            let userKey = cookies.userSession.USER_KEY;
            let deviceKey = cookies.userSession.DEVICE_KEY;
            let sessionKey = cookies.userSession.SESSION_KEY;
            let emailaddress = cookies.userSession.EMAIL_ADDRESS;
            let username = cookies.userSession.USERNAME;
            let client_thoughts = pageFields.thoughts;

            let contactUsJSON = {
                  userKey,
                  deviceKey,
                  sessionKey,
                  emailaddress,
                  username,
                  client_thoughts,
            }

            setSubmitThoughtsButtonSpinner( true );

            const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON , ...conn.SERVICE_HEADERS.REVIEW_US };
            const result = await JsonNetworkAdapter.post( conn.URL.USER_URL, contactUsJSON, { headers : headers } )
                .then((response) =>{ return response.data })
                .catch((error) => { return error;});
            
            setSubmitThoughtsButtonSpinner( false );

            if( result.status === 404 ){
                  setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : result.status } } )
                  setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : result.statusText  } } )
                  setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : result.message } } )
                  setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
                  return;
            }

            var error_message_type = process.env.REACT_APP_RESPONSE_TYPE_ERROR_MESSAGE
            if( error_message_type === result.ERROR_MSG_TYPE ){
                  setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : result.ERROR_FIELD_CODE } } )
                  setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : result.ERROR_FIELD_SUBJECT  } } )
                  setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : result.ERROR_FIELD_MESSAGE } } )
                  setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
                  return;
            }

            var succ_message_type = process.env.REACT_APP_RESPONSE_TYPE_CONTACTUS
            if( succ_message_type === result.MSG_TYPE ){
                  setServerSuccessResponse( prevState => { return { ...prevState , ui_subject : result.UI_SUBJECT } } )
                  setServerSuccessResponse( prevState => { return { ...prevState , ui_message : result.UI_MESSAGE } } )
                  setServerSuccessResponse( prevState => { return { ...prevState , succServMsgShow: true } } );
                  clear( );
            }
      }

      return (
            <div id = "ReviewUsContent">

                  <Form id = "ReviewUs" >

                        <h1>Review Us</h1>
                        <p>At Jamii developers as we aim to improve and grow our solutions we appreciate any feedback in form of complements or complaints provided to us.</p>

                        <FloatingLabel label = "Email Address" className="mb-2">
                              <Form.Control  id = "email" type="text" value={ cookies.userSession.EMAIL_ADDRESS } disabled/>
                        </FloatingLabel>

                        <FloatingLabel label = "Username" className="mb-3">
                              <Form.Control  id = "username" type="text" value={ cookies.userSession.USERNAME } disabled/>
                        </FloatingLabel>

                        <FloatingLabel label="Leave your thoughts here" className="mb-3" >
                              <Form.Control id = "thoughts" as="textarea" placeholder="Leave your thoughts here" style={ { height: '100px' } }
                              onInput={(e) => setPageFields( prevState => { return { ...prevState , thoughts : e.target.value } } ) }
                              onChange={(e) => CheckThoughts( e.target.value ) }/>
                        </FloatingLabel>
                        <ShowThoughtsError />

                        <ButtonGroup size="md" className="mb-2">
                              <Button variant="outline-primary" type="button" onClick={ ( )=> submitThoughts( ) } >
                              { submitThoughtsButtonSpinner && <Spinner as="span"animation="grow"size="sm" role="status" aria-hidden="false"/>}Send
                              </Button>
                              <Button variant="outline-info" type="button" onClick={ ( )=>clear( ) }>Clear</Button>
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
      )
}
  
export default Reviewus