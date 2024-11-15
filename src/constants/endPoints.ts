export const API_URL =
  "https://koi-auction-be-az-dtarcyafdhc2gcen.southeastasia-01.azurewebsites.net/api/v1";

export const ROUTING_PATH = {
  MANAGERS_HOME: "/managers",
  MANAGERS_KOI: "/managers/koi",
  MANAGERS_AUCTIONS: "/managers/auctions",
  MANAGERS_BREEDER: "/managers/breeder",
  MANAGERS_MEMBER: "/managers/member",
  MANAGERS_STAFF: "/managers/staff",
  MANAGERS_SETTING: "/managers/setting",
} as const;

export const ENDPOINT_STAFFS = {
  BASE: "https://koi-auction-be-az-dtarcyafdhc2gcen.southeastasia-01.azurewebsites.net/api/v1/staffs",
} as const;
