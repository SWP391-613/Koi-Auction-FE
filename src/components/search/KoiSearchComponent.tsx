import { Typography } from "@mui/material";
import React from "react";
import { useKoiSearch } from "~/hooks/useSearch";
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
        <>
          <Typography variant="body2" className="mt-3">
            Total Items: {totalItems}
          </Typography>

          <KoiSearchGrid kois={results} />
          <PaginationComponent
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </>
      )}
      {!loading && query && results.length === 0 && (
        <p className="mt-2">No results found.</p>
      )}
    </div>
  );
};

export default KoiSearchComponent;
