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
  updateAuction,
} from "~/utils/apiUtils";
import { extractErrorMessage, prepareAuctionData } from "~/utils/dataConverter";
import AddAuctionDialog from "./AddAuctionDialog";
import EditAuctionDialog from "./EditAuctionDialog";
import { AUCTION_STATUS } from "~/constants/auctionStatus";
import { getCookie } from "~/utils/cookieUtils";
import PaginationComponent from "~/components/common/PaginationComponent";
import AuctionSearchComponent from "~/components/search/AuctionSearchComponent";
import axios from "axios";
import { convertTimestamp } from "~/utils/dateTimeUtils";
import LoadingComponent from "~/components/shared/LoadingComponent";

export const AuctionsManagement: React.FC = () => {
  const [auctions, setAuctions] = useState<AuctionModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const itemsPerPage = 9;
  const [isLoading, setIsLoading] = useState(true);
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
  const [isSearchActive, setIsSearchActive] = useState(false);
  const handleSearchStateChange = (isActive: boolean) => {
    setIsSearchActive(isActive);
  };

  const formatDateForInput = (date: Date): string => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 16);
  };

  const token = getCookie("access_token");

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const loadAuctions = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    loadAuctions();
  }, [currentPage, token]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingComponent />
      </div>
    );
  }

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

  const handleSubmitEditAuction = async () => {
    if (editingAuction) {
      const data = {
        ...editingAuction,
        start_time: convertTimestamp(editingAuction.start_time as string),
        end_time: convertTimestamp(editingAuction.end_time as string),
      };

      console.log("Submitting edited auction:", data);
      await updateAuction(editingAuction.id!, data);
      toast.success("Auction updated successfully");
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

  const handleEndAuction = async (auctionId: number) => {
    const confirmed = window.confirm(
      `Are you sure you want to end this auction`,
    );
    if (!confirmed) return;

    console.log("Ending auction:", auctionId);
    console.log("Token:", token);

    try {
      await axios
        .put(
          `http://localhost:4000/api/v1/auctions/end/${auctionId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(() => {
          toast.success("Auction ended successfully");
        });
      // Implement the actual end auction logic here
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        toast.error(error.response?.data?.reason);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="m-5">
      <AuctionSearchComponent onSearchStateChange={handleSearchStateChange} />
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
          handleEndAuction={handleEndAuction}
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
