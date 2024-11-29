import React, { useState } from "react";

/** Context: provides currentUser object and setter for it throughout app. */
const UserContext = React.createContext();

/** Provider component to wrap the app and supply the currentUser value. */
export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); 

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
