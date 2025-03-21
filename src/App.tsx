import React, { useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // import first

// Cloudinary config
import { Cloudinary } from "@cloudinary/url-gen";

// Vercel integrations
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Context providers
import { AuthProvider } from "./contexts/AuthContext";
import { NavbarProvider, useNavbar } from "./contexts/NavbarContext";

// Components
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import NavBar from "./components/common/NavBar";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import OtpVerification from "./components/common/OtpVeficitaion";
import NotFound from "./components/error/NotFound";
import AuctionDetail from "./pages/auctions/AuctionDetail";
import KoiBidding from "./pages/auctions/KoiBidding";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import KoiDetail from "./pages/kois/KoiDetail";
import About from "./pages/static/About";
import Home from "./pages/static/Home";
import Privacy from "./pages/static/Privacy";
import Terms from "./pages/static/Terms";

// Types
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import InternalServerError from "./components/error/InternalServerError";
import DetailNavbar from "./components/shared/DetailNavbar";
import PageTransition from "./components/shared/PageTransition";
import PaymentTransactions from "./components/shared/PaymentTransactions";
import SendNotifications from "./components/shared/SendNotifications";
import PaymentLayout from "./layouts/PaymentLayout";
import Auctions from "./pages/auctions/Auctions";
import KoiRegisterAuctionDetail from "./pages/auctions/register/KoiRegisterAuctionDetail";
import KoiRegisterAuctions from "./pages/auctions/register/KoiRegisterAuctions";
import AuthContainer from "./pages/auth/AuthContainer";
import ForgotPassword from "./pages/auth/ForgotPassword";
import BlogList from "./pages/blog/BlogList";
import BlogPost from "./pages/blog/BlogPost";
import AddKoi from "./pages/detail/breeder/AddKoi";
import BreederDetail from "./pages/detail/breeder/BreederDetail";
import ManagerDetail from "./pages/detail/manager/ManagerDetail";
import Feedback from "./pages/detail/member/Feedback";
import UserDetail from "./pages/detail/member/UserDetail";
import UserOrder from "./pages/detail/member/UserOrder";
import UserOrderDetail from "./pages/detail/member/UserOrderDetail";
import StaffDetail from "./pages/detail/staff/StaffDetail";
import KoiWishList from "./pages/kois/KoiWishList";
import VerifyKoiList from "./pages/kois/VerifyKoiList";
import { AuctionsManagement } from "./pages/managements/AuctionsManagement";
import OrderManagement from "./pages/managements/OrderManagement";
import PaymentManagement from "./pages/managements/PaymentManagement";
import VNPayReturn from "./pages/payments/VNPayReturn";
import BreederInfo from "./pages/static/BreederInfo";
import KoiManagement from "./pages/managements/KoiManagement";
import BreederManagement from "./pages/managements/BreederManagement";
import StaffManagement from "./pages/manager/staff/StaffManagement";
import MemberManagement from "./pages/managements/MemberManagement";
import KoiOwnerSearch from "./pages/detail/breeder/KoiOwnerSearch";
import ErrorBoundary from "./components/ErrorBoundary";

const TITLE = "Koi Auction";

const theme = createTheme({
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
});

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME, // Thêm vào .env: VITE_CLOUDINARY_CLOUD_NAME=dbke1s5nm
  },
});

