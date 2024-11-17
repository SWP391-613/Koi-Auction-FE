import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "~/utils/cookieUtils";
import { useNavigate } from "react-router-dom";
import { UserDetailsResponse } from "~/types/users.type";
import { API_URL_DEPLOYMENT } from "~/constants/endPoints";

export const useUserData = () => {
  const [user, setUser] = useState<UserDetailsResponse | null>(null);
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
          `${API_URL_DEPLOYMENT}/users/details`,
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
