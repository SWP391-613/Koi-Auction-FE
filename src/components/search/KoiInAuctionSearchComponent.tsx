import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { useKoiInAuctionSearch } from "~/hooks/useSearch";
import PaginationComponent from "../common/PaginationComponent";
import KoiSearchGrid from "../shared/KoiSearchGrid";
import SearchBar from "../shared/SearchBar";
import { SEARCH_DESCRIPTION, SEARCH_LABEL } from "~/constants/label";

interface KoiInAuctionSearchComponentProps {
  onSearchStateChange: (isActive: boolean) => void;
}

const KoiInAuctionSearchComponent: React.FC<
  KoiInAuctionSearchComponentProps
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
  } = useKoiInAuctionSearch(500);

  return (
    <div className="container mx-auto p-4 mt-14">
      <div className="bg-gray-200 p-4 rounded-xl">
        <Typography
          variant="h5"
          sx={{ textAlign: "left", marginBottom: "1rem" }}
        >
          {SEARCH_LABEL.SEARCH_ALL_OUR_AVAILABLE_KOI}
        </Typography>
        <SearchBar
          value={query}
          onChange={setQuery}
          loading={loading}
          placeholder={SEARCH_LABEL.EXAMPLE_KOI_SEARCH}
        />
        <Typography
          variant="body2"
          sx={{ textAlign: "left", marginTop: "1rem" }}
          color="error"
        >
          {SEARCH_DESCRIPTION.SEARCH_ALL_OUR_AVAILABLE_KOI_DESCRIPTION}
        </Typography>
      </div>
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}
      {error && <p className="text-red-500 mt-2">{error.message}</p>}
      {results.length > 0 && !loading && (
        <div className="mt-3 text-gray-500">
          <Typography variant="body2" className="mt-3">
            Showing 1 - {results.length} of {totalItems} results.
          </Typography>
          <KoiSearchGrid
            kois={results}
            getLinkUrl={(koi) => `/auctions/${koi.auction_id}`}
          />
          <PaginationComponent
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      {!loading && query && results.length === 0 && (
        <Typography className="mt-2">No results found.</Typography>
      )}
    </div>
  );
};

export default KoiInAuctionSearchComponent;
