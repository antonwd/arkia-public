import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminMenuItem = (props) => {
    return (
        <NavLink to={'/admin' + props.linkTo}>
            <div className="adminMenuItem">
                <div className="item">
                    <div className="icon">
                        {props.icon}
                    </div>
                    {props.linkText}
                </div>
            </div>
        </NavLink>
    )
}

export default AdminMenuItem