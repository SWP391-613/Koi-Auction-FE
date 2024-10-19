import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountVerificationAlert from "~/components/shared/AccountVerificationAlert";
import DepositComponent from "~/components/shared/DepositComponent";
import { useUserData } from "~/hooks/useUserData";
import { formatDate, sendOtp, updateUserField } from "~/utils/apiUtils";
import { getCookie } from "~/utils/cookieUtils";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { extractErrorMessage } from "~/utils/dataConverter";
import { formatCurrency } from "~/utils/currencyUtils";
import {
  Button,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Rating,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCheck,
  faEdit,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import UserDetailDialog from "./UserDetailDialog";

const UserDetail: React.FC = () => {
  const { user, loading, error, setUser } = useUserData();
  const [openModal, setOpenModal] = useState(false); // Modal state for showing user details
  const [fetchedUser, setFetchedUser] = useState<any>(null);
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);

  const toggleAbout = () => setShowAbout(!showAbout);

  if (loading) return <LoadingComponent />;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found</div>;

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
      alert("Failed to fetch user data");
    }
  };

  // Close the modal
  const handleClose = () => {
    setOpenModal(false);
  };

  const handleVerify = async () => {
    if (!user) return;

    const response = await sendOtp(user.email);

    if (response.status === 200) {
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

  return (
    <div className="container mx-auto p-6">
      <AccountVerificationAlert user={user} />

      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* User Info and Avatar */}
        <div className=" rounded-lg p-6 flex flex-col justify-around">
          <div className="flex flex-col items-center">
            <img
              src={user.avatar_url}
              alt={`${user.first_name} ${user.last_name}`}
              className="rounded-full w-48 mb-4 border-4"
            />
            <p className="text-gray-600 mb-4">Status: {user.status_name}</p>

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
          </div>
        </div>

        {/* Account Details and Update */}
        <div className=" md:col-span-2 rounded-lg p-6">
          <div className="flex justify-between items-center">
            <Typography variant="h4">
              {user.first_name} {user.last_name}
            </Typography>
            <FontAwesomeIcon
              icon={faEdit}
              onClick={handleUpdate}
              className="text-2xl text-gray-400"
            />
          </div>
          <h2 className="text-2xl text-blue-500 mt-5 mb-6">Account Details</h2>
          <div className="flex justify-start items-center gap-3">
            <Typography variant="h5">5/5</Typography>
            <Rating name="read-only" value={5} readOnly />
          </div>
          <div className="mb-6 flex flex-col items-center">
            <div className="flex justify-center items-center gap-5">
              <p className="text-xl font-bold">Account Balance:</p>
              <p className="text-3xl text-green-600 font-bold">
                {user.account_balance !== null
                  ? formatCurrency(user.account_balance)
                  : "No money"}
              </p>
            </div>
            <DepositComponent
              userId={user.id}
              token={getCookie("access_token") || ""}
            />
          </div>

          {/* About Button */}
          <div className="text-left">
            <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
            <Button onClick={toggleAbout} variant="text" color="inherit">
              About
            </Button>
            <Divider variant="fullWidth" />
          </div>

          {/* Conditionally render the About section */}
          {showAbout && (
            <div className="mt-6 space-y-4">
              <div className="flex gap-5 justify-between ">
                <h2 className="text-lg font-bold">Date of Birth</h2>
                <p>{user.date_of_birth}</p>
              </div>
              <div className="flex gap-5 justify-between ">
                <h2 className="text-lg font-bold">Created At</h2>
                <p>{formatDate(user.created_at || "")}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for showing fetched user data */}
      <UserDetailDialog openModal={openModal} handleClose={handleClose} />
    </div>
  );
};

export default UserDetail;
