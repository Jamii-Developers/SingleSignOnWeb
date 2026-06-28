import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Nav, Tab, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaArrowLeft, FaUserPlus, FaUserMinus, FaUser, FaEnvelope, FaBan, FaUserSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useServerResponse from '../../hooks/useServerResponse';
import useSessionCredentials from '../../hooks/useSessionCredentials';
import apiRequest from '../../utils/apiRequest';
import LoadingSpinner from '../../components/LoadingSpinner';
import conn from '../../configs/conn';
import constants from '../../utils/constants';
import ViewUserProfile from './ViewUserProfile';

const Followers = () => {
    const navigate = useNavigate();
    const { getSessionData } = useSessionCredentials();
    const { showError, showSuccess, ServerResponseModals } = useServerResponse();
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingFollow, setProcessingFollow] = useState(new Set());
    const [processingUnfollow, setProcessingUnfollow] = useState(new Set());
    const [processingRemoveFollower, setProcessingRemoveFollower] = useState(new Set());
    const [processingBlock, setProcessingBlock] = useState(new Set());
    const [selectedUserId, setSelectedUserId] = useState(null);
	const [showProfileModal, setShowProfileModal] = useState(false);

    const fetchFollows = async () => {
        try {
            const cachedData = localStorage.getItem('follows');
            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                setFollowers(parsedData.followers);
                setFollowing(parsedData.following);
                setLoading(false);
            }

            const requestData = getSessionData();

            const { success, result } = await apiRequest(
                conn.URL.JSOCIAL_URL,
                requestData,
                conn.SERVICE_HEADERS.GET_FOLLOW_LIST,
                { showError }
            );

            if (success) {
                const formattedUsers = result.data.results.map(user => ({
                    id: user.userKey,
                    username: user.username,
                    firstName: user.firstname === 'N/A' ? '' : user.firstname,
                    lastName: user.lastname === 'N/A' ? '' : user.lastname,
                    typeOfFollow: user.typeOfFollow
                }));
                const newFollowers = formattedUsers.filter(user => user.typeOfFollow === 'follower');
                const newFollowing = formattedUsers.filter(user => user.typeOfFollow === 'following');

                localStorage.setItem('follows', JSON.stringify({ followers: newFollowers, following: newFollowing }));
                setFollowers(newFollowers);
                setFollowing(newFollowing);
            } else if (!cachedData) {
                setFollowers([]);
                setFollowing([]);
            }
        } catch (error) {
            console.error('Error fetching connections:', error);
            if (!localStorage.getItem('follows')) {
                setFollowers([]);
                setFollowing([]);
            }
            showError("ERR|001", "Error", "Failed to fetch connections");
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (userId) => {
        try {
            setProcessingFollow(prev => new Set([...prev, userId]));
            const requestData = {
                ...getSessionData(),
                followKey: userId
            };

            const { success, result } = await apiRequest(
                conn.URL.JSOCIAL_URL,
                requestData,
                conn.SERVICE_HEADERS.SEND_FOLLOW_REQUEST,
                { showError, showSuccess }
            );

            if (success && result.data.followType === true) {
                setFollowing(prev => {
                    const newFollowers = prev.map(user => 
                        user.id === userId ? { ...user, isFollowing: true } : user
                    );
                    const cachedData = localStorage.getItem('follows');
                    if (cachedData) {
                        const parsedData = JSON.parse(cachedData);
                        localStorage.setItem('follows', JSON.stringify({ ...parsedData, followers: newFollowers }));
                    }
                    return newFollowers;
                });
            }
        } catch (error) {
            console.error('Error following user:', error);
            showError("ERR|001", "Error", "Failed to follow user");
        } finally {
            setProcessingFollow(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            setProcessingUnfollow(prev => new Set([...prev, userId]));
            const requestData = {
                ...getSessionData(),
                targetUserKey: userId
            };

            const { success } = await apiRequest(
                conn.URL.JSOCIAL_URL,
                requestData,
                conn.SERVICE_HEADERS.UN_FOLLOW,
                { showError, showSuccess }
            );

            if (success) {
                setFollowing(prev => {
                    const newFollowing = prev.filter(user => user.id !== userId);
                    const cachedData = localStorage.getItem('follows');
                    if (cachedData) {
                        const parsedData = JSON.parse(cachedData);
                        localStorage.setItem('follows', JSON.stringify({ ...parsedData, following: newFollowing }));
                    }
                    return newFollowing;
                });
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
            showError("ERR|001", "Error", "Failed to unfollow user");
        } finally {
            setProcessingUnfollow(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    const handleBlock = async (userId) => {
        try {
            setProcessingBlock(prev => new Set([...prev, userId]));
            const requestData = {
                ...getSessionData(),
                targetUserKey: userId
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
                        setFollowers(prev => {
                            const newFollowers = prev.filter(user => user.id !== userId);
                            const cachedData = localStorage.getItem('follows');
                            if (cachedData) {
                                const parsedData = JSON.parse(cachedData);
                                localStorage.setItem('follows', JSON.stringify({ ...parsedData, followers: newFollowers }));
                            }
                            return newFollowers;
                        });
                        setFollowing(prev => {
                            const newFollowing = prev.filter(user => user.id !== userId);
                            const cachedData = localStorage.getItem('follows');
                            if (cachedData) {
                                const parsedData = JSON.parse(cachedData);
                                localStorage.setItem('follows', JSON.stringify({ ...parsedData, following: newFollowing }));
                            }
                            return newFollowing;
                        });
                    }
                }
            );
        } catch (error) {
            console.error('Error blocking user:', error);
            showError("ERR|001", "Error", "Failed to block user");
        } finally {
            setProcessingBlock(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    const handleRemoveFollower = async (userId) => {
        try {
            setProcessingRemoveFollower(prev => new Set([...prev, userId]));
            const requestData = {
                ...getSessionData(),
                targetUserKey: userId
            };

            const { success } = await apiRequest(
                conn.URL.JSOCIAL_URL,
                requestData,
                conn.SERVICE_HEADERS.REMOVE_FOLLOWER,
                {
                    showError,
                    showSuccess,
                    successMsgType: constants.SUCCESS_MESSAGE.TYPE_REMOVE_FOLLOWER,
                    onSuccess: () => {
                        setFollowers(prev => {
                            const newFollowers = prev.filter(user => user.id !== userId);
                            const cachedData = localStorage.getItem('follows');
                            if (cachedData) {
                                const parsedData = JSON.parse(cachedData);
                                localStorage.setItem('follows', JSON.stringify({ ...parsedData, followers: newFollowers }));
                            }
                            return newFollowers;
                        });
                    }
                }
            );
        } catch (error) {
            console.error('Error removing follower:', error);
            showError("ERR|001", "Error", "Failed to remove follower");
        } finally {
            setProcessingRemoveFollower(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    const handleViewProfile = async (followerId) => {
		setSelectedUserId(followerId);
		setShowProfileModal(true);
	};

    useEffect(() => {
        fetchFollows( );
    }, []);

    const UserList = ({ users, type }) => (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {loading ? (
                <Col xs={12} className="text-center p-4">
                    <LoadingSpinner className="text-center" />
                </Col>
            ) : (
                <>
                    {users.map(user => (
                        <Col key={user.id}>
                            <div className="user-card p-3 border rounded h-100">
                                <div className="d-flex flex-column h-100">
                                    <div className="mb-3">
                                        <h6 className="mb-1">
                                            {user.firstName && user.lastName 
                                                ? `${user.firstName} ${user.lastName}`.trim()
                                                : user.username}
                                        </h6>
                                        <small className="text-muted">@{user.username}</small>
                                    </div>
                                    <div className="mt-auto">
                                        <ButtonGroup className="w-100">
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>View Profile</Tooltip>}
                                            >
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => handleViewProfile(user.id)}
                                                    disabled={processingRemoveFollower.has(user.id)}
                                                >
                                                    <FaUser />
                                                </Button>
                                            </OverlayTrigger>
                                            {type === 'followers' ? (
                                                <>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip>{user.isFollowing ? 'Unfollow' : 'Follow'}</Tooltip>}
                                                    >
                                                        <Button
                                                            variant={user.isFollowing ? "outline-secondary" : "outline-primary"}
                                                            size="sm"
                                                            onClick={() => user.isFollowing ? handleUnfollow(user.id) : handleFollow(user.id)}
                                                            disabled={processingFollow.has(user.id) || processingUnfollow.has(user.id) || processingRemoveFollower.has(user.id)}
                                                        >
                                                            {processingFollow.has(user.id) || processingUnfollow.has(user.id) ? (
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                            ) : user.isFollowing ? (
                                                                <FaUserMinus />
                                                            ) : (
                                                                <FaUserPlus />
                                                            )}
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip>Remove Follower</Tooltip>}
                                                    >
                                                        <Button
                                                            variant="outline-secondary"
                                                            size="sm"
                                                            onClick={() => handleRemoveFollower(user.id)}
                                                            disabled={processingFollow.has(user.id) || processingUnfollow.has(user.id) || processingRemoveFollower.has(user.id)}
                                                        >
                                                            {processingRemoveFollower.has(user.id) ? (
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                            ) : (
                                                                <FaUserSlash />
                                                            )}
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip>Block User</Tooltip>}
                                                    >
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleBlock(user.id)}
                                                            disabled={processingFollow.has(user.id) || processingUnfollow.has(user.id) || processingRemoveFollower.has(user.id)}
                                                        >
                                                            <FaBan />
                                                        </Button>
                                                    </OverlayTrigger>
                                                </>
                                            ) : (
                                                <>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip>Send Message</Tooltip>}
                                                    >
                                                        <Button
                                                            variant="outline-info"
                                                            size="sm"
                                                            onClick={() => navigate(`/messages/${user.id}`)}
                                                        >
                                                            <FaEnvelope />
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip>Unfollow</Tooltip>}
                                                    >
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleUnfollow(user.id)}
                                                            disabled={processingUnfollow.has(user.id)}
                                                        >
                                                            {processingUnfollow.has(user.id) ? (
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                            ) : (
                                                                <FaUserMinus />
                                                            )}
                                                        </Button>
                                                    </OverlayTrigger>
                                                </>
                                            )}
                                        </ButtonGroup>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    ))}
                    {users.length === 0 && (
                        <Col xs={12}>
                            <div className="text-center text-muted p-4 border rounded">
                                No {type} found
                            </div>
                        </Col>
                    )}
                </>
            )}
        </Row>
    );

    return (
        <Container fluid className="followers-page">
            <Row className="mb-4">
                <Col>
                    <div className="d-flex align-items-center">
                        <Button 
                            variant="link" 
                            className="back-button me-3" 
                            onClick={() => navigate(-1)}
                        >
                            <FaArrowLeft />
                        </Button>
                        <h2 className="mb-0">Follows</h2>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Tab.Container defaultActiveKey="followers">
                        <Nav variant="tabs" className="mb-3">
                            <Nav.Item>
                                <Nav.Link eventKey="followers">
                                    Followers ({followers.length})
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="following">
                                    Following ({following.length})
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <Tab.Content>
                            <Tab.Pane eventKey="followers">
                                <UserList users={followers} type="followers" />
                            </Tab.Pane>
                            <Tab.Pane eventKey="following">
                                <UserList users={following} type="following" />
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Col>
            </Row>

            <ViewUserProfile
				show={showProfileModal}
				onHide={() => setShowProfileModal(false)}
				userId={selectedUserId}
			/>

            <ServerResponseModals />
        </Container>
    );
};

export default Followers;
