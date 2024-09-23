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

const StaffList = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/staffs",
          {
            params: {
              page: 0,
              limit: 10,
            },
          },
        );
        setStaffs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching staffs");
        setLoading(false);
      }
    };

    fetchStaffs();
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
      <Typography variant="h4" gutterBotto>
        Staffs
      </Typography>
      <List>
        {staffs.map((staff) => (
          <React.Fragment key={staff.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={staff.full_name} src={staff.avatar_url} />
              </ListItemAvatar>
              <ListItemText
                primary={staff.full_name}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      Email: {staff.email}
                    </Typography>
                    <br />
                    Address: {staff.address}
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

export default StaffList;
