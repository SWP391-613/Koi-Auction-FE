import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./BreederDetail.scss";
import { getCookie } from "~/utils/cookieUtils";
import axios from "axios";
import { environment } from "~/environments/environment";
import { fetchKoisOfBreeder } from "~/utils/apiUtils";
import KoiCart from "../kois/KoiCart";
import { Button, Typography } from "@mui/material";
import PaginationComponent from "~/components/pagination/Pagination";
import { useAuth } from "~/contexts/AuthContext";
import { useUserData } from "~/contexts/useUserData";
import DepositComponent from "~/components/shared/DepositComponent";
import AccountVerificationAlert from "~/components/shared/AccountVerificationAlert";
import { KoiDetailModel } from "~/types/kois.type";
import KoiList from "../manager/koi/KoiManagement";
import Loading from "~/components/loading/Loading";
import KoiCreatePopup from "~/components/shared/KoiCreatePopup";
import { extractErrorMessage } from "~/utils/dataConverter";
import { toast } from "react-toastify";
import { CrudButton } from "~/components/shared/CrudButtonComponent";

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

  const handleVerify = () => {
    if (!user) return;
    navigate("/otp-verification", {
      state: {
        email: user.email,
        from: "userDetail",
        statusCode: 200,
      },
    });
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page); // Update the current page when pagination changes
  };

  if (loading) return <Loading />;
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
    <div className="flex flex-col justify-around m-10">
      <AccountVerificationAlert user={user} />
      <div className="flex border bg-[#F1F1F1] rounded-2xl">
        <div className="flex flex-col justify-start items-center p-5 w-[20rem]">
          <img
            src={user.avatar_url}
            alt={`${user.first_name} ${user.last_name}`}
            className="user-avatar"
          />
          <h1 className="user-name">
            {user.first_name} {user.last_name}
          </h1>
          <p className="user-status">{user.status_name}</p>
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
                color="primary"
                variant="contained"
                onClick={handleRegisterKoiToAuction}
              >
                Register to Auction
              </Button>
            </div>
          )}
        </div>
        <div className="user-main">
          <div className="user-info-grid">
            <div className="info-item">
              <p className="info-label">Email</p>
              <p className="info-value">{user.email}</p>
            </div>
            <div className="info-item">
              <p className="info-label">Phone</p>
              <p className="info-value">
                {user.phone_number || "Not provided"}
              </p>
            </div>
            <div className="info-item">
              <p className="info-label">Address</p>
              <p className="info-value">{user.address || "Not provided"}</p>
            </div>
            <div className="info-item">
              <p className="info-label">Total Koi</p>
              <p className="info-value">{totalKoi}</p>{" "}
              {/* Display total number of koi */}
            </div>
          </div>
          <div className="account-balance">
            <p className="balance-label">Account Balance</p>
            <p className="balance-value">${user.account_balance.toFixed(2)}</p>
            <DepositComponent userId={user.id} token={accessToken || ""} />
          </div>
          <div className="update-field">
            <select
              value={updateField}
              onChange={(e) => setUpdateField(e.target.value)}
              className="update-select"
            >
              <option value="">Select field to update</option>
              <option value="first_name">First Name</option>
              <option value="last_name">Last Name</option>
              <option value="email">Email</option>
              <option value="phone_number">Phone</option>
              <option value="address">Address</option>
            </select>
            <input
              type="text"
              value={updateValue}
              onChange={(e) => setUpdateValue(e.target.value)}
              placeholder="Enter new value"
              className="update-input"
            />
            <Button
              color="warning"
              variant="contained"
              onClick={handleUpdate}
              className="update-button"
            >
              Update
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <KoiCart
          items={kois}
          handleView={() => {}}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          renderCrudButtons={renderCrudButtons}
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
