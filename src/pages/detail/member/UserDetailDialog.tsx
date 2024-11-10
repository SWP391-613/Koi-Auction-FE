import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { formatDate } from "~/utils/apiUtils";
import axios from "axios";
import { getCookie } from "~/utils/cookieUtils";

const UserDetailDialog: React.FC<{
  openModal: boolean;
  handleClose: () => void;
}> = ({ openModal, handleClose }) => {
  const [fetchedUser, setFetchedUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userFields, setUserFields] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    date_of_birth: "",
  });

  useEffect(() => {
    if (openModal) {
      const userId = getCookie("user_id");
      axios
        .get(`http://localhost:4000/api/v1/users/${userId}`)
        .then((response) => {
          setFetchedUser(response.data);
          setUserFields({
            first_name: response.data.first_name || "",
            last_name: response.data.last_name || "",
            email: response.data.email || "",
            phone_number: response.data.phone_number || "",
            address: response.data.address || "",
            date_of_birth: response.data.date_of_birth || "",
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    }
  }, [openModal]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const userId = getCookie("user_id");
    const accessToken = getCookie("access_token");
    axios
      .put(
        `http://localhost:4000/api/v1/users/${userId}`,
        { ...userFields },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
      .then((response) => {
        alert("User updated successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        alert("Failed to update user.");
      });
  };

  return (
    <Dialog open={openModal} onClose={handleClose}>
      <DialogContent>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <Typography variant="h5">
              Edit User Details for {fetchedUser.first_name}{" "}
              {fetchedUser.last_name}
            </Typography>

            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={userFields.first_name}
              onChange={handleFieldChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={userFields.last_name}
              onChange={handleFieldChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={userFields.email}
              onChange={handleFieldChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={userFields.phone_number}
              onChange={handleFieldChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={userFields.address}
              onChange={handleFieldChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Date of Birth"
              name="date_of_birth"
              value={userFields.date_of_birth}
              onChange={handleFieldChange}
              margin="normal"
            />

            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "16px" }}
            >
              Save
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailDialog;
