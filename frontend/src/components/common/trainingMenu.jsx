import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faIdCard, faClipboardList, faEnvelopeOpenText} from '@fortawesome/free-solid-svg-icons'

import './../../styles/mainMenu.scss'

const TrainingMenu = () => {

    return (
    <>
                <div className="menuItem menuCategory">
                    מחלקת הדרכה:
                </div>
                <div className="menuItem">
                    <div className="icon">
                        <FontAwesomeIcon icon={faEnvelopeOpenText} />
                    </div>
                    <div className="menuItemText">
                         הגשת דו׳׳ח
                    </div>
                </div>
                <div className="menuItem">
                    <div className="icon">
                        <FontAwesomeIcon icon={faClipboardList} />
                    </div>
                    <div className="menuItemText">
                        הדו׳׳חות שלי
                    </div>
                </div>
                <div className="menuItem">
                    <div className="icon">
                        <FontAwesomeIcon icon={faIdCard} />
                    </div>
                    <div className="menuItemText">
                        דפי קשר
                    </div>
                </div>
     </>
    )
}

export default TrainingMenu