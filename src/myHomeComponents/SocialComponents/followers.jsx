import React from "react";
import { Container, Row, Col, Card, Button, ButtonGroup, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaUserMinus, FaBan, FaSearch, FaUserPlus } from 'react-icons/fa';
import BlankProfilePic from '../../img/blankprofile.png';
import '../sass/followers.sass';
import JsonNetworkAdapter from '../../configs/networkadapter';
import conn from '../../configs/conn';
import constants from '../../utils/constants';
import ServerErrorMsg from '../../frequentlyUsedModals/ServerErrorMsg';
import ServerSuccessMsg from '../../frequentlyUsedModals/ServerSuccessMsg';

const Followers = () => {
    const [cookies] = useCookies("userSession");
    const [followers, setFollowers] = useState([]);
    const [filteredFollowers, setFilteredFollowers] = useState([]);
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

    const fetchFollowers = async () => {
        try {
            const requestData = {
                deviceKey: cookies.userSession.DEVICE_KEY,
                userKey: cookies.userSession.USER_KEY,
                sessionKey: cookies.userSession.SESSION_KEY
            };

            const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.GET_FOLLOWER_LIST };
            const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, requestData, { headers });
            console.log('Followers Response:', result.data);

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

                if (constants.SUCCESS_MESSAGE.TYPE_GET_FOLLOW_LIST_REQUEST === result.data.MSG_TYPE) {
                    setServerSuccessResponse(prevState => ({
                        ...prevState,
                        ui_subject: result.data.UI_SUBJECT,
                        ui_message: result.data.UI_MESSAGE,
                        succServMsgShow: true   
                    }));
                }

                const formattedFollowers = result.data.results.map(follower => ({
                    id: follower.userKey,
                    username: follower.username,
                    firstName: follower.firstname === 'N/A' ? '' : follower.firstname,
                    lastName: follower.lastname === 'N/A' ? '' : follower.lastname
                }));
                setFollowers(formattedFollowers);
                setFilteredFollowers(formattedFollowers);
            } else {
                setFollowers([]);
                setFilteredFollowers([]);
            }
        } catch (error) {
            console.error('Error fetching followers:', error);
            setFollowers([]);
            setFilteredFollowers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFollowers();
    }, []);

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setFilteredFollowers(followers);
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        const filtered = followers.filter(follower => {
            const fullName = `${follower.firstName} ${follower.lastName}`.toLowerCase();
            const username = follower.username.toLowerCase();
            return fullName.includes(query) || username.includes(query);
        });
        setFilteredFollowers(filtered);
    };

    useEffect(() => {
        handleSearch();
    }, [searchQuery]);

    const handleViewProfile = (followerId) => {
        // Implement view profile functionality
        console.log('View profile:', followerId);
    };

    const handleMessage = (followerId) => {
        // Implement message functionality
        console.log('Message follower:', followerId);
    };

    const handleRemoveFollow = async (followerId) => {
        try {
            const requestData = {
                deviceKey: cookies.userSession.DEVICE_KEY,
                userKey: cookies.userSession.USER_KEY,
                sessionKey: cookies.userSession.SESSION_KEY,
                targetUserKey: followerId
            };

            const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.REJECT_FOLLOW_REQUEST };
            const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, requestData, { headers });
            console.log('Remove Follow Response:', result.data);

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

                if (constants.SUCCESS_MESSAGE.TYPE_REJECT_FOLLOW_REQUEST === result.data.MSG_TYPE) {
                    setServerSuccessResponse(prevState => ({
                        ...prevState,
                        ui_subject: result.data.UI_SUBJECT,
                        ui_message: result.data.UI_MESSAGE,
                        succServMsgShow: true
                    }));
                    // Remove the follower from the list
                    setFollowers(prev => prev.filter(f => f.id !== followerId));
                }
            }
        } catch (error) {
            console.error('Error removing follower:', error);
        }
    };

    const handleBlock = async (followerId) => {
        try {
            const requestData = {
                deviceKey: cookies.userSession.DEVICE_KEY,
                userKey: cookies.userSession.USER_KEY,
                sessionKey: cookies.userSession.SESSION_KEY,
                targetUserKey: followerId
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
                    // Remove the blocked follower from the list
                    setFollowers(prev => prev.filter(f => f.id !== followerId));
                }
            }
        } catch (error) {
            console.error('Error blocking follower:', error);
        }
    };

    const FollowerCard = ({ follower }) => (
        <Card className="follower-card">
            <Card.Body>
                <div className="profile-header">
                    <div className="profile-image-container">
                        <img src={BlankProfilePic} alt="Profile" className="profile-image" />
                        <div className="follower-badge">
                            <FaUserPlus />
                        </div>
                    </div>
                    <div className="profile-info">
                        <Card.Title>
                            {follower.firstName} {follower.lastName}
                        </Card.Title>
                        <Card.Subtitle>
                            @{follower.username}
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
                                onClick={() => handleViewProfile(follower.id)}
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
                                onClick={() => handleMessage(follower.id)}
                            >
                                <FaEnvelope />
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Remove Follow</Tooltip>}
                        >
                            <Button 
                                variant="outline-warning" 
                                size="sm"
                                onClick={() => handleRemoveFollow(follower.id)}
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
                                onClick={() => handleBlock(follower.id)}
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
        <div id="FollowersContent">
            <Container fluid>
                <Row>
                    <Col>
                        <div className="page-header">
                            <h2>Followers</h2>
                            <p className="text-muted">Manage your followers list</p>
                        </div>
                        <div className="search-container">
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Search followers..."
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
                    {filteredFollowers.map((follower) => (
                        <Col key={follower.id} xs={12} md={6} lg={4} xl={3} className="mb-4">
                            <FollowerCard follower={follower} />
                        </Col>
                    ))}
                </Row>

                {/* Mobile List View */}
                <Row className="d-lg-none">
                    <Col>
                        <div className="mobile-followers-list">
                            {filteredFollowers.map((follower) => (
                                <div key={follower.id} className="mobile-follower-item">
                                    <FollowerCard follower={follower} />
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>

                {/* Show message when no results found */}
                {!loading && filteredFollowers.length === 0 && (
                    <Row>
                        <Col className="text-center">
                            <p className="text-muted mt-4">
                                {searchQuery ? 'No followers found matching your search.' : 'No followers found.'}
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

export default Followers;