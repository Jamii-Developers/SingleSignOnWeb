import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Form } from 'react-bootstrap';
import { FaCheckCircle, FaCircle, FaRoad, FaChartLine, FaCalendarAlt, FaSearch, FaQuestionCircle } from 'react-icons/fa';
import '../../sass/roadmap.sass';

const Roadmap = () => {
    const [roadmapItems, setRoadmapItems] = useState([
        {
            category: 'Social Features',
            items: [
                { id: 1, text: 'Ability to search for users', completed: true, completionDate: '2025-05-03' },
                { id: 2, text: 'Ability to send friend requests', completed: true, completionDate: '2025-05-03' },
                { id: 3, text: 'Ability to send follow requests', completed: true, completionDate: '2025-05-03' },
                { id: 4, text: 'Ability to block users', completed: true, completionDate: '2025-05-10' },
                { id: 5, text: 'Ability to unfriend users', completed: true, completionDate: '2025-05-10' },
                { id: 6, text: 'Ability to unfollow users', completed: true, completionDate: '2025-05-10' },
                { id: 7, text: 'Ability to accept friend requests', completed: true, completionDate: '2025-05-03' },
                { id: 8, text: 'Ability to accept follow requests', completed: true, completionDate: '2025-05-03' },
                { id: 9, text: 'Ability to accept block requests', completed: true, completionDate: '2025-05-03' },
                { id: 10, text: 'Ability to view friend requests', completed: true, completionDate: '2025-05-03' },
                { id: 11, text: 'Ability to view follow requests', completed: true, completionDate: '2025-05-03' },
                { id: 12, text: 'Ability to view blocked users', completed: true, completionDate: '2025-05-10' },
                { id: 13, text: 'Ability to View User Profiles', completed: false, completionDate: '2025-05-17' },
                { id: 14, text: 'User Instant Messaging', completed: false, completionDate: '2025-05-17' },
                { id: 14, text: 'User Notifications', completed: false, completionDate: '2025-05-17' },
            ]
        },
        {
            category: 'File Management Features',
            items: [
                { id: 13, text: 'File Uploading', completed: false, completionDate: 'TBD' },
                { id: 14, text: 'File Downloading', completed: false, completionDate: 'TBD' },
                { id: 15, text: 'File Sharing', completed: false, completionDate: 'TBD' },
                { id: 16, text: 'File Deleting', completed: false, completionDate: 'TBD' },
                { id: 17, text: 'File Editing', completed: false, completionDate: 'TBD' },
                { id: 18, text: 'File Viewing', completed: false, completionDate: 'TBD' },
                
            ]
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState(roadmapItems);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredItems(roadmapItems);
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        const filtered = roadmapItems.map(category => ({
            ...category,
            items: category.items.filter(item => 
                item.text.toLowerCase().includes(query) ||
                category.category.toLowerCase().includes(query)
            )
        })).filter(category => category.items.length > 0);

        setFilteredItems(filtered);
    }, [searchQuery, roadmapItems]);

    const toggleItem = (categoryIndex, itemId) => {
        setRoadmapItems(prevItems => {
            const newItems = [...prevItems];
            const item = newItems[categoryIndex].items.find(item => item.id === itemId);
            if (item) {
                item.completed = !item.completed;
            }
            return newItems;
        });
    };

    const calculateProgress = (items) => {
        const completed = items.filter(item => item.completed).length;
        return (completed / items.length) * 100;
    };

    const formatDate = (dateString) => {
        if (dateString === 'TBD') {
            return 'TBD';
        }
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getTimelinePosition = (dateString) => {
        if (dateString === 'TBD') {
            return null; // Return null for TBD dates
        }
        const startDate = new Date('2025-04-01');
        const endDate = new Date('2026-05-31');
        const currentDate = new Date(dateString);
        
        const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
        const daysFromStart = (currentDate - startDate) / (1000 * 60 * 60 * 24);
        
        return (daysFromStart / totalDays) * 100;
    };

    return (
        <div id="RoadmapContent">
            <Container fluid>
                <Row>
                    <Col>
                        <div className="page-header">
                            <h2><FaRoad className="me-2" />Product Roadmap</h2>
                            <p className="text-muted">Track our progress and upcoming features</p>
                        </div>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col md={6} className="mx-auto">
                        <div className="search-container">
                            <Form.Group className="mb-0">
                                <div className="search-input-wrapper">
                                    <FaSearch className="search-icon" />
                                    <Form.Control
                                        type="text"
                                        placeholder="Search roadmap items..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                            </Form.Group>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div className="timeline-container mb-4">
                            <div className="timeline">
                                <div className="timeline-marker" style={{ left: '0%' }}>Apr 2025</div>
                                <div className="timeline-marker" style={{ left: '25%' }}>Aug 2025</div>
                                <div className="timeline-marker" style={{ left: '50%' }}>Dec 2025</div>
                                <div className="timeline-marker" style={{ left: '75%' }}>Apr 2026</div>
                                <div className="timeline-marker" style={{ left: '100%' }}>Aug 2026</div>
                                <div className="timeline-progress">
                                    {filteredItems.flatMap(category => category.items)
                                        .filter(item => item.completed && item.completionDate !== 'TBD')
                                        .map((item, index) => (
                                            <div
                                                key={item.id}
                                                className="timeline-point completed"
                                                style={{ left: `${getTimelinePosition(item.completionDate)}%` }}
                                                title={`${item.text} - ${formatDate(item.completionDate)}`}
                                            />
                                        ))}
                                    {filteredItems.flatMap(category => category.items)
                                        .filter(item => !item.completed && item.completionDate !== 'TBD')
                                        .map((item, index) => (
                                            <div
                                                key={item.id}
                                                className="timeline-point pending"
                                                style={{ left: `${getTimelinePosition(item.completionDate)}%` }}
                                                title={`${item.text} - ${formatDate(item.completionDate)}`}
                                            />
                                        ))}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div className="roadmap-list">
                            {filteredItems.map((category, categoryIndex) => (
                                <Card key={categoryIndex} className="roadmap-category mb-4">
                                    <Card.Body>
                                        <div className="category-header">
                                            <h3>{category.category}</h3>
                                            <div className="progress-container">
                                                <ProgressBar 
                                                    now={calculateProgress(category.items)} 
                                                    label={`${Math.round(calculateProgress(category.items))}%`}
                                                    variant="success"
                                                />
                                            </div>
                                        </div>
                                        <ul className="roadmap-items">
                                            {category.items.map(item => (
                                                <li 
                                                    key={item.id} 
                                                    className={`roadmap-item ${item.completed ? 'completed' : ''}`}
                                                    onClick={() => toggleItem(categoryIndex, item.id)}
                                                >
                                                    <div className="item-content">
                                                        {item.completed ? (
                                                            <FaCheckCircle className="status-icon completed" />
                                                        ) : (
                                                            <FaCircle className="status-icon pending" />
                                                        )}
                                                        <span className="item-text">{item.text}</span>
                                                    </div>
                                                    <div className="item-date">
                                                        {item.completionDate === 'TBD' ? (
                                                            <>
                                                                <FaQuestionCircle className="me-1" />
                                                                <span className="tbd-text">TBD</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaCalendarAlt className="me-1" />
                                                                {formatDate(item.completionDate)}
                                                            </>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </Card.Body>
                                </Card>
                            ))}
                            {filteredItems.length === 0 && (
                                <div className="no-results">
                                    <p>No items found matching your search.</p>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Roadmap; 