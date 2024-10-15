import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import { routeUserToEachPage } from "~/components/auth/RoleBasedRoute";
import NavigateButton from "~/components/shared/NavigateButton";
import { LoginDTO } from "~/types/users.type";
import { useAuth } from "../../contexts/AuthContext";
import { login } from "../../utils/apiUtils";
import "react-toastify/dist/ReactToastify.css";
import { extractErrorMessage } from "~/utils/dataConverter";
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login: React.FC = () => {
  const { authLogin } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginDTO) => {
    try {
      console.log(data);
      const response = await login({ ...data });

      // Use authLogin here
      authLogin({
        token: response.token,
        roles: response.roles,
        id: response.id,
        username: response.username,
        refresh_token: response.refresh_token,
      });

      toast.success("Login successful!");
      setTimeout(() => {
        navigate(routeUserToEachPage(response.roles[0]));
      }, 2000);
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        "An error occurred during login",
      );
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className={`login-container flex h-screen items-center justify-center bg-gray-100`}
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
        <div className="flex justify-center items-center">
          <Typography
            variant="h6"
            sx={{ fontSize: "15px", textAlign: "center" }}
          >
            Don&apos;t have an account?
          </Typography>

          <NavigateButton
            text="Register here"
            to="/register"
            className="ml-2 rounded px-4 py-2 font-bold text-blue-500 bg-white hover:bg-white"
          />
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
