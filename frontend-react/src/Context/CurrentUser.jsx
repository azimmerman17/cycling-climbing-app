import { useEffect, createContext, useState, useContext } from "react";


export const CurrentUser = createContext()

const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState()

  useEffect(() => {
    const getLoggedInUser = async () => {
        let response = await fetch(`http://localhost:8080/user/currentuser`, {
          method: 'POST',
          mode: 'cors'
        })
        let user = await response.json()
        setCurrentUser(user)
      }
      getLoggedInUser()
  }, [])

  return (
    <CurrentUser.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUser.Provider>
  )
}

export default CurrentUserProvider