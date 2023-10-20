import React from 'react'
import { createRoot }  from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";


import './sass/index.sass'
import Header from './defaultClasses/indexheader'
import UserLogin from './userlogin'
import CreateNewUser from './createnewuser';
import AboutUs from './aboutus';
import ContactUs from './contactus';
import ForgetPassword from './forgetpassword';


export default function PageBrowser( ){
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={ < Header /> } >
                <Route index element={ < UserLogin /> } />
                <Route path="signup" element={ < CreateNewUser /> } />
                <Route path="aboutus" element={ < AboutUs /> } />
                <Route path="contactus" element={ < ContactUs /> } />
                <Route path="forgetpassword" element={ < ForgetPassword /> } />
            </Route>
        </Routes>
        </BrowserRouter>
    )
}

const root = createRoot(document.getElementById('root'));
root.render(<PageBrowser />);
document.cookie = "username=John Doe; expires=Thu, 18 Dec 2023 12:00:00 UTC; path=/";
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        if (cookie[0] === name) {
            return cookie[1];
        }
    }
    return null;
}

const username = getCookie("username");
if (username) {
    console.log("Username: " + username);
} else {
    console.log("Username cookie not found.");
}
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";







