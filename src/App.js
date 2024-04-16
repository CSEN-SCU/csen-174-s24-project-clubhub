import "./App.css";
import Navbar from "./components/nav/navbar";
import Login from "./pages/login/login";
import Clubs from "./pages/clubs/clubs";
import Home from "./pages/home/home";
import Search from "./pages/search/search";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
