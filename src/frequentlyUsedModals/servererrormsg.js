import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ServerErrorMsg = ( props )  => {

    console.log("Got to ServerErrorMSG")
    return (
    <>
      <Button variant="primary" >
        { props }
      </Button>

      <Modal show={true} >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>{ props }</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" >
            Close
          </Button>
          <p>{ props }</p>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ServerErrorMsg;