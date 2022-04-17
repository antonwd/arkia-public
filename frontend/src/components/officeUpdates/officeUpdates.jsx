import React, { useContext, useEffect, useState } from 'react'
import './../../styles/mainPage.scss'
import { UserContext } from '../../context/UserContext';
import useApi from '../../useApi/useApi'
import SmallLoader from '../common/ui/SmallLoader'

const OfficeUpdates = () => {
    const userDetails = useContext(UserContext)
    const [officeMsgs, setOfficeMsgs] = useState({})
    const [loadingMsgs, setLoadingMsgs] = useState(true)

    const getVisibleTo = (word) => {
        let visible;
        switch(word) {
            case 'purser':
                visible = "כלכלים"
                break;
            case 'ca3':
                visible = "דיילים"
                break;
            case 'trainer':
                visible = "מדריכים"
                break;
            case 'inspector':
                visible = "בוחנים"
                break;
            case 'training':
                visible = "מחלקת הדרכה"
                break;
            default:
                visible = ''
                break;
        }
        return visible
    }

    useEffect(() => {
        useApi.get("officeUpdates", {headers: { Authorization: `Bearer ${userDetails.user.access_token}`}})
        .then((response) => {
            setOfficeMsgs(response.data)
            setLoadingMsgs(false)
        })
    }, [])

    return (
        <div className="mainPage">
            
            <div className="middlePageTitle">
                הודעות משרד
            </div>

            {loadingMsgs && 
                <SmallLoader />
            }

            {officeMsgs && Object.keys(officeMsgs).map((item, key) => (
                <div className="rowDiv" key={key}>
                    <div className="rowTitleDiv">
                        {officeMsgs[item].title}
                    </div>
                    <div className="rowContentDiv">
                        <div className="dateDiv">
                            {officeMsgs[item].visibleTo !== 'all' ? <span className="visibleOnly">{getVisibleTo(officeMsgs[item].visibleTo)}</span> : ''}
                            {officeMsgs[item].sentDate}
                        </div>
                        {officeMsgs[item].content}
                    </div>
                </div>
            ))}
            {Object.keys(officeMsgs).length < 1 && 
                <div className="rowDiv">
                    <div className="rowTitleDiv">
                        לא נמצאו הודעות להצגה
                    </div>
                    <div className="rowContentDiv">
                        משרד הדיילת הראשית טרם פרסם הודעות.
                        <br />ייתכן שהודעות שפורסמו בעבר הוגדרו להצגה עד תאריך מסוים ותאריך זה עבר.
                        <br />ייתכן גם שמשרד הדיילת הראשית פרסם הודעות עבור אולכוסיות מוגדרות שאינך נמנה עליהן.
                    </div>
                </div>
            }
        </div>
    )
}

export default OfficeUpdates