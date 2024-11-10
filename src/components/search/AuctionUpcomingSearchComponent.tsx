import { Typography } from "@mui/material";
import React from "react";
import ScrollToTop from "react-scroll-to-top";
import { useAuctionUpComingSearch } from "~/hooks/useSearch";
import { AuctionRegisterCart } from "~/pages/auctions/AuctionCart";
import PaginationComponent from "../common/PaginationComponent";
import SearchBar from "../shared/SearchBar";

interface AuctionUpcomingSearchComponentProps {
  onSearchStateChange: (isActive: boolean) => void;
}

const AuctionUpcomingSearchComponent: React.FC<
  AuctionUpcomingSearchComponentProps
> = () => {
  const {
    query,
    setQuery,
    results,
    loading,
    error,
    page,
    totalPages,
    totalItems,
    handlePageChange,
  } = useAuctionUpComingSearch(500);

  return (
    <div className="container mx-auto p-4 mt-14">
      <div className="bg-gray-200 p-4 rounded-xl">
        <Typography
          variant="h5"
          sx={{ textAlign: "left", marginBottom: "1rem" }}
        >
          Search All Our Auction
        </Typography>
        <SearchBar
          value={query}
          onChange={setQuery}
          loading={loading}
          placeholder="Search for auctions..."
        />
        <Typography
          variant="body2"
          sx={{ textAlign: "left", marginTop: "1rem" }}
          color="error"
        >
          *Note: Search on name, status, start date, end date,...
        </Typography>
      </div>
      {loading && <p className="mt-2">Searching...</p>}
      {error && <p className="text-red-500 mt-2">{error.message}</p>}
      {results.length > 0 && !loading && (
        <div className="mt-3 text-gray-500">
          <Typography variant="body2" className="mt-3">
            Showing 1 - {results.length} of {totalItems} results.
          </Typography>

          <AuctionRegisterCart items={results} />

          <PaginationComponent
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
          <ScrollToTop smooth />
        </div>
      )}
      {!loading && query && results.length === 0 && (
        <p className="mt-2">No results found.</p>
      )}
    </div>
  );
};

export default AuctionUpcomingSearchComponent;
