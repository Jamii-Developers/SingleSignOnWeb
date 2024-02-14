import React from 'react'
import { createRoot }  from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './sass/index.sass'
import IndexHeader from './defaultClasses/indexheader'
import UserLogin from './userlogin'
import CreateNewUser from './createnewuser';
import AboutUs from './aboutus';
import ContactUs from './contactus';
import ForgetPassword from './forgetpassword';


import MyHomeHeader from './defaultClasses/myhomeheader'
import MyHome from './myhome'


export default function PageBrowser( ){

    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={ < IndexHeader /> } >
                <Route index element={ < UserLogin /> } />
                <Route path="signup" element={ < CreateNewUser /> } />
                <Route path="aboutus" element={ < AboutUs /> } />
                <Route path="contactus" element={ < ContactUs /> } />
                <Route path="forgetpassword" element={ < ForgetPassword /> } />
            </Route>
            <Route path="/myhome" element={ < MyHomeHeader /> } >
                <Route index element={ < MyHome /> } />
                <Route path="/myhome/aboutus" element={ < AboutUs /> } />
                <Route path="/myhome/contactus" element={ < ContactUs /> } />
                <Route path="/myhome/forgetpassword" element={ < ForgetPassword /> } />
            </Route>
        </Routes>
        </BrowserRouter>

    )
}

const root = createRoot(document.getElementById('root'));
root.render(< PageBrowser />);



