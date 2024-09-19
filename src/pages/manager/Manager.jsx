import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DashboardLayout from "../../layouts/dashboard/DashBoardLayout";
import AppProvider from "../../contexts/AppProvider";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "age", headerName: "Age", width: 110 },
  { field: "email", headerName: "Email", width: 200 },
];

const rows = [
  { id: 1, name: "John Doe", age: 35, email: "john@example.com" },
  { id: 2, name: "Jane Smith", age: 42, email: "jane@example.com" },
  // Add more rows as needed
];

function Manager() {
  return (
    <AppProvider>
      {" "}
      {/* Wrap DashboardLayout with AppProvider */}
      <DashboardLayout>
        <Typography variant="h4" gutterBottom>
          Manager Dashboard
        </Typography>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}

export default Manager;
