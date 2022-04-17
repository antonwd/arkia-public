import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../context/UserContext';
import '../../styles/forms.scss'
import useApi from '../../useApi/useApi';
import ConfirmedAnimation from '../common/confirmedAnimation';
import useForm from '../../hooks/useForm/useForm';
import formValidate from './ProfileValidationRules';

const UpdateProfile = () => {
    const { formValues, formHandleChange, formHandleSubmit, formPrePopulate, errors } = useForm(submitProfileChange, formValidate);
    const [showConfirmed, setShowConfirmed] = useState(false)

    const userDetails = useContext(UserContext)
    let userInfo;
    if(userDetails){
        userInfo = userDetails.user.userInfo
    }

    useEffect(() => {
        formPrePopulate({
            "firstName": userInfo[0].firstName,
            "lastName": userInfo[0].lastName,
            "firstNameEN": userInfo[1].firstNameEN || '',
            "lastNameEN": userInfo[1].lastNameEN || '',
            "email": userInfo[0].email,
            "empID": userInfo[1].empID,
            "civilID": userInfo[1].civilID || '',
            "phone": userInfo[1].phone || '',
            "city": userInfo[1].city || ''
        })
    }, [])

    function submitProfileChange() {
        useApi.post("profile/update/"+userInfo[1].id, {
            "user": {
                "id": userInfo[0].id,
                "email": formValues.email,
                "firstName": formValues.firstName,
                "lastName": formValues.lastName
            },
            "crew": {
                "id": userInfo[1].id,
                "empID": userInfo[1].empID,
                "firstNameEN": formValues.firstNameEN,
                "lastNameEN": formValues.lastNameEN,
                "civilID": formValues.civilID,
                "phone": formValues.phone,
                "city": formValues.city
            }
        },
        {headers: { Authorization: `Bearer ${userDetails.user.access_token}`}}
        ).then((response) => {
            if(response.data === 'User Updated') {
                setShowConfirmed(true);
                setTimeout(()=>{
                    setShowConfirmed(false)
                }, 3500)
                let userDetailsTmp = userDetails.user
                userDetailsTmp.userInfo[0].email = formValues.email
                userDetailsTmp.userInfo[0].firstName = formValues.firstName
                userDetailsTmp.userInfo[0].lastName = formValues.lastName
                userDetailsTmp.userInfo[1].civilID = formValues.civilID
                userDetailsTmp.userInfo[1].firstNameEN = formValues.firstNameEN
                userDetailsTmp.userInfo[1].lastNameEN = formValues.lastNameEN
                userDetailsTmp.userInfo[1].phone = formValues.phone
                userDetailsTmp.userInfo[1].city = formValues.city
                userDetails.setUser(userDetailsTmp)
            }
        }).catch((error) => {
            console.log("Error occured: " + error)
        })
    }

    return (
        <div className="rowDiv">

                <div className="rowTitleDiv">
                    פרטים אישיים
                </div>

                {showConfirmed ? <ConfirmedAnimation message="הפרופיל עודכן" /> : 
                <div className="rowContentDiv">
                    {errors && (
                        <div className="notificationBox">
                            {Object.keys(errors).map((item, key) => (
                                <div className="message alert" key={key}>
                                    {errors[item]}
                                </div>
                            ))}
                        </div>
                    )
                    }
                    <form onSubmit={formHandleSubmit}>
                        <div className="form">
                            <div className="formRow">
                                <div className="formInput">
                                    <span className={formValues.firstName ? 'placeholder moved' : 'placeholder'}>שם פרטי</span>
                                    <input className={errors.firstName && 'errorField'} type="text" name="firstName" value={formValues.firstName || ''} onChange={formHandleChange} />
                                </div>
                                <div className="formInput">
                                    <span className={formValues.lastName ? 'placeholder moved' : 'placeholder'}>שם משפחה</span>
                                    <input className={errors.lastName && 'errorField'} type="text" name="lastName" value={formValues.lastName || ''} onChange={formHandleChange} />
                                </div>
                            </div>
                            <div className="formRow">
                                <div className="formInput">
                                    <span className={formValues.firstNameEN ? 'placeholder moved' : 'placeholder'}>שם פרטי באנגלית</span>
                                    <input className={errors.firstNameEN && 'errorField'} type="text" name="firstNameEN" value={formValues.firstNameEN || ''} onChange={formHandleChange} />
                                </div>
                                <div className="formInput">
                                    <span className={formValues.lastNameEN ? 'placeholder moved' : 'placeholder'}>שם משפחה באנגלית</span>
                                    <input className={errors.lastNameEN && 'errorField'} type="text" name="lastNameEN" value={formValues.lastNameEN || ''} onChange={formHandleChange} />
                                </div>
                            </div>
                            <div className="formRow">
                                <div className="formInput">
                                    <span className={formValues.civilID ? 'placeholder moved' : 'placeholder'}>מס׳ תעודת זהות</span>
                                    <input className={errors.civilID && 'errorField'} type="text" name="civilID" value={formValues.civilID || ''} onChange={formHandleChange} />
                                </div>
                                <div className="formInput">
                                    <span className={formValues.empID ? 'placeholder moved' : 'placeholder'}>מספר עובד</span>
                                    <input className={errors.empID && 'errorField'} type="text" name="empID" value={formValues.empID || ''} readOnly onChange={formHandleChange} />
                                </div>
                            </div>
                            <div className="formRow">
                                <div className="formInput">
                                    <span className={formValues.email ? 'placeholder moved' : 'placeholder'}>כתובת דוא׳׳ל</span>
                                    <input className={errors.email && 'errorField'} type="text" name="email" value={formValues.email || ''} onChange={formHandleChange} />
                                </div>
                            </div>
                            <div className="formRow">
                                <div className="formInput">
                                    <span className={formValues.phone ? 'placeholder moved' : 'placeholder'}>מספר טלפון</span>
                                    <input className={errors.phone && 'errorField'} type="text" name="phone" value={formValues.phone || ''} onChange={formHandleChange} />
                                </div>
                            </div>
                            <div className="formRow">
                                <div className="formInput">
                                    <span className={formValues.city ? 'placeholder moved' : 'placeholder'}>ישוב מגורים בפועל</span>
                                    <input className={errors.city && 'errorField'} type="text" name="city" value={formValues.city || ''} onChange={formHandleChange} />
                                </div>
                            </div>
                            <div className="formRow">
                                <div className="formSubmit">
                                    <button type="submit">שמור שינויים</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                }
            </div>
    )
}

export default UpdateProfile