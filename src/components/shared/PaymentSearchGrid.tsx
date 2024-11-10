import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import {
  PaymentResponse,
  PaymentStatus,
  PaymentType,
} from "~/types/payments.type";
import { getPaymentStatusColor } from "~/utils/colorUtils";
import { formatCurrency } from "~/utils/currencyUtils";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

interface PaymentSearchGridProps {
  payments: PaymentResponse[];
  onStatusUpdate: (paymentId: number, newStatus: PaymentStatus) => void;
}

const PaymentSearchGrid: React.FC<PaymentSearchGridProps> = ({
  payments,
  onStatusUpdate,
}) => {
  const LabeledInfo = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <Typography variant="body2">
      <strong>{label}:</strong> {value}
    </Typography>
  );

  const formatPaymentDate = (dateArray: number[]): string => {
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const PaymentTypeView = (paymentType: PaymentType) => {
    switch (paymentType) {
      case PaymentType.ORDER:
        return "Order Payment";
      case PaymentType.DEPOSIT:
        return "Deposit Payment";
      case PaymentType.DRAW_OUT:
        return "Draw Out Payment";
      default:
        return "Unknown";
    }
  };

  return (
    <>
      {payments.map((payment) => (
        <Card
          key={payment.id}
          sx={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 3,
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "box-shadow 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          <CardContent
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              p: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" component="div" sx={{ mr: 2 }}>
                  Payment #{payment.id}
                </Typography>
                <Chip
                  label={payment.payment_status}
                  color={getPaymentStatusColor(payment.payment_status)}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={3}
                  sx={{ p: 2, height: "100%", backgroundColor: "#f0f8ff" }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Payment Details
                  </Typography>
                  <LabeledInfo
                    label="Amount"
                    value={formatCurrency(payment.payment_amount)}
                  />
                  <LabeledInfo label="Method" value={payment.payment_method} />
                  <LabeledInfo
                    label="Type"
                    value={PaymentTypeView(payment.payment_type)}
                  />
                  <LabeledInfo
                    label="Date"
                    value={formatPaymentDate(payment.payment_date)}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={3}
                  sx={{ p: 2, height: "100%", backgroundColor: "#f0fff0" }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Additional Info
                  </Typography>
                  <LabeledInfo
                    label="Customer"
                    value={
                      payment.user.first_name + " " + payment.user.last_name
                    }
                  />
                  <LabeledInfo
                    label="Customer Email"
                    value={payment.user.email}
                  />
                  {payment.order_id && (
                    <LabeledInfo label="Order ID" value={payment.order_id} />
                  )}
                  {payment.bank_number && (
                    <LabeledInfo
                      label="Bank Number"
                      value={payment.bank_number}
                    />
                  )}
                  {/* Add more payment-specific fields here */}
                </Paper>
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: "auto",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                p: 2,
              }}
            >
              {payment.payment_status === PaymentStatus.PENDING && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleOutlineIcon />}
                    onClick={() =>
                      onStatusUpdate(payment.id, PaymentStatus.SUCCESS)
                    }
                    sx={{
                      mr: 2,
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      "&:hover": {
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    Mark as Completed
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<CancelOutlinedIcon />}
                    onClick={() =>
                      onStatusUpdate(payment.id, PaymentStatus.REFUNDED)
                    }
                    sx={{
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      "&:hover": {
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    Cancel Payment
                  </Button>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default PaymentSearchGrid;
