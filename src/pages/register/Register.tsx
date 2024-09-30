import React, { useContext } from "react";
import { useForm, Controller, Control, FieldErrors } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../../utils/apiUtils";
import { RegisterDTO } from "~/dtos/register.dto";

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  control: Control<any>;
  errors: FieldErrors;
}

interface CheckboxFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  errors?: FieldErrors;
}

const schema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
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
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  acceptPolicy: yup.boolean().oneOf([true], "You must accept the policy"),
});

const Register = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setError,
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

  const onSubmit = async (data: RegisterDTO) => {
    try {
      const response = await register(data);
      console.log("Registration successful:", response);
      toast.success("Registered successfully");
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      toast.error(error?.message || "An error occurred during registration");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-100 p-4`}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign up
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            name="first_name"
            label="First Name"
            control={control}
            errors={errors}
          />
          <FormField
            name="last_name"
            label="Last Name"
            control={control}
            errors={errors}
          />
        </div>

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

        <FormField
          name="confirm_password"
          label="Confirm Password"
          type="password"
          control={control}
          errors={errors}
        />

        <CheckboxField
          name="receiveEmailNotifications"
          label="Send me promotional emails about AuctionKoi auctions"
          control={control}
          errors={errors}
        />

        <CheckboxField
          name="acceptPolicy"
          label="I agree to the terms and policy *"
          control={control}
          errors={errors}
        />

        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition duration-300"
        >
          Submit
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = "text",
  control,
  errors,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label} *
    </label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <input
          {...field}
          type={type}
          id={name}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={label}
        />
      )}
    />
    {errors[name] && (
      <p className="mt-1 text-xs text-red-500">
        {errors[name]?.message as string}
      </p>
    )}
  </div>
);

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  control,
  errors,
}) => (
  <div className="flex items-center">
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ...field } }) => (
        <input
          {...field}
          type="checkbox"
          id={name}
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      )}
    />
    <label htmlFor={name} className="ml-2 block text-sm text-gray-900">
      {label}
    </label>
    {errors && errors[name] && (
      <p className="mt-1 text-xs text-red-500">
        {errors[name]?.message as string}
      </p>
    )}
  </div>
);

export default Register;
