import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Slider,
  Typography,
} from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  FilterValues,
  KoiFilterValues,
  AuctionFilterValues,
  BidMethod,
} from "~/types/search.types";

interface SearchBarProps {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  loading?: boolean;
  placeholder?: string;
  varieties?: string[];
  type: "koi" | "auction";
}

const BID_METHODS: BidMethod[] = [
  "All",
  "Fixed Price",
  "Descending Bid",
  "Ascending Bid",
];

const SearchBar: React.FC<SearchBarProps> = ({
  values = {
    type: "koi",
    search: "",
    bidMethod: "All",
    category: "All",
    gender: "All",
    minSize: 0,
    maxSize: 100,
    minAge: 0,
    maxAge: 10,
    priceRange: [0, 1000000],
  } as KoiFilterValues,
  onChange,
  loading = false,
  placeholder = "Search...",
  varieties = [],
  type = "koi",
}) => {
  // Add safety check
  if (!values) {
    return null;
  }

  const handleChange = (field: string, value: any) => {
    if (type === "koi") {
      onChange({
        ...values,
        type: "koi",
        [field]: value,
      } as KoiFilterValues);
    } else {
      onChange({
        ...values,
        type: "auction",
        [field]: value,
      } as AuctionFilterValues);
    }
  };

  // Type guard
  const isKoiFilter = (values: FilterValues): values is KoiFilterValues => {
    return values.type === "koi";
  };

  // Add type guard for AuctionFilterValues
  const isAuctionFilter = (
    values: FilterValues,
  ): values is AuctionFilterValues => {
    return values.type === "auction";
  };

  return (
    <Box sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          value={values.search}
          onChange={(e) => handleChange("search", e.target.value)}
          placeholder={placeholder}
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SearchIcon color="action" />
                )}
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Bid Method</InputLabel>
          <Select
            value={values.bidMethod}
            onChange={(e) => handleChange("bidMethod", e.target.value)}
            label="Bid Method"
          >
            {BID_METHODS.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {type === "koi" && isKoiFilter(values) && (
          <>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={values.category}
                onChange={(e) => handleChange("category", e.target.value)}
                label="Category"
              >
                {varieties.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={values.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                label="Gender"
              >
                {["All", "Male", "Female"].map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
      </Box>

      {type === "koi" && isKoiFilter(values) && (
        <Box sx={{ display: "flex", gap: 4 }}>
          <Box sx={{ width: 300 }}>
            <Typography gutterBottom>Size (cm)</Typography>
            <Slider
              value={[values.minSize || 0, values.maxSize || 100]}
              onChange={(_, newValue) => {
                handleChange("minSize", (newValue as number[])[0]);
                handleChange("maxSize", (newValue as number[])[1]);
              }}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
          </Box>

          <Box sx={{ width: 300 }}>
            <Typography gutterBottom>Age (years)</Typography>
            <Slider
              value={[values.minAge || 0, values.maxAge || 10]}
              onChange={(_, newValue) => {
                handleChange("minAge", (newValue as number[])[0]);
                handleChange("maxAge", (newValue as number[])[1]);
              }}
              valueLabelDisplay="auto"
              min={0}
              max={10}
            />
          </Box>

          <Box sx={{ width: 300 }}>
            <Typography gutterBottom>Price Range ($)</Typography>
            <Slider
              value={values.priceRange || [0, 10000]}
              onChange={(_, newValue) => handleChange("priceRange", newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
            />
          </Box>
        </Box>
      )}

      {type === "auction" && isAuctionFilter(values) && (
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Bid Method</InputLabel>
          <Select
            value={values.bidMethod || "All"}
            onChange={(e) => handleChange("bidMethod", e.target.value)}
            label="Bid Method"
          >
            {BID_METHODS.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

export default SearchBar;
