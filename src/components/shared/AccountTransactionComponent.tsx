import {
  Box,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createDepositPayment, createDrawOutRequest } from "~/utils/apiUtils";
import { PaymentDTO } from "~/types/orders.type";

interface AccountTransactionComponentProps {
  userId: number;
  token: string;
  onTransactionSuccess: () => void;
}

const AccountTransactionComponent: React.FC<
  AccountTransactionComponentProps
> = ({ userId, token, onTransactionSuccess }) => {
  const [amount, setAmount] = useState<number>(0);
  const [transactionType, setTransactionType] = useState<"deposit" | "drawout">(
    "deposit",
  );
  const [bankNumber, setBankNumber] = useState<string>("");
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleTransactionTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: "deposit" | "drawout",
  ) => {
    if (newType !== null) {
      setTransactionType(newType);
    }
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      toast.error("Amount must be greater than 0.");
      return;
    }

    try {
      const paymentDTO: PaymentDTO = {
        payment_amount: amount,
        payment_method:
          transactionType === "deposit" ? "VNPAY" : "BANK_TRANSFER",
        payment_type: transactionType === "deposit" ? "DEPOSIT" : "DRAW_OUT",
        user_id: userId,
        order_id: null,
        bank_number: transactionType === "drawout" ? bankNumber : null,
      };
      if (transactionType === "deposit") {
        const response = await createDepositPayment(paymentDTO, token);
        if (response.paymentUrl) {
          window.location.href = response.paymentUrl;
        } else {
          toast.error("Failed to create payment URL");
        }
      } else {
        await createDrawOutRequest(paymentDTO, token);
        toast.success("Draw-out request created successfully");
        onTransactionSuccess();
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        if (errorData && typeof errorData === "object") {
          if ("reason" in errorData) {
            toast.error(errorData.reason);
          } else if ("message" in errorData) {
            toast.error(errorData.message);
          } else {
            toast.error("An unexpected error occurred");
          }
        } else {
          toast.error(String(errorData));
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 2 }}>
      <form onSubmit={handleTransaction}>
        <ToggleButtonGroup
          color="primary"
          value={transactionType}
          exclusive
          onChange={handleTransactionTypeChange}
          aria-label="Transaction Type"
          sx={{ marginBottom: 2, width: "100%" }}
        >
          <ToggleButton value="deposit" sx={{ width: "50%" }}>
            Deposit
          </ToggleButton>
          <ToggleButton value="drawout" sx={{ width: "50%" }}>
            Draw Out
          </ToggleButton>
        </ToggleButtonGroup>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            type="number"
            label={`Amount to ${transactionType === "deposit" ? "Deposit" : "Draw Out"}`}
            value={amount}
            onChange={handleAmountChange}
            required
            variant="outlined"
            InputProps={{ inputProps: { min: 1 } }}
          />
          {transactionType === "drawout" && (
            <TextField
              fullWidth
              label="Bank Number"
              value={bankNumber}
              onChange={(e) => setBankNumber(e.target.value)}
            />
          )}
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ padding: "10px 20px" }}
          >
            {transactionType === "deposit" ? "Deposit" : "Draw Out"}
          </Button>
        </Box>
      </form>
      <ToastContainer />
    </Box>
  );
};

export default AccountTransactionComponent;
