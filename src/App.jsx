import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import { AuthProvider, useAuth } from "./AuthContext";
import KoiDetail from "./pages/koiDetail/KoiDetail";
import koi_data from "./utils/data/koi_data.json";
import KoiList from "./pages/manager/koi/KoiList.jsx";
import BreederList from "./pages/manager/breeder/BreederList.jsx";
import StaffList from "./pages/manager/staff/StaffList.jsx";
import Settings from "./pages/manager/settings/Settings.jsx";
import { ToastContainer } from "react-toastify";

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
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
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
          </Route>
          <Route
            path="/koi/:id"
            element={<KoiDetail koiData={koi_data.items} />}
          />
        </Routes>
        <Footer />
        <ToastContainer />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
