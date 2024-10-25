import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useUserOrderSearch } from "~/hooks/useSearch";
import PaginationComponent from "../common/PaginationComponent";
import OrderSearchGrid from "../shared/OrderSearchGrid";
import SearchBar from "../shared/SearchBar";
import ScrollToTop from "react-scroll-to-top";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface OrderSearchComponentProps {
  onSearchStateChange: (isActive: boolean) => void;
}

const OrderSearchComponent: React.FC<OrderSearchComponentProps> = ({
  onSearchStateChange,
}) => {
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
  } = useUserOrderSearch(500);

  useEffect(() => {
    onSearchStateChange(loading);
  }, [loading, onSearchStateChange]);

  useEffect(() => {
    onSearchStateChange(query.length > 0);
  }, [query, onSearchStateChange]);

  return (
    <div className="container mx-auto p-4 mt-5">
      <div className="bg-gray-200 p-4 rounded-xl">
        <SearchBar
          value={query}
          onChange={setQuery}
          loading={loading}
          placeholder="You can search on Shop name, OrderId, Status, or Koi Name"
        />
      </div>
      {loading && <p className="mt-2">Searching...</p>}
      {error && <p className="text-red-500 mt-2">{error.message}</p>}
      {results.length > 0 && !loading && (
        <>
          <Typography variant="body2" className="mt-3">
            Showing 1 - {results.length} of {totalItems} results.
          </Typography>

          <OrderSearchGrid orders={results} />
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <PaginationComponent
              totalPages={totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </Box>
          <ScrollToTop smooth />
        </>
      )}
      {!loading && query && results.length === 0 && (
        <p className="mt-2">No results found.</p>
      )}
    </div>
  );
};

export default OrderSearchComponent;
