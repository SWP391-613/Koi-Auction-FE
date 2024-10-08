import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./BreederDetail.scss";
import { getCookie } from "~/utils/cookieUtils";
import axios from "axios";
import { environment } from "~/environments/environment";
import { KoiDetailModel } from "../kois/Kois";
import { fetchKoisOfBreeder } from "~/utils/apiUtils";
import KoiCart from "../kois/KoiCart";
import { Typography } from "@mui/material";
import PaginationComponent from "~/components/pagination/Pagination";
import { useAuth } from "~/contexts/AuthContext";

interface Status {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  email: string;
  address: string;
  password: string | null;
  is_active: number;
  is_subscription: number;
  status_name: string;
  date_of_birth: string | null;
  avatar_url: string;
  google_account_id: number;
  role_name: string;
  account_balance: number;
}

export type KoiOfBreederQueryParams = {
  breeder_id: number;
  page: number;
  limit: number;
};

export type KoiOfBreeder = {
  total_page: number;
  total_item: number;
  items: KoiDetailModel[];
};

const BreederDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [kois, setKois] = useState<KoiDetailModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true); // To track if more pages are available
  const itemsPerPage = 16; // Number of koi per page
  const [updateField, setUpdateField] = useState("");
  const [updateValue, setUpdateValue] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchBreederAndKoi = async () => {
      // Lấy access_token từ cookie

      const accessToken = getCookie("access_token");

      // Nếu không có access_token thì điều hướng đến trang /notfound
      if (!accessToken) {
        navigate("/notfound");
        return;
      }

      try {
        const API_URL =
          import.meta.env.VITE_API_BASE_URL + environment.be.apiPrefix;
        const response = await axios.post(
          `${API_URL}/users/details`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        const userData: User = response.data;
        console.log(userData);
        setUser(userData);

        if (userData) {
          const koisOfBreederData = await fetchKoisOfBreeder(
            userData.id,
            currentPage - 1,
            itemsPerPage,
          );

          if (koisOfBreederData) {
            // Check if there are more pages
            if (koisOfBreederData.items.length < itemsPerPage) {
              setHasMorePages(false);
            }

            // Append the new koi data to the current list of kois
            setKois((prevKois) => [...prevKois, ...koisOfBreederData.items]);
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error response:", error.response?.data);
          console.error("Error status:", error.response?.status);
        }
        console.error("Failed to fetch user data:", error);
        navigate("/notfound");
      }
    };

    if (isLoggedIn) {
      fetchBreederAndKoi();
    }
  }, [currentPage, navigate]);

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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-detail-page">
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
              <p className="info-label">Status</p>
              <p className="info-value">{user.status_name}</p>
            </div>
          </div>
          {/* <div className="account-balance">
            <p className="balance-label">Total Koi</p>
            <p className="balance-value">Hehe {koisOfBreeder?.total_item.toFixed(2)}</p>
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
        <Typography variant="h2" className="text-center">
          My Kois
        </Typography>
        {/* Render KoiCart with the fetched koi items */}
        <KoiCart items={kois} />
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