import { AddressSelection } from "~/types/orders.type";

export const parseAddressString = (addressString: string): AddressSelection => {
  try {
    // Expected format: "street_address, ward, district, province"
    const parts = addressString.split(", ");
    return {
      street_address: parts[0] || "",
      ward: parts[1] || "",
      ward_code: "",
      district: parts[2] || "",
      district_code: "",
      province: parts[3] || "",
      province_code: "",
    };
  } catch (error) {
    return {
      street_address: "",
      ward: "",
      ward_code: "",
      district: "",
      district_code: "",
      province: "",
      province_code: "",
    };
  }
};

export const formatAddressToString = (address: AddressSelection): string => {
  return `${address.street_address}, ${address.ward}, ${address.district}, ${address.province}`.trim();
};
