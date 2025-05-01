import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, ButtonGroup, Alert } from 'react-bootstrap';
import { useCookies } from "react-cookie";
import { FaUser, FaFile, FaUsers, FaLock, FaUnlock } from 'react-icons/fa';
import '../sass/permissions.sass';

const Permissions = () => {
    const [cookies] = useCookies("userSession");
    const [loading, setLoading] = useState(true);
    const [saveButtonSpinner, setSaveButtonSpinner] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Profile Permissions
    const [profilePermissions, setProfilePermissions] = useState({
        viewProfile: true,
        viewEmail: true,
        viewLocation: true,
        allowMessages: true,
        allowFriendRequests: true,
        allowFollowRequests: true
    });

    // File Permissions
    const [filePermissions, setFilePermissions] = useState({
        viewFiles: true,
        downloadFiles: true,
        shareFiles: true,
        editFiles: true,
        deleteFiles: false,
        allowFileRequests: true
    });

    // Group Permissions
    const [groupPermissions, setGroupPermissions] = useState({
        createGroups: true,
        joinGroups: true,
        inviteToGroups: true,
        manageGroupFiles: true,
        manageGroupMembers: false,
        leaveGroups: true
    });

    useEffect(() => {
        // Simulate API call to fetch permissions
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const handleProfilePermissionChange = (permission) => {
        setProfilePermissions(prev => ({
            ...prev,
            [permission]: !prev[permission]
        }));
    };

    const handleFilePermissionChange = (permission) => {
        setFilePermissions(prev => ({
            ...prev,
            [permission]: !prev[permission]
        }));
    };

    const handleGroupPermissionChange = (permission) => {
        setGroupPermissions(prev => ({
            ...prev,
            [permission]: !prev[permission]
        }));
    };

    const handleSave = async () => {
        setSaveButtonSpinner(true);
        try {
            // Simulate API call to save permissions
            await new Promise(resolve => setTimeout(resolve, 1000));
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            setErrorMessage('Failed to save permissions. Please try again.');
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
        } finally {
            setSaveButtonSpinner(false);
        }
    };

    const handleReset = () => {
        // Reset all permissions to default values
        setProfilePermissions({
            viewProfile: true,
            viewEmail: true,
            viewLocation: true,
            allowMessages: true,
            allowFriendRequests: true,
            allowFollowRequests: true
        });
        setFilePermissions({
            viewFiles: true,
            downloadFiles: true,
            shareFiles: true,
            editFiles: true,
            deleteFiles: false,
            allowFileRequests: true
        });
        setGroupPermissions({
            createGroups: true,
            joinGroups: true,
            inviteToGroups: true,
            manageGroupFiles: true,
            manageGroupMembers: false,
            leaveGroups: true
        });
    };

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
        <div id="PermissionsContent">
            <Container fluid>
                <div className="page-header">
                    <h2>Permissions</h2>
                    <p className="text-muted">Manage your account permissions and privacy settings</p>
                </div>

                {showSuccess && (
                    <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                        Permissions updated successfully!
                    </Alert>
                )}

                {showError && (
                    <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                        {errorMessage}
                    </Alert>
                )}

                <Row className="g-4">
                    {/* Profile Permissions */}
                    <Col lg={4}>
                        <Card className="permission-card">
                            <Card.Header className="d-flex align-items-center">
                                <FaUser className="me-2" />
                                <h3>Profile Permissions</h3>
                            </Card.Header>
                            <Card.Body>
                                <Form>
                                    {Object.entries(profilePermissions).map(([key, value]) => (
                                        <Form.Check
                                            key={key}
                                            type="switch"
                                            id={`profile-${key}`}
                                            label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            checked={value}
                                            onChange={() => handleProfilePermissionChange(key)}
                                            className="mb-3"
                                        />
                                    ))}
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* File Permissions */}
                    <Col lg={4}>
                        <Card className="permission-card">
                            <Card.Header className="d-flex align-items-center">
                                <FaFile className="me-2" />
                                <h3>File Permissions</h3>
                            </Card.Header>
                            <Card.Body>
                                <Form>
                                    {Object.entries(filePermissions).map(([key, value]) => (
                                        <Form.Check
                                            key={key}
                                            type="switch"
                                            id={`file-${key}`}
                                            label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            checked={value}
                                            onChange={() => handleFilePermissionChange(key)}
                                            className="mb-3"
                                        />
                                    ))}
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Group Permissions */}
                    <Col lg={4}>
                        <Card className="permission-card">
                            <Card.Header className="d-flex align-items-center">
                                <FaUsers className="me-2" />
                                <h3>Group Permissions</h3>
                            </Card.Header>
                            <Card.Body>
                                <Form>
                                    {Object.entries(groupPermissions).map(([key, value]) => (
                                        <Form.Check
                                            key={key}
                                            type="switch"
                                            id={`group-${key}`}
                                            label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            checked={value}
                                            onChange={() => handleGroupPermissionChange(key)}
                                            className="mb-3"
                                        />
                                    ))}
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <div className="permission-actions mt-4">
                    <ButtonGroup>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={saveButtonSpinner}
                        >
                            {saveButtonSpinner ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FaLock className="me-2" />
                                    Save Permissions
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline-secondary"
                            onClick={handleReset}
                        >
                            <FaUnlock className="me-2" />
                            Reset to Default
                        </Button>
                    </ButtonGroup>
                </div>
            </Container>
        </div>
    );
};

export default Permissions;