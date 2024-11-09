import React, { ReactNode, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { ROUTING_PATH } from "~/constants/endPoints";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const navItems = [
    { path: ROUTING_PATH.MANAGERS_HOME, label: "Home" },
    { path: ROUTING_PATH.MANAGERS_KOI, label: "Koi" },
    { path: ROUTING_PATH.MANAGERS_AUCTIONS, label: "Auctions" },
    { path: ROUTING_PATH.MANAGERS_BREEDER, label: "Breeder" },
    { path: ROUTING_PATH.MANAGERS_MEMBER, label: "Member" },
    { path: ROUTING_PATH.MANAGERS_STAFF, label: "Staff" },
    { path: ROUTING_PATH.MANAGERS_SETTING, label: "Settings" },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="static" sx={{ backgroundColor: "#686D76" }}>
        <Toolbar>
          <List
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              gap: 1,
              position: "relative",
            }}
          >
            {navItems.map((item) => (
              <ListItem
                key={item.path}
                sx={{
                  width: "auto",
                  padding: 0,
                }}
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onMouseEnter={() => setHoveredTab(item.path)}
                  onMouseLeave={() => setHoveredTab(null)}
                  sx={{
                    px: 3,
                    py: 2,
                    position: "relative",
                    transition: "all 0.3s ease",
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      left: "50%",
                      bottom: "0",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                      transform: isActiveRoute(item.path)
                        ? "translateX(-50%) scale(1)"
                        : "translateX(-50%) scale(0)",
                      transition: "transform 0.3s ease",
                      opacity: isActiveRoute(item.path) ? 1 : 0,
                    },
                    "&:hover:before": {
                      transform: "translateX(-50%) scale(0.6)",
                      opacity: 0.7,
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{
                      ".MuiTypography-root": {
                        color: isActiveRoute(item.path)
                          ? "white"
                          : "rgba(255, 255, 255, 0.7)",
                        fontWeight: isActiveRoute(item.path) ? 500 : 400,
                        transition: "all 0.3s ease",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
