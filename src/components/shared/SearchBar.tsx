import React, { useState, useEffect } from "react";
import { TextField, Button, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  // Add any props you need, e.g., placeholder, debounceTime, etc.
  placeholder?: string;
  debounceTime?: number; // Optional: Delay for debouncing the search input
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  debounceTime = 300,
}) => {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query);

  // Debounce the search query to avoid unnecessary API calls on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [query, debounceTime]);

  // This effect will run when `debouncedQuery` changes (i.e., after the debounce delay)
  useEffect(() => {
    if (debouncedQuery.trim()) {
      // Call your API here with the debouncedQuery
      console.log(`Searching for: ${debouncedQuery}`);
      alert(`Searching for: ${debouncedQuery}`);

      // Example API call (replace with your actual API logic)
      // fetch(`https://api.example.com/search?q=${debouncedQuery}`)
      //   .then(response => response.json())
      //   .then(data => {
      //     console.log(data);
      //   });
    }
  }, [debouncedQuery]);

  const handleSearch = () => {
    if (debouncedQuery.trim()) {
      console.log(`Searching for: ${debouncedQuery}`);
      // Replace with your API call logic
      // fetch(`https://api.example.com/search?q=${debouncedQuery}`)
      //   .then(response => response.json())
      //   .then(data => {
      //     console.log(data);
      //   });
    }
  };

  // Handle Enter key event
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="mt-10 bg-white d-flex justify-center items-center w-[80%]">
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
                startIcon={<SearchIcon />}
              >
                Search
              </Button>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default SearchBar;
