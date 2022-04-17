import React from 'react'
import { useContext, useState } from 'react'
import { UserContext } from '../../context/UserContext';
import '../../styles/forms.scss'
import useApi from '../../useApi/useApi';
import ConfirmedAnimation from '../common/confirmedAnimation';

const ChangePassword = () => {
    const userDetails = useContext(UserContext)
    
    const [passwordsChange, setPasswordsChange] = useState({
        'current_password': '',
        'new_password': '',
        'new_confirm_password': ''
    })
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false)

    const handlePasswordChange = (field, value) => {
        let tmpChange = { ...passwordsChange }
        tmpChange[field] = value;
        setPasswordsChange(tmpChange)
    }

    const passwordChange = () => {  
        useApi.post("profile/password", passwordsChange, 
        {headers: {Authorization: `Bearer ${userDetails.user.access_token}`}})
        .then((response) => {
            setShowConfirmedPassword(true);
            setTimeout(()=>{
                setShowConfirmedPassword(false)
            }, 3500)
            console.log(response.data)
            setPasswordsChange({
                'current_password': '',
                'new_password': '',
                'new_confirm_password': ''
            })
        }).catch((error) => {
            console.log("Error " + error.response.status + ": " + error.response.data.message)
            setPasswordsChange({
                'current_password': '',
                'new_password': '',
                'new_confirm_password': ''
            })
        })
    }

    return (
        <div className="rowDiv">
                <div className="rowTitleDiv">
                    שינוי ססמא
                </div>
                {showConfirmedPassword ? <ConfirmedAnimation message="הססמא שונתה" /> : 
                <div className="rowContentDiv">
                    <div className="form">
                        <div className="formRow">
                            <div className="formInput">
                                <span className={passwordsChange.current_password ? 'placeholder moved' : 'placeholder'}>ססמא נוכחית</span>
                                <input type="password" value={passwordsChange.current_password} onChange={(e) => handlePasswordChange('current_password', e.target.value)} />
                            </div>
                        </div>
                        <div className="formRow">
                            <div className="formInput">
                                <span className={passwordsChange.new_password ? 'placeholder moved' : 'placeholder'}>ססמא חדשה</span>
                                <input type="password" value={passwordsChange.new_password} onChange={(e) => handlePasswordChange('new_password', e.target.value)} />
                            </div>
                        </div>
                        <div className="formRow">
                            <div className="formInput">
                                <span className={passwordsChange.new_confirm_password ? 'placeholder moved' : 'placeholder'}>אימות ססמא חדשה</span>
                                <input type="password" value={passwordsChange.new_confirm_password} onChange={(e) => handlePasswordChange('new_confirm_password', e.target.value)} />
                            </div>
                        </div>
                        <div className="formRow">
                            <div className="formSubmit">
                                <button onClick={() => passwordChange()}>שנה את הססמא</button>
                            </div>
                        </div>
                    </div>
                </div>
                }
            </div>
    )
}

export default ChangePassword