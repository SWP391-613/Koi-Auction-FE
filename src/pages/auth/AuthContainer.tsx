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

// const SocialLinks = () => (
//   <div className={styles.socialContainer}>
//     <button className="flex items-center justify-center py-2 px-20 bg-white hover:bg-gray-200 focus:ring-blue-500 focus:ring-offset-blue-200 text-gray-700 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">
//       <svg
//         viewBox="0 0 24 24"
//         height="25"
//         width="25"
//         y="0px"
//         x="0px"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <path
//           d="M12,5c1.6167603,0,3.1012573,0.5535278,4.2863159,1.4740601l3.637146-3.4699707 C17.8087769,1.1399536,15.0406494,0,12,0C7.392395,0,3.3966675,2.5999146,1.3858032,6.4098511l4.0444336,3.1929321 C6.4099731,6.9193726,8.977478,5,12,5z"
//           fill="#F44336"
//         ></path>
//         <path
//           d="M23.8960571,13.5018311C23.9585571,13.0101929,24,12.508667,24,12 c0-0.8578491-0.093689-1.6931763-0.2647705-2.5H12v5h6.4862061c-0.5247192,1.3637695-1.4589844,2.5177612-2.6481934,3.319458 l4.0594482,3.204834C22.0493774,19.135437,23.5219727,16.4903564,23.8960571,13.5018311z"
//           fill="#2196F3"
//         ></path>
//         <path
//           d="M5,12c0-0.8434448,0.1568604-1.6483765,0.4302368-2.3972168L1.3858032,6.4098511 C0.5043335,8.0800171,0,9.9801636,0,12c0,1.9972534,0.4950562,3.8763428,1.3582153,5.532959l4.0495605-3.1970215 C5.1484375,13.6044312,5,12.8204346,5,12z"
//           fill="#FFC107"
//         ></path>
//         <path
//           d="M12,19c-3.0455322,0-5.6295776-1.9484863-6.5922241-4.6640625L1.3582153,17.532959 C3.3592529,21.3734741,7.369812,24,12,24c3.027771,0,5.7887573-1.1248169,7.8974609-2.975708l-4.0594482-3.204834 C14.7412109,18.5588989,13.4284058,19,12,19z"
//           fill="#00B060"
//         ></path>
//         <path
//           opacity=".1"
//           d="M12,23.75c-3.5316772,0-6.7072754-1.4571533-8.9524536-3.7786865C5.2453613,22.4378052,8.4364624,24,12,24 c3.5305786,0,6.6952515-1.5313721,8.8881226-3.9592285C18.6495972,22.324646,15.4981079,23.75,12,23.75z"
//         ></path>
//         <polygon
//           opacity=".1"
//           points="12,14.25 12,14.5 18.4862061,14.5 18.587492,14.25"
//         ></polygon>
//         <path
//           d="M23.9944458,12.1470337C23.9952393,12.0977783,24,12.0493774,24,12 c0-0.0139771-0.0021973-0.0274658-0.0022583-0.0414429C23.9970703,12.0215454,23.9938965,12.0838013,23.9944458,12.1470337z"
//           fill="#E6E6E6"
//         ></path>
//         <path
//           opacity=".2"
//           d="M12,9.5v0.25h11.7855721c-0.0157471-0.0825195-0.0329475-0.1680908-0.0503426-0.25H12z"
//           fill="#FFF"
//         ></path>
//         <linearGradient
//           gradientUnits="userSpaceOnUse"
//           y2="12"
//           y1="12"
//           x2="24"
//           x1="0"
//           id="LxT-gk5MfRc1Gl_4XsNKba_xoyhGXWmHnqX_gr1"
//         >
//           <stop stop-opacity=".2" stopColor="#fff" offset="0"></stop>
//           <stop stop-opacity="0" stopColor="#fff" offset="1"></stop>
//         </linearGradient>
//         <path
//           d="M23.7352295,9.5H12v5h6.4862061C17.4775391,17.121582,14.9771729,19,12,19 c-3.8659668,0-7-3.1340332-7-7c0-3.8660278,3.1340332-7,7-7c1.4018555,0,2.6939087,0.4306641,3.7885132,1.140686 c0.1675415,0.1088867,0.3403931,0.2111206,0.4978027,0.333374l3.637146-3.4699707L19.8414307,2.940979 C17.7369385,1.1170654,15.00354,0,12,0C5.3725586,0,0,5.3725586,0,12c0,6.6273804,5.3725586,12,12,12 c6.1176758,0,11.1554565-4.5812378,11.8960571-10.4981689C23.9585571,13.0101929,24,12.508667,24,12 C24,11.1421509,23.906311,10.3068237,23.7352295,9.5z"
//           fill="url(#LxT-gk5MfRc1Gl_4XsNKba_xoyhGXWmHnqX_gr1)"
//         ></path>
//         <path
//           opacity=".1"
//           d="M15.7885132,5.890686C14.6939087,5.1806641,13.4018555,4.75,12,4.75c-3.8659668,0-7,3.1339722-7,7 c0,0.0421753,0.0005674,0.0751343,0.0012999,0.1171875C5.0687437,8.0595093,8.1762085,5,12,5 c1.4018555,0,2.6939087,0.4306641,3.7885132,1.140686c0.1675415,0.1088867,0.3403931,0.2111206,0.4978027,0.333374 l3.637146-3.4699707l-3.637146,3.2199707C16.1289062,6.1018066,15.9560547,5.9995728,15.7885132,5.890686z"
//         ></path>
//         <path
//           opacity=".2"
//           d="M12,0.25c2.9750366,0,5.6829224,1.0983887,7.7792969,2.8916016l0.144165-0.1375122 l-0.110014-0.0958166C17.7089558,1.0843592,15.00354,0,12,0C5.3725586,0,0,5.3725586,0,12 c0,0.0421753,0.0058594,0.0828857,0.0062866,0.125C0.0740356,5.5558472,5.4147339,0.25,12,0.25z"
//           fill="#FFF"
//         ></path>
//       </svg>
//       <span className="ml-2">Sign in with Google</span>
//     </button>
//   </div>
// );

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
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
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
      toast.error("Login failed");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.title}>Sign In</h1>
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
          <FormField
            name="first_name"
            label="First Name"
            control={control}
            errors={errors}
          />
        </div>
        <div className={styles.inputGroup}>
          <FormField
            name="last_name"
            label="Last Name"
            control={control}
            errors={errors}
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <FormField
          name="email"
          label="Email Address"
          type="email"
          control={control}
          errors={errors}
        />
      </div>

      <div className={styles.inputGroup}>
        <FormField
          name="password"
          label="Password"
          type="password"
          control={control}
          errors={errors}
        />
      </div>

      <div className={styles.inputGroup}>
        <FormField
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
