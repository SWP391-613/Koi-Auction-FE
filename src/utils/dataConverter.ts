import { AuctionModel } from "~/types/auctions.type";
import { convertToJavaLocalDateTime } from "./dateTimeUtils";
import axios from "axios";
import { KoiDetailModel } from "~/types/kois.type";
import { BreedersResponse } from "~/types/users.type";

export const convertBidMethodToReadable = (method: string) => {
  //convert from FIXED_PRICE to Fixed Price, all caps to first letter caps, and remove the underscore
  return method
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const prepareAuctionData = (auction: AuctionModel) => ({
  title: auction.title,
  start_time: convertToJavaLocalDateTime(auction.start_time),
  end_time: convertToJavaLocalDateTime(auction.end_time),
  status: auction.status,
  auctioneer_id: auction.auctioneer_id,
});

export const extractErrorMessage = (
  error: unknown,
  defaultMessage: string,
): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || defaultMessage;
  } else if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};

export const createFormData = (
  koiData: Partial<KoiDetailModel>,
  koiImage: File | null,
): FormData => {
  const formData = new FormData();
  Object.keys(koiData).forEach((key) => {
    formData.append(
      key,
      koiData[key as keyof Partial<KoiDetailModel>]?.toString() || "",
    );
  });
  if (koiImage) {
    formData.append("image", koiImage);
  }
  return formData;
};

const categoryMap: Record<number, string> = {
  1: "Kohaku",
  2: "Taisho Sanke",
  3: "Showa Sanshoku",
  4: "Utsurimono",
  5: "Shiro Utsuri",
  6: "Hi Utsuri",
  7: "Ki Utsuri",
  8: "Asagi",
  9: "Shusui",
  10: "Bekko",
  11: "Tancho",
  12: "Ginrin Kohaku",
  13: "Ginrin Sanke",
  14: "Ginrin Showa",
  15: "Doitsu Kohaku",
  16: "Doitsu Sanke",
  17: "Doitsu Showa",
  18: "Kin Kikokuryu",
  19: "Kumonryu",
  20: "Ochiba Shigure",
};

export const getCategoryName = (categoryId: number): string => {
  return categoryMap[categoryId] || "Unknown Category"; // Return "Unknown Category" if ID not found
};
