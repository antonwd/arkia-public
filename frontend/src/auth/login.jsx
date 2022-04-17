//main component to hold all contents
import React, { useState, useContext, useEffect } from 'react'
import './../styles/Login.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import useApi from './../useApi/useApi'
import { UserContext } from '../context/UserContext';

const Login = (props) => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const [loginError, setLoginError] = useState();

    const {user, setUser} = useContext(UserContext);
    
    const setCurrentUser = (currentUser) => {
        setUser(currentUser)
    }

    
        useEffect(() => {
            if(localStorage.getItem("user")) {
              const savedUser = JSON.parse(localStorage.getItem("user"));
              const tokenExpirationCalc = savedUser.issuedAt + savedUser.expires_in - 10
              if(Math.floor(Date.now() / 1000) < tokenExpirationCalc) {
                setCurrentUser(savedUser)
              }
            }
        }, []);
    

    const handleLogin = (e) => {
      e.preventDefault();
      useApi.post("/auth/login", {
        "userName": userName,
        "password": password,
        "rememberMe": rememberMe
      }).then(
        (response) => {setCurrentUser(response.data)
          let tmpResponse = response.data
          tmpResponse['issuedAt'] = Math.floor(Date.now() / 1000)
          localStorage.setItem("user", JSON.stringify(tmpResponse))
        }
      ).catch(error => {
        console.error("There was an error!", error)
        console.log(error.response)
        setLoginError(error.response);
        setUserName("")
        setPassword("")
      })
    }

    return (
        <div className="Login">
      <div className="box">
        <div className="title">
          כניסה למערכת
        </div>
        {loginError ? 
        <div className="errorOccured">
          ארעה שגיאה בתהליך ההתחברות למערכת
        </div>
        : ''}
        <div className="loginForm">
          <form onSubmit={(e) => handleLogin(e)}>
              <input type="text" name="user" placeholder="שם משתמש" value={userName} onChange={e => setUserName(e.target.value)}></input>
              <input type="password" name="password" placeholder="ססמא" value={password} onChange={e => setPassword(e.target.value)}></input>
              <div className="rememberMe">
                <label className="rememberCheckBox">זכור אותי ממחשב זה
                    <input type="checkbox" name="rememberMe" checked={rememberMe ? true : false} onChange={e => setRememberMe(e.target.checked)} />
                    <span className="checkmark"></span>
                </label>
              </div>
              <button type="submit" className="submitButton">
                התחבר <FontAwesomeIcon icon={faSignInAlt} />
              </button>
          </form>
        </div>
      </div>
    </div>
    )
}

export default Login