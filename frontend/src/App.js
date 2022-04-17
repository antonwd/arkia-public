import React, {useState, useMemo} from 'react'
import './App.css';
import MainComponent from './components/main'
import { UserContext } from './context/UserContext'
import { BrowserRouter } from "react-router-dom"

function App() {
  const [user, setUser] = useState(null)
  const value = useMemo(() => ({user, setUser}), [user, setUser])

  return (
    <BrowserRouter>
      <div className="App">
        <UserContext.Provider value={value}>
          <MainComponent />
        </UserContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
