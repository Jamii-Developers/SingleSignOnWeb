import React from "react";

import Navbar  from 'react-bootstrap/esm/Navbar';
import Container  from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { NavbarBrand }from 'react-bootstrap'
import { useCookies } from "react-cookie";
import { Outlet, Link } from "react-router-dom";


  
const SettingsHeader = ( props ) => {

  const [ cookies ] = useCookies( "userSession" );

  return (
    <div id = "SettingsContent">
      < div id = "SettingsNavBar">
        < Navbar bg="primary" data-bs-theme="dark" sticky="top" className="bg-body-primary">
              <Container>
                <NavbarBrand><Link to="/myhome/settings" class="jamiibuttonlink" >Settings</Link></NavbarBrand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Nav className="me-auto">
                  <Nav.Link id="SettingsNavButton"><Link to="/myhome/settings/profile" class="jamiibuttonlink" >Profile</Link></Nav.Link>
                  <Nav.Link id="SettingsNavButton"><Link to="/myhome/settings/permissions" class="jamiibuttonlink" >Permissions</Link></Nav.Link>
                </Nav>
                <Navbar.Text>
                  Signed in as: <strong id = "getUsername">{cookies.userSession.USERNAME}</strong>
                </Navbar.Text>
              </Container>
        </ Navbar >
      </div>
      <div id = "MainContent">
        <Outlet/>
      </div>
    </div>
  );
};
  
export default SettingsHeader;