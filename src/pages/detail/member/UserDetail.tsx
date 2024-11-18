import { faEdit, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import AccountTransactionComponent from "~/components/shared/AccountTransactionComponent";
import AccountVerificationAlert from "~/components/shared/AccountVerificationAlert";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { API_URL_DEVELOPMENT } from "~/constants/endPoints";
import { useUserData } from "~/hooks/useUserData";
import { UserResponse } from "~/types/users.type";
import { getCookie } from "~/utils/cookieUtils";
import { formatCurrency } from "~/utils/currencyUtils";
import { extractErrorMessage } from "~/utils/dataConverter";
import UserDetailDialog from "./UserDetailDialog";
import { formatDateV2 } from "~/utils/dateTimeUtils";
import { sendOtp } from "~/apis/otp.apis";
import { sendRequestUpdateRole } from "~/apis/mail.apis";

const UserDetail: React.FC = () => {
  const { user, loading: userLoading, loading, error, setUser } = useUserData();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false); // Modal state for showing user details
  const [fetchedUser, setFetchedUser] = useState<UserResponse>();
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{
    type: "verify" | "update" | null;
    loading: boolean;
  }>({
    type: null,
    loading: false,
  });

  const toggleAbout = () => setShowAbout(!showAbout);

  if (loading) return <LoadingComponent />;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found</div>;

  const handleUpdate = async () => {
    const userId = getCookie("user_id");
    const accessToken = getCookie("access_token");

    if (!userId || !accessToken) {
      navigate("/notfound");
      return;
    }

    setActionLoading({ type: "update", loading: true });

    try {
      const response = await axios.get(
        `${API_URL_DEVELOPMENT}/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      setFetchedUser(response.data);
      setOpenModal(true);
    } catch (error) {
      console.error("Failed to fetch user data", error);
      toast.error("Failed to fetch user data");
    } finally {
      setActionLoading({ type: null, loading: false });
    }
  };

  // Close the modal
  const handleClose = () => {
    setOpenModal(false);
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingComponent />
      </div>
    );
  }

  const handleVerify = async () => {
    if (!user) return;

    setActionLoading({ type: "verify", loading: true });

    try {
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
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      toast.error("An error occurred while sending OTP");
    } finally {
      setActionLoading({ type: null, loading: false });
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmitRole = async (role: string, purpose: string) => {
    if (!user) return;

    try {
      await sendRequestUpdateRole(role, purpose);
      toast.success("Send Update Role Email Successfully");
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        "Error send email update role",
      );
      toast.error(errorMessage);
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
        `${API_URL_DEVELOPMENT}/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      setUser(response.data);
    } catch (error) {
      console.error("Failed to refresh user data", error);
    }
  };

  const renderActionButton = (
    type: "verify" | "update",
    children: React.ReactNode,
  ) => {
    const isLoading = actionLoading.type === type && actionLoading.loading;

    return (
      <button
        onClick={type === "verify" ? handleVerify : handleUpdate}
        disabled={isLoading}
        className={`${
          type === "verify"
            ? "bg-red-500 hover:bg-red-600"
            : "text-gray-400 hover:text-gray-600"
        } text-white px-4 py-2 rounded-md transition`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-t-2 border-b-2 border-current rounded-full animate-spin mr-2"></div>
            Loading...
          </div>
        ) : (
          children
        )}
      </button>
    );
  };

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

            {user.status_name !== "VERIFIED" &&
              renderActionButton(
                "verify",
                <>
                  <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
                  Verify Account
                </>,
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
              <AccountTransactionComponent
                userId={user.id}
                token={getCookie("access_token") || ""}
                onTransactionSuccess={handleTransactionSuccess}
              />
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
                <p>{formatDateV2(user.created_at || "")}</p>
              </div>
              <div>
                {user.status_name === "VERIFIED" &&
                  user.role_name === "member" && (
                    <button
                      onClick={handleOpenModal}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition"
                    >
                      <FontAwesomeIcon icon={faUserCheck} className="mr-2" />I
                      want to Update My Role
                    </button>
                  )}
                <RoleSelectionModal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  onSubmit={handleSubmitRole}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for showing fetched user data */}
      <UserDetailDialog openModal={openModal} handleClose={handleClose} />
      <ToastContainer />
    </div>
  );
};

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (role: string, purpose: string) => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [roleError, setRoleError] = useState<boolean>(false); // Boolean for error state
  const [purposeError, setPurposeError] = useState<boolean>(false); // Boolean for error state

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    setSelectedRole(event.target.value as string);
    setRoleError(false); // Clear error when input is valid
  };

  const handlePurposeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPurpose(event.target.value);
    setPurposeError(false); // Clear error when input is valid
  };

  const handleSubmit = () => {
    let valid = true;

    // Validate selectedRole
    if (!selectedRole) {
      setRoleError(true);
      valid = false;
    }

    // Validate purpose
    if (!purpose) {
      setPurposeError(true);
      valid = false;
    }

    if (valid) {
      onSubmit(selectedRole, purpose);
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Select Role to Update</h2>

        {/* Role Selection */}
        <FormControl
          fullWidth
          variant="standard"
          error={roleError}
          className="mb-4"
        >
          <InputLabel>Select Role</InputLabel>
          <Select
            value={selectedRole}
            onChange={handleRoleChange}
            label="Choose a role"
            required
            className="mb-4"
          >
            <MenuItem value="">
              <em>Select Role</em>
            </MenuItem>
            <MenuItem value="BREEDER">Breeder</MenuItem>
            <MenuItem value="STAFF">Staff</MenuItem>
          </Select>
          {roleError && (
            <p className="text-red-500 text-sm">Role is required</p>
          )}
        </FormControl>

        {/* Purpose Text Field */}
        <TextField
          label="Purpose"
          variant="standard"
          required
          fullWidth
          value={purpose}
          onChange={handlePurposeChange}
          error={purposeError}
          helperText={purposeError ? "Purpose is required" : ""}
          className="mb-4"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className="mr-2"
          >
            Submit
          </Button>
          <Button variant="contained" color="error" onClick={onClose}>
            Cancel
          </Button>
        </div>
        <div>
          <p className="text-gray-400 mt-3">
            *Note: Please provide a valid reason for updating your role. We will
            review your request and get back to you as soon as possible.
          </p>
          <p className="text-gray-400 mt-3">
            Thanks for your patience. From Koi Auction Team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
