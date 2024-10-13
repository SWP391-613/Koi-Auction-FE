import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaginationComponent from "~/components/pagination/Pagination";
import SearchBar from "~/components/shared/SearchBar";
import AuctionTable from "~/editkoiinauction/EditAuction";
import { AuctionKoi } from "~/types/auctionkois.type";
import { AuctionModel } from "~/types/auctions.type";
import {
  createNewAuction,
  deleteAuction,
  fetchAuctionKoi,
  fetchAuctions,
} from "~/utils/apiUtils";
import { extractErrorMessage, prepareAuctionData } from "~/utils/dataConverter";
import { convertToJavaLocalDateTime } from "~/utils/dateTimeUtils";

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
    auctioneer_id: -1,
  });
  const [editingAuction, setEditingAuction] = useState<AuctionModel | null>(
    null,
  );
  const [auctionKois, setAuctionKois] = useState<AuctionKoi[]>([]);

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
    setNewAuction({
      title: "",
      start_time: "",
      end_time: "",
      status: "",
      auctioneer_id: -1,
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewAuction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewAuction = async () => {
    const auctionData = prepareAuctionData(newAuction);
    try {
      await createNewAuction(auctionData);
      toast.success("Auction added successfully");
      console.log("Auction added successfully");
      handleCloseAddDialog();
    } catch (error) {
      const errorMessage = extractErrorMessage(error, "Failed to add auction");
      console.error(errorMessage);
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
      await deleteAuction(id);
      toast.success("Auction deleted successfully");
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        "Failed to delete auction",
      );
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleEdit = (koiId: number) => {
    alert(`Edit Koi ${koiId}`);
  };

  const handleDelete = (koiId: number) => {
    confirm(`Delete Koi ${koiId}`);
  };

  return (
    <div>
      {/* <SearchBar /> */}
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
                <TableCell>Auctioneer ID</TableCell>
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
                  <TableCell>{auction.auctioneer_id}</TableCell>
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
          maxWidth="xl"
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
                  <h3 className="text-lg font-semibold mb-2">
                    Kois in Auction
                  </h3>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => alert("Add Koi")}
                  />
                  <div className="overflow-x-auto">
                    <AuctionTable
                      auctionKois={auctionKois}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
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
      <ToastContainer />
    </div>
  );
};
