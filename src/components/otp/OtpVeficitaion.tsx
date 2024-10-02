import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as {
      email?: string;
      from?: string;
      statusCode?: number;
    };

    if (
      state &&
      state.from === "register" &&
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
    try {
      const otpString = otp.join("");

      if (otpString.length !== 6) {
        toast.error("Please enter a valid 6-digit OTP");
        return;
      }

      const response = await axios.post(
        "http://localhost:4000/api/v1/users/verify",
        {
          email: email,
          otp: otpString,
        },
      );

      if (response.status === 200) {
        toast.success("OTP verified successfully");
        setTimeout(() => navigate("/"), 3000);
      } else {
        toast.error("OTP verification failed");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred during verification");
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
    </div>
  );
};

export default OtpVerification;
