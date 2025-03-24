import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import PaginationComponent from "../common/PaginationComponent";
import KoiSearchGrid from "../shared/KoiSearchGrid";
import SearchBar from "../shared/SearchBar";
import { SEARCH_DESCRIPTION, SEARCH_LABEL } from "~/constants/label";
import { useQuery } from "react-query";
import { useKoiInAuction } from "~/hooks/useKois";
import LoadingComponent from "../shared/LoadingComponent";
import { KoiInAuctionResponse } from "~/types/paginated.types";
import { KoiInAuctionDetailModel } from "~/types/kois.type";

interface KoiInAuctionSearchComponentProps {
  onSearchStateChange: (isActive: boolean) => void;
}

const KoiInAuctionSearchComponent: React.FC<
  KoiInAuctionSearchComponentProps
> = ({ onSearchStateChange }) => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [filteredResults, setFilteredResults] = useState<
    KoiInAuctionDetailModel[]
  >([]);

  const { data, isLoading, error } = useKoiInAuction();

  useEffect(() => {
    // Notify parent component about search state
    onSearchStateChange(isLoading);
  }, [isLoading, onSearchStateChange]);

  // Filter results based on search query
  useEffect(() => {
    if (!query) {
      setFilteredResults(data || []);
      return;
    }

    const filtered = data?.filter(
      (koi: any) =>
        koi.name.toLowerCase().includes(query.toLowerCase()) ||
        koi.description.toLowerCase().includes(query.toLowerCase()),
    );

    setFilteredResults(filtered || []);
  }, [data, query]);

  // Calculate pagination
  const itemsPerPage = 12;
  const totalItems = filteredResults.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredResults.slice(startIndex, endIndex);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  if (isLoading) return <LoadingComponent />;
  if (error)
    return <p className="text-red-500 mt-2">Error when fetch koi in auction</p>;

  const currentItems = getCurrentPageItems();

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
          loading={isLoading}
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

      {filteredResults.length > 0 && (
        <div className="mt-3 text-gray-500">
          <Typography variant="body2" className="mt-3">
            Showing {Math.min((page - 1) * itemsPerPage + 1, totalItems)} -{" "}
            {Math.min(page * itemsPerPage, totalItems)} of {totalItems} results.
          </Typography>
          <KoiSearchGrid
            kois={currentItems}
            getLinkUrl={(koi) => `/auctions/${koi.auction_id}`}
          />
          {totalPages > 1 && (
            <PaginationComponent
              totalPages={totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}

      {!isLoading && query && filteredResults.length === 0 && (
        <Typography className="mt-2">No results found.</Typography>
      )}
    </div>
  );
};

export default KoiInAuctionSearchComponent;
