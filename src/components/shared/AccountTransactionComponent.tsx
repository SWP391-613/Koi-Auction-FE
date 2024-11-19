import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PaymentDTO } from "~/types/payments.type";
import { Autocomplete } from "@mui/material";
import { ERROR_MESSAGE, GENERAL_TOAST_MESSAGE } from "~/constants/message";
import {
  createDepositPayment,
  createDrawOutRequest,
} from "~/apis/payment.apis";
import { Bank, fetchBankList } from "~/apis/external.apis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCheck } from "@fortawesome/free-solid-svg-icons";

interface AccountTransactionComponentProps {
  userId: number;
  token: string;
  onTransactionSuccess: () => void;
}

interface BankOption {
  name: string;
  shortName: string;
  code: string;
}

const AccountTransactionComponent: React.FC<
  AccountTransactionComponentProps
> = ({ userId, token, onTransactionSuccess }) => {
  const [amount, setAmount] = useState<number | "">("");
  const [transactionType, setTransactionType] = useState<"deposit" | "drawout">(
    "deposit",
  );
  const [bankNumber, setBankNumber] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [banks, setBanks] = useState<BankOption[]>([]);
  const [selectedBank, setSelectedBank] = useState<BankOption | null>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty string or valid numbers
    if (value === "") {
      setAmount("");
    } else {
      const numValue = Number(value);
      // Only update if it's a valid number and greater than 0
      if (!isNaN(numValue)) {
        setAmount(numValue);
      }
    }
  };

  const handlePresetAmountSelect = (event: SelectChangeEvent<number>) => {
    setAmount(event.target.value as number);
  };

  const amountOptions = [100000, 200000, 500000, 1000000, 2000000, 5000000];

  const handleTransactionTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: "deposit" | "drawout",
  ) => {
    if (newType !== null) {
      setTransactionType(newType);
    }
  };

  // Add this useEffect to fetch banks when component mounts
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetchBankList();
        const banksList = response.data.map((bank: Bank) => ({
          name: bank.name,
          shortName: bank.shortName,
          code: bank.code,
        }));
        setBanks(banksList);
      } catch (error) {
        console.error(ERROR_MESSAGE.FAILED_TO_LOAD_BANKS_LIST, error);
        toast.error(GENERAL_TOAST_MESSAGE.FAILED_TO_LOAD_BANKS_LIST);
      }
    };

    fetchBanks();
  }, []);

  const handleTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!amount) {
      toast.error(GENERAL_TOAST_MESSAGE.AMOUNT_MUST_BE_GREATER_THAN_ZERO);
      return;
    }

    if (amount <= 0) {
      toast.error(GENERAL_TOAST_MESSAGE.AMOUNT_MUST_BE_GREATER_THAN_ZERO);
      return;
    }

    if (transactionType === "drawout" && !selectedBank) {
      toast.error(GENERAL_TOAST_MESSAGE.PLEASE_SELECT_BANK);
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
        bank_name:
          transactionType === "drawout"
            ? selectedBank && selectedBank?.shortName
            : null,
      };
      if (transactionType === "deposit") {
        const response = await createDepositPayment(paymentDTO, token);
        if (response.paymentUrl) {
          window.location.href = response.paymentUrl;
        } else {
          toast.error(GENERAL_TOAST_MESSAGE.FAILED_TO_CREATE_PAYMENT_URL);
        }
      } else {
        await createDrawOutRequest(paymentDTO, token);
        toast.success(
          GENERAL_TOAST_MESSAGE.DRAW_OUT_REQUEST_CREATED_SUCCESSFULLY,
        );
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
            toast.error(GENERAL_TOAST_MESSAGE.UNEXPECTED_ERROR);
          }
        } else {
          toast.error(String(errorData));
        }
      } else {
        toast.error(GENERAL_TOAST_MESSAGE.UNEXPECTED_ERROR);
      }
    }
  };

  return (
    <>
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
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <TextField
              fullWidth
              type="number"
              label={`Amount to ${transactionType === "deposit" ? "Deposit" : "Draw Out"}`}
              value={amount}
              onChange={handleAmountChange}
              required
              variant="outlined"
              InputProps={{
                inputProps: {
                  min: 10000,
                  step: "10000",
                },
              }}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel>Preset Amounts</InputLabel>
              <Select
                value={amount}
                onChange={handlePresetAmountSelect}
                label="Preset Amounts"
              >
                {amountOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {transactionType === "drawout" && (
            <div className="flex flex-col">
              <TextField
                fullWidth
                label="Bank Account Number"
                value={bankNumber}
                onChange={(e) => setBankNumber(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <Autocomplete
                options={banks}
                getOptionLabel={(option) =>
                  `${option.shortName} - ${option.name}`
                }
                value={selectedBank}
                onChange={(event, newValue) => setSelectedBank(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Select Bank"
                    required
                  />
                )}
              />
            </div>
          )}
        </div>
        <Box sx={{ textAlign: "right", mt: 2 }}>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md text-xl hover:bg-green-500 transition"
          >
            Continue
          </button>
        </Box>
      </form>
      <ToastContainer />
    </>
  );
};

export default AccountTransactionComponent;
