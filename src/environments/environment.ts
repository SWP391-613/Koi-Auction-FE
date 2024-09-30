export const environment: any = {
  production: false,
  be: {
    baseUrl: "http://localhost:4000",
    apiPrefix: "/api/v1",
    endPoint: {
      login: "/login",
      register: "/register",
      auctions: "/auctions",
      kois: "/kois",
    },
  },
  //websocket
  ws: {
    baseUrl: "ws://localhost:4000",
    apiPrefix: "/ws",
  },
};
