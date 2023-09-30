import { useEffect, createContext, useState } from "react";


export const CurrentUser = createContext()

const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState()

  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        let response = await fetch(`http://localhost:8080/user/currentuser`, {
          method: 'POST',
          mode: 'cors'
        })
        let user = await response.json()
        console.log(user)
        setCurrentUser(user)
      } catch {
        setCurrentUser(null)
      }
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