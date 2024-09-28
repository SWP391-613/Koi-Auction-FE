import { Box, Pagination } from "@mui/material";

const PaginationComponent = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={onPageChange}
        color="primary"
        showFirstButton
        showLastButton
      />
    </Box>
  );
};

export default PaginationComponent;
