import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../Firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const userType = localStorage.getItem("userType");
      if (user && userType === "student") {
        if (user.email.endsWith("@scu.edu")) {
          setCurrentUser(user);
          setError(null);
        } else {
          localStorage.clear();
          sessionStorage.clear();
          setError("SCU_EMAIL_REQUIRED");
          setCurrentUser(null);
        }
      } else if (user && userType === "club owner") {
        setCurrentUser(user);
        setError(null);
      } else {
        localStorage.clear();
        sessionStorage.clear();
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    error,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
