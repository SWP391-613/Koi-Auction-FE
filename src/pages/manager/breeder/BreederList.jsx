import React, { useEffect, useState } from "react";
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

const BreederList = () => {
  const [breeders, setBreeders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBreeders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/breeders",
          {
            params: {
              page: 0,
              limit: 10,
            },
          },
        );
        setBreeders(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching breeders");
        setLoading(false);
      }
    };

    fetchBreeders();
  }, []);

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
        Breeders
      </Typography>
      <List>
        {breeders.map((breeder) => (
          <React.Fragment key={breeder.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={breeder.full_name} src={breeder.avatar_url} />
              </ListItemAvatar>
              <ListItemText
                primary={breeder.full_name}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      Email: {breeder.email}
                    </Typography>
                    <br />
                    Address: {breeder.address}
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
};

export default BreederList;
