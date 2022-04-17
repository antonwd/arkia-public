import React, { useState, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faEdit, faTrashAlt, faPaperPlane} from '@fortawesome/free-regular-svg-icons'

import useApi from '../../../useApi/useApi'
import { UserContext } from '../../../context/UserContext'
import SmallLoader from '../../common/ui/SmallLoader'
import { getVisibleTo, formatDate } from '../helpers/helperFunctions'

const AdminOfficeUpdates = (props) => {
    const userDetails = useContext(UserContext)
    const [officeMsgs, setOfficeMsgs] = useState({})
    const [loadingMsgs, setLoadingMsgs] = useState(true)

    useEffect(() => {
        useApi.get("officeUpdates", {headers: { Authorization: `Bearer ${userDetails.user.access_token}`}})
        .then((response) => {
            setOfficeMsgs(response.data)
            setLoadingMsgs(false)
        })
    }, [])

    return (
        <div className="rowDiv">
            <div className="rowTitleDiv">
                הודעות משרד
            </div>
            <div className="rowContentDiv officeUpdates">
                {loadingMsgs && 
                    <SmallLoader />
                }

                <div className="sendOfficeUpdate">
                    <span class="innerActionLink"><FontAwesomeIcon icon={faPaperPlane} /> פרסום הודעה</span>
                </div>

                {officeMsgs && Object.keys(officeMsgs).map((item, key) => (
                    <div className="singleUpdateBox">
                        <div className="dateAndActions">
                            <span className="dateString">{formatDate(officeMsgs[item].sentDate)}</span>
                            <span class="innerActionLink"><FontAwesomeIcon icon={faEdit} /> עריכה</span>
                            <span class="innerActionLink"><FontAwesomeIcon icon={faTrashAlt} /> מחיקה</span>
                        </div>
                        <div className="updateBox">
                            <div className="title">
                                {officeMsgs[item].title} {officeMsgs[item].visibleTo !== 'all' ? <span className="visibleOnly">{getVisibleTo(officeMsgs[item].visibleTo)}</span> : ''}
                            </div>
                            <div className="messageContent">
                                {officeMsgs[item].content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminOfficeUpdates