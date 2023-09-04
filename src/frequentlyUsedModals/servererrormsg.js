import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ServerErrorMsg( ERROR_SUBJECT, ERROR_MESSAGE, ERROR_CODE ) {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {ERROR_SUBJECT}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>{ ERROR_MESSAGE }</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <p>{ ERROR_CODE }</p>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ServerErrorMsg;