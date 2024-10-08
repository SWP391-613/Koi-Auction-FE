import React from "react";
import { useState, useEffect } from "react";
import AuctionCart from "./AuctionCart";
import { fetchAuctions } from "~/utils/apiUtils";
import PaginationComponent from "~/components/pagination/Pagination";
import SearchBar from "~/components/shared/SearchBar";

export interface Auction {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  status: string;
}

const Auctions: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true); // To track if more pages are available
  const itemsPerPage = 16; // Number of auctions per page

  useEffect(() => {
    const loadAuctions = async () => {
      try {
        const fetchedAuctions = await fetchAuctions(
          currentPage - 1,
          itemsPerPage,
        ); // Fetch auctions for the current page

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
    <div>
      <div className="d-flex justify-center items-center">
        <SearchBar placeholder="Type to search..." debounceTime={500} />
      </div>
      <AuctionCart items={auctions} />
      <PaginationComponent
        totalPages={hasMorePages ? currentPage + 1 : currentPage} // Handle pagination with dynamic totalPages
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Auctions;
