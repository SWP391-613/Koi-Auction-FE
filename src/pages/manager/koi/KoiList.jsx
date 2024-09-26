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
} from "@mui/material";
import PaginationComponent from "../../../components/pagination/Pagination";

const KoiList = () => {
  const [kois, setKois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 6;

  const fetchKois = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching kois for page:", page);
      const response = await axios.get("http://localhost:4000/api/v1/kois", {
        params: {
          page: page - 1,
          limit: itemsPerPage,
        },
      });
      console.log("API response:", response.data);
      if (Array.isArray(response.data)) {
        setKois(response.data);
        setTotalPages(Math.ceil(300 / itemsPerPage));
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
          <PaginationComponent
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
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
