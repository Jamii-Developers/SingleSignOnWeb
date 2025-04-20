import '../sass/myhomeindexheader.sass';
import ServerErrorMsg from '../frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from '../frequentlyUsedModals/serversuccessmsg'
import JsonNetworkAdapter from '../configs/networkadapter';
import {
	FaHome,
	FaUsers,
	FaCog,
	FaFileAlt,
	FaInfoCircle,
	FaSignOutAlt,
	FaBars,
	FaTimes,
	FaUserFriends, FaCommentAlt, FaLock, FaUserCog, FaTrash, FaFolder, FaUserPlus, FaUserSlash
} from 'react-icons/fa';


import React from 'react';

import { Outlet, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect , useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import conn from "../configs/conn";

const Header = ( ) => {

	const [ cookies, setCookie ] = useCookies( "userSession" );
  	const navigate = useNavigate( );
	const [collapsed, setCollapsed] = useState(false);

	const toggleSidebar = () => {
		setCollapsed(prev => !prev);
	};

	const[ serverSuccessResponse, setServerSuccessResponse ] = useState({
        ui_subject : "",
        ui_message : "",
        succServMsgShow: false
  	});

	  const[ serverErrorResponse , setServerErrorResponse ] = useState({
        serverErrorCode : "",
        serverErrorSubject: "",
        serverErrorMessage: "",
        errServMsgShow : false
  	});

	useEffect( ( ) => { CheckIfCoockieExists( ) } );
    function CheckIfCoockieExists() {
        if( !cookies.userSession   ){
            navigate("/");
        } 
    }

	async function DestroyCookie( ){

		let userKey = cookies.userSession.USER_KEY;
		let deviceKey = cookies.userSession.DEVICE_KEY;
		let sessionKey = cookies.userSession.SESSION_KEY;
    
		var logoffJson = {
			userKey,
			deviceKey,
			sessionKey
		}

		let headers = { ...conn.CONTENT_TYPE.CONTENT_JSON , ...conn.SERVICE_HEADERS.USER_LOGOFF};
        const result = await JsonNetworkAdapter.post( conn.URL.USER_URL, logoffJson, { headers:headers } )
        	.then((response) =>{ return response.data })
			.catch((error) => { return error;});


		if( result.status === 404 ){
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : result.status } } )
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : result.statusText  } } )
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : result.message } } )
            setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
            return;
        }

		var error_message_type = process.env.REACT_APP_RESPONSE_TYPE_ERROR_MESSAGE
        if( error_message_type === result.ERROR_MSG_TYPE ){
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : result.ERROR_FIELD_CODE } } )
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : result.ERROR_FIELD_SUBJECT  } } )
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : result.ERROR_FIELD_MESSAGE } } )
            setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
			await new Promise(r => setTimeout(r, 3000));
        }

		var succ_message_type = process.env.REACT_APP_RESPONSE_TYPE_LOGOFF
        if( succ_message_type === result.MSG_TYPE ){
            setServerSuccessResponse( prevState => { return { ...prevState , ui_subject : result.UI_SUBJECT } } )
            setServerSuccessResponse( prevState => { return { ...prevState , ui_message : result.UI_MESSAGE } } )
            setServerSuccessResponse( prevState => { return { ...prevState , succServMsgShow: true } } );
			await new Promise(r => setTimeout(r, 3000));
        }

		setCookie( "userSession", null,  {path: "/", maxAge: -999999 } );
		localStorage.removeItem('cachedUserData');
		navigate("/");
	}


    return(
		<div id="MyHomeHeaderPage">
			<div id="SidebarContent">
				<Sidebar
					collapsed={collapsed}
					data-bs-theme="dark"
					bg="primary"
				>
					<div id="SidebarMenuHeader" style={{ paddingLeft: collapsed ? '0.5rem' : '1rem' }}>
						{collapsed ? 'JX' : 'JamiiX'}
					</div>

					<Menu>
						<MenuItem icon={collapsed ? <FaBars /> : <FaTimes />} onClick={toggleSidebar}>{!collapsed && 'Menu'}</MenuItem>
						<MenuItem icon={<FaHome />} component={<Link to="/myhome/dashboard" />}>{!collapsed && 'Home'}</MenuItem>

						{/*Social Menu*/}
						<SubMenu icon={<FaUserFriends  />} label = {!collapsed && 'Social'}  >
							<MenuItem icon={<FaUserFriends />} component={<Link to="/myhome/social/friends" />} collapsed={collapsed} >{!collapsed && 'Friends'}</MenuItem>
							<MenuItem icon={<FaUserPlus />} component={<Link to="/myhome/social/followers" />}>{!collapsed && 'Followers'}</MenuItem>
							<MenuItem icon={<FaUserSlash />} component={<Link to="/myhome/social/blockedlist" />}>{!collapsed && 'Blocked List'}</MenuItem>
						</SubMenu>

						{/*File Management Menu*/}
						<SubMenu icon={<FaFolder  />} label = {!collapsed && 'File Management'}>
							<MenuItem icon={<FaFileAlt />} component={<Link to="/myhome/filemanagement/currentfiles" />}>{!collapsed && 'Current Files'}</MenuItem>
							<MenuItem icon={<FaTrash />} component={<Link to="/myhome/filemanagement/recyclebin" />}>{!collapsed && 'Recycle Bin'}</MenuItem>
						</SubMenu>

						{/*Settings Menu*/}
						<SubMenu icon={<FaCog />} label = {!collapsed && 'Settings'}>
							<MenuItem icon={<FaUserCog />} component={<Link to="/myhome/settings/profile" />}>{!collapsed && 'Profile'}</MenuItem>
							<MenuItem icon={<FaLock />} component={<Link to="/myhome/settings/permissions" />}>{!collapsed && 'Profile'}</MenuItem>
						</SubMenu>


						<MenuItem icon={<FaInfoCircle />} component={<Link to="/myhome/aboutus" />}>{!collapsed && 'About Us'}</MenuItem>
						<MenuItem icon={<FaCommentAlt />} component={<Link to="/myhome/reviewus" />}>{!collapsed && 'Review Us'}</MenuItem>
						<MenuItem icon={<FaSignOutAlt />} onClick={() => DestroyCookie()}>{!collapsed && 'Log Out'}</MenuItem>
					</Menu>
				</Sidebar>
			</div>

			< ServerErrorMsg
				open={serverErrorResponse.errServMsgShow}
				onClose={() => setServerErrorResponse(prevState => {
					return {...prevState, errServMsgShow: false}
				})}
				errorcode={serverErrorResponse.serverErrorCode}
				errorsubject={serverErrorResponse.serverErrorSubject}
				errormessage={serverErrorResponse.serverErrorMessage}
			/>

			< ServerSuccessMsg
				open={serverSuccessResponse.succServMsgShow}
				onClose={() => setServerSuccessResponse(prevState => {
					return {...prevState, succServMsgShow: false}
				})}
				ui_subject={serverSuccessResponse.ui_subject}
				ui_message={serverSuccessResponse.ui_message}
			/>

			<div id="MainContent">
				<Outlet/>
			</div>
		</div>
	)
}


export default Header