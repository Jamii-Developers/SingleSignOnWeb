import React from "react";
import '../../sass/social.sass'

import Navbar  from 'react-bootstrap/esm/Navbar';
import Container  from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { NavbarBrand }from 'react-bootstrap'
import { useCookies } from "react-cookie";
import { Outlet, Link, useMatch } from "react-router-dom";
  
const SocialHeader = ( props ) => {

  const [ cookies ] = useCookies( "userSession" );
  const matchFriends = useMatch("/myhome/social/friends");
  const matchFollowers = useMatch("/myhome/social/followers");
  const matchBlockedList = useMatch("/myhome/social/blockedlist");

  return (
    <div id = "SocialContent">
      < div id = "SocialNavBar">
        < Navbar bg="primary" data-bs-theme="dark" sticky="top" className="bg-body-primary">
              <Container>
                <NavbarBrand>
                  <Link to="/myhome/social" class="jamiibuttonlink" >Social</Link>
                </NavbarBrand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Nav className="me-auto">
                  <Nav.Link as="div">
                    <Link to="/myhome/social/friends"  className={ matchFriends ? "active" : "in-active"}>Friends</Link>
                  </Nav.Link>
                  <Nav.Link as="div">
                    <Link to="/myhome/social/followers"  className={ matchFollowers ? "active" : "in-active"} >Followers</Link>
                  </Nav.Link>
                  <Nav.Link as="div">
                    <Link to="/myhome/social/blockedlist"  className={ matchBlockedList ? "active" : "in-active"}  >Blocked List</Link>
                  </Nav.Link>
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
  
export default SocialHeader;