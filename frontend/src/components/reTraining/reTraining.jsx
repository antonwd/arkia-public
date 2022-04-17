import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../context/UserContext';
import useApi from './../../useApi/useApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCheckCircle, faChevronCircleLeft} from '@fortawesome/free-solid-svg-icons'
import ConfirmModal from '../common/confirmModal';

const ReTraining = () => {
    const [today, setToday] = useState([])
    const [participate, setParticipate] = useState({})

    const userDetails = useContext(UserContext)

    const setTrainingModal = (code, dayID, dayDate, trainer) => {
        setParticipate({
            "training": {
                "code": code,
                "dayID": dayID,
                "date": dayDate,
                "trainer": trainer,
                "userData": userDetails.user.userInfo
            }
        })
    }

    const closeModal = () => {
        setParticipate({})
    }

    const confirmModal = (dayID, crewID) => {
        let todayTmp = [...today];
        const obj = todayTmp.find(x => x.id === dayID);
        obj.status = true
        console.log(obj);
        console.log(todayTmp)
        setToday(todayTmp)
        setParticipate({})

        useApi.post("trainings/participate", {"dayID" : dayID}, 
        {headers: {Authorization: `Bearer ${userDetails.user.access_token}`}})
        .then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.log("Error " + error.response.status + ": " + error.response.data.message)
        })
    }

    useEffect(()=>{
        useApi.get("/trainings/today",
        {headers: { Authorization: `Bearer ${userDetails.user.access_token}`}}).then((response) => {
            setToday(response.data)
        })
    }, [])

    return (
        <div className="rowDiv">
            {participate.training && <ConfirmModal data={participate.training} confirm={(dayID, crewID) => confirmModal(dayID, crewID)} decline={() => closeModal()} /> }
                <div className="rowTitleDiv">
                    מה קורה היום? 
                </div>
                <div className="rowContentDiv">
                    { today.length>=1 ? 
                        <div className="todayTrainings">
                        {[].concat(today).sort((a, b) => a.timeStarts > b.timeStarts ? 1 : -1).map((training, i) => (
                            <div className="trainingBox" key={i}>
                                <div className="details">
                                    <div className="code">
                                        {training.code}
                                    </div>
                                    <div className="description">
                                        {training.description}
                                    </div>
                                    <div className="hour">
                                        {training.timeStarts}
                                    </div>
                                    <div className="trainer">
                                        {training.trainer}
                                    </div>
                                    <div className="participate">
                                        {training.status ? '' : <span className="participateLink" onClick={()=>{setTrainingModal(training.code, training.id, training.date, training.trainer)}}>השתתפות <span><FontAwesomeIcon icon={faChevronCircleLeft} /></span></span> }
                                    </div>
                                </div>
                                {training.status ? 
                                    <div className="status">
                                        <span className="participated">
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                        </span>
                                    </div> 
                                : null}
                            </div>
                        ))}
                        </div>
                    : <div>לא מתקיימים ריענונים</div>}
                </div>
            </div>
    )
}

export default ReTraining