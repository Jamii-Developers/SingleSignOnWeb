import React from "react";
import { Container, Row, Col, Card, Button, ButtonGroup, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaBan, FaSearch, FaUserSlash } from 'react-icons/fa';
import BlankProfilePic from '../../img/blankprofile.png';
import '../sass/blockedlist.sass';

const BlockedList = () => {
    const [cookies] = useCookies("userSession");
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const secretKey = cookies.userSession.USER_KEY;
    const sessionKey = cookies.userSession.SESSION_KEY;
    const deviceKey = cookies.userSession.DEVICE_KEY;

    // Mock data for demonstration - replace with actual API call
    useEffect(() => {
        // Simulate API call
        const mockBlockedUsers = [
            { id: 1, username: 'john_doe', firstName: 'John', lastName: 'Doe' },
            { id: 2, username: 'jane_smith', firstName: 'Jane', lastName: 'Smith' },
            { id: 3, username: 'bob_wilson', firstName: 'Bob', lastName: 'Wilson' },
            { id: 4, username: 'alice_brown', firstName: 'Alice', lastName: 'Brown' },
        ];
        setBlockedUsers(mockBlockedUsers);
        setLoading(false);
    }, []);

    const handleViewProfile = (userId) => {
        // Implement view profile functionality
        console.log('View profile:', userId);
    };

    const handleMessage = (userId) => {
        // Implement message functionality
        console.log('Message user:', userId);
    };

    const handleRemoveBlock = (userId) => {
        // Implement remove block functionality
        console.log('Remove block:', userId);
    };

    const handleSearch = () => {
        // Implement search functionality
        console.log('Searching for:', searchQuery);
    };

    const BlockedUserCard = ({ user }) => (
        <Card className="blocked-user-card">
            <Card.Body>
                <div className="profile-header">
                    <div className="profile-image-container">
                        <img src={BlankProfilePic} alt="Profile" className="profile-image" />
                        <div className="blocked-badge">
                            <FaUserSlash />
                        </div>
                    </div>
                    <div className="profile-info">
                        <Card.Title>
                            {user.firstName} {user.lastName}
                        </Card.Title>
                        <Card.Subtitle>
                            @{user.username}
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
                                onClick={() => handleViewProfile(user.id)}
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
                                onClick={() => handleMessage(user.id)}
                            >
                                <FaEnvelope />
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Remove Block</Tooltip>}
                        >
                            <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleRemoveBlock(user.id)}
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
        <div id="BlockedListContent">
            <Container fluid>
                <div className="page-header">
                    <h2>Blocked Users</h2>
                    <p className="text-muted">Manage your blocked users list</p>
                </div>
                <div className="search-container">
                    <InputGroup>
                        <InputGroup.Text>
                            <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search blocked users..."
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
                        {blockedUsers.map((user) => (
                            <Col key={user.id}>
                                <BlockedUserCard user={user} />
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Mobile List View */}
                <div className="d-lg-none">
                    <div className="mobile-blocked-list">
                        {blockedUsers.map((user) => (
                            <div key={user.id} className="mobile-blocked-item">
                                <BlockedUserCard user={user} />
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default BlockedList;