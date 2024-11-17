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
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AddNewKoiDTO } from "~/types/kois.type";
import { getUserCookieToken } from "~/utils/auth.utils";
import { categoryMap } from "~/utils/dataConverter";
import AddKoiPreviewCart from "./AddKoiPreviewCart";

interface KoiCreatePopupForm {
  open?: boolean;
  onSuccess: () => void;
  owner_id: number;
}

const KoiCreateForm: React.FC<KoiCreatePopupForm> = ({
  open,
  onSuccess,
  owner_id,
}) => {
  const [formData, setFormData] = useState<AddNewKoiDTO>({
    name: "",
    base_price: "" as unknown as number, // This will show empty field instead of 0
    thumbnail: "",
    gender: "",
    length: "" as unknown as number, // This will show empty field instead of 0
    year_born: "" as unknown as number, // This will show empty field instead of 0
    description: "Enter description here...",
    category_id: "" as unknown as number, // This will show empty field instead of 0
    owner_id: owner_id, // Keep this as it's passed as prop
    status_name: "UNVERIFIED",
    is_display: 1,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

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

    // For number fields, ensure value is not negative
    if (["length", "age", "base_price", "category_id"].includes(name)) {
      const numValue = Number(value);
      if (numValue < 0) return; // Prevent negative values
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "category_id" ||
        name === "age" ||
        name === "length" ||
        name === "base_price"
          ? value === ""
            ? (value as unknown as number)
            : Number(value)
          : value,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate name
    if (!formData.name) {
      newErrors.name = "Koi name is required";
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

    // Validate year born
    if (!formData.year_born) {
      newErrors.year_born = "Year born is required";
    }

    if (formData.year_born < 0) {
      newErrors.year_born = "Year born cannot be negative";
    }

    if (formData.year_born > new Date().getFullYear()) {
      newErrors.year_born = "Year born cannot be in the future";
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
    } catch (error) {
      console.error("Error creating koi:", error);
      toast.error((error as any).response.data.reason);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="flex flex-col ">
          <div>
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Name"
              value={formData.name}
              sx={{ backgroundColor: "white" }}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
            />
            <FormControl fullWidth margin="normal" error={!!errors.gender}>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Gender
                </MenuItem>
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                <MenuItem value="UNKNOWN">Unknown</MenuItem>
              </Select>
              {errors.gender && <p style={{ color: "red" }}>{errors.gender}</p>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={!!errors.category_id}>
              <Select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Category
                </MenuItem>
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
                value={formData.length || ""}
                inputProps={{ min: 0 }}
                onChange={handleInputChange}
                error={!!errors.length}
                helperText={errors.length}
              />
              <TextField
                fullWidth
                sx={{ backgroundColor: "white" }}
                margin="normal"
                name="year_born"
                label="Year Born"
                type="number"
                value={formData.year_born || ""}
                inputProps={{
                  min: 0, // Set the minimum year (e.g., 1900)
                  max: new Date().getFullYear(), // Set the maximum year to the current year
                }}
                onChange={handleInputChange}
                error={!!errors.year_born}
                helperText={errors.year_born}
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
              value={formData.base_price || ""}
              inputProps={{ min: 0 }}
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
        </div>
        <div className="ml-10">
          <AddKoiPreviewCart items={[formData]} />
        </div>
      </div>
      <div className="mt-3 ga-5 mx-auto">
        <Button
          onClick={handleSubmit}
          className="w-[10rem] h-[3rem]"
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
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
