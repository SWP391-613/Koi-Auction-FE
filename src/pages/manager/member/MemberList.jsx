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

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/members",
          {
            params: {
              page: 0,
              limit: 10,
            },
          },
        );
        setMembers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching members");
        setLoading(false);
      }
    };

    fetchMembers();
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
        Members
      </Typography>
      <List>
        {members.map((member) => (
          <React.Fragment key={member.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={member.full_name} src={member.avatar_url} />
              </ListItemAvatar>
              <ListItemText
                primary={member.full_name}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      Email: {member.email}
                    </Typography>
                    <br />
                    Address: {member.address}
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

export default MemberList;
