import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuctionKoi } from "~/types/auctionkois.type";
import { AuctionModel } from "~/types/auctions.type";
import {
  createNewAuction,
  deleteAuction,
  fetchAuctionKoi,
  fetchAuctions,
} from "~/utils/apiUtils";
import { extractErrorMessage, prepareAuctionData } from "~/utils/dataConverter";
import AddAuctionDialog from "./AddAuctionDialog";
import EditAuctionDialog from "./EditAuctionDialog";
import { AUCTION_STATUS } from "~/constants/auctionStatus";
import { getCookie } from "~/utils/cookieUtils";
import PaginationComponent from "~/components/common/PaginationComponent";

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
    status: AUCTION_STATUS.UPCOMING,
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

  const token = getCookie("access_token");

  useEffect(() => {
    if (!token) {
      return;
    }

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
  }, [currentPage, token]);

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
      status: AUCTION_STATUS.UPCOMING,
      auctioneer_id: -1,
    });
  };

  const handleInputChange = (name: string, value: unknown) => {
    setNewAuction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewAuction = async () => {
    const auctionData = prepareAuctionData(newAuction);
    console.log("Data to be submitted:", auctionData);
    try {
      await createNewAuction(auctionData, token!);
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
      await deleteAuction(id, token!);
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
        <AddAuctionDialog
          open={openAddDialog}
          onClose={handleCloseAddDialog}
          newAuction={newAuction}
          onInputChange={handleInputChange}
          onSubmit={handleSubmitNewAuction}
        />

        <EditAuctionDialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          editingAuction={editingAuction}
          auctionKois={auctionKois}
          onInputChange={handleEditInputChange}
          onSubmit={handleSubmitEditAuction}
          onEdit={handleEdit}
          onDelete={handleDelete}
          formatDateForInput={formatDateForInput}
        />
      </div>
      <ToastContainer />
    </div>
  );
};
