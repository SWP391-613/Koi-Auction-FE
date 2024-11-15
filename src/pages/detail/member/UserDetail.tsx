import { faEdit, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Divider, Rating, Typography } from "@mui/material";
import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountTransactionComponent from "~/components/shared/AccountTransactionComponent";
import AccountVerificationAlert from "~/components/shared/AccountVerificationAlert";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { useUserData } from "~/hooks/useUserData";
import { formatDate, sendOtp, sendRequestUpdateRole } from "~/utils/apiUtils";
import { getCookie } from "~/utils/cookieUtils";
import { formatCurrency } from "~/utils/currencyUtils";
import UserDetailDialog from "./UserDetailDialog";
import { getUserCookieToken } from "~/utils/auth.utils";
import { toast, ToastContainer } from "react-toastify";

const UserDetail: React.FC = () => {
  const { user, loading, error, setUser } = useUserData();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
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
        `https://koi-auction-be-az-dtarcyafdhc2gcen.southeastasia-01.azurewebsites.net/api/v1/users/${userId}`,
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

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmitRole = async (role: string) => {
    if (!user) return;

    try {
      await sendRequestUpdateRole(role);
      toast.success("Role updated successfully");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

  const handleTransactionSuccess = async () => {
    // Refresh user data after successful transaction
    try {
      const userId = getCookie("user_id");
      const accessToken = getCookie("access_token");

      if (!userId || !accessToken) {
        navigate("/notfound");
        return;
      }

      const response = await axios.get(
        `https://koi-auction-be-az-dtarcyafdhc2gcen.southeastasia-01.azurewebsites.net/api/v1/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      setUser(response.data);
    } catch (error) {
      console.error("Failed to refresh user data", error);
    }
  };

  return (
    <>
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

              <div>
                {user.status_name === "VERIFIED" && (
                  <button
                    onClick={handleOpenModal}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition"
                  >
                    <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
                    Update My Role
                  </button>
                )}
                <RoleSelectionModal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  onSubmit={handleSubmitRole}
                />
              </div>
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
            <h2 className="text-2xl text-blue-500 mt-5 mb-6">
              Account Details
            </h2>
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
              <AccountTransactionComponent
                userId={user.id}
                token={getCookie("access_token") || ""}
                onTransactionSuccess={handleTransactionSuccess}
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

        {/* Modal for showing fetched user data */}
        <UserDetailDialog openModal={openModal} handleClose={handleClose} />
        <ToastContainer />
      </div>
    </>
  );
};

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (role: string) => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>("");

  const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedRole) {
      onSubmit(selectedRole);
    }
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Select Role to Update</h2>
        <div className="mb-4">
          <label className="block mb-2">Choose a role:</label>
          <select
            value={selectedRole}
            onChange={handleRoleChange}
            className="border border-gray-300 p-2 rounded-md w-full"
          >
            <option value="">Select Role</option>
            <option value="BREEDER">Breeder</option>
            <option value="STAFF">Staff</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
