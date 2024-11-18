import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ROUTING_PATH } from "~/constants/endPoints";
import {
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  VALIDATION_MESSAGE,
} from "~/constants/message";
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
    }
  }, [location]);

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
      toast.error(VALIDATION_MESSAGE.ENTER_VALID_OTP_6_DIGIT);
      return;
    }

    const state = location.state as {
      from: string;
    };

    try {
      if (state.from === "login") {
        await verifyOtpIsCorrect(email, otpString);
        toast.success(SUCCESS_MESSAGE.OTP_VERIFY_SUCCESS);
        setTimeout(
          () => navigate(ROUTING_PATH.FORGOT_PASSWORD, { state: { email } }),
          3000,
        );
      } else {
        await verifyOtpToVerifyUser(email, otpString);
        toast.success(SUCCESS_MESSAGE.OTP_VERIFY_SUCCESS);
        toast.info("Please login again to continue", {
          autoClose: 2000,
          onClose: () => {
            setTimeout(() => navigate("/"), 1000);
          }
        });
      }
    } catch (error: Error | any) {
      console.error(error);
      toast.error(error.message || ERROR_MESSAGE.OTP_VERIFICATION_ERROR);
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
      <span className="text-zinc-500 text-[12px] text-center">
        * Please enter the 6-digits one time password (OTP) that we sent to your
        registered email
      </span>
      <div className="flex gap-5">
        <Button
          onClick={() => {
            navigate(ROUTING_PATH.AUTH);
          }}
          sx={{ marginTop: "1rem" }}
        >
          Login now
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ marginTop: "1rem" }}
        >
          Verify OTP
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OtpVerification;
