import '../sass/myhomeindexheader.sass';
import '../sass/sidebar.sass';
import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Navbar, Nav, Container, Collapse, NavDropdown, Form, InputGroup, Badge } from 'react-bootstrap';
import {
    FaHome, FaCog, FaFileAlt, FaInfoCircle, FaSignOutAlt, FaUserFriends,
    FaCommentAlt, FaLock, FaUserCog, FaTrash, FaFolder, FaUserPlus, FaUserSlash, FaPhoneAlt, FaEnvelope,
    FaChevronDown, FaChevronUp, FaBell
} from 'react-icons/fa';
import Requests from '../myHomeComponents/SocialComponents/requests';

import JsonNetworkAdapter from '../configs/networkadapter';
import constants from "../utils/constants";
import conn from "../configs/conn";

// Security utility functions
const validateSession = (cookies) => {
    if (!cookies.userSession) return false;
    const { USER_KEY, DEVICE_KEY, SESSION_KEY } = cookies.userSession;
    return !!(USER_KEY && DEVICE_KEY && SESSION_KEY);
};

const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/[<>]/g, '');
};

const generateCSRFToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const myHomeHeader = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["userSession", "csrfToken"]);
    const navigate = useNavigate();
    const [showRequests, setShowRequests] = useState(false);
    const [totalRequests, setTotalRequests] = useState(0);
   
    // Security state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState(null);

    // Session management
    useEffect(() => {
        const checkSession = async () => {
            if (!validateSession(cookies)) {
                handleSessionExpired();
                return;
            }

            try {
                let userKey = cookies.userSession.USER_KEY;
                let deviceKey = cookies.userSession.DEVICE_KEY;
                let sessionKey = cookies.userSession.SESSION_KEY;

                var validateSessionJson = { userKey, deviceKey, sessionKey };
                var headers = {
                    ...conn.CONTENT_TYPE.CONTENT_JSON,
                    ...conn.SERVICE_HEADERS.VALIDATE_SESSION,
                };

                const response = await JsonNetworkAdapter.post(conn.URL.USER_URL, validateSessionJson, { headers: headers });

                if (response.status !== 200) {
                    handleSessionExpired();
                    return;
                }

                setIsAuthenticated(true);
                resetSessionTimeout();
            } catch (error) {
                handleSessionExpired();
            }
        };

        checkSession();
        return () => {
            if (sessionTimeout) clearTimeout(sessionTimeout);
        };
    }, [cookies.userSession]);

    const resetSessionTimeout = () => {
        if (sessionTimeout) clearTimeout(sessionTimeout);
        const timeout = setTimeout(() => {
            handleSessionExpired();
        }, 30 * 60 * 1000); // 30 minutes
        setSessionTimeout(timeout);
    };

    const handleSessionExpired = () => {
        setIsAuthenticated(false);
        removeCookie("userSession", { path: "/" });
        removeCookie("csrfToken", { path: "/" });
        localStorage.removeItem('cachedUserData');
        navigate("/", { replace: true });
    };

    // Initialize CSRF token
    useEffect(() => {
        if (!cookies.csrfToken) {
            const token = generateCSRFToken();
            setCookie("csrfToken", token, {
                path: "/",
                secure: true,
                sameSite: "strict",
                maxAge: 3600 // 1 hour
            });
        }
    }, []);

    async function DestroyCookie() {
        if (!validateSession(cookies)) {
            handleSessionExpired();
            return;
        }

        let userKey = cookies.userSession.USER_KEY;
        let deviceKey = cookies.userSession.DEVICE_KEY;
        let sessionKey = cookies.userSession.SESSION_KEY;

        var logoffJson = { userKey, deviceKey, sessionKey };
        let headers = {
            ...conn.CONTENT_TYPE.CONTENT_JSON,
            ...conn.SERVICE_HEADERS.USER_LOGOFF,
            'X-CSRF-Token': cookies.csrfToken
        };

        try {
            const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, logoffJson, { headers: headers });

            if (result.status !== 200) {
                setServerErrorResponse(prevState => ({
                    ...prevState,
                    serverErrorCode: result.status,
                    serverErrorSubject: result.statusText,
                    serverErrorMessage: sanitizeInput(result.message),
                    errServMsgShow: true
                }));
                return;
            }

            if (constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE === result.data.ERROR_MSG_TYPE) {
                setServerErrorResponse(prevState => ({
                    ...prevState,
                    serverErrorCode: result.data.ERROR_FIELD_CODE,
                    serverErrorSubject: result.data.ERROR_FIELD_SUBJECT,
                    serverErrorMessage: sanitizeInput(result.data.ERROR_FIELD_MESSAGE),
                    errServMsgShow: true
                }));
                await new Promise(r => setTimeout(r, 3000));
            }

            if (constants.SUCCESS_MESSAGE.TYPE_LOGOFF === result.data.MSG_TYPE) {
                setServerSuccessResponse(prevState => ({
                    ...prevState,
                    ui_subject: sanitizeInput(result.data.UI_SUBJECT),
                    ui_message: sanitizeInput(result.data.UI_MESSAGE),
                    succServMsgShow: true
                }));
                await new Promise(r => setTimeout(r, 3000));
            }

            handleSessionExpired();
        } catch (error) {
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "Error",
                serverErrorSubject: "Logout Failed",
                serverErrorMessage: "Unable to log out. Please try again.",
                errServMsgShow: true
            }));
        }
    }

    // Protected route wrapper
    const ProtectedRoute = ({ children }) => {
        if (!isAuthenticated) {
            navigate("/", { replace: true });
            return null;
        }
        return children;
    };

    const NavLink = ({ to, icon, children, onClick }) => (
        <Link to={to} className="nav-link" onClick={onClick}>
            {icon} {sanitizeInput(children)}
        </Link>
    );

    const DropdownItem = ({ to, icon, children, onClick }) => (
        <Link className="dropdown-item" to={to} onClick={onClick}>
            {icon} {sanitizeInput(children)}
        </Link>
    );

    const MobileDropdown = ({ title, icon, children, dropdownKey }) => {
        const isOpen = openDropdowns[dropdownKey];
        return (
            <div className="mobile-dropdown">
                <div 
                    className="mobile-dropdown-header"
                    onClick={() => toggleDropdown(dropdownKey)}
                >
                    {icon} {sanitizeInput(title)}
                    {isOpen ? <FaChevronUp className="ms-auto" /> : <FaChevronDown className="ms-auto" />}
                </div>
                <Collapse in={isOpen}>
                    <div className="mobile-dropdown-content">
                        {children}
                    </div>
                </Collapse>
            </div>
        );
    };

    // Remove the useEffect for dropdown initialization
    useEffect(() => {
        // Initialize all dropdowns
        const dropdowns = document.querySelectorAll('.dropdown-toggle');
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', (e) => {
                e.preventDefault();
                const dropdownMenu = dropdown.nextElementSibling;
                if (dropdownMenu) {
                    dropdownMenu.classList.toggle('show');
                }
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.matches('.dropdown-toggle')) {
                const dropdowns = document.querySelectorAll('.dropdown-menu.show');
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
            }
        });
    }, []);

    return (
        <ProtectedRoute>
            <div id="MyHomeHeaderPage">
                <Navbar expand="lg" className="main-navbar">
                    <Container fluid>
                        <Navbar.Brand as={Link} to="/myhome/dashboard">JamiiX</Navbar.Brand>
                        <Form className="d-flex mx-auto">
                            <InputGroup>
                                <Form.Control
                                    type="search"
                                    placeholder="Search..."
                                    className="me-2"
                                    aria-label="Search"
                                />
                                <InputGroup.Text>
                                    <i className="bi bi-search"></i>
                                </InputGroup.Text>
                            </InputGroup>
                        </Form>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/myhome/dashboard">
                                    <FaHome className="me-1" /> Home
                                </Nav.Link>

                                <NavDropdown 
                                    title={<><FaUserFriends className="me-1" /> Social</>} 
                                    id="social-nav-dropdown"
                                >
                                    <NavDropdown.Item as={Link} to="/myhome/social/friends">
                                        <FaUserFriends className="me-1" /> Friends
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/myhome/social/followers">
                                        <FaUserPlus className="me-1" /> Followers
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/myhome/social/blockedlist">
                                        <FaUserSlash className="me-1" /> Blocked List
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={() => setShowRequests(true)}>
                                        <FaBell className="me-1" /> Requests
                                        {totalRequests > 0 && (
                                            <Badge bg="primary" className="ms-2">
                                                {totalRequests}
                                            </Badge>
                                        )}
                                    </NavDropdown.Item>
                                </NavDropdown>

                                <NavDropdown 
                                    title={<><FaFolder className="me-1" /> File Management</>} 
                                    id="file-nav-dropdown"
                                >
                                    <NavDropdown.Item as={Link} to="/myhome/filemanagement/currentfiles">
                                        <FaFileAlt className="me-1" /> Current Files
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/myhome/filemanagement/recyclebin">
                                        <FaTrash className="me-1" /> Recycle Bin
                                    </NavDropdown.Item>
                                </NavDropdown>

                                <NavDropdown 
                                    title={<><FaCog className="me-1" /> Settings</>} 
                                    id="settings-nav-dropdown"
                                >
                                    <NavDropdown.Item as={Link} to="/myhome/settings/profile">
                                        <FaUserCog className="me-1" /> Profile
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/myhome/settings/permissions">
                                        <FaLock className="me-1" /> Permissions
                                    </NavDropdown.Item>
                                </NavDropdown>

                                <NavDropdown 
                                    title={<><FaPhoneAlt className="me-1" /> Help</>} 
                                    id="help-nav-dropdown"
                                >
                                    <NavDropdown.Item as={Link} to="/myhome/clientcommunication/reviewus">
                                        <FaCommentAlt className="me-1" /> Review Us
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/myhome/clientcommunication/contactsupport">
                                        <FaEnvelope className="me-1" /> Contact Support
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/myhome/aboutus">
                                        <FaInfoCircle className="me-1" /> About Us
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                            <Nav>
                                <Nav.Link onClick={DestroyCookie}>
                                    <FaSignOutAlt className="me-1" /> Logout
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <div className="main-content">
                    <Container fluid>
                        <Outlet />
                    </Container>
                </div>

                <Requests 
                    show={showRequests} 
                    handleClose={() => setShowRequests(false)} 
                />
            </div>
        </ProtectedRoute>
    );
};

export default myHomeHeader;
