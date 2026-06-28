import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, Button, ButtonGroup, Form } from 'react-bootstrap';
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaAlignLeft, FaAlignCenter, FaAlignRight, FaSave } from 'react-icons/fa';
import '../sass/texteditor.sass';

const ALLOWED_TAGS = ['B', 'I', 'U', 'UL', 'OL', 'LI', 'P', 'BR', 'DIV', 'SPAN'];

const sanitizeHtml = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const clean = (node) => {
        const children = Array.from(node.childNodes);
        for (const child of children) {
            if (child.nodeType === Node.ELEMENT_NODE) {
                if (!ALLOWED_TAGS.includes(child.tagName)) {
                    child.replaceWith(...child.childNodes);
                } else {
                    const attrs = Array.from(child.attributes);
                    for (const attr of attrs) {
                        if (attr.name.startsWith('on') || attr.value.trim().toLowerCase().startsWith('javascript:')) {
                            child.removeAttribute(attr.name);
                        }
                    }
                    clean(child);
                }
            }
        }
    };
    clean(doc.body);
    return doc.body.innerHTML;
};

const TextEditorModal = ({ show, onHide, document: docProp, onSave }) => {
    const [content, setContent] = useState('');
    const [fileName, setFileName] = useState('');
    const editorRef = useRef(null);

    useEffect(() => {
        if (docProp) {
            const sanitized = sanitizeHtml(docProp.content || '');
            setContent(sanitized);
            setFileName(docProp.name || 'New Document.docx');
        }
    }, [docProp]);

    useEffect(() => {
        if (editorRef.current && content && !editorRef.current.innerHTML) {
            editorRef.current.innerHTML = content;
        }
    }, [content]);

    const handleSave = () => {
        const sanitized = sanitizeHtml(content);
        onSave(sanitized);
    };

    const handleFormat = useCallback((command) => {
        window.document.execCommand(command, false, null);
    }, []);

    const handleEditorInput = useCallback((e) => {
        setContent(e.currentTarget.innerHTML);
    }, []);

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
                    ref={editorRef}
                    className="editor-content"
                    contentEditable
                    onInput={handleEditorInput}
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