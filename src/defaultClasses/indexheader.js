import '../sass/indexheader.sass'

import React from 'react'
import { createRoot } from 'react-dom/client'

import Navbar  from 'react-bootstrap/esm/Navbar'
import Container  from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav';
import { NavbarBrand }from 'react-bootstrap'

import UserLogin from '../userlogin'
import CreateNewUser from '../createnewuser'
import AboutUs from '../aboutus'



function LoginButton( ){
	return(
		<Nav.Link id="loginbutton" onClick={ ( ) => openPage('userlogin')} >Login</Nav.Link>
	)
}

function CreateNewUserButton( ){
	return(
		<Nav.Link id="createnewuserbutton" onClick={ ( ) => openPage('createnewuser')}>Sign Up</Nav.Link>
	)
}

function AboutUsButton( ){
	return(
		<Nav.Link id="aboutusbutton"  onClick={ ( ) => openPage('aboutus')}>About Us</Nav.Link>
	)
}

const Header = ( ) => {
    return(
		<div id = "IndexHeaderPage" >
			< Navbar  bg="primary" data-bs-theme="dark" sticky="top"> 
				<Container>
					<NavbarBrand>Single Sign-On</NavbarBrand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Nav className="me-auto">
						< LoginButton />
						< CreateNewUserButton />
						< AboutUsButton />
					</Nav>
				</Container>
			</ Navbar >
		</div>
    )
}

const openPage = (page) => {

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

}

export default Header