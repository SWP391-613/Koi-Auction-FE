import React, { ReactNode } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ROUTING_PATH } from "~/constants/endPoints";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <Box display="flex" height="">
      <Box
        component="nav"
        sx={{
          width: "10rem",
          backgroundColor: "#686D76",
          marginRight: 3,
          color: "white",
        }}
      >
        <List>
          <ListItem>
            <ListItemButton component={Link} to={ROUTING_PATH.MANAGERS_KOI}>
              <ListItemText primary="Koi" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              component={Link}
              to={ROUTING_PATH.MANAGERS_AUCTIONS}
            >
              <ListItemText primary="Auctions" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to={ROUTING_PATH.MANAGERS_BREEDER}>
              <ListItemText primary="Breeder" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to={ROUTING_PATH.MANAGERS_MEMBER}>
              <ListItemText primary="Member" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to={ROUTING_PATH.MANAGERS_STAFF}>
              <ListItemText primary="Staff" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to={ROUTING_PATH.MANAGERS_SETTING}>
              <ListItemText primary="Settings" />
            </ListItemButton>
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
