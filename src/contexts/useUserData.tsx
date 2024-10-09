import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "~/utils/cookieUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  emails: string;
  address: string;
  is_active: number;
  is_subscription: number;
  status_name: string;
  date_of_birth: string | null;
  avatar_url: string;
  google_account_id: number;
  role_name: string;
  account_balance: number;
  created_at: string | null;
  updated_at: string | null;
}

const API_URL = "http://localhost:4000/api/v1";

export const useUserData = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = getCookie("access_token");

      if (!accessToken) {
        // Allow viewing without login
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          `${API_URL}/users/details`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (response.status === 200) {
          setUser(response.data);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "An error occurred");
        } else {
          setError("An unexpected error occurred");
        }
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  return { user, loading, error, setUser };
};
