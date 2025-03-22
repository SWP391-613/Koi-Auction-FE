import axios from "axios";
import { useQuery } from "react-query";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { ApiResponse } from "~/types/api.type";
import { Breeder, UserBase } from "~/types/users.type";

type BreederRes = ApiResponse<
  {
    user_response: UserBase;
    koi_count: number;
  }[]
>;

type BreederData = {
  user_response: UserBase;
  koi_count: number;
}[];

const fetchAllBreeders = async () => {
  const response = await axios.get<BreederRes>(`${DYNAMIC_API_URL}/breeders`, {
    params: {
      page: 0,
      limit: 20,
    },
  });
  return response.data.data;
};

const useBreeders = () => {
  return useQuery<BreederData>({
    queryKey: ["breeders"],
    queryFn: fetchAllBreeders,
  });
};

export default useBreeders;
