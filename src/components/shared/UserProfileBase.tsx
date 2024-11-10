import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import AccountVerificationAlert from "~/components/shared/AccountVerificationAlert";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { sendOtp } from "~/utils/apiUtils";
import { useUserData } from "~/hooks/useUserData";
import { UserBase } from "~/types/users.type";

interface UserProfileBaseProps {
  children: React.ReactNode;
  showVerifyButton?: boolean;
  returnPath?: string;
}

export interface UserMainContentProps {
  user: UserBase;
  setUser: (user: UserBase) => void;
}

export interface StaffMainContentProps {
  user: UserBase;
  setUser: (user: UserBase) => void;
}

const UserProfileBase: React.FC<UserProfileBaseProps> = ({
  children,
  showVerifyButton = true,
  returnPath = "userDetail",
}) => {
  const { user, loading, error, setUser } = useUserData();
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!user) return;

    const response = await sendOtp(user.email);

    if (response.status === 200) {
      navigate("/otp-verification", {
        state: {
          email: user.email,
          from: returnPath,
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

  return (
    <div className="container mx-auto p-6">
      <AccountVerificationAlert user={user} />

      <div className="user-profile-content">
        {/* User Avatar and Basic Info */}
        <div className="user-sidebar">
          <img
            src={user.avatar_url}
            alt={`${user.first_name} ${user.last_name}`}
            className="rounded-full w-48 mb-4 border-4"
          />
          <h1 className="text-xl font-bold">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-gray-600 mb-4">Status: {user.status_name}</p>

          {showVerifyButton && user.status_name !== "VERIFIED" && (
            <Button
              onClick={handleVerify}
              variant="contained"
              color="error"
              startIcon={<FontAwesomeIcon icon={faUserCheck} />}
            >
              Verify Account
            </Button>
          )}

          <div className="basic-info mt-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold">Email</h2>
              <p>{user.email}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold">Phone</h2>
              <p>{user.phone_number || "Not provided"}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold">Address</h2>
              <p>{user.address || "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Main Content Area - Rendered via children prop */}
        <div className="user-main">
          {React.Children.map(children, (child) =>
            React.isValidElement<{
              user: typeof user;
              setUser: typeof setUser;
            }>(child)
              ? React.cloneElement(child, { user, setUser })
              : child,
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileBase;
