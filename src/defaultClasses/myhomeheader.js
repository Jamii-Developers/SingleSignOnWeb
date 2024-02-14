import '../sass/indexheader.sass';

import React from 'react';

import Navbar  from 'react-bootstrap/esm/Navbar';
import Container  from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { NavbarBrand }from 'react-bootstrap'
import { Outlet, Link } from "react-router-dom";
import { Cookies, useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";



const Header = ( props ) => {

	const [ cookies, userSessionCookie, removeCookie ] = useCookies( "userSession" );
  	const navigate = useNavigate( );

	useEffect( ( ) => { CheckIfCoockieExists( )});
    function CheckIfCoockieExists() {
        if( ! cookies.userSession   ){
            navigate("/");
        } 
    }
	
	function AboutUsButton( ){
		return(
			<Nav.Link id="aboutusbutton"  ><Link to="/myhome/aboutus" class="jamiibuttonlink">About Us</Link></Nav.Link>
		)
	}

	function ContactUsButton( ){
		return(
			<Nav.Link id="contactusbutton"  ><Link to="/myhome/contactus" class="jamiibuttonlink">Contact Us</Link></Nav.Link>
		)
	}

	function LogOutButton( ){
		return(
			<Nav.Link id="logoutbutton"  ><Link onClick={ ( ) => DestroyCookie ( )} class="jamiibuttonlink">Log out</Link></Nav.Link>
		)
	}

	function DestroyCookie( ){
		removeCookie( "userSession" );
		navigate("/");
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
						< LogOutButton />
					</Nav>
				</Container>
			</ Navbar >
			<Outlet />
		</div>
    )
}



export default Header