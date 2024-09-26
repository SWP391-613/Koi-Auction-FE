import React, { useState, useEffect } from "react";
import KoiCart from "./KoiCart";
import { KoiDetailModel } from "./Koi.model";
import { getKois } from "~/utils/apiUtils";

const Kois: React.FC = () => {
  const [items, setItems] = useState<KoiDetailModel[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getKois(0, 100); // Fetch all items at once, adjust limit as needed
        setItems(data);
      } catch (error) {
        console.error("Error fetching koi data:", error);
        setItems([]);
      }
    };

    fetchItems();
  }, []);

  return (
    <div>
      <KoiCart items={items} />
    </div>
  );
};

export default Kois;