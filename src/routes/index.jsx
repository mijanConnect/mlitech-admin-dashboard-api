import { createBrowserRouter } from "react-router-dom";
import Auth from "../Layout/Auth/Auth";
import Main from "../Layout/Main/Main";
import Home from "../Pages/Dashboard/Home";
import PrivacyPolicy from "../Pages/Dashboard/PrivacyPolicy";
import TermsAndConditions from "../Pages/Dashboard/TermsAndCondition";
import ChangePassword from "../Pages/Auth/ChangePassword";
import Login from "../Pages/Auth/Login";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import NotFound from "../NotFound";
import Notifications from "../Pages/Dashboard/Notifications";
import AdminProfile from "../Pages/Dashboard/AdminProfile/AdminProfile";
import SaleRepsManagement from "../Pages/Dashboard/SaleRepsManagement";
import LoyaltyProgram from "../Pages/Dashboard/LoyaltyProgram";
import SubscriptionTable from "../components/subscriber/SubscriberTable";
import PackagesPlans from "../Pages/Dashboard/Subscription";
import Contact from "../Pages/Dashboard/Contact";
import ResetSuccess from "../Pages/Auth/ResetSuccess";
import SetPassword from "../Pages/Auth/SetPassword";
import CustomerManagement from "../components/customerManagement/customerManagement";
import TierSystem from "../components/TierSystem/TierSystem";
import PromotionManagement from "../components/promotionManagement/PromotionManagement";
import SalesRepPortal from "../components/salesRepPortal/SalesRepPortal";
import AuditLogs from "../components/auditLogs/AuditLogs";
import LoginCredentials from "../components/loginCredentials/LoginCredentials";
import ReportingAnalytics from "../components/reportingAnalytics/ReportingAnalytics";
import PushNotifications from "../components/pushNotifications/PushNotifications";
import PrivateRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    element: (
      <PrivateRoute>
        <Main />
      </PrivateRoute>
    ),
    // path: "/",
    // element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/merchantManagement",
        element: <SaleRepsManagement />,
      },
      {
        path: "/customerManagement",
        element: <CustomerManagement />,
      },
      {
        path: "/tierSystem",
        element: <TierSystem />,
      },
      {
        path: "/subsciption",
        element: <SubscriptionTable />,
      },
      {
        path: "/promotionManagement",
        element: <PromotionManagement />,
      },
      {
        path: "/salesRepPortal",
        element: <SalesRepPortal />,
      },
      {
        path: "/auditLogs",
        element: <AuditLogs />,
      },
      {
        path: "/userManagement",
        element: <LoginCredentials />,
      },
      {
        path: "/reportingAnalytics",
        element: <ReportingAnalytics />,
      },
      {
        path: "/pushNotification",
        element: <PushNotifications />,
      },
      {
        path: "/loyaltyProgram",
        element: <LoyaltyProgram />,
      },

      {
        path: "/subscription",
        element: <PackagesPlans />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-and-conditions",
        element: <TermsAndConditions />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
      },
      {
        path: "/profile",
        element: <AdminProfile />,
      },
      {
        path: "/notification",
        element: <Notifications />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "/auth",
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "reset-success",
        element: <ResetSuccess />,
      },
      {
        path: "set-password",
        element: <SetPassword />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
