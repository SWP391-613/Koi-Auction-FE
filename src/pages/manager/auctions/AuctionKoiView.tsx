import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";
import React from "react";
import TableHeaderComponent from "~/components/shared/TableHeaderComponent";
import { AUCTION_KOI_HEADER } from "~/constants/tableHeader";
import { AuctionKoi } from "~/types/auctionkois.type";
import { formatCurrency } from "~/utils/currencyUtils";

interface AuctionKoiViewProps {
  auctionKois: AuctionKoi[];
  handleEdit: (koiId: number) => void;
  onDelete: (koiId: number) => void;
}

const AuctionKoiView: React.FC<AuctionKoiViewProps> = ({
  auctionKois,
  handleEdit: onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="divide-y divide-gray-200">
        <TableHeaderComponent headers={AUCTION_KOI_HEADER} />
        <tbody className="bg-white divide-y divide-gray-200">
          {auctionKois.map(
            ({
              id,
              auction_id,
              koi_id,
              base_price,
              current_bid,
              current_bidder_id,
              is_sold,
              bid_method,
              bid_step,
            }) => (
              <tr key={id}>
                <td className="px-6 py-4">{id}</td>
                <td className="px-6 py-4">{auction_id}</td>
                <td className="px-6 py-4">{koi_id}</td>
                <td className="px-6 py-4">
                  {formatCurrency(base_price ?? "Not Set")}
                </td>
                <td className="px-6 py-4">
                  {formatCurrency(current_bid ?? "Not Set")}
                </td>
                <td className="px-6 py-4">{current_bidder_id ?? "Not Set"}</td>
                <td className="px-6 py-4">{is_sold ? "Yes" : "No"}</td>
                <td className="px-6 py-4">{bid_method ?? "N/A"}</td>
                <td className="px-6 py-4">{bid_step}</td>
                <td className="px-6 py-4 flex space-x-2">
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => onEdit(koi_id)}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => onDelete(koi_id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuctionKoiView;
