import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KoiCreateForm from "~/components/shared/KoiCreateForm";
import { getCookie } from "~/utils/cookieUtils";

const AddKoi = () => {
  const navigate = useNavigate();
  const handleKoiCreated = () => {
    setTimeout(() => {
      navigate("/breeders");
    }, 3000);
  };

  const handleBack = () => {
    setTimeout(() => {
      navigate("/breeders");
    }, 1000);
  };

  const userId = getCookie("user_id");
  useEffect(() => {
    if (!userId) {
      return;
    }
  }, [userId]);

  return (
    <div className="flex flex-col gap-5 bg-white p-10 rounded-2xl">
      <Typography variant="h3" sx={{ textAlign: "center" }}>
        Create New Koi
      </Typography>
      <KoiCreateForm
        onClose={handleBack}
        onSuccess={handleKoiCreated}
        owner_id={parseInt(userId!)}
      />
    </div>
  );
};

export default AddKoi;
