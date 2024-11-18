// src/components/Auth/index.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer } from "react-toastify";
import {
  loginValidationSchema,
  registerValidationSchema,
} from "~/utils/validation.utils";
import { login, register as registerUser } from "~/utils/apiUtils";
import { useAuth } from "~/contexts/AuthContext";
import { routeUserToEachPage } from "~/components/auth/RoleBasedRoute";
import FormField from "~/components/forms/FormField";
import CheckboxField from "~/components/forms/CheckboxField";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import * as yup from "yup";
import { sendOtpForgotPassword } from "~/utils/apiUtils";
import { motion } from "framer-motion";
import { GENERAL_TOAST_MESSAGE, OTP_TOAST_MESSAGE } from "~/constants/message";
import FancyFormField from "~/components/shared/FancyFormField";

const LoginForm = () => {
  const { authLogin } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    getValues,
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
        toast.error(OTP_TOAST_MESSAGE.FAILED_TO_SEND_OTP);
      }
    } catch (error) {
      toast.error(GENERAL_TOAST_MESSAGE.UNEXPECTED_ERROR);
    }
  };

  const onSubmit = async (data) => {
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
      toast.error("Wrong email or password");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.title}>Sign In</h1>
      <FancyFormField
        name="email"
        label="Email Address"
        type="email"
        control={control}
        errors={errors}
      />
      <FancyFormField
        name="password"
        label="Password"
        type="password"
        control={control}
        errors={errors}
      />
      <div className="flex justify-between items-center w-full">
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm text-blue-500 hover:text-blue-700 transition-colors duration-200"
        >
          Forgot password?
        </button>
        <CheckboxField
          name="rememberMe"
          label="Remember me"
          control={control}
          errors={errors}
        />
      </div>
      <button className={styles.formButton}>Sign In</button>
      <div className="flex flex-col items-center">
        <span className="w-1/5 border-b dark:border-gray-600 md:w-1/2 mx-auto"></span>
        {/* <Typography variant="h6" className="text-gray-500">
          Or continue with
        </Typography> */}
        {/* <SocialLinks /> */}
      </div>
    </form>
  );
};

const RegisterForm = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerValidationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      receiveEmailNotifications: true,
      acceptPolicy: true,
    },
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success("Registered successfully");
      navigate("/otp-verification", {
        state: {
          email: data.email,
          from: "register",
          statusCode: 200,
        },
      });
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.title}>Sign Up</h1>

      <div className={styles.nameFieldsContainer}>
        <div className={styles.inputGroup}>
          <FancyFormField
            name="first_name"
            label="First Name"
            control={control}
            errors={errors}
          />
        </div>
        <div className={styles.inputGroup}>
          <FancyFormField
            name="last_name"
            label="Last Name"
            control={control}
            errors={errors}
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <FancyFormField
          name="email"
          label="Email Address"
          type="email"
          control={control}
          errors={errors}
        />
      </div>

      <div className={styles.inputGroup}>
        <FancyFormField
          name="password"
          label="Password"
          type="password"
          control={control}
          errors={errors}
        />
      </div>

      <div className={styles.inputGroup}>
        <FancyFormField
          name="confirm_password"
          label="Confirm Password"
          type="password"
          control={control}
          errors={errors}
        />
      </div>

      <div className={styles.checkboxGroup}>
        <CheckboxField
          name="acceptPolicy"
          label="I agree to the terms and policy"
          control={control}
          errors={errors}
        />
      </div>
      <div className={styles.checkboxGroup}>
        <CheckboxField
          name="receiveEmailNotifications"
          label="Send me promotional emails about AuctionKoi auctions"
          control={control}
          errors={errors}
        />
      </div>

      <button className={styles.formButton}>Submit</button>
    </form>
  );
};

const Overlay = ({
  isActive,
  onToggle,
}: {
  isActive: boolean;
  onToggle: (value: boolean) => void;
}) => (
  <div className={styles.overlayContainer}>
    <div className={styles.overlay}>
      {!isActive ? (
        <div className={styles.overlayPanel}>
          <h1>Welcome Back!</h1>
          <p>To keep connected with us please login with your personal info</p>
          <button
            className={styles.overlayButton}
            onClick={() => onToggle(true)}
          >
            Sign Up
          </button>
        </div>
      ) : (
        <div className={styles.overlayPanel}>
          <h1>Hello, Friend!</h1>
          <p>Enter your personal details and start journey with us</p>
          <button
            className={styles.overlayButton}
            onClick={() => onToggle(false)}
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  </div>
);

const AuthContainer = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <div className={styles.full}>
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className={`${styles.container} ${isActive ? styles.active : ""}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className={`${styles.formContainer} ${styles.signUp}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <RegisterForm />
            </motion.div>
            <motion.div
              className={`${styles.formContainer} ${styles.signIn}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <LoginForm />
            </motion.div>
            <Overlay isActive={isActive} onToggle={setIsActive} />
          </motion.div>
        </motion.div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AuthContainer;
