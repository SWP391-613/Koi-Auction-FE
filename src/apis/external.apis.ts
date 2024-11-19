import axios from "axios";

export type BankListResponseType = {
  code: string;
  desc: string;
  data: Bank[];
};

export type Bank = {
  id: number;
  bin: string;
  code: string;
  isTransfer: number;
  logo: string;
  lookupSupport: number;
  name: string;
  shortName: string;
  short_name: string;
  support: number;
  swift_code: string;
  transferSupported: number;
};

export const fetchBankList = async (): Promise<BankListResponseType> => {
  try {
    const response = await axios.get("https://api.vietqr.io/v2/banks");
    return response.data;
  } catch (error) {
    console.error("Failed to load banks list", error);
    throw new Error("Failed to load banks list");
  }
};
