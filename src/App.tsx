import React from "react";
import { Helmet } from "react-helmet";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // import first

// Vercel integrations
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Context providers
import { AuthProvider } from "./contexts/AuthContext";

// Components
import ProtectedRoute from "./components/common/ProtectedRoute";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";

// Pages
import NotFound from "./components/error/NotFound";
import OtpVerification from "./components/otp/OtpVeficitaion";
import ManagerLayout from "./layouts/ManagerLayout";
import AuctionDetail from "./pages/auctions/AuctionDetail";
import KoiBidding from "./pages/auctions/KoiBidding";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserDetail from "./pages/detail/member/UserDetail";
import UserOrder from "./pages/detail/member/UserOrder";
import KoiDetail from "./pages/kois/KoiDetail";
import About from "./pages/static/About";
import Home from "./pages/static/Home";
import Privacy from "./pages/static/Privacy";
import Terms from "./pages/static/Terms";
// Types
import BreederLayout from "./layouts/BreederLayout";
import StaffLayout from "./layouts/StaffLayout";
import Auctions from "./pages/auctions/Auctions";
import AddKoiToAuction from "./pages/auctions/register/AddKoiToAuction";
import KoiRegisterAuctionDetail from "./pages/auctions/register/KoiRegisterAuctionDetail";
import VNPayReturn from "./pages/payments/VNPayReturn";
import ForgotPassword from "./pages/auth/ForgotPassword";
import InternalServerError from "./components/error/NotFound";
import Feedback from './pages/detail/member/Feedback';

const TITLE = "Auction Koi";

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Helmet>
          <title>{TITLE}</title>
        </Helmet>
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/notfound" element={<NotFound />} />
            <Route
              path="/internal-server-error"
              element={<InternalServerError />}
            />
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/auctions/:id" element={<AuctionDetail />} />
            <Route
              path="/auctionkois/:auctionId/:auctionKoiId"
              element={<KoiBidding />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected routes for logged-in users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/kois/:id" element={<KoiDetail />} />
              <Route path="/users/:id" element={<UserDetail />} />
              <Route path="/auctions/register" element={<AddKoiToAuction />} />
              <Route
                path="/auctions/register/:id"
                element={<KoiRegisterAuctionDetail />}
              />
            </Route>

            {/* Manager and Staff protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/managers/*" element={<ManagerLayout />}></Route>
            </Route>

            {/* Breeder protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/breeders/*" element={<BreederLayout />}></Route>
            </Route>

            {/* Staff protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/staffs/*" element={<StaffLayout />}></Route>
            </Route>
            {/* Protected routes for USER */}
            <Route element={<ProtectedRoute />}>
              <Route path="/orders" element={<UserOrder />} />
              <Route
                path="/payments/vnpay-payment-return"
                element={<VNPayReturn />}
              />
            </Route>
            <Route path="/feedback/:orderId" element={<Feedback />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer />
      </div>
      <Analytics />
      <SpeedInsights />
    </AuthProvider>
  );
}

export default App;
