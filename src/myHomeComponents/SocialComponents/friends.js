import React from "react";

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Spinner from 'react-bootstrap/Spinner';

import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

import BlankProfilePic from '../../img/blankprofile.png'

const Friends = ( ) => {

	const [ cookies ] = useCookies( "userSession" );
	const [ data, setData ] = useState(null);
	const [ loginButtonSpinner, setLoginButtonSpinner ] = useState( false );
	const secretKey = cookies.userSession.USER_KEY;
	const sessionKey = cookies.userSession.SESSION_KEY;

	return (
			<div id="FriendsContent">
				<h1> Friends </h1>
				<Card style={{ width: '10rem' }}>
					<Card.Img variant="top" src={BlankProfilePic} alt="Card image" />
					<Card.Body>
						<Card.Title>Card Title</Card.Title>
						<Button variant="primary">View Friend</Button>
					</Card.Body>
				</Card>
			</div>
	);
};

export default Friends;