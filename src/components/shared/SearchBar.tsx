import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  placeholder?: string;
  debounceTime?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  debounceTime = 300,
}) => {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query);
  const [loading, setLoading] = useState<boolean>(false); // New loading state

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [query, debounceTime]);

  // This effect will run when `debouncedQuery` changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setLoading(true); // Start loading when a search is triggered

      // Simulate an API call or replace with your actual logic
      setTimeout(() => {
        setLoading(false); // Stop loading when API call finishes
        console.log(`Searching for: ${debouncedQuery}`);
        // Example API call:
        // fetch(`https://api.example.com/search?q=${debouncedQuery}`)
        //   .then(response => response.json())
        //   .then(data => {
        //     console.log(data);
        //   });
      }, 500); // Simulated delay for API call
    }
  }, [debouncedQuery]);

  // This function is triggered by the search button or Enter key
  const handleSearch = () => {
    if (debouncedQuery.trim()) {
      setLoading(true);
      console.log(`Searching for: ${debouncedQuery}`);
      // Add your API call logic here
      setTimeout(() => {
        setLoading(false);
      }, 500); // Simulated API delay
    }
  };

  // Handle Enter key event
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "white",
        marginTop: "2rem",
      }}
    >
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown} // Listen to Enter key
        placeholder={placeholder}
        variant="outlined"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SearchIcon />
                  )
                }
                disabled={loading} // Disable the button while loading
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
