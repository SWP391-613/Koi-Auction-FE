import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../theme/ThemeContext";
import { login, fetchGoogleClientId } from "../../utils/apiUtils";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.scss";
import { setCookie } from "../../utils/cookieUtils";
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const { loginWithGoogle } = useAuth();
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
      console.log(data);
      const response = await login({ ...data });
      setCookie("access_token", response.token, 30); //be must response date
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setError("api", {
        type: "manual",
        message: error.message || "An error occurred during login",
      });
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
      setError("api", {
        type: "manual",
        message:
          error.response?.data?.message ||
          "An error occurred during Google login",
      });
      toast.error(
        error.response?.data?.message ||
          "An error occurred during Google login",
      );
    }
  };

  return (
    <div
      className={`login-container flex h-screen items-center justify-center bg-gray-100 ${isDarkMode ? "dark-mode" : ""}`}
    >
      <form
        className="form flex flex-col gap-4 rounded-lg bg-white p-9 shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="mb-6 text-4xl">Welcome back!</h1>
        <div className="flex flex-col">
          <label className="mb-3 text-lg text-gray-700">Email Address *</label>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                type="email"
                className="input border-indigo mt-1 rounded-lg border-2 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Email Address"
                {...field}
              />
            )}
          />
          {errors.email && (
            <p className="error text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="mb-3 text-lg text-gray-700">Password *</label>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                type="password"
                className="input mt-1 rounded-lg border-2 border-indigo-500 p-2 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Password"
                {...field}
              />
            )}
          />
          {errors.password && (
            <p className="error text-red-500">{errors.password.message}</p>
          )}
        </div>
        <button
          className="button-submit mt-4 h-12 w-full rounded-lg bg-blue-500 text-xl font-bold text-white hover:bg-blue-600"
          type="submit"
        >
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
        <p className="p mb-2 mt-4 text-base leading-relaxed text-gray-700">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="ml-2 rounded bg-pink-500 px-4 py-2 font-bold text-white hover:bg-pink-600"
          >
            Register here
          </Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
