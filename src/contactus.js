import './sass/contactus.sass';
import ServerErrorMsg from './frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from './frequentlyUsedModals/serversuccessmsg';

import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Alert from '@mui/material/Alert';




const ContactUs = ( ) => {

      const [serverErrorCode, setServerErrorCode ] = useState("");
      const [serverErrorSubject, setServerErrorSubject ] = useState("");
      const [serverErrorMessage, setServerErrorMessage ] = useState("");
      const [errServMsgShow, setErrServMsgShow ] = useState(false);

      const [ui_subject, setUi_subject ] = useState("");
      const [ui_message, setUi_message ] = useState("");
      const [succServMsgShow, setSuccServMsgShow ] = useState(false);

      const [ email, setEmail ] = useState("") ;
      const [ username, setUsername ] = useState("") ;
      const [ thoughts, setThoughts ] = useState("") ;

      function PageUnderDevelopmentNotice(  ){
            return( 
                <Alert variant="filled" severity="info" className='mb-3' >Page under development</Alert>            
            );
      }

      function ShowEmailError(  ){
            return( 
                <Collapse in ={ errordata.loginCredentialErrorTrigger }>
                    <Alert variant="filled" severity="warning" className='mb-3' >{ errordata.loginCredentialErrorMessage }</Alert>   
                </Collapse>                    
            );
        }

      return (
            <div id = "ContactUsPage">

            <PageUnderDevelopmentNotice />

            <Form>
                  <h1>Contact Us</h1>

                  <p>At Jamii developers as we aim to improve and grow our solutions we appreciate any feedback in form of complements or complaints provided to us.</p>

                  <FloatingLabel controlId="email" label="Email address" className="mb-3">
                        <Form.Control id = "email" type="email" placeholder="name@example.com" />
                  </FloatingLabel>

                  <ShowEmailError />

                  <FloatingLabel controlId="username" label="Username" className="mb-3">
                        <Form.Control id = "username" type="text" placeholder="Username" />
                  </FloatingLabel>

                  <ShowUsernameError />

                  <FloatingLabel controlId="thoughts" label="Leave your thoughts here" className="mb-3" >
                        <Form.Control id = "thoughts" as="textarea" placeholder="Leave your thoughts here" style={ { height: '100px' } } />
                  </FloatingLabel>

                  <ShowThoughtsError />

                  <ButtonGroup size="md" className="mb-2">
                        <Button variant="outline-primary" type="submit">Send</Button>
                        <Button variant="outline-info" type="submit">Clear</Button>
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
  
export default ContactUs