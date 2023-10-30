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



