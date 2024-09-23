import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../theme/ThemeContext";
import { login, fetchGoogleClientId } from "../../utils/apiUtils";
import { GoogleLogin } from "@react-oauth/google";
import "./Login.scss";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const { login } = useAuth();
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [googleClientId, setGoogleClientId] = useState("");

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const loadGoogleClientId = async () => {
      const clientId = await fetchGoogleClientId();
      if (clientId) {
        setGoogleClientId(clientId);
      }
    };
    loadGoogleClientId();
  }, []);

  const onSubmit = async (data) => {
    try {
      localStorage.setItem("token", response.token);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      setError("api", { type: "manual", message: error.message || "An error occurred during login" });
      toast.error(error.message || "An error occurred during login");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/oauth2/google",
        {
          token: credentialResponse.credential,
        },
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        toast.success("Google login successful!");
        navigate("/");
      } else {
        setError("api", { type: "manual", message: "Google login failed" });
        toast.error("Google login failed");
      }
    } catch (error) {
      setError("api", { type: "manual", message: error.response?.data?.message || "An error occurred during Google login" });
      toast.error(error.response?.data?.message || "An error occurred during Google login");
    }
  };

  return (
    <div className={`login-container flex justify-center items-center h-lvh bg-[#f0f2f5] ${isDarkMode ? "dark-mode" : ""}`}>
      <form className="form flex flex-col gap-4 bg-[#ffffff] p-9" onSubmit={handleSubmit(onSubmit)}>
        {errors.api && <p className="error">{errors.api.message}</p>}
        <h1 className="text-4xl mb-6">Welcome back!</h1>
        <div className="flex-column">
          <label className="text semi-bold text-[#151717]">Email Address *</label>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                type="email"
                className="input cursor-pointer"
                placeholder="Enter your Email Address"
                {...field}
              />
            )}
          />
          {errors.email && <p className="error text-red-500">{errors.email.message}</p>}
        </div>
        <div className="flex-column">
          <label className="text semi-bold text-[#151717]">Password *</label>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                type="password"
                className="input cursor-pointer"
                placeholder="Enter your Password"
                {...field}
              />
            )}
          />
          {errors.password && <p className="error text-red-500">{errors.password.message}</p>}
        </div>
        <button className="button-submit w-full h-[50px] font-bold my-[10px] mt-[20px] cursor-pointer rounded text-xl text-white border-none bg-[#3498db]" type="submit">
          Log In
        </button>
        {googleClientId && (
          <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google login failed")}
              useOneTap
              shape={"square"}
              size={"large"}
              width={390}
            />
          </GoogleOAuthProvider>
        )}
        <p className="p text-gray-700 text-base mt-4 mb-2 leading-relaxed">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="ml-4 bg-[#ec4b80] rounded text-white font-bold py-2 px-4 rounded hover:bg-blue-400 focus:outline-none no-underline">
            Register here
          </Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
