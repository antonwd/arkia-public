import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext';
import {
    Navigate,
    Routes,
    Route
  } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUsers, faCalendarAlt, faPaste, faChalkboardTeacher, faEnvelopeOpenText, faIdCard} from '@fortawesome/free-solid-svg-icons'

import './styles/admin.scss'
import AdminMenuItem from './shared/adminMenuItem';
import AdminOfficeUpdates from './officeUpdates/AdminOfficeUpdates';
import AdminReTraining from './reTraining/reTrainingMain';
import AdminUsers from './users/AdminUsers';

const AdminDashboard = () => {
    const userDetails = useContext(UserContext)

    if(userDetails.user.userInfo[0].userRole !== 'admin') {
        return <Navigate to='/'/>;
    } else {
        return (
            <div className="mainPage">
                <div className="middlePageTitle">
                    ניהול המערכת
                </div>

                <div className="adminMenuBox">
                    <AdminMenuItem linkTo="/users" linkText="משתמשים" icon={<FontAwesomeIcon icon={faUsers} />} />
                    <AdminMenuItem linkTo="/reTraining" linkText="ריענונים" icon={<FontAwesomeIcon icon={faCalendarAlt} />} />
                    <AdminMenuItem linkTo="/trainingDep" linkText="מחלקת הדרכה" icon={<FontAwesomeIcon icon={faChalkboardTeacher} />} />
                    <AdminMenuItem linkTo="/purserReports" linkText="דו׳׳חות כלכלים" icon={<FontAwesomeIcon icon={faPaste} />} />
                    <AdminMenuItem linkTo="/file" linkText="תיק אישי" icon={<FontAwesomeIcon icon={faIdCard} />} />
                    <AdminMenuItem linkTo="/updates" linkText="הודעות משרד" icon={<FontAwesomeIcon icon={faEnvelopeOpenText} />} />
                </div>

                <Routes>
                    <Route index element={<AdminOfficeUpdates />} />
                    <Route path="updates" element={<AdminOfficeUpdates />} />
                    <Route path="reTraining" element={<AdminReTraining />} />
                    <Route path="users" element={<AdminUsers />} />
                </Routes>
        </div>
        )
    }
}

export default AdminDashboard