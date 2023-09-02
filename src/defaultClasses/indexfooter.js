import React from 'react'

import Navbar  from 'react-bootstrap/esm/Navbar'
import Container  from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav';
import { NavbarBrand }from 'react-bootstrap'
import { createRoot } from 'react-dom/client'

import ContactUs from '../contactus'



function ContactUsButton( ){
	return(
		<Nav.Link id="contactusbutton" onClick={ ( ) => openPage('contactus')}>Contact Us</Nav.Link>
	)
}


const Footer = ( ) => {
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

const openPage = (page) => {

	if (page === 'contactus') {
		const main_body_container = document.getElementById( 'main_body' )
		const main_body = createRoot( main_body_container )
		main_body.render(< ContactUs />)
	}

}
