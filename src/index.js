import React from 'react'
import { createRoot }  from 'react-dom/client';

import './sass/index.sass'
import UserLogin from './userlogin'
import Header from './defaultClasses/indexheader'
import Footer from './defaultClasses/indexfooter'


const header_container = document.getElementById('header');
const header = createRoot( header_container );
const main_body_container = document.getElementById( 'main_body');
const main_body = createRoot( main_body_container );
const footer_container = document.getElementById( 'footer' );
const footer = createRoot( footer_container );

header.render( < Header main_body = {main_body} /> )
main_body.render( < UserLogin main_body = {main_body}  /> )
footer.render( < Footer main_body = {main_body} /> )


