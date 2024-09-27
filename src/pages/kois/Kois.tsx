import React from "react";
import { useState, useEffect } from "react";
import KoiCart from "./KoiCart";
import { getKois } from "~/utils/apiUtils";
import PaginationComponent from "~/components/pagination/Pagination";

export interface KoisResponse {
  total_page: number;
  total_item: number;
  items: KoiDetailModel[];
}
export interface KoiDetailModel {
  id: number;
  name: string;
  sex: string;
  length: number;
  age: number;
  status_name: string;
  is_display: number; //0, 1
  thumbnail: string;
  description: string;
  owner_id: number;
  category_id: number;
}

const Kois: React.FC = () => {
  const [koisData, setKoisData] = useState<KoisResponse>({
    total_page: 0,
    total_item: 0,
    items: [],
  });
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Adjusted to match the API response

  useEffect(() => {
    const fetchKois = async () => {
      try {
        const response = await getKois(currentPage, itemsPerPage);
        setKoisData(response);
      } catch (error) {
        console.error("Error fetching koi data:", error);
        setKoisData({ total_page: 0, total_item: 0, items: [] });
      }
    };

    fetchKois();
  }, [currentPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page - 1); // Adjust to 0-based index for API
  };

  return (
    <div>
      <KoiCart items={koisData.items} />
      <PaginationComponent
        totalPages={koisData.total_page}
        currentPage={currentPage + 1} // Adjust to 1-based index for UI
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Kois;
