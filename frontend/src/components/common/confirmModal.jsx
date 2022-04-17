import React from 'react'
import '../../styles/commonElements.scss'

const ConfirmModal = ({data, decline, confirm}) => {

    return (
        <div className="modal">
            <div className="modalBg" onClick={() => { decline() }}></div>
            <div className="confirmModal">
                <div className="title">
                    הצהרת השתתפות בריענון
                </div>
                <div className="message">
                    אני {data.userData[0].firstName} {data.userData[0].lastName}, מספר תעודת זהות {data.userData[1].civilID}, מספר עובד בחברת ארקיע {data.userData[1].empID}, מצהיר/ה שנכחתי והשתתפתי בריענון חירום {data.code} אשר התקיים בתאריך {data.date} והועבר על ידי {data.trainer}.
                    <br />
                    בלחיצה על כפתור האישור אני מאשר לחברת ארקיע ולמחלקת דיילים בפרט להשתמש בהצהרתי זו לצורך דיווח הכשירות שלי לרשויות התעופה.
                    <div className="redInfo">
                    דיווח שקרי בדבר השתתפות בריענון יגרור בירור וטיפול משמעתי במחלקת דיילים.
                    </div>
                </div>
                <div className="buttons">
                    <button className="decline" onClick={() => { decline() }}>ביטול</button>
                    <button className="confirm" onClick={() => { confirm(data.dayID, data.userData[1].id) }}>אישור</button>
                </div>
            </div>
        </div>
        )
}

export default ConfirmModal