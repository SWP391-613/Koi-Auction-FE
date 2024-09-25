import React, { useContext, useEffect } from "react";
import { ThemeContext } from "../theme/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../utils/apiUtils";
import { useForm, Controller } from "react-hook-form";
import "./Register.scss";
import * as yup from "yup"; // Import yup
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { yupResolver } from "@hookform/resolvers/yup"; // Import yup resolver

const schema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    ),
  confirm_password: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"), // Use oneOf for confirm password
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});

const Register = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      receiveEmailNotifications: true,
      acceptPolicy: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await register({ ...data });
      console.log("Registration successful:", response);
      toast.success("Register successfully");
      // localStorage.setItem("access_token", response.token);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setError("api", {
        type: "manual",
        message: error.message || "An error occurred during registration",
      });
      toast.error(error.message || "An error occurred during registration");
    }
    console.log("Registration attempt with:", data);
  };

  return (
    <div
      className={`register-container flex h-lvh items-center justify-center bg-[#f0f2f5] ${isDarkMode ? "dark-mode" : ""}`}
    >
      <form
        className="form flex flex-col gap-4 bg-[#f8f9fa] p-9"
        onSubmit={handleSubmit(onSubmit)}
      >
        {errors.api && (
          <p className="error text-red-500">{errors.api.message}</p>
        )}
        <h1 className="mb-6 text-4xl">Register</h1>
        <div className="name-container">
          <div className="flex">
            {/* First Name Field */}
            <Controller
              name="first_name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div className="flex flex-1 flex-col">
                  <label className="text semi-bold text-[#121212]">
                    First Name *
                  </label>
                  <input
                    type="text"
                    className="input h-12 rounded-lg border px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="First Name"
                    {...field}
                  />
                  {errors.first_name && (
                    <p className="error text-red-500">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>
              )}
            />
            {/* Last Name Field */}
            <Controller
              name="last_name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div className="flex flex-1 flex-col">
                  <label className="text semi-bold text-[#121212]">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    className="input h-12 rounded-lg border px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Last Name"
                    {...field}
                  />
                  {errors.last_name && (
                    <p className="error text-red-500">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </div>
        {/* Email Field */}
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div className="flex-column">
              <label className="text semi-bold text-[#121212]">
                Email Address *
              </label>
              <input
                type="email"
                className="input h-12 rounded-lg border px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
                {...field}
              />
              {errors.email && (
                <p className="error text-red-500">{errors.email.message}</p>
              )}
            </div>
          )}
        />
        {/* Password Field */}
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{ required: "Password is required" }}
          render={({ field }) => (
            <div className="flex-column">
              <label className="text semi-bold text-[#121212]">
                Password *
              </label>
              <input
                type="password"
                className="input h-12 rounded-lg border px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                {...field}
              />
              {errors.password && (
                <p className="error text-red-500">{errors.password.message}</p>
              )}
            </div>
          )}
        />
        {/* Confirm Password Field */}
        <Controller
          name="confirm_password"
          control={control}
          defaultValue=""
          rules={{
            required: "Confirm Password is required",
            validate: (value) =>
              value === watch("password") || "Passwords do not match.",
          }}
          render={({ field }) => (
            <div className="flex-column">
              <label className="text semi-bold text-[#121212]">
                Confirm Password *
              </label>
              <input
                type="password"
                className="input h-12 rounded-lg border px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm Password"
                {...field}
              />
              {errors.confirm_password && (
                <p className="error text-red-500">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>
          )}
        />
        {/* Email Notifications Field */}
        <div className="mb-4 flex items-center">
          <Controller
            name="receiveEmailNotifications"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <>
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...field}
                  checked={field.value}
                />
                <label className="ml-2 text-[#121212]">
                  Send me promotional emails about AuctionKoi auctions
                </label>
              </>
            )}
          />
        </div>
        {/* Accept Policy Field */}
        <div className="mb-4 flex items-center">
          <Controller
            name="acceptPolicy"
            control={control}
            defaultValue={false}
            rules={{ required: "You must accept the policy" }}
            render={({ field }) => (
              <>
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...field}
                  checked={field.value}
                />
                <label className="ml-2 text-[#121212]">
                  I agree to the terms and policy *
                </label>
                {errors.acceptPolicy && (
                  <p className="error text-red-500">
                    {errors.acceptPolicy.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
        <button
          className="button-submit text w-full cursor-pointer border-none bg-[#FF4081] text-xl font-bold text-white"
          type="submit"
        >
          Register
        </button>
        <p className="p mb-2 mt-4 text-base font-bold leading-relaxed text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="ml-4 rounded bg-blue-500 px-4 py-2 font-bold text-white no-underline hover:bg-blue-400 focus:outline-none"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
