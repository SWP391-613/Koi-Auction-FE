import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Pagination,
  Box,
} from "@mui/material";

const KoiList = () => {
  const [kois, setKois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 6; // Giới hạn số lượng kois trên mỗi trang

  const fetchKois = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching kois for page:", page);
      const response = await axios.get("http://localhost:4000/api/v1/kois", {
        params: {
          page: page - 1, // API expects 0-based index
          limit: itemsPerPage,
        },
      });
      console.log("API response:", response.data);
      // Giả sử response.data chứa mảng kois
      if (Array.isArray(response.data)) {
        setKois(response.data); // Sử dụng response.data trực tiếp
        setTotalPages(Math.ceil(300 / itemsPerPage)); // Cập nhật tổng số trang
      } else {
        console.error("Unexpected API response structure:", response.data);
        setError("Unexpected data structure from API");
      }
    } catch (err) {
      console.error("Error details:", err);
      setError("Error fetching kois: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchKois();
  }, [fetchKois]);

  const handlePageChange = (event, value) => {
    console.log("Changing to page:", value);
    setPage(value);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      {/* Adjust padding as needed */}
      <Typography variant="h4" gutterBottom>
        Koi List
      </Typography>
      {kois && kois.length > 0 ? (
        <>
          <List>
            {kois.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt={item.description} src={item.thumbnail} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Name: ${item.name || "N/A"}`}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          Sex: {item.sex || "N/A"}
                        </Typography>
                        <br />
                        Length: {item.length || "N/A"}
                        <br />
                        Age: {item.age || "N/A"}
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      ) : (
        <Typography>
          No kois available. (Current page: {page}, Total pages: {totalPages})
        </Typography>
      )}
    </Container>
  );
};

export default KoiList;
