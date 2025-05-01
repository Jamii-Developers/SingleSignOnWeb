import React, { useState, useCallback } from 'react';
import { Modal, Button, Form, ProgressBar, Alert } from 'react-bootstrap';
import { FaCloudUploadAlt, FaTimes, FaFolder } from 'react-icons/fa';
import '../sass/fileupload.sass';

const FileUpload = ({ onUploadComplete, selectedFolder }) => {
    const [showModal, setShowModal] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [uploadError, setUploadError] = useState(null);
    const [showUploadSuccess, setShowUploadSuccess] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const droppedFiles = Array.from(e.dataTransfer.files);
        setSelectedFiles(prev => [...prev, ...droppedFiles]);
    }, []);

    const handleFileInput = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const handleRemoveFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        setUploadError(null);
        const newProgress = {};
        const newFiles = [];

        selectedFiles.forEach(file => {
            newProgress[file.name] = 0;
        });
        setUploadProgress(newProgress);

        try {
            // Simulate file upload with progress
            for (const file of selectedFiles) {
                const fileType = file.type.split('/')[0];
                const fileExtension = file.name.split('.').pop().toLowerCase();
                
                // Simulate upload progress
                for (let progress = 0; progress <= 100; progress += 10) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    setUploadProgress(prev => ({
                        ...prev,
                        [file.name]: progress
                    }));
                }

                // Create new file object
                const newFile = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    type: fileType === 'image' ? 'image' : fileExtension,
                    size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
                    date: new Date().toISOString().split('T')[0],
                    folder: selectedFolder === 'all' ? 'documents' : selectedFolder,
                    url: URL.createObjectURL(file)
                };

                newFiles.push(newFile);
            }

            // Call the callback with new files
            onUploadComplete(newFiles);
            setShowUploadSuccess(true);
            setTimeout(() => {
                setShowUploadSuccess(false);
                setShowModal(false);
                setSelectedFiles([]);
                setUploadProgress({});
            }, 2000);
        } catch (error) {
            setUploadError('Error uploading files. Please try again.');
            console.error('Upload error:', error);
        }
    };

    return (
        <>
            <Button
                variant="primary"
                className="upload-button"
                onClick={() => setShowModal(true)}
            >
                <FaCloudUploadAlt className="me-2" />
                Upload Files
            </Button>

            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setSelectedFiles([]);
                    setUploadProgress({});
                    setUploadError(null);
                }}
                centered
                className="upload-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FaCloudUploadAlt className="me-2" />
                        Upload Files
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div 
                        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <div className="upload-content">
                            <FaCloudUploadAlt className="upload-icon" />
                            <h4>Drag & Drop Files Here</h4>
                            <p>or</p>
                            <Form.Group controlId="fileInput" className="mb-0">
                                <Form.Control
                                    type="file"
                                    multiple
                                    onChange={handleFileInput}
                                    className="d-none"
                                    id="fileInput"
                                />
                                <Button
                                    variant="outline-primary"
                                    onClick={() => document.getElementById('fileInput').click()}
                                >
                                    Choose Files
                                </Button>
                            </Form.Group>
                        </div>
                    </div>

                    {selectedFiles.length > 0 && (
                        <div className="selected-files">
                            <h5>Selected Files</h5>
                            <div className="file-list">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="file-item">
                                        <div className="file-info">
                                            <FaFolder className="file-icon" />
                                            <span className="file-name">{file.name}</span>
                                            <span className="file-size">
                                                ({(file.size / (1024 * 1024)).toFixed(1)}MB)
                                            </span>
                                        </div>
                                        <Button
                                            variant="link"
                                            className="remove-file"
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            <FaTimes />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {Object.keys(uploadProgress).length > 0 && (
                        <div className="upload-progress">
                            {Object.entries(uploadProgress).map(([fileName, progress]) => (
                                <div key={fileName} className="progress-item">
                                    <div className="progress-info">
                                        <span className="file-name">{fileName}</span>
                                        <span className="progress-percentage">{progress}%</span>
                                    </div>
                                    <ProgressBar now={progress} />
                                </div>
                            ))}
                        </div>
                    )}

                    {uploadError && (
                        <Alert variant="danger" className="mt-3">
                            {uploadError}
                        </Alert>
                    )}

                    {showUploadSuccess && (
                        <Alert variant="success" className="mt-3">
                            Files uploaded successfully!
                        </Alert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowModal(false);
                            setSelectedFiles([]);
                            setUploadProgress({});
                            setUploadError(null);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUpload}
                        disabled={selectedFiles.length === 0 || Object.keys(uploadProgress).length > 0}
                    >
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default FileUpload; 