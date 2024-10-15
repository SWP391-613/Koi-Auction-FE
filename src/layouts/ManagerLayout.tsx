import { Box, Typography } from "@mui/material";
import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./dashboard/DashBoardLayout";
import KoiDetail from "../pages/kois/KoiDetail";
import { AuctionsManagement } from "../pages/manager/auctions/AuctionsManagement";
import BreederManagement from "../pages/manager/breeder/BreederManagement";
import KoiManagement from "../pages/manager/koi/KoiManagement";
import MemberManagement from "../pages/manager/member/MemberManagement";
import Settings from "../pages/manager/settings/Settings";
import StaffManagement from "../pages/manager/staff/StaffManagement";
import ManagerDetail from "../pages/detail/manager/ManagerDetail";

function ManagerLayout() {
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

export default ManagerLayout;
