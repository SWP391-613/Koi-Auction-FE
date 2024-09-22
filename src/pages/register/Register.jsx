import React, { useContext, useState } from "react";
import { ThemeContext } from "../theme/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../utils/apiUtils";
import "./Register.scss";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [receiveEmailNotifications, setReceiveEmailNotifications] = useState(false);
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [error, setError] = useState("");
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register({ firstName, lastName, email, phoneNumber, password });
      console.log("Registration successful:", data);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      setError(error.message || "An error occurred during registration");
    }
    console.log("Registration attempt with:", { email, password });
  };

  return (
    <div
      className={`register-container flex justify-center items-center h-lvh bg-[#f0f2f5] ${isDarkMode
        ? "dark-mode" : ""}`}
    >
      <form
        className="form flex flex-col gap-4 bg-[#f8f9fa] p-9" // Light gray background
        onSubmit={handleSubmit}
      >
        {error && <p className="error">{error}</p>}
        <div className="name-container">
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col">
              <label className="text semi-bold text-[#8B949E]">First Name
                *</label>
              <div className="inputForm h-12 flex items-center p-e">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text semi-bold text-[#8B949E]">Last Name
                *</label>
              <div className="inputForm h-12 flex items-center p-e">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-column">
          <label className="text semi-bold text-[#8B949E]">Email Address
            *</label>
        </div>
        <div className="inputForm h-12 flex items-center p-e">
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex-column">
          <label className="text semi-bold text-[#8B949E]">Phone Number
            *</label>
        </div>
        <div className="inputForm h-12 flex items-center p-e">
          <input
            type="phoneNumber"
            className="input"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="flex-column">
          <label className="text semi-bold text-[#8B949E]">Password *</label>
        </div>
        <div className="inputForm h-12 flex items-center p-e">
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Checkbox for email notifications */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="emailNotifications"
            className="form-checkbox h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={receiveEmailNotifications}
            onChange={(e) => setReceiveEmailNotifications(e.target.checked)}
          />
          <label htmlFor="emailNotifications" className="ml-2 text-[#8B949E]">
            Receive email notifications
          </label>
        </div>

        {/* Checkbox for accepting the policy */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="acceptPolicy"
            className="form-checkbox h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={acceptPolicy}
            onChange={(e) => setAcceptPolicy(e.target.checked)}
            required
          />
          <label htmlFor="acceptPolicy" className="ml-2 text-[#8B949E]">
            I accept the policy
          </label>
        </div>

        <button className="button-submit text w-full cursor-pointer border-none text-xl bg-[#FF4081] text-white font-bold" type="submit">
          Register
        </button>
        <p className="p text-gray-700 font-bold text-base mt-4 mb-2 leading-relaxed">
          Already have an account?{" "}
          <Link
            to="/login"
            className="ml-4 bg-blue-500 rounded-bl-xl text-white font-bold py-2 px-4 rounded hover:bg-blue-400 focus:outline-none no-underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
