import '../sass/indexheader.sass';

import React from 'react';

import Navbar  from 'react-bootstrap/esm/Navbar';
import Container  from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { NavbarBrand }from 'react-bootstrap'
import { Outlet, Link } from "react-router-dom";



const Header = ( props ) => {

    return(
		<div id = "IndexHeaderPage" >
			<div id="NavbarContent">
				< Navbar  bg="primary" data-bs-theme="dark" sticky="top">
					<Container>
						<NavbarBrand>Single Sign-On</NavbarBrand>
						<Navbar.Toggle aria-controls="basic-navbar-nav" />
						<Nav className="me-auto">
							<Nav.Link id="loginbutton"><Link to="/" class="jamiibuttonlink" >Login</Link></Nav.Link>
							<Nav.Link id="createnewuserbutton"><Link to="/signup" class="jamiibuttonlink" >Sign Up</Link></Nav.Link>
							<Nav.Link id="aboutusbutton"  ><Link to="/aboutus" class="jamiibuttonlink">About Us</Link></Nav.Link>
							<Nav.Link id="contactusbutton"  ><Link to="/contactus" class="jamiibuttonlink">Contact Us</Link></Nav.Link>
						</Nav>
					</Container>
				</ Navbar >
			</div>

			<div id = "MainContent" class = "container">
				<div class = "row">
					<div class = "col-xs-4">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
    )
}



export default Header;