function AppContent() {
  const { isNavCollapsed, isMobileNavVisible } = useNavbar();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top on route change
  }, [location]);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="flex flex-col min-h-screen">
              <Helmet>
                <title>{TITLE}</title>
              </Helmet>
              <div className="flex flex-col min-h-screen">
                <NavBar />
                <div className="flex flex-grow">
                  <Header />
                  <main
                    className={`flex-1 transition-all duration-300
                    ${isNavCollapsed ? "md:ml-20" : "md:ml-60"}
                    ${isMobileNavVisible ? "mb-[60px]" : "mb-0"}
                    md:mb-0
                    pt-16`}
                  >
                    <DetailNavbar />
                    <Routes>
                      {/* Public routes */}
                      <Route
                        path="/"
                        element={
                          <PageTransition>
                            <Home />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/about"
                        element={
                          <PageTransition>
                            <About />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/privacy"
                        element={
                          <PageTransition>
                            <Privacy />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/terms"
                        element={
                          <PageTransition>
                            <Terms />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/login"
                        element={
                          <PageTransition>
                            <Login />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/register"
                        element={
                          <PageTransition>
                            <Register />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/auth"
                        element={
                          <PageTransition>
                            <AuthContainer />
                          </PageTransition>
                        }
                      />
                      <Route path="/notfound" element={<NotFound />} />
                      <Route
                        path="/internal-server-error"
                        element={<InternalServerError />}
                      />
                      <Route
                        path="/otp-verification"
                        element={
                          <PageTransition>
                            <OtpVerification />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/auctions"
                        element={
                          <PageTransition>
                            <Auctions />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/auctions/:id"
                        element={
                          <PageTransition>
                            <AuctionDetail />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/auctionkois/:auctionId/:auctionKoiId"
                        element={
                          <PageTransition>
                            <KoiBidding />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                      />
                      <Route
                        path="/breeder/:id/info"
                        element={
                          <PageTransition>
                            <BreederInfo />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/blog"
                        element={
                          <PageTransition>
                            <BlogList />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/blog/:id"
                        element={
                          <PageTransition>
                            <BlogPost />
                          </PageTransition>
                        }
                      />
                      {/* <Route
                      path="/kois"
                      element={
                        <PageTransition>
                          <Kois />
                        </PageTransition>
                      }
                    /> */}

                      {/* Protected routes for logged-in users */}
                      <Route element={<ProtectedRoute />}>
                        <Route
                          path="/auctions/register/:id"
                          element={<KoiRegisterAuctionDetail />}
                        />
                        <Route
                          path="/kois/:id"
                          element={
                            <PageTransition>
                              <KoiDetail />
                            </PageTransition>
                          }
                        />
                        <Route path="/members/*">
                          <Route path="" element={<UserDetail />} />
                          <Route path="orders" element={<UserOrder />} />
                          <Route
                            path="payments"
                            element={<PaymentTransactions />}
                          />
                        </Route>
                        <Route path="/managers/*">
                          <Route path="" element={<ManagerDetail />} />
                          <Route
                            path="auctions"
                            element={<AuctionsManagement />}
                          />
                          <Route path="kois" element={<KoiManagement />} />
                          <Route
                            path="breeders"
                            element={<BreederManagement />}
                          />
                          <Route path="staffs" element={<StaffManagement />} />
                          <Route
                            path="members"
                            element={<MemberManagement />}
                          />
                          <Route path="orders" element={<OrderManagement />} />
                          <Route
                            path="payments"
                            element={<PaymentManagement />}
                          />
                          <Route
                            path="send-notifications"
                            element={<SendNotifications />}
                          />
                        </Route>
                        <Route path="/breeders/*">
                          <Route path="" element={<BreederDetail />} />
                          <Route path="kois" element={<KoiOwnerSearch />} />
                          <Route path="add-koi" element={<AddKoi />} />
                          <Route
                            path="auctions/register"
                            element={<KoiRegisterAuctions />}
                          />
                          <Route path="wishlist" element={<KoiWishList />} />
                          <Route
                            path="payments"
                            element={<PaymentTransactions />}
                          />
                        </Route>
                        <Route path="/staffs/*">
                          <Route path="" element={<StaffDetail />} />
                          <Route
                            path="auctions"
                            element={<AuctionsManagement />}
                          />
                          <Route
                            path="verify/kois"
                            element={<VerifyKoiList />}
                          />
                          <Route path="orders" element={<OrderManagement />} />
                          <Route
                            path="payments"
                            element={<PaymentManagement />}
                          />
                          {/* <Route
                          path="send-notifications"
                          element={<SendNotifications />}
                        /> */}
                        </Route>
                        <Route path="members/orders/*">
                          <Route path="" element={<UserOrder />} />
                          <Route
                            path="order-detail/:orderId"
                            element={<UserOrderDetail />}
                          />
                        </Route>
                        <Route path="/payments/*" element={<PaymentLayout />} />
                        <Route
                          path="/order-detail/:id"
                          element={
                            <PageTransition>
                              <UserOrderDetail />
                            </PageTransition>
                          }
                        />
                        <Route
                          path="/payments/vnpay-payment-return"
                          element={
                            <PageTransition>
                              <VNPayReturn />
                            </PageTransition>
                          }
                        />
                        <Route
                          path="/feedback/:orderId"
                          element={<Feedback orderId={""} />}
                        />
                      </Route>
                    </Routes>
                  </main>
                </div>
                <Footer />
              </div>
            </div>
          </ThemeProvider>
          <Analytics />
          <SpeedInsights />
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

function App() {
  return (
    <NavbarProvider>
      <AppContent />
      <ToastContainer />
    </NavbarProvider>
  );
}

export default App;
