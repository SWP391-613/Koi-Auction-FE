import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Auctions from "./pages/auctions/Auctions";
import About from "./pages/about/About";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Manager from "./pages/manager/Manager";
import MemberList from "./pages/manager/member/MemberList";
import { Helmet } from "react-helmet";
import { ThemeProvider } from "./pages/theme/ThemeContext";
import { AuthProvider } from "./AuthContext";
import KoiDetail from "./pages/koiDetail/KoiDetail";
import koi_data from "./utils/data/koi_data.json";
import KoiList from "./pages/manager/koi/KoiList.jsx";

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
          <Route path="/manager" element={<Manager />}>
            <Route path="member" element={<MemberList />} />
            {/* Define other nested routes here */}
            <Route path="koi" element={<KoiList />} />
            <Route path="koi" element={<KoiDetail />} />
            {/* Add other nested routes if needed */}
          </Route>
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
