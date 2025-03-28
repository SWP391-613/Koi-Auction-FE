import { Typography } from "@mui/material";
import React from "react";
import ScrollToTop from "react-scroll-to-top";
import { useAuctionSearch } from "~/hooks/useSearch";
import { AuctionCart } from "~/pages/auctions/AuctionCart";
import PaginationComponent from "../common/PaginationComponent";
import SearchBar from "../shared/SearchBar";
import { SEARCH_DESCRIPTION, SEARCH_LABEL } from "~/constants/label";
import useAuctions from "~/hooks/useAuctions";

interface AuctionSearchComponentProps {
  onSearchStateChange: (isActive: boolean) => void;
}

const AuctionSearchComponent: React.FC<AuctionSearchComponentProps> = () => {
  // const {
  //   query,
  //   setQuery,
  //   results,
  //   loading,
  //   error,
  //   page,
  //   totalPages,
  //   totalItems,
  //   handlePageChange,
  // } = useAuctionSearch(500);

  // if (results) {
  //   console.log(`Data: ${JSON.stringify(results, null, 2)}`);
  // }

  const { data: results, isLoading, error } = useAuctions();

  return (
    <div className="container mx-auto p-4 mt-14">
      <div className="bg-gray-200 p-4 rounded-xl">
        <Typography
          variant="h5"
          sx={{ textAlign: "left", marginBottom: "1rem" }}
        >
          {SEARCH_LABEL.SEARCH_ALL_OUR_AUCTION}
        </Typography>
        {/* <SearchBar
          value={query}
          onChange={setQuery}
          loading={loading}
          placeholder={SEARCH_LABEL.EXAMPLE_AUCTION_SEARCH}
        /> */}
        <Typography
          variant="body2"
          sx={{ textAlign: "left", marginTop: "1rem" }}
          color="error"
        >
          {SEARCH_DESCRIPTION.SEARCH_ALL_OUR_AUCTION_DESCRIPTION}
        </Typography>
      </div>
      {/* {loading && <p className="mt-2">Searching...</p>}
      {error && <p className="text-red-500 mt-2">{error.message}</p>} */}
      {results && results?.length > 0 && (
        <div className="mt-3 text-gray-500">
          {/* <Typography variant="body2" className="mt-3">
            Showing 1 - {results.length} of {totalItems} results.
          </Typography> */}

          <AuctionCart items={results} />
          {/* <PaginationComponent
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          /> */}
          <ScrollToTop smooth />
        </div>
      )}
      {/* {!loading && query && results.length === 0 && (
        <p className="mt-2">No results found.</p>
      )} */}
    </div>
  );
};

export default AuctionSearchComponent;
