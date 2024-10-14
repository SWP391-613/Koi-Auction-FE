import React from "react";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuctionKoi } from "~/types/auctionkois.type";
import { formatCurrency } from "~/utils/currencyUtils";

interface AuctionTableProps {
  auctionKois: AuctionKoi[];
  handleEdit: (koiId: number) => void;
  onDelete: (koiId: number) => void;
}

const AuctionTable: React.FC<AuctionTableProps> = ({
  auctionKois,
  handleEdit: onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Id
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Auction Id
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Koi Id
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Base Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Bid
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Bidder Id
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Is Sold
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bid Method
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bid Step
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {auctionKois.map((ackoi) => (
            <tr key={ackoi.id}>
              <td className="px-6 py-4 whitespace-nowrap">{ackoi.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {ackoi.auction_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{ackoi.koi_id}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {ackoi.base_price != null
                  ? formatCurrency(ackoi.base_price)
                  : "Not Set"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {ackoi.current_bid != null
                  ? formatCurrency(ackoi.current_bid)
                  : "Not Set"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {ackoi.current_bidder_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {ackoi.is_sold ? "Yes" : "No"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {ackoi.bid_method}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{ackoi.bid_step}</td>
              <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => onEdit(ackoi.koi_id)}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => onDelete(ackoi.koi_id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuctionTable;
