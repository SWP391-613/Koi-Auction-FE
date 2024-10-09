import React from 'react';
import { Alert, AlertTitle } from '@mui/material'; // Assuming you're using Material UI
import { User } from '~/contexts/useUserData'; // Assuming this is where your User type is defined

// Define the props interface
interface AccountVerificationAlertProps {
  user: User | null; // user can be null if not logged in
}

const AccountVerificationAlert: React.FC<AccountVerificationAlertProps> = ({ user }) => {
  // Only render the alert if the user exists and is not verified
  if (!user || user.status_name === "VERIFIED") {
    return null;
  }

  return (
    <Alert severity="warning" className="verify-alert">
      <AlertTitle>Account Not Verified</AlertTitle>
      Your account is not verified. Please verify your account to access all features.
    </Alert>
  );
};

export default AccountVerificationAlert;
