import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  Divider,
} from "@mui/material";
import { Edit, LocationOn, LocalShipping } from "@mui/icons-material";
import { format, addDays } from "date-fns";
import { Order, OrderStatus } from "~/types/orders.type";
import { formatCurrency } from "~/utils/currencyUtils";
import {
  parseAddressString,
  formatAddressToString,
} from "~/utils/addressUtils";
import {
  AddressSelection,
  Province,
  District,
  Ward,
  SHIPPING_PRICES,
} from "~/types/shipping.types";

interface ShippingInformationProps {
  order: Order;
  onTempUpdate: (updates: Partial<Order>) => void;
  onSave: (updatedOrder: Order) => void;
}

export const ShippingInformation: React.FC<ShippingInformationProps> = ({
  order,
  onTempUpdate,
  onSave,
}) => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressSelection>(
    parseAddressString(order.shipping_address),
  );
  const [shippingMethod, setShippingMethod] = useState<"Standard" | "Express">(
    order.shipping_method === "Express" ? "Express" : "Standard",
  );
  const [phoneNumber, setPhoneNumber] = useState(order.phone_number);
  const [firstName, setFirstName] = useState(order.first_name);
  const [lastName, setLastName] = useState(order.last_name);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/p/");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  const handleProvinceChange = async (event: any) => {
    const provinceCode = event.target.value;
    const province = provinces.find((p) => p.code === provinceCode);

    setSelectedAddress({
      ...selectedAddress,
      province: province?.name || "",
      province_code: provinceCode,
      district: "",
      district_code: "",
      ward: "",
      ward_code: "",
    });

    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`,
      );
      const data = await response.json();
      setDistricts(data.districts);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = async (event: any) => {
    const districtCode = event.target.value;
    const district = districts.find((d) => d.code === districtCode);

    setSelectedAddress({
      ...selectedAddress,
      district: district?.name || "",
      district_code: districtCode,
      ward: "",
      ward_code: "",
    });

    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`,
      );
      const data = await response.json();
      setWards(data.wards);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const handleWardChange = (event: any) => {
    const wardCode = event.target.value;
    const ward = wards.find((w) => w.code === wardCode);

    setSelectedAddress({
      ...selectedAddress,
      ward: ward?.name || "",
      ward_code: wardCode,
    });
  };

  const calculateEstimatedDelivery = (method: "Standard" | "Express") => {
    const today = new Date();
    const days = method === "Standard" ? 7 : 3;
    return format(addDays(today, days), "MMM dd, yyyy");
  };

  //regex for phone number validation
  const phoneNumberRegex = /^\d{10}$/;

  const handleSave = () => {
    const formattedAddress = formatAddressToString(selectedAddress);
    const estimatedDate = format(
      addDays(new Date(), shippingMethod === "Standard" ? 7 : 3),
      "yyyy-MM-dd",
    );

    onTempUpdate({
      shipping_address: formattedAddress,
      shipping_method: shippingMethod,
      shipping_date: estimatedDate,
    });

    setIsEditingAddress(false);
  };

  // Add this function to validate the fields
  const isFormValid = () => {
    return (
      firstName.trim() !== "" && // Ensure first name is not empty
      lastName.trim() !== "" && // Ensure last name is not empty
      selectedAddress.street_address.trim() !== "" && // Ensure street address is not empty
      selectedAddress.province_code !== "" && // Ensure province is selected
      selectedAddress.district_code !== "" && // Ensure district is selected
      selectedAddress.ward_code !== "" && // Ensure ward is selected
      phoneNumberRegex.test(phoneNumber) // Ensure phone number is valid
    );
  };

  const handleShippingMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (order.status !== OrderStatus.PENDING) return;

    const newMethod = e.target.value as "Standard" | "Express";
    setShippingMethod(newMethod);

    onTempUpdate({
      shipping_method: newMethod,
    });
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" sx={{ color: "primary.main" }}>
          <LocationOn /> Shipping Information
        </Typography>
        {order.status === OrderStatus.PENDING && (
          <Button
            startIcon={<Edit />}
            onClick={() => setIsEditingAddress(true)}
          >
            Edit
          </Button>
        )}
      </Box>

      {/* Current Address Display */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">Delivery Address</Typography>
        <Typography>
          {order.first_name} {order.last_name} | {order.phone_number}
        </Typography>
        <Typography>{order.shipping_address}</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Updated Shipping Method Selection with disabled state */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          <LocalShipping /> Shipping Method
        </Typography>
        <RadioGroup
          value={shippingMethod}
          onChange={handleShippingMethodChange}
        >
          <Paper variant="outlined" sx={{ mb: 1, p: 2 }}>
            <FormControlLabel
              value="Standard"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="subtitle2">Standard Delivery</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estimated delivery: {calculateEstimatedDelivery("Standard")}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    {formatCurrency(SHIPPING_PRICES.standard)}
                  </Typography>
                </Box>
              }
              disabled={order.status !== OrderStatus.PENDING}
            />
          </Paper>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <FormControlLabel
              value="Express"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="subtitle2">Express Delivery</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estimated delivery: {calculateEstimatedDelivery("Express")}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    {formatCurrency(SHIPPING_PRICES.express)}
                  </Typography>
                </Box>
              }
              disabled={order.status !== OrderStatus.PENDING}
            />
          </Paper>
        </RadioGroup>
      </Box>

      {/* Show current selection and price */}
      <Box sx={{ mt: 2, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
        <Typography variant="subtitle2">Selected Shipping Option:</Typography>
        <Typography>
          {shippingMethod === "Standard"
            ? "Standard Delivery"
            : "Express Delivery"}
          {" - "}
          {formatCurrency(
            shippingMethod === "Standard"
              ? SHIPPING_PRICES.standard
              : SHIPPING_PRICES.express,
          )}
        </Typography>
      </Box>

      {/* Address Edit Dialog */}
      <Dialog
        open={isEditingAddress}
        onClose={() => setIsEditingAddress(false)}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Edit Shipping Address
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  onTempUpdate({ first_name: e.target.value });
                }}
                required
                error={!firstName}
                helperText={!firstName && "First name is required"}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  onTempUpdate({ last_name: e.target.value });
                }}
                required
                error={!lastName}
                helperText={!lastName && "Last name is required"}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  onTempUpdate({ phone_number: e.target.value });
                }}
                inputProps={{ minLength: 5 }}
                error={!phoneNumberRegex.test(phoneNumber)} // Show error if regex does not match
                helperText={
                  !phoneNumberRegex.test(phoneNumber) &&
                  "Phone number must be 10 digits long and contain only numbers"
                }
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Province</InputLabel>
                <Select
                  value={selectedAddress.province_code}
                  onChange={handleProvinceChange}
                  label="Province"
                >
                  {provinces.map((province) => (
                    <MenuItem key={province.code} value={province.code}>
                      {province.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth disabled={!selectedAddress.province_code}>
                <InputLabel>District</InputLabel>
                <Select
                  value={selectedAddress.district_code}
                  onChange={handleDistrictChange}
                  label="District"
                >
                  {districts.map((district) => (
                    <MenuItem key={district.code} value={district.code}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth disabled={!selectedAddress.district_code}>
                <InputLabel>Ward</InputLabel>
                <Select
                  value={selectedAddress.ward_code}
                  onChange={handleWardChange}
                  label="Ward"
                >
                  {wards.map((ward) => (
                    <MenuItem key={ward.code} value={ward.code}>
                      {ward.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                value={selectedAddress.street_address}
                onChange={(e) =>
                  setSelectedAddress({
                    ...selectedAddress,
                    street_address: e.target.value,
                  })
                }
                inputProps={{
                  required: true,
                }}
                error={!selectedAddress.street_address}
                helperText={
                  !selectedAddress.street_address &&
                  "Street address is required"
                }
              />
            </Grid>
          </Grid>

          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              onClick={() => {
                setIsEditingAddress(false);
                setFirstName(order.first_name);
                setLastName(order.last_name);
                setPhoneNumber(order.phone_number);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleSave();
                onTempUpdate({
                  first_name: firstName,
                  last_name: lastName,
                  phone_number: phoneNumber,
                  shipping_address: formatAddressToString(selectedAddress),
                  shipping_method: shippingMethod,
                });
              }}
              disabled={!isFormValid()}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Paper>
  );
};
