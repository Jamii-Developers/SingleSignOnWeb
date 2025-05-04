import React from "react";
import { Container, Row, Col, Card, Button, ButtonGroup, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaUserMinus, FaBan, FaSearch, FaUserFriends } from 'react-icons/fa';
import BlankProfilePic from '../../img/blankprofile.png';
import '../sass/friends.sass';
import JsonNetworkAdapter from '../../configs/networkadapter';
import conn from '../../configs/conn';
import constants from '../../utils/constants';
import ServerErrorMsg from '../../frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from '../../frequentlyUsedModals/serversuccessmsg';

const Friends = () => {
	const [cookies] = useCookies("userSession");
	const [friends, setFriends] = useState([]);
	const [filteredFriends, setFilteredFriends] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');

	const [serverErrorResponse, setServerErrorResponse] = useState({
		serverErrorCode: "",
		serverErrorSubject: "",
		serverErrorMessage: "",
		errServMsgShow: false
	});

	const [serverSuccessResponse, setServerSuccessResponse] = useState({
		ui_subject: "",
		ui_message: "",
		succServMsgShow: false
	});

	const fetchFriends = async () => {
		try {
			const requestData = {
				deviceKey: cookies.userSession.DEVICE_KEY,
				userKey: cookies.userSession.USER_KEY,
				sessionKey: cookies.userSession.SESSION_KEY
			};

			const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.GET_FRIEND_LIST };
			const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, requestData, { headers });
			console.log('Friends Response:', result.data);

			if (result.status === 200) {
				if (constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE === result.data.ERROR_MSG_TYPE) {
					setServerErrorResponse(prevState => ({
						...prevState,
						serverErrorCode: result.data.ERROR_FIELD_CODE,
						serverErrorSubject: result.data.ERROR_FIELD_SUBJECT,
						serverErrorMessage: result.data.ERROR_FIELD_MESSAGE,
						errServMsgShow: true
					}));
					return;
				}

				if (constants.SUCCESS_MESSAGE.TYPE_GET_FRIEND_LIST_REQUEST === result.data.MSG_TYPE) {
					setServerSuccessResponse(prevState => ({
						...prevState,
						ui_subject: result.data.UI_SUBJECT,
						ui_message: result.data.UI_MESSAGE,
						succServMsgShow: true   
					}));
				}

				const formattedFriends = result.data.results.map(friend => ({
					id: friend.userKey,
					username: friend.username,
					firstName: friend.firstname === 'N/A' ? '' : friend.firstname,
					lastName: friend.lastname === 'N/A' ? '' : friend.lastname
				}));
				setFriends(formattedFriends);
				setFilteredFriends(formattedFriends);
			} else {
				setFriends([]);
				setFilteredFriends([]);
			}
		} catch (error) {
			console.error('Error fetching friends:', error);
			setFriends([]);
			setFilteredFriends([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFriends();
	}, []);

	const handleSearch = () => {
		if (!searchQuery.trim()) {
			setFilteredFriends(friends);
			return;
		}

		const query = searchQuery.toLowerCase().trim();
		const filtered = friends.filter(friend => {
			const fullName = `${friend.firstName} ${friend.lastName}`.toLowerCase();
			const username = friend.username.toLowerCase();
			return fullName.includes(query) || username.includes(query);
		});
		setFilteredFriends(filtered);
	};

	useEffect(() => {
		handleSearch();
	}, [searchQuery]);

	const handleViewProfile = (friendId) => {
		// Implement view profile functionality
		console.log('View profile:', friendId);
	};

	const handleMessage = (friendId) => {
		// Implement message functionality
		console.log('Message friend:', friendId);
	};

	const handleRemoveFriend = async (friendId) => {
		try {
			const requestData = {
				deviceKey: cookies.userSession.DEVICE_KEY,
				userKey: cookies.userSession.USER_KEY,
				sessionKey: cookies.userSession.SESSION_KEY,
				targetUserKey: friendId
			};

			const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.REJECT_FRIEND_REQUEST };
			const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, requestData, { headers });
			console.log('Remove Friend Response:', result.data);

			if (result.status === 200) {
				if (constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE === result.data.ERROR_MSG_TYPE) {
					setServerErrorResponse(prevState => ({
						...prevState,
						serverErrorCode: result.data.ERROR_FIELD_CODE,
						serverErrorSubject: result.data.ERROR_FIELD_SUBJECT,
						serverErrorMessage: result.data.ERROR_FIELD_MESSAGE,
						errServMsgShow: true
					}));
					return;
				}

				if (constants.SUCCESS_MESSAGE.TYPE_REJECT_FRIEND_REQUEST === result.data.MSG_TYPE) {
					setServerSuccessResponse(prevState => ({
						...prevState,
						ui_subject: result.data.UI_SUBJECT,
						ui_message: result.data.UI_MESSAGE,
						succServMsgShow: true
					}));
					// Remove the friend from the list
					setFriends(prev => prev.filter(f => f.id !== friendId));
				}
			}
		} catch (error) {
			console.error('Error removing friend:', error);
		}
	};

	const handleBlock = async (friendId) => {
		try {
			const requestData = {
				deviceKey: cookies.userSession.DEVICE_KEY,
				userKey: cookies.userSession.USER_KEY,
				sessionKey: cookies.userSession.SESSION_KEY,
				targetUserKey: friendId
			};

			const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.BLOCK_USER };
			const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, requestData, { headers });
			console.log('Block Response:', result.data);

			if (result.status === 200) {
				if (constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE === result.data.ERROR_MSG_TYPE) {
					setServerErrorResponse(prevState => ({
						...prevState,
						serverErrorCode: result.data.ERROR_FIELD_CODE,
						serverErrorSubject: result.data.ERROR_FIELD_SUBJECT,
						serverErrorMessage: result.data.ERROR_FIELD_MESSAGE,
						errServMsgShow: true
					}));
					return;
				}

				if (constants.SUCCESS_MESSAGE.TYPE_BLOCK_USER === result.data.MSG_TYPE) {
					setServerSuccessResponse(prevState => ({
						...prevState,
						ui_subject: result.data.UI_SUBJECT,
						ui_message: result.data.UI_MESSAGE,
						succServMsgShow: true
					}));
					// Remove the blocked friend from the list
					setFriends(prev => prev.filter(f => f.id !== friendId));
				}
			}
		} catch (error) {
			console.error('Error blocking friend:', error);
		}
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
								variant="outline-warning" 
								size="sm"
								onClick={() => handleRemoveFriend(friend.id)}
							>
								<FaUserMinus />
							</Button>
						</OverlayTrigger>
						<OverlayTrigger
							placement="top"
							overlay={<Tooltip>Block</Tooltip>}
						>
							<Button 
								variant="outline-danger" 
								size="sm"
								onClick={() => handleBlock(friend.id)}
							>
								<FaBan />
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
				<Row>
					<Col>
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
								/>
								<Button 
									variant="primary" 
									onClick={handleSearch}
								>
									Search
								</Button>
							</InputGroup>
						</div>
					</Col>
				</Row>
				
				{/* Desktop Grid View */}
				<Row className="d-none d-lg-flex">
					{filteredFriends.map((friend) => (
						<Col key={friend.id} xs={12} md={6} lg={4} xl={3} className="mb-4">
							<FriendCard friend={friend} />
						</Col>
					))}
				</Row>

				{/* Mobile List View */}
				<Row className="d-lg-none">
					<Col>
						<div className="mobile-friends-list">
							{filteredFriends.map((friend) => (
								<div key={friend.id} className="mobile-friend-item">
									<FriendCard friend={friend} />
								</div>
							))}
						</div>
					</Col>
				</Row>

				{/* Show message when no results found */}
				{!loading && filteredFriends.length === 0 && (
					<Row>
						<Col className="text-center">
							<p className="text-muted mt-4">
								{searchQuery ? 'No friends found matching your search.' : 'No friends found.'}
							</p>
						</Col>
					</Row>
				)}

				<ServerErrorMsg
					show={serverErrorResponse.errServMsgShow}
					onClose={() => setServerErrorResponse(prevState => ({ ...prevState, errServMsgShow: false }))}
					subject={serverErrorResponse.serverErrorSubject}
					message={serverErrorResponse.serverErrorMessage}
				/>

				<ServerSuccessMsg
					show={serverSuccessResponse.succServMsgShow}
					onClose={() => setServerSuccessResponse(prevState => ({ ...prevState, succServMsgShow: false }))}
					subject={serverSuccessResponse.ui_subject}
					message={serverSuccessResponse.ui_message}
				/>
			</Container>
		</div>
	);
};

export default Friends;