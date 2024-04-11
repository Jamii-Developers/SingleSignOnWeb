import React from "react";

import Navbar  from 'react-bootstrap/esm/Navbar';
import Container  from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { NavbarBrand }from 'react-bootstrap'
import { useCookies } from "react-cookie";

  
const FriendsNavUtils = ( props ) => {

  const [ cookies ] = useCookies( "userSession" );

  // function GetUserName( ){
  //   return ()
  // }


  return (
    < Navbar bg="primary" data-bs-theme="dark" sticky="top" className="bg-body-primary">
					<Container>
						<NavbarBrand>Friends</NavbarBrand>
						<Navbar.Toggle aria-controls="basic-navbar-nav" />
						<Nav className="me-auto">
							{/* < LoginButton />
							< CreateNewUserButton />
							< AboutUsButton />
							< ContactUsButton /> */}
						</Nav>
            <Navbar.Text>
              Signed in as: <strong id = "getUsername">{cookies.userSession.USERNAME}</strong>
            </Navbar.Text>
					</Container>
    </ Navbar >
  );
};
  
export default FriendsNavUtils;