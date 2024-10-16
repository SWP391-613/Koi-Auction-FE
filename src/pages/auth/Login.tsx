// src/pages/Login.tsx
import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import NavigateButton from "~/components/shared/NavigateButton";
import { LoginDTO } from "~/types/users.type";
import { extractErrorMessage } from "~/utils/dataConverter";
import { loginValidationSchema } from "~/utils/validation.utils";
import { useAuth } from "../../contexts/AuthContext";
import { login, sendOtpForgotPassword } from "../../utils/apiUtils";
import FormField from "~/components/forms/FormField";
import CheckboxField from "~/components/forms/CheckboxField";
import AuthFormContainer from "~/components/forms/AuthFormContainer";
import { routeUserToEachPage } from "~/components/auth/RoleBasedRoute";

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
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const handleForgotPassword = async () => {
    const email = getValues("email");
    if (!email || !(await yup.string().email().isValid(email))) {
      toast.error("Please enter a valid email address to reset your password.");
      return;
    }

    try {
      const response = await sendOtpForgotPassword(email);
      if (response.status === 200) {
        navigate("/otp-verification", {
          state: {
            email,
            from: "login",
            statusCode: 200,
          },
        });
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  const onSubmit = async (data: LoginDTO) => {
    try {
      const response = await login(data);

      authLogin({
        token: response.token,
        roles: response.roles,
        id: response.id,
        username: response.username,
        refresh_token: response.refresh_token,
      });

      toast.success("Login successfully!");
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
    <AuthFormContainer>
      <form
        className="form flex flex-col gap-4 rounded-lg bg-white p-9 shadow-md w-full max-w-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="mb-6 text-4xl text-center">Welcome back!</h1>

        <FormField
          name="email"
          label="Email Address"
          type="email"
          control={control}
          errors={errors}
        />

        <FormField
          name="password"
          label="Password"
          type="password"
          control={control}
          errors={errors}
        />

        <div className="flex justify-between items-center">
          <Button
            size="small"
            disableElevation
            variant="text"
            color="primary"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </Button>
          <CheckboxField
            name="rememberMe"
            label="Remember me"
            control={control}
            errors={errors}
          />
        </div>

        <button
          className="button-submit h-12 w-full rounded-lg bg-blue-500 text-xl font-bold text-white hover:bg-blue-600 transition duration-200"
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
    </AuthFormContainer>
  );
};

export default Login;
