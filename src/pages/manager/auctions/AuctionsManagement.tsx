import React, { useState, useEffect } from "react";
import {
  fetchAuctions,
  fetchAuctionKoi,
  createNewAuction,
} from "~/utils/apiUtils";
import PaginationComponent from "~/components/pagination/Pagination";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { AuctionModel } from "~/types/auctions.type";
import { format, set } from "date-fns";
import axios from "axios";
import { convertToJavaLocalDateTime } from "~/utils/dateTimeUtils";

interface Koi {
  id: number;
  name: string;
  thumbnail: string;
  base_price: number;
  current_bid: number;
}

export const AuctionsManagement: React.FC = () => {
  const [auctions, setAuctions] = useState<AuctionModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const itemsPerPage = 9;
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newAuction, setNewAuction] = useState({
    title: "",
    start_time: "",
    end_time: "",
    status: "",
  });
  const [editingAuction, setEditingAuction] = useState<AuctionModel | null>(
    null,
  );
  const [auctionKois, setAuctionKois] = useState<Koi[]>([]);

  const formatDateForInput = (date: Date): string => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const loadAuctions = async () => {
      try {
        const fetchedAuctions = await fetchAuctions(
          currentPage - 1,
          itemsPerPage,
        );
        if (fetchedAuctions.length < itemsPerPage) {
          setHasMorePages(false);
        }
        setAuctions(fetchedAuctions);
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setAuctions([]);
      }
    };

    loadAuctions();
  }, [currentPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  const handleAddAuction = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewAuction({ title: "", start_time: "", end_time: "", status: "" });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewAuction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewAuction = async () => {
    const { title, start_time, end_time, status } = newAuction;

    console.log("Submitting new auction:", newAuction);

    try {
      const data = {
        title,
        start_time: convertToJavaLocalDateTime(start_time),
        end_time: convertToJavaLocalDateTime(end_time),
        status,
      };

      console.log("data: " + JSON.stringify(data));

      await createNewAuction(data);

      console.log("Auction added successfully");
      toast.success("Auction added successfully");
      handleCloseAddDialog();
    } catch (error) {
      console.error("Error adding auction:", error);

      // Get the message from server response (if available)
      const errorMessage =
        axios.isAxiosError(error) && error.response && error.response.data
          ? error.response.data.message
          : "Failed to add auction";

      toast.error(errorMessage);
    }
  };

  const handleEditAuction = async (auction: AuctionModel) => {
    setEditingAuction(auction);
    try {
      if (!auction.id) {
        console.error("Auction ID is missing");
        return;
      }

      const kois = await fetchAuctionKoi(auction.id);
      setAuctionKois(
        kois.map((auctionKoi) => ({
          ...auctionKoi,
          name: "", // Provide a default value or fetch from somewhere
          thumbnail: "", // Provide a default value or fetch from somewhere
        })),
      );
    } catch (error) {
      console.error("Error fetching auction kois:", error);
      setAuctionKois([]);
    }
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingAuction(null);
    setAuctionKois([]);
  };

  const handleEditInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setEditingAuction((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmitEditAuction = () => {
    if (editingAuction) {
      console.log("Submitting edited auction:", editingAuction);
      // Implement the actual update logic here
      handleCloseEditDialog();
    }
  };

  const handleDeleteAuction = async (id: number): Promise<void> => {
    try {
      //return 204 no content
      return await axios
        .delete(`http://localhost:4000/api/v1/auctions/${id}`)
        .then((response) => {
          if (response.status === 400) {
            throw new Error("Failed to delete auction");
          }

          console.log("Auction deleted successfully");
          toast.success("Auction deleted successfully");
        });
    } catch (error) {
      console.error("Error deleting auction:", error);

      // Get the message from server response (if available)
      const errorMessage =
        axios.isAxiosError(error) && error.response && error.response.data
          ? error.response.data.message
          : "Failed to delete auction";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Auctions Management</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddAuction}
        >
          Add New Auction
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auctions.map((auction) => (
              <TableRow key={auction.id}>
                <TableCell>{auction.id}</TableCell>
                <TableCell>{auction.title}</TableCell>
                <TableCell>
                  {new Date(auction.start_time).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(auction.end_time).toLocaleString()}
                </TableCell>
                <TableCell>{auction.status}</TableCell>
                <TableCell>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => handleEditAuction(auction)}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => handleDeleteAuction(auction.id!)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="mt-4">
        <PaginationComponent
          totalPages={hasMorePages ? currentPage + 1 : currentPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Add Auction Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add New Auction</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Auction Title"
            type="text"
            fullWidth
            variant="standard"
            value={newAuction.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="start_time"
            label="Start Time"
            type="datetime-local"
            fullWidth
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            value={newAuction.start_time}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="end_time"
            label="End Time"
            type="datetime-local"
            fullWidth
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            value={newAuction.end_time}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="status"
            label="Status"
            type="text"
            fullWidth
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            value={newAuction.status}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleSubmitNewAuction}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Auction Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Auction</DialogTitle>
        <DialogContent>
          {editingAuction && (
            <>
              <TextField
                autoFocus
                margin="dense"
                name="title"
                label="Auction Title"
                type="text"
                fullWidth
                variant="standard"
                value={editingAuction.title}
                onChange={handleEditInputChange}
              />
              <TextField
                margin="dense"
                name="start_time"
                label="Start Time"
                type="datetime-local"
                fullWidth
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formatDateForInput(editingAuction.start_time as Date)}
                onChange={handleEditInputChange}
              />
              <TextField
                margin="dense"
                name="end_time"
                label="End Time"
                type="datetime-local"
                fullWidth
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formatDateForInput(editingAuction.end_time as Date)}
                onChange={handleEditInputChange}
              />
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Kois in Auction</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Base Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Current Bid
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {auctionKois.map((koi) => (
                        <tr key={koi.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img
                              src={koi.thumbnail}
                              alt={koi.name}
                              className="w-16 h-16 object-cover rounded-full"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-semibold">{koi.name}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ${koi.base_price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ${koi.current_bid}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSubmitEditAuction}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
