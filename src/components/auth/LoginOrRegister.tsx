import React from "react";
import { useNavigate } from "react-router-dom";

const LoginOrRegister = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="rounded-2xl bg-gray-300 ml-2 mr-2 pt-10 pb-10 text-center">
      <p className="mb-5 text-xl font-bold">Register today to start bidding!</p>
      <div className="flex justify-center items-center gap-3 w-full">
        <button
          className="rounded-2xl bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          onClick={handleRegister}
        >
          Register
        </button>
        <button
          className="rounded-2xl bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={handleLogin}
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default LoginOrRegister;
