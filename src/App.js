// src/App.js
import React from "react";
import "./App.css";
import Navbar from "./components/nav/navbar";
import Welcome from "./pages/welcome/welcome";
import Error from "./pages/error/error";
import ClubPage from "./pages/clubs/ClubPage";
import Home from "./pages/home/home";
import GPT from "./pages/gpt/gpt";
import Account from "./pages/account/account";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/" />;
}

function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/home" /> : children;
}

function App() {
  const userId = localStorage.getItem("userId");
  // if(userId){
  //   console.log(userId.type())
  // }
  return (
    <AuthProvider>
      <div id="appBody">
        <Navbar />
        <div className="container">
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Welcome />
                </PublicRoute>
              }
            />
            <Route
              path="/error"
              element={
                <PublicRoute>
                  <Error />
                </PublicRoute>
              }
            />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/clubs"
              element={
                <PrivateRoute>
                  <ClubPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/gpt"
              element={
                <PrivateRoute>
                  <GPT />
                </PrivateRoute>
              }
            />
            <Route
              path="/account/*"
              element={
                <PrivateRoute>
                  <Account 
                  userId = {userId}/>
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
