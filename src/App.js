// src/App.js
import React from "react";
import "./App.css";
import Navbar from "./components/nav/navbar";
import Welcome from "./pages/welcome/welcome";
import Clubs from "./pages/clubs/clubs";
import Home from "./pages/home/home";
import GPT from "./pages/gpt/gpt";
import Account from "./pages/account/account";
import Search from "./pages/search/search";
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
  return (
    <AuthProvider>
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
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <Search />
              </PrivateRoute>
            }
          />
          <Route
            path="/clubs"
            element={
              <PrivateRoute>
                <Clubs />
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
            path="/account"
            element={
              <PrivateRoute>
                <Account />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
