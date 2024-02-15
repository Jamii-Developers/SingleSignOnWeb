import '../sass/indexheader.sass';
import ServerSuccessMsg from '../frequentlyUsedModals/serversuccessmsg'

import React from 'react';

import Navbar  from 'react-bootstrap/esm/Navbar';
import Container  from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { NavbarBrand }from 'react-bootstrap'
import { Outlet, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect , useState } from "react";



const Header = ( ) => {

	const [ cookies, setCookie ] = useCookies( "userSession" );
  	const navigate = useNavigate( );

	  const[ serverSuccessResponse, setServerSuccessResponse ] = useState({
        ui_subject : "",
        ui_message : "",
        succServMsgShow: false
  	});

	useEffect( ( ) => { CheckIfCoockieExists( )});
    function CheckIfCoockieExists() {
        if( !cookies.userSession   ){
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
			<Nav.Link id="logoutbutton"  ><Link onClick={ ( ) => DestroyCookie( )} class="jamiibuttonlink">Log out</Link></Nav.Link>
		)
	}

	async function DestroyCookie( ){

		setCookie( "userSession", null,  {path: "/", maxAge: -999999 } );

		setServerSuccessResponse( prevState => { return { ...prevState , ui_subject : "Success" } } )
		setServerSuccessResponse( prevState => { return { ...prevState , ui_message : "You have been logged out successfully" } } )
		setServerSuccessResponse( prevState => { return { ...prevState , succServMsgShow: true } } );

		await new Promise(r => setTimeout(r, 2000));

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

			< ServerSuccessMsg 
				open={serverSuccessResponse.succServMsgShow}  
				onClose={ ( ) => setServerSuccessResponse( prevState => { return { ...prevState , succServMsgShow : false } } ) }
				ui_subject = {serverSuccessResponse.ui_subject} 
				ui_message = {serverSuccessResponse.ui_message}                             
            />
		</div>
    )
}



export default Header