import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./BreederDetail.scss";
import { getCookie } from "~/utils/cookieUtils";
import axios from "axios";
import { environment } from "~/environments/environment";
import { fetchKoisOfBreeder } from "~/utils/apiUtils";
import KoiCart from "../kois/KoiCart";
import { Typography } from "@mui/material";
import PaginationComponent from "~/components/pagination/Pagination";
import { useAuth } from "~/contexts/AuthContext";
import { useUserData } from "~/contexts/useUserData";
import DepositComponent from "~/components/shared/DepositComponent";
import AccountVerificationAlert from "~/components/shared/AccountVerificationAlert";
import { KoiDetailModel } from "~/types/kois.type";
import KoiList from "../manager/koi/KoiManagement";

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

  useEffect(() => {
    const fetchBreederAndKoi = async () => {
      if (!user) return;

      try {
        const koisOfBreederData = await fetchKoisOfBreeder(
          user.id,
          currentPage - 1,
          itemsPerPage,
        );

        if (koisOfBreederData) {
          if (koisOfBreederData.item.length < itemsPerPage) {
            setHasMorePages(false);
          }
          setKois((prevKois) => [...prevKois, ...koisOfBreederData.item]);
        }
      } catch (error) {
        console.error("Failed to fetch koi data:", error);
      }
    };

    if (isLoggedIn && user) {
      fetchBreederAndKoi();
    }
  }, [currentPage, isLoggedIn, user]);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found</div>;

  const accessToken = getCookie("access_token");
  if (!accessToken) {
    navigate("/notfound");
  }

  const handleView = (id: number) => {
    navigate(`/kois/${id}`);
  };

  const handleEdit = (id: number) => {
    alert(`Edit koi ${id}`);
  };

  const handleDelete = (id: number) => {
    alert(`Delete koi ${id}`);
  };

  return (
    <div className="flex flex-col justify-around m-10">
      <AccountVerificationAlert user={user} />
      <div className="user-detail-content">
        <div className="user-sidebar">
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
          {/* <div className="account-balance">
            <p className="balance-label">Total Koi</p>
            <p className="balance-value">Hehe {koisOfBreed  er?.total_item.toFixed(2)}</p>
          </div> */}
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
            <button onClick={handleUpdate} className="update-button">
              Update
            </button>
          </div>
        </div>
      </div>
      <div>
        {/* Render KoiCart with the fetched koi items */}
        <KoiCart
          items={kois}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      <PaginationComponent
        totalPages={hasMorePages ? currentPage + 1 : currentPage} // Handle pagination with dynamic totalPages
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default BreederDetail;
