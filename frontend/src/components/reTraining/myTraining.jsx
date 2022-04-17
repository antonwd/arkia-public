import React, { useEffect } from 'react'
import { useState, useContext } from 'react'
import { UserContext } from '../../context/UserContext';
import useApi from './../../useApi/useApi'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faFolderOpen, faCalendarAlt } from '@fortawesome/free-regular-svg-icons';

import './../../styles/mainPage.scss'
import Loader from '../common/loader';
import MySeasonTable from './mySeasonTable';
import ReTraining from './reTraining';

const MyTraining = () => {
    const [mySeasons, setSeasons] = useState(null)
    const [trainings, setTrainings] = useState({})
    const [showSeason, setShowSeason] = useState(false)

    const userDetails = useContext(UserContext)
    let userInfo = null;

    if(userDetails){
        userInfo = userDetails.user.userInfo
    }

    function downloadPdf(seasonID) {
        window.open(`https://api.arkia.local/trainings/viewpdf/${seasonID}?token=${userDetails.user.access_token}`, '_blank').focus();
        // useApi.get(`https://api.arkia.local/trainings/viewpdf/${seasonID}?token=${userDetails.user.access_token}`,
        // {headers: { Authorization: `Bearer ${userDetails.user.access_token}`}, responseType: 'blob'}).then((response) => {
        //     const url = window.URL.createObjectURL(new Blob([response.data]));
        //     const link = document.createElement('a');
        //     link.href = url;
        //     link.setAttribute('download', 'file.pdf'); //or any other extension
        //     document.body.appendChild(link);
        //     link.click();
        // })
    }

    useEffect(() => {
        useApi.get("/trainings/mySeasons",
        {headers: { Authorization: `Bearer ${userDetails.user.access_token}`}}).then((response) => {
            setSeasons(response.data)
            Object.keys(response.data).forEach((current) => {
                seeTrainingsBySeason(response.data[current][0].id)
            })
        })

        function seeTrainingsBySeason(season) {
            let seasonTrainings = trainings
    
            useApi.get("/trainings/my/"+season,
            {headers: { Authorization: `Bearer ${userDetails.user.access_token}`}}).then((response) => {
                seasonTrainings["season"+season] = [...response.data]
                setTrainings(...seasonTrainings["season"+season])
            })
        }
    }, [])

    return (
        <div className="mainPage">

            <div className="middlePageTitle">
                ריענונים עבור {userInfo[0].firstName} {userInfo[0].lastName}, {userInfo[1].empID} 
            </div>

            <ReTraining />

            <div className="rowDiv">
                <div className="rowTitleDiv">
                    סיכום ריענונים
                </div>

                <div className="rowContentDiv">
                    { mySeasons ? mySeasons.map((season, i) => (
                        <div className="trainingSeason" key={i}>
                            <div className="seasonTitle">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                עונה {season[0].seasonName}</div>
                            <div className="inPageActions">
                                <div className="action" onClick={() => {downloadPdf(season[0].id)}}>
                                    <FontAwesomeIcon icon={faFilePdf} />
                                    <div className="description">
                                        הורד PDF
                                    </div>
                                </div>
                                <div className="action" onClick={ () => {
                                    let currentSeason = showSeason === season[0].id ? false : season[0].id;
                                    setShowSeason(currentSeason)
                                    } 
                                }>
                                    <FontAwesomeIcon icon={faFolderOpen} />
                                    <div className="description">
                                        צפייה בפרטים
                                    </div>
                                </div>
                            </div>

                            {showSeason === season[0].id ? <MySeasonTable season={season[0].id} /> : null }
                            
                        </div>
                    )) : <Loader />}
                </div>
            </div>
        </div>
    )
}

export default MyTraining