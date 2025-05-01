import React from "react";
import { Container, Row, Col, Card, Button, ButtonGroup, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaUserMinus, FaBan, FaSearch, FaUserPlus } from 'react-icons/fa';
import BlankProfilePic from '../../img/blankprofile.png';
import '../sass/followers.sass';

const Followers = () => {
    const [cookies] = useCookies("userSession");
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const secretKey = cookies.userSession.USER_KEY;
    const sessionKey = cookies.userSession.SESSION_KEY;
    const deviceKey = cookies.userSession.DEVICE_KEY;

    const handleSearch = () => {
        // Implement search functionality
        console.log('Searching for:', searchQuery);
    };

    // Mock data for demonstration - replace with actual API call
    useEffect(() => {
        // Simulate API call
        const mockFollowers = [
            { id: 1, username: 'john_doe', firstName: 'John', lastName: 'Doe' },
            { id: 2, username: 'jane_smith', firstName: 'Jane', lastName: 'Smith' },
            { id: 3, username: 'bob_wilson', firstName: 'Bob', lastName: 'Wilson' },
            { id: 4, username: 'alice_brown', firstName: 'Alice', lastName: 'Brown' },
        ];
        setFollowers(mockFollowers);
        setLoading(false);
    }, []);

    const handleViewProfile = (followerId) => {
        // Implement view profile functionality
        console.log('View profile:', followerId);
    };

    const handleMessage = (followerId) => {
        // Implement message functionality
        console.log('Message follower:', followerId);
    };

    const handleRemoveFollow = (followerId) => {
        // Implement remove follow functionality
        console.log('Remove follow:', followerId);
    };

    const handleBlock = (followerId) => {
        // Implement block functionality
        console.log('Block follower:', followerId);
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
                        {followers.map((follower) => (
                            <Col key={follower.id}>
                                <FollowerCard follower={follower} />
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Mobile List View */}
                <div className="d-lg-none">
                    <div className="mobile-followers-list">
                        {followers.map((follower) => (
                            <div key={follower.id} className="mobile-follower-item">
                                <FollowerCard follower={follower} />
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Followers;