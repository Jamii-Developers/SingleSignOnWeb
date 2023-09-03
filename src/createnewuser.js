import './sass/createnewuser.sass'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const CreateNewUser = ( ) => {
    return (
          <div id = "CreateNewUserPage">
                <Form>
                    <h1>Single Sign-On Sign Up</h1>

                    <FloatingLabel controlId="email" label="Email address" className="mb-3">
                        <Form.Control type="email" placeholder="name@example.com" />
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
                        <Button variant="primary" type="submit">Sign Up</Button>
                        <Button variant="clear" type="submit">Clear</Button>
                    </ButtonGroup>
                </Form>
           
          </div>
    )
}

export default CreateNewUser