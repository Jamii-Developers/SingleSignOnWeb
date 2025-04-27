import React from "react";

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
// import Col from 'react-bootstrap/Col';
// import Form from 'react-bootstrap/Form';
// import Row from 'react-bootstrap/Row';
// import ButtonGroup from 'react-bootstrap/ButtonGroup';
// import Spinner from 'react-bootstrap/Spinner';

import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

import BlankProfilePic from '../../img/blankprofile.png'

const Friends = ( ) => {

	const [ cookies ] = useCookies( "userSession" );
	const [ data, setData ] = useState(null);
	const [ searchButtonSpinner, setSearchButtonSpinner ] = useState( false );

	const secretKey = cookies.userSession.USER_KEY;
	const sessionKey = cookies.userSession.SESSION_KEY;
    const deviceKey = cookies.userSession.DEVICE_KEY;

	return (
			<div id="FriendsContent">
				<h1 > Friends </h1>



			</div>
	);
};

export default Friends;