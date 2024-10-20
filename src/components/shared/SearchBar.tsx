import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  loading,
  placeholder = "Search...",
}) => {
  return (
    <div
      style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}
    >
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        variant="outlined"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {loading && <CircularProgress size={20} color="inherit" />}
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default SearchBar;
