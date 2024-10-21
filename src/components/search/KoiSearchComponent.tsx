import { Typography } from "@mui/material";
import React from "react";
import { useKoiSearch } from "~/hooks/useKoiSearch";
import PaginationComponent from "../common/PaginationComponent";
import KoiSearchGrid from "../shared/KoiSearchGrid";
import SearchBar from "../shared/SearchBar";

interface KoiSearchComponentProps {
  onSearchStateChange: (isActive: boolean) => void;
}

const KoiSearchComponent: React.FC<KoiSearchComponentProps> = () => {
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
  } = useKoiSearch(500);

  return (
    <div className="container mx-auto p-4 mt-5">
      <SearchBar
        value={query}
        onChange={setQuery}
        loading={loading}
        placeholder="Search for koi..."
      />
      {loading && <p className="mt-2">Searching...</p>}
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

export default KoiSearchComponent;
