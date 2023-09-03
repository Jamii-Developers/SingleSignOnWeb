import './sass/userlogin.sass';
import ForgetPassword from './forgetpassword'

import React from 'react';
import { useState } from 'react'
import { createRoot } from 'react-dom/client';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


const UserLogin = ( ) => {

    const [ loginCredential, setLoginCredential ] = useState("");
    const [ loginPassword, setLoginPassword ] = useState("");
    const [ rememberLogin, setRememberLogin ] = useState( false );

    return (
        <div id = "UserLoginPage"> 
            <Form>

                <h1 className='h1_defaults'>Single Sign-On Login</h1>

                <FloatingLabel controlId="logincredential" label="Email address or Username" className="mb-3">
                    <Form.Control type="text" placeholder="user@jamii.com or jamiidev30" onChange={ (e) => setLoginCredential(e.target.value) } />
                </FloatingLabel>

                <FloatingLabel controlId="loginpassword" label="Password" className="mb-3">
                    <Form.Control type="loginpassword" placeholder="Password" onChange={ (e) => setLoginPassword(e.target.value) } />
                </FloatingLabel>

                <Form.Check type="switch" id="custom-switch" label="Remember me on this device" className="mb-3" onChange={ (e) => setRememberLogin( e.target.checked ) }/>

                <ButtonGroup size="md" className="mb-3">
                    <Button variant="primary" type="button" onClick={ ( ) => sendUserLogin( loginCredential , loginPassword, rememberLogin ) }>Login</Button>
                    <Button variant="secondary" type="button" onClick={ ( ) => openForgetUsPage( )}>Forgot Password?</Button>
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

async function sendUserLogin( loginCredential, loginPassword, rememberLogin ) {

    var loginJson = { loginCredential,loginPassword };
    var loginData = await JSON.stringify( loginJson );
    
    var userLoginUrl = process.env.REACT_APP_SINGLE_SIGNON_URL+'userlogin';

    const response = await fetch(userLoginUrl, {
      method: 'POST',
      body: loginData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    console.log(result);
} 