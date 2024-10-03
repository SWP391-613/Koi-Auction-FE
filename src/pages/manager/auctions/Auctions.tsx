import React, { useState, useEffect } from "react";
import { fetchAuctions } from "~/utils/apiUtils";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export interface Auction {
  id: number;
  title: string;
  start_time: Date;
  end_time: Date;
  status: string;
}

const Auctions: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const itemsPerPage = 10;
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newAuction, setNewAuction] = useState({
    title: "",
    start_time: "",
    end_time: "",
  });
  const [editingAuction, setEditingAuction] = useState<Auction | null>(null);

  const formatDateForInput = (date: Date | null | undefined): string => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return ""; // Trả về chuỗi rỗng nếu ngày không hợp lệ
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
    setNewAuction({ title: "", start_time: "", end_time: "" });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewAuction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewAuction = () => {
    console.log("Submitting new auction:", newAuction);
    handleCloseAddDialog();
  };

  const handleEditAuction = (auction: Auction) => {
    setEditingAuction(auction);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingAuction(null);
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

  const handleDeleteAuction = (id: number) => {
    console.log("Delete auction", id);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Auctions Management</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddAuction}
        >
          Add Auction
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
                    onClick={() => handleDeleteAuction(auction.id)}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleSubmitNewAuction}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Auction Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
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
                value={formatDateForInput(editingAuction.start_time)}
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
                value={formatDateForInput(editingAuction.end_time)}
                onChange={handleEditInputChange}
              />
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

export default Auctions;
