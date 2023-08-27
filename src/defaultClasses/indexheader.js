import React from 'react'
import { createRoot } from 'react-dom/client';

import Home from '../home'
import UserLogin from '../userlogin'
import CreateNewUser from '../createnewuser'

function HomeButton( ){
	return(
		<button id="home" className="col button_active" onClick={( ) => openPage('home')}>Home
		</button>
	)
}

function LoginButton( ){
	return(
		<button id="userlogin" className="col button_active" onClick={( ) => openPage('userlogin')}>Login
		</button>
	)
}

function CreateNewuserButton( ){
	return(
		<button id="createnewuser" className="col button_active" onClick={( ) => openPage('createnewuser')}>Sign Up
		</button>
	)
}

const Header = ( ) => {
    return(
        <React.StrictMode>
            <div>
				<HomeButton />
				<LoginButton />
                <CreateNewuserButton />
		    </div>
	    </React.StrictMode>
    )
}

const openPage = (page) => {
	if (page === 'home') {
		const main_body_container = document.getElementById( 'main_body' )
		const main_body = createRoot( main_body_container )
		main_body.render(< Home />)
	}

	if (page === 'userlogin') {
		const main_body_container = document.getElementById( 'main_body' )
		const main_body = createRoot( main_body_container )
		main_body.render(< UserLogin />)
	}

	if (page === 'createnewuser') {
		const main_body_container = document.getElementById( 'main_body' )
		const main_body = createRoot( main_body_container )
		main_body.render(< CreateNewUser />)
	}


}

export default Header