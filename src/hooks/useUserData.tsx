import axios from "axios";
import { useQuery } from "react-query";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { ApiResponse } from "~/types/api.type";
import { UserBase } from "~/types/users.type";
import { getUserCookieToken } from "~/utils/auth.utils";

const fetchUserDetails = async () => {
  const response = await axios.post<ApiResponse<UserBase>>(
    `${DYNAMIC_API_URL}/auth/details`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getUserCookieToken()}`,
      },
    },
  );
  return response.data.data;
};

const useUserDetail = () => {
  return useQuery<UserBase>({
    queryKey: "userDetails",
    queryFn: fetchUserDetails,
  });
};

export default useUserDetail;
