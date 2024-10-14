import React, { useEffect, useState } from "react";
import PaginationComponent from "~/components/pagination/Pagination";
import { AUCTION_STATUS } from "~/constants/auctionStatus";
import { AuctionModel } from "~/types/auctions.type";
import { fetchAuctionsByStatus } from "~/utils/apiUtils";
import UpcomingAuctionCart from "./UpcomingAuctionCart";

const KoiRegisterAuctions: React.FC = () => {
  const [auctions, setAuctions] = useState<AuctionModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true); // To track if more pages are available
  const itemsPerPage = 18; // Number of auctions per page

  useEffect(() => {
    const loadAuctions = async () => {
      try {
        const fetchedAuctions = await fetchAuctionsByStatus(
          currentPage - 1,
          itemsPerPage,
          AUCTION_STATUS.UPCOMING,
        ); // Fetch all UPCOMING auctions for the current page

        if (fetchedAuctions.length < itemsPerPage) {
          setHasMorePages(false); // No more pages if fewer items are fetched
        }

        setAuctions(fetchedAuctions); // Update auctions state
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
    setCurrentPage(page); // Update the current page when pagination changes
  };

  return (
    <div className="container mx-auto">
      {/* <div className="flex justify-center items-center">
        <SearchBar placeholder="Type to search..." debounceTime={500} />
      </div> */}
      <UpcomingAuctionCart items={auctions} />
      <PaginationComponent
        totalPages={hasMorePages ? currentPage + 1 : currentPage} // Handle pagination with dynamic totalPages
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default KoiRegisterAuctions;
