import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import VerifyEmail from "../pages/Auth/VerifyEmail";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import CourseDetail from "../pages/CourseDetail";
import CourseLessons from "../pages/CourseLessons";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Dashboard from "../pages/Dashboard";
import FacilitatorDashboard from "../pages/FacilitatorDashboard";
import TeachOnExpertEdge from "../pages/TeachOnExpertEdge";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "courses/:id",
        element: <CourseDetail />,
      },
      {
        path: "courses/:id/lessons",
        element: <CourseLessons />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "teach",
        element: <TeachOnExpertEdge />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/facilitator",
    element: <FacilitatorDashboard />,
  },
]);
