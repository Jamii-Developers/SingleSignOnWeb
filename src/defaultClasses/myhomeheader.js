import '../sass/indexheader.sass';

import React from 'react';

import Navbar  from 'react-bootstrap/esm/Navbar';
import Container  from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { NavbarBrand }from 'react-bootstrap'
import { Outlet, Link } from "react-router-dom";



const Header = ( props ) => {
	
	function AboutUsButton( ){
		return(
			<Nav.Link id="aboutusbutton"  ><Link to="/aboutus" class="jamiibuttonlink">About Us</Link></Nav.Link>
		)
	}

	function ContactUsButton( ){
		return(
			<Nav.Link id="contactusbutton"  ><Link to="/contactus" class="jamiibuttonlink">Contact Us</Link></Nav.Link>
		)
	}


    return(
		<div id = "MyHomeHeaderPage" >
			< Navbar  bg="primary" data-bs-theme="dark" sticky="top">
				<Container>
					<NavbarBrand>Home</NavbarBrand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Nav className="me-auto">
						< AboutUsButton />
						< ContactUsButton />
					</Nav>
				</Container>
			</ Navbar >
			<Outlet />
		</div>
    )
}



export default Header