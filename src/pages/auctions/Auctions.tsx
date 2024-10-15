import React, { useEffect, useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import PaginationComponent from "~/components/pagination/Pagination";
import { AuctionModel } from "~/types/auctions.type";
import { fetchAuctions } from "~/utils/apiUtils";
import AuctionCart from "./AuctionCart";

const Auctions: React.FC = () => {
  const [auctions, setAuctions] = useState<AuctionModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 18;

  useEffect(() => {
    const loadAuctions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedAuctions = await fetchAuctions(
          currentPage - 1,
          itemsPerPage,
        );

        if (fetchedAuctions.length < itemsPerPage) {
          setHasMorePages(false);
        }

        setAuctions(fetchedAuctions);
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setError("Failed to load auctions. Please try again later.");
        setAuctions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuctions();
  }, [currentPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography
        variant="h5"
        sx={{
          marginTop: "10rem",
          color: "error.main",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {error}
      </Typography>
    );
  }

  return (
    <div className="container mx-auto">
      {auctions.length === 0 ? (
        <Typography
          variant="h3"
          sx={{
            marginTop: "10rem",
            color: "error.main",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          No auctions found
        </Typography>
      ) : (
        <>
          <AuctionCart items={auctions} />
          <PaginationComponent
            totalPages={hasMorePages ? currentPage + 1 : currentPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Auctions;
