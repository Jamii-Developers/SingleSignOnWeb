import '../sass/myhomeindexheader.sass';
import ServerSuccessMsg from '../frequentlyUsedModals/serversuccessmsg'

import React from 'react';

import { Outlet, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect , useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';


const Header = ( ) => {

	const [ cookies, setCookie ] = useCookies( "userSession" );
  	const navigate = useNavigate( );

	const[ serverSuccessResponse, setServerSuccessResponse ] = useState({
        ui_subject : "",
        ui_message : "",
        succServMsgShow: false
  	});

	useEffect( ( ) => { CheckIfCoockieExists( )});
    function CheckIfCoockieExists() {
        if( !cookies.userSession   ){
            navigate("/");
        } 
    }

	async function DestroyCookie( ){

		setCookie( "userSession", null,  {path: "/", maxAge: -999999 } );

		setServerSuccessResponse( prevState => { return { ...prevState , ui_subject : "Success" } } )
		setServerSuccessResponse( prevState => { return { ...prevState , ui_message : "You have been logged out successfully" } } )
		setServerSuccessResponse( prevState => { return { ...prevState , succServMsgShow: true } } );

		await new Promise(r => setTimeout(r, 2000));

		navigate("/");
	}


    return(
		<div id = "MyHomeHeaderPage" >
			<div id = "SidebarContent">
				<Sidebar data-bs-theme="dark" bg="primary">
					<Menu>
						<MenuItem component={<Link to="/myhome/dashboard"/>}>Home</MenuItem>
						<SubMenu component={<Link to="/myhome/socialdashboard"/>} label="Social">
							<MenuItem component={<Link to="/myhome/friends"/>}>Friends </MenuItem>
							<MenuItem component={<Link to="/myhome/followers"/>}>Followers</MenuItem>
							<MenuItem component={<Link to="/myhome/blockedlist"/>}>Blocked List</MenuItem>
						</SubMenu>
						<SubMenu component={<Link to="/myhome/filemanagementdashboard"/>} label="File Management">
							<MenuItem component={<Link to="/myhome/currentfiles"/>}>Review Current Files </MenuItem>
							<MenuItem component={<Link to="/myhome/recyclebin"/>}>Recycle bin</MenuItem>
						</SubMenu>
						<SubMenu component={<Link to="/myhome/settingsdashboard"/>} label="Settings">
							<MenuItem component={<Link to="/myhome/profile"/>}>Profile</MenuItem>
							<MenuItem component={<Link to="/myhome/permissions"/>}>Permissions</MenuItem>
						</SubMenu>
						<MenuItem component={<Link to="/myhome/aboutus"/>}>About Us</MenuItem>
						<MenuItem component={ <Link to="/myhome/contactus"/> }>Contact Us</MenuItem>
						<MenuItem onClick={ ( ) => DestroyCookie( ) }>Log Out</MenuItem>
					</Menu>
				</Sidebar>
			</div>

			< ServerSuccessMsg 
				open={serverSuccessResponse.succServMsgShow}  
				onClose={ ( ) => setServerSuccessResponse( prevState => { return { ...prevState , succServMsgShow : false } } ) }
				ui_subject = {serverSuccessResponse.ui_subject} 
				ui_message = {serverSuccessResponse.ui_message}                             
			/>

			<div id = "MainContent">
				<Outlet />
			</div>
		</div>
    )
}



export default Header