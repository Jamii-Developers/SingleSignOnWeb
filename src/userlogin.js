import './sass/userlogin.sass'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'


const UserLogin = ( ) => {
    return (
        <div id = "UserLoginPage"> 
            <Form>

                <h1 className='h1_defaults'>Single Sign-On Login</h1>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label> Email address </Form.Label>
                    <Form.Control type="email" placeholder="Enter Email Address" />
                    <Form.Text className="text-muted">Your email address won't be shared</Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId='formBasicPassword'>
                    <Form.Label>Password </Form.Label>
                    <Form.Control type="password" placeholder="Enter your password" />
                    <Form.Text className='text-muted'>Keep your password private</Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Keep me logged in" />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>

            </Form>
        </div>
    )
}

export default UserLogin