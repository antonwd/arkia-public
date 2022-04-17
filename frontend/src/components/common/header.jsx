//Header component
import React, {useContext} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faWifi, faSignOutAlt, faChevronDown} from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'

import './../../styles/header.scss'
import { UserContext } from '../../context/UserContext';
import useApi from '../../useApi/useApi';

import logo from '../../assets/images/Arkia_Israeli_logo.svg'

const Header = () => {
    const userDetails = useContext(UserContext)
    let userInfo = null;
    if(userDetails){
        userInfo = userDetails.user.userInfo
    }

    const logout = () => {
        console.log("Called logout")
        useApi.get("auth/logout",
        {headers: { Authorization: `Bearer ${userDetails.user.access_token}`}}).then((response) => {
            localStorage.clear();
            window.location.href = "/";
        }).catch(error => {
            console.log(error.response)
        })
    }

    return (
        <div className="mainHeader">
            <div className="logo">
                <img src={logo} alt="Arkia Crew Portal" />
            </div>
            <div className="userBox">
                <div className="userStatus">
                    <div className="icon">
                        <FontAwesomeIcon icon={faWifi} />
                    </div>
                    <div className="userName">
                        {userInfo[0].firstName} {userInfo[0].lastName} <FontAwesomeIcon icon={faChevronDown} />
                        <div className="userAction">
                            <NavLink to="/profile">
                                <div className="action">
                                    <div className="link">פרופיל אישי</div>
                                    <div className="icon"></div>
                                </div>
                            </NavLink>
                            <div className="action logout" onClick={() => {logout()}}>
                                <div className="link">התנתק</div>
                                <div className="icon"><FontAwesomeIcon icon={faSignOutAlt} /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header