import { Box, Typography } from "@mui/material";
import React from "react";
const Settings = () => {
  return (
    <div>
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
    </div>
  );
};

export default Settings;
