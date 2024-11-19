import { Box, CircularProgress, Typography } from "@mui/material";
import React, { ReactNode, useEffect } from "react";
import PaginationComponent from "../common/PaginationComponent";
import KoiSearchGrid from "../shared/KoiSearchGrid";
import SearchBar from "../shared/SearchBar";
import { useKoiOwnerSearch } from "~/hooks/useSearch";
import { KoiDetailModel } from "~/types/kois.type";
import { SEARCH_DESCRIPTION, SEARCH_LABEL } from "~/constants/label";

interface KoiOwnerSearchComponentProps {
  onSearchStateChange: (isActive: boolean) => void;
  renderActions?: (koi: KoiDetailModel) => ReactNode;
  handleEdit?: (id: number) => void;
  handleDelete?: (id: number) => void;
}

const KoiOwnerSearchComponent: React.FC<KoiOwnerSearchComponentProps> = ({
  onSearchStateChange,
  handleEdit, // Add this
  handleDelete, // Add this
  renderActions, // Also add renderActions if needed
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
  } = useKoiOwnerSearch(500);

  useEffect(() => {
    onSearchStateChange(loading);
  }, [loading, onSearchStateChange]);

  return (
    <div className="container mx-auto p-4 mt-10">
      <div className="bg-gray-200 p-4 rounded-xl">
        <Typography
          variant="h6"
          sx={{ textAlign: "left", marginBottom: "1rem" }}
        >
          {SEARCH_LABEL.SEARCH_ALL_KOI}
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
          {SEARCH_DESCRIPTION.SEARCH_ALL_KOI_DESCRIPTION}
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
            getLinkUrl={(koi) => `/kois/${koi.id}`}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            renderActions={renderActions}
          />
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

export default KoiOwnerSearchComponent;
