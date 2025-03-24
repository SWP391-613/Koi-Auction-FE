export const environment: any = {
  production: import.meta.env.PROD, // This will be true in production and false in development
  be: {
    baseUrl:
      import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1", // Default to localhost:4000 for development
    mockUrl:
      import.meta.env.VITE_API_MOCK_URL ?? "http://localhost:3000/api_mock",
    apiPrefix: "/api/v1",
    endPoint: {
      login: "/login",
      register: "/register",
      auctions: "/auctions",
      kois: "/kois",
      bidding: "/bidding",
      orders: "/orders",
      socket: "/auction-websocket",
    },
  },
};

export const API_URL = {
  BASE:
    process.env.NODE_ENV === "development"
      ? (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1")
      : (import.meta.env.VITE_API_MOCK_URL ?? "http://localhost:8080/api_mock"),
} as const;
