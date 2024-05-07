import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, firestore } from "../Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { query, where, getDocs, collection } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const userType = localStorage.getItem("userType");
      if (user && userType === "student") {
        if (user.email.endsWith("@scu.edu")) {
          setCurrentUser(user);
        } else {
          localStorage.clear();
          sessionStorage.clear();
          setCurrentUser(null);
        }
      } else if (user && userType === "club owner") {
        try {
          const clubsRef = collection(firestore, "clubs");
          const q = query(clubsRef, where("Contact", "==", user.email));
          const querySnapshot = await getDocs(q);
          if (querySnapshot.empty) {
            localStorage.clear();
            sessionStorage.clear();
            setCurrentUser(null);
          } else {
            setCurrentUser(user);
          }
        } catch (error) {
          console.error("Error checking club owner status:", error);
          localStorage.clear();
          sessionStorage.clear();
          setCurrentUser(null);
        }
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
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
