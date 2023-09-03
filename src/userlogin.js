import './sass/userlogin.sass';
import ForgetPassword from './forgetpassword'

import React from 'react';
import { createRoot } from 'react-dom/client';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


const UserLogin = ( ) => {
    return (
        <div id = "UserLoginPage"> 
            <Form>

                <h1 className='h1_defaults'>Single Sign-On Login</h1>

                <FloatingLabel controlId="logincredential" label="Email address or Username" className="mb-3">
                    <Form.Control type="text" placeholder="name@example.com or jamiidev30" />
                </FloatingLabel>

                <FloatingLabel controlId="password" label="Password" className="mb-3">
                    <Form.Control type="password" placeholder="password"/>
                </FloatingLabel>

                <Form.Check type="switch" id="custom-switch" label="Remember me on this device" className="mb-3"/>

                <ButtonGroup size="md" className="mb-3">
                    <Button variant="primary" type="submit">Login</Button>
                    <Button variant="secondary" type="submit" onClick={ ( ) => openForgetUsPage( )}>Forgot Password?</Button>
                </ButtonGroup>
                
            </Form>
        </div>
    )
}

export default UserLogin


const openForgetUsPage = ( ) => {
    
    const main_body_container = document.getElementById( 'main_body' )
    const main_body = createRoot( main_body_container )
    main_body.render(< ForgetPassword />)
	
}