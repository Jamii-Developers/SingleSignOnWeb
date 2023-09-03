import './sass/forgetpassword.sass';

import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const ForgetPassword = ( ) => {
    return (
        <div id = "ForgetPasswordPage">
            <Form>
                    <h1> Forgot your password ?</h1>

                    <FloatingLabel controlId="email" label="Email address" className="mb-3">
                        <Form.Control type="email" placeholder="name@example.com" />
                    </FloatingLabel>

                    <FloatingLabel controlId="username" label="Username" className="mb-3">
                        <Form.Control type="text" placeholder="jamiiadmin" />
                    </FloatingLabel>

                    <ButtonGroup size="md" className="mb-2">
                        <Button variant="primary" type="submit">Send</Button>
                        <Button variant="secondary" type="submit">Clear</Button>
                    </ButtonGroup>
            </Form>
        </div>
    )
}

export default ForgetPassword