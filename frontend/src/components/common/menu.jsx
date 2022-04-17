//Menu component

import React from 'react'
import { useState, useEffect, useContext } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBars, faRedo, faIdBadge, faEnvelopeOpenText, faPenFancy, faChevronRight, faHome} from '@fortawesome/free-solid-svg-icons'

import './../../styles/mainMenu.scss'

import PurserMenu from './purserMenu'
import TrainingMenu from './trainingMenu'
import { UserContext } from '../../context/UserContext'
import logo from '../../assets/images/Arkia_Israeli_logo.svg'
import MenuItem from './menuItem'

const MainMenu = () => {
    const [menuShown, showHideMenu] = useState(false)
    const [width, setWidth] = useState(window.innerWidth)
    const [mobileMenu, setMobileMenu] = useState(true)

    const userInfo = useContext(UserContext)

    useEffect(() => {
        function handleResize() {
          setWidth(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, [width]);
    
      useEffect(() => {
        width >= 768 && setMobileMenu(false) && showHideMenu(true);
        width < 768 && setMobileMenu(true) && showHideMenu(false);
      },[width]);

      useEffect(() => {
          if(mobileMenu) {
            const menuLinks = document.querySelector(".menuItems").querySelectorAll(".menuItem")
            menuLinks.forEach((item, index) => {
                const classes = item.classList
                if(!classes.contains('menuCategory')) {
                    item.addEventListener('mousedown', function() {
                        item.click();
                        showHideMenu(false)
                    })
                }
            })
          }
      }, [])

    return (
        <div className="mainMenu">
            {mobileMenu ? 
                <div className="mobileMenuIcon" onClick={()=>{showHideMenu(!menuShown);}}>
                    <span className="openedMobile" style={menuShown ? {display: 'inline-block'} : {display: 'none'}}><FontAwesomeIcon icon={faChevronRight} /></span>
                    <FontAwesomeIcon icon={faBars} />
                </div>
            : <div className="logo">
                <img src={logo} alt="Arkia Crew Portal" />
              </div>}
            <div className="menuItems" style={menuShown || width > 767 ? {} : {display: 'none'}}>
                <MenuItem linkTo="/" iconName={<FontAwesomeIcon icon={faHome} />} linkText="דף הבית" />
                <MenuItem linkTo="updates" iconName={<FontAwesomeIcon icon={faEnvelopeOpenText} />} linkText="הודעות משרד" />
                <MenuItem linkTo="/trainings" iconName={<FontAwesomeIcon icon={faRedo} />} linkText="ריענונים" />
                <MenuItem linkTo="/profile" iconName={<FontAwesomeIcon icon={faIdBadge} />} linkText="פרופיל אישי" />
                
            {userInfo.user.userInfo[0].userRole === 'ca1' || userInfo.user.userInfo[0].userRole === 'ca2' || userInfo.user.userInfo[0].userRole === 'admin' ? <PurserMenu /> : ''}
            {userInfo.user.userInfo[0].trainingRole === '0' || userInfo.user.userInfo[0].userRole === 'admin' ? <TrainingMenu /> : ''}

            {userInfo.user.userInfo[0].userRole === 'admin' ? 
            <>
                <div className="menuItem menuCategory">
                    תפריט מנהל:
                </div>
                    <MenuItem linkTo="/admin" iconName={<FontAwesomeIcon icon={faPenFancy} />} linkText="ניהול המערכת" />
            </>
                : ''}
            </div>
        </div>
    )
}

export default MainMenu