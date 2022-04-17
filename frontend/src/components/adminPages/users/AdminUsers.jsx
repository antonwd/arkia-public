import React, { useState, useEffect } from 'react'

import AdminUsersMenu from './AdminUsersMenu'
import AdminUsersSearch from './AdminUsersSearch'

const AdminUsers = () => {
    const [searchBoxState, setSearchBoxState] = useState('activeUsers')

    return (
        <div className="rowDiv">
            <div className="rowTitleDiv">
                ניהול משתמשים
            </div>
            <div className="rowContentDiv">
                <AdminUsersMenu changeState={(value) => (setSearchBoxState(value))} />
                <AdminUsersSearch searchState={searchBoxState} />
            </div>
        </div>
    )
}

export default AdminUsers