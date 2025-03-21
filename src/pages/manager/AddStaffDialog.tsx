import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateUserRole } from "~/apis/user.apis";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { Staff } from "~/types/users.type";
import { getCookie } from "~/utils/cookieUtils";
import { extractErrorMessage } from "~/utils/dataConverter";

interface AddStaffProps {
  open: boolean;
  onClose: () => void;
  onInputChange: (name: string, value: unknown) => void;
}

const AddStaffDialog: React.FC<AddStaffProps> = ({
  open,
  onClose,
  onInputChange,
}) => {
  const [memberList, setMemberList] = useState<Staff[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const fetchMemberList = async () => {
    const accessToken = getCookie("access_token");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${DYNAMIC_API_URL}/members`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: 0,
          limit: 50,
        },
      });
      setMemberList(response.data.item);
    } catch (error) {
      console.error("Error fetching staff list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (!selectedMember) {
      toast.error("Please select a member before submitting");
      return;
    }

    try {
      await updateUserRole(parseInt(selectedMember), 2);
      setSnackbarMessage("Member updated to staff successfully");
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        "Failed to update member to staff",
      );
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMemberList();
    }
  }, [open]);

  const handleDropdownChange = (event: SelectChangeEvent<string>) => {
    setSelectedMember(event.target.value);
    onInputChange("auctioneer_id", event.target.value);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm" // or "lg" for larger widths
        fullWidth
      >
        <DialogTitle>Update Current Member to Staff</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="standard" margin="dense">
            <InputLabel id="auctioneer-select-label">Member</InputLabel>
            <Select
              labelId="auctioneer-select-label"
              id="auctioneer-select"
              name="auctioneer_id"
              value={selectedMember}
              onChange={handleDropdownChange}
              label="Auctioneer"
            >
              {memberList.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {`ID: ${member.id} - ${member.first_name} ${member.last_name}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {loading && <CircularProgress />}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={(e) => handleSubmit(e)}
            variant="contained"
            color="primary"
            disabled={loading} // Disable button while submitting
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default AddStaffDialog;
