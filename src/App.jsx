import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Auctions from "./pages/auctions/Auctions";
import About from "./pages/about/About";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import "./styles/style.scss";
import { Helmet } from "react-helmet";
import { ThemeProvider } from "./pages/theme/ThemeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./AuthContext";
import KoiDetail from "./pages/koiDetail/KoiDetail";
import koi_data from "./utils/data/koi_data.json";

const TITLE = "Auction Koi";
const GOOGLE_CLIENT_ID =
  "1093656938461-fod9qlmrd68m0otn7mhrggipp15b8cnj.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider
      clientId={GOOGLE_CLIENT_ID}
      onScriptLoadError={() =>
        console.log("Failed to load Google Sign-In script")
      }
      onScriptLoadSuccess={() =>
        console.log("Google Sign-In script loaded successfully")
      }
    >
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
    </GoogleOAuthProvider>
  );
}

export default App;
