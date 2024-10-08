import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateAccountBalance } from "~/utils/apiUtils";

interface DepositComponentProps {
  userId: number;
  token: string;
}

const DepositComponent: React.FC<DepositComponentProps> = ({
  userId,
  token,
}) => {
  const [payment, setPayment] = useState<number>(0);

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayment(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (payment <= 0) {
      toast.error("Payment amount must be greater than 0.");
      return;
    }

    try {
      const response = await updateAccountBalance(userId, payment, token);
      if (response.status === 200) {
        toast.success("Deposit successful");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 2 }}>
      <form
        className="flex justify-between items-center"
        onSubmit={handleSubmit}
      >
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            type="number"
            label="Amount to Deposit"
            value={payment}
            onChange={handlePaymentChange}
            required
            variant="outlined"
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ padding: "10px 20px" }}
          >
            Deposit
          </Button>
        </Box>
      </form>

      {/* Toast notification container */}
      <ToastContainer />
    </Box>
  );
};

export default DepositComponent;