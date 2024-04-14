import React from "react";

import Navbar  from 'react-bootstrap/esm/Navbar';
import Container  from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { NavbarBrand }from 'react-bootstrap'
import { useCookies } from "react-cookie";
import { Outlet, Link } from "react-router-dom";


  
const FileManagementHeader = ( props ) => {

  const [ cookies ] = useCookies( "userSession" );

  return (
    <div id = "SocialContent">
      < div id = "SocialNavBar">
        < Navbar bg="primary" data-bs-theme="dark" sticky="top" className="bg-body-primary">
              <Container>
                <NavbarBrand><Link to="/myhome/filemanagement" class="jamiibuttonlink" >File Management</Link></NavbarBrand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Nav className="me-auto">
                  <Nav.Link id="SocialNavButton"><Link to="/myhome/filemanagement/currentfiles" class="jamiibuttonlink" >Current Files</Link></Nav.Link>
                  <Nav.Link id="SocialNavButton"><Link to="/myhome/filemanagement/recyclebin" class="jamiibuttonlink" >Recycle Bin</Link></Nav.Link>
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
  
export default FileManagementHeader;