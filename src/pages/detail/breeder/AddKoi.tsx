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

  const userId = getCookie("user_id");
  useEffect(() => {
    if (!userId) {
      return;
    }
  }, [userId]);

  return (
    <div className="flex flex-col gap-5 bg-white mt-5 mb-24">
      <div className="flex flex-col justify-center items-center gap-5">
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          Add New Koi
        </Typography>
        <div>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", color: "gray" }}
          >
            *Note: Please fill in all the required fields to create a new koi.
          </Typography>
        </div>
      </div>
      <KoiCreateForm
        onSuccess={handleKoiCreated}
        owner_id={parseInt(userId!)}
      />
    </div>
  );
};

export default AddKoi;
