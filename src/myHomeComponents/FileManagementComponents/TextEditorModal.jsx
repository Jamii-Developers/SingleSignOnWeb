import React, { useState, useEffect } from 'react';
import { Modal, Button, ButtonGroup, Form } from 'react-bootstrap';
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaAlignLeft, FaAlignCenter, FaAlignRight, FaSave } from 'react-icons/fa';
import '../sass/texteditor.sass';

const TextEditorModal = ({ show, onHide, document, onSave }) => {
    const [content, setContent] = useState('');
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        if (document) {
            setContent(document.content || '');
            setFileName(document.name || 'New Document.docx');
        }
    }, [document]);

    const handleSave = () => {
        onSave(content);
    };

    const handleFormat = (command) => {
        document.execCommand(command, false, null);
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="xl"
            className="text-editor-modal"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <Form.Control
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="document-title"
                    />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="toolbar">
                    <ButtonGroup className="me-2">
                        <Button variant="light" onClick={() => handleFormat('bold')}>
                            <FaBold />
                        </Button>
                        <Button variant="light" onClick={() => handleFormat('italic')}>
                            <FaItalic />
                        </Button>
                        <Button variant="light" onClick={() => handleFormat('underline')}>
                            <FaUnderline />
                        </Button>
                    </ButtonGroup>

                    <ButtonGroup className="me-2">
                        <Button variant="light" onClick={() => handleFormat('insertUnorderedList')}>
                            <FaListUl />
                        </Button>
                        <Button variant="light" onClick={() => handleFormat('insertOrderedList')}>
                            <FaListOl />
                        </Button>
                    </ButtonGroup>

                    <ButtonGroup>
                        <Button variant="light" onClick={() => handleFormat('justifyLeft')}>
                            <FaAlignLeft />
                        </Button>
                        <Button variant="light" onClick={() => handleFormat('justifyCenter')}>
                            <FaAlignCenter />
                        </Button>
                        <Button variant="light" onClick={() => handleFormat('justifyRight')}>
                            <FaAlignRight />
                        </Button>
                    </ButtonGroup>
                </div>

                <div
                    className="editor-content"
                    contentEditable
                    onInput={(e) => setContent(e.currentTarget.innerHTML)}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    <FaSave className="me-2" /> Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TextEditorModal; 