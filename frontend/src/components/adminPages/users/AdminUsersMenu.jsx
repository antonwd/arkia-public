import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronCircleLeft} from '@fortawesome/free-solid-svg-icons'

const AdminUsersMenu = ({changeState}) => {
    return (
        <div className="usersMenu">
            <li onClick={() => {changeState('activeUsers')}}><FontAwesomeIcon icon={faChevronCircleLeft} /> אצד׳׳א פעילים</li>
            <li onClick={() => {changeState('notCrew')}}><FontAwesomeIcon icon={faChevronCircleLeft} /> משתמשים שאינם אצד׳׳א</li>
            <li onClick={() => {changeState('inactiveUsers')}}><FontAwesomeIcon icon={faChevronCircleLeft} /> משתמשים לא פעילים</li>
            <li><FontAwesomeIcon icon={faChevronCircleLeft} /> הקמת משתמש</li>
        </div>
    )
}

export default AdminUsersMenu