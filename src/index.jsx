import React, { useEffect, useState } from 'react'
import { createRoot }  from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import networkDetector from "./configs/networkDetector";

import './sass/index.sass'
import Indexheader from "./defaultClasses/indexheader";
import MyHomeHeader from './defaultClasses/myhomeheader';
import BlankProfilePic from './img/blankprofile.png'
import Userlogin from './userlogin'
import Createnewuser from './createnewuser';
import Aboutus from './aboutus';
import Reviewus from './myHomeComponents/ClientCommunications/reviewus';
import Contactsupport from './myHomeComponents/ClientCommunications/contactsupport';
import Forgetpassword from './forgetpassword';
import Dashboard from './myHomeComponents/dashboard';
import Friends from './myHomeComponents/SocialComponents/friends'
import Followers from './myHomeComponents/SocialComponents/followers'
import Blockedlist from './myHomeComponents/SocialComponents/blockedlist'
import Currentfiles from './myHomeComponents/FileManagementComponents/currentfiles'
import Recyclebin from './myHomeComponents/FileManagementComponents/recyclebin'
import Profile from './myHomeComponents/SettingsComponents/profile'
import Permissions from './myHomeComponents/SettingsComponents/permissions'

const FetchBlankProfilePic = () => {
    return (
      <div>
        <img src={BlankProfilePic} alt="Blank Profile" />
      </div>
    );
  };

const PageBrowser = ( ) => {

    const [serverReady, setServerReady] = useState(false);
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        networkDetector()
            .then(() => setServerReady(true))
            .catch((err) => {
                console.error(err);
                setServerError("Unable to connect to any server.");
            });
    }, []);

    if (serverError) {
        return <div style={{ color: 'red', padding: '2rem' }}>{serverError}</div>;
    }

    if (!serverReady) {
        return <div style={{ padding: '2rem' }}>Checking server connection...</div>;
    }

    return (

        <BrowserRouter id = "RouterIndex">
            <Routes>

                {/* Landing Page Routes */}
                <Route path="/" element={ < Indexheader /> } >
                    <Route index element={ < Userlogin /> } />
                    <Route path="signup" element={ < Createnewuser /> } />
                    <Route path="aboutus" element={ < Aboutus /> } />
                    <Route path="forgetpassword" element={ < Forgetpassword /> } />
                </Route>

                <Route path="/myhome" element={ < MyHomeHeader /> } >
                    <Route index path = "/myhome/dashboard" element={ < Dashboard /> } />

                    {/* Social Page Routes */}
                    <Route path="/myhome/social/"  >
                        <Route path="/myhome/social/friends" element={ < Friends /> } />
                        <Route path="/myhome/social/followers" element={ < Followers /> } />
                        <Route path="/myhome/social/blockedlist" element={ < Blockedlist /> } />
                    </Route>

                    {/* File Management Routes */}
                    <Route path="/myhome/filemanagement" >
                        <Route path="/myhome/filemanagement/currentfiles" element={ < Currentfiles /> } />
                        <Route path="/myhome/filemanagement/recyclebin" element={ < Recyclebin /> } />
                    </Route>

                    {/* Settings Routes */}
                    <Route path="/myhome/settings/" >
                        <Route path="/myhome/settings/profile" element={ < Profile /> } />
                        <Route path="/myhome/settings/permissions" element={ < Permissions /> } />
                    </Route>

                    {/*Client communications*/}
                    <Route path="/myhome/clientcommunication/" >
                        <Route path="/myhome/clientcommunication/reviewus" element={ < Reviewus /> } />
                        <Route path="/myhome/clientcommunication/contactsupport" element={ < Contactsupport /> } />
                    </Route>

                    {/* Aux Home Page Routes */}
                    <Route path="/myhome/aboutus" element={ < Aboutus /> } />
                </Route>

                {/* Static Routes */}
                
                <Route path="/img/:blankprofile" element = { <FetchBlankProfilePic/> }  />
            </Routes>
        </BrowserRouter>

    )
}

const root = createRoot(document.getElementById('root'));
root.render(< PageBrowser />);



