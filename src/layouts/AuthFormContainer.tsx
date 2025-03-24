import React, { memo } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  children: React.ReactNode;
}

const AuthFormInner: React.FC<Props> = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    {children}
    <ToastContainer />
  </div>
);

const AuthFormLayout = memo(AuthFormInner);

export default AuthFormLayout;
