import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Slider,
  Box,
  Grid,
  Typography,
  Menu,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { API_URL_DEVELOPMENT } from "~/constants/endPoints";
import { BreedersResponse, CategoryResponse } from "~/types/paginated.types";
import { CategoryModel } from "~/types/categories.type";
import { QuantityKoiByGenderResponse } from "~/types/kois.type";
import { QuantityKoiInAuctionByBidMethod } from "~/types/auctions.type";

interface SearchKoiBarProps {
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
  placeholder?: string;
}

const SearchKoiBar: React.FC<SearchKoiBarProps> = ({
  value,
  onChange,
  loading,
  placeholder = "Search by title...",
}) => {
  // State for additional filters
  const [breeder, setBreeder] = useState("");
  const [size, setSize] = useState<number[]>([0, 100]);
  const [koiBreeders, setKoiBreeders] = useState<BreedersResponse>({
    total_page: 0,
    total_item: 0,
    item: [],
  });
  const [category, setCategory] = useState("");
  const [categoryAPI, setCategoryAPI] = useState<CategoryResponse>({
    total_page: 0,
    total_item: 0,
    item: [],
  });
  const [sex, setSex] = useState("");
  const [sexAPI, setSexAPI] = useState<QuantityKoiByGenderResponse>({
    total: 0,
    male: 0,
    female: 0,
    unknown: 0,
  });
  const [bidMethod, setBidMethod] = useState("");
  const [bidMethodAPI, setBidMethodAPI] =
    useState<QuantityKoiInAuctionByBidMethod>({
      total: 0,
      ascending_bid: 0,
      descending_bid: 0,
      fixed_price: 0,
    });

  useEffect(() => {
    const fetchAllKoiByBidMethod = async () => {
      try {
        const response = await axios.get(
          `${API_URL_DEVELOPMENT}/auctionkois/count-by-bid-method`,
        );
        setBidMethodAPI(response.data);
      } catch (error) {
        console.error("Error fetching koi", error);
      }
    };

    const fetchAllKoiByGender = async () => {
      try {
        const response = await axios.get(
          `${API_URL_DEVELOPMENT}/kois/count-by-gender`,
        );
        setSexAPI(response.data);
      } catch (error) {
        console.error("Error fetching koi", error);
      }
    };

    const fetchAllCategories = async () => {
      try {
        const response = await axios.get(`${API_URL_DEVELOPMENT}/categories`, {
          params: {
            page: 0,
            limit: 20,
          },
        });
        setCategoryAPI(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchAllBreeders = async () => {
      try {
        const response = await axios.get(`${API_URL_DEVELOPMENT}/breeders`, {
          params: {
            page: 0,
            limit: 20,
          },
        });
        setKoiBreeders(response.data || []);
      } catch (error) {
        console.error("Error fetching breeders:", error);
      }
    };

    fetchAllBreeders();
    fetchAllCategories();
    fetchAllKoiByGender();
    fetchAllKoiByBidMethod();
  }, []);

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#f5f5f5",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            displayEmpty
            variant="outlined"
          >
            <MenuItem value="" disabled>
              Search by category
            </MenuItem>
            {categoryAPI?.item?.length > 0 &&
              categoryAPI.item.map((category: CategoryModel, index: number) => (
                <MenuItem key={index} value={category.id}>
                  {category.name} ({category.koi_count})
                </MenuItem>
              ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Select
            value={bidMethod}
            onChange={(e) => setBidMethod(e.target.value)}
            fullWidth
            displayEmpty
            variant="outlined"
          >
            <MenuItem value="" disabled>
              Search by price type
            </MenuItem>
            <MenuItem value="all">Auction ({bidMethodAPI.total})</MenuItem>
            <MenuItem value="ascending">
              Ascending Bid ({bidMethodAPI.ascending_bid})
            </MenuItem>
            <MenuItem value="descending">
              Descending Bid ({bidMethodAPI.descending_bid})
            </MenuItem>
            <MenuItem value="fixed">
              Fixed Price ({bidMethodAPI.fixed_price})
            </MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Select
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            fullWidth
            displayEmpty
            variant="outlined"
          >
            <MenuItem value="" disabled>
              Search by sex
            </MenuItem>
            <MenuItem value="MALE">Male ({sexAPI.male})</MenuItem>
            <MenuItem value="FEMALE">Female ({sexAPI.female})</MenuItem>
            <MenuItem value="UNKNOWN">Unknown ({sexAPI.unknown})</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Select
            value={breeder}
            onChange={(e) => setBreeder(e.target.value)}
            fullWidth
            displayEmpty
            variant="outlined"
          >
            <MenuItem value="" disabled>
              Search by breeder
            </MenuItem>
            {koiBreeders?.item?.length > 0 &&
              koiBreeders.item.map((breeder, index) => (
                <MenuItem key={index} value={breeder.id}>
                  {breeder.first_name} {breeder.last_name} ({breeder.koi_count})
                </MenuItem>
              ))}
            ;
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography gutterBottom>Size (inches)</Typography>
            <Slider
              value={size}
              onChange={(e, newValue) => setSize(newValue as number[])}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
          </Box>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button variant="contained" color="primary">
          Filter
        </Button>
        <Typography color="error" variant="body2" sx={{ cursor: "pointer" }}>
          View sold koi / auction ended koi
        </Typography>
      </Box>
    </Box>
  );
};

export default SearchKoiBar;
