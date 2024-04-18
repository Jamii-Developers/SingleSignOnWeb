import React from "react";

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import BlankProfilePic from '../../img/blankprofile.png'

const BlockedList = ( props ) => {

    return (
      <div >
        <h1>Blocked List</h1>
        <Card style={{ width: '15rem' }}>
					<Card.Img variant="top" src={BlankProfilePic} alt="Card image"/>
					<Card.Body>
						<Card.Title>Card Title</Card.Title>
						<Card.Text>
						Some quick example text to build on the card title and make up the
						bulk of the card's content.
						</Card.Text>
						<Button variant="primary">Go somewhere</Button>
					</Card.Body>
				</Card>
      </div>
    );
};

export default BlockedList;