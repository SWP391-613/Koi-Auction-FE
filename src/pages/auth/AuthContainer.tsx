// src/components/Auth/index.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
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

const SocialLinks = () => (
  <div className={styles.socialContainer}>
    <a href="#" className={styles.socialLink}>
      f
    </a>
    <a href="#" className={styles.socialLink}>
      G
    </a>
    <a href="#" className={styles.socialLink}>
      t
    </a>
  </div>
);

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
      <CheckboxField
        name="rememberMe"
        label="Remember me"
        control={control}
        errors={errors}
      />
      <SocialLinks />
      <button className={styles.formButton}>Sign In</button>
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
    <div>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.title}>Create Account</h1>

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

        <button className={styles.formButton}>Create Account</button>
      </form>
    </div>
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
    <div className={styles.wrapper}>
      <div className={`${styles.container} ${isActive ? styles.active : ""}`}>
        <div className={`${styles.formContainer} ${styles.signUp}`}>
          <RegisterForm />
        </div>
        <div className={`${styles.formContainer} ${styles.signIn}`}>
          <LoginForm />
        </div>
        <Overlay isActive={isActive} onToggle={setIsActive} />
      </div>
    </div>
  );
};

export default AuthContainer;
