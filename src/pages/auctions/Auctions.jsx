import { useState, useEffect } from "react";
import Cart from "../../components/cart/Cart";
import { Box, Pagination } from "@mui/material";

const Auctions = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // Set total pages as needed
  const itemsPerPage = 6; // Limit the number of items per page
  const [items, setItems] = useState([]); // State to hold items

  useEffect(() => {
    // Fetch items based on the current page
    const fetchItems = async () => {
      // Replace with your actual data fetching logic
      const fetchedItems = await fetchItemsFromAPI(page, itemsPerPage);
      setItems(fetchedItems);
    };

    fetchItems();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div>
      <Cart items={items} />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </div>
  );
};

// Mock function to simulate fetching items from an API
const fetchItemsFromAPI = async (page, itemsPerPage) => {
  // Simulate an API call
  const allItems = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`,
  }));
  const startIndex = (page - 1) * itemsPerPage;
  return allItems.slice(startIndex, startIndex + itemsPerPage);
};

export default Auctions;
