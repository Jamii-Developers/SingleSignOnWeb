import React from "react";
import { Container, Row, Col, Card, Button, ButtonGroup, Form, InputGroup, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaUserMinus, FaBan, FaSearch, FaUserFriends } from 'react-icons/fa';
import BlankProfilePic from '../../img/blankprofile.png';
import '../sass/friends.sass';
import useServerResponse from '../../hooks/useServerResponse';
import useSessionCredentials from '../../hooks/useSessionCredentials';
import apiRequest from '../../utils/apiRequest';
import LoadingSpinner from '../../components/LoadingSpinner';
import conn from '../../configs/conn';
import constants from '../../utils/constants';
import ViewUserProfile from './ViewUserProfile';

const Friends = () => {
	const { getSessionData } = useSessionCredentials();
	const { showError, showSuccess, showNetworkError, ServerResponseModals } = useServerResponse();
	const [friends, setFriends] = useState([]);
	const [filteredFriends, setFilteredFriends] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [processingActions, setProcessingActions] = useState({
		viewProfile: new Set(),
		message: new Set(),
		removeFriend: new Set(),
		block: new Set()
	});

	const [selectedUserId, setSelectedUserId] = useState(null);
	const [showProfileModal, setShowProfileModal] = useState(false);

	const fetchFriends = async () => {
		try {
			const cachedData = localStorage.getItem('friends');
			if (cachedData) {
				const parsedData = JSON.parse(cachedData);
				setFriends(parsedData);
				setFilteredFriends(parsedData);
				setLoading(false);
			}

			const requestData = getSessionData();

			const { success, result } = await apiRequest(
				conn.URL.JSOCIAL_URL,
				requestData,
				conn.SERVICE_HEADERS.GET_FRIEND_LIST,
				{
					showError,
					showSuccess,
					successMsgType: constants.SUCCESS_MESSAGE.TYPE_GET_FRIEND_LIST_REQUEST
				}
			);

			if (success) {
				const formattedFriends = result.data.results.map(friend => ({
					id: friend.userKey,
					username: friend.username,
					name: friend.firstname === 'N/A' || friend.lastname === 'N/A' 
						? friend.username 
						: `${friend.firstname} ${friend.lastname}`.trim()
				}));

				localStorage.setItem('friends', JSON.stringify(formattedFriends));
				setFriends(formattedFriends);
				setFilteredFriends(formattedFriends);
			} else if (!cachedData) {
				setFriends([]);
				setFilteredFriends([]);
			}
		} catch (error) {
			console.error('Error fetching friends:', error);
			if (!localStorage.getItem('friends')) {
				setFriends([]);
				setFilteredFriends([]);
			}
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

	const handleViewProfile = async (friendId) => {
		setSelectedUserId(friendId);
		setShowProfileModal(true);
	};

	const handleMessage = async (friendId) => {
		try {
			setProcessingActions(prev => ({
				...prev,
				message: new Set([...prev.message, friendId])
			}));

			await new Promise(resolve => setTimeout(resolve, 1000));
		} catch (error) {
			console.error('Error messaging friend:', error);
			showError("Network Error", "Message Failed", "Unable to send message. Please try again.");
		} finally {
			setProcessingActions(prev => ({
				...prev,
				message: new Set([...prev.message].filter(id => id !== friendId))
			}));
		}
	};

	const handleRemoveFriend = async (friendId) => {
		try {
			setProcessingActions(prev => ({
				...prev,
				removeFriend: new Set([...prev.removeFriend, friendId])
			}));

			const requestData = {
				...getSessionData(),
				targetUserKey: friendId
			};

			const { success } = await apiRequest(
				conn.URL.JSOCIAL_URL,
				requestData,
				conn.SERVICE_HEADERS.UN_FRIEND,
				{
					showError,
					showSuccess,
					successMsgType: constants.SUCCESS_MESSAGE.TYPE_UN_FRIEND,
					onSuccess: () => {
						setFriends(prev => {
							const newFriends = prev.filter(f => f.id !== friendId);
							localStorage.setItem('friends', JSON.stringify(newFriends));
							return newFriends;
						});
						setFilteredFriends(prev => prev.filter(f => f.id !== friendId));
					}
				}
			);
		} catch (error) {
			console.error('Error removing friend:', error);
			showError("Network Error", "Remove Friend Failed", "Unable to remove friend. Please try again.");
		} finally {
			setProcessingActions(prev => ({
				...prev,
				removeFriend: new Set([...prev.removeFriend].filter(id => id !== friendId))
			}));
		}
	};

	const handleBlock = async (friendId) => {
		try {
			setProcessingActions(prev => ({
				...prev,
				block: new Set([...prev.block, friendId])
			}));

			const requestData = {
				...getSessionData(),
				targetUserKey: friendId
			};

			const { success } = await apiRequest(
				conn.URL.JSOCIAL_URL,
				requestData,
				conn.SERVICE_HEADERS.BLOCK_USER,
				{
					showError,
					showSuccess,
					successMsgType: constants.SUCCESS_MESSAGE.TYPE_BLOCK_USER_REQUEST,
					onSuccess: () => {
						setFriends(prev => {
							const newFriends = prev.filter(f => f.id !== friendId);
							localStorage.setItem('friends', JSON.stringify(newFriends));
							return newFriends;
						});
						setFilteredFriends(prev => prev.filter(f => f.id !== friendId));
					}
				}
			);
		} catch (error) {
			console.error('Error blocking friend:', error);
			showError("Network Error", "Block User Failed", "Unable to block user. Please try again.");
		} finally {
			setProcessingActions(prev => ({
				...prev,
				block: new Set([...prev.block].filter(id => id !== friendId))
			}));
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
							{friend.name}
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
								disabled={processingActions.viewProfile.has(friend.id) || 
									processingActions.message.has(friend.id) || 
									processingActions.removeFriend.has(friend.id) || 
									processingActions.block.has(friend.id)}
							>
								{processingActions.viewProfile.has(friend.id) ? (
									<Spinner animation="border" size="sm" />
								) : (
									<FaUser />
								)}
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
								disabled={processingActions.viewProfile.has(friend.id) || 
									processingActions.message.has(friend.id) || 
									processingActions.removeFriend.has(friend.id) || 
									processingActions.block.has(friend.id)}
							>
								{processingActions.message.has(friend.id) ? (
									<Spinner animation="border" size="sm" />
								) : (
									<FaEnvelope />
								)}
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
								disabled={processingActions.viewProfile.has(friend.id) || 
									processingActions.message.has(friend.id) || 
									processingActions.removeFriend.has(friend.id) || 
									processingActions.block.has(friend.id)}
							>
								{processingActions.removeFriend.has(friend.id) ? (
									<Spinner animation="border" size="sm" />
								) : (
									<FaUserMinus />
								)}
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
								disabled={processingActions.viewProfile.has(friend.id) || 
									processingActions.message.has(friend.id) || 
									processingActions.removeFriend.has(friend.id) || 
									processingActions.block.has(friend.id)}
							>
								{processingActions.block.has(friend.id) ? (
									<Spinner animation="border" size="sm" />
								) : (
									<FaBan />
								)}
							</Button>
						</OverlayTrigger>
					</ButtonGroup>
				</div>
			</Card.Body>
		</Card>
	);

	if (loading) {
		return <LoadingSpinner />;
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

				<ServerResponseModals />
			</Container>

			<ViewUserProfile
				show={showProfileModal}
				onHide={() => setShowProfileModal(false)}
				userId={selectedUserId}
			/>
		</div>
	);
};

export default Friends;
