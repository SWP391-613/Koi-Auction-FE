import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDetail.scss";
import { getCookie } from "~/utils/cookieUtils";
import axios from "axios";
import DepositComponent from "~/components/shared/DepositComponent";
import { formatDate } from "~/utils/apiUtils";
import { useUserData } from "~/contexts/useUserData";
import AccountVerificationAlert from "~/components/shared/AccountVerificationAlert";

const UserDetail: React.FC = () => {
  const { user, loading, error, setUser } = useUserData();
  const [updateField, setUpdateField] = useState("");
  const [updateValue, setUpdateValue] = useState("");
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found</div>;

  const handleUpdate = async () => {
    if (!user || !updateField || !updateValue) return;

    const accessToken = getCookie("access_token");
    if (!accessToken) {
      navigate("/notfound");
      return;
    }

    try {
      const API_URL = "http://localhost:4000/api/v1";
      const response = await axios.put(
        `${API_URL}/users/${user.id}`,
        { [updateField]: updateValue },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 200) {
        setUser({ ...user, [updateField]: updateValue });
        setUpdateField("");
        setUpdateValue("");
        alert("User information updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update user data:", error);
      alert("Failed to update user information. Please try again.");
    }
  };

  const handleVerify = () => {
    if (!user) return;
    navigate("/otp-verification", {
      state: {
        email: user.emails,
        from: "userDetail",
        statusCode: 200,
      },
    });
  };

  if (!user) {
    return <div>Loading...</div>;
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
              <p className="info-value">{user.emails}</p>
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
            <DepositComponent userId={user.id} token={accessToken || ""} />
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
