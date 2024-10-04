import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Auctions from "./pages/auctions/Auctions";
import Auction from "./pages/manager/auctions/Auctions";
import About from "./pages/about/About";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Manager from "./pages/manager/Manager";
import MemberList from "./pages/manager/member/MemberList";
import { Helmet } from "react-helmet";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import KoiDetail from "./pages/kois/KoiDetail";
import koi_data from "./utils/data/koi_data.json";
import user_data from "./utils/data/user_data.json";
import KoiList from "./pages/manager/koi/KoiList";
import BreederList from "./pages/manager/breeder/BreederList";
import StaffList from "./pages/manager/staff/StaffList.jsx";
import Settings from "./pages/manager/settings/Settings.js";
import { ToastContainer } from "react-toastify";
import UserDetail from "./pages/userdetail/UserDetail";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Kois from "./pages/kois/Kois";
import NotFound from "./components/error/NotFound";
import AuctionDetail from "./pages/auctions/AuctionDetail";
import { Analytics } from "@vercel/analytics/react";
import KoiBidding from "./pages/auctions/KoiBidding";
import OtpVerification from "./components/otp/OtpVeficitaion";

const TITLE = "Auction Koi";

const ProtectedRoute = ({ element }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? element : <Navigate to="/login" />;
};

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

          {/* Error page */}
          <Route path="/notfound" element={<NotFound />} />

          <Route path="/otp-verification" element={<OtpVerification />} />

          {/* User */}
          <Route
            path="/users/:id"
            element={<UserDetail userData={user_data.items} />}
          />

          {/* Auction */}
          <Route path="/auctions" element={<Auctions />} />
          <Route
            path="/auctions/:id"
            element={<AuctionDetail auctionData={koi_data.items} />}
          />
          {/* route for koi bidding */}
          <Route
            path="/auctionkois/:auctionId/:auctionKoiId"
            element={<KoiBidding />}
          />

          {/* Koi */}
          <Route path="/kois" element={<Kois />} />
          <Route
            path="/koi/:id"
            element={<KoiDetail koiData={koi_data.items} />}
          />

          {/* Auction */}

          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route
            path="/manager"
            element={<ProtectedRoute element={<Manager />} />}
          >
            <Route
              path="member"
              element={<ProtectedRoute element={<MemberList />} />}
            />
            <Route
              path="breeder"
              element={<ProtectedRoute element={<BreederList />} />}
            />
            <Route
              path="staff"
              element={<ProtectedRoute element={<StaffList />} />}
            />
            <Route
              path="setting"
              element={<ProtectedRoute element={<Settings />} />}
            />
            <Route
              path="koi"
              element={<ProtectedRoute element={<KoiList />} />}
            />
            <Route
              path="koi-detail"
              element={<ProtectedRoute element={<KoiDetail />} />}
            />
          </Route> */}

          <Route path="/manager" element={<Manager />}>
            <Route path="auctions" element={<Auction />} />
            <Route path="member" element={<MemberList />} />
            <Route path="breeder" element={<BreederList />} />
            <Route path="staff" element={<StaffList />} />
            <Route path="setting" element={<Settings />} />
            <Route path="koi" element={<KoiList />} />
            <Route path="koi-detail" element={<KoiDetail />} />
          </Route>
        </Routes>
        <Footer />
        <ToastContainer />
      </ThemeProvider>
      <Analytics />
      <SpeedInsights />
    </AuthProvider>
  );
}

export default App;
