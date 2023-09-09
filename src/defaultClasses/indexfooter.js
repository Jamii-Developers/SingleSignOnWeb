import React from 'react'

import Navbar  from 'react-bootstrap/esm/Navbar'
import Container  from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav';
import { NavbarBrand }from 'react-bootstrap'

import ContactUs from '../contactus'






const Footer = ( props ) => {

	function ContactUsButton( ){
		return(
			<Nav.Link id="contactusbutton" onClick={ ( ) => openPage('contactus')}>Contact Us</Nav.Link>
		)
	}

	const openPage = ( page ) => {

		if (page === 'contactus') {
			props.main_body.render(< ContactUs />)
		}
	
	} 
    return(
        <div id = "IndexFooterPage" >
			< Navbar  className='bg-body-tertiary' fixed="bottom"> 
				<Container>
					<NavbarBrand>More information</NavbarBrand>
                    < ContactUsButton />
				</Container>
			</ Navbar >
		</div>
    )
}

export default Footer


