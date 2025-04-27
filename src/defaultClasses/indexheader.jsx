import '../sass/indexheader.sass';
import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [cookies] = useCookies('userSession');
    const navigate = useNavigate();

    // For mobile navbar toggle state
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        CheckIfCookieExists();
    }, [cookies]); // Make sure cookies are updated before running the check

    function CheckIfCookieExists() {
        if (cookies.userSession) {
            navigate('/myhome/dashboard');
        }
    }

    return (
        <div id="IndexHeaderPage">
            <div id="NavbarContent">
                <Navbar
                    sticky="top"
                    className="custom-navbar"
                    expanded={expanded} // Bind the expanded state
                    onToggle={() => setExpanded(!expanded)} // Toggle the navbar on mobile
                >
                    <Container>
                        <Navbar.Brand className="brand-text">JamiiX</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto">
                                <Nav.Link id="loginbutton" className="button_inactive">
                                    <Link to="/" className="jamiibuttonlink">
                                        Login
                                    </Link>
                                </Nav.Link>
                                <Nav.Link id="createnewuserbutton" className="button_inactive">
                                    <Link to="/signup" className="jamiibuttonlink">
                                        Sign Up
                                    </Link>
                                </Nav.Link>
                                <Nav.Link id="aboutusbutton" className="button_inactive">
                                    <Link to="/aboutus" className="jamiibuttonlink">
                                        About Us
                                    </Link>
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>

            <div id="MainContent" className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
