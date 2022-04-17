import React from 'react'
import { NavLink } from 'react-router-dom'

const MenuItem = (props) => {

    return (
        <NavLink to={props.linkTo} className={({ isActive }) => isActive ? "activeLink" : ""}>
            <div className="menuItem">
                <div className="icon">
                    {props.iconName}
                </div>
                <div className="menuItemText">
                    {props.linkText}
                </div>
            </div>
        </NavLink>
        )
}

export default MenuItem