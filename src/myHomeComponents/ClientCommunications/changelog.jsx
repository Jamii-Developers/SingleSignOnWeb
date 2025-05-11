import React, { useState } from 'react';
import { Container, Row, Col, Card, Pagination } from 'react-bootstrap';
import { FaCodeBranch, FaCalendarAlt } from 'react-icons/fa';
import '../../sass/changelog.sass';

const Changelog = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Mock data - replace with actual changelog data
    const changelogData = [
        {
            date: '2025-05-11',
            version: '0.0.2',
            changes: [
                'Added Ability to Block Users',
                'Added Ability to Unfollow Users',
                'Added Ability to Remove Followers',
                'Added Ability to Remove Friends',
                'Added Ability to Remove Blocks'
                
            ]
        },
        {
            date: '2025-05-03',
            version: '0.0.1',
            changes: [
                'Added new friend request system',
                'Improved follower management',
                'Enhanced search functionality',
                'Fixed UI responsiveness issues',
                'Updated security protocols',
                'Added new friend request system',
                'Added Change Log Page'
            ]
        },
    ];

    // Calculate pagination
    const totalPages = Math.ceil(changelogData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = changelogData.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div id="ChangelogContent">
            <Container fluid>
                <Row>
                    <Col>
                        <div className="page-header">
                            <h2>Changelog</h2>
                            <p className="text-muted">Recent updates and improvements</p>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div className="changelog-list">
                            {currentItems.map((entry, index) => (
                                <Card key={index} className="changelog-entry mb-4">
                                    <Card.Body>
                                        <div className="entry-header">
                                            <div className="version-info">
                                                <FaCodeBranch className="version-icon" />
                                                <span className="version">v{entry.version}</span>
                                            </div>
                                            <div className="date-info">
                                                <FaCalendarAlt className="date-icon" />
                                                <span className="date">{formatDate(entry.date)}</span>
                                            </div>
                                        </div>
                                        <ul className="changes-list">
                                            {entry.changes.map((change, changeIndex) => (
                                                <li key={changeIndex}>{change}</li>
                                            ))}
                                        </ul>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination-container">
                                <Pagination className="justify-content-center">
                                    <Pagination.First 
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1}
                                    />
                                    <Pagination.Prev 
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    />
                                    
                                    {[...Array(totalPages)].map((_, index) => (
                                        <Pagination.Item
                                            key={index + 1}
                                            active={currentPage === index + 1}
                                            onClick={() => handlePageChange(index + 1)}
                                        >
                                            {index + 1}
                                        </Pagination.Item>
                                    ))}

                                    <Pagination.Next 
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    />
                                    <Pagination.Last 
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages}
                                    />
                                </Pagination>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Changelog; 