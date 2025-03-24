import React, { lazy, useContext } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/static/Home"));
const About = lazy(() => import("./pages/static/About"));
const Privacy = lazy(() => import("./pages/static/Privacy"));
const Terms = lazy(() => import("./pages/static/Terms"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const AuthContainer = lazy(() => import("./pages/auth/AuthContainer"));
const OtpVerification = lazy(
  () => import("./components/common/OtpVeficitaion"),
);
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const NotFound = lazy(() => import("./pages/error/NotFound"));
const InternalServerError = lazy(
  () => import("./pages/error/InternalServerError"),
);

// Auctions
const Auctions = lazy(() => import("./pages/auctions/Auctions"));
const AuctionDetail = lazy(() => import("./pages/auctions/AuctionDetail"));

// Blog
const BlogList = lazy(() => import("./pages/blog/BlogList"));
const BlogPost = lazy(() => import("./pages/blog/BlogPost"));

// Protected Routes - Mem
const KoiDetail = lazy(() => import("./pages/kois/KoiDetail"));
const UserDetail = lazy(() => import("./pages/detail/member/UserDetail"));
const UserOrder = lazy(() => import("./pages/detail/member/UserOrder"));
const PaymentTransactions = lazy(
  () => import("./components/shared/PaymentTransactions"),
);
const UserOrderDetail = lazy(
  () => import("./pages/detail/member/UserOrderDetail"),
);
const KoiRegisterAuctionDetail = lazy(
  () => import("./pages/auctions/register/KoiRegisterAuctionDetail"),
);

// Protected Routes - Payments
const PaymentLayout = lazy(() => import("./layouts/PaymentLayout"));
const VNPayReturn = lazy(() => import("./pages/payments/VNPayReturn"));
const Feedback = lazy(() => import("./pages/feedback/Feedback"));

// Protected Routes - Manager
const ManagerDetail = lazy(
  () => import("./pages/detail/manager/ManagerDetail"),
);
const AuctionsManagement = lazy(
  () => import("./pages/managements/AuctionManagement/index"),
);
const KoiManagement = lazy(
  () => import("./pages/managements/KoiManagement/index"),
);
const BreederManagement = lazy(
  () => import("./pages/managements/UserManagement/BreederManagement/index"),
);
const StaffManagement = lazy(() => import("./pages/manager/StaffManagement"));
const MemberManagement = lazy(
  () =>
    import(
      "./pages/managements/UserManagement/MemberManagement/MemberManagement"
    ),
);
const OrderManagement = lazy(
  () => import("./pages/managements/OrderManagement/OrderManagement"),
);
const PaymentManagement = lazy(
  () => import("./pages/managements/PaymentManagement/PaymentManagement"),
);
const SendNotifications = lazy(
  () => import("./components/shared/SendNotifications"),
);

// Protected Routes - Breeder
const BreederDetail = lazy(
  () => import("./pages/detail/breeder/BreederDetail"),
);
const KoiOwnerSearch = lazy(
  () => import("./pages/detail/breeder/KoiOwnerSearch"),
);
const AddKoi = lazy(() => import("./pages/detail/breeder/AddKoi"));
const KoiRegisterAuctions = lazy(
  () => import("./pages/auctions/register/KoiRegisterAuctions"),
);
const KoiWishList = lazy(() => import("./pages/kois/KoiWishList"));

// Protected Routes - Staff
const StaffDetail = lazy(() => import("./pages/detail/staff/StaffDetail"));
const VerifyKoiList = lazy(() => import("./pages/kois/VerifyKoiList"));

// Protected route component
function ProtectedRoute() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { isLoggedIn } = authContext;
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}

// Rejected route component (for auth pages)
function RejectedRoute() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { isLoggedIn } = authContext;
  return !isLoggedIn ? <Outlet /> : <Navigate to="/" />;
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    // Public routes
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/privacy",
      element: <Privacy />,
    },
    {
      path: "/terms",
      element: <Terms />,
    },
    {
      path: "/auctions",
      element: <Auctions />,
    },
    {
      path: "/auctions/:id",
      element: <AuctionDetail />,
    },
    {
      path: "/blog",
      element: <BlogList />,
    },
    {
      path: "/blog/:id",
      element: <BlogPost />,
    },
    {
      path: "/notfound",
      element: <NotFound />,
    },
    {
      path: "/internal-server-error",
      element: <InternalServerError />,
    },

    // Rejected routes (for non-authenticated users only)
    {
      element: <RejectedRoute />,
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/auth",
          element: <AuthContainer />,
        },
        {
          path: "/otp-verification",
          element: <OtpVerification />,
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword />,
        },
      ],
    },

    // Protected routes (for authenticated users only)
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/auctions/register/:id",
          element: <KoiRegisterAuctionDetail />,
        },
        {
          path: "/kois/:id",
          element: <KoiDetail />,
        },
        {
          path: "/members",
          element: <UserDetail />,
        },
        {
          path: "/members/orders",
          element: <UserOrder />,
        },
        {
          path: "/members/payments",
          element: <PaymentTransactions />,
        },
        {
          path: "/members/orders/order-detail/:orderId",
          element: <UserOrderDetail />,
        },
        {
          path: "/order-detail/:id",
          element: <UserOrderDetail />,
        },
        {
          path: "/managers",
          element: <ManagerDetail />,
        },
        {
          path: "/managers/auctions",
          element: <AuctionsManagement />,
        },
        {
          path: "/managers/kois",
          element: <KoiManagement />,
        },
        {
          path: "/managers/breeders",
          element: <BreederManagement />,
        },
        {
          path: "/managers/staffs",
          element: <StaffManagement />,
        },
        {
          path: "/managers/members",
          element: <MemberManagement />,
        },
        {
          path: "/managers/orders",
          element: <OrderManagement />,
        },
        {
          path: "/managers/payments",
          element: <PaymentManagement />,
        },
        {
          path: "/managers/send-notifications",
          element: <SendNotifications />,
        },
        {
          path: "/breeders",
          element: <BreederDetail />,
        },
        {
          path: "/breeders/kois",
          element: <KoiOwnerSearch />,
        },
        {
          path: "/breeders/add-koi",
          element: <AddKoi />,
        },
        {
          path: "/breeders/auctions/register",
          element: <KoiRegisterAuctions />,
        },
        {
          path: "/breeders/wishlist",
          element: <KoiWishList />,
        },
        {
          path: "/breeders/payments",
          element: <PaymentTransactions />,
        },
        {
          path: "/staffs",
          element: <StaffDetail />,
        },
        {
          path: "/staffs/auctions",
          element: <AuctionsManagement />,
        },
        {
          path: "/staffs/verify/kois",
          element: <VerifyKoiList />,
        },
        {
          path: "/staffs/orders",
          element: <OrderManagement />,
        },
        {
          path: "/staffs/payments",
          element: <PaymentManagement />,
        },
        {
          path: "/payments/*",
          element: <PaymentLayout />,
        },
        {
          path: "/payments/vnpay-payment-return",
          element: <VNPayReturn />,
        },
        {
          path: "/feedback/:orderId",
          element: <Feedback orderId={""} />,
        },
      ],
    },

    // 404 page - catch all non-matching routes
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return routeElements;
}
