import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ServerErrorMsg( props ) {
	return (

	<Modal { ...props } >

		<Modal.Header closeButton>
			<Modal.Title> 
				{ props.errorsubject } 
			</Modal.Title>
		</Modal.Header>

		<Modal.Body> 
			<p>{ props.errormessage }</p>

			<p>Error Code: { props.errorcode }</p>
		</Modal.Body>

		<Modal.Footer>
			<Button variant='secondary' onClick={props.onHide}>Close</Button>
		</Modal.Footer>
		
	</Modal>

	);
}

export default ServerErrorMsg;