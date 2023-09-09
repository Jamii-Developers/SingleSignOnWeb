import './sass/createnewuser.sass'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const CreateNewUser = ( props ) => {


    function clear( ){
        document.getElementById("createnewuserform").reset() 
    }

    function signUp( ){

    }

    return (
          <div id = "CreateNewUserPage">
                <Form id = "createnewuserform">
                    <h1>Single Sign-On Sign Up</h1>

                    <FloatingLabel label="Email address" className="mb-3">
                        <Form.Control id="email" type="email" placeholder="name@example.com" />
                    </FloatingLabel>

                    <FloatingLabel controlId="username" label="Username" className="mb-3">
                        <Form.Control type="text" placeholder="jamiiadmin" />
                    </FloatingLabel>

                    <FloatingLabel controlId="password" label="Password" className="mb-3">
                        <Form.Control type="password" placeholder="password"/>
                    </FloatingLabel>

                    <FloatingLabel controlId="retypedpassword" label="Re-type your password" className="mb-3">
                        <Form.Control type="password" placeholder="password"/>
                    </FloatingLabel>

                    <ButtonGroup size="md" className="mb-2">
                        <Button variant="outline-primary" type="button" onClick={ ( ) => signUp( )}>Sign Up</Button>
                        <Button variant="outline-info" type="button" onClick={ ( ) => clear( ) }>Clear</Button>
                    </ButtonGroup>
                </Form>
           
          </div>
    )
}

export default CreateNewUser