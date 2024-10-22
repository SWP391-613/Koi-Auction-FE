import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";
import PaginationComponent from "../common/PaginationComponent";
import KoiSearchGrid from "../shared/KoiSearchGrid";
import SearchBar from "../shared/SearchBar";
import { useKoiUnverifiedSearch } from "~/hooks/useSearch";

interface KoiUnverifiedSearchComponentProps {
  onSearchStateChange: (isActive: boolean) => void;
}

const KoiUnverifiedSearchComponent: React.FC<
  KoiUnverifiedSearchComponentProps
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
  } = useKoiUnverifiedSearch(500);

  return (
    <div className="container mx-auto p-4 mt-5">
      <div className="bg-gray-200 p-4 rounded-xl">
        <Typography
          variant="h6"
          sx={{ textAlign: "left", marginBottom: "1rem" }}
        >
          Search All Our Available Koi
        </Typography>
        <SearchBar
          value={query}
          onChange={setQuery}
          loading={loading}
          placeholder="Search for koi..."
        />
        <Typography
          variant="body2"
          sx={{ textAlign: "left", marginTop: "1rem" }}
          color="error"
        >
          *Note: Search on name, sex, length, age, price,....
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

          <KoiSearchGrid kois={results} />
          <PaginationComponent
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      {!loading && query && results.length === 0 && (
        <p className="mt-2">No results found.</p>
      )}
    </div>
  );
};

export default KoiUnverifiedSearchComponent;
