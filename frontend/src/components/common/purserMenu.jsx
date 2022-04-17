import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPaperclip, faThList, faMarker} from '@fortawesome/free-solid-svg-icons'

import './../../styles/mainMenu.scss'

const PurserMenu = () => {

    return (
       <>
                <div className="menuItem menuCategory">
                    תפריט כלכלים:                    
                </div>
                <div className="menuItem">
                    <div className="icon">
                        <FontAwesomeIcon icon={faPaperclip} />
                    </div>
                    <div className="menuItemText">
                        דו׳׳ח טיסה
                    </div>
                </div>
                <div className="menuItem">
                    <div className="icon">
                        <FontAwesomeIcon icon={faThList} />
                    </div>
                    <div className="menuItemText">
                        הדו׳׳חות שלי 
                    </div>
                </div>
                <div className="menuItem">
                    <div className="icon">
                        <FontAwesomeIcon icon={faMarker} />
                    </div>
                    <div className="menuItemText">
                        הערכת אצד׳׳א
                    </div>
                </div>
        </>
    )
}

export default PurserMenu