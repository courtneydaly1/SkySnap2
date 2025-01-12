import React, { useState, useMemo } from "react";

/** Context: provides currentUser object and setter for it throughout app. */
const UserContext = React.createContext();

/** Provider component to wrap the app and supply the currentUser value. */
export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); 

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ currentUser, setCurrentUser }), [currentUser]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;

