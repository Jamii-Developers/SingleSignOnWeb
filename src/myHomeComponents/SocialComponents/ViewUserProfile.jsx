import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Row, Col, Card } from 'react-bootstrap';
import { useCookies } from "react-cookie";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import JsonNetworkAdapter from '../../configs/networkadapter';
import conn from '../../configs/conn';
import constants from '../../utils/constants';
import ServerErrorMsg from '../../frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from '../../frequentlyUsedModals/serversuccessmsg';
import BlankProfilePic from '../../img/blankprofile.png';
import '../sass/viewuserprofile.sass';

const ViewUserProfile = ({ show, onHide, userId }) => {
    const [cookies] = useCookies("userSession");
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);

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

    const fetchProfileData = async () => {
        try {
            // First check localStorage for cached data
            const cachedProfiles = localStorage.getItem('userprofiles');
            if (cachedProfiles) {
                const profiles = JSON.parse(cachedProfiles);
                const cachedProfile = profiles[userId];
                if (cachedProfile) {
                    setProfileData(cachedProfile);
                    setLoading(false);
                }
            }

            // Make server request to get fresh data
            const requestData = {
                deviceKey: cookies.userSession.DEVICE_KEY,
                userKey: cookies.userSession.USER_KEY,
                sessionKey: cookies.userSession.SESSION_KEY,
                targetUserKey: userId
            };

            const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.VIEW_USER_PROFILE };
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

                // Update localStorage with new data
                const profiles = JSON.parse(localStorage.getItem('userprofiles') || '{}');
                profiles[userId] = result.data;
                localStorage.setItem('userprofiles', JSON.stringify(profiles));

                setProfileData(result.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "Network Error",
                serverErrorSubject: "Connection Error",
                serverErrorMessage: "Unable to fetch profile data. Please try again later.",
                errServMsgShow: true
            }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (show && userId) {
            fetchProfileData();
        }
    }, [show, userId]);

    const getDisplayName = () => {
        if (!profileData) return '';
        
        if (profileData.firstname && profileData.firstname !== '' && 
            profileData.lastname && profileData.lastname !== '') {
            return `${profileData.firstname} ${profileData.lastname}`;
        }
        return "@"+profileData.username;
    };

    const renderProfileContent = () => {
        if (loading) {
            return (
                <div className="text-center p-4">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            );
        }

        if (!profileData) {
            return (
                <div className="text-center p-4">
                    <p className="text-muted">No profile data available</p>
                </div>
            );
        }

        return (
            <div className="profile-content">
                <div className="profile-header text-center mb-4">
                    <div className="profile-image-container">
                        <img src={BlankProfilePic} alt="Profile" className="profile-image" />
                    </div>
                    <h3 className="mt-3">{getDisplayName()}</h3>
                    <p className="text-muted">@{profileData.username}</p>
                </div>

                <div className="profile-sections">
                    {/* Personal Information Section */}
                    <Card className="mb-4">
                        <Card.Body>
                            <h5 className="card-title">
                                <FaUser className="me-2" />
                                Personal Information
                            </h5>
                            <div className="info-grid">
                                {profileData.firstname && profileData.firstname !== '' && (
                                    <div className="info-item">
                                        <label>First Name:</label>
                                        <span>{profileData.firstname}</span>
                                    </div>
                                )}
                                {profileData.middlename && profileData.middlename !== '' && (
                                    <div className="info-item">
                                        <label>Middle Name:</label>
                                        <span>{profileData.middlename}</span>
                                    </div>
                                )}
                                {profileData.lastname && profileData.lastname !== '' && (
                                    <div className="info-item">
                                        <label>Last Name:</label>
                                        <span>{profileData.lastname}</span>
                                    </div>
                                )}
                                {profileData.emailaddress && profileData.emailaddress !== '' && (
                                    <div className="info-item">
                                        <label>Email:</label>
                                        <span>{profileData.emailaddress}</span>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Location Information Section */}
                    {(profileData.address1 || profileData.city || profileData.state || 
                      profileData.province || profileData.country || profileData.zipcode) && (
                        <Card>
                            <Card.Body>
                                <h5 className="card-title">
                                    <FaMapMarkerAlt className="me-2" />
                                    Location Information
                                </h5>
                                <div className="info-grid">
                                    {profileData.address1 && profileData.address1 !== '' && (
                                        <div className="info-item">
                                            <label>Address:</label>
                                            <span>{profileData.address1}</span>
                                        </div>
                                    )}
                                    {profileData.address2 && profileData.address2 !== '' && (
                                        <div className="info-item">
                                            <label>Address 2:</label>
                                            <span>{profileData.address2}</span>
                                        </div>
                                    )}
                                    {profileData.city && profileData.city !== '' && (
                                        <div className="info-item">
                                            <label>City:</label>
                                            <span>{profileData.city}</span>
                                        </div>
                                    )}
                                    {(profileData.state || profileData.province) && 
                                     (profileData.state !== 'N/A' || profileData.province !== '') && (
                                        <div className="info-item">
                                            <label>State/Province:</label>
                                            <span>{profileData.state || profileData.province}</span>
                                        </div>
                                    )}
                                    {profileData.country && profileData.country !== '' && (
                                        <div className="info-item">
                                            <label>Country:</label>
                                            <span>{profileData.country}</span>
                                        </div>
                                    )}
                                    {profileData.zipcode && profileData.zipcode !== '' && (
                                        <div className="info-item">
                                            <label>Zip Code:</label>
                                            <span>{profileData.zipcode}</span>
                                        </div>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                centered
                className="view-user-profile-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{profileData ? getDisplayName() : 'User Profile'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderProfileContent()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

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
        </>
    );
};

export default ViewUserProfile; 