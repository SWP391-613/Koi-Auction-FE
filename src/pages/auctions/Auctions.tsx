import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PaginationComponent from "~/components/pagination/Pagination";
import { AuctionModel } from "~/types/auctions.type";
import { fetchAuctions } from "~/utils/apiUtils";
import AuctionCart from "./AuctionCart";

const Auctions: React.FC = () => {
  const [auctions, setAuctions] = useState<AuctionModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const itemsPerPage = 18;

  useEffect(() => {
    const loadAuctions = async () => {
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
        setAuctions([]);
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
