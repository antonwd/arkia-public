import React, { useState, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSearch} from '@fortawesome/free-solid-svg-icons'

import useApi from '../../../useApi/useApi'
import { UserContext } from '../../../context/UserContext'
import SmallLoader from '../../common/ui/SmallLoader'

import ShowUser from './ShowUser'

const AdminUsersSearch = ({searchState}) => {
    const userDetails = useContext(UserContext)

    const [usersList, setUsersList] = useState({})
    const [filteredList, setFilteredList] = useState(usersList)
    const [userShown, setUserShown] = useState(0)
    const [searchingState, setSearchingState] = useState(searchState)
    const [loadingUsers, setLoadingUsers] = useState(true)

    const handleSearch = (event) => {
        let value = event.target.value.toLowerCase()
        let result = []
        result = usersList.filter((data) => {
            return (data.firstName.search(value) !== -1 || data.lastName.search(value) !== -1 || data.empID.toString().search(value) !== -1)
        })

        setFilteredList(result)
    }

    useEffect(() => {
        setSearchingState(searchState)
    }, [searchState])

    const getUsersList = (usersToSearch) => {
        let callUrl = "admin/users"

        if(usersToSearch === 'activeUsers') callUrl = "admin/users";
        if(usersToSearch === 'notCrew') callUrl = "admin/users/notcrew";
        if(usersToSearch === 'inactiveUsers') callUrl = "admin/users/inactive";

        useApi.get(callUrl, {headers: { Authorization: `Bearer ${userDetails.user.access_token}`}})
        .then((response) => {
            setUsersList(response.data)
            setFilteredList(response.data)
            setLoadingUsers(false)
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        getUsersList(searchingState)
    }, [searchingState, userShown])

    return (
        <div>
            {userShown !== 0 && <ShowUser data={{userID: userShown}} close={() => {setUserShown(0)}} />}
            <div className="searchBox">
                <div className="searchTitle">
                    חיפוש משתמש
                </div>
                <div className="searchInstructions">
                    הזן שם או מספר עובד לחיפוש
                </div>
                <div className="searchInput">
                    <input type="text" onChange={(event) => handleSearch(event)} />
                    <span className='searchBtn'><FontAwesomeIcon icon={faSearch} /></span>
                </div>
            </div>

            {loadingUsers && <SmallLoader /> }
                
            <table className="basic-table">
                <thead>
                    <tr>
                        <td>#</td>
                        <td>מ. עובד</td>
                        <td>שם מלא</td>
                        <td>סטאטוס</td>
                    </tr>
                </thead>
                <tbody>
            {filteredList && Object.keys(filteredList).map((item, key) => (
                <tr key={key} onClick={() => {setUserShown(filteredList[item].userID)}}>
                    <td>{key + 1}</td>
                    <td>{filteredList[item].empID}</td>
                    <td>{filteredList[item].firstName} {filteredList[item].lastName}</td>
                    <td>{filteredList[item].currentStatus.statusValue}</td>
                </tr>
                ))}
            {filteredList && Object.keys(filteredList).length === 0 &&
                <tr>
                    <td colSpan="4">
                        לא נמצאו תוצאות
                    </td>
                </tr>
            }
                </tbody>
            </table>
        </div>
    )
}

export default AdminUsersSearch