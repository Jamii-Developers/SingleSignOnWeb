import React, { useState, useCallback } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import '../sass/uploadmodal.sass';

const UploadModal = ({ show, onHide }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        // TODO: Implement file upload logic
        console.log('Uploading file:', selectedFile);
        onHide();
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            className="upload-modal"
        >
            <Modal.Header>
                <Modal.Title>Upload File</Modal.Title>
                <Button variant="link" className="close-btn" onClick={onHide}>
                    <FaTimes />
                </Button>
            </Modal.Header>
            <Modal.Body>
                <div 
                    className={`upload-area ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {selectedFile ? (
                        <div className="selected-file">
                            <div className="file-info">
                                <span className="file-name">{selectedFile.name}</span>
                                <span className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                            <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => setSelectedFile(null)}
                            >
                                Remove
                            </Button>
                        </div>
                    ) : (
                        <>
                            <FaCloudUploadAlt className="upload-icon" />
                            <p>Drag and drop your file here</p>
                            <p className="text-muted">or</p>
                            <Form.Group controlId="fileUpload" className="mb-0">
                                <Form.Label className="upload-btn">
                                    Choose File
                                    <Form.Control
                                        type="file"
                                        onChange={handleFileSelect}
                                        hidden
                                    />
                                </Form.Label>
                            </Form.Group>
                        </>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleUpload}
                    disabled={!selectedFile}
                >
                    Upload
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UploadModal; 