import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronDown} from '@fortawesome/free-solid-svg-icons'

import '../../../styles/contactBlock.scss'


const ImportantContacts = () => {

    return (
        <div className="contactBlock">
            <div className="title">
                <div className="titleText">
                    אלפון מספרים חשובים
                </div>
            </div>
            <div className="contactLine">
                <div className="name">הצבת צוותים</div>
                <div className="number">054-6376606</div>
            </div>
            <div className="contactLine">
                <div className="name">מבצעים 24/7</div>
                <div className="number">054-6376606</div>
            </div>
            <div className="contactLine">
                <div className="name">מחלקת שכר</div>
                <div className="number">054-6376606</div>
            </div>
            <div className="contactLine">
                <div className="name">משאבי אנוש</div>
                <div className="number">054-6376606</div>
            </div>
        </div>
        )
}

export default ImportantContacts