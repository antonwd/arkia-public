import React from 'react'
import '../../styles/forms.scss'
import ChangePassword from './changePassword';
import UpdateProfile from './updateProfile';

const Profile = () => {

    return (
        <div className="mainPage">

            <div className="middlePageTitle">
                פרופיל אישי
            </div>

            <UpdateProfile />

            <ChangePassword />
            
        </div>
    )
}

export default Profile