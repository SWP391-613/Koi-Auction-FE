import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "~/utils/cookieUtils";
import { useNavigate } from "react-router-dom";
import { UserDetailsResponse } from "~/types/users.type";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { fetchUserDetails } from "~/apis/user.apis";

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
        const response = await fetchUserDetails();
        if (response) {
          setUser(response);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        setError(errorMessage);
        console.log("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  return { user, loading, error, setUser };
};
