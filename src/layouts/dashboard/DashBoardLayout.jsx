import React from "react";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  return (
    <Box display="flex" height="100vh">
      <Box
        component="nav"
        sx={{ width: "240px", backgroundColor: "#f4f4f4", p: 2 }}
      >
        <List>
          <ListItem button component={Link} to="/manager/koi">
            <ListItemText primary="Koi" />
          </ListItem>
          <ListItem button component={Link} to="/manager/breeder">
            <ListItemText primary="Breeder" />
          </ListItem>
          <ListItem button component={Link} to="/manager/member">
            <ListItemText primary="Member" />
          </ListItem>
          <ListItem button component={Link} to="/manager/employee">
            <ListItemText primary="Employee" />
          </ListItem>
          <ListItem button component={Link} to="/manager/setting">
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Box>
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
