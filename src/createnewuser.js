import './sass/createnewuser.sass'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const CreateNewUser = ( ) => {
    return (
          <div id = "CreateNewUserPage">
                <Form>
                    <h1>Single Sign-On Sign Up</h1>

                    <Form.Group className="mb-3" controlId="emailGroup">
                        <Form.Label> Email address </Form.Label>
                        <Form.Control type="email" placeholder="Enter your Email Address" />
                        <Form.Text className="text-muted">Your email address won't be shared</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="usernameGroup">
                        <Form.Label> Username </Form.Label>
                        <Form.Control type="Text" placeholder="Enter your username" />
                        <Form.Text className="text-muted">Your username should be unique</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="PasswordGroup">
                        <Form.Label> Password </Form.Label>
                        <Form.Control type="password" placeholder="Enter your password" />
                        <Form.Text className="text-muted">Please Keep your password private</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="RetypedpasswordGroup">
                        <Form.Label> Retype your password </Form.Label>
                        <Form.Control type="password" placeholder="Please retype your password" />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Sign Up
                    </Button>
                </Form>
           
          </div>
    )
}

export default CreateNewUser