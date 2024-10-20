import { Button, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PaginationComponent from "~/components/common/PaginationComponent";
import KoiBreederViewGrid from "~/components/search/KoiBreederViewGrid";
import KoiSearchComponent from "~/components/search/KoiSearchComponent";
import AccountVerificationAlert from "~/components/shared/AccountVerificationAlert";
import { CrudButton } from "~/components/shared/CrudButtonComponent";
import DepositComponent from "~/components/shared/DepositComponent";
import KoiCreatePopup from "~/components/shared/KoiCreatePopup";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { useAuth } from "~/contexts/AuthContext";
import { environment } from "~/environments/environment";
import { useUserData } from "~/hooks/useUserData";
import { KoiDetailModel } from "~/types/kois.type";
import { fetchKoisOfBreeder, sendOtp } from "~/utils/apiUtils";
import { getCookie } from "~/utils/cookieUtils";
import { extractErrorMessage } from "~/utils/dataConverter";
import "./BreederDetail.scss";

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
  const [createPopupOpen, setCreatePopupOpen] = useState(false);
  const userId = getCookie("user_id");
  const accessToken = getCookie("access_token");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const handleSearchStateChange = (isActive: boolean) => {
    setIsSearchActive(isActive);
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
        setTotalKoi(response.item.length);
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

  const handleCreate = () => {
    setCreatePopupOpen(true);
  };

  const handleKoiCreated = () => {
    setCreatePopupOpen(false);
    setCurrentPage(1);
    fetchKoiData(); // Fetch the updated koi list
  };

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

  const handleRegisterKoiToAuction = () => {
    navigate("/auctions/register");
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
        toast.success("Koi deleted successfully");
        setCurrentPage(1);
        fetchKoiData();
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error, "Failed to delete koi.");
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col justify-around mt-5">
      <AccountVerificationAlert user={user} />
      <div>
        <Typography
          variant="h4"
          sx={{ marginBottom: "1rem" }}
          component="h1"
          className="text-left"
        >
          Breeder Detail
        </Typography>
      </div>
      <div className="flex border bg-[#F1F1F1] rounded-2xl">
        <div className="flex p-5 flex-col justify-center gap-5 items-center w-[20rem]">
          <img
            src={user.avatar_url}
            alt={`${user.first_name} ${user.last_name}`}
            className="user-avatar"
          />
          <h1 className="text-2xl font-bold text-center mb-2">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-green-600 font-semibold">
            {user.status_name == "VERIFIED" ? "Your Account is Verified" : ""}
          </p>
          {user.status_name !== "VERIFIED" && (
            <button onClick={handleVerify} className="verify-button">
              Verify User
            </button>
          )}
          {user.status_name === "VERIFIED" && (
            <div className="flex flex-col gap-4 mt-4">
              <Button
                color="success"
                variant="contained"
                onClick={handleCreate}
              >
                Add New Koi
              </Button>
              <Button
                color="error"
                variant="contained"
                sx={{ marginTop: "" }}
                onClick={handleRegisterKoiToAuction}
              >
                Register to Auction
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 justify-between p-7 bg-white">
          <div className="grid grid-cols-2 gap-2">
            <div className="">
              <p className="text-2xl font-bold">Full Name</p>
              <p className="text-xl">{user.first_name + user.last_name}</p>
            </div>
            <div className="">
              <p className="text-2xl font-bold">Email</p>
              <p className="text-xl">{user.email}</p>
            </div>
            <div className="">
              <p className="text-2xl font-bold">Date Of Birth</p>
              <p className="text-xl">
                {user.date_of_birth === null
                  ? user.date_of_birth
                  : "Not Provided"}
              </p>
            </div>
            <div className="">
              <p className="text-2xl font-bold">Phone</p>
              <p className="text-xl">{user.phone_number || "Not provided"}</p>
            </div>
            <div className="">
              <p className="text-2xl font-bold">Address</p>
              <p className="text-xl">{user.address || "Not provided"}</p>
            </div>
            <div className="">
              <p className="text-2xl font-bold ">Total Koi</p>
              <p className="text-xl ">{totalKoi}</p>{" "}
              {/* Display total number of koi */}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 flex flex-col justify-between p-10 text-center rounded-r-2xl">
          <p className="text-2xl font-bold text-black mb-2">Account Balance</p>
          <p className="text-2xl font-bold text-green-600">
            ${user.account_balance.toFixed(2)}
          </p>
          <DepositComponent userId={user.id} token={accessToken || ""} />
        </div>
      </div>
      <KoiSearchComponent onSearchStateChange={handleSearchStateChange} />
      <div className="mt-5">
        <KoiBreederViewGrid
          kois={kois}
          handleView={() => {}}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          renderActions={renderCrudButtons}
        />
      </div>
      <PaginationComponent
        totalPages={hasMorePages ? currentPage + 1 : currentPage} // Handle pagination with dynamic totalPages
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <KoiCreatePopup
        open={createPopupOpen}
        onClose={() => setCreatePopupOpen(false)}
        onSuccess={handleKoiCreated}
        owner_id={user.id}
      />
    </div>
  );
};

export default BreederDetail;
