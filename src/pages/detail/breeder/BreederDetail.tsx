import { Button, Divider, Rating, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PaginationComponent from "~/components/common/PaginationComponent";
import KoiBreederViewGrid from "~/components/search/KoiBreederViewGrid";
import KoiOwnerSearchComponent from "~/components/search/KoiOwnerSearchComponent";
import AccountVerificationAlert from "~/components/shared/AccountVerificationAlert";
import { CrudButton } from "~/components/shared/CrudButtonComponent";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { useAuth } from "~/contexts/AuthContext";
import { environment } from "~/environments/environment";
import { useUserData } from "~/hooks/useUserData";
import { KoiDetailModel } from "~/types/kois.type";
import { fetchKoisOfBreeder, formatDate, sendOtp } from "~/utils/apiUtils";
import { getCookie } from "~/utils/cookieUtils";
import { extractErrorMessage } from "~/utils/dataConverter";
import "./BreederDetail.scss";
import ScrollToTop from "react-scroll-to-top";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import UserDetailDialog from "../member/UserDetailDialog";
import { formatCurrency } from "~/utils/currencyUtils";
import AccountTransactionComponent from "~/components/shared/AccountTransactionComponent";

export type KoiOfBreederQueryParams = {
  breeder_id: number;
  page: number;
  limit: number;
};

export type KoiOfBreeder = {
  total_page: number;
  total_item: number;
  item: KoiDetailModel[];
};

const BreederDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [kois, setKois] = useState<KoiDetailModel[]>([]);
  const [totalKoi, setTotalKoi] = useState(0); // State to hold total koi count
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true); // To track if more pages are available
  const itemsPerPage = 16; // Number of koi per page
  const [updateField, setUpdateField] = useState("");
  const [updateValue, setUpdateValue] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { user, loading, error, setUser } = useUserData();
  const userId = getCookie("user_id");
  const accessToken = getCookie("access_token");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [openModal, setOpenModal] = useState(false); // Modal state for showing user details
  const [showAbout, setShowAbout] = useState(true);
  const handleSearchStateChange = (isActive: boolean) => {
    setIsSearchActive(isActive);
  };
  const toggleAbout = () => setShowAbout(!showAbout);

  // Close the modal
  const handleClose = () => {
    setOpenModal(false);
  };

  const fetchKoiData = async () => {
    if (!userId || !accessToken) return;

    try {
      const API_URL =
        import.meta.env.VITE_API_BASE_URL + environment.be.apiPrefix;
      const response = await fetchKoisOfBreeder(
        parseInt(userId),
        currentPage - 1,
        itemsPerPage,
        accessToken,
      );

      if (response) {
        setKois(response.item);
        setTotalKoi(response.total_item);
        setHasMorePages(response.item.length === itemsPerPage);
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        "Failed to fetch koi data",
      );
      toast.error(errorMessage);
      console.error("Không thể lấy dữ liệu cá Koi:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userId && accessToken) {
      fetchKoiData();
    }
  }, [currentPage, isLoggedIn, userId, accessToken]);

  const handleUpdate = async () => {
    if (!user || !updateField || !updateValue) return;

    const accessToken = getCookie("access_token");
    if (!accessToken) {
      navigate("/notfound");
      return;
    }

    try {
      const API_URL =
        import.meta.env.VITE_API_BASE_URL + environment.be.apiPrefix;
      const response = await axios.put(
        `${API_URL}/users/${user.id}`,
        { [updateField]: updateValue },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 200) {
        setUser({ ...user, [updateField]: updateValue });
        setUpdateField("");
        setUpdateValue("");
        alert("User information updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update user data:", error);
      alert("Failed to update user information. Please try again.");
    }
  };

  const handleVerify = async () => {
    if (!user) return;

    //send api request to send otp
    //PUT: /api/v1/users/verify/:otp
    const response = await sendOtp(user.email);

    if (response.status == 200) {
      navigate("/otp-verification", {
        state: {
          email: user.email,
          from: "breederDetail",
          statusCode: 200,
        },
      });
    } else {
      alert("Failed to send OTP");
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page); // Update the current page when pagination changes
  };

  if (loading) return <LoadingComponent />;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found</div>;

  const renderCrudButtons = (koi: KoiDetailModel) => (
    <>
      <CrudButton
        onClick={() => handleEdit(koi.id)}
        ariaLabel="Edit"
        svgPath="edit.svg"
      />
      <CrudButton
        onClick={() => handleDelete(koi.id)}
        ariaLabel="Delete"
        svgPath="delete.svg"
      />
    </>
  );

  const handleEdit = (id: number) => {
    navigate(`/kois/${id}`);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this koi?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v1/kois/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 200) {
        toast.success("Your Koi deleted successfully");
        setCurrentPage(1);
        fetchKoiData();
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error, "Failed to delete koi.");
      toast.error(errorMessage);
    }
  };

  const handleTransactionSuccess = () => {
    fetchKoiData();
    toast.success("Transaction request sent successfully");
  };

  return (
    <div className="container mx-auto">
      <AccountVerificationAlert user={user} />
      <div className="grid grid-cols-1 md:grid-cols-3 m-10 border-4 border-gray-500 rounded-xl transition-du bg-white hover:shadow-lg shadow-sm">
        <div className=" rounded-lg flex flex-col justify-around">
          <div className="flex flex-col p-6 items-center border-r">
            <img
              src={user.avatar_url}
              alt={`${user.first_name} ${user.last_name}`}
            />
            <div className="flex items-center justify-center gap-5">
              <p className="text-gray-600">{user.status_name} </p>
              <CrudButton ariaLabel="Approve" svgPath="approve.svg" />
            </div>
            {user.status_name !== "VERIFIED" && (
              <button
                onClick={handleVerify}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
                Verify Account
              </button>
            )}
          </div>

          <div className="pl-6 pb-6 space-y-4 border-2">
            <div>
              <h2 className="text-lg font-bold">Email</h2>
              <p className="text-xl ">{user.email}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold">Phone Number</h2>
              <p className="text-xl ">{user.phone_number || "Not provided"}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold">Address</h2>
              <p className="text-xl ">{user.address || "Not provided"}</p>
            </div>
            <div>
              <p className="text-lg font-bold ">Total Koi</p>
              <p className="text-xl ">{totalKoi}</p>{" "}
            </div>
          </div>
        </div>

        {/* Display total number of koi */}
        <div className=" md:col-span-2 rounded-lg">
          <div className="flex justify-between items-center m-3">
            <Typography variant="h3">
              {user.first_name} {user.last_name}
            </Typography>
            <FontAwesomeIcon
              icon={faEdit}
              onClick={handleUpdate}
              className="text-2xl text-gray-400 hover:cursor-pointer"
            />
          </div>
          <div className="flex justify-start items-center gap-3 m-3">
            <Typography variant="h5">5/5</Typography>
            <Rating name="read-only" value={5} readOnly />
          </div>
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center gap-5">
              <p className="text-xl font-bold">Account Balance:</p>
              <p className="text-3xl text-green-600 font-bold">
                {user.account_balance !== null
                  ? formatCurrency(user.account_balance)
                  : "No money"}
              </p>
            </div>
            <AccountTransactionComponent
              userId={user.id}
              token={getCookie("access_token") || ""}
              onTransactionSuccess={handleTransactionSuccess}
            />
          </div>

          {/* About Button */}
          <div className="text-left">
            <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
            <Button onClick={toggleAbout} variant="text" color="inherit">
              About
            </Button>
            <Divider variant="fullWidth" />
          </div>

          {/* Conditionally render the About section */}
          {showAbout && (
            <div className="mt-6 space-y-4 m-3">
              <div className="flex gap-5 justify-between ">
                <h2 className="text-lg font-bold">Date of Birth</h2>
                <p>{user.date_of_birth || "Not Provided"}</p>
              </div>
              <div className="flex gap-5 justify-between ">
                <h2 className="text-lg font-bold">Created At</h2>
                <p>{formatDate(user.created_at || "")}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for showing fetched user data */}
      <UserDetailDialog openModal={openModal} handleClose={handleClose} />
      <div>
        <Typography variant="h5" sx={{ marginTop: "2rem", marginLeft: "1rem" }}>
          Search your koi here
        </Typography>
        <KoiOwnerSearchComponent
          onSearchStateChange={handleSearchStateChange}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          renderActions={renderCrudButtons}
        />
      </div>
      <ScrollToTop smooth />
    </div>
  );
};

export default BreederDetail;
