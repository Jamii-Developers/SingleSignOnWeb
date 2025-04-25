import '../sass/indexheader.sass';

import React from 'react';

import Navbar  from 'react-bootstrap/esm/Navbar';
import Container  from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { useEffect } from "react";
import { NavbarBrand }from 'react-bootstrap'
import { Outlet, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Header = ( props ) => {

	const [ cookies, ] = useCookies( "userSession" );
    const navigate = useNavigate( );

    useEffect( ( ) => { CheckIfCoockieExists( ) } );


    function CheckIfCoockieExists() {
        if( cookies.userSession  ){
            navigate("/myhome/dashboard");
        } 
    }

    return(
		<div id = "IndexHeaderPage" on={CheckIfCoockieExists}>
			<div id="NavbarContent">
				< Navbar  bg="primary" data-bs-theme="dark" sticky="top">
					<Container>
						<NavbarBrand>JamiiX</NavbarBrand>
						<Navbar.Toggle aria-controls="basic-navbar-nav" />
						<Nav className="me-auto">
							<Nav.Link id="loginbutton"><Link to="/" class="jamiibuttonlink" >Login</Link></Nav.Link>
							<Nav.Link id="createnewuserbutton"><Link to="/signup" class="jamiibuttonlink" >Sign Up</Link></Nav.Link>
							<Nav.Link id="aboutusbutton"  ><Link to="/aboutus" class="jamiibuttonlink">About Us</Link></Nav.Link>
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