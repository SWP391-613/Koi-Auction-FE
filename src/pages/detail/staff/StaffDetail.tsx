import { Button } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AccountVerificationAlert from "~/components/shared/AccountVerificationAlert";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { environment } from "~/environments/environment";
import { useUserData } from "~/hooks/useUserData";
import VerifyKoiList from "~/pages/kois/VerifyKoiList";
import { AuctionsManagement } from "~/pages/manager/auctions/AuctionsManagement";
import { sendOtp } from "~/utils/apiUtils";
import { getCookie } from "~/utils/cookieUtils";
import "./StaffDetail.scss";
import { toast } from "react-toastify";
import { UserResponse } from "~/types/users.type";
import UserDetailDialog from "../member/UserDetailDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const StaffDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [updateField, setUpdateField] = useState("");
  const [updateValue, setUpdateValue] = useState("");
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [fetchedUser, setFetchedUser] = useState<UserResponse>();
  const { user, loading, error, setUser } = useUserData();

  const handleUpdate = async () => {
    const userId = getCookie("user_id"); // Retrieve user id from cookie
    const accessToken = getCookie("access_token");

    if (!userId || !accessToken) {
      navigate("/notfound");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      setFetchedUser(response.data); // Save fetched data to state
      setOpenModal(true); // Open the modal to display the data
    } catch (error) {
      console.error("Failed to fetch user data", error);
      toast.error("Failed to fetch user data");
    }
  };

  const handleClose = () => {
    setOpenModal(false);
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
      <UserDetailDialog openModal={openModal} handleClose={handleClose} />
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
            <FontAwesomeIcon
              icon={faEdit}
              onClick={handleUpdate}
              className="text-2xl text-gray-400 hover:cursor-pointer"
            />
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
