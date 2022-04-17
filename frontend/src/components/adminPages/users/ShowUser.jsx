import React, { useState, useEffect, useContext } from 'react'

import useApi from '../../../useApi/useApi'
import SmallLoader from '../../common/ui/SmallLoader'
import { UserContext } from '../../../context/UserContext'

import '../../../styles/commonElements.scss'
import formValidate from './validationRules'
import useForm from '../../../hooks/useForm/useForm'
import ConfirmedAnimation from '../../common/confirmedAnimation'
import FormSelect from '../../common/ui/formSelect/formSelect'

const ShowUser = ({data, close}) => {
    const userDetails = useContext(UserContext)
    const [userData, setUserData] = useState(false)
    const { formValues, formHandleChange, formHandleSubmit, formPrePopulate, errors } = useForm(submitUserData, formValidate);
    const [showConfirmed, setShowConfirmed] = useState(false)
    const [crewStatusChanged, setCrewStatusChnaged] = useState(false)

    const userRoleOptions = {
        "noca": "לא דייל",
        "ca": "אצד׳׳א",
        "ca1": "כלכל",
        "admin": "מנהל מערכת",
    }

    const trainingOptions = {
        "0": "ללא",
        "trainer": "מדריך",
        "inspector": "בוחן",
        "ground_trainer": "מדריך קרקעי",
        "ground_inspector": "מדריך ובוחן קרקעי",
    }

    const crewStatus = {
        "1": "קורס בסיסי",
        "2": "פעיל",
        "3": "פוטר",
        "4": "התפטר",
        "5": "חל׳׳ת",
        "6": "חל׳׳ד",
        "7": "פרישה",
    }

    useEffect(() => {
        useApi.get("admin/users/user/"+data.userID, {headers: { Authorization: `Bearer ${userDetails.user.access_token}`}})
        .then((response) => {
            setUserData(response.data)

            formPrePopulate({
                "firstName": response.data.firstName,
                "lastName": response.data.lastName,
                "firstNameEN": response.data.firstNameEN || '',
                "lastNameEN": response.data.lastNameEN || '',
                "email": response.data.email,
                "empID": response.data.empID,
                "civilID": response.data.civilID || '',
                "phone": response.data.phone || '',
                "city": response.data.city || '',
                "seniority": response.data.seniority || '',
                "trainingRole": response.data.trainingRole || '',
                "userRole": response.data.userRole || '',
                "crewStatus": response.data.crewStatus || ''
            })
        })
        .catch((error) => {
            console.log(error.message)
        })
    }, [])

    useEffect(() => {
        console.log(formValues)
    }, [formValues])

    function submitUserData() {
        useApi.post("admin/users/update", {
            "userID": userData.userID,
            "email": formValues.email,
            "firstName": formValues.firstName,
            "lastName": formValues.lastName,
            "crewID": userData.id,
            "empID": formValues.empID,
            "firstNameEN": formValues.firstNameEN,
            "lastNameEN": formValues.lastNameEN,
            "civilID": formValues.civilID,
            "phone": formValues.phone,
            "city": formValues.city,
            "seniority": formValues.seniority,
            "trainingRole": formValues.trainingRole,
            "userRole": formValues.userRole,
            "crewStatus": formValues.crewStatus
        },
        {headers: { Authorization: `Bearer ${userDetails.user.access_token}`}}
        ).then((response) => {
            console.log(response.data)
            if(response.data === 'User Updated') {
                setShowConfirmed(true);
                setTimeout(()=>{
                    setShowConfirmed(false)
                    close()
                }, 3500)
            }
        }).catch((error) => {
            console.log("Error occured: " + error)
        })
    }

    return (
        <div className='modal'>
            <div className="modalBg" onClick={() => { close() }}></div>
            
            <div className="confirmModal">
                {!userData && <SmallLoader />}
                {userData && showConfirmed ? <ConfirmedAnimation message="המידע נשמר" /> : 
                <form onSubmit={formHandleSubmit} >
                    <div className="title">
                        {userData.firstName} {userData.lastName}
                    </div>
                    <div className="userDetailsForm">
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
                                    <input className={errors.empID && 'errorField'} type="text" name="empID" value={formValues.empID || ''} onChange={formHandleChange} />
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
                                <div className="formInput">
                                    <span className={formValues.city ? 'placeholder moved' : 'placeholder'}>ישוב מגורים בפועל</span>
                                    <input className={errors.city && 'errorField'} type="text" name="city" value={formValues.city || ''} onChange={formHandleChange} />
                                </div>
                            </div>
                            <div className="formRow">
                                <div className="formInput">
                                    <span className={formValues.seniority ? 'placeholder moved' : 'placeholder'}>קוד סניוריטי</span>
                                    <input className={errors.seniority && 'errorField'} type="text" name="seniority" value={formValues.seniority || ''} onChange={formHandleChange} />
                                </div>
                                <FormSelect mainTitle="הרשאות הדרכה" options={trainingOptions} inputName="trainingRole" inputInitialValue={formValues.trainingRole} changeFunction={formHandleChange} />
                                <FormSelect mainTitle="הרשאות מערכת" options={userRoleOptions} inputName="userRole" inputInitialValue={formValues.userRole} changeFunction={formHandleChange} />
                            </div>
                            <div className="formRow">
                                <FormSelect mainTitle="סטאטוס דייל" options={crewStatus} inputName="crewStatus" inputInitialValue={formValues.crewStatus} changeFunction={formHandleChange} />
                            </div>
                        </div>
                    </div>
                    <div className="buttons">
                        <button className="decline" onClick={() => { close() }}>סגור</button>
                        <button className="confirm" type="submit">אישור</button>
                    </div>
                </form>
                }
            </div>
        </div>
    )
}

export default ShowUser