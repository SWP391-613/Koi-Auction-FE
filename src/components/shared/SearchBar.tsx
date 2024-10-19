import React from "react";
import {
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  loading,
  placeholder = "Search...",
}) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        variant="outlined"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                variant="contained"
                color="primary"
                onClick={onSearch}
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SearchIcon />
                  )
                }
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default SearchBar;
