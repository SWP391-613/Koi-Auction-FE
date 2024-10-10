import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const SendNotifications: React.FC = () => {
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    recipientType: "all",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNotification((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNotification((prev) => ({
      ...prev,
      recipientType: event.target.value as string,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Sending notification:", notification);
    // Implement the actual send notification logic here
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Send Notifications</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          name="title"
          label="Notification Title"
          value={notification.title}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="message"
          label="Notification Message"
          multiline
          rows={4}
          value={notification.message}
          onChange={handleInputChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Recipient Type</InputLabel>
          <Select
            value={notification.recipientType}
            onChange={handleSelectChange}
          >
            <MenuItem value="all">All Users</MenuItem>
            <MenuItem value="premium">Premium Users</MenuItem>
            <MenuItem value="free">Free Users</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="mt-4"
        >
          Send Notification
        </Button>
      </form>
    </div>
  );
};

export default SendNotifications;
