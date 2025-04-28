import '../sass/indexheader.sass';
import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Offcanvas } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [cookies] = useCookies('userSession');
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    useEffect(() => {
        CheckIfCookieExists();
    }, [cookies]);

    function CheckIfCookieExists() {
        if (cookies.userSession) {
            navigate('/myhome/dashboard');
        }
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    return (
        <div id="IndexHeaderPage">
            <Navbar
                sticky="top"
                className="custom-navbar"
                expand="lg"
            >
                <Container>
                    <Navbar.Brand className="brand-text">JamiiX</Navbar.Brand>
                    <Navbar.Toggle 
                        aria-controls="basic-navbar-nav" 
                        className="navbar-toggler"
                        onClick={handleShow}
                    />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Nav>
                            <Nav.Link 
                                id="loginbutton" 
                                className="button_inactive"
                                onClick={handleClose}
                            >
                                <Link to="/" className="jamiibuttonlink">
                                    Login
                                </Link>
                            </Nav.Link>
                            <Nav.Link 
                                id="createnewuserbutton" 
                                className="button_inactive"
                                onClick={handleClose}
                            >
                                <Link to="/signup" className="jamiibuttonlink">
                                    Sign Up
                                </Link>
                            </Nav.Link>
                            <Nav.Link 
                                id="aboutusbutton" 
                                className="button_inactive"
                                onClick={handleClose}
                            >
                                <Link to="/aboutus" className="jamiibuttonlink">
                                    About Us
                                </Link>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Mobile Offcanvas Menu */}
            <Offcanvas show={show} onHide={handleClose} placement="start" className="mobile-menu">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column">
                        <Nav.Link 
                            id="loginbutton" 
                            className="button_inactive"
                            onClick={handleClose}
                        >
                            <Link to="/" className="jamiibuttonlink">
                                Login
                            </Link>
                        </Nav.Link>
                        <Nav.Link 
                            id="createnewuserbutton" 
                            className="button_inactive"
                            onClick={handleClose}
                        >
                            <Link to="/signup" className="jamiibuttonlink">
                                Sign Up
                            </Link>
                        </Nav.Link>
                        <Nav.Link 
                            id="aboutusbutton" 
                            className="button_inactive"
                            onClick={handleClose}
                        >
                            <Link to="/aboutus" className="jamiibuttonlink">
                                About Us
                            </Link>
                        </Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>

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
