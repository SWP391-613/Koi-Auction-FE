import { faEdit, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Divider, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import AccountVerificationAlert from "~/components/shared/AccountVerificationAlert";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { useUserData } from "~/hooks/useUserData";
import { UserResponse } from "~/types/users.type";
import { formatDate, sendOtp } from "~/utils/apiUtils";
import { getCookie } from "~/utils/cookieUtils";
import { formatCurrency } from "~/utils/currencyUtils";
import UserDetailDialog from "../member/UserDetailDialog";
import "./StaffDetail.scss";

const StaffDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [updateField, setUpdateField] = useState("");
  const [updateValue, setUpdateValue] = useState("");
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [fetchedUser, setFetchedUser] = useState<UserResponse>();
  const { user, loading, error, setUser } = useUserData();
  const [showAbout, setShowAbout] = useState(false);
  const toggleAbout = () => setShowAbout(!showAbout);

  const handleUpdate = async () => {
    const userId = getCookie("user_id"); // Retrieve user id from cookie
    const accessToken = getCookie("access_token");

    if (!userId || !accessToken) {
      navigate("/notfound");
      return;
    }

    try {
      const response = await axios.get(`API_URL_DEVELOPMENT/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
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
    <div className="container mx-auto mt-12 mb-36">
      <AccountVerificationAlert user={user} />

      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* User Info and Avatar */}
        <div className="rounded-lg flex flex-col justify-around mr-10">
          <div className="flex flex-col justify-start">
            <img
              src={user.avatar_url}
              alt={`${user.first_name} ${user.last_name}`}
              className="mb-4"
            />

            {user.status_name !== "VERIFIED" && (
              <button
                onClick={handleVerify}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
                Verify Account
              </button>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <h2 className="text-2xl text-black">Account Details</h2>
            <Divider aria-hidden="true" />
            <div>
              <h2 className="text-lg font-bold">Email</h2>
              <p>{user.email}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold">Phone Number</h2>
              <p>{user.phone_number || "Not provided"}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold">Address</h2>
              <p>{user.address || "Not provided"}</p>
            </div>
            <Divider aria-hidden="true" />
            <div>
              <h2 className="text-lg font-bold">Status</h2>
              <p>{user.status_name}</p>
            </div>
          </div>
        </div>

        {/* Account Details and Update */}
        <div className=" md:col-span-2 rounded-lg p-6">
          <div className="flex justify-between items-center">
            <Typography variant="h4">
              {user.first_name} {user.last_name}
            </Typography>
            {user.status_name === "VERIFIED" && (
              <FontAwesomeIcon
                icon={faEdit}
                onClick={handleUpdate}
                className="text-2xl text-gray-400 hover:cursor-pointer"
              />
            )}
          </div>
          <h2 className="text-2xl text-blue-500 mt-5 mb-6">
            {user.role_name.charAt(0).toUpperCase() + user.role_name.slice(1)}
          </h2>
          {user.status_name == "VERIFIED" && (
            <div className="mb-6 flex flex-col items-center">
              <div className="flex justify-center items-center gap-5">
                <p className="text-xl font-bold">Account Balance:</p>
                <p className="text-3xl text-green-600 font-bold">
                  {user.account_balance !== null
                    ? formatCurrency(user.account_balance)
                    : "No money"}
                </p>
              </div>
            </div>
          )}

          {/* About Button */}
          <div className="text-left">
            <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
            <Button onClick={toggleAbout} variant="text" color="inherit">
              About Me
            </Button>
            <Divider variant="fullWidth" />
          </div>

          {/* Conditionally render the About section */}
          {showAbout && (
            <div className="mt-6 space-y-4">
              <div className="flex gap-5 justify-between ">
                <h2 className="text-lg font-bold">Date of Birth</h2>
                <p>{user.date_of_birth || "Not Provided"}</p>
              </div>
              <div className="flex gap-5 justify-between ">
                <h2 className="text-lg font-bold">Created At</h2>
                <p>{formatDate(user.created_at || "")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <UserDetailDialog openModal={openModal} handleClose={handleClose} />
      <ToastContainer />
    </div>
  );
};

export default StaffDetail;
