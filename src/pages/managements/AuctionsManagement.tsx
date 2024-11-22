import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Container,
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
import CustomButton from "~/components/shared/CustomButton";
import {
  deleteAuction,
  endAuctionEmergency,
  fetchAuctions,
  fetchAuctionStatusCount,
  updateAuction,
} from "~/apis/auction.apis";
import PaginationComponent from "~/components/common/PaginationComponent";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { AUCTION_STATUS } from "~/constants/status";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "~/constants/message";
import { AuctionKoi } from "~/types/auctionkois.type";
import {
  AuctionModel,
  AuctionStatusCount,
  QuantityKoiInAuctionByBidMethod,
} from "~/types/auctions.type";
import { getCookie } from "~/utils/cookieUtils";
import { extractErrorMessage } from "~/utils/dataConverter";
import { formatDateTimeString } from "~/utils/dateTimeUtils";
import AddAuctionDialog from "../auctions/AddAuctionDialog";
import EditAuctionDialog from "../auctions/EditAuctionDialog";
import {
  fetchAuctionKoi,
  fetchQuantityKoiInAuctionByBidMethod,
} from "~/apis/auctionkoi.apis";

export const AuctionsManagement: React.FC = () => {
  const [auctions, setAuctions] = useState<AuctionModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const itemsPerPage = 30;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [koiInAuctionByBidMethod, setKoiInAuctionByBidMethod] =
    useState<QuantityKoiInAuctionByBidMethod | null>(null);
  const [auctionStatusCount, setAuctionStatusCount] =
    useState<AuctionStatusCount | null>(null);

  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const token = getCookie("access_token");

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadAuctions = async () => {
      setLoading(true);
      try {
        const fetchedAuctions = await fetchAuctions(
          currentPage - 1,
          itemsPerPage,
        );
        if (fetchedAuctions) {
          if (fetchedAuctions.length < itemsPerPage) {
            setHasMorePages(false);
          }
          setAuctions(fetchedAuctions);
        }
      } catch (error) {
        console.error(ERROR_MESSAGE.FAILED_TO_FETCH_AUCTIONS, error);
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    };

    const loadQuantityKoiInAuctionByBidMethod = async () => {
      setLoading(true);
      try {
        const data = await fetchQuantityKoiInAuctionByBidMethod();

        if (data) {
          setKoiInAuctionByBidMethod(data);
        } else {
          setKoiInAuctionByBidMethod(null);
        }
      } catch (error) {
        console.error(
          "Error fetching quantity koi in auction by bid method:",
          error,
        );
        setKoiInAuctionByBidMethod(null);
      } finally {
        setLoading(false);
      }
    };

    const loadAuctionStatusCount = async () => {
      setLoading(true);
      try {
        const data = await fetchAuctionStatusCount();
        if (data) {
          setAuctionStatusCount(data);
        } else {
          setAuctionStatusCount(null);
        }
      } catch (error) {
        console.error("Error fetching auction status count:", error);
        setAuctionStatusCount(null);
      } finally {
        setLoading(false);
      }
    };

    loadAuctions();
    loadQuantityKoiInAuctionByBidMethod();
    loadAuctionStatusCount();
  }, [currentPage, token]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Container className="flex justify-center items-center h-screen">
        <LoadingComponent />
      </Container>
    );
  }

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

  const handleEditAuction = async (auction: AuctionModel) => {
    setEditingAuction(auction);
    try {
      if (!auction.id) {
        console.error("Auction ID is missing");
        return;
      }

      const kois = await fetchAuctionKoi(auction.id);
      if (kois) {
        setAuctionKois(
          kois.map((auctionKoi) => ({
            ...auctionKoi,
            name: "", // Provide a default value or fetch from somewhere
            thumbnail: "", // Provide a default value or fetch from somewhere
          })),
        );
      }
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
      console.log("Submitting edited auction:", editingAuction);
      // Implement the actual update logic here

      const data = {
        ...editingAuction,
        start_time: formatDateTimeString(editingAuction.start_time as string),
        end_time: formatDateTimeString(editingAuction.end_time as string),
      };

      console.log("Data to be submitted:", data);
      handleCloseEditDialog();

      try {
        await updateAuction(editingAuction.id!, data);
        toast.success(SUCCESS_MESSAGE.AUCTION_UPDATE_SUCCESS);
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          "Failed to update auction",
        );
        console.error(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  const handleDeleteAuction = async (id: number): Promise<void> => {
    try {
      await deleteAuction(id, token!);
      toast.success(SUCCESS_MESSAGE.AUCTION_DELETE_SUCCESS);
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

    try {
      await endAuctionEmergency(auctionId);
      toast.success(
        "Auction ended successfully, refresh the page to apply changes",
      );
    } catch (error) {
      const errorMessage = extractErrorMessage(error, "Failed to end auction");
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="m-5 overflow-x-auto">
      <div className="mb-6 flex justify-between">
        <div className="flex flex-col gap-5 border-2 border-sky-500 p-6 rounded-xl">
          <div>
            <Typography variant="h5">
              Total Auctions: {auctionStatusCount?.total}
            </Typography>
            <Typography variant="body1">
              Upcoming Auctions: {auctionStatusCount?.upcoming}
            </Typography>
            <Typography variant="body1">
              Ongoing Auctions: {auctionStatusCount?.ongoing}
            </Typography>
            <Typography variant="body1">
              Ended Auctions: {auctionStatusCount?.ended}
            </Typography>
          </div>
          <div>
            <Typography variant="h5">
              Total Koi In Auction: {koiInAuctionByBidMethod?.total}
            </Typography>
            <Typography variant="body1">
              Total Koi In Ascending Bid:{" "}
              {koiInAuctionByBidMethod?.ascending_bid}
            </Typography>
            <Typography variant="body1">
              Total Koi In Descending Bid:{" "}
              {koiInAuctionByBidMethod?.descending_bid}
            </Typography>
            <Typography variant="body1">
              Total Koi In Fixed Price: {koiInAuctionByBidMethod?.fixed_price}
            </Typography>
          </div>
        </div>
      </div>
      <CustomButton onClick={handleAddAuction}>
        <AddIcon className="mr-2" />
        New Auction
      </CustomButton>

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
      <ToastContainer />
    </div>
  );
};
