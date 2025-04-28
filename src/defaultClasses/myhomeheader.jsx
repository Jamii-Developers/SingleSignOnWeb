import '../sass/myhomeindexheader.sass';
import '../sass/sidebar.sass';
import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Navbar, Nav, Container, NavbarBrand, Button, Offcanvas, Collapse, Dropdown } from 'react-bootstrap';
import {
    FaHome, FaUsers, FaCog, FaFileAlt, FaInfoCircle, FaSignOutAlt, FaBars, FaUserFriends,
    FaCommentAlt, FaLock, FaUserCog, FaTrash, FaFolder, FaUserPlus, FaUserSlash, FaPhoneAlt, FaEnvelope,
    FaChevronDown, FaChevronUp, FaTimes, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Servererrormsg from '../frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from '../frequentlyUsedModals/serversuccessmsg';
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
    const [show, setShow] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState({
        social: false,
        fileManagement: false,
        settings: false,
        help: false
    });

    // Security state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const toggleExpand = () => setExpanded(!expanded);

    const toggleDropdown = (dropdown) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [dropdown]: !prev[dropdown]
        }));
    };

    const [serverSuccessResponse, setServerSuccessResponse] = useState({
        ui_subject: "",
        ui_message: "",
        succServMsgShow: false
    });

    const [serverErrorResponse, setServerErrorResponse] = useState({
        serverErrorCode: "",
        serverErrorSubject: "",
        serverErrorMessage: "",
        errServMsgShow: false
    });

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

    // Initialize Bootstrap dropdowns
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
                {/* Mobile Toggle Button */}
                <button 
                    className="sidebar-toggle d-lg-none" 
                    onClick={handleShow}
                    aria-label="Toggle Sidebar"
                >
                    <FaBars />
                </button>

                {/* Sidebar Component */}
                <Sidebar
                    className={`sidebar ${show ? 'show' : ''} ${expanded ? 'expanded' : 'collapsed'}`}
                    collapsed={!expanded}
                    width="250px"
                    collapsedWidth="60px"
                >
                    <div className="sidebar-header">
                        <h3 className="brand-text">
                            <span className="full-text">{expanded ? 'JamiiX' : 'JX'}</span>
                        </h3>
                        <div className="header-controls">
                            <button 
                                className="close-sidebar d-lg-none" 
                                onClick={handleClose}
                                aria-label="Menu X"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>
                    <Menu>
                        <MenuItem
                            icon={expanded ? <FaChevronLeft /> : <FaChevronRight />}
                            onClick={toggleExpand}
                        >
                            {expanded ? 'Menu' : ''}
                        </MenuItem>

                        <MenuItem
                            icon={<FaHome />}
                            component={<Link to="/myhome/dashboard" onClick={handleClose} />}
                        >
                            {expanded ? 'Home' : ''}
                        </MenuItem>

                        <SubMenu
                            label="Social"
                            icon={<FaUserFriends />}
                        >
                            <MenuItem
                                icon={<FaUserFriends />}
                                component={<Link to="/myhome/social/friends" onClick={handleClose} />}
                            >
                                 Friends
                            </MenuItem>
                            <MenuItem
                                icon={<FaUserPlus />}
                                component={<Link to="/myhome/social/followers" onClick={handleClose} />}
                            >
                                Followers
                            </MenuItem>
                            <MenuItem
                                icon={<FaUserSlash />}
                                component={<Link to="/myhome/social/blockedlist" onClick={handleClose} />}
                            >
                                Blocked List
                            </MenuItem>
                        </SubMenu>

                        <SubMenu
                            label="File Management"
                            icon={<FaFolder />}
                        >
                            <MenuItem
                                icon={<FaFileAlt />}
                                component={<Link to="/myhome/filemanagement/currentfiles" onClick={handleClose} />}
                            >
                                Current Files
                            </MenuItem>
                            <MenuItem
                                icon={<FaTrash />}
                                component={<Link to="/myhome/filemanagement/recyclebin" onClick={handleClose} />}
                            >
                                Recycle Bin
                            </MenuItem>
                        </SubMenu>

                        <SubMenu
                            label="Settings"
                            icon={<FaCog />}
                        >
                            <MenuItem
                                icon={<FaUserCog />}
                                component={<Link to="/myhome/settings/profile" onClick={handleClose} />}
                            >
                                Profile
                            </MenuItem>
                            <MenuItem
                                icon={<FaLock />}
                                component={<Link to="/myhome/settings/permissions" onClick={handleClose} />}
                            >
                                Permissions
                            </MenuItem>
                        </SubMenu>

                        <SubMenu
                            label="Help"
                            icon={<FaPhoneAlt />}
                        >
                            <MenuItem
                                icon={<FaCommentAlt />}
                                component={<Link to="/myhome/clientcommunication/reviewus" onClick={handleClose} />}
                            >
                                Review Us
                            </MenuItem>
                            <MenuItem
                                icon={<FaEnvelope />}
                                component={<Link to="/myhome/clientcommunication/contactsupport" onClick={handleClose} />}
                            >
                                Contact Support
                            </MenuItem>
                            <MenuItem
                                icon={<FaInfoCircle />}
                                component={<Link to="/myhome/aboutus" onClick={handleClose} />}
                            >
                                About Us
                            </MenuItem>
                        </SubMenu>

                        <MenuItem
                            icon={<FaSignOutAlt />}
                            onClick={() => { handleClose(); DestroyCookie(); }}
                        >
                            Log Out
                        </MenuItem>
                    </Menu>
                </Sidebar>

                {/* Overlay for mobile */}
                <div className={`sidebar-overlay ${show ? 'show' : ''}`} onClick={handleClose}></div>

                {/* Main Content */}
                <div className="main-content">
                    <Outlet />
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default myHomeHeader;
