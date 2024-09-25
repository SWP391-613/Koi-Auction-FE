import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../theme/ThemeContext";
import { login, fetchGoogleClientId } from "../../utils/apiUtils";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.scss";
import { setCookie } from "../../utils/cookieUtils";
import NavigateButton from "../../components/shared/NavigateButton.tsx";
const schema = yup.object().shape({
  email: yup.string().email("Invalid email address").required("Email is required"),
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
      const response = await login({...data});
      setCookie("access_token", response.token, 30); //be must response date
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
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
    <div className={`login-container flex justify-center items-center h-screen bg-gray-100 ${isDarkMode ? "dark-mode" : ""}`}>
      <form className="form flex flex-col gap-4 bg-white p-9 shadow-md rounded-lg" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-4xl mb-6">Welcome back!</h1>
        <div className="flex flex-col">
          <label className="text-lg text-gray-700 mb-3">Email Address *</label>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                type="email"
                className="input mt-1 p-2 border-2 border-indigo rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Email Address"
                {...field}
              />
            )}
          />
          {errors.email && <p className="error text-red-500">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col">
          <label className="text-lg text-gray-700 mb-3">Password *</label>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                type="password"
                className="input mt-1 p-2 border-2 border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                placeholder="Enter your Password"
                {...field}
              />
            )}
          />
          {errors.password && <p className="error text-red-500">{errors.password.message}</p>}
        </div>
        <button className="button-submit w-full h-12 font-bold mt-4 rounded-lg text-xl text-white bg-blue-500 hover:bg-blue-600" type="submit">
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
          <Link to="/register" className="ml-2 bg-pink-500 rounded text-white font-bold py-2 px-4 hover:bg-pink-600">
            Register here
          </Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
