export interface Province {
  code: string;
  name: string;
}

export interface District {
  code: string;
  name: string;
}

export interface Ward {
  code: string;
  name: string;
}

export interface AddressSelection {
  province: string;
  province_code: string;
  district: string;
  district_code: string;
  ward: string;
  ward_code: string;
  street_address: string;
}

export interface ShippingFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  selectedAddress: AddressSelection;
  shippingMethod: "Standard" | "Express";
}

// Add constants for pricing
export const SHIPPING_PRICES = {
  standard: 500000, // 500.000 VND
  express: 1000000, // 1.000.000 VND
};
