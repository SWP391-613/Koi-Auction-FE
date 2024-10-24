import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createDrawOutRequest } from "~/utils/apiUtils";
import { PaymentDTO } from "~/pages/detail/member/UserOrder";

interface DrawOutComponentProps {
  userId: number;
  token: string;
  onDrawOutSuccess: () => void;
}

const DrawOutComponent: React.FC<DrawOutComponentProps> = ({
  userId,
  token,
  onDrawOutSuccess,
}) => {
  const [amount, setAmount] = useState<number>(0);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      toast.error("Draw-out amount must be greater than 0.");
      return;
    }

    try {
      const paymentDTO: PaymentDTO = {
        payment_amount: amount,
        payment_method: "BANK_TRANSFER",
        payment_type: "DRAW_OUT",
        user_id: userId,
        order_id: null,
      };
      const response = await createDrawOutRequest(paymentDTO, token);
      toast.success("Draw-out request created successfully");
      onDrawOutSuccess();
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
        className="flex flex-row justify-between gap-3 items-center"
        onSubmit={handleSubmit}
      >
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            type="number"
            label="Amount to Draw Out"
            value={amount}
            onChange={handleAmountChange}
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
            Draw Out
          </Button>
        </Box>
      </form>
      <ToastContainer />
    </Box>
  );
};

export default DrawOutComponent;
