import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronDown} from '@fortawesome/free-solid-svg-icons'

const SelectList = (props) => {
    const [showList, setShowList] = useState(false)
    const mainTitle = props.mainTitle
    const options = props.options
    return (
        <div className="selectList">
                <div className="titleOptions" onClick={() => setShowList(!showList)}>
                    {mainTitle}
                    <span className="downIcon"><FontAwesomeIcon icon={faChevronDown} /></span>
                </div>
                <div className={showList ? "optionsList" : "optionsList hidden"}>
                    {options.map((item, key) => (
                        <div className="optionLine" key={key} onClick={() => { item.actionFn(); setShowList(false) }}>
                            {item.optionTitle}
                        </div>
                    ))}
                </div>
        </div>
    )
}

export default SelectList