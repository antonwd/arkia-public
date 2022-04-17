import React, {useState, useRef, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons'

import './style.scss'

const FormSelect = (props) => {
    const mainTitle = props.mainTitle
    const options = props.options

    const [showList, setShowList] = useState(false)
    const [selected, setSelected] = useState(null)

    const toggle = () => {
        setShowList(!showList)
    }

    const mySelectRef = useRef()
    const mySelectValueRef = useRef()

    const onSelectOption = (optionValue, optionText) => {
        setSelected({"value": optionValue, "text": optionText})
        setShowList(false)
        setTimeout(() => {
            mySelectValueRef.current.dispatchEvent(new Event("change", { bubbles: true }))
            mySelectValueRef.current.dispatchEvent(new Event("input", { bubbles: true }))
        }, 100)
    }

    const handleClick = e => {
        if (mySelectRef.current.contains(e.target)) {
          // inside click
          return;
        }
        // outside click 
        setShowList(false)
      };

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);
        return () => {
          document.removeEventListener("mousedown", handleClick);
        };
      }, []);

    return (
        <div className="formSelect" onClick={() => toggle()} ref={mySelectRef}>
            <span className="selectHeader">{mainTitle}</span>
            <input type="text" className="hiddenInput" ref={mySelectValueRef} name={props.inputName} value={selected ? selected.value : props.inputInitialValue} onInput={props.changeFunction} />
            <input type="text" readOnly value={selected ? selected.text : options[props.inputInitialValue]} />
            <span className={showList ? "selectArrow noAnimation" : "selectArrow"}><FontAwesomeIcon icon={showList ? faChevronUp : faChevronDown} /></span>    
            {showList &&
                <div className="selectOptions">
                    {Object.keys(options).map((item, key) => (
                        <div className="optionLine" key={key} onClick={() => { onSelectOption(item, options[item]) }}>
                            {options[item]}
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default FormSelect