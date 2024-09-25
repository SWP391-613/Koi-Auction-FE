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
        {/* The content from nested routes will be rendered here */}
        <Outlet />
      </Box>
    </DashboardLayout>
  );
}

export default Manager;
