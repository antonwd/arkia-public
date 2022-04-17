//main component to hold all contents
import React, { useContext, useEffect } from 'react'
import Header from './common/header'
import MainMenu from './common/menu'
import Login from './../auth/login.jsx'
import MainPage from './mainPage'
import MyTraining from './reTraining/myTraining'
import Profile from './profile/profile'
import { UserContext } from '../context/UserContext'
import {
    Routes,
    Route
  } from "react-router-dom";
import OfficeUpdates from './officeUpdates/officeUpdates'
import CrewContact from './common/contactLists/crewContact'
import ImportantContacts from './common/contactLists/importantContacts'
import AdminDashboard from './adminPages/adminDashboard'

const MainComponent = () => {
    const {user, setUser} = useContext(UserContext);

    useEffect(() => {
        if(localStorage.getItem("user")) {
            const savedUser = JSON.parse(localStorage.getItem("user"));
              const tokenExpirationCalc = savedUser.issuedAt + savedUser.expires_in - 60
              if(Math.floor(Date.now() / 1000) < tokenExpirationCalc) {
                setUser(savedUser)
              } else {
                  setUser(null)
              }
        }
    }, []);

    if(user === null) {
        return <Login />
    }

    return (
            <div className="mainFrame">
                <div className="rightMenu">
                    <MainMenu />
                </div>
                <div className="mainContent">
                    <Header />
                    <div className="pageGrid">
                        <Routes>
                            <Route path="/" element={<MainPage />} />
                            <Route path="updates" element={<OfficeUpdates />} />
                            <Route path="trainings" element={<MyTraining />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="/admin/*" element={<AdminDashboard />} />
                        </Routes>
                        <div className="leftBlock">
                            <CrewContact />
                            <ImportantContacts />
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default MainComponent