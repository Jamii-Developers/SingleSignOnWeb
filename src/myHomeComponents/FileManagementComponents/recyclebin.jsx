import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, ButtonGroup, Form, InputGroup, Modal, OverlayTrigger, Tooltip, Pagination } from 'react-bootstrap';
import { FaFile, FaFilePdf, FaFileWord, FaFileImage, FaSearch, FaDownload, FaTrash, FaEye, FaUndo, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../sass/recyclebin.sass';

const Recyclebin = () => {
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const filesPerPage = 8;

    // Mock data for deleted files
    const [deletedFiles] = useState([
        { 
            id: 1, 
            name: 'document1.pdf', 
            type: 'pdf', 
            size: '2.5MB', 
            deletedDate: '2024-03-15',
            expectedDeletionDate: '2024-04-15',
            originalPath: '/documents/document1.pdf'
        },
        { 
            id: 2, 
            name: 'report.docx', 
            type: 'docx', 
            size: '1.8MB', 
            deletedDate: '2024-03-14',
            expectedDeletionDate: '2024-04-14',
            originalPath: '/documents/report.docx'
        },
        { 
            id: 3, 
            name: 'image1.jpg', 
            type: 'image', 
            size: '3.2MB', 
            deletedDate: '2024-03-13',
            expectedDeletionDate: '2024-04-13',
            originalPath: '/images/image1.jpg'
        },
        // Add more mock files to demonstrate pagination
        { 
            id: 4, 
            name: 'presentation.pptx', 
            type: 'pptx', 
            size: '4.1MB', 
            deletedDate: '2024-03-12',
            expectedDeletionDate: '2024-04-12',
            originalPath: '/documents/presentation.pptx'
        },
        { 
            id: 5, 
            name: 'spreadsheet.xlsx', 
            type: 'xlsx', 
            size: '1.2MB', 
            deletedDate: '2024-03-11',
            expectedDeletionDate: '2024-04-11',
            originalPath: '/documents/spreadsheet.xlsx'
        },
        { 
            id: 6, 
            name: 'photo2.jpg', 
            type: 'image', 
            size: '2.8MB', 
            deletedDate: '2024-03-10',
            expectedDeletionDate: '2024-04-10',
            originalPath: '/images/photo2.jpg'
        },
        { 
            id: 7, 
            name: 'contract.pdf', 
            type: 'pdf', 
            size: '3.5MB', 
            deletedDate: '2024-03-09',
            expectedDeletionDate: '2024-04-09',
            originalPath: '/documents/contract.pdf'
        },
        { 
            id: 8, 
            name: 'notes.txt', 
            type: 'txt', 
            size: '0.5MB', 
            deletedDate: '2024-03-08',
            expectedDeletionDate: '2024-04-08',
            originalPath: '/documents/notes.txt'
        },
        { 
            id: 9, 
            name: 'design.psd', 
            type: 'psd', 
            size: '15.2MB', 
            deletedDate: '2024-03-07',
            expectedDeletionDate: '2024-04-07',
            originalPath: '/design/design.psd'
        }
    ]);

    useEffect(() => {
        // Simulate API call to fetch deleted files
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const handleSearch = () => {
        setCurrentPage(1); // Reset to first page on new search
        console.log('Searching for:', searchQuery);
    };

    const handlePreview = (file) => {
        const index = deletedFiles.findIndex(f => f.id === file.id);
        setCurrentIndex(index);
        setSelectedFile(file);
        setShowPreview(true);
    };

    const handleRestore = (file) => {
        // Implement restore functionality
        console.log('Restoring file:', file);
    };

    const handlePermanentDelete = (file) => {
        // Implement permanent delete functionality
        console.log('Permanently deleting file:', file);
    };

    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf':
                return <FaFilePdf className="text-danger" />;
            case 'docx':
                return <FaFileWord className="text-primary" />;
            case 'image':
                return <FaFileImage className="text-success" />;
            case 'pptx':
                return <FaFile className="text-warning" />;
            case 'xlsx':
                return <FaFile className="text-success" />;
            case 'psd':
                return <FaFile className="text-info" />;
            default:
                return <FaFile className="text-secondary" />;
        }
    };

    const filteredFiles = deletedFiles.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination
    const indexOfLastFile = currentPage * filesPerPage;
    const indexOfFirstFile = indexOfLastFile - filesPerPage;
    const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);
    const totalPages = Math.ceil(filteredFiles.length / filesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        const items = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous button
        items.push(
            <Pagination.Prev 
                key="prev" 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            />
        );

        // First page
        if (startPage > 1) {
            items.push(
                <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
                    1
                </Pagination.Item>
            );
            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="ellipsis1" disabled />);
            }
        }

        // Page numbers
        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <Pagination.Item 
                    key={number} 
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(<Pagination.Ellipsis key="ellipsis2" disabled />);
            }
            items.push(
                <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </Pagination.Item>
            );
        }

        // Next button
        items.push(
            <Pagination.Next 
                key="next" 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            />
        );

        return items;
    };

    const FileCard = ({ file }) => (
        <Card className="file-card">
            <Card.Body>
                <div className="file-header">
                    <div className="file-icon">
                        {getFileIcon(file.type)}
                    </div>
                    <div className="file-info">
                        <Card.Title>{file.name}</Card.Title>
                        <Card.Subtitle>
                            {file.size} • Deleted: {file.deletedDate}
                        </Card.Subtitle>
                        <div className="deletion-info">
                            <small className="text-muted">
                                Expected permanent deletion: {file.expectedDeletionDate}
                            </small>
                        </div>
                    </div>
                </div>
                <div className="file-actions">
                    <ButtonGroup className="w-100">
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Preview</Tooltip>}
                        >
                            <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handlePreview(file)}
                            >
                                <FaEye />
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Restore</Tooltip>}
                        >
                            <Button 
                                variant="outline-success" 
                                size="sm"
                                onClick={() => handleRestore(file)}
                            >
                                <FaUndo />
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Delete Permanently</Tooltip>}
                        >
                            <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handlePermanentDelete(file)}
                            >
                                <FaTrash />
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
        <div id="RecycleBinContent">
            <Container fluid>
                <div className="page-header">
                    <h2>Recycle Bin</h2>
                    <p className="text-muted">View and manage deleted files</p>
                </div>

                <div className="search-section mb-4">
                    <Row>
                        <Col md={6}>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Search deleted files..."
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
                        </Col>
                    </Row>
                </div>

                <div className="files-grid">
                    {currentFiles.map((file) => (
                        <FileCard key={file.id} file={file} />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="pagination-container d-flex justify-content-center mt-4">
                        <Pagination>
                            {renderPagination()}
                        </Pagination>
                    </div>
                )}

                {/* Preview Modal */}
                <Modal
                    show={showPreview}
                    onHide={() => setShowPreview(false)}
                    size="lg"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedFile?.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedFile && (
                            <div className="preview-content">
                                {/* Add preview content based on file type */}
                                <p>Preview content for {selectedFile.name}</p>
                            </div>
                        )}
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
};

export default Recyclebin;