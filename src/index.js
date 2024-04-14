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
import SocialHeader from './myHomeComponents/SocialComponents/socialheader';
import SocialDashboard from './myHomeComponents/SocialComponents/dashboard';
import FileManagementDashboard from './myHomeComponents/FileManagementComponents/dashboard';
import SettingsHeader from './myHomeComponents/SettingsComponents/settingsheader';
import SettingsDashboard from './myHomeComponents/SettingsComponents/dashboard';
import Friends from './myHomeComponents/SocialComponents/friends'
import Followers from './myHomeComponents/SocialComponents/followers'
import BlockedList from './myHomeComponents/SocialComponents/blockedlist'
import CurrentFiles from './myHomeComponents/FileManagementComponents/currentfiles'
import RecycleBin from './myHomeComponents/FileManagementComponents/recyclebin'
import Profile from './myHomeComponents/SettingsComponents/profile'
import Permissions from './myHomeComponents/SettingsComponents/permissions'
import FileManagementHeader from './myHomeComponents/FileManagementComponents/filamanagementheader';

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

                    {/* Social Page Routes */}
                    <Route path="/myhome/social/" element={ < SocialHeader /> } >
                        <Route index element={ < SocialDashboard /> } />
                        <Route path="/myhome/social/friends" element={ < Friends /> } />
                        <Route path="/myhome/social/followers" element={ < Followers /> } />
                        <Route path="/myhome/social/blockedlist" element={ < BlockedList /> } />
                    </Route>

                    <Route path="/myhome/filemanagement" element={ < FileManagementHeader /> } >
                        <Route index element={ < FileManagementDashboard /> } />
                        <Route path="/myhome/filemanagement/currentfiles" element={ < CurrentFiles /> } />
                        <Route path="/myhome/filemanagement/recyclebin" element={ < RecycleBin /> } />
                    </Route>

                    <Route path="/myhome/settings/" element={ < SettingsHeader /> } >
                        <Route index element={ < SettingsDashboard /> } />
                        <Route path="/myhome/settings/profile" element={ < Profile /> } />
                        <Route path="/myhome/settings/permissions" element={ < Permissions /> } />
                    </Route>

                    <Route path="/myhome/aboutus" element={ < AboutUs /> } />
                    <Route path="/myhome/contactus" element={ < ContactUs /> } />
                </Route>

                
            </Routes>
        </BrowserRouter>

    )
}

const root = createRoot(document.getElementById('root'));
root.render(< PageBrowser />);



