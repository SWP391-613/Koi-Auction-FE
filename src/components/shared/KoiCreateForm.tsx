import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AddNewKoiDTO } from "~/types/kois.type";
import { getUserCookieToken } from "~/utils/auth.utils";
import { categoryMap } from "~/utils/dataConverter";
import AddKoiPreviewCart from "./AddKoiPreviewCart";
import { toast, ToastContainer } from "react-toastify";
import { koiName } from "~/utils/data/fixedTitleName";

interface KoiCreatePopupForm {
  open?: boolean;
  onClose: () => void;
  onSuccess: () => void;
  owner_id: number;
}

const KoiCreateForm: React.FC<KoiCreatePopupForm> = ({
  open,
  onClose,
  onSuccess,
  owner_id,
}) => {
  const [formData, setFormData] = useState<AddNewKoiDTO>({
    name: "Select a name",
    base_price: 0,
    thumbnail: "",
    gender: "FEMALE",
    length: 0,
    age: 0,
    description: "Enter description here...",
    category_id: 0,
    owner_id: 0,
    status_name: "UNVERIFIED",
    is_display: 1,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, owner_id }));
  }, [owner_id]);

  const handleDropdownChange = (event: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      name: event.target.value, // Update the name field in formData
    });
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<unknown>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "category_id" ||
        name === "age" ||
        name === "length" ||
        name === "base_price"
          ? Number(value)
          : value,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate name
    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    // Validate base price
    if (formData.base_price <= 0) {
      newErrors.base_price = "Base price must be greater than 0";
    }

    // Validate gender
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    // Validate length
    if (formData.length <= 0 || formData.length >= 125) {
      newErrors.length = "Length must be greater than 0 and less than 125";
    }

    // Validate age
    if (formData.age < 0) {
      newErrors.age = "Age cannot be negative";
    }

    // Validate category
    if (formData.category_id <= 0) {
      newErrors.category_id = "Category is required";
    }

    // Validate thumbnail
    if (!formData.thumbnail) {
      newErrors.thumbnail = "Thumbnail URL is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbarMessage("Please fix the errors in the form.");
      setSnackbarOpen(true);
      return;
    }

    try {
      const token = getUserCookieToken();
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
      toast.error((error as any).response.data.reason);
    }
  };

  return (
    <>
      <div className="flex">
        <div className="flex flex-col">
          <div>
            {/* Dropdown for koi names */}
            <div className="flex gap-5">
              <FormControl fullWidth margin="normal" error={!!errors.name}>
                <InputLabel>Name</InputLabel>
                <Select
                  name="name"
                  value={formData.name}
                  onChange={handleDropdownChange}
                >
                  {koiName.map((koiName, index) => (
                    <MenuItem key={index} value={koiName}>
                      {koiName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
              </FormControl>
              <FormControl fullWidth margin="normal" error={!!errors.gender}>
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
                {errors.gender && (
                  <p style={{ color: "red" }}>{errors.gender}</p>
                )}
              </FormControl>
            </div>
            <FormControl fullWidth margin="normal" error={!!errors.category_id}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
              >
                {Object.entries(categoryMap).map(([id, name]) => (
                  <MenuItem key={id} value={Number(id)}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category_id && (
                <p style={{ color: "red" }}>{errors.category_id}</p>
              )}
            </FormControl>
            <div className="flex gap-5">
              <TextField
                fullWidth
                sx={{ backgroundColor: "white" }}
                margin="normal"
                name="length"
                label="Length"
                type="number"
                value={formData.length}
                onChange={handleInputChange}
                error={!!errors.length}
                helperText={errors.length}
              />
              <TextField
                fullWidth
                sx={{ backgroundColor: "white" }}
                margin="normal"
                name="age"
                label="Age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                error={!!errors.age}
                helperText={errors.age}
              />
            </div>
            <TextField
              fullWidth
              sx={{ backgroundColor: "white" }}
              margin="normal"
              name="thumbnail"
              label="Thumbnail URL"
              value={formData.thumbnail}
              onChange={handleInputChange}
              error={!!errors.thumbnail}
              helperText={errors.thumbnail}
            />
            <TextField
              fullWidth
              sx={{ backgroundColor: "white" }}
              margin="normal"
              name="base_price"
              label="Base Price (VND)"
              type="number"
              value={formData.base_price}
              onChange={handleInputChange}
              error={!!errors.base_price}
              helperText={errors.base_price}
            />
            <TextField
              fullWidth
              sx={{ backgroundColor: "white" }}
              margin="normal"
              name="description"
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-5">
            <Button onClick={onClose}>Back</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Create
            </Button>
          </div>
        </div>
        <div className="ml-10">
          <Typography variant="h4">Preview</Typography>
          <AddKoiPreviewCart items={[formData]} />
        </div>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
      <ToastContainer />
    </>
  );
};

export default KoiCreateForm;
