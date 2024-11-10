import { Typography } from "@mui/material";
import React, { useState } from "react";
import KoiInAuctionSearchComponent from "~/components/search/KoiInAuctionSearchComponent";

const Kois: React.FC = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearchStateChange = (isActive: boolean) => {
    setIsSearchActive(isActive);
  };

  return (
    <KoiInAuctionSearchComponent
      onSearchStateChange={handleSearchStateChange}
    />
  );
};

export default Kois;
