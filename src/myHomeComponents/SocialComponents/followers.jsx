import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Container, Row, Col, Nav, Tab, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaArrowLeft, FaUserPlus, FaUserMinus, FaUser, FaEnvelope, FaBan } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import JsonNetworkAdapter from '../../configs/networkadapter';
import conn from '../../configs/conn';
import constants from '../../utils/constants';
import ServerErrorMsg from '../../frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from '../../frequentlyUsedModals/serversuccessmsg';

const Followers = () => {
    const [cookies] = useCookies("userSession");
    const navigate = useNavigate();
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingFollow, setProcessingFollow] = useState(new Set());
    const [processingUnfollow, setProcessingUnfollow] = useState(new Set());

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

    const fetchFollows = async ( ) => {
        try {
            const requestData = {
                deviceKey: cookies.userSession.DEVICE_KEY,
                userKey: cookies.userSession.USER_KEY,
                sessionKey: cookies.userSession.SESSION_KEY
            };

            const headers = { 
                ...conn.CONTENT_TYPE.CONTENT_JSON, 
                ...conn.SERVICE_HEADERS.GET_FOLLOW_LIST,
            };

            const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, requestData, { headers });
            console.log(result);
            if (result.status === 200) {
                if (constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE === result.data.ERROR_MSG_TYPE) {
                    setServerErrorResponse(prevState => ({
                        ...prevState,
                        serverErrorCode: result.data.ERROR_FIELD_CODE,
                        serverErrorSubject: result.data.ERROR_FIELD_SUBJECT,
                        serverErrorMessage: result.data.ERROR_FIELD_MESSAGE,
                        errServMsgShow: true
                    }));
                } else {
                    const formattedUsers = result.data.results.map(user => ({
                        id: user.userKey,
                        username: user.username,
                        firstName: user.firstname === 'N/A' ? '' : user.firstname,
                        lastName: user.lastname === 'N/A' ? '' : user.lastname,
                        typeOfFollow: user.typeOfFollow // This will come from the API response
                    }));
                    console.log(formattedUsers);
                    // Split the results based on typeOfFollow
                    const followers = formattedUsers.filter(user => user.typeOfFollow === 'follower');
                    const following = formattedUsers.filter(user => user.typeOfFollow === 'following');

                    setFollowers(followers);
                    setFollowing(following);
                }
            }
        } catch (error) {
            console.error('Error fetching connections:', error);
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "ERR|001",
                serverErrorSubject: "Error",
                serverErrorMessage: "Failed to fetch connections",
                errServMsgShow: true
            }));
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (userId) => {
        try {
            setProcessingFollow(prev => new Set([...prev, userId]));
            const requestData = {
                deviceKey: cookies.userSession.DEVICE_KEY,
                userKey: cookies.userSession.USER_KEY,
                sessionKey: cookies.userSession.SESSION_KEY,
                targetUserKey: userId
            };

            const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.SEND_FOLLOW_REQUEST };
            const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, requestData, { headers });

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

                setServerSuccessResponse(prevState => ({
                    ...prevState,
                    ui_subject: result.data.UI_SUBJECT,
                    ui_message: result.data.UI_MESSAGE,
                    succServMsgShow: true
                }));

                // Update the followers list to show the user is now following
                setFollowers(prev => prev.map(user => 
                    user.id === userId ? { ...user, isFollowing: true } : user
                ));
            }
        } catch (error) {
            console.error('Error following user:', error);
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "ERR|001",
                serverErrorSubject: "Error",
                serverErrorMessage: "Failed to follow user",
                errServMsgShow: true
            }));
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
                deviceKey: cookies.userSession.DEVICE_KEY,
                userKey: cookies.userSession.USER_KEY,
                sessionKey: cookies.userSession.SESSION_KEY,
                targetUserKey: userId
            };

            const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.REJECT_FOLLOW_REQUEST };
            const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, requestData, { headers });

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

                setServerSuccessResponse(prevState => ({
                    ...prevState,
                    ui_subject: result.data.UI_SUBJECT,
                    ui_message: result.data.UI_MESSAGE,
                    succServMsgShow: true
                }));

                setFollowing(prev => prev.filter(user => user.id !== userId));
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "ERR|001",
                serverErrorSubject: "Error",
                serverErrorMessage: "Failed to unfollow user",
                errServMsgShow: true
            }));
        } finally {
            setProcessingUnfollow(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    const handleBlock = (userId) => {
        // Implementation of handleBlock function
    };

    useEffect(() => {
        fetchFollows( );
    }, []);

    const UserList = ({ users, type }) => (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {loading ? (
                <Col xs={12} className="text-center p-4">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
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
                                                    onClick={() => navigate(`/profile/${user.id}`)}
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
                                                            disabled={processingFollow.has(user.id) || processingUnfollow.has(user.id)}
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
                                                        overlay={<Tooltip>Block User</Tooltip>}
                                                    >
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleBlock(user.id)}
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
    );
};

export default Followers;