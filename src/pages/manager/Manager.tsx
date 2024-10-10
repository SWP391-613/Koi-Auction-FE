import React from "react";
import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../../layouts/dashboard/DashBoardLayout";

function Manager() {
  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Manager Dashboard
      </Typography>
      <Box sx={{ height: "calc(100vh - 64px)", width: "100%", p: 2 }}>
        {/* Grafana iframe for monitoring */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Monitoring Dashboard</Typography>
          <iframe
            title="Grafana Dashboard"
            src="http://localhost:3001/d/fe0ctkr6q6xa8c/jvm-micrometer?orgId=1&refresh=30s"
            width="100%"
            height="600px"
            frameBorder="0"
            style={{ border: "none", borderRadius: "8px" }}
          />
        </Box>

        {/* The content from nested routes will be rendered here */}
        <Outlet />
      </Box>
    </DashboardLayout>
  );
}

export default Manager;
