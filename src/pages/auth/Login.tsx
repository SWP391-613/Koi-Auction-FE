import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import { routeUserToEachPage } from "~/components/auth/RoleBasedRoute";
import NavigateButton from "~/components/shared/NavigateButton";
import { LoginDTO } from "~/types/users.type";
import { extractErrorMessage } from "~/utils/dataConverter";
import { loginValidationSchema } from "~/utils/validation.utils";
import { useAuth } from "../../contexts/AuthContext";
import { login, sendOtpForgotPassword } from "../../utils/apiUtils";

const Login: React.FC = () => {
  const { authLogin } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
  });

  const handleForgotPassword = async () => {
    const email = getValues("email");
    if (!email || !yup.string().email().isValidSync(email)) {
      // Show an error message if the email is empty or invalid
      toast.error("Please enter a valid email address to reset your password.");
      return;
    }

    const response = await sendOtpForgotPassword(email);

    if (response.status == 200) {
      navigate("/otp-verification", {
        state: {
          email: email,
          from: "login",
          statusCode: 200,
        },
      });
    } else {
      alert("Failed to send OTP");
    }
  };

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
        <div className="flex justify-between gap-10 items-center">
          <Button
            size="small"
            disableElevation
            variant="text"
            color="primary"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </Button>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  sx={{
                    marginRight: 0,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyItems: "center",
                  }}
                  size="small"
                />
              }
              label="Remember me"
            />
          </FormGroup>
        </div>
        <button
          className="button-submit h-12 w-full rounded-lg bg-blue-500 text-xl font-bold text-white hover:bg-blue-600"
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
