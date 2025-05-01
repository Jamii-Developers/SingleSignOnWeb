import React from "react";
import { Container, Row, Col, Card, Button, ButtonGroup, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { FaUserMinus, FaEnvelope, FaUser, FaSearch, FaUserFriends } from 'react-icons/fa';
import BlankProfilePic from '../../img/blankprofile.png';
import '../sass/friends.sass';

const Friends = () => {
	const [cookies] = useCookies("userSession");
	const [friends, setFriends] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');

	const secretKey = cookies.userSession.USER_KEY;
	const sessionKey = cookies.userSession.SESSION_KEY;
	const deviceKey = cookies.userSession.DEVICE_KEY;

	// Mock data for demonstration - replace with actual API call
	useEffect(() => {
		// Simulate API call
		const mockFriends = [
			{ id: 1, username: 'john_doe', firstName: 'John', lastName: 'Doe' },
			{ id: 2, username: 'jane_smith', firstName: 'Jane', lastName: 'Smith' },
			{ id: 3, username: 'bob_wilson', firstName: 'Bob', lastName: 'Wilson' },
			{ id: 4, username: 'alice_brown', firstName: 'Alice', lastName: 'Brown' },
		];
		setFriends(mockFriends);
		setLoading(false);
	}, []);

	const handleRemoveFriend = (friendId) => {
		// Implement remove friend functionality
		console.log('Remove friend:', friendId);
	};

	const handleMessage = (friendId) => {
		// Implement message functionality
		console.log('Message friend:', friendId);
	};

	const handleViewProfile = (friendId) => {
		// Implement view profile functionality
		console.log('View profile:', friendId);
	};

	const handleSearch = () => {
		// Implement search functionality
		console.log('Searching for:', searchQuery);
	};

	const FriendCard = ({ friend }) => (
		<Card className="friend-card">
			<Card.Body>
				<div className="profile-header">
					<div className="profile-image-container">
						<img src={BlankProfilePic} alt="Profile" className="profile-image" />
						<div className="friend-badge">
							<FaUserFriends />
						</div>
					</div>
					<div className="profile-info">
						<Card.Title>
							{friend.firstName} {friend.lastName}
						</Card.Title>
						<Card.Subtitle>
							@{friend.username}
						</Card.Subtitle>
					</div>
				</div>
				<div className="profile-actions">
					<ButtonGroup className="w-100">
						<OverlayTrigger
							placement="top"
							overlay={<Tooltip>View Profile</Tooltip>}
						>
							<Button 
								variant="outline-primary" 
								size="sm"
								onClick={() => handleViewProfile(friend.id)}
							>
								<FaUser />
							</Button>
						</OverlayTrigger>
						<OverlayTrigger
							placement="top"
							overlay={<Tooltip>Message</Tooltip>}
						>
							<Button 
								variant="outline-info" 
								size="sm"
								onClick={() => handleMessage(friend.id)}
							>
								<FaEnvelope />
							</Button>
						</OverlayTrigger>
						<OverlayTrigger
							placement="top"
							overlay={<Tooltip>Remove Friend</Tooltip>}
						>
							<Button 
								variant="outline-danger" 
								size="sm"
								onClick={() => handleRemoveFriend(friend.id)}
							>
								<FaUserMinus />
							</Button>
						</OverlayTrigger>
					</ButtonGroup>
				</div>
			</Card.Body>
		</Card>
	);

	if (loading) {
		return (
			<div className="text-center p-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	return (
		<div id="FriendsContent">
			<Container fluid>
				<div className="page-header">
					<h2>Friends</h2>
					<p className="text-muted">Manage your friends list</p>
				</div>
				<div className="search-container">
					<InputGroup>
						<InputGroup.Text>
							<FaSearch />
						</InputGroup.Text>
						<Form.Control
							type="text"
							placeholder="Search friends..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
						/>
						<Button 
							variant="primary" 
							onClick={handleSearch}
						>
							Search
						</Button>
					</InputGroup>
				</div>
				
				{/* Desktop Grid View */}
				<div className="d-none d-lg-block">
					<Row xs={1} md={2} lg={3} xl={4} className="g-4">
						{friends.map((friend) => (
							<Col key={friend.id}>
								<FriendCard friend={friend} />
							</Col>
						))}
					</Row>
				</div>

				{/* Mobile List View */}
				<div className="d-lg-none">
					<div className="mobile-friends-list">
						{friends.map((friend) => (
							<div key={friend.id} className="mobile-friend-item">
								<FriendCard friend={friend} />
							</div>
						))}
					</div>
				</div>
			</Container>
		</div>
	);
};

export default Friends;