import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../theme/ThemeContext";
import { fetchGoogleClientId } from "../../utils/apiUtils";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import "./Login.scss";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import testAccounts from "../../utils/testAccounts.ts";
import NavigateButton from "../../components/shared/NavigateButton.tsx";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [googleClientId, setGoogleClientId] = useState("");

  useEffect(() => {
    const loadGoogleClientId = async () => {
      const clientId = await fetchGoogleClientId();
      if (clientId) {
        setGoogleClientId(clientId);
      }
    };
    loadGoogleClientId();
  }, []);

  // Log only if googleClientId is still empty after loading
  useEffect(() => {
    if (!googleClientId) {
      console.log("Google client ID not available");
    }
  }, [googleClientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const account of testAccounts) {
        if (account.email === email && account.password === password) {
          // Role-based routing
          login(account);
          let role = account.role;
          let route = `/${account.role}`;
          navigate(`/${account.role}`);
          if (role === 0) {
            route = `/member`;
          }
          if (role === 1) {
            route = `/staff`;
          }
          if (role === 2) {
            route = `/breeder`;
          }
          if (role === 3) {
            route = `/manager`;
          }
          navigate(route);
          return;
        }
      }
      // Uncomment this if you want to use the normal login API
      // const data = await login(email, password);
      // localStorage.setItem("token", data.token);
      // navigate("/");
    } catch (error) {
      setError(error.message || "An error occurred during login");
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
        navigate("/");
      } else {
        setError("Google login failed");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred during Google login",
      );
    }
  };

  return (
    <div
      className={`login-container flex h-lvh items-center justify-center bg-[#f0f2f5] ${isDarkMode ? "dark-mode" : ""}`}
    >
      <form
        className="form flex flex-col gap-4 bg-[#ffffff] p-9"
        onSubmit={handleSubmit}
      >
        {error && <p className="error">{error}</p>}
        <h1 className="mb-6 text-4xl">Welcome back!</h1>
        <div className="flex-column">
          <label className="text semi-bold text-[#151717]">
            Email Address *
          </label>
        </div>
        <div className="inputForm p-e flex h-12 items-center">
          <input
            type="email"
            className="input cursor-pointer"
            placeholder="Enter your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex-column">
          <label className="text semi-bold text-[#151717]">Password *</label>
        </div>
        <div className="inputForm flex h-12 items-center pl-2.5">
          <input
            type="password"
            className="input cursor-pointer"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <NavigateButton
          text="Login In"
          to="/login"
          className="my-[10px] mt-[20px] h-[50px] w-full rounded-xl border-none bg-blue-500 text-xl font-bold text-white hover:bg-blue-600"
        />
        {/* Google Login Section */}
        {googleClientId && (
          <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed")}
              useOneTap
              shape={"square"}
              size={"large"}
              width={390}
            />
          </GoogleOAuthProvider>
        )}
        <div className="flex w-full items-center justify-center p-4">
          <p className="mb-2 mt-4 text-base leading-relaxed text-gray-700">
            Don&apos;t have an account?{" "}
          </p>
          <NavigateButton
            text="Register here"
            to="/register"
            className="ml-4 bg-red-500 hover:bg-red-400"
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
