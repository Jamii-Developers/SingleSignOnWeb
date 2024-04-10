import React from 'react'
import { createRoot }  from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './sass/index.sass'
import IndexHeader from './defaultClasses/indexheader';
import MyHomeHeader from './defaultClasses/myhomeheader';
import UserLogin from './userlogin'
import CreateNewUser from './createnewuser';
import AboutUs from './aboutus';
import ContactUs from './contactus';
import ForgetPassword from './forgetpassword';
import Dashboard from './myHomeComponents/dashboard';
import SocialDashboard from './myHomeComponents/socialdashboard';
import FileManagementDashboard from './myHomeComponents/filemanagementdashboard';
import SettingsDashboard from './myHomeComponents/settingsdashboard';
import Friends from './myHomeComponents/friends'
import Followers from './myHomeComponents/followers'
import BlockedList from './myHomeComponents/blockedlist'
import CurrentFiles from './myHomeComponents/currentfiles'
import RecycleBin from './myHomeComponents/recyclebin'
import Profile from './myHomeComponents/profile'
import Permissions from './myHomeComponents/permissions'

export default function PageBrowser( ){

    return (
        <BrowserRouter id = "RouterIndex">
            <Routes>
                <Route path="/" element={ < IndexHeader /> } >
                    <Route index element={ < UserLogin /> } />
                    <Route path="signup" element={ < CreateNewUser /> } />
                    <Route path="aboutus" element={ < AboutUs /> } />
                    <Route path="contactus" element={ < ContactUs /> } />
                    <Route path="forgetpassword" element={ < ForgetPassword /> } />
                </Route>
                <Route path="/myhome" element={ < MyHomeHeader /> } >
                    <Route index path = "/myhome/dashboard" element={ < Dashboard /> } />

                    <Route path="/myhome/socialdashboard" element={ < SocialDashboard /> } />
                    <Route path="/myhome/friends" element={ < Friends /> } />
                    <Route path="/myhome/followers" element={ < Followers /> } />
                    <Route path="/myhome/blockedlist" element={ < BlockedList /> } />

                    <Route path="/myhome/filemanagementdashboard" element={ < FileManagementDashboard /> } />
                    <Route path="/myhome/currentfiles" element={ < CurrentFiles /> } />
                    <Route path="/myhome/recyclebin" element={ < RecycleBin /> } />

                    <Route path="/myhome/settingsdashboard" element={ < SettingsDashboard /> } />
                    <Route path="/myhome/profile" element={ < Profile /> } />
                    <Route path="/myhome/permissions" element={ < Permissions /> } />

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



