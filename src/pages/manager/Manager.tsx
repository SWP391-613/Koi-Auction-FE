import { Box, Typography } from "@mui/material";
import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardLayout from "../../layouts/dashboard/DashBoardLayout";
import KoiDetail from "../kois/KoiDetail";
import { AuctionsManagement } from "./auctions/AuctionsManagement";
import BreederManagement from "./breeder/BreederManagement";
import KoiManagement from "./koi/KoiManagement";
import MemberManagement from "./member/MemberManagement";
import Settings from "./settings/Settings";
import StaffManagement from "./staff/StaffManagement";
import ManagerDetail from "./detail/ManagerDetail";

function Manager() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="" element={<ManagerDetail />} />
        <Route path="auctions" element={<AuctionsManagement />} />
        <Route path="member" element={<MemberManagement />} />
        <Route path="breeder" element={<BreederManagement />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="setting" element={<Settings />} />
        <Route path="koi" element={<KoiManagement />} />
        <Route path="koi-detail" element={<KoiDetail />} />
      </Routes>
    </DashboardLayout>
  );
}

export default Manager;
