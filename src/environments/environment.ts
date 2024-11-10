export const environment: any = {
  production: import.meta.env.PROD, // This will be true in production and false in development
  be: {
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000", // Default to localhost:4000 for development
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
