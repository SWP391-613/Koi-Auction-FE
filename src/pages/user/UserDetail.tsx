import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountVerificationAlert from "~/components/shared/AccountVerificationAlert";
import DepositComponent from "~/components/shared/DepositComponent";
import { useUserData } from "~/contexts/useUserData";
import { formatDate, sendOtp, updateUserField } from "~/utils/apiUtils";
import { getCookie } from "~/utils/cookieUtils";
import "./UserDetail.scss";
import Loading from "~/components/loading/Loading";
import { extractErrorMessage } from "~/utils/dataConverter";

const UserDetail: React.FC = () => {
  const { user, loading, error, setUser } = useUserData();
  const [updateField, setUpdateField] = useState("");
  const [updateValue, setUpdateValue] = useState("");
  const navigate = useNavigate();

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found</div>;

  const handleUpdate = async (): Promise<void> => {
    if (!user || !updateField || !updateValue) return;

    const accessToken = getCookie("access_token");
    if (!accessToken) {
      navigate("/notfound");
      return;
    }

    try {
      await updateUserField(user.id, updateField, updateValue, accessToken);

      setUser({ ...user, [updateField]: updateValue });
      setUpdateField("");
      setUpdateValue("");
      alert("User information updated successfully!");
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        "Failed to update user information.",
      );
      console.error(errorMessage);
      alert(errorMessage);
    }
  };

  const handleVerify = async () => {
    if (!user) return;

    //send api request to send otp
    //PUT: /api/v1/users/verify/:otp
    const response = await sendOtp(user.email);

    if (response.status == 200) {
      navigate("/otp-verification", {
        state: {
          email: user.email,
          from: "userDetail",
          statusCode: 200,
        },
      });
    } else {
      alert("Failed to send OTP");
    }
  };

  if (!user) {
    return <Loading />;
  }

  const accessToken = getCookie("access_token");
  if (!accessToken) {
    navigate("/notfound");
  }

  return (
    <div className="flex flex-col justify-around m-10">
      <AccountVerificationAlert user={user} />
      <div className="user-detail-content">
        <div className="user-sidebar">
          <img
            src={user.avatar_url}
            alt={`${user.first_name} ${user.last_name}`}
            className="user-avatar"
          />
          <h1 className="user-name">
            {user.first_name} {user.last_name}
          </h1>
          <p className="user-status">Status: {user.status_name}</p>
          {user.status_name !== "VERIFIED" && (
            <button onClick={handleVerify} className="verify-button">
              User need to Verify!
            </button>
          )}
        </div>
        <div className="user-main">
          <div className="user-info-grid">
            <div>
              <p className="info-label">Email</p>
              <p className="info-value">{user.email}</p>
            </div>
            <div>
              <p className="info-label">Phone Number</p>
              <p className="info-value">
                {user.phone_number || "Not provided"}
              </p>
            </div>
            <div>
              <p className="info-label">Address</p>
              <p className="info-value">{user.address || "Not provided"}</p>
            </div>
            <div>
              <p className="info-label">Date of Birth</p>
              <p className="info-value">{user.date_of_birth}</p>
            </div>
            <div>
              <p className="info-label">Created At</p>
              <p className="info-value">{formatDate(user.created_at || "")}</p>
            </div>
            <div>
              <p className="info-label">Updated At</p>
              <p className="info-value">{formatDate(user.updated_at || "")}</p>
            </div>
          </div>
          <div className="account-balance">
            <p className="balance-label">Account Balance</p>
            <p className="balance-value">${user.account_balance.toFixed(2)}</p>
            <DepositComponent
              userId={user.id}
              token={accessToken || ""}
              onDepositSuccess={() => {
                // Refresh user data after successful deposit
                setUser({ ...user, account_balance: user.account_balance });
              }}
            />
          </div>
          <div className="update-field">
            <select
              value={updateField}
              onChange={(e) => setUpdateField(e.target.value)}
              className="update-select"
            >
              <option value="">Select field to update</option>
              <option value="first_name">First Name</option>
              <option value="last_name">Last Name</option>
              <option value="email">Email</option>
              <option value="phone_number">Phone</option>
              <option value="address">Address</option>
            </select>
            <input
              type="text"
              value={updateValue}
              onChange={(e) => setUpdateValue(e.target.value)}
              placeholder="Enter new value"
              className="update-input"
            />
            <button onClick={handleUpdate} className="update-button">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
