import React, { useContext } from 'react'
import './../styles/mainPage.scss'
import { UserContext } from '../context/UserContext';

const MainPage = () => {
    const userDetails = useContext(UserContext)
    let userInfo = null;
    if(userDetails){
        userInfo = userDetails.user.userInfo
    }
    return (
        <div className="mainPage">
            <div className="heyUser">
                היי {userInfo[0].firstName}!
            </div>

            <div className="rowDiv">
                <div className="rowTitleDiv">
                     הודעת מערכת 
                </div>
                <div className="rowContentDiv">
                    שלום וברוכים הבאים לגרסא החדשה של פורטל דיילי אוויר.
                    <br />
                    לידיעתכם המערכת פועלת בימים אלה בגרסאת ניסוי והרצה וכעת משמשת אך ורק למעקב ריענונים שנתיים. אנא הקפידו להשתמש במערכת ע׳׳פ ההנחיות ולכל בעיה לפנות למשרד דיילת ראשית.
                </div>
            </div>

            <div className="rowDiv">
                <div className="rowTitleDiv">
                     עדכונים אחרונים מהמשרד 
                </div>
                <div className="rowContentDiv">
                    <div className="dateDiv">
                        25.11.2021
                    </div>
                    לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית סחטיר בלובק. תצטנפל בלינדו למרקל אס לכימפו, דול, צוט ומעיוט - לפתיעם ברשג - ולתיעם גדדיש. קוויז דומור ליאמום בלינך רוגצה. לפמעט מוסן מנת. קולהע צופעט למרקוח איבן איף, ברומץ כלרשט מיחוצים. קלאצי סחטיר בלובק. תצטנפל בלינדו למרקל אס לכימפו, דול, צוט ומעיוט - לפתיעם ברשג - ולתיעם גדדיש. קוויז דומור ליאמום בלינך רוגצה. 
                </div>
                <div className="bottomLink">
                    לכל העדכונים
                </div>
            </div>
        </div>
    )
}

export default MainPage