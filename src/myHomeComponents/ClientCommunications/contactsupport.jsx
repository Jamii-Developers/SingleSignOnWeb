import React from 'react';
import JsonNetworkAdapter from "../../configs/networkadapter";
import '../../sass/clientcommunication.sass';
import Servererrormsg from '../../frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from '../../frequentlyUsedModals/serversuccessmsg';

import { useState } from "react";
import { useCookies } from "react-cookie";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Alert from '@mui/material/Alert';
import Collapse from 'react-bootstrap/Collapse';
import Spinner from 'react-bootstrap/Spinner';
import conn from "../../configs/conn";
import constants from "../../utils/constants";

const Contactsupport = ( ) => {

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
            document.getElementById("ContactSupportForm").reset( )
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

            const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON , ...conn.SERVICE_HEADERS.CONTACT_SUPPORT };
            const result = await JsonNetworkAdapter.post( conn.URL.USER_URL, contactUsJSON, { headers : headers } )
                .then((response) =>{ return response })
                .catch((error) => { return error;});
            
            setSubmitThoughtsButtonSpinner( false );

            console.log( result );
            if( result.status !== 200 ){
                  setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : result.status } } )
                  setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : result.statusText  } } )
                  setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : result.message } } )
                  setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
                  return;
            }


            if( constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE === result.data.ERROR_MSG_TYPE ){
                  setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : result.data.ERROR_FIELD_CODE } } )
                  setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : result.data.ERROR_FIELD_SUBJECT  } } )
                  setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : result.data.ERROR_FIELD_MESSAGE } } )
                  setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
                  return;
            }

            if( constants.SUCCESS_MESSAGE.TYPE_CONTACTSUPPORT === result.data.MSG_TYPE ){
                  setServerSuccessResponse( prevState => { return { ...prevState , ui_subject : result.data.UI_SUBJECT } } )
                  setServerSuccessResponse( prevState => { return { ...prevState , ui_message : result.data.UI_MESSAGE } } )
                  setServerSuccessResponse( prevState => { return { ...prevState , succServMsgShow: true } } );
                  clear( );
            }
      }

      return (
            <div id = "ContactSupportContent">

                  <Form id = "ContactSupportForm" >

                        <h1>Contact Support</h1>
                        <p>If you are having issues with some functionalities at within JamiiX feel free to share your issue and we will get back to you within 24-48 hrs.</p>

                        <Form.Group label = "Email Address" className="mb-2">
                              <Form.Control  id = "email" type="text" value={ cookies.userSession.EMAIL_ADDRESS } disabled/>
                        </Form.Group>

                        <Form.Group label = "Username" className="mb-3">
                              <Form.Control  id = "username" type="text" value={ cookies.userSession.USERNAME } disabled/>
                        </Form.Group>

                        <Form.Group label="Share your issue here" className="mb-3" >
                              <Form.Control id = "thoughts" as="textarea" placeholder="Share your issue here" style={ { height: '100px' } }
                              onInput={(e) => setPageFields( prevState => { return { ...prevState , thoughts : e.target.value } } ) }
                              onChange={(e) => CheckThoughts( e.target.value ) }/>
                        </Form.Group>
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
  
export default Contactsupport