import '../sass/myhomeindexheader.sass';

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
			<Sidebar data-bs-theme="dark" bg="primary">
				<Menu>
					<SubMenu label="Social">
						<MenuItem>Friends </MenuItem>
						<MenuItem>Followers</MenuItem>
						<MenuItem>Friend Requests</MenuItem>
						<MenuItem>Follower Requests</MenuItem>
						<MenuItem>Blocked List</MenuItem>
					</SubMenu>
					<SubMenu label="File Management">
						<MenuItem>Review Current Files </MenuItem>
						<MenuItem>Recycle bin</MenuItem>
					</SubMenu>
					<SubMenu label="Settings">
						<MenuItem>Profile</MenuItem>
						<MenuItem>Permissions</MenuItem>
					</SubMenu>
					<MenuItem component={<Link to="/myhome/aboutus"/>}>About Us</MenuItem>
					<MenuItem component={ <Link to="/myhome/contactus"/> }>Contact Us</MenuItem>
					<MenuItem onClick={ ( ) => DestroyCookie( ) }>Log Out</MenuItem>
				</Menu>
			</Sidebar>
			<Outlet />
		</div>
    )
}



export default Header