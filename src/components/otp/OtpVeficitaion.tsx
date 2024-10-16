import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyOtpIsCorrect, verifyOtpToVerifyUser } from "~/utils/apiUtils";

const validFromStates = [
  "login",
  "register",
  "userDetail",
  "managerDetail",
  "staffDetail",
  "breederDetail",
];

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as {
      email?: string;
      from: string;
      statusCode?: number;
    };

    if (
      state &&
      validFromStates.includes(state.from) &&
      state.statusCode === 200 &&
      state.email
    ) {
      setEmail(state.email);
    } else {
      navigate("/notfound", { replace: true });
    }
  }, [location, navigate]);

  const handleChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    };

  const handleSubmit = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    const state = location.state as {
      from: string;
    };

    try {
      if (state.from === "login") {
        await verifyOtpIsCorrect(email, otpString);
        // Redirect to /forgot-password if coming from login
        setTimeout(
          () => navigate("/forgot-password", { state: { email } }),
          3000,
        );
      } else {
        await verifyOtpToVerifyUser(email, otpString);
        // Redirect to home page or other pages as per requirement
        setTimeout(() => navigate("/"), 3000);
      }
      toast.success("OTP verified successfully");
    } catch (error: Error | any) {
      console.error(error);
      toast.error(error.message || "An error occurred during verification");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl mb-4">Enter OTP provided</h2>
      <div className="flex space-x-2 mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={handleChange(index)}
            className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md"
          />
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Verify OTP
      </button>
      <ToastContainer />
    </div>
  );
};

export default OtpVerification;
