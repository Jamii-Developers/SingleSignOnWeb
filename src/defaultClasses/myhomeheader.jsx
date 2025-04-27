import '../sass/myhomeindexheader.sass';
import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Navbar, Nav, Container, NavbarBrand, Button } from 'react-bootstrap';
import {
    FaHome, FaUsers, FaCog, FaFileAlt, FaInfoCircle, FaSignOutAlt, FaBars, FaUserFriends,
    FaCommentAlt, FaLock, FaUserCog, FaTrash, FaFolder, FaUserPlus, FaUserSlash, FaPhoneAlt, FaEnvelope
} from 'react-icons/fa';
import Servererrormsg from '../frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from '../frequentlyUsedModals/serversuccessmsg';
import JsonNetworkAdapter from '../configs/networkadapter';
import constants from "../utils/constants";
import conn from "../configs/conn";

const Header = () => {
    const [cookies, setCookie] = useCookies("userSession");
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => setCollapsed(prev => !prev);

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

    useEffect(() => { CheckIfCookieExists(); }, []);

    function CheckIfCookieExists() {
        if (!cookies.userSession) {
            navigate("/");
        }
    }

    async function DestroyCookie() {
        let userKey = cookies.userSession.USER_KEY;
        let deviceKey = cookies.userSession.DEVICE_KEY;
        let sessionKey = cookies.userSession.SESSION_KEY;

        var logoffJson = { userKey, deviceKey, sessionKey };
        let headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.USER_LOGOFF };

        const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, logoffJson, { headers: headers })
            .then((response) => response)
            .catch((error) => error);

        if (result.status !== 200) {
            setServerErrorResponse(prevState => ({ ...prevState, serverErrorCode: result.status }));
            setServerErrorResponse(prevState => ({ ...prevState, serverErrorSubject: result.statusText }));
            setServerErrorResponse(prevState => ({ ...prevState, serverErrorMessage: result.message }));
            setServerErrorResponse(prevState => ({ ...prevState, errServMsgShow: true }));
            return;
        }

        if (constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE === result.data.ERROR_MSG_TYPE) {
            setServerErrorResponse(prevState => ({ ...prevState, serverErrorCode: result.data.ERROR_FIELD_CODE }));
            setServerErrorResponse(prevState => ({ ...prevState, serverErrorSubject: result.data.ERROR_FIELD_SUBJECT }));
            setServerErrorResponse(prevState => ({ ...prevState, serverErrorMessage: result.data.ERROR_FIELD_MESSAGE }));
            setServerErrorResponse(prevState => ({ ...prevState, errServMsgShow: true }));
            await new Promise(r => setTimeout(r, 3000));
        }

        if (constants.SUCCESS_MESSAGE.TYPE_LOGOFF === result.data.MSG_TYPE) {
            setServerSuccessResponse(prevState => ({ ...prevState, ui_subject: result.data.UI_SUBJECT }));
            setServerSuccessResponse(prevState => ({ ...prevState, ui_message: result.data.UI_MESSAGE }));
            setServerSuccessResponse(prevState => ({ ...prevState, succServMsgShow: true }));
            await new Promise(r => setTimeout(r, 3000));
        }

        setCookie("userSession", null, { path: "/", maxAge: -999999 });
        localStorage.removeItem('cachedUserData');
        navigate("/");
    }

    return (
        <div id="MyHomeHeaderPage">
            {/* Navbar Component */}
            <Navbar sticky="top" className="custom-navbar">
                <Container>
                    {/* Navbar Brand */}
                    <NavbarBrand className="brand-text">
                        {collapsed ? 'JX' : 'JamiiX'}
                    </NavbarBrand>

                    {/* Toggle Button for Mobile */}
                    <Button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded={collapsed ? "true" : "false"}
                        aria-label="Toggle navigation"
                        onClick={toggleSidebar}
                    >
                        <FaBars />
                    </Button>

                    {/* Navbar Items */}
                    <Navbar.Collapse id="navbarNav">
                        <Nav className="ms-auto">
                            <Nav.Item>
                                <Link to="/myhome/dashboard" className="nav-link">
                                    <FaHome /> Home
                                </Link>
                            </Nav.Item>

                            {/* Social Menu */}
                            <Nav.Item className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" id="navbarSocialDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <FaUserFriends /> Social
                                </Link>
                                <ul className="dropdown-menu" aria-labelledby="navbarSocialDropdown">
                                    <li><Link className="dropdown-item" to="/myhome/social/friends"><FaUserFriends /> Friends</Link></li>
                                    <li><Link className="dropdown-item" to="/myhome/social/followers"><FaUserPlus /> Followers</Link></li>
                                    <li><Link className="dropdown-item" to="/myhome/social/blockedlist"><FaUserSlash /> Blocked List</Link></li>
                                </ul>
                            </Nav.Item>

                            {/* File Management Menu */}
                            <Nav.Item className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to="#" id="navbarFileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <FaFolder /> File Management
                                </Link>
                                <ul className="dropdown-menu" aria-labelledby="navbarFileDropdown">
                                    <li><Link className="dropdown-item" to="/myhome/filemanagement/currentfiles"><FaFileAlt /> Current Files</Link></li>
                                    <li><Link className="dropdown-item" to="/myhome/filemanagement/recyclebin"><FaTrash /> Recycle Bin</Link></li>
                                </ul>
                            </Nav.Item>

                            {/* Settings Menu */}
                            <Nav.Item className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to="/myhome/settings/" id="navbarSettingsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <FaCog /> Settings
                                </Link>
                                <ul className="dropdown-menu" aria-labelledby="navbarSettingsDropdown">
                                    <li><Link className="dropdown-item" to="/myhome/settings/profile"><FaUserCog /> Profile</Link></li>
                                    <li><Link className="dropdown-item" to="/myhome/settings/permissions"><FaLock /> Permissions</Link></li>
                                </ul>
                            </Nav.Item>

                            {/* Contact Us Menu */}
                            <Nav.Item className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to="#" id="navbarContactDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <FaPhoneAlt /> Contact Us
                                </Link>
                                <ul className="dropdown-menu" aria-labelledby="navbarContactDropdown">
                                    <li><Link className="dropdown-item" to="/myhome/clientcommunication/reviewus"><FaCommentAlt /> Review Us</Link></li>
                                    <li><Link className="dropdown-item" to="/myhome/clientcommunication/contactsupport"><FaEnvelope /> Contact Support</Link></li>
                                </ul>
                            </Nav.Item>

                            <Nav.Item>
                                <Link to="/myhome/aboutus" className="nav-link">
                                    <FaInfoCircle /> About Us
                                </Link>
                            </Nav.Item>

                            <Nav.Item>
                                <a className="nav-link" href="#" onClick={DestroyCookie}>
                                    <FaSignOutAlt /> Log Out
                                </a>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Error and Success Messages */}
            <Servererrormsg
                open={serverErrorResponse.errServMsgShow}
                onClose={() => setServerErrorResponse(prevState => ({ ...prevState, errServMsgShow: false }))}
                errorcode={serverErrorResponse.serverErrorCode}
                errorsubject={serverErrorResponse.serverErrorSubject}
                errormessage={serverErrorResponse.serverErrorMessage}
            />
            <ServerSuccessMsg
                open={serverSuccessResponse.succServMsgShow}
                onClose={() => setServerSuccessResponse(prevState => ({ ...prevState, succServMsgShow: false }))}
                ui_subject={serverSuccessResponse.ui_subject}
                ui_message={serverSuccessResponse.ui_message}
            />

            {/* Main Content */}
            <div id="MainContent">
                <Outlet />
            </div>
        </div>
    );
};

export default Header;
