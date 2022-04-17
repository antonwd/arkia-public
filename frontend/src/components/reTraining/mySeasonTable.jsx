import React, { useEffect } from 'react'
import { useState, useContext } from 'react'
import { UserContext } from '../../context/UserContext';
import useApi from './../../useApi/useApi'

const MySeasonTable = (props) => {
    const [trainings, setTrainings] = useState(false)

    const userDetails = useContext(UserContext)

    useEffect(() => {
        useApi.get("/trainings/my/"+props.season,
        {headers: { Authorization: `Bearer ${userDetails.user.access_token}`}}).then((response) => {
            setTrainings(response.data)
        }).catch((error) => {
            console.log("Error occured: " + error)
        })
    }, [])

    return (
        <>
        {trainings ?
            <div className="trainingsBySeason">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>#</th>
                                                <th>ריענון</th>
                                                <th>תאריך</th>
                                                <th>מדריך</th>
                                            </tr>
                                            {trainings.map((details, j) => (
                                            <tr key={details[0].id}>
                                                <td>{j+1}.</td>
                                                <td>{details[0].trainingCode}</td>
                                                <td>{details[0].date}</td>
                                                <td>{details[0].trainer}</td>
                                            </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
        : ''}
        </>
    )
}

export default MySeasonTable