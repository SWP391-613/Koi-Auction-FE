import React, { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

interface NavLink {
  to: string;
  label: string;
}

interface DashboardLayoutProps {
  title: string;
  navLinks: NavLink[];
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
                                                           title,
                                                           navLinks,
                                                           children,
                                                         }) => {
  const location = useLocation();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const isActiveRoute = (path: string) => {
    return location.pathname.endsWith(path);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="static" sx={{ backgroundColor: "#686D76" }}>
        <Toolbar sx={{ display: "flex", gap: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>

          <List
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              gap: 1,
              position: "relative",
            }}
          >
            {navLinks.map((link) => (
              <ListItem
                key={link.to}
                sx={{
                  width: "auto",
                  padding: 0,
                }}
              >
                <ListItemButton
                  component={Link}
                  to={link.to}
                  onMouseEnter={() => setHoveredTab(link.to)}
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
                      transform: isActiveRoute(link.to)
                        ? "translateX(-50%) scale(1)"
                        : "translateX(-50%) scale(0)",
                      transition: "transform 0.3s ease",
                      opacity: isActiveRoute(link.to) ? 1 : 0,
                    },
                    "&:hover:before": {
                      transform: "translateX(-50%) scale(0.6)",
                      opacity: 0.7,
                    },
                  }}
                >
                  <ListItemText
                    primary={link.label}
                    sx={{
                      ".MuiTypography-root": {
                        color: isActiveRoute(link.to)
                          ? "white"
                          : "rgba(255, 255, 255, 0.7)",
                        fontWeight: isActiveRoute(link.to) ? 500 : 400,
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

      <Box
        component="main"
        sx={{
          flex: 1,
          backgroundColor: "#EEEEEE",
          overflow: "auto",
          p: 3,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
