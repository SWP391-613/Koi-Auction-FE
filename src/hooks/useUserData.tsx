import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "~/apis/user.apis";
import { UserDetailsResponse } from "~/types/users.type";
import { getUserCookieToken } from "~/utils/auth.utils";

export const useUserData = () => {
  const [user, setUser] = useState<UserDetailsResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!getUserCookieToken()) {
        // Allow viewing without login
        setLoading(false);
        return;
      }

      try {
        const response = await userApi.fetchUserDetails();
        if (response?.data) {
          setUser(response.data);
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
