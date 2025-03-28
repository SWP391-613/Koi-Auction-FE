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
import { koiNameRegex } from "~/constants/regex";
import {
  KOI_CREATE_VALIDATION_MESSAGE,
  SNACKBAR_VALIDATION_MESSAGE,
} from "~/constants/validation.message";
import { ERROR_MESSAGE } from "~/constants/message";
import { KOI_CREATE_FORM_LABEL } from "~/constants/label";
import { DYNAMIC_API_URL } from "~/constants/endPoints";

interface KoiCreatePopupForm {
  open?: boolean;
  onSuccess: () => void;
  owner_id: number;
}

const minBasePrice = 1000000;
const maxBasePrice = 50000000;
const inputPropsBasePrice = { min: minBasePrice, max: maxBasePrice };
const inputPropsYearBorn = {
  min: 0, // Set the minimum year (e.g., 1900)
  max: new Date().getFullYear(), // Set the maximum year to the current year
};
const inputPropsLength = { min: 0, max: 125 };

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

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, owner_id }));
  }, [owner_id]);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<unknown>,
  ) => {
    const { name, value } = e.target;

    // For number fields, ensure value is not negative
    if (["length", "base_price", "category_id", "year_born"].includes(name)) {
      const numValue = Number(value);
      if (numValue < 0) return; // Prevent negative values
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "category_id" || name === "length" || name === "year_born"
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
      newErrors.name = KOI_CREATE_VALIDATION_MESSAGE.KOI_NAME_IS_REQUIRED;
    }

    if (!koiNameRegex.test(formData.name)) {
      newErrors.name =
        KOI_CREATE_VALIDATION_MESSAGE.KOI_NAME_MUST_FOLLOWING_FORMAT;
    }

    // Validate base price
    if (!formData.base_price) {
      newErrors.base_price =
        KOI_CREATE_VALIDATION_MESSAGE.BASE_PRICE_IS_REQUIRED;
    }

    if (formData.base_price < 1000000 || formData.base_price > 50000000) {
      newErrors.base_price =
        KOI_CREATE_VALIDATION_MESSAGE.BASE_PRICE_GREATER_THAN_1_MILLION;
    }

    // Validate gender
    if (!formData.gender) {
      newErrors.gender = KOI_CREATE_VALIDATION_MESSAGE.GENDER_IS_REQUIRED;
    }

    // Validate length
    if (!formData.length) {
      newErrors.length = KOI_CREATE_VALIDATION_MESSAGE.LENGTH_IS_REQUIRED;
    }

    if (formData.length <= 0 || formData.length >= 125) {
      newErrors.length =
        KOI_CREATE_VALIDATION_MESSAGE.LENGTH_MUST_BE_GREATER_THAN_ZERO_AND_LESS_THAN_125;
    }

    // Validate year born
    if (!formData.year_born) {
      newErrors.year_born = KOI_CREATE_VALIDATION_MESSAGE.YEAR_BORN_IS_REQUIRED;
    }

    if (formData.year_born < 0) {
      newErrors.year_born =
        KOI_CREATE_VALIDATION_MESSAGE.YEAR_BORN_CANNOT_BE_NEGATIVE;
    }

    if (formData.year_born > new Date().getFullYear()) {
      newErrors.year_born =
        KOI_CREATE_VALIDATION_MESSAGE.YEAR_BORN_CANNOT_BE_IN_FUTURE;
    }

    // Validate category
    if (formData.category_id <= 0) {
      newErrors.category_id =
        KOI_CREATE_VALIDATION_MESSAGE.CATEGORY_IS_REQUIRED;
    }

    // Validate thumbnail
    if (!formData.thumbnail) {
      newErrors.thumbnail =
        KOI_CREATE_VALIDATION_MESSAGE.THUMBNAIL_URL_IS_REQUIRED;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbarMessage(
        SNACKBAR_VALIDATION_MESSAGE.PLEASE_FIX_THE_ERRORS_IN_THE_FORM,
      );
      setSnackbarOpen(true);
      return;
    }

    try {
      const token = getUserCookieToken();
      console.log(formData);
      await axios.post(`${DYNAMIC_API_URL}/kois`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSnackbarMessage(SNACKBAR_VALIDATION_MESSAGE.KOI_CREATE_SUCCESS);
      setSnackbarOpen(true);
      onSuccess();
    } catch (error) {
      console.error(ERROR_MESSAGE.ERROR_CREATING_KOI, error);
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
              label={KOI_CREATE_FORM_LABEL.NAME}
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
                label={KOI_CREATE_FORM_LABEL.LENGTH}
                type="number"
                value={formData.length || ""}
                inputProps={inputPropsLength}
                onChange={handleInputChange}
                error={!!errors.length}
                helperText={errors.length}
              />
              <TextField
                fullWidth
                sx={{ backgroundColor: "white" }}
                margin="normal"
                name="year_born"
                label={KOI_CREATE_FORM_LABEL.YEAR_BORN}
                type="number"
                value={formData.year_born || ""}
                inputProps={inputPropsYearBorn}
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
              label={KOI_CREATE_FORM_LABEL.THUMBNAIL_URL}
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
              label={KOI_CREATE_FORM_LABEL.BASE_PRICE}
              type="number"
              value={formData.base_price || ""}
              inputProps={inputPropsBasePrice}
              onChange={handleInputChange}
              error={!!errors.base_price}
              helperText={errors.base_price}
            />
            <TextField
              fullWidth
              sx={{ backgroundColor: "white" }}
              margin="normal"
              name="description"
              label={KOI_CREATE_FORM_LABEL.DESCRIPTION}
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
