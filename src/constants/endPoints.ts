export const API_URL = "http://localhost:8088/api/v1";

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
  BASE: "http://localhost:4000/api/v1/staffs",
} as const;
