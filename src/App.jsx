import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./page/home/Home";
import Auctions from "./page/auctions/Auctions";
import About from "./page/about/About";
import Login from "./page/login/Login";
import Register from "./page/register/Register";
import "./styles/style.scss";
import { Helmet } from "react-helmet";
import { ThemeProvider } from "./page/theme/ThemeContext";
import KoiDetail from "./components/koiDetail/KoiDetail";
import koi_data from "./data/koi_data.json";
import { AuthProvider } from "./AuthContext";

const TITLE = "Auction Koi";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Helmet>
          <title>{TITLE}</title>
        </Helmet>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/koi/:id"
            element={<KoiDetail koiData={koi_data.items} />}
          />
        </Routes>
        <Footer />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
