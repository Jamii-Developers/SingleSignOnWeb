import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, ButtonGroup, Form, InputGroup, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaFile, FaFilePdf, FaFileWord, FaFileImage, FaFolder, FaSearch, FaDownload, FaShare, FaTrash, FaEye, FaChevronLeft, FaChevronRight, FaExpand, FaCompress, FaTimes, FaUpload, FaFileAlt } from 'react-icons/fa';
import UploadModal from './UploadModal';
import '../sass/currentfiles.sass';

const Currentfiles = () => {
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFolder, setSelectedFolder] = useState('all');
    const [showPreview, setShowPreview] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Mock data for folders
    const [folders] = useState([
        { id: 'all', name: 'All Files', icon: <FaFolder />, count: 6 },
        { id: 'documents', name: 'Documents', icon: <FaFolder />, count: 3 },
        { id: 'images', name: 'Images', icon: <FaFolder />, count: 2 },
        { id: 'work', name: 'Work', icon: <FaFolder />, count: 1 },
        { id: 'personal', name: 'Personal', icon: <FaFolder />, count: 1 },
        { id: 'projects', name: 'Projects', icon: <FaFolder />, count: 0 },
        { id: 'downloads', name: 'Downloads', icon: <FaFolder />, count: 0 },
        { id: 'shared', name: 'Shared', icon: <FaFolder />, count: 0 },
        { id: 'archive', name: 'Archive', icon: <FaFolder />, count: 0 },
    ]);

    // Mock data for files
    const [files] = useState([
        { id: 1, name: 'document1.pdf', type: 'pdf', size: '2.5MB', date: '2024-03-15', folder: 'documents', url: '/path/to/document1.pdf' },
        { id: 2, name: 'report.docx', type: 'docx', size: '1.8MB', date: '2024-03-14', folder: 'documents', url: '/path/to/report.docx' },
        { id: 3, name: 'image1.jpg', type: 'image', size: '3.2MB', date: '2024-03-13', folder: 'images', url: '/path/to/image1.jpg' },
        { id: 4, name: 'presentation.pdf', type: 'pdf', size: '4.1MB', date: '2024-03-12', folder: 'work', url: '/path/to/presentation.pdf' },
        { id: 5, name: 'photo.png', type: 'image', size: '2.1MB', date: '2024-03-11', folder: 'images', url: '/path/to/photo.png' },
        { id: 6, name: 'contract.docx', type: 'docx', size: '1.5MB', date: '2024-03-10', folder: 'personal', url: '/path/to/contract.docx' },
    ]);

    useEffect(() => {
        // Simulate API call to fetch files
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const handleSearch = () => {
        // Implement search functionality
        console.log('Searching for:', searchQuery);
    };

    const handlePreview = (file) => {
        const index = files.findIndex(f => f.id === file.id);
        setCurrentIndex(index);
        setSelectedFile(file);
        setShowPreview(true);
    };

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % files.length;
        setCurrentIndex(nextIndex);
        setSelectedFile(files[nextIndex]);
    };

    const handlePrevious = () => {
        const prevIndex = (currentIndex - 1 + files.length) % files.length;
        setCurrentIndex(prevIndex);
        setSelectedFile(files[prevIndex]);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf':
                return <FaFilePdf className="text-danger" />;
            case 'docx':
                return <FaFileWord className="text-primary" />;
            case 'image':
                return <FaFileImage className="text-success" />;
            default:
                return <FaFile className="text-secondary" />;
        }
    };

    const filteredFiles = files.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFolder = selectedFolder === 'all' || file.folder === selectedFolder;
        return matchesSearch && matchesFolder;
    });

    const FolderCard = ({ folder }) => (
        <div 
            className={`folder-card ${selectedFolder === folder.id ? 'active' : ''}`}
            onClick={() => setSelectedFolder(folder.id)}
        >
            <div className="folder-icon">
                {folder.icon}
            </div>
            <div className="folder-info">
                <h3>{folder.name}</h3>
                <p>{folder.count} items</p>
            </div>
        </div>
    );

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
                            {file.size} • {file.date}
                        </Card.Subtitle>
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
                            overlay={<Tooltip>Download</Tooltip>}
                        >
                            <Button 
                                variant="outline-success" 
                                size="sm"
                            >
                                <FaDownload />
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Share</Tooltip>}
                        >
                            <Button 
                                variant="outline-info" 
                                size="sm"
                            >
                                <FaShare />
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Delete</Tooltip>}
                        >
                            <Button 
                                variant="outline-danger" 
                                size="sm"
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
        <div id="CurrentFilesContent">
            <Container fluid>
                <div className="page-header">
                    <h2>My Files</h2>
                    <p className="text-muted">Manage and organize your files</p>
                </div>

                <div className="search-container">
                    <Row className="justify-content-center">
                        <Col md={8} lg={6}>
                            <div className="d-flex gap-2">
                                <ButtonGroup>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>Upload File</Tooltip>}
                                    >
                                        <Button 
                                            variant="outline-primary" 
                                            className="action-btn"
                                            onClick={() => setShowUpload(true)}
                                        >
                                            <FaUpload />
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>Create Document</Tooltip>}
                                    >
                                        <Button variant="outline-primary" className="action-btn">
                                            <FaFileAlt />
                                        </Button>
                                    </OverlayTrigger>
                                </ButtonGroup>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FaSearch />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search files..."
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
                        </Col>
                    </Row>
                </div>

                <div className="folders-grid">
                    {folders.map(folder => (
                        <FolderCard key={folder.id} folder={folder} />
                    ))}
                </div>

                <div className="files-grid">
                    {filteredFiles.map((file) => (
                        <FileCard key={file.id} file={file} />
                    ))}
                </div>

                {/* Upload Modal */}
                <UploadModal 
                    show={showUpload}
                    onHide={() => setShowUpload(false)}
                />

                {/* File Preview Modal */}
                <Modal
                    show={showPreview}
                    onHide={() => {
                        setShowPreview(false);
                        setIsFullscreen(false);
                    }}
                    size="xl"
                    centered
                    className={`preview-modal ${isFullscreen ? 'fullscreen' : ''}`}
                >
                    <Modal.Header className="preview-header">
                        <div className="d-flex align-items-center">
                            {getFileIcon(selectedFile?.type)}
                            <Modal.Title>{selectedFile?.name}</Modal.Title>
                        </div>
                        <div className="preview-controls">
                            <Button
                                variant="link"
                                className="control-btn"
                                onClick={toggleFullscreen}
                            >
                                {isFullscreen ? <FaCompress /> : <FaExpand />}
                            </Button>
                            <Button
                                variant="link"
                                className="control-btn"
                                onClick={() => {
                                    setShowPreview(false);
                                    setIsFullscreen(false);
                                }}
                            >
                                <FaTimes />
                            </Button>
                        </div>
                    </Modal.Header>
                    <Modal.Body className="preview-body">
                        <div className="preview-navigation">
                            <Button
                                variant="link"
                                className="nav-btn"
                                onClick={handlePrevious}
                            >
                                <FaChevronLeft />
                            </Button>
                            {selectedFile?.type === 'pdf' && (
                                <iframe
                                    src={selectedFile.url}
                                    width="100%"
                                    height={isFullscreen ? "90vh" : "500px"}
                                    title="PDF Preview"
                                />
                            )}
                            {selectedFile?.type === 'docx' && (
                                <div className="text-center p-5">
                                    <FaFileWord size={64} className="text-primary mb-3" />
                                    <p>Document preview is not available. Please download to view.</p>
                                </div>
                            )}
                            {selectedFile?.type === 'image' && (
                                <img
                                    src={selectedFile.url}
                                    alt={selectedFile.name}
                                    className={`img-fluid ${isFullscreen ? 'fullscreen-image' : ''}`}
                                />
                            )}
                            <Button
                                variant="link"
                                className="nav-btn"
                                onClick={handleNext}
                            >
                                <FaChevronRight />
                            </Button>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="preview-footer">
                        <Button variant="secondary" onClick={() => {
                            setShowPreview(false);
                            setIsFullscreen(false);
                        }}>
                            Close
                        </Button>
                        <Button variant="primary">
                            <FaDownload className="me-2" />
                            Download
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default Currentfiles;