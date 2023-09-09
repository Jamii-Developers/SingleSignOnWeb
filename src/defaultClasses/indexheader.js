import '../sass/indexheader.sass'

import React from 'react'

import Navbar  from 'react-bootstrap/esm/Navbar'
import Container  from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav';
import { NavbarBrand }from 'react-bootstrap'

import UserLogin from '../userlogin'
import CreateNewUser from '../createnewuser'
import AboutUs from '../aboutus'

const Header = ( props ) => {

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

	function openPage(page){

		if (page === 'userlogin') {
			props.main_body.render(< UserLogin main_body = {props.main_body}  />)
		}
	
		if (page === 'createnewuser') {
			props.main_body.render(< CreateNewUser main_body = {props.main_body}  />)
		}
	
		if (page === 'aboutus') {
			props.main_body.render(< AboutUs main_body = {props.main_body}  />)
		}
	
	}

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



export default Header