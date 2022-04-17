import React, { useState, useContext, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faWhatsapp} from '@fortawesome/free-brands-svg-icons'

import '../../../styles/contactBlock.scss'
import SmallLoader from '../ui/SmallLoader'
import useApi from '../../../useApi/useApi'
import { UserContext } from '../../../context/UserContext'
import SelectList from '../ui/selectList'


const CrewContact = () => {
    const userDetails = useContext(UserContext)

    const [loaded, setLoading] = useState(false)
    const [contacts, setContacts] = useState(null)
    const [sortBy, setSortBy] = useState('lastName')

    const selectOptions = [
        {"optionTitle": "לפי סניוריטי", "actionFn": () => setSortBy('seniority')},
        {"optionTitle": "לפי א-ב", "actionFn": () => setSortBy('lastName')}
    ]

    const loadContacts = () => {
        useApi.get("/contacts",
        {headers: { Authorization: `Bearer ${userDetails.user.access_token}`}}).then((response) => {
            setContacts(response.data)
            //resortContacts('seniority')
            setLoading(true)
        }).catch((error) => {
            console.log("Error occured: " + error)
        })
    }

    useEffect(() => {
        loadContacts()
    }, [])

    if(loaded) return (
        <div className="contactBlock">
            <div className="title">
                <div className="titleText">
                    אלפון דיילים
                </div>
                <SelectList mainTitle="סידור רשימה" options={selectOptions} />
            </div>
            <div className="conctactsList">
                {[].concat(contacts).sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1).map((item, key) => (
                    <div className="contactLine" key={'crewContact'+key}>
                        <div className="name">{item.lastName} {item.firstName}</div>
                        <div className="number"><a href={'tel:'+item.phone.replace(/\D/g,'')}>{item.phone.replace(/\D/g,'')}</a></div>
                        <div className="options"><a href={'https://wa.me/972'+item.phone.replace(/\D/g,'')} target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faWhatsapp} /></a></div>
                    </div>
                ))}
            </div>
        </div>
        )
        if(!loaded) return (
            <SmallLoader />
        )
}

export default CrewContact