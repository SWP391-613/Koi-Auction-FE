// Kois.tsx
import React, { useState, useEffect } from "react";
import KoiCart from "./KoiCart";
import { KoiDetailModel } from "./Koi.model";
import { getKois } from "~/utils/apiUtils";
import PaginationComponent from "~/components/pagination/Pagination";

const Kois: React.FC = () => {
  const [items, setItems] = useState<KoiDetailModel[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // change this to the number perpage
  const [totalItems, setTotalItems] = useState(0);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    console.log("Changing to page:", value);
    setPage(value);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getKois(page - 1, limit);
        setItems(data);

        // Update total items if it's the first page
        if (page === 1) {
          setTotalItems(data.length);
        }
      } catch (error) {
        console.error("Error fetching koi data:", error);
        setItems([]);
      }
    };

    fetchItems();
  }, [page, limit]);

  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const renderPagination = () =>
    totalPages > 1 && (
      <PaginationComponent
        totalPages={totalPages}
        currentPage={page}
        onPageChange={handlePageChange}
      />
    );

  return (
    <div>
      {renderPagination()} {/* Top pagination */}
      <KoiCart items={items} />
      {renderPagination()} {/* Bottom pagination */}
    </div>
  );
};

export default Kois;
