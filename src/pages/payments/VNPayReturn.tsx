import {
  AccessTime,
  CheckCircleOutline,
  ErrorOutline,
} from "@mui/icons-material";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { useUserData } from "~/hooks/useUserData";

const VNPayReturn: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    message: string;
    userId?: string;
    amount?: number;
    responseCode?: string;
    paymentType?: string;
  } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserData();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const success = searchParams.get("success") === "true";
    const message = searchParams.get("message") || "";
    const userId = searchParams.get("userId") || undefined;
    const amount = searchParams.get("amount")
      ? Number(searchParams.get("amount"))
      : undefined;
    const responseCode = searchParams.get("responseCode") || undefined;
    const paymentType = searchParams.get("paymentType") || undefined;

    const result = {
      success,
      message,
      userId,
      amount,
      responseCode,
      paymentType,
    };
    setPaymentResult(result);

    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }

    setLoading(false);
  }, [location.search]);

  useEffect(() => {
    if (!loading && paymentResult) {
      const redirectTimer = setTimeout(() => {
        switch (paymentResult.paymentType) {
          case "deposit":
            if (paymentResult.userId) {
              navigate(
                user?.role_name === "breeder" ? "/breeders/" : `/members/`,
              );
            }
            break;
          case "order":
            navigate("/members/orders");
            break;
        }
      }, 5000);

      return () => clearTimeout(redirectTimer);
    }
  }, [loading, paymentResult, navigate, user]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      {loading ? (
        <LoadingComponent />
      ) : (
        <Card elevation={3}>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            {paymentResult && (
              <>
                <Box sx={{ mb: 2 }}>
                  {paymentResult.success ? (
                    <CheckCircleOutline
                      sx={{ fontSize: 60, color: "success.main" }}
                    />
                  ) : (
                    <ErrorOutline sx={{ fontSize: 60, color: "error.main" }} />
                  )}
                </Box>
                <Typography
                  variant="h5"
                  gutterBottom
                  fontWeight="bold"
                  color={paymentResult.success ? "success.main" : "error.main"}
                >
                  {paymentResult.success
                    ? "Payment Successful"
                    : "Payment Failed"}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {paymentResult.message}
                </Typography>
                {paymentResult.amount && (
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Amount: {paymentResult.amount.toLocaleString()} VND
                  </Typography>
                )}
                {paymentResult.responseCode && (
                  <Typography variant="body2" color="text.secondary">
                    Response Code: {paymentResult.responseCode}
                  </Typography>
                )}
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccessTime
                    sx={{ mr: 1, fontSize: 20, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Redirecting in 5 seconds...
                  </Typography>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default VNPayReturn;
