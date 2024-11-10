import React from "react";
import { Alert, AlertTitle } from "@mui/material"; // Assuming you're using Material UI
import { UserDetailsResponse } from "~/types/users.type";

// Define the props interface
interface AccountVerificationAlertProps {
  user: UserDetailsResponse | null; // user can be null if not logged in
}

const AccountVerificationAlert: React.FC<AccountVerificationAlertProps> = ({
  user,
}) => {
  // Only render the alert if the user exists and is not verified
  if (!user || user.status_name === "VERIFIED") {
    return null;
  }

  return (
    <Alert severity="warning" className="verify-alert mb-5">
      <AlertTitle>Account Not Verified</AlertTitle>
      Your account is not verified. Please verify your account to access all
      features.
    </Alert>
  );
};

export default AccountVerificationAlert;
