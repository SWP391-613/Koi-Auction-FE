import { Typography } from "@mui/material";
import React, { useState } from "react";
import AuctionSearchComponent from "~/components/search/AuctionSearchComponent";
import LoadingComponent from "~/components/shared/LoadingComponent";
import useAuctions from "~/hooks/useAuctions";

const AuctionsComponent: React.FC = () => {
  const { data: auctions, isLoading, error } = useAuctions();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearchStateChange = (isActive: boolean) => {
    setIsSearchActive(isActive);
  };

  if (isLoading && !isSearchActive) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingComponent />
      </div>
    );
  }

  if (error && !isSearchActive) {
    return (
      <Typography
        variant="h5"
        sx={{
          marginTop: "10rem",
          marginBottom: "10rem",
          color: "error.main",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {error.toString()}
      </Typography>
    );
  }

  return (
    <div className="container mx-auto">
      {!isSearchActive && (
        <>
          {auctions && auctions.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-[30rem]">
              <Typography
                variant="h3"
                sx={{
                  color: "error.main",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {`No auctions found`}
              </Typography>
            </div>
          ) : (
            <>
              <AuctionSearchComponent
                onSearchStateChange={handleSearchStateChange}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

const Auctions = React.memo(AuctionsComponent);
export default Auctions;
