import { Button } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "~/components/shared/LoadingComponent";
import AccountVerificationAlert from "~/components/shared/AccountVerificationAlert";
import { useUserData } from "~/hooks/useUserData";
import { environment } from "~/environments/environment";
import { getCookie } from "~/utils/cookieUtils";
import "./StaffDetail.scss";
import { sendOtp } from "~/utils/apiUtils";
import { AuctionsManagement } from "~/pages/manager/auctions/AuctionsManagement";
import VerifyKoiList from "~/pages/kois/VerifyKoiList";
import SendNotifications from "~/components/shared/SendNotifications";

const StaffDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [updateField, setUpdateField] = useState("");
  const [updateValue, setUpdateValue] = useState("");
  const navigate = useNavigate();
  const { user, loading, error, setUser } = useUserData();

  const handleUpdate = async () => {
    if (!user || !updateField || !updateValue) return;

    const accessToken = getCookie("access_token");
    if (!accessToken) {
      navigate("/notfound");
      return;
    }

    try {
      const API_URL =
        import.meta.env.VITE_API_BASE_URL + environment.be.apiPrefix;
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

  const handleVerify = async () => {
    if (!user) return;

    //send api request to send otp
    //PUT: /api/v1/users/verify/:otp
    const response = await sendOtp(user.email);

    if (response.status == 200) {
      navigate("/otp-verification", {
        state: {
          email: user.email,
          from: "staffDetail",
          statusCode: 200,
        },
      });
    } else {
      alert("Failed to send OTP");
    }
  };

  if (loading) return <LoadingComponent />;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found</div>;

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
          <p className="user-status">{user.status_name}</p>
          {user.status_name !== "VERIFIED" && (
            <button onClick={handleVerify} className="verify-button">
              Verify User
            </button>
          )}
        </div>
        <div className="user-main">
          <div className="user-info-grid">
            <div className="info-item">
              <p className="info-label">Email</p>
              <p className="info-value">{user.email}</p>
            </div>
            <div className="info-item">
              <p className="info-label">Phone</p>
              <p className="info-value">
                {user.phone_number || "Not provided"}
              </p>
            </div>
            <div className="info-item">
              <p className="info-label">Address</p>
              <p className="info-value">{user.address || "Not provided"}</p>
            </div>
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
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Update
            </Button>
          </div>
        </div>
      </div>
      <div>
        <VerifyKoiList />
        <AuctionsManagement />
      </div>
    </div>
  );
};

export default StaffDetail;
