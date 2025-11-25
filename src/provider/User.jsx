import React, { useContext, useEffect, useState } from "react";
import { useProfileQuery } from "../redux/apiSlices/authSlice";

export const UserContext = React.createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch profile only if there's a token in localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useProfileQuery(undefined, {
    skip: !token, // Skip query if no token
  });

  useEffect(() => {
    if (profile && !isLoading && !isError) {
      setUser(profile);
    } else if (isError) {
      setUser(null);
    }
  }, [profile, isLoading, isError]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, refetch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
