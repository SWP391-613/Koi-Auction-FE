import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { getCookie } from "~/utils/cookieUtils";

interface KoiCreatePopupProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  owner_id: number;
}

const KoiCreatePopup: React.FC<KoiCreatePopupProps> = ({
  open,
  onClose,
  onSuccess,
  owner_id,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    base_price: 0,
    thumbnail: "",
    gender: "",
    length: 0,
    age: 0,
    description: "",
    category_id: 0,
    owner_id: 0,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, owner_id }));
  }, [owner_id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = getCookie("access_token");
      console.log(formData);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/kois`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSnackbarMessage("Koi created successfully!");
      setSnackbarOpen(true);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating koi:", error);
      setSnackbarMessage("Error creating koi. Please try again.");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Create New Koi</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="base_price"
            label="Base Price"
            type="number"
            value={formData.base_price}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="thumbnail"
            label="Thumbnail URL"
            value={formData.thumbnail}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
              <MenuItem value="UNKNOWN">Unknown</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            name="length"
            label="Length"
            type="number"
            value={formData.length}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="age"
            label="Age"
            type="number"
            value={formData.age}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="category_id"
            label="Category ID"
            type="number"
            value={formData.category_id}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="owner_id"
            label="Owner ID"
            type="number"
            value={formData.owner_id}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Create
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

export default KoiCreatePopup;
