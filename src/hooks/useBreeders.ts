import axios from "axios";
import { useQuery } from "react-query";
import { API_URL } from "~/environments/environment";
import { ApiResponse } from "~/types/api.type";
import { UserBase } from "~/types/users.type";

export type BreederRes = ApiResponse<
  {
    user_response: UserBase;
    koi_count: number;
  }[]
>;

export type BreederData = {
  user_response: UserBase;
  koi_count: number;
}[];

// const url = `${DYNAMIC_API_URL}/breeders`;

// const fetchAllBreeders = async () => {
//   const response = await axios.get<BreederRes>(`${DYNAMIC_API_URL}/breeders`, {
//     params: {
//       page: 0,
//       limit: 20,
//     },
//   });
//   return response.data.data;
// };

const mockUrl = "/api_mock/breeders";

const fetchAllBreeders = async () => {
  const response = await axios.get<BreederRes>(`${API_URL.BASE}/breeders`);
  return response.data.data;
};

const useBreeders = () => {
  return useQuery<BreederData>({
    queryKey: ["breeders"],
    queryFn: fetchAllBreeders,
  });
};

export default useBreeders;
