import { createContext, useContext, useState } from "react";

const AuthContext = createContext(undefined);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const updatedUser = (user) => setUser(user);

  return (
    <AuthContext.Provider value={{ user, updatedUser }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
