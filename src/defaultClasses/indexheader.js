import '../sass/indexheader.sass'

import React from 'react'
import { createRoot } from 'react-dom/client';

import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/esm/Navbar';

import Home from '../home'
import UserLogin from '../userlogin'
import CreateNewUser from '../createnewuser'
import AboutUs from '../aboutus'
import ContactUs from '../contactus'

function HomeButton( ){
	return(
		<Button id="home" className="col button_active" onClick={ ( ) => openPage('home')}>Home</Button>
	)
}

function LoginButton( ){
	return(
		<Button id="userlogin" className="col button_inactive" onClick={( ) => openPage('userlogin')}>Login</Button>
	)
}

function CreateNewUserButton( ){
	return(
		<Button id="createnewuser" className="col button_inactive" onClick={( ) => openPage('createnewuser')}>Sign Up</Button>
	)
}

function AboutUsButton( ){
	return(
		<Button id="aboutus" className="col button_inactive" onClick={ ( ) => openPage('aboutus')}>About Us</Button>
	)
}

function ContactUsButton( ){
	return(
		<Button id="contactus" className="col button_inactive header_button_defaults" onClick={( ) => openPage('contactus')}>Contact Us</Button>
	)
}

const Header = ( ) => {
    return(
        <React.StrictMode>
            <div >
				<Navbar > 
					< HomeButton className = "header_button_defaults"/>
					< LoginButton className = "header_button_defaults" />
					< CreateNewUserButton />
					< AboutUsButton />
					< ContactUsButton />
				</Navbar>
		    </div>
	    </React.StrictMode>
    )
}

const openPage = (page) => {
	if (page === 'home') {
		const main_body_container = document.getElementById( 'main_body' )
		const main_body = createRoot( main_body_container )
		main_body.render(< Home />)
	}

	if (page === 'userlogin') {
		const main_body_container = document.getElementById( 'main_body' )
		const main_body = createRoot( main_body_container )
		main_body.render(< UserLogin />)
	}

	if (page === 'createnewuser') {
		const main_body_container = document.getElementById( 'main_body' )
		const main_body = createRoot( main_body_container )
		main_body.render(< CreateNewUser />)
	}

	if (page === 'aboutus') {
		const main_body_container = document.getElementById( 'main_body' )
		const main_body = createRoot( main_body_container )
		main_body.render(< AboutUs />)
	}

	if (page === 'contactus') {
		const main_body_container = document.getElementById( 'main_body' )
		const main_body = createRoot( main_body_container )
		main_body.render(< ContactUs />)
	}


}

export default Header