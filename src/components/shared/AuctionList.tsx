import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AuctionModel } from "~/types/auctions.type";
import LoadingComponent from "./LoadingComponent";
import PaginationComponent from "../common/PaginationComponent";
import SearchBar from "./SearchBar";
import { useSearch } from "~/hooks/useSearch";

interface AuctionListProps {
  fetchAuctionsData: (
    page: number,
    itemsPerPage: number,
  ) => Promise<AuctionModel[]>; // Function to fetch auctions
  cartComponent: React.FC<{ items: AuctionModel[] }>; // Component to render auction items
  emptyMessage: string; // Message to display when no auctions found
  itemsPerPage?: number; // Optional items per page, with default
}

const AuctionList: React.FC<AuctionListProps> = ({
  fetchAuctionsData,
  cartComponent: CartComponent,
  emptyMessage,
  itemsPerPage = 18, // Default value for items per page
}) => {
  const [auctions, setAuctions] = useState<AuctionModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { query, setQuery, results, loadingSearch, errorSearch, handleSearch } =
    useSearch(500); // 500ms debounce

  useEffect(() => {
    const loadAuctions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedAuctions = await fetchAuctionsData(
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
  }, [currentPage, fetchAuctionsData, itemsPerPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page); // Update the page number on pagination change
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingComponent />
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
          {emptyMessage}
        </Typography>
      ) : (
        <>
          <div className="container mx-auto p-4">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSearch={handleSearch}
              loading={loadingSearch}
              placeholder="Search for koi..."
            />
            {error && <p className="text-red-500 mt-2">{error.message}</p>}
            {results.length > 0 && (
              <ul className="mt-4">
                {results.map((result) => (
                  <li key={result.id} className="mb-2">
                    {result.name}
                  </li>
                ))}
              </ul>
            )}
            {!loadingSearch && query && results.length === 0 && (
              <p className="mt-2">No results found.</p>
            )}
          </div>
          <CartComponent items={auctions} />
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

export default AuctionList;
