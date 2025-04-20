import React from 'react'
import { createRoot }  from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './sass/index.sass'
import IndexHeader from './defaultClasses/indexheader';
import MyHomeHeader from './defaultClasses/myhomeheader';
import BlankProfilePic from './img/blankprofile.png'
import UserLogin from './userlogin'
import CreateNewUser from './createnewuser';
import AboutUs from './aboutus';
import Reviewus from './myHomeComponents/ClientCommunications/reviewus';
import ForgetPassword from './forgetpassword';
import Dashboard from './myHomeComponents/dashboard';
import Friends from './myHomeComponents/SocialComponents/friends'
import Followers from './myHomeComponents/SocialComponents/followers'
import BlockedList from './myHomeComponents/SocialComponents/blockedlist'
import CurrentFiles from './myHomeComponents/FileManagementComponents/currentfiles'
import RecycleBin from './myHomeComponents/FileManagementComponents/recyclebin'
import Profile from './myHomeComponents/SettingsComponents/profile'
import Permissions from './myHomeComponents/SettingsComponents/permissions'

const FetchBlankProfilePic = () => {
    return (
      <div>
        <img src={BlankProfilePic} alt="Blank Profile" />
      </div>
    );
  };

export default function PageBrowser( ){

    return (
        <BrowserRouter id = "RouterIndex">
            <Routes>

                {/* Landing Page Routes */}
                <Route path="/" element={ < IndexHeader /> } >
                    <Route index element={ < UserLogin /> } />
                    <Route path="signup" element={ < CreateNewUser /> } />
                    <Route path="aboutus" element={ < AboutUs /> } />
                    <Route path="forgetpassword" element={ < ForgetPassword /> } />
                </Route>

                <Route path="/myhome" element={ < MyHomeHeader /> } >
                    <Route index path = "/myhome/dashboard" element={ < Dashboard /> } />

                    {/* Social Page Routes */}
                    <Route path="/myhome/social/"  >
                        <Route path="/myhome/social/friends" element={ < Friends /> } />
                        <Route path="/myhome/social/followers" element={ < Followers /> } />
                        <Route path="/myhome/social/blockedlist" element={ < BlockedList /> } />
                    </Route>

                    {/* File Management Routes */}
                    <Route path="/myhome/filemanagement" >
                        <Route path="/myhome/filemanagement/currentfiles" element={ < CurrentFiles /> } />
                        <Route path="/myhome/filemanagement/recyclebin" element={ < RecycleBin /> } />
                    </Route>

                    {/* Settings Routes */}
                    <Route path="/myhome/settings/" >
                        <Route path="/myhome/settings/profile" element={ < Profile /> } />
                        <Route path="/myhome/settings/permissions" element={ < Permissions /> } />
                    </Route>

                    {/* Aux Home Page Routes */}
                    <Route path="/myhome/aboutus" element={ < AboutUs /> } />
                    <Route path="/myhome/reviewus" element={ < Reviewus /> } />
                </Route>

                {/* Static Routes */}
                
                <Route path="/img/:blankprofile" element = { <FetchBlankProfilePic/> }  />
            </Routes>
        </BrowserRouter>

    )
}



const root = createRoot(document.getElementById('root'));
root.render(< PageBrowser />);



