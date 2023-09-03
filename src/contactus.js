import './sass/contactus.sass';

import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const ContactUs = ( ) => {
    return (
          <div id = "ContactUsPage">
                  <Form>
                        <h1>Contact Us</h1>

                        <p>At Jamii developers as we aim to improve and grow our solutions we appreciate any feedback in form of complements or complaints provided to us.</p>

                        <FloatingLabel controlId="email" label="Email address" className="mb-3">
                              <Form.Control type="email" placeholder="name@example.com" />
                        </FloatingLabel>

                        <FloatingLabel controlId="username" label="Username" className="mb-3">
                              <Form.Control type="text" placeholder="Username" />
                        </FloatingLabel>

                        <FloatingLabel controlId="review" label="Leave your thoughts here" className="mb-3" >
                              <Form.Control as="textarea" placeholder="Leave your thoughts here" style={ { height: '100px' } } />
                        </FloatingLabel>

                        <ButtonGroup size="md" className="mb-2">
                              <Button variant="primary" type="submit">Send</Button>
                              <Button variant="clear" type="submit">Clear</Button>
                        </ButtonGroup>
                        
                  </Form>
            
          </div>
    )
}
  
export default ContactUs