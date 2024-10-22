import { Button, Divider, Rating, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "~/components/shared/LoadingComponent";
import AccountVerificationAlert from "~/components/shared/AccountVerificationAlert";
import { useUserData } from "~/hooks/useUserData";
import { environment } from "~/environments/environment";
import { getCookie } from "~/utils/cookieUtils";
import "./ManagerDetail.scss";
import { formatDate, sendOtp } from "~/utils/apiUtils";
import UserDetailDialog from "../member/UserDetailDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatCurrency } from "~/utils/currencyUtils";
import { faEdit, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { AuctionsManagement } from "~/pages/manager/auctions/AuctionsManagement";
import MemberManagement from "~/pages/manager/member/MemberManagement";
import BreederManagement from "~/pages/manager/breeder/BreederManagement";
import StaffManagement from "~/pages/manager/staff/StaffManagement";
import KoiManagement from "~/pages/manager/koi/KoiManagement";

const ManagerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [openModal, setOpenModal] = useState(false); // Modal state for showing user details
  const [fetchedUser, setFetchedUser] = useState<any>(null);
  const [updateField, setUpdateField] = useState("");
  const [updateValue, setUpdateValue] = useState("");
  const navigate = useNavigate();
  const { user, loading, error, setUser } = useUserData();
  const [showAbout, setShowAbout] = useState(false);
  const toggleAbout = () => setShowAbout(!showAbout);

  const handleUpdate = async () => {
    if (!user || !updateField || !updateValue) return;
    const userId = getCookie("user_id"); // Retrieve user id from cookie
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
          from: "managerDetail",
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

  // Close the modal
  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <div className="container mx-auto pt-6">
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
              className="text-2xl text-gray-400 hover:cursor-pointer"
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

      <div>
        <AuctionsManagement />
        <div className="grid grid-cols-2 gap-3">
          <StaffManagement />
          <BreederManagement />
        </div>
        <KoiManagement />
        <MemberManagement />
      </div>
    </div>
  );
};

export default ManagerDetail;
