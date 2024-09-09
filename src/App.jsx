import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./page/home/Home";
import Auctions from "./page/auctions/Auctions";
import About from "./page/about/About";
import Login from "./page/login/Login";
import Register from "./page/register/Register";
import "./styles/style.scss";
import { Helmet } from "react-helmet";

const TITLE = "Auction Koi";

function App() {
  return (
    <>
      <Helmet>
        <title>{ TITLE }</title>
      </Helmet>
      <Header />
      {/* <Register />
      <Tables/> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
