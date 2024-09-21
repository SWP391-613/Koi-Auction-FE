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

const KoiList = () => {
  const [kois, setKois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKois = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/kois", {
          params: {
            page: 0,
            limit: 100,
          },
        });
        setKois(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching kois");
        setLoading(false);
      }
    };

    fetchKois();
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
        Koi List
      </Typography>
      <List>
        {kois.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={item.description} src={item.thumbnail} />
              </ListItemAvatar>
              <ListItemText
                primary={`Name: ` + item.name}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      Sex: {item.sex}
                    </Typography>
                    <br />
                    Length: {item.length}
                    <br />
                    Age: {item.age}
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

export default KoiList;
