import React, { useState, useEffect } from "react";
import KoiCart from "./KoiCart";
import { KoiDetailModel } from "./Koi.model";
import { getKois } from "~/utils/apiUtils";
import PaginationComponent from "~/components/pagination/Pagination";

const Kois: React.FC = () => {
  const [items, setItems] = useState<KoiDetailModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true); // State to track if more pages exist
  const itemsPerPage = 6; // Number of items per page

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getKois(currentPage - 1, itemsPerPage); // Fetch page data

        if (data.length < itemsPerPage) {
          setHasMorePages(false); // No more pages if the result is less than the page size
        }

        setItems(data); // Update items with the fetched data
      } catch (error) {
        console.error("Error fetching koi data:", error);
        setItems([]);
      }
    };

    fetchItems();
  }, [currentPage]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <KoiCart items={items} />
      <PaginationComponent
        totalPages={hasMorePages ? currentPage + 1 : currentPage} // Only increment total pages if there's more data
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Kois;